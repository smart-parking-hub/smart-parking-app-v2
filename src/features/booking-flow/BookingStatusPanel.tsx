import { useState } from 'react'
import { bookingTimestamp, bookingTimeLabel } from './time'
import { BookingReview } from './BookingReview'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Notice, button, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { fetchBooking, paymentLink, payDemo, cancelBooking, formatMoney, statusLabels, type Booking } from './api'

export function BookingStatusPanel({ bookingId, booking }: { bookingId: number; booking?: Booking }) {
  const cache = useQueryClient()
  const [copied, setCopied] = useState(false)
  const query = useQuery({ queryKey: ['booking', bookingId], queryFn: () => fetchBooking(bookingId), enabled: !booking, refetchInterval: query => !booking && ['PENDING_PAYMENT', 'PENDING_CHECKIN', 'PARKING', 'OVERTIME', 'AWAITING_FINAL_PAYMENT'].includes(query.state.data?.status ?? '') ? 3000 : false, retry: false })
  const refresh = async () => { await Promise.all([cache.invalidateQueries({ queryKey: ['booking', bookingId] }), cache.invalidateQueries({ queryKey: ['real-bookings'] }), cache.invalidateQueries({ queryKey: ['parking-lots-search'] })]) }
  const payment = useMutation({ mutationFn: () => paymentLink(bookingId, query.data?.status === 'AWAITING_FINAL_PAYMENT'), onSuccess: url => window.location.assign(url) })
  const demo = useMutation({ mutationFn: () => payDemo(bookingId), onSuccess: refresh })
  const cancel = useMutation({ mutationFn: () => cancelBooking(bookingId), onSuccess: refresh })
  if (!booking && query.isPending) return <p role="status">Đang lấy trạng thái booking…</p>
  if (!booking && query.isError) return <Notice error><div>{errorMessage(query.error)}<button className={`${secondary} mt-3`} onClick={() => void query.refetch()}>Thử lại</button></div></Notice>
  const data = booking ?? query.data
  if (!data) return <p role="status">Đang lấy trạng thái booking…</p>
  const expired = bookingTimestamp(data.expiresAt) <= Date.now()
  const payable = (data.status === 'PENDING_PAYMENT' && !expired) || data.status === 'AWAITING_FINAL_PAYMENT'
  const busy = payment.isPending || demo.isPending || cancel.isPending
  return <div className="space-y-5 text-base text-brand-navy">
    <p role="status" className="font-semibold">{statusLabels[data.status]}</p>
    <dl className="grid gap-4 sm:grid-cols-2">
      <div><dt className="text-sm text-brand-muted">Mã đặt chỗ</dt><dd className="break-all font-semibold">{data.bookingCode}</dd></div>
      <div><dt className="text-sm text-brand-muted">Phương tiện</dt><dd>{data.vehiclePlate}</dd></div>
      <div><dt className="text-sm text-brand-muted">Phí dự kiến / Phí quyết toán</dt><dd>{data.totalAmount == null ? 'Chưa có' : formatMoney(data.totalAmount)}</dd></div>
      <div><dt className="text-sm text-brand-muted">Cọc theo booking</dt><dd>{formatMoney(data.advanceDeposit)}</dd></div>
      {data.status === 'AWAITING_FINAL_PAYMENT' && data.totalAmount != null && <div><dt className="text-sm text-brand-muted">Còn phải thanh toán</dt><dd>{formatMoney(Math.max(0, data.totalAmount - data.advanceDeposit))}</dd></div>}
    </dl>
    {data.status === 'PENDING_PAYMENT' && <Notice>{expired ? 'Đã quá hạn thanh toán. Đang chờ server cập nhật trạng thái hết hạn; không thanh toán thêm cho đơn này.' : `Thanh toán cọc trước ${bookingTimeLabel(data.expiresAt)}. Chưa thanh toán thì chưa được check-in.`}</Notice>}
    {data.status === 'PENDING_CHECKIN' && <Notice>Đã xác nhận cọc. Chỉ được check-in từ {bookingTimeLabel(bookingTimestamp(data.expectedCheckInTime) - 30 * 60000)} đến {bookingTimeLabel(data.expiresAt)}. Đưa mã đặt chỗ cho nhân viên bãi.</Notice>}
    <p className="text-sm text-brand-muted">Quá giờ ra dự kiến: ×{data.overtimePenaltyMultiplier ?? 1} trên phí phần quá giờ. Mỗi phần tính theo giờ bắt đầu; hệ số giờ cao điểm ×{data.surgeMultiplier ?? 1} trong khung đã công bố của bãi.</p>
    <div className="flex flex-wrap gap-3">
      {payable && <button className={button} disabled={busy} onClick={() => payment.mutate()}>{payment.isPending ? 'Đang mở thanh toán…' : data.status === 'AWAITING_FINAL_PAYMENT' ? 'Thanh toán phần còn lại qua PayOS' : `Thanh toán cọc ${formatMoney(data.advanceDeposit)} qua PayOS`}</button>}
      {import.meta.env.DEV && data.status === 'PENDING_PAYMENT' && !expired && <button className={secondary} disabled={busy} onClick={() => demo.mutate()}>Thanh toán Demo (chỉ local)</button>}
      {['PENDING_PAYMENT', 'PENDING_CHECKIN'].includes(data.status) && <button className={secondary} disabled={busy} onClick={() => cancel.mutate()}>Hủy booking</button>}
      {data.status === 'PENDING_CHECKIN' && <button className={secondary} onClick={() => { void navigator.clipboard.writeText(data.bookingCode).then(() => setCopied(true)) }}>{copied ? 'Đã sao chép' : 'Sao chép mã check-in'}</button>}
      <Link className={secondary} to="/bookings">Xem các lượt đặt chỗ</Link>
    </div>
    {data.status === 'COMPLETED' && <BookingReview bookingId={data.id}/>}
    {demo.isSuccess && data.status === 'PENDING_PAYMENT' && <Notice>Đã gửi thanh toán Demo. Đang kiểm tra xác nhận từ server; không bấm tạo giao dịch khác.</Notice>}
    {[payment.error, demo.error, cancel.error].filter(Boolean).map((error, index) => <Notice key={index} error>{errorMessage(error)}</Notice>)}
  </div>
}
