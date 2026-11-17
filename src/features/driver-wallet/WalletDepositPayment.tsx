import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { Notice, secondary, money } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { getWallet, getBookingWalletPayment, payWalletDeposit, walletKeys } from './api'

type Props = {
  bookingId: number
  amount: number
  onComplete: () => Promise<void>
  onPendingChange?: (pending: boolean) => void
  disabled?: boolean
  compact?: boolean
}

export function WalletDepositPayment({ bookingId, amount, onComplete, onPendingChange, disabled = false, compact = false }: Props) {
  const cache = useQueryClient()
  const [reconciling, setReconciling] = useState(false)
  // Look up by booking after refresh or a lost POST response, when no paymentId is known.
  const result = useQuery({
    queryKey: walletKeys.payment(bookingId),
    queryFn: ({ signal }) => getBookingWalletPayment(bookingId, signal),
    retry: false,
    refetchInterval: 3000,
  })
  const wallet = useQuery({ queryKey: walletKeys.balance, queryFn: getWallet, retry: false })
  const payment = useMutation({
    mutationFn: () => payWalletDeposit(bookingId),
    retry: false,
    onMutate: async () => {
      setReconciling(true)
      await cache.cancelQueries({ queryKey: walletKeys.payment(bookingId) })
    },
    onSuccess: data => { cache.setQueryData(walletKeys.payment(bookingId), data) },
    onSettled: async () => {
      // An HTTP error may arrive after the server committed the hold. Always reconcile reads.
      try {
        await cache.invalidateQueries({ queryKey: walletKeys.all })
        await onComplete()
      } finally {
        setReconciling(false)
      }
    },
  })
  const status = result.data?.status ?? payment.data?.status
  const paymentId = result.data?.id ?? payment.data?.id
  useEffect(() => {
    if (paymentId && status) {
      void cache.invalidateQueries({ queryKey: walletKeys.balance })
      void cache.invalidateQueries({ queryKey: ['driver-wallet', 'entries'] })
      void cache.invalidateQueries({ queryKey: ['booking', bookingId] })
      void cache.invalidateQueries({ queryKey: ['real-bookings'] })
      void cache.invalidateQueries({ queryKey: ['driver-payment-page'] })
    }
  }, [status, paymentId, cache, bookingId])
  const pending = payment.isPending || reconciling || status === 'PENDING'
  const checking = result.isPending || result.isError
  const blocksOtherPayment = pending || checking || status === 'SUCCESS' || status === 'REFUNDED' || status === 'REQUIRES_REVIEW'
  useEffect(() => {
    onPendingChange?.(blocksOtherPayment)
    return () => onPendingChange?.(false)
  }, [blocksOtherPayment, onPendingChange])
  const payButton = <button className={`${secondary} ${compact ? 'shrink-0 !px-3 !py-2.5 !text-xs' : ''}`}
      disabled={!wallet.data?.enabled || wallet.isError || wallet.data.availableAmount < amount || blocksOtherPayment || disabled || status === 'FAILED'}
      onClick={() => payment.mutate()}>
      {pending ? 'Đang xác nhận cọc bằng ví…' : `Trả ${money(amount)} bằng ví`}
    </button>
  return <section aria-label="Thanh toán bằng ví" className={compact ? '@container space-y-3 rounded-xl bg-brand-surface/60 p-3.5' : 'space-y-3 rounded-xl border border-brand-border p-4'}>
    <div className={compact ? 'grid items-center gap-3 @sm:grid-cols-[1fr_auto]' : 'space-y-3'}>
      <div className={compact ? 'flex min-w-0 items-center gap-2.5' : 'flex flex-wrap items-center justify-between gap-3'}>
        {compact && <Wallet size={19} className="shrink-0 text-brand-muted" aria-hidden="true"/>}
        <div className={compact ? 'min-w-0 flex-1' : ''}>
          {compact && <p className="text-xs text-brand-muted">Hoặc dùng ví của bạn</p>}
          <p className={compact ? 'mt-1 text-xs text-brand-muted' : 'text-sm'}>Ví khả dụng: <strong className={compact ? 'font-semibold tabular-nums text-brand-navy' : ''}>{wallet.data ? money(wallet.data.availableAmount) : 'Đang kiểm tra…'}</strong></p>
        </div>
        <Link className={compact ? 'text-xs text-brand-muted underline underline-offset-4 hover:text-brand-navy' : 'text-sm text-brand-primary underline'} to="/wallet">Xem ví</Link>
      </div>
      {compact && payButton}
    </div>
    {wallet.isError && <Notice error>{errorMessage(wallet.error)} <button className={secondary} onClick={() => void wallet.refetch()}>Thử lại</button></Notice>}
    {wallet.data && !wallet.data.enabled && <p className="text-sm text-brand-muted">Thanh toán ví đang tạm dừng.</p>}
    {wallet.data && wallet.data.availableAmount < amount && !blocksOtherPayment && <p className={compact ? 'text-xs leading-5 text-brand-muted' : 'text-sm text-brand-muted'}>Ví thiếu {money(amount - wallet.data.availableAmount)}. Thanh toán toàn bộ cọc qua PayOS; số dư ví được giữ nguyên.</p>}
    {!compact && payButton}
    {status === 'PENDING' && <Notice>Tiền đang được giữ để xác nhận booking. Bạn có thể xem lại tại ví; hệ thống tiếp tục kiểm tra nếu mất kết nối. Chưa thanh toán thêm qua PayOS.</Notice>}
    {status === 'FAILED' && <Notice>Booking không nhận khoản thanh toán. Tiền giữ đã được trả lại ví. Bạn có thể dùng PayOS nếu booking còn nhận thanh toán.</Notice>}
    {status === 'REQUIRES_REVIEW' && <Notice>Giao dịch ví cần đối soát. Chưa thanh toán thêm qua PayOS.</Notice>}
    {payment.isError && <Notice error>{errorMessage(payment.error)} Kết quả thanh toán được kiểm tra lại từ hệ thống.</Notice>}
    {result.isError && <Notice error>
      Chưa kiểm tra được giao dịch ví. Tạm dừng thanh toán thêm tới khi xác minh được kết quả.
      <button className={secondary} onClick={() => void result.refetch()}>Kiểm tra lại</button>
    </Notice>}
  </section>
}
