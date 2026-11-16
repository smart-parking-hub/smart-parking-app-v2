import { useEffect, useState } from 'react'
import { bookingTimestamp, bookingTimeLabel } from './time'
import { BookingReview } from './BookingReview'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { WalletDepositPayment, refundStatusLabels } from '@/features/driver-wallet'
import { Notice, button, secondary, Dialog } from '@/shared/components/Workspace'
import { bookingReference } from '@/entities/booking/bookingReference'
import { errorMessage } from '@/shared/api/resources'
import { fetchBooking, paymentLink, payDemo, cancelBooking, formatMoney, statusLabels, type Booking } from './api'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode, Download, Copy, Check, Clock, ShieldCheck } from 'lucide-react'
import { PayOsPaymentPanel } from './PayOsPaymentPanel'
import { QuickBookingPaymentSummary } from './QuickBookingPaymentSummary'
import { Toast, ToastContainer } from '@/shared/components/Toast'

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

type StatusPanelProps = {
  bookingId: number
  booking?: Booking
  embedded?: boolean
  compact?: boolean
  hideReview?: boolean
}

export function BookingStatusPanel(props: StatusPanelProps) {
  return <BookingStatusContent key={props.bookingId} {...props} />
}

function BookingStatusContent({
  bookingId,
  booking,
  embedded = false,
  compact = false,
  hideReview = false,
}: StatusPanelProps) {
  const cache = useQueryClient()
  const [copied, setCopied] = useState(false)
  const [walletPending, setWalletPending] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [acceptWallet, setAcceptWallet] = useState(false)
  const [checkoutIntent, setCheckoutIntent] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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
      cache.invalidateQueries({ queryKey: ['driver-wallet'] }),
      cache.invalidateQueries({ queryKey: ['driver-payment-page'] }),
    ])
  }

  const payment = useMutation({
    mutationFn: (intent: { bookingId: number; final: boolean }) => paymentLink(intent.bookingId, intent.final),
    retry: false,
  })
  const openPayment = (final: boolean) => {
    payment.mutate({ bookingId, final }, {
      onSuccess: (url) => {
        if (new URL(url).origin === window.location.origin) window.location.assign(url)
        else setCheckoutIntent(`${bookingId}:${final ? 'FINAL_PAYMENT' : 'DEPOSIT'}`)
      },
    })
  }
  const demo = useMutation({ mutationFn: () => payDemo(bookingId), onSuccess: refresh })
  const cancel = useMutation({ mutationFn: () => cancelBooking(bookingId), onSuccess: async () => { setCancelOpen(false); setAcceptWallet(false); setToastMessage(`Đã hủy lượt đặt chỗ #${booking?.bookingCode ?? query.data?.bookingCode ?? bookingId} thành công.`); await refresh() } })

  const data = booking ?? query.data
  const deadline = data?.status === 'PENDING_PAYMENT' ? bookingTimestamp(data.expiresAt) : NaN
  const [, tickDeadline] = useState(0)
  useEffect(() => {
    if (!Number.isFinite(deadline)) return
    // Re-evaluate eligibility even when polling returns identical booking data.
    const timer = window.setTimeout(() => tickDeadline(value => value + 1), Math.max(0, deadline - Date.now()))
    return () => window.clearTimeout(timer)
  }, [deadline])

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

  if (!data) return <p role="status">Đang lấy trạng thái booking…</p>

  const expired = !(deadline > Date.now())
  const payable = (data.status === 'PENDING_PAYMENT' && !expired) || data.status === 'AWAITING_FINAL_PAYMENT'
  const finalPayment = data.status === 'AWAITING_FINAL_PAYMENT'
  const checkoutOpen = checkoutIntent === `${bookingId}:${finalPayment ? 'FINAL_PAYMENT' : 'DEPOSIT'}`
  const busy = payment.isPending || demo.isPending || cancel.isPending || walletPending
  const compactPayment = compact && ['PENDING_PAYMENT', 'AWAITING_FINAL_PAYMENT'].includes(data.status)
  const otherActions = <>
    {import.meta.env.DEV && data.status === 'PENDING_PAYMENT' && !expired && <button className={secondary} disabled={busy} onClick={() => demo.mutate()}>Thanh toán Demo (chỉ local)</button>}
    {['PENDING_PAYMENT', 'PENDING_CHECKIN'].includes(data.status) && <button className={secondary} disabled={busy} onClick={() => { setAcceptWallet(false); setCancelOpen(true) }}>Hủy booking</button>}
    {data.status === 'PENDING_CHECKIN' && <button className={secondary} onClick={() => { void navigator.clipboard.writeText(data.bookingCode).then(() => setCopied(true)) }}>{copied ? 'Đã sao chép' : 'Sao chép mã check-in'}</button>}
    {!embedded && <Link className={secondary} to={compactPayment ? `/bookings?bookingId=${bookingId}` : '/bookings'}>Xem các lượt đặt chỗ</Link>}
  </>
  const priceDetails = <p className="text-sm leading-relaxed text-brand-muted">Quá giờ ra dự kiến: ×{data.overtimePenaltyMultiplier ?? 1} trên phí phần quá giờ. Mỗi phần tính theo giờ bắt đầu; hệ số giờ cao điểm ×{data.surgeMultiplier ?? 1} trong khung đã công bố của bãi.</p>

  return (
    <div className={`${compactPayment ? 'space-y-4 text-sm' : 'space-y-5 text-base'} text-brand-navy`}>
      {cancelOpen && <Dialog title="Xác nhận hủy đặt chỗ" onClose={() => { if (!cancel.isPending) setCancelOpen(false) }}>
        <div className="space-y-4">
          <p>Hủy trước hoặc đúng 2 giờ trước giờ dự kiến check-in: hoàn 100% cọc. Trong 2 giờ trước giờ dự kiến: hoàn 50%. Từ giờ dự kiến trở đi hoặc no-show: không hoàn. Số tiền được tính tại thời điểm xác nhận hủy.</p>
          <p>Khoản hoàn hợp lệ được cộng vào ví tài xế để trả cọc lần sau. Hiện chưa hỗ trợ rút số dư về ngân hàng.</p>
          <label className="flex items-start gap-3"><input type="checkbox" checked={acceptWallet} onChange={event => setAcceptWallet(event.target.checked)} /><span>Tôi đồng ý chính sách và nhận khoản hoàn hợp lệ vào ví.</span></label>
          {cancel.isError && <Notice error>{errorMessage(cancel.error)}</Notice>}
          <button className={button} disabled={!acceptWallet || cancel.isPending} onClick={() => cancel.mutate()}>{cancel.isPending ? 'Đang hủy…' : 'Xác nhận hủy và hoàn vào ví'}</button>
        </div>
      </Dialog>}
      {data.status === 'CANCELLED' && <Notice><div className="space-y-2">
        <p>Khoản được hoàn: {formatMoney(data.refundAmount ?? 0)} · {refundStatusLabels[data.refundStatus ?? 'NONE'] ?? data.refundStatus}</p>
        {data.refundChannel === 'WALLET' && (data.refundAmount ?? 0) > 0 && data.refundStatus !== 'NONE' && <p>
          {data.refundStatus === 'COMPLETED' ? 'Đã cộng vào ví tài xế.'
            : data.refundStatus === 'REQUESTED' || data.refundStatus === 'PROCESSING' ? 'Khoản hoàn vào ví đang được xử lý; chưa cộng vào số dư khả dụng.'
            : data.refundStatus === 'REQUIRES_RECONCILIATION' ? 'Khoản hoàn vào ví cần đối soát; chưa cộng vào số dư khả dụng.'
            : 'Khoản hoàn vào ví chưa hoàn thành; cần kiểm tra trạng thái xử lý.'}
          {' '}<Link className="text-brand-primary underline" to="/wallet">Xem ví</Link>
        </p>}
        {data.refundReference && <p>Mã hoàn: {data.refundReference}</p>}
      </div></Notice>}
      {data.status === 'PENDING_PAYMENT' && !expired && <WalletDepositPayment bookingId={bookingId} amount={data.advanceDeposit} onComplete={refresh} onPendingChange={setWalletPending} disabled={payment.isPending || checkoutOpen || cancel.isPending} />}
      {!embedded && !compactPayment && <p role="status" className="font-semibold">
        {statusLabels[data.status]}
      </p>}

      {/* QR Check-in Hero Box khi đã cọc và chờ check-in */}
      {data.status === 'PENDING_CHECKIN' && (
        <div className="rounded-2xl border border-orange-200/90 bg-gradient-to-b from-orange-50/40 to-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5 my-2">
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
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md max-w-full break-all text-center">
              <QrCode className="w-3.5 h-3.5 text-[#d95f00] shrink-0" />
              <span className="break-all">MÃ: {data.bookingCode}</span>
            </div>
          </div>

          {/* Instructions & Details */}
          <div className="flex-1 min-w-0 flex flex-col gap-3 text-left w-full">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-300/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ĐÃ XÁC NHẬN CỌC · SẴN SÀNG CHECK-IN</span>
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
                <span className="break-words">
                  Khung giờ check-in hợp lệ:{' '}
                  <strong>{bookingTimeLabel(bookingTimestamp(data.expectedCheckInTime) - 30 * 60000)}</strong> đến{' '}
                  <strong>{bookingTimeLabel(data.expiresAt)}</strong>
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(data.bookingCode).then(() => setCopied(true))
                  setTimeout(() => setCopied(false), 2500)
                }}
                className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
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
                className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] text-white shadow-2xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Tải ảnh vé QR (PNG Offline)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {compactPayment ? <QuickBookingPaymentSummary booking={data} expired={expired}/> : <>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-brand-muted">{data.status === 'PENDING_PAYMENT' ? 'Số đơn' : 'Mã đặt chỗ'}</dt>
          <dd className="break-all font-semibold">{bookingReference(data)}</dd>
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

      </>}
      {!compactPayment && priceDetails}

      {(!compactPayment || (payable && !checkoutOpen)) && <div className="flex flex-wrap gap-3">
        {payable && !checkoutOpen && (
          <button className={`${button} ${compactPayment ? 'w-full' : ''}`} disabled={busy} onClick={() => openPayment(finalPayment)}>
            {payment.isPending
              ? 'Đang mở thanh toán…'
              : data.status === 'AWAITING_FINAL_PAYMENT'
                ? 'Thanh toán phần còn lại qua PayOS'
                : `Thanh toán cọc ${formatMoney(data.advanceDeposit)} qua PayOS`}
          </button>
        )}
        {!compactPayment && otherActions}
      </div>}

      {payable && checkoutOpen && payment.data && (
        <PayOsPaymentPanel
          key={`${bookingId}:${payment.data}`}
          bookingId={bookingId}
          checkoutUrl={payment.data}
          final={finalPayment}
          compact={compactPayment}
          onClose={() => setCheckoutIntent(null)}
        />
      )}

      {compactPayment && <div className="divide-y divide-brand-border border-t border-brand-border text-xs">
        <details className="py-3"><summary className="cursor-pointer font-medium text-brand-muted">Chi tiết giá & phụ phí</summary><div className="pt-3">{priceDetails}</div></details>
        <details className="py-3"><summary className="cursor-pointer font-medium text-brand-muted">Tác vụ khác</summary><div className="flex flex-wrap gap-2 pt-3 [&>a]:!px-3 [&>a]:!py-2 [&>a]:!text-xs [&>button]:!px-3 [&>button]:!py-2 [&>button]:!text-xs">{otherActions}</div></details>
      </div>}

      {!hideReview && data.status === 'COMPLETED' && <BookingReview bookingId={data.id} />}
      {demo.isSuccess && data.status === 'PENDING_PAYMENT' && (
        <Notice>
          Đã gửi thanh toán Demo. Đang kiểm tra xác nhận từ server; không bấm tạo giao dịch khác.
        </Notice>
      )}
      {data.status === 'CANCELLED' && (
        <Notice>
          Lượt đặt chỗ này đã được hủy thành công. Chỗ đỗ đã được giải phóng.
        </Notice>
      )}
      {[payment.error, demo.error, cancel.error]
        .filter(Boolean)
        .map((error, index) => (
          <Notice key={index} error>
            {errorMessage(error)}
          </Notice>
        ))}

      {toastMessage && (
        <ToastContainer position="top-right">
          <Toast
            title="Thông báo"
            message={toastMessage}
            variant="success"
            duration={4000}
            onClose={() => setToastMessage(null)}
          />
        </ToastContainer>
      )}
    </div>
  )
}
