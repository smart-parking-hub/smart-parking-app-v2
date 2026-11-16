import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Copy } from 'lucide-react'
import { Dialog, secondary } from '@/shared/components/Workspace'
import { canShowCheckoutQr } from '../lib/dashboardBooking'
import type { BookingDto } from '../types/driverTypes'

export function QrCheckoutModal({ open, onClose, booking, onSuccessNotice }: {
  open: boolean
  onClose: () => void
  booking?: BookingDto
  onSuccessNotice?: (message: string) => void
}) {
  const [notice, setNotice] = useState('')
  if (!open || !booking || !canShowCheckoutQr(booking)) return null
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(booking.bookingCode)
      setNotice('Đã sao chép mã vé')
      onSuccessNotice?.('Đã sao chép mã vé xuất bãi.')
    } catch { setNotice('Không thể sao chép. Hãy chọn mã vé để sao chép thủ công.') }
  }
  return <Dialog title="Mã QR xuất bãi" onClose={onClose} maxWidth="sm">
    <div className="space-y-5 text-center">
      <p className="text-sm text-brand-muted">Xuất trình mã này cho nhân viên tại {booking.parkingLotName || 'bãi đỗ'}.</p>
      <div className="mx-auto w-fit rounded-2xl border border-brand-border bg-white p-4">
        <QRCodeSVG value={booking.bookingCode} size={200} marginSize={4} level="M" role="img" aria-label={`QR xuất bãi ${booking.bookingCode}`} />
      </div>
      <div className="rounded-xl bg-brand-surface p-4"><p className="text-xs text-brand-muted">Mã vé</p><p className="mt-2 break-all font-mono text-sm font-semibold">{booking.bookingCode}</p><p className="mt-2 text-sm">Biển số: {booking.vehicleLicensePlate || 'Chưa có thông tin'}</p></div>
      <button type="button" className={`${secondary} w-full`} onClick={() => void copy()}><Copy size={16} aria-hidden="true" />Sao chép mã vé</button>
      {notice && <p role="status" className="text-sm text-brand-muted">{notice}</p>}
      <p className="text-xs leading-5 text-brand-muted">Việc xác nhận xe ra và quyết toán phí được thực hiện tại trạm cổng.</p>
    </div>
  </Dialog>
}
