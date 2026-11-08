import { useState } from 'react'
import { bookingTimestamp, bookingTimeLabel } from './time'
import { BookingReview } from './BookingReview'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Notice, button, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { fetchBooking, paymentLink, payDemo, cancelBooking, formatMoney, statusLabels, type Booking } from './api'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode, Download, Copy, Check, Clock, ShieldCheck } from 'lucide-react'

function handleDownloadQr(bookingCode: string) {
  const svg = document.getElementById(`qr-checkin-${bookingCode}`) as SVGSVGElement | null
  if (!svg) return
  try {
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 300
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 10, 10, 280, 280)
      const pngUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = pngUrl
      a.download = `QR-CheckIn-${bookingCode}.png`
      a.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
  } catch {
    // Graceful fallback if XMLSerializer/Canvas is blocked
  }
}

export function BookingStatusPanel({ bookingId, booking }: { bookingId: number; booking?: Booking }) {
  const cache = useQueryClient()
  const [copied, setCopied] = useState(false)
  const query = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => fetchBooking(bookingId),
    enabled: !booking,
    refetchInterval: (query) =>
      !booking &&
      ['PENDING_PAYMENT', 'PENDING_CHECKIN', 'PARKING', 'OVERTIME', 'AWAITING_FINAL_PAYMENT'].includes(
        query.state.data?.status ?? '',
      )
        ? 3000
        : false,
    retry: false,
  })

  const refresh = async () => {
    await Promise.all([
      cache.invalidateQueries({ queryKey: ['booking', bookingId] }),
      cache.invalidateQueries({ queryKey: ['real-bookings'] }),
      cache.invalidateQueries({ queryKey: ['parking-lots-search'] }),
    ])
  }

  const payment = useMutation({
    mutationFn: () => paymentLink(bookingId, query.data?.status === 'AWAITING_FINAL_PAYMENT'),
    onSuccess: (url) => window.location.assign(url),
  })
  const demo = useMutation({ mutationFn: () => payDemo(bookingId), onSuccess: refresh })
  const cancel = useMutation({ mutationFn: () => cancelBooking(bookingId), onSuccess: refresh })

  if (!booking && query.isPending) return <p role="status">Đang lấy trạng thái booking…</p>
  if (!booking && query.isError)
    return (
      <Notice error>
        <div>
          {errorMessage(query.error)}
          <button className={`${secondary} mt-3`} onClick={() => void query.refetch()}>
            Thử lại
          </button>
        </div>
      </Notice>
    )

  const data = booking ?? query.data
  if (!data) return <p role="status">Đang lấy trạng thái booking…</p>

  const expired = bookingTimestamp(data.expiresAt) <= Date.now()
  const payable = (data.status === 'PENDING_PAYMENT' && !expired) || data.status === 'AWAITING_FINAL_PAYMENT'
  const busy = payment.isPending || demo.isPending || cancel.isPending

  return (
    <div className="space-y-5 text-base text-brand-navy">
      <p role="status" className="font-semibold">
        {statusLabels[data.status]}
      </p>

      {/* QR Check-in Hero Box khi đã cọc và chờ check-in */}
      {data.status === 'PENDING_CHECKIN' && (
        <div className="rounded-2xl border border-orange-200/90 bg-gradient-to-b from-orange-50/40 to-white p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center gap-6 my-2">
          {/* QR Visual Container */}
          <div className="shrink-0 flex flex-col items-center gap-2 p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="bg-white p-2 rounded-lg" data-testid="checkin-qr-container">
              <QRCodeSVG
                id={`qr-checkin-${data.bookingCode}`}
                value={data.bookingCode}
                size={160}
                level="M"
                marginSize={2}
                role="img"
                aria-label={`Mã QR Check-in ${data.bookingCode}`}
              />
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
              <QrCode className="w-3.5 h-3.5 text-[#d95f00]" />
              <span>MÃ: {data.bookingCode}</span>
            </div>
          </div>

          {/* Instructions & Details */}
          <div className="flex-1 flex flex-col gap-3 text-left w-full">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-300/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ĐÃ XÁC NHẬN CỌC · SẴN SÀNG CHECK-IN
              </span>
              <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Biển số: <strong className="text-slate-900">{data.vehiclePlate}</strong>
              </span>
            </div>

            <div>
              <h4 className="font-sora text-sm sm:text-base font-bold text-[#0d1c2e]">
                Vé QR Check-in Mở Barie Tự Động
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Đưa mã QR trước camera tại đầu đọc làn xe hoặc xuất trình cho bảo vệ bãi quét để nâng thanh chắn barie tự động.
              </p>
            </div>

            <div className="bg-white/80 rounded-xl p-3 border border-orange-100/80 flex flex-col gap-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d95f00] shrink-0" />
                <span>
                  Khung giờ check-in hợp lệ:{' '}
                  <strong>{bookingTimeLabel(bookingTimestamp(data.expectedCheckInTime) - 30 * 60000)}</strong> đến{' '}
                  <strong>{bookingTimeLabel(data.expiresAt)}</strong>
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(data.bookingCode).then(() => setCopied(true))
                  setTimeout(() => setCopied(false), 2500)
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>{copied ? 'Đã sao chép mã' : 'Sao chép mã check-in'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadQr(data.bookingCode)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#341100] hover:bg-[#4a1800] text-[#d95f00] border border-[#d95f00]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#d95f00]" />
                <span>Tải ảnh vé QR (PNG Offline)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-brand-muted">Mã đặt chỗ</dt>
          <dd className="break-all font-semibold">{data.bookingCode}</dd>
        </div>
        <div>
          <dt className="text-sm text-brand-muted">Phương tiện</dt>
          <dd>{data.vehiclePlate}</dd>
        </div>
        <div>
          <dt className="text-sm text-brand-muted">Phí dự kiến / Phí quyết toán</dt>
          <dd>{data.totalAmount == null ? 'Chưa có' : formatMoney(data.totalAmount)}</dd>
        </div>
        <div>
          <dt className="text-sm text-brand-muted">Cọc theo booking</dt>
          <dd>{formatMoney(data.advanceDeposit)}</dd>
        </div>
        {data.status === 'AWAITING_FINAL_PAYMENT' && data.totalAmount != null && (
          <div>
            <dt className="text-sm text-brand-muted">Còn phải thanh toán</dt>
            <dd>{formatMoney(Math.max(0, data.totalAmount - data.advanceDeposit))}</dd>
          </div>
        )}
      </dl>

      {data.status === 'PENDING_PAYMENT' && (
        <Notice>
          {expired
            ? 'Đã quá hạn thanh toán. Đang chờ server cập nhật trạng thái hết hạn; không thanh toán thêm cho đơn này.'
            : `Thanh toán cọc trước ${bookingTimeLabel(data.expiresAt)}. Chưa thanh toán thì chưa được check-in.`}
        </Notice>
      )}

      {data.status === 'PENDING_CHECKIN' && (
        <Notice>
          Đã xác nhận cọc. Chỉ được check-in từ{' '}
          {bookingTimeLabel(bookingTimestamp(data.expectedCheckInTime) - 30 * 60000)} đến{' '}
          {bookingTimeLabel(data.expiresAt)}. Đưa mã đặt chỗ cho nhân viên bãi.
        </Notice>
      )}

      <p className="text-sm text-brand-muted">
        Quá giờ ra dự kiến: ×{data.overtimePenaltyMultiplier ?? 1} trên phí phần quá giờ. Mỗi phần tính theo giờ bắt đầu; hệ
        số giờ cao điểm ×{data.surgeMultiplier ?? 1} trong khung đã công bố của bãi.
      </p>

      <div className="flex flex-wrap gap-3">
        {payable && (
          <button className={button} disabled={busy} onClick={() => payment.mutate()}>
            {payment.isPending
              ? 'Đang mở thanh toán…'
              : data.status === 'AWAITING_FINAL_PAYMENT'
                ? 'Thanh toán phần còn lại qua PayOS'
                : `Thanh toán cọc ${formatMoney(data.advanceDeposit)} qua PayOS`}
          </button>
        )}
        {import.meta.env.DEV && data.status === 'PENDING_PAYMENT' && !expired && (
          <button className={secondary} disabled={busy} onClick={() => demo.mutate()}>
            Thanh toán Demo (chỉ local)
          </button>
        )}
        {['PENDING_PAYMENT', 'PENDING_CHECKIN'].includes(data.status) && (
          <button className={secondary} disabled={busy} onClick={() => cancel.mutate()}>
            Hủy booking
          </button>
        )}
        {data.status === 'PENDING_CHECKIN' && (
          <button
            className={secondary}
            onClick={() => {
              void navigator.clipboard.writeText(data.bookingCode).then(() => setCopied(true))
            }}
          >
            {copied ? 'Đã sao chép' : 'Sao chép mã check-in'}
          </button>
        )}
        <Link className={secondary} to="/bookings">
          Xem các lượt đặt chỗ
        </Link>
      </div>

      {data.status === 'COMPLETED' && <BookingReview bookingId={data.id} />}
      {demo.isSuccess && data.status === 'PENDING_PAYMENT' && (
        <Notice>
          Đã gửi thanh toán Demo. Đang kiểm tra xác nhận từ server; không bấm tạo giao dịch khác.
        </Notice>
      )}
      {[payment.error, demo.error, cancel.error]
        .filter(Boolean)
        .map((error, index) => (
          <Notice key={index} error>
            {errorMessage(error)}
          </Notice>
        ))}
    </div>
  )
}
