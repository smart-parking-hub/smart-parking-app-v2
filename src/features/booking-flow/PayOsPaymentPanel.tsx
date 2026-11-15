import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowUpRight, CircleCheck, CirclePause, ShieldAlert, ShieldCheck } from 'lucide-react'
import { Notice, button, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { paymentLink, syncPayment } from './api'
import { PayOsCheckoutFrame } from './PayOsCheckoutFrame'
import { requiresHostedPayOS } from './payosCheckout'

interface Props {
  bookingId: number
  checkoutUrl: string
  onClose: () => void
  final?: boolean
  compact?: boolean
}

type View = 'checkout' | 'cancelled' | 'closed' | 'failed' | 'review' | 'confirmed' | 'refunded' | 'unavailable'
const summaries: Record<Exclude<View, 'checkout'>, { title: string; description: string }> = {
  cancelled: {
    title: 'Đã dừng thanh toán PayOS',
    description: 'Bạn đã hủy bước thanh toán. Thao tác này không tự hủy lượt đặt chỗ; xem lại vé để kiểm tra hạn thanh toán và các thao tác còn khả dụng.',
  },
  closed: {
    title: 'Đã đóng khung thanh toán',
    description: 'Đóng QR không hủy lượt đặt chỗ. Quay lại vé nếu bạn muốn tiếp tục; đường dẫn thanh toán sẽ được máy chủ kiểm tra lại.',
  },
  failed: {
    title: 'Thanh toán chưa hoàn tất',
    description: 'Giao dịch đã hủy hoặc không còn khả dụng. Khung QR cũ đã được đóng. Quay lại vé để xem trạng thái và các thao tác còn khả dụng.',
  },
  review: {
    title: 'Giao dịch cần đối soát',
    description: 'Máy chủ chưa xác nhận đủ điều kiện hoàn tất. Vui lòng liên hệ hỗ trợ để đối soát trước khi thanh toán thêm.',
  },
  confirmed: { title: 'Đã ghi nhận thanh toán', description: 'Máy chủ đang cập nhật trạng thái vé đặt chỗ.' },
  refunded: { title: 'Giao dịch đã được hoàn tiền', description: 'Quay lại vé để xem trạng thái lượt đặt chỗ hiện tại.' },
  unavailable: { title: 'Chưa mở được phiên thanh toán', description: 'Kiểm tra giao dịch hoặc quay lại vé để thử lại. Phiên cũ sẽ không được tự động mở lại.' },
}

export function PayOsPaymentPanel({ bookingId, checkoutUrl, onClose, final = false, compact = false }: Props) {
  const cache = useQueryClient()
  const hosted = requiresHostedPayOS()
  const [view, setView] = useState<View>('checkout')
  const [attempt, setAttempt] = useState(0)
  const [notice, setNotice] = useState<string | null>(null)
  const summaryHeading = useRef<HTMLHeadingElement>(null)
  const callbackRef = useRef<() => void>(() => {})
  const syncLock = useRef(false)
  const openLock = useRef(false)
  const openHosted = useMutation({
    mutationFn: () => paymentLink(bookingId, final), retry: false,
    onSuccess: url => window.location.assign(url),
    onError: () => { openLock.current = false; setView('unavailable'); callbackRef.current() },
  })
  const sync = useMutation({
    mutationFn: () => syncPayment({ bookingId }), retry: false,
    onSuccess: async result => {
      if (result.status === 'FAILED') setView(previous => previous === 'cancelled' ? previous : 'failed')
      else if (result.status === 'REQUIRES_REVIEW') setView('review')
      else if (result.status === 'SUCCESS') setView('confirmed')
      else if (result.status === 'REFUNDED') setView('refunded')
      setNotice(result.status === 'PENDING'
        ? 'Chưa ghi nhận thanh toán. Nếu bạn vừa chuyển khoản, vui lòng đợi một lúc rồi kiểm tra lại.'
        : result.status === 'SUCCESS' ? 'Máy chủ đã ghi nhận thanh toán. Đang cập nhật trạng thái đặt chỗ.'
          : ['FAILED', 'REQUIRES_REVIEW', 'REFUNDED'].includes(result.status) ? null
            : 'Chưa xác định được trạng thái thanh toán. Vui lòng kiểm tra lại sau.')
      await Promise.all([
        cache.invalidateQueries({ queryKey: ['booking', bookingId] }),
        cache.invalidateQueries({ queryKey: ['real-bookings'] }),
        cache.invalidateQueries({ queryKey: ['parking-lots-search'] }),
      ])
    },
    onSettled: () => { syncLock.current = false },
  })
  const checkPayment = () => {
    if (syncLock.current) return
    syncLock.current = true
    sync.mutate()
  }
  useEffect(() => { callbackRef.current = checkPayment })
  useEffect(() => {
    const restored = (event: PageTransitionEvent) => {
      if (event.persisted) { setView('closed'); callbackRef.current() }
    }
    window.addEventListener('pageshow', restored)
    return () => window.removeEventListener('pageshow', restored)
  }, [])
  useEffect(() => {
    if (view === 'checkout') return
    summaryHeading.current?.focus({ preventScroll: true })
    summaryHeading.current?.scrollIntoView?.({ block: 'nearest' })
  }, [view])
  useEffect(() => {
    if (view !== 'checkout') return
    const checkWhenVisible = () => { if (document.visibilityState === 'visible') callbackRef.current() }
    const timer = window.setInterval(checkWhenVisible, 10000)
    window.addEventListener('focus', checkWhenVisible)
    document.addEventListener('visibilitychange', checkWhenVisible)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', checkWhenVisible)
      document.removeEventListener('visibilitychange', checkWhenVisible)
    }
  }, [bookingId, view])

  const summary = view === 'checkout' ? null : summaries[view]
  return <section aria-label="Thanh toán PayOS" className={compact ? 'min-w-0 space-y-3' : 'min-w-0 space-y-4 rounded-2xl border border-brand-border bg-white p-3 sm:p-5'}>
    {summary ? <div className={`rounded-xl border p-4 ${view === 'confirmed' ? 'border-emerald-200 bg-emerald-50' : 'border-brand-border bg-brand-surface'}`}>
      <div className="flex items-start gap-3">
        {view === 'confirmed' ? <CircleCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />
          : view === 'review' ? <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-brand-primary" aria-hidden="true" />
            : <CirclePause className="mt-0.5 h-6 w-6 shrink-0 text-brand-muted" aria-hidden="true" />}
        <div className="min-w-0"><h3 ref={summaryHeading} tabIndex={-1} className="font-sora text-base font-semibold text-brand-navy outline-none">{summary.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">{summary.description}</p></div>
      </div>
    </div> : hosted ? <div className={compact ? '' : 'rounded-xl border border-brand-border bg-brand-surface p-4'}>
      <h3 className={`font-sora font-semibold text-brand-navy ${compact ? 'flex items-center gap-2 text-sm' : 'text-base'}`}>{compact && <ShieldCheck size={16} className="text-brand-primary" aria-hidden="true"/>}{compact ? 'Thanh toán qua PayOS' : 'Tiếp tục thanh toán trên PayOS'}</h3>
      <p className={`${compact ? 'mt-1 text-xs' : 'mt-2 text-sm'} leading-relaxed text-brand-muted`}>{compact ? 'Quét mã bằng ứng dụng ngân hàng trên trang PayOS, sau đó quay lại để xem vé.' : 'Mở trang PayOS để quét mã QR bằng ứng dụng ngân hàng. Sau khi thanh toán hoặc hủy, bạn sẽ quay lại trang vé để kiểm tra kết quả.'}</p>
      <button type="button" className={`${button} mt-3 ${compact ? 'w-full' : ''}`} disabled={openHosted.isPending || openHosted.isSuccess} onClick={() => { if (!openLock.current) { openLock.current = true; openHosted.mutate() } }}>{openHosted.isPending || openHosted.isSuccess ? 'Đang kiểm tra phiên PayOS…' : 'Mở PayOS để thanh toán'}{compact && <ArrowUpRight size={16} aria-hidden="true"/>}</button>
      {!compact && <button type="button" className={`${secondary} ml-2 mt-3`} onClick={onClose}>Quay lại vé</button>}
    </div> : <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1"><h3 className="font-sora text-lg font-semibold">Quét mã QR để thanh toán</h3>
          <p className="mt-1 text-sm text-brand-muted">Dùng ứng dụng ngân hàng quét mã trong khung PayOS. Trạng thái thanh toán được xác nhận từ máy chủ.</p></div>
        <button type="button" className={`${secondary} shrink-0 !px-3 !py-2 whitespace-nowrap`} onClick={onClose}>Đóng QR</button>
      </div>
      <PayOsCheckoutFrame key={attempt} bookingId={bookingId} checkoutUrl={checkoutUrl}
        onVerify={checkPayment} onCancel={() => { setView('cancelled'); checkPayment() }} onExit={() => { setView('closed'); checkPayment() }} />
    </>}
    {notice && <p role="status" className="text-sm text-brand-muted">{notice}</p>}
    {sync.isError && <Notice error>{errorMessage(sync.error)}</Notice>}
    {openHosted.isError && <Notice error>{errorMessage(openHosted.error)}</Notice>}
    <div className={compact ? 'flex flex-wrap items-center justify-between gap-2' : 'flex flex-wrap gap-2'}>
      {summary && <button type="button" className={secondary} onClick={onClose}>Quay lại vé</button>}
      <button type="button" className={compact ? 'rounded-lg py-2 text-xs font-medium text-brand-muted underline underline-offset-4 hover:text-brand-navy disabled:opacity-50' : secondary} disabled={sync.isPending} onClick={checkPayment}>
        {sync.isPending ? 'Đang kiểm tra giao dịch…' : compact ? 'Kiểm tra thanh toán' : 'Kiểm tra trạng thái thanh toán'}
      </button>
      {compact && hosted && !summary && <button type="button" className="rounded-lg py-2 text-xs font-medium text-brand-muted hover:text-brand-navy" onClick={onClose}>Đóng bước thanh toán</button>}
      {!summary && !hosted && <>
        <button type="button" className={secondary} onClick={() => setAttempt(value => value + 1)}>Mở lại khung QR</button>
        <a className={secondary} href={checkoutUrl} target="_blank" rel="noopener noreferrer">Mở trang PayOS</a>
      </>}
    </div>
    {!compact && <p className="text-xs leading-relaxed text-brand-muted">Nếu đã chuyển khoản, hãy kiểm tra giao dịch trước khi thanh toán tiếp. Chỉ trạng thái được máy chủ xác nhận mới có hiệu lực.</p>}
  </section>
}
