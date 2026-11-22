import { useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Field, Notice, button, control, secondary } from '@/shared/components/Workspace'
import { Select, type SelectOption } from '@/shared/components/Select'
import { errorMessage } from '@/shared/api/resources'
import { fetchLot, fetchVehicles, createBooking, formatMoney } from './api'
import { BookingStatusPanel } from './BookingStatusPanel'
import { BookingHoldRestrictionNotice, useBookingHoldRestriction } from './BookingHoldRestrictionNotice'
import { bookingTimestamp, bookingEnd, nextBookingStart, isBookingBlock } from './time'
import { fetchAvailability, fetchTimeline } from './availability'
import { BookingAvailabilityTimeline } from './BookingAvailabilityTimeline'
import { BookingTimeSelector } from './BookingTimeSelector'

const schema=z.object({
  vehicleId:z.coerce.number().int().positive('Chọn phương tiện của bạn.'),
  start:z.string().refine(isBookingBlock,'Giờ vào phải là giờ tròn hoặc giờ rưỡi.'),
  end:z.string(),
  minutes:z.number({invalid_type_error:'Vui lòng nhập thời lượng đỗ.',required_error:'Vui lòng nhập thời lượng đỗ.'})
    .finite('Thời lượng không hợp lệ.').int('Thời lượng phải là số phút nguyên.')
    .min(30,'Đặt tối thiểu 30 phút.').multipleOf(30,'Thời lượng phải là bội số 30 phút.'),
  physicalSlotId:z.string(),
}).superRefine((data,context)=>{
  if(bookingTimestamp(data.start)<=Date.now())context.addIssue({code:'custom',path:['start'],message:'Giờ vào phải ở tương lai.'})
  if(Number.isInteger(data.minutes)&&data.minutes>=30&&data.minutes%30===0){
    if(!isBookingBlock(data.end))context.addIssue({code:'custom',path:['end'],message:'Giờ ra phải là giờ tròn hoặc giờ rưỡi.'})
    else if(bookingTimestamp(data.end)<=bookingTimestamp(data.start))context.addIssue({code:'custom',path:['end'],message:'Giờ ra phải sau giờ vào.'})
  }
})
type Values=z.infer<typeof schema>
export function ReservationFlow({lotId}:{lotId:number}) {
  const cache=useQueryClient()
  const lot=useQuery({queryKey:['reservable-lot',lotId],queryFn:()=>fetchLot(lotId),retry:false})
  const vehicles=useQuery({queryKey:['booking-vehicles'],queryFn:fetchVehicles,retry:false})
  const [bookingId,setBookingId]=useState<number|null>(null)
  const [initialStart]=useState(nextBookingStart)
  const form=useForm<Values>({resolver:zodResolver(schema),defaultValues:{vehicleId:0,start:initialStart,end:bookingEnd(initialStart,120),minutes:120,physicalSlotId:''}})
  useEffect(()=>{if(vehicles.data?.length&&!form.getValues('vehicleId'))form.setValue('vehicleId',vehicles.data[0].id)},[vehicles.data,form])
  const vehicleOptions=useMemo<SelectOption[]>(()=>(vehicles.data??[]).map(vehicle=>({value:String(vehicle.id),label:`${vehicle.licensePlate} · ${({SEDAN_SUV:'Ô tô con',BUS_COACH:'Xe khách',LIGHT_TRUCK:'Xe tải nhẹ',HEAVY_TRUCK:'Xe tải nặng',CONTAINER:'Xe container'})[vehicle.vehicleType]}`})),[vehicles.data])
  const values=form.watch()
  const selected=vehicles.data?.find(vehicle=>vehicle.id===Number(values.vehicleId))
  const tariff=lot.data?.pricingRules.find(price=>price.vehicleType===selected?.vehicleType)
  const slot=lot.data?.slots.find(item=>item.vehicleType===selected?.vehicleType)
  const validWindow=isBookingBlock(values.start)&&isBookingBlock(values.end)&&values.minutes>=30&&values.minutes%30===0&&bookingTimestamp(values.end)>bookingTimestamp(values.start)
  const enabled=Boolean(selected&&slot&&tariff&&lot.data?.status==='APPROVED'&&bookingId===null)
  const available=useQuery({
    queryKey:['booking-availability',lotId,selected?.vehicleType,values.start,values.end],
    queryFn:({signal})=>fetchAvailability({lotId,vehicleType:selected!.vehicleType,start:values.start,end:values.end},signal),
    enabled:enabled&&validWindow,refetchInterval:15000,retry:false,
  })
  const timelineStartDay=values.start.slice(0,10)
  // Checkout is exclusive: leaving at midnight does not occupy the next day.
  const timelineEndDay=validWindow?bookingEnd(values.end,-30).slice(0,10):timelineStartDay
  const timeline=useInfiniteQuery({
    queryKey:['booking-timeline',lotId,selected?.vehicleType,timelineStartDay,timelineEndDay,values.physicalSlotId],
    initialPageParam:timelineStartDay,
    queryFn:({pageParam,signal})=>fetchTimeline(lotId,selected!.vehicleType,pageParam,values.physicalSlotId,signal),
    getNextPageParam:(_last,_pages,lastDay)=>{
      const nextDay=bookingEnd(`${lastDay}T00:00`,1440).slice(0,10)
      return nextDay&&nextDay<=timelineEndDay?nextDay:undefined
    },
    enabled:enabled&&/^\d{4}-\d{2}-\d{2}$/.test(values.start.slice(0,10)),refetchInterval:15000,retry:false,
  })
  const {fetchNextPage,hasNextPage,isFetchingNextPage,isError:timelineError}=timeline
  const timelinePageCount=timeline.data?.pages.length
  useEffect(()=>{
    // Load the overnight continuation automatically. Longer stays can load one
    // further day at a time, without creating an unbounded burst of API calls.
    if(timelinePageCount===1&&hasNextPage&&!isFetchingNextPage&&!timelineError)void fetchNextPage()
  },[timelinePageCount,hasNextPage,isFetchingNextPage,timelineError,fetchNextPage])
  const timelineData=timeline.data?{...timeline.data.pages[0],blocks:timeline.data.pages.flatMap(page=>page.blocks).filter(block=>
    block.start.slice(0,10)===timelineStartDay||
    (bookingTimestamp(block.start)>=bookingTimestamp(values.start)&&bookingTimestamp(block.start)<bookingTimestamp(values.end)))}:undefined
  const refreshSchedule=()=>{void cache.invalidateQueries({queryKey:['booking-availability',lotId]});void cache.invalidateQueries({queryKey:['booking-timeline',lotId]})}
  const save=useMutation({mutationFn:async(input:Values)=>{
    const vehicle=vehicles.data?.find(item=>item.id===Number(input.vehicleId))
    if(!vehicle)throw new Error('Vui lòng chọn xe đã đăng ký.')
    const key=`booking-intent:${lotId}:${input.vehicleId}:${input.start}:${input.end}:${input.physicalSlotId}`
    let requestId=sessionStorage.getItem(key)
    if(!requestId){requestId=crypto.randomUUID();sessionStorage.setItem(key,requestId)}
    return createBooking({parkingLotId:lotId,vehicleId:vehicle.id,vehicleType:vehicle.vehicleType,expectedCheckInTime:`${input.start}:00`,expectedCheckOutTime:`${input.end}:00`,physicalSlotId:input.physicalSlotId||undefined,requestId})
  },onSuccess:data=>{
    cache.setQueryData(['booking',data.id],data);setBookingId(data.id)
    void cache.invalidateQueries({queryKey:['real-bookings']});void cache.invalidateQueries({queryKey:['parking-lots-search']});refreshSchedule()
  },onError:refreshSchedule})
  const holdRestriction=useBookingHoldRestriction(save.error)
  const changeStart=(start:string)=>{form.setValue('start',start,{shouldValidate:true});form.setValue('end',bookingEnd(start,form.getValues('minutes')),{shouldValidate:true});form.setValue('physicalSlotId','')}
  const changeDuration=(minutes:number)=>{form.setValue('minutes',minutes,{shouldValidate:true});form.setValue('end',bookingEnd(form.getValues('start'),minutes),{shouldValidate:true});form.setValue('physicalSlotId','')}
  if(bookingId!==null)return <BookingStatusPanel bookingId={bookingId} compact/>
  if(lot.isPending||vehicles.isPending)return <p role="status">Đang tải bãi và phương tiện…</p>
  if(lot.isError||vehicles.isError)return <Notice error><div>{errorMessage(lot.error??vehicles.error)}<button type="button" className={`${secondary} mt-3`} onClick={()=>{void lot.refetch();void vehicles.refetch()}}>Thử lại</button></div></Notice>
  if(!vehicles.data?.length)return <Notice><div>Bạn chưa có phương tiện đang hoạt động.<Link to="/vehicles" className={`${secondary} mt-3`}>Đăng ký phương tiện</Link></div></Notice>
  const schedulePolicy = available.data ?? timelineData
  const earlyCheckInMinutes = schedulePolicy?.checkInEarlyMinutes ?? 0
  const blocked=lot.data.status!=='APPROVED'||!tariff||!slot
  const selectedSlotValid=!values.physicalSlotId||available.data?.slots.some(item=>item.id===values.physicalSlotId)
  const ready=validWindow&&bookingTimestamp(values.start)>Date.now()&&!available.isError&&!available.isFetching&&Boolean(available.data&&available.data.remainingCapacity>0)&&selectedSlotValid
  return <form noValidate onSubmit={form.handleSubmit(input=>{if(ready&&!blocked&&!holdRestriction.blocked&&!save.isPending)save.mutate(input)})} className="min-w-0 space-y-4 font-inter text-sm text-brand-navy">
    <div className="rounded-xl border border-brand-border bg-brand-surface px-4 py-3"><h3 className="font-sora text-base font-semibold">{lot.data.name}</h3><p className="mt-1 text-xs leading-relaxed text-brand-muted">{lot.data.address}</p></div>
    <fieldset className="grid min-w-0 gap-4 sm:grid-cols-2" disabled={save.isPending}>
      <legend className="sr-only">Phương tiện và giờ đỗ (giờ Việt Nam UTC+7)</legend>
      <div className="sm:col-span-2"><Field label="Phương tiện của bạn"><Select id="vehicleId" value={String(values.vehicleId||'')}
        onChange={value=>{form.setValue('vehicleId',Number(value),{shouldValidate:true});form.setValue('physicalSlotId','')}} options={vehicleOptions}
        placeholder="Chọn phương tiện của bạn..." variant="default" size="md" ariaLabel="Phương tiện của bạn" triggerAriaHidden/></Field></div>
      <BookingTimeSelector start={values.start} minutes={values.minutes} onStartChange={changeStart} onDurationChange={changeDuration}
        arrivalBlocks={timeline.data?.pages[0].blocks}/>
    </fieldset>
    {Object.entries(form.formState.errors).map(([key,error])=><p role="alert" key={key} className="text-sm text-red-700">{error.message}</p>)}
    {!blocked&&<>
      <BookingAvailabilityTimeline data={timelineData} loading={timeline.isPending} error={timeline.isError?errorMessage(timeline.error):undefined}
        start={values.start} end={values.end} disabled={save.isPending} onSelect={changeStart} onRetry={()=>void timeline.refetch()}
        hasMore={hasNextPage} loadingMore={isFetchingNextPage} onLoadNext={()=>void fetchNextPage()}/>
      {available.isError?<Notice error><p>{errorMessage(available.error)}</p><button type="button" className={secondary} onClick={()=>void available.refetch()}>Kiểm tra lại khung giờ</button></Notice>:
        available.isFetching?<p role="status">Đang kiểm tra toàn bộ khung giờ…</p>:
        validWindow&&available.data&&<p role="status" className={available.data.remainingCapacity>0?'text-emerald-800':'text-red-700'}>{available.data.remainingCapacity>0?`Có ${available.data.remainingCapacity} chỗ phù hợp trống suốt khung giờ đã chọn.`:'Không có chỗ trống suốt khung giờ đã chọn. Chọn giờ hoặc ngày khác.'}</p>}
      {available.data?.allocationMode==='PHYSICAL'&&<Field label="Ô đỗ"><select className={control} {...form.register('physicalSlotId')} disabled={available.isFetching||save.isPending}>
        <option value="">Tự chọn ô phù hợp</option>{available.data.slots.map(item=><option key={item.id} value={item.id}>{item.code}</option>)}
      </select></Field>}
    </>}
    <p className="text-xs leading-5 text-brand-muted">Giờ Việt Nam (UTC+7) · Hai lượt liên tiếp cùng ô cách nhau tối thiểu 30 phút.
      {schedulePolicy && (earlyCheckInMinutes > 0
        ? ` Có thể vào sớm tối đa ${earlyCheckInMinutes} phút nếu chỗ đã sẵn sàng.`
        : ' Check-in từ giờ đã đặt.')}</p>
    {tariff&&<div className="overflow-hidden rounded-xl border border-brand-border text-sm">
      <dl className="grid grid-cols-2 gap-3 bg-brand-surface p-3.5"><div><dt className="text-xs text-brand-muted">Giá cơ bản</dt><dd className="mt-1 font-semibold">{formatMoney(Number(tariff.basePricePerHour))}/giờ</dd></div><div><dt className="text-xs text-brand-muted">Cọc giữ chỗ</dt><dd className="mt-1 font-semibold">20% phí dự kiến</dd></div></dl>
      <div className="space-y-1.5 p-3.5 text-xs leading-relaxed text-brand-muted">
        <p>Phí đỗ tính từ lúc xe vào bãi theo mỗi giờ bắt đầu. Đặt 30 phút vẫn tính tối thiểu 1 giờ.</p>
        <p>Giờ cao điểm: ×{tariff.surgeMultiplier} {tariff.surgeStartTime&&tariff.surgeEndTime?`(${tariff.surgeStartTime.slice(0,5)} – ${tariff.surgeEndTime.slice(0,5)})`:'(chưa cấu hình khung giờ)'}.</p>
        <p>Sau giờ ra dự kiến: ×{tariff.overtimePenaltyMultiplier} cho phần quá giờ, tính theo block 30 phút.</p>
        <p>Thanh toán cọc trong <strong>15 phút</strong> kể từ lúc tạo booking.</p>
      </div>
    </div>}
    {blocked&&<Notice error>Bãi chưa nhận đặt chỗ hoặc chưa cấu hình sức chứa/bảng giá cho loại xe này.</Notice>}
    {save.isError&&<BookingHoldRestrictionNotice error={save.error}/>}
    <div className="sticky bottom-0 z-20 -mx-4 -mb-4 bg-white/95 backdrop-blur-md p-4 border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:static md:mx-0 md:mb-0 md:p-0 md:bg-transparent md:border-0 md:shadow-none space-y-2">
      <button className={`${button} w-full min-h-12 text-sm font-semibold shadow-xs`} disabled={blocked||!ready||timeline.isError||save.isPending||holdRestriction.blocked}>
        {save.isPending?'Đang xác minh và giữ chỗ…':holdRestriction.blocked?`Có thể thử lại sau ${holdRestriction.remaining}`:'Tạo booking và xem tiền cọc'}
      </button>
      <p className="text-center text-xs leading-relaxed text-brand-muted">Tiền cọc chính xác hiển thị ở bước tiếp theo, trước khi thanh toán. Giá và lịch trống được xác minh lại khi đặt.</p>
    </div>
  </form>
}
