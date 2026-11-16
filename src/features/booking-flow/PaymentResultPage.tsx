import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { CircleCheck, CirclePause, Copy, LoaderCircle, ShieldAlert } from 'lucide-react'
import { Dialog, Notice, button, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { bookingReference } from '@/entities/booking/bookingReference'
import { cancelBooking, fetchBooking, formatMoney, paymentLink, statusLabels, syncPayment } from './api'
import { bookingTimeLabel, bookingTimestamp } from './time'
import { paymentRecovery } from './paymentRecovery'
export function PaymentResultPage({ cancelled=false }: {cancelled?:boolean}) {
  const [params] = useSearchParams()
  const bookingId = Number(params.get('bookingId'))
  const embedded = window.parent !== window
  useEffect(() => {
    if (embedded && Number.isSafeInteger(bookingId) && bookingId > 0) {
      window.parent.postMessage({ type: 'smartparking:payos-return', bookingId, cancelled }, window.location.origin)
    }
  }, [bookingId, cancelled, embedded])
  if (embedded) return <p role="status">Đang quay lại vé đặt chỗ…</p>
  return <PaymentResultContent key={`${bookingId}:${params.get('orderCode')}`} cancelled={cancelled}/>
}

function PaymentResultContent({ cancelled }: {cancelled:boolean}) {
  const cache = useQueryClient()
  const [params] = useSearchParams()
  const bookingId = Number(params.get('bookingId'))
  const order = Number(params.get('orderCode'))
  const valid = Number.isSafeInteger(bookingId) && bookingId > 0
  const [now, setNow] = useState(Date.now)
  const [copyNotice, setCopyNotice] = useState('')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const payLock = useRef(false)
  const result = useQuery({
    queryKey: ['payment-result', bookingId, order], enabled: valid, retry: false, gcTime: 0,
    refetchOnWindowFocus: 'always', refetchOnMount: 'always',
    queryFn: async () => {
      let syncError: string | null = null
      const payment = await syncPayment({ bookingId, ...(Number.isSafeInteger(order) && order > 0 ? { orderCode: order } : {}) })
        .catch(error => { syncError = errorMessage(error); return null })
      const booking = await fetchBooking(bookingId)
      await Promise.all([
        cache.invalidateQueries({ queryKey: ['booking', bookingId] }),
        cache.invalidateQueries({ queryKey: ['real-bookings'] }),
      ])
      return { booking, payment, syncError }
    },
    refetchInterval: query => query.state.data?.payment?.status === 'SUCCESS'
      && ['PENDING_PAYMENT', 'AWAITING_FINAL_PAYMENT'].includes(query.state.data.booking.status)
      && query.state.dataUpdateCount < 10 ? 3000 : false,
  })
  const refresh = result.refetch
  useEffect(() => {
    if (!valid) return
    const restored = () => { void refresh() }
    window.addEventListener('pageshow', restored)
    return () => window.removeEventListener('pageshow', restored)
  }, [refresh, valid])
  const booking = result.data?.booking
  const deadline = booking?.status === 'PENDING_PAYMENT' ? bookingTimestamp(booking.expiresAt) : NaN
  const expiredRef = useRef(false)
  useEffect(() => {
    if (!Number.isFinite(deadline)) return
    const tick = () => {
      setNow(Date.now())
      if (Date.now() >= deadline && !expiredRef.current) { expiredRef.current = true; void refresh() }
    }
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [deadline, refresh])
  const pay = useMutation({
    retry: false,
    mutationFn: () => paymentLink(bookingId, booking?.status === 'AWAITING_FINAL_PAYMENT'),
    onSuccess: url => window.location.assign(url),
    onError: () => { payLock.current = false },
  })
  const cancel = useMutation({
    mutationFn: () => cancelBooking(bookingId), retry: false,
    onSuccess: async () => { setConfirmCancel(false); await refresh() },
  })
  const checking = valid && (result.isPending || result.isFetching)
  const busy = checking || pay.isPending || pay.isSuccess || cancel.isPending
  const view = booking ? paymentRecovery(booking, result.data?.payment ?? null, now, cancelled) : null
  const title = !valid ? 'Không tìm thấy vé' : checking ? 'Đang kiểm tra thanh toán…' : result.isError ? 'Không thể xem kết quả thanh toán' : view?.title ?? 'Kết quả thanh toán'
  const ticketUrl = `/bookings?bookingId=${bookingId}`
  const final = booking?.status === 'AWAITING_FINAL_PAYMENT'
  const amount = booking ? final ? Math.max(0, (booking.totalAmount ?? 0) - booking.advanceDeposit) : booking.advanceDeposit : 0
  const seconds = Math.max(0, Math.ceil((deadline - now) / 1000))
  const canCancel = !busy && booking?.status === 'PENDING_PAYMENT' && deadline > now && result.data?.payment?.canRetry === true
  const copyCode = async () => {
    try {
      if (!booking || !navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(bookingReference(booking))
      setCopyNotice(booking.status === 'PENDING_PAYMENT' ? 'Đã sao chép số đơn' : 'Đã sao chép mã đặt chỗ')
    } catch { setCopyNotice('Không thể sao chép. Bạn có thể chọn mã vé để sao chép.') }
  }
  return <section aria-label="Kết quả thanh toán" className="mx-auto w-full max-w-[720px] space-y-5 px-4 py-8 font-inter text-brand-navy sm:py-12">
    <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm sm:p-8">
      <div className={`mb-5 inline-flex rounded-2xl p-3 ${!checking && view?.tone === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-surface text-brand-primary'}`} aria-hidden="true">
        {checking ? <LoaderCircle size={28} className="animate-spin"/> : view?.tone === 'success' ? <CircleCheck size={28}/> : view?.tone === 'warning' || result.isError ? <ShieldAlert size={28}/> : <CirclePause size={28}/>}
      </div>
      <div aria-live="polite" aria-atomic="true">
        <h1 className="font-sora text-2xl font-semibold tracking-tight">{title}</h1>
        <p role={!valid || result.isError ? 'alert' : undefined} className="mt-3 text-sm leading-relaxed text-brand-muted">{!valid ? 'Thiếu mã booking hợp lệ. Mở vé của bạn để kiểm tra lại.' : checking ? 'Vui lòng chờ trong khi hệ thống kiểm tra giao dịch và tình trạng vé.' : result.isError ? errorMessage(result.error) : view?.description}</p>
      </div>
      {booking && <div className="mt-6 space-y-4 border-y border-brand-border py-5">
        <div><h2 className="font-semibold">{booking.parkingLotName || `Bãi đỗ #${booking.parkingLotId}`}</h2>{booking.parkingLotAddress && <p className="mt-1 text-sm text-brand-muted">{booking.parkingLotAddress}</p>}</div>
        <dl className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm">
          <div><dt className="text-brand-muted">Phương tiện</dt><dd className="mt-1 font-semibold">{booking.vehiclePlate || 'Chưa có biển số'}</dd></div>
          <div><dt className="text-brand-muted">Tình trạng vé</dt><dd className="mt-1 font-medium">{statusLabels[booking.status]}</dd></div>
          <div><dt className="text-brand-muted">Giờ vào dự kiến</dt><dd className="mt-1">{bookingTimeLabel(booking.expectedCheckInTime)}</dd></div>
          <div><dt className="text-brand-muted">Giờ ra dự kiến</dt><dd className="mt-1">{bookingTimeLabel(booking.expectedCheckOutTime)}</dd></div>
        </dl>
        <div className="flex min-w-0 items-center justify-between gap-2 text-sm"><div className="min-w-0"><p className="text-brand-muted">{booking.status === 'PENDING_PAYMENT' ? 'Số đơn' : 'Mã đặt chỗ'}</p><p className="mt-1 break-all font-mono text-xs">{bookingReference(booking)}</p></div>
          <button type="button" aria-label={booking.status === 'PENDING_PAYMENT' ? 'Sao chép số đơn' : 'Sao chép mã đặt chỗ'} className={`${secondary} shrink-0 !p-2`} onClick={() => void copyCode()}><Copy size={16}/></button>
        </div>
        {copyNotice && <p role="status" className="text-xs text-brand-muted">{copyNotice}</p>}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-brand-surface p-4"><span className="text-sm text-brand-muted">{final ? 'Phần còn lại cần thanh toán' : ['COMPLETED','REVIEWED'].includes(booking.status) ? 'Tổng phí lượt đỗ' : 'Tiền cọc của vé'}</span><strong className="text-xl">{formatMoney(['COMPLETED','REVIEWED'].includes(booking.status) ? booking.totalAmount ?? 0 : amount)}</strong></div>
      </div>}
      {booking?.status === 'PENDING_PAYMENT' && deadline > now && <div className="mt-4 rounded-xl border border-brand-border p-3 text-sm"><p>Hạn thanh toán cọc: <strong>{bookingTimeLabel(booking.expiresAt)}</strong></p><p className="mt-1 text-brand-muted">Còn {Math.floor(seconds / 60)} phút {seconds % 60} giây. Thời hạn không thay đổi khi mở lại trang.</p></div>}
      {result.data?.syncError && <div className="mt-4"><Notice error>Chưa xác minh được giao dịch: {result.data.syncError}</Notice></div>}
      {pay.isError && <div className="mt-4"><Notice error>{errorMessage(pay.error)}</Notice></div>}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {valid && !result.isError && (checking || view?.action === 'check') && <button type="button" className={button} disabled={busy} onClick={() => void refresh()}>{checking ? 'Đang kiểm tra…' : 'Kiểm tra lại thanh toán'}</button>}
        {!checking && view?.action === 'pay' && <button type="button" className={button} disabled={busy} onClick={() => { if (!payLock.current) { payLock.current = true; pay.mutate() } }}>{pay.isPending || pay.isSuccess ? 'Đang mở PayOS…' : `${result.data?.payment?.canRetry ? 'Thanh toán lại' : 'Tiếp tục thanh toán'} ${formatMoney(amount)}`}</button>}
        {!checking && view?.action === 'ticket' && <Link className={button} to={ticketUrl}>{booking?.status === 'PENDING_CHECKIN' ? 'Xem vé QR' : 'Xem chi tiết vé'}</Link>}
        {!checking && view?.action === 'search' && <Link className={button} to="/parking">Tìm bãi để đặt lại</Link>}
        {!checking && view?.action === 'support' && <Link className={button} to="/disputes">Liên hệ hỗ trợ</Link>}
        {result.isError && <button type="button" className={button} disabled={busy} onClick={() => void refresh()}>Thử kiểm tra lại</button>}
        <Link className={secondary} to={valid ? ticketUrl : '/bookings'}>Về vé của tôi</Link>
      </div>
      {canCancel && <details className="mt-6 border-t border-brand-border pt-4 text-sm"><summary className="cursor-pointer text-brand-muted">Tôi không còn muốn giữ chỗ</summary><p className="mt-3 text-brand-muted">Hủy đặt chỗ sẽ kết thúc lượt giữ chỗ này. Thao tác này khác với đóng trang thanh toán.</p><button type="button" className={`${secondary} mt-3`} onClick={() => setConfirmCancel(true)}>Hủy đặt chỗ</button></details>}
    </div>
    <p className="text-center text-xs leading-relaxed text-brand-muted">Nếu đã chuyển khoản nhưng vé chưa cập nhật, hãy kiểm tra lại hoặc <Link className="underline" to="/disputes">liên hệ hỗ trợ</Link>. Giờ hiển thị theo Việt Nam (UTC+7).</p>
    <Dialog isOpen={confirmCancel} onClose={() => { if (!cancel.isPending) setConfirmCancel(false) }} title="Hủy lượt đặt chỗ?" description="Bạn sẽ mất lượt giữ chỗ hiện tại. Nếu muốn đỗ xe sau đó, bạn cần đặt một vé mới." maxWidth="sm" closeOnBackdrop={!cancel.isPending}>
      {cancel.isError && <Notice error>{errorMessage(cancel.error)}</Notice>}
      <div className="mt-4 flex flex-wrap gap-3"><button type="button" className={button} disabled={cancel.isPending} onClick={() => cancel.mutate()}>{cancel.isPending ? 'Đang hủy…' : 'Xác nhận hủy đặt chỗ'}</button><button type="button" className={secondary} disabled={cancel.isPending} onClick={() => setConfirmCancel(false)}>Giữ lại vé</button></div>
    </Dialog>
  </section>
}
