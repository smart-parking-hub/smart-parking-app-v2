import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Navigation, QrCode, Truck } from 'lucide-react'
import { Badge, button, money, secondary } from '@/shared/components/Workspace'
import { bookingReference } from '@/entities/booking/bookingReference'
import { canShowCheckoutQr, dashboardTime, isParking, parkingDuration, ticketAction, ticketUrl } from '../lib/dashboardBooking'
import type { BookingDto } from '../types/driverTypes'

export function ActiveTripCard({ booking, onOpenQr }: { booking?: BookingDto; onOpenQr: () => void }) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (!booking || !isParking(booking)) return
    const timer = window.setInterval(() => setNow(Date.now()), 60000)
    return () => window.clearInterval(timer)
  }, [booking])
  if (!booking) return <section className="mb-6 rounded-xl border border-brand-border bg-white p-8 text-center">
    <Truck size={32} className="mx-auto mb-3 text-brand-muted" aria-hidden="true" />
    <h2 className="font-sora text-lg font-semibold">Chưa có chuyến đỗ nào đang hoạt động</h2>
    <p className="my-3 text-sm text-brand-muted">Tìm bãi đỗ hoặc xem lại các lượt đặt chỗ của bạn.</p>
    <Link className={button} to="/parking">Tìm bãi đỗ</Link>
  </section>

  const parked = isParking(booking)
  const pending = booking.status === 'PENDING_PAYMENT'
  return <section aria-label="Chuyến đỗ đang chọn" className="mb-6 overflow-hidden rounded-xl border border-brand-border bg-white">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border bg-brand-surface px-5 py-4 lg:px-6">
      <h2 className="flex items-center gap-2 font-sora text-base font-semibold"><Truck size={20} className="text-brand-primary" aria-hidden="true" />Chuyến đỗ đang hoạt động</h2>
      <div className="flex min-w-0 flex-wrap items-center gap-2"><Badge value={booking.status} />
        <span className="min-w-0 break-all rounded-lg border border-brand-border bg-white px-3 py-1 font-mono text-xs">{pending ? 'Số đơn' : 'Mã vé'}: {bookingReference(booking)}</span>
      </div>
    </header>
    <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:p-6">
      <div className="min-w-0 space-y-5">
        <div className="flex items-start gap-3"><MapPin size={21} className="mt-1 shrink-0 text-brand-primary" aria-hidden="true" />
          <div><h3 className="font-sora text-xl font-semibold">{booking.parkingLotName || 'Chưa có tên bãi'}</h3>
            <p className="mt-2 text-sm text-brand-muted">{booking.parkingLotAddress || 'Chưa có địa chỉ bãi'}</p></div>
        </div>
        <dl className="grid gap-4 rounded-xl border border-brand-border bg-brand-surface p-4 text-sm sm:grid-cols-2">
          <div><dt className="text-brand-muted">Biển số xe</dt><dd className="mt-1 font-mono font-semibold">{booking.vehicleLicensePlate || 'Chưa có thông tin'}</dd></div>
          <div><dt className="text-brand-muted">Vị trí đỗ</dt><dd className="mt-1 font-semibold">{booking.physicalSlotCode || 'Chưa được phân vị trí'}</dd></div>
          <div><dt className="text-brand-muted">Giờ vào dự kiến</dt><dd className="mt-1">{dashboardTime(booking.expectedCheckInTime)}</dd></div>
          <div><dt className="text-brand-muted">Giờ ra dự kiến</dt><dd className="mt-1">{dashboardTime(booking.expectedCheckOutTime)}</dd></div>
          <div><dt className="text-brand-muted">Giờ vào thực tế</dt><dd className="mt-1">{booking.checkInTime ? dashboardTime(booking.checkInTime) : 'Chưa check-in'}</dd></div>
          <div><dt className="text-brand-muted">Thời gian đỗ</dt><dd className="mt-1">{booking.checkInTime ? parkingDuration(booking, now) : 'Chưa bắt đầu'}</dd></div>
        </dl>
        {booking.parkingLotAddress && <a className={secondary} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${booking.parkingLotName} ${booking.parkingLotAddress}`)}`} target="_blank" rel="noreferrer"><Navigation size={16} aria-hidden="true" />Chỉ đường tới bãi</a>}
      </div>
      <div className="flex flex-col justify-between gap-5 rounded-xl border border-brand-border bg-brand-surface p-5">
        <dl className="space-y-4 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-brand-muted">Đơn giá theo giờ</dt><dd className="font-semibold">{money(booking.hourlyRate)} / giờ</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-brand-muted">{pending ? 'Tiền cọc cần thanh toán' : 'Tiền cọc của vé'}</dt><dd className="font-semibold">{money(booking.depositAmount)}</dd></div>
          <div className="flex justify-between gap-3 border-t border-brand-border pt-4"><dt className="font-medium">{booking.status === 'AWAITING_FINAL_PAYMENT' ? 'Tổng phí quyết toán' : 'Phí đỗ dự kiến'}</dt><dd className="text-lg font-bold">{money(booking.totalPrice)}</dd></div>
          {booking.status === 'AWAITING_FINAL_PAYMENT' && <div className="flex justify-between gap-3"><dt>Còn phải thanh toán</dt><dd className="font-bold text-brand-primary">{money(booking.remainingAmount)}</dd></div>}
        </dl>
        <div className="space-y-3">
          <p className="text-sm leading-6 text-brand-muted">{pending ? 'Vé đang chờ thanh toán cọc. Mã check-in và QR sẽ hiển thị sau khi máy chủ xác nhận cọc.' : parked ? 'Xuất trình đúng mã vé của chuyến này tại cổng ra. Phí cuối cùng do máy chủ quyết toán.' : booking.status === 'PENDING_CHECKIN' ? 'Đã xác nhận cọc. Mở vé để xem QR và khung giờ check-in hợp lệ.' : 'Mở vé để kiểm tra phí và hoàn tất thanh toán.'}</p>
          {canShowCheckoutQr(booking)
            ? <button type="button" className={`${button} w-full`} onClick={onOpenQr}><QrCode size={17} aria-hidden="true" />Mã QR xuất bãi</button>
            : <Link className={`${button} w-full`} to={ticketUrl(booking)}>{ticketAction(booking)}</Link>}
          <Link className={`${secondary} w-full`} to={ticketUrl(booking)}>Xem chi tiết vé</Link>
        </div>
      </div>
    </div>
  </section>
}
