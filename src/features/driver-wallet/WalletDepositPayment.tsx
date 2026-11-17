import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Notice, secondary, money } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { getWallet, getWalletPayment, payWalletDeposit, walletKeys } from './api'

export function WalletDepositPayment({ bookingId, amount, onComplete, onPendingChange, disabled = false }: { bookingId: number; amount: number; onComplete: () => Promise<void>; onPendingChange?: (pending: boolean) => void; disabled?: boolean }) {
  const cache = useQueryClient()
  const wallet = useQuery({ queryKey: walletKeys.balance, queryFn: getWallet, retry: false })
  const payment = useMutation({ mutationFn: () => payWalletDeposit(bookingId), retry: false,
    onSuccess: async () => { await cache.invalidateQueries({ queryKey: walletKeys.all }); await onComplete() } })
  const result = useQuery({ queryKey: ['wallet-payment', payment.data?.id], queryFn: () => getWalletPayment(payment.data!.id),
    enabled: payment.data?.status === 'PENDING', retry: false,
    refetchInterval: query => query.state.data?.status === 'PENDING' || !query.state.data ? 3000 : false })
  const resultStatus = result.data?.status
  useEffect(() => {
    if (resultStatus && resultStatus !== 'PENDING') {
      void cache.invalidateQueries({ queryKey: walletKeys.all })
      void cache.invalidateQueries({ queryKey: ['booking', bookingId] })
      void cache.invalidateQueries({ queryKey: ['real-bookings'] })
      void cache.invalidateQueries({ queryKey: ['driver-payment-page'] })
    }
  }, [resultStatus, cache, bookingId])
  const status = resultStatus ?? payment.data?.status
  const pending = payment.isPending || status === 'PENDING'
  useEffect(() => { onPendingChange?.(pending); return () => onPendingChange?.(false) }, [pending, onPendingChange])
  return <section aria-label="Thanh toán bằng ví" className="space-y-3 rounded-xl border border-brand-border p-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm">Ví khả dụng: <strong>{wallet.data ? money(wallet.data.availableAmount) : 'Đang kiểm tra…'}</strong></p><Link className="text-sm text-brand-primary underline" to="/wallet">Xem ví</Link></div>
    {wallet.isError && <Notice error>{errorMessage(wallet.error)} <button className={secondary} onClick={() => void wallet.refetch()}>Thử lại</button></Notice>}
    {wallet.data && !wallet.data.enabled && <p className="text-sm text-brand-muted">Thanh toán ví đang tạm dừng; bạn có thể dùng PayOS.</p>}
    {wallet.data && wallet.data.availableAmount < amount && !pending && <p className="text-sm text-brand-muted">Ví thiếu {money(amount - wallet.data.availableAmount)}. Thanh toán toàn bộ cọc qua PayOS; số dư ví được giữ nguyên.</p>}
    <button className={secondary} disabled={!wallet.data?.enabled || wallet.data.availableAmount < amount || pending || disabled || status === 'SUCCESS' || status === 'FAILED' || status === 'REFUNDED' || status === 'REQUIRES_REVIEW'} onClick={() => payment.mutate()}>{pending ? 'Đang xác nhận cọc bằng ví…' : `Trả ${money(amount)} bằng ví`}</button>
    {status === 'PENDING' && <Notice>Tiền đang được giữ để xác nhận booking. Bạn có thể xem lại tại ví; hệ thống tiếp tục kiểm tra nếu mất kết nối. Chưa thanh toán thêm qua PayOS.</Notice>}
    {status === 'FAILED' && <Notice>Booking không nhận khoản thanh toán. Tiền giữ đã được trả lại ví.</Notice>}
    {payment.isError && <Notice error>{errorMessage(payment.error)}</Notice>}
    {result.isError && <Notice error>Chưa kiểm tra được kết quả. Tiền đang giữ vẫn được hệ thống đối soát; xem ví trước khi thanh toán tiếp.</Notice>}
  </section>
}
