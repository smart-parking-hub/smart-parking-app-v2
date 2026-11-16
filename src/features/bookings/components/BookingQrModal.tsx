import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode, Download, Copy, Check, Clock, ShieldCheck, AlertCircle } from 'lucide-react'
import { Dialog, Notice, Badge, secondary } from '@/shared/components/Workspace'
import { bookingTimestamp, bookingTimeLabel } from '@/features/booking-flow/time'
import { statusLabels, type Booking } from '@/features/booking-flow'

export interface BookingQrModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
}

function handleDownloadQr(bookingCode: string) {
  const svg = document.getElementById(`qr-modal-${bookingCode}`) as SVGSVGElement | null
  if (!svg) return
  try {
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 20, 20, 360, 360)
      const pngUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = pngUrl
      a.download = `QR-CheckIn-${bookingCode}.png`
      a.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
  } catch {
    // Graceful fallback if Canvas/XMLSerializer blocked
  }
}

export function BookingQrModal({ booking, isOpen, onClose }: BookingQrModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !booking) return null

  const isCheckinReady = booking.status === 'PENDING_CHECKIN'

  const handleCopy = () => {
    void navigator.clipboard.writeText(booking.bookingCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <Dialog
      title={isCheckinReady ? `Vé QR check-in #${booking.bookingCode}` : `Thông tin mã vé #${booking.bookingCode}`}
      onClose={onClose}
      maxWidth="sm"
    >
      <div className="space-y-4">
        {/* Context Strip */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <span className="truncate max-w-[200px]" title={booking.parkingLotName ?? undefined}>
            Bãi: <strong className="text-slate-900">{booking.parkingLotName || `#${booking.parkingLotId}`}</strong>
          </span>
          {booking.vehiclePlate && (
            <span>
              Xe: <strong className="font-mono text-slate-900">{booking.vehiclePlate}</strong>
            </span>
          )}
        </div>

        {isCheckinReady ? (
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Status notification */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-300/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>ĐÃ XÁC NHẬN CỌC · SẴN SÀNG CHECK-IN</span>
            </div>

            {/* QR Card Container */}
            <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border-2 border-orange-200 shadow-sm w-full max-w-[260px]">
              <div className="bg-white p-2 rounded-xl" data-testid="modal-qr-container">
                <QRCodeSVG
                  id={`qr-modal-${booking.bookingCode}`}
                  value={booking.bookingCode}
                  size={190}
                  level="M"
                  marginSize={2}
                  role="img"
                  aria-label={`Mã QR Check-in ${booking.bookingCode}`}
                />
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md">
                <QrCode className="w-3.5 h-3.5 text-[#d95f00]" />
                <span>MÃ: {booking.bookingCode}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Đưa mã QR trước camera tại đầu đọc làn xe hoặc xuất trình cho bảo vệ quét để nâng thanh chắn barie vào bãi.
            </p>

            {/* Check-in time window */}
            <div className="w-full bg-orange-50/70 rounded-xl p-3 border border-orange-100 text-xs text-slate-700 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-[#d95f00] shrink-0" />
              <span>
                Khung giờ check-in hợp lệ:{' '}
                <strong>{bookingTimeLabel(bookingTimestamp(booking.expectedCheckInTime) - 30 * 60000)}</strong> đến{' '}
                <strong>{bookingTimeLabel(booking.expiresAt)}</strong>
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-2 pt-2 w-full">
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>{copied ? 'Đã sao chép mã' : 'Sao chép mã'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadQr(booking.bookingCode)}
                className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#341100] hover:bg-[#4a1800] text-[#d95f00] border border-[#d95f00]/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#d95f00]" />
                <span>Tải ảnh vé QR (PNG)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-amber-50 text-amber-600 mb-1">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h4 className="font-sora text-sm font-semibold text-slate-800">
              Vé QR check-in chưa khả dụng
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Trạng thái hiện tại của vé là{' '}
              <Badge value={booking.status} size="sm">
                {statusLabels[booking.status] ?? booking.status}
              </Badge>
              . Vé QR chỉ có hiệu lực khi đơn đã được thanh toán cọc và đang chờ check-in vào bãi.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`${secondary} !text-xs !px-4 !py-2`}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}
