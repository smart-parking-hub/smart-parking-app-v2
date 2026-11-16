import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { bookingTimestamp, vietnamLocalTime } from './time'
const schema = z.object({ vehicleId: z.coerce.number().int().positive('Chọn phương tiện của bạn.'), start: z.string().min(1), end: z.string().min(1) }).superRefine((data, context) => {
  if (!Number.isFinite(bookingTimestamp(data.start)) || bookingTimestamp(data.start) <= Date.now()) context.addIssue({ code: 'custom', path:['start'], message:'Giờ vào phải ở tương lai.' })
  if (!Number.isFinite(bookingTimestamp(data.end)) || bookingTimestamp(data.end) <= bookingTimestamp(data.start)) context.addIssue({ code:'custom', path:['end'], message:'Giờ ra phải sau giờ vào.' })
})
type Values = z.infer<typeof schema>
export function ReservationFlow({ lotId }: { lotId: number }) {
  const cache = useQueryClient()
  const lot = useQuery({ queryKey:['reservable-lot',lotId],queryFn:()=>fetchLot(lotId),retry:false })
  const vehicles = useQuery({ queryKey:['booking-vehicles'],queryFn:fetchVehicles,retry:false })
  const [bookingId,setBookingId] = useState<number | null>(null)
  const form = useForm<Values>({ resolver:zodResolver(schema),defaultValues:{vehicleId:0,start:vietnamLocalTime(30),end:vietnamLocalTime(150)} })
  useEffect(()=>{ if(vehicles.data?.length && !form.getValues('vehicleId')) form.setValue('vehicleId',vehicles.data[0].id) },[vehicles.data,form])
  const vehicleOptions = useMemo<SelectOption[]>(() => {
    return (vehicles.data ?? []).map(vehicle => ({
      value: String(vehicle.id),
      label: `${vehicle.licensePlate} · ${({SEDAN_SUV:'Ô tô con',BUS_COACH:'Xe khách',LIGHT_TRUCK:'Xe tải nhẹ',HEAVY_TRUCK:'Xe tải nặng',CONTAINER:'Xe container'})[vehicle.vehicleType]}`,
    }))
  }, [vehicles.data])
  const selected = vehicles.data?.find(vehicle=>vehicle.id===Number(form.watch('vehicleId')))
  const tariff = lot.data?.pricingRules.find(price=>price.vehicleType===selected?.vehicleType)
  const slot = lot.data?.slots.find(slot=>slot.vehicleType===selected?.vehicleType)
  const save = useMutation({ mutationFn:async (values:Values)=>{
    const vehicle=vehicles.data?.find(vehicle=>vehicle.id===Number(values.vehicleId))
    if(!vehicle)throw new Error('Vui lòng chọn xe đã đăng ký.')
    const key=`booking-intent:${lotId}:${values.vehicleId}:${values.start}:${values.end}`
    let requestId=sessionStorage.getItem(key)
    if(!requestId){requestId=crypto.randomUUID();sessionStorage.setItem(key,requestId)}
    return createBooking({parkingLotId:lotId,vehicleId:vehicle.id,vehicleType:vehicle.vehicleType,expectedCheckInTime:`${values.start}:00`,expectedCheckOutTime:`${values.end}:00`,requestId})
  },onSuccess:data=>{
    cache.setQueryData(['booking',data.id],data);setBookingId(data.id)
    void cache.invalidateQueries({queryKey:['real-bookings']});void cache.invalidateQueries({queryKey:['parking-lots-search']})
  }})
  const holdRestriction = useBookingHoldRestriction(save.error)
  if(bookingId!==null)return <BookingStatusPanel bookingId={bookingId} compact/>
  if(lot.isPending||vehicles.isPending)return <p role="status">Đang tải bãi và phương tiện…</p>
  if(lot.isError||vehicles.isError)return <Notice error><div>{errorMessage(lot.error??vehicles.error)}<button className={`${secondary} mt-3`} onClick={()=>{void lot.refetch();void vehicles.refetch()}}>Thử lại</button></div></Notice>
  if(!vehicles.data?.length)return <Notice><div>Bạn chưa có phương tiện đang hoạt động.<Link to="/vehicles" className={`${secondary} mt-3`}>Đăng ký phương tiện</Link></div></Notice>
  const blocked=lot.data.status!=='APPROVED'||!tariff||!slot||Number(slot.availableCapacity)<=0
  return <form noValidate onSubmit={form.handleSubmit(values=>{if(!holdRestriction.blocked&&!save.isPending)save.mutate(values)})} className="space-y-4 font-inter text-sm text-brand-navy">
    <div className="rounded-xl border border-brand-border bg-brand-surface px-4 py-3"><h3 className="font-sora text-base font-semibold">{lot.data.name}</h3><p className="mt-1 text-xs leading-relaxed text-brand-muted">{lot.data.address}</p></div>
    <fieldset className="grid gap-4 sm:grid-cols-2" disabled={save.isPending}>
      <legend className="sr-only">Phương tiện và giờ đỗ (giờ Việt Nam UTC+7)</legend>
      <div className="sm:col-span-2">
        <Field label="Phương tiện của bạn">
          <Select
            id="vehicleId"
            value={String(form.watch('vehicleId') || '')}
            onChange={(val) => form.setValue('vehicleId', Number(val), { shouldValidate: true })}
            options={vehicleOptions}
            placeholder="Chọn phương tiện của bạn..."
            variant="default"
            size="md"
            ariaLabel="Phương tiện của bạn"
            triggerAriaHidden
          />
        </Field>
      </div>
      <Field label="Giờ vào dự kiến"><input type="datetime-local" className={control} {...form.register('start')}/></Field>
      <Field label="Giờ ra dự kiến"><input type="datetime-local" className={control} {...form.register('end')}/></Field>
    </fieldset>
    {Object.entries(form.formState.errors).map(([key,error])=><p role="alert" key={key} className="text-sm text-red-700">{error.message}</p>)}
    <p className="text-xs text-brand-muted">Giờ Việt Nam (UTC+7) · Chỉ dùng xe đã đăng ký thuộc tài khoản của bạn.</p>
    {tariff&&<div className="overflow-hidden rounded-xl border border-brand-border text-sm">
      <dl className="grid grid-cols-2 gap-3 bg-brand-surface p-3.5">
        <div><dt className="text-xs text-brand-muted">Giá cơ bản</dt><dd className="mt-1 font-semibold">{formatMoney(Number(tariff.basePricePerHour))}/giờ</dd></div>
        <div><dt className="text-xs text-brand-muted">Cọc giữ chỗ</dt><dd className="mt-1 font-semibold">20% phí dự kiến</dd></div>
      </dl>
      <div className="space-y-1.5 p-3.5 text-xs leading-relaxed text-brand-muted">
        <p>Giờ cao điểm: ×{tariff.surgeMultiplier} {tariff.surgeStartTime&&tariff.surgeEndTime?`(${tariff.surgeStartTime.slice(0,5)} – ${tariff.surgeEndTime.slice(0,5)})`:'(chưa cấu hình khung giờ)'}.</p>
        <p>Sau giờ ra dự kiến: <strong className="text-brand-navy">×{tariff.overtimePenaltyMultiplier}</strong> cho phần quá giờ. Mỗi phần tính theo giờ bắt đầu.</p>
        <p>Thanh toán cọc trong <strong className="text-brand-navy">15 phút</strong> kể từ lúc tạo booking · Check-in sớm tối đa <strong className="text-brand-navy">30 phút</strong>.</p>
      </div>
    </div>}
    {blocked&&<Notice error>Bãi chưa nhận đặt chỗ, hết chỗ cho loại xe đã chọn hoặc chưa có bảng giá. Chọn xe/bãi khác.</Notice>}
    {save.isError&&<BookingHoldRestrictionNotice error={save.error}/>}
    <button className={`${button} w-full`} disabled={blocked||save.isPending||holdRestriction.blocked}>{save.isPending?'Đang xác minh và giữ chỗ…':holdRestriction.blocked?`Có thể thử lại sau ${holdRestriction.remaining}`:'Tạo booking và xem tiền cọc'}</button>
    <p className="text-center text-xs leading-relaxed text-brand-muted">Tiền cọc chính xác hiển thị ở bước tiếp theo, trước khi thanh toán. Giá và chỗ trống được xác minh khi đặt.</p>
  </form>
}
