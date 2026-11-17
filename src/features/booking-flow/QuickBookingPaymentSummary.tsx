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
  return <section aria-label="Thông tin vé chờ thanh toán" className="@container min-w-0 space-y-4">
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800"><Clock size={13} aria-hidden="true"/>{statusLabels[booking.status]}</span>
        <div className="flex min-w-0 items-center gap-1 text-xs text-brand-muted">
          <span className="shrink-0">{final ? 'Mã vé' : 'Số đơn'}</span>
          <span className="max-w-40 truncate font-mono text-brand-navy" title={bookingReference(booking)}>{bookingReference(booking)}</span>
          <button type="button" aria-label={final ? 'Sao chép mã đặt chỗ' : 'Sao chép số đơn'} title={final ? 'Sao chép mã đặt chỗ' : 'Sao chép số đơn'} onClick={() => void copyCode()} className="grid size-9 shrink-0 place-items-center rounded-lg transition-colors hover:bg-brand-surface hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-primary">
            {copyNotice.startsWith('Đã') ? <Check size={14} aria-hidden="true"/> : <Copy size={14} aria-hidden="true"/>}
          </button>
        </div>
      </div>
      <div className="grid gap-4 @xl:grid-cols-[1.2fr_1fr] @xl:items-center">
        <div className="min-w-0 space-y-3">
          <div className="flex items-start gap-3"><MapPin size={19} className="mt-0.5 shrink-0 text-brand-primary" aria-hidden="true"/><div className="min-w-0"><h3 className="text-base font-semibold leading-6">{booking.parkingLotName || `Bãi đỗ #${booking.parkingLotId}`}</h3>{booking.parkingLotAddress && <p className="mt-1 break-words text-xs leading-5 text-brand-muted">{booking.parkingLotAddress}</p>}</div></div>
          <p className="flex items-center gap-2 text-sm"><Truck size={16} className="shrink-0 text-brand-muted" aria-hidden="true"/><span className="text-brand-muted">Phương tiện</span><strong className="break-all font-semibold">{booking.vehiclePlate || 'Chưa có biển số'}</strong></p>
        </div>
        <dl className="grid grid-cols-2 gap-4 border-y border-brand-border py-3 text-xs @xl:border-y-0 @xl:border-l @xl:pl-4">
          <div><dt className="text-brand-muted">Giờ vào dự kiến</dt><dd className="mt-1.5 font-medium tabular-nums leading-5"><BookingDateTime value={booking.expectedCheckInTime}/></dd></div>
          <div className="border-l border-brand-border pl-4"><dt className="text-brand-muted">Giờ ra dự kiến</dt><dd className="mt-1.5 font-medium tabular-nums leading-5"><BookingDateTime value={booking.expectedCheckOutTime}/></dd></div>
        </dl>
      </div>
    </div>
    <div className="rounded-xl bg-brand-primary-subtle p-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"><p className="text-sm font-medium">{final ? 'Còn cần thanh toán' : 'Tiền cọc cần thanh toán'}</p><strong className="font-sora text-2xl font-semibold tabular-nums tracking-tight text-brand-primary">{amount == null ? 'Chưa có' : formatMoney(amount)}</strong></div>
      <p className="mt-1.5 text-xs leading-5 text-brand-muted">{final ? 'Tổng phí lượt đỗ' : 'Phí đỗ dự kiến'}: <span className="font-medium text-brand-navy">{booking.totalAmount == null ? 'Chưa có' : formatMoney(booking.totalAmount)}</span>{final && <> · Đã cọc {formatMoney(booking.advanceDeposit)}</>}</p>
      {!final && !expired && <p className="mt-3 flex items-start gap-1.5 border-t border-brand-primary-border pt-3 text-xs leading-5 text-brand-muted"><Clock size={14} className="mt-0.5 shrink-0" aria-hidden="true"/><span>Thanh toán cọc trước <strong className="font-semibold tabular-nums text-brand-navy">{bookingTimeLabel(booking.expiresAt)}</strong></span></p>}
      {!final && expired && <div className="mt-3"><Notice error>Đã quá hạn thanh toán. Đang chờ server cập nhật trạng thái hết hạn; không thanh toán thêm cho đơn này.</Notice></div>}
    </div>
    {copyNotice && <p role="status" className="text-xs text-brand-muted">{copyNotice}</p>}
  </section>
}

/** Keep time prominent while retaining the full date and seconds from the server. */
function BookingDateTime({ value }: { value: string }) {
  const label = bookingTimeLabel(value)
  const [time, ...date] = label.split(' ')
  return <><span className="block text-base font-semibold">{time}</span><span className="mt-0.5 block text-brand-muted">{date.join(' ')}</span></>
}
