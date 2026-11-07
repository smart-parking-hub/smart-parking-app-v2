import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Field, Notice, button, control, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { fetchLot, fetchVehicles, createBooking, formatMoney } from './api'
import { BookingStatusPanel } from './BookingStatusPanel'
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
  if(bookingId!==null)return <BookingStatusPanel bookingId={bookingId}/>
  if(lot.isPending||vehicles.isPending)return <p role="status">Đang tải bãi và phương tiện…</p>
  if(lot.isError||vehicles.isError)return <Notice error><div>{errorMessage(lot.error??vehicles.error)}<button className={`${secondary} mt-3`} onClick={()=>{void lot.refetch();void vehicles.refetch()}}>Thử lại</button></div></Notice>
  if(!vehicles.data?.length)return <Notice><div>Bạn chưa có phương tiện đang hoạt động.<Link to="/vehicles" className={`${secondary} mt-3`}>Đăng ký phương tiện</Link></div></Notice>
  const blocked=lot.data.status!=='APPROVED'||!tariff||!slot||Number(slot.availableCapacity)<=0
  return <form noValidate onSubmit={form.handleSubmit(values=>save.mutate(values))} className="space-y-5 font-inter text-base text-brand-navy">
    <div><h2 className="font-sora text-xl font-semibold">Đặt chỗ tại {lot.data.name}</h2><p className="mt-2 text-brand-muted">{lot.data.address}</p></div>
    <fieldset className="grid gap-4 sm:grid-cols-2" disabled={save.isPending}>
      <legend className="sr-only">Phương tiện và giờ đỗ (giờ Việt Nam UTC+7)</legend>
      <Field label="Phương tiện của bạn"><select className={control} {...form.register('vehicleId')}>{vehicles.data.map(vehicle=><option key={vehicle.id} value={vehicle.id}>{vehicle.licensePlate} · {vehicle.vehicleType}</option>)}</select></Field>
      <div className="text-sm text-brand-muted">Giờ Việt Nam (UTC+7). Chỉ chọn xe thuộc tài khoản và đúng loại xe bãi tiếp nhận.</div>
      <Field label="Giờ vào dự kiến"><input type="datetime-local" className={control} {...form.register('start')}/></Field>
      <Field label="Giờ ra dự kiến"><input type="datetime-local" className={control} {...form.register('end')}/></Field>
    </fieldset>
    {Object.entries(form.formState.errors).map(([key,error])=><p role="alert" key={key} className="text-sm text-red-700">{error.message}</p>)}
    {tariff&&<div className="rounded-xl border border-brand-border bg-brand-surface p-4 text-sm leading-7">
      <p>Giá cơ bản: <strong>{formatMoney(Number(tariff.basePricePerHour))}/giờ</strong>.</p>
      <p>Giờ cao điểm: ×{tariff.surgeMultiplier} {tariff.surgeStartTime&&tariff.surgeEndTime?`(${tariff.surgeStartTime} – ${tariff.surgeEndTime})`:'(chưa cấu hình khung giờ)'}.</p>
      <p>Sau giờ ra dự kiến: <strong>×{tariff.overtimePenaltyMultiplier}</strong> cho phần quá giờ. Mỗi phần tính theo giờ bắt đầu.</p>
      <p>Cọc <strong>20%</strong> phí dự kiến do server tính. Thanh toán trong <strong>15 phút</strong> kể từ lúc tạo booking. Chỉ được check-in sớm tối đa <strong>30 phút</strong>.</p>
    </div>}
    {blocked&&<Notice error>Bãi chưa nhận đặt chỗ, hết chỗ cho loại xe đã chọn hoặc chưa có bảng giá. Chọn xe/bãi khác.</Notice>}
    {save.isError&&<Notice error>{errorMessage(save.error)}</Notice>}
    <button className={button} disabled={blocked||save.isPending}>{save.isPending?'Đang xác minh và giữ slot…':'Tạo booking và xem tiền cọc'}</button>
    <p className="text-sm text-brand-muted">Giá và sức chứa được xác minh lại khi tạo booking. Bước tiếp theo hiển thị tiền cọc chính xác trước khi bạn thanh toán.</p>
  </form>
}
