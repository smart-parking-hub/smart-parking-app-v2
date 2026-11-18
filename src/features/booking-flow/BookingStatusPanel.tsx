import { useEffect, useState } from 'react'
import { ChevronDown, CreditCard, QrCode, Info } from 'lucide-react'
import { bookingTimestamp, bookingTimeLabel } from './time'
import { BookingReview } from './BookingReview'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { WalletDepositPayment, refundStatusLabels } from '@/features/driver-wallet'
import { Notice, button, secondary, Dialog } from '@/shared/components/Workspace'
import { bookingReference } from '@/entities/booking/bookingReference'
import { errorMessage } from '@/shared/api/resources'
import { fetchBooking, paymentLink, payDemo, cancelBooking, formatMoney, statusLabels, type Booking } from './api'
import { BookingCheckinTicket } from './BookingCheckinTicket'
import { PayOsPaymentPanel } from './PayOsPaymentPanel'
import { QuickBookingPaymentSummary } from './QuickBookingPaymentSummary'
import { Toast, ToastContainer } from '@/shared/components/Toast'

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
  const compactCheckin = compact && data.status === 'PENDING_CHECKIN'
  const compactView = compactPayment || compactCheckin
  const walletPayment = data.status === 'PENDING_PAYMENT' && !expired && <WalletDepositPayment bookingId={bookingId} amount={data.advanceDeposit} onComplete={refresh} onPendingChange={setWalletPending} disabled={payment.isPending || checkoutOpen || cancel.isPending} compact={compactPayment}/>
  const otherActions = <>
    {import.meta.env.DEV && data.status === 'PENDING_PAYMENT' && !expired && <button className={secondary} disabled={busy} onClick={() => demo.mutate()}>Thanh toán Demo (chỉ local)</button>}
    {['PENDING_PAYMENT', 'PENDING_CHECKIN'].includes(data.status) && <button className={secondary} disabled={busy} onClick={() => { setAcceptWallet(false); setCancelOpen(true) }}>Hủy booking</button>}
    {!embedded && <Link className={secondary} to={compactView ? `/bookings?bookingId=${bookingId}` : '/bookings'}>Xem các lượt đặt chỗ</Link>}
  </>
  const priceDetails = <p className="text-sm leading-relaxed text-brand-muted">Quá giờ ra dự kiến: ×{data.overtimePenaltyMultiplier ?? 1} trên phí phần quá giờ. Mỗi phần tính theo giờ bắt đầu; hệ số giờ cao điểm ×{data.surgeMultiplier ?? 1} trong khung đã công bố của bãi.</p>

  return (
    <div className={`${compactView ? 'space-y-4 text-sm' : 'space-y-5 text-base'} text-brand-navy`}>
      {cancelOpen && <Dialog title="Xác nhận hủy đặt chỗ" onClose={() => { if (!cancel.isPending) setCancelOpen(false) }}>
        <div className="space-y-4">
          <p>Hủy trước hoặc đúng 2 giờ trước giờ dự kiến check-in: hoàn 100% cọc. Trong 2 giờ trước giờ dự kiến: hoàn 50%. Từ giờ dự kiến trở đi hoặc no-show: không hoàn. Số tiền được tính tại thời điểm xác nhận hủy.</p>
          <p>Khoản hoàn hợp lệ được cộng vào ví tài xế để trả cọc lần sau. Hiện chưa hỗ trợ rút số dư về ngân hàng.</p>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6">
            <input
              type="checkbox"
              className="mt-1 size-4 shrink-0 cursor-pointer accent-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              checked={acceptWallet}
              onChange={event => setAcceptWallet(event.target.checked)}
            />
            <span className="min-w-0">Tôi đồng ý chính sách và nhận khoản hoàn hợp lệ vào ví.</span>
          </label>
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
      {!compactPayment && walletPayment}
      {!embedded && !compactPayment && <p role="status" className="font-semibold">
        {statusLabels[data.status]}
      </p>}

      {data.status === 'PENDING_CHECKIN' && <BookingCheckinTicket booking={data}/>}

      {(data.status === 'PARKING' || data.status === 'OVERTIME') && (
        <div
          data-testid="parking-status-notice"
          role="status"
          className="w-full p-3.5 bg-blue-50/80 border border-blue-200/90 rounded-xl flex items-center gap-2.5 text-blue-900 text-xs sm:text-sm font-medium shadow-2xs"
        >
          <Info className="w-5 h-5 text-blue-600 shrink-0" aria-hidden="true" />
          <span>Xe đang đỗ tại bãi. Cước phí sẽ được chốt khi Barie quét xe tại cổng ra.</span>
        </div>
      )}

      {compactPayment ? <QuickBookingPaymentSummary booking={data} expired={expired}/> : data.status !== 'PENDING_CHECKIN' && <>
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

      </>}
      {!compactView && priceDetails}

      {(!compactView || payable) && <div className={compactPayment ? 'space-y-3' : 'flex flex-wrap gap-3'}>
        {compactPayment && !checkoutOpen && <h3 className="text-sm font-semibold">Thanh toán {finalPayment ? 'phần còn lại' : 'tiền cọc'}</h3>}
        {payable && !checkoutOpen && (
          <button className={`${button} ${compactPayment ? 'w-full' : ''}`} disabled={busy} onClick={() => openPayment(finalPayment)}>
            {compactPayment && <CreditCard size={17} className="shrink-0" aria-hidden="true"/>}
            {payment.isPending
              ? 'Đang mở thanh toán…'
              : data.status === 'AWAITING_FINAL_PAYMENT'
                ? 'Thanh toán phần còn lại qua PayOS'
                : `Thanh toán cọc ${formatMoney(data.advanceDeposit)} qua PayOS`}
          </button>
        )}
        {compactPayment && walletPayment}
        {!compactView && otherActions}
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

      {compactPayment && !finalPayment && <p className="flex items-start gap-2 text-xs leading-5 text-brand-muted"><QrCode size={15} className="mt-0.5 shrink-0" aria-hidden="true"/><span>Mã check-in và QR sẽ hiển thị sau khi xác nhận thanh toán cọc.</span></p>}

      {compactView && <div className="divide-y divide-brand-border border-t border-brand-border text-xs">
        <details className="group py-3.5"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-brand-muted [&::-webkit-details-marker]:hidden">Chi tiết giá & phụ phí<ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180"/></summary><div className="pt-3">{priceDetails}</div></details>
        <details className="group py-3.5"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-brand-muted [&::-webkit-details-marker]:hidden">Tác vụ khác<ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180"/></summary><div className="flex flex-wrap gap-2 pt-3 [&>a]:!px-3 [&>a]:!py-2 [&>a]:!text-xs [&>button]:!px-3 [&>button]:!py-2 [&>button]:!text-xs">{otherActions}</div></details>
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
