import { useState } from 'react'
import { Check, Clock, Copy, MapPin, Truck } from 'lucide-react'
import { Notice } from '@/shared/components/Workspace'
import { bookingReference } from '@/entities/booking/bookingReference'
import { formatMoney, statusLabels, type Booking } from './api'
import { bookingTimeLabel } from './time'

/** Compact payment information for the reservation flow; amounts remain server-owned. */
export function QuickBookingPaymentSummary({ booking, expired }: { booking: Booking; expired: boolean }) {
  const [copyNotice, setCopyNotice] = useState('')
  const final = booking.status === 'AWAITING_FINAL_PAYMENT'
  const amount = final && booking.totalAmount != null
    ? Math.max(0, booking.totalAmount - booking.advanceDeposit)
    : final ? null : booking.advanceDeposit
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(bookingReference(booking))
      setCopyNotice(final ? 'Đã sao chép mã đặt chỗ' : 'Đã sao chép số đơn')
    } catch { setCopyNotice('Không thể sao chép. Bạn có thể chọn mã vé để sao chép.') }
  }
  return <section aria-label="Thông tin vé chờ thanh toán" className="overflow-hidden rounded-xl border border-brand-border">
    <div className="space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800"><Clock size={13} aria-hidden="true"/>{statusLabels[booking.status]}</span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold"><Truck size={15} className="text-brand-muted" aria-hidden="true"/>{booking.vehiclePlate || 'Chưa có biển số'}</span>
      </div>
      <div className="flex items-start gap-2 text-sm"><MapPin size={16} className="mt-0.5 shrink-0 text-brand-primary" aria-hidden="true"/><div className="min-w-0"><h3 className="font-semibold">{booking.parkingLotName || `Bãi đỗ #${booking.parkingLotId}`}</h3>{booking.parkingLotAddress && <p className="mt-0.5 truncate text-xs text-brand-muted" title={booking.parkingLotAddress}>{booking.parkingLotAddress}</p>}</div></div>
      <dl className="grid grid-cols-2 gap-3 text-xs">
        <div><dt className="text-brand-muted">Giờ vào dự kiến</dt><dd className="mt-1 font-medium leading-relaxed">{bookingTimeLabel(booking.expectedCheckInTime)}</dd></div>
        <div><dt className="text-brand-muted">Giờ ra dự kiến</dt><dd className="mt-1 font-medium leading-relaxed">{bookingTimeLabel(booking.expectedCheckOutTime)}</dd></div>
      </dl>
    </div>
    <div className="border-y border-brand-border bg-brand-surface px-4 py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">{final ? 'Còn cần thanh toán' : 'Tiền cọc cần thanh toán'}</p><strong className="font-sora text-2xl font-semibold tracking-tight text-brand-primary">{amount == null ? 'Chưa có' : formatMoney(amount)}</strong></div>
      <p className="mt-1 text-xs text-brand-muted">{final ? 'Tổng phí lượt đỗ' : 'Phí đỗ dự kiến'}: <span className="font-medium text-brand-navy">{booking.totalAmount == null ? 'Chưa có' : formatMoney(booking.totalAmount)}</span>{final && <> · Đã cọc {formatMoney(booking.advanceDeposit)}</>}</p>
      {!final && !expired && <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-brand-muted"><Clock size={13} className="mt-0.5 shrink-0" aria-hidden="true"/><span>Thanh toán cọc trước <strong className="font-medium text-brand-navy">{bookingTimeLabel(booking.expiresAt)}</strong></span></p>}
      {!final && expired && <div className="mt-3"><Notice error>Đã quá hạn thanh toán. Đang chờ server cập nhật trạng thái hết hạn; không thanh toán thêm cho đơn này.</Notice></div>}
    </div>
    <div className="flex min-w-0 items-center gap-2 px-4 py-2.5 text-xs">
      <span className="shrink-0 text-brand-muted">{final ? 'Mã vé' : 'Số đơn'}</span>
      <span className="min-w-0 flex-1 truncate font-mono">{bookingReference(booking)}</span>
      <button type="button" aria-label={final ? 'Sao chép mã đặt chỗ' : 'Sao chép số đơn'} title={final ? 'Sao chép mã đặt chỗ' : 'Sao chép số đơn'} onClick={() => void copyCode()} className="shrink-0 rounded-lg p-2 text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-primary">
        {copyNotice.startsWith('Đã') ? <Check size={14} aria-hidden="true"/> : <Copy size={14} aria-hidden="true"/>}
      </button>
    </div>
    {!final && <p className="px-4 pb-3 text-xs leading-relaxed text-brand-muted">Mã check-in và QR sẽ hiển thị sau khi xác nhận thanh toán cọc.</p>}
    {copyNotice && <p role="status" className="px-4 pb-3 text-xs text-brand-muted">{copyNotice}</p>}
  </section>
}
