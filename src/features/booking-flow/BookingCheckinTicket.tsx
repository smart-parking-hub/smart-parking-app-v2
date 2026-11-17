import { useState } from 'react'
import { Check, Clock, Copy, Download, MapPin, ShieldCheck, Truck } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { button, secondary } from '@/shared/components/Workspace'
import { bookingTimeLabel, bookingTimestamp } from './time'
import { formatMoney, type Booking } from './api'

function downloadQr(bookingCode: string) {
  const svg = document.getElementById(`qr-checkin-${bookingCode}`)
  if (!svg) throw new Error('Không tìm thấy mã QR.')
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 400
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Trình duyệt chưa hỗ trợ tải ảnh QR.')
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }))
  return new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, 400, 400)
        ctx.drawImage(img, 20, 20, 360, 360)
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `QR-CheckIn-${bookingCode}.png`
        link.click()
        resolve()
      } catch (error) { reject(error) }
      finally { URL.revokeObjectURL(url) }
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Không thể tạo ảnh QR.')) }
    img.src = url
  })
}

/** A single-column ticket also fits a narrow modal on a wide browser viewport. */
export function BookingCheckinTicket({ booking }: { booking: Booking }) {
  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const copyCode = async () => {
    setError('')
    try {
      await navigator.clipboard.writeText(booking.bookingCode)
      setCopied(true)
      setNotice('Đã sao chép mã check-in.')
    } catch { setError('Không thể sao chép. Bạn có thể chọn mã vé bên dưới QR để sao chép.') }
  }
  const saveQr = async () => {
    setError('')
    try { await downloadQr(booking.bookingCode) }
    catch { setError('Không thể tải ảnh QR. Vui lòng thử lại hoặc chụp màn hình vé.') }
  }

  return <section aria-label="Vé check-in đã xác nhận" className="@container min-w-0 overflow-hidden rounded-xl border border-brand-border bg-white text-sm">
    <div className="space-y-3 border-b border-brand-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-status-success-bg px-2.5 py-1 text-xs font-semibold text-status-success">
          <ShieldCheck size={14} className="shrink-0" aria-hidden="true"/>Đã xác nhận cọc
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold"><Truck size={15} className="shrink-0 text-brand-muted" aria-hidden="true"/>{booking.vehiclePlate}</span>
      </div>
      <div className="flex items-start gap-2">
        <MapPin size={16} className="mt-0.5 shrink-0 text-brand-primary" aria-hidden="true"/>
        <div className="min-w-0">
          <h3 className="font-semibold leading-5">{booking.parkingLotName || `Bãi đỗ #${booking.parkingLotId}`}</h3>
          {booking.parkingLotAddress && <p className="mt-1 text-xs leading-5 text-brand-muted">{booking.parkingLotAddress}</p>}
        </div>
      </div>
    </div>

    <div className="space-y-3 p-4 text-center">
      <div>
        <h4 className="font-sora text-base font-semibold">Vé check-in của bạn</h4>
        <p className="mt-1 text-xs leading-5 text-brand-muted">Đưa mã QR cho nhân viên bãi hoặc quét tại cổng để check-in.</p>
      </div>
      <div className="mx-auto flex size-48 max-w-full items-center justify-center rounded-xl border border-brand-border bg-white p-3" data-testid="checkin-qr-container">
        <QRCodeSVG
          id={`qr-checkin-${booking.bookingCode}`}
          value={booking.bookingCode}
          size={160}
          level="M"
          marginSize={2}
          role="img"
          aria-label={`Mã QR Check-in ${booking.bookingCode}`}
          className="max-w-full"
        />
      </div>
      <div className="min-w-0 rounded-lg bg-brand-surface px-3 py-2">
        <p className="text-xs text-brand-muted">Mã đặt chỗ</p>
        <p className="mt-1 select-all break-all font-mono text-xs font-medium leading-5">{booking.bookingCode}</p>
      </div>
    </div>

    <div className="space-y-3 border-y border-brand-border bg-brand-surface p-4">
      <div className="flex items-center gap-2 font-medium"><Clock size={15} className="shrink-0 text-brand-primary" aria-hidden="true"/>Khung giờ check-in hợp lệ</div>
      <dl className="grid grid-cols-2 gap-3 text-xs">
        <div><dt className="text-brand-muted">Từ</dt><dd className="mt-1 font-semibold tabular-nums leading-5">{bookingTimeLabel(bookingTimestamp(booking.expectedCheckInTime) - (booking.checkInEarlyMinutes ?? (booking.schedulePolicyVersion == null ? 30 : 0)) * 60000)}</dd></div>
        <div><dt className="text-brand-muted">Đến</dt><dd className="mt-1 font-semibold tabular-nums leading-5">{bookingTimeLabel(booking.expiresAt)}</dd></div>
      </dl>
    </div>

    <div className="space-y-4 p-4">
      <dl className="grid grid-cols-2 gap-3 text-xs">
        <div><dt className="text-brand-muted">Đã thanh toán cọc</dt><dd className="mt-1 text-base font-semibold tabular-nums text-brand-primary">{formatMoney(booking.advanceDeposit)}</dd></div>
        <div><dt className="text-brand-muted">Phí đỗ dự kiến</dt><dd className="mt-1 text-base font-semibold tabular-nums">{booking.totalAmount == null ? 'Chưa có' : formatMoney(booking.totalAmount)}</dd></div>
        <div><dt className="text-brand-muted">Giờ vào dự kiến</dt><dd className="mt-1 font-medium tabular-nums leading-5">{bookingTimeLabel(booking.expectedCheckInTime)}</dd></div>
        <div><dt className="text-brand-muted">Giờ ra dự kiến</dt><dd className="mt-1 font-medium tabular-nums leading-5">{bookingTimeLabel(booking.expectedCheckOutTime)}</dd></div>
      </dl>
      <div className="grid gap-2 @sm:grid-cols-2">
        <button type="button" className={`${secondary} min-w-0 !px-3 !py-2.5 !text-xs`} onClick={() => void copyCode()}>
          {copied ? <Check size={15} className="shrink-0" aria-hidden="true"/> : <Copy size={15} className="shrink-0" aria-hidden="true"/>}
          {copied ? 'Đã sao chép mã' : 'Sao chép mã check-in'}
        </button>
        <button type="button" className={`${button} min-w-0 !px-3 !py-2.5 !text-xs`} onClick={() => void saveQr()}>
          <Download size={15} className="shrink-0" aria-hidden="true"/>Tải ảnh vé QR (PNG)
        </button>
      </div>
      {notice && <p role="status" className="text-xs leading-5 text-brand-muted">{notice}</p>}
      {error && <p role="alert" className="text-xs leading-5 text-status-danger">{error}</p>}
    </div>
  </section>
}
