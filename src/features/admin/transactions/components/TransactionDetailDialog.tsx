import { useQuery } from '@tanstack/react-query'
import { QueryState } from '@/shared/components/QueryState'
import { Dialog, date, money, secondary } from '@/shared/components/Workspace'
import { getAdminTransaction, transactionKeys } from '../api/adminTransactionsApi'
import { TransactionStatus, TransactionType } from './TransactionBadges'

export function TransactionDetailDialog({ id, onClose }: { id: number; onClose: () => void }) {
  const query = useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: ({ signal }) => getAdminTransaction(id, signal),
    retry: false,
    gcTime: 0,
  })

  return <Dialog title="Chi tiết giao dịch" onClose={onClose}
    description="Thông tin thanh toán để kiểm tra, đối chiếu. Màn hình chỉ đọc.">
    {query.isFetching ? <p role="status">Đang tải chi tiết giao dịch…</p> :
      <QueryState query={query}>{data => <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-border bg-brand-surface p-4">
          <div>
            <p className="text-xs text-brand-muted">Số tiền giao dịch</p>
            <p className="font-sora text-2xl font-bold tabular-nums text-brand-primary">{money(data.amount)}</p>
          </div>
          <TransactionStatus value={data.status} />
        </div>
        <dl className="divide-y divide-brand-border text-sm">
          {[
            ['ID giao dịch', `#${data.id}`],
            ['Mã giao dịch', data.transactionCode],
            ['Mã đặt chỗ (Booking)', data.bookingCode],
            ['ID đặt chỗ', `#${data.bookingId}`],
            ['Người thanh toán (ID)', data.payerUserId == null ? '—' : `#${data.payerUserId}`],
            ['Chủ bãi (tham chiếu hệ thống)', data.merchantName],
            ['Cổng thanh toán', data.gateway],
            ['Loại giao dịch', <TransactionType key="type" value={data.type} />],
            ['Thời điểm tạo', date(data.createdAt)],
            ['Cập nhật lần cuối', date(data.updatedAt)],
          ].map(([label, value]) => <div key={String(label)} className="flex flex-wrap justify-between gap-2 py-3">
            <dt className="text-brand-muted">{label}</dt>
            <dd className="min-w-0 break-all font-semibold text-brand-navy">{value || '—'}</dd>
          </div>)}
        </dl>
        <button type="button" className={secondary} onClick={() => void query.refetch()}>Làm mới chi tiết</button>
      </div>}</QueryState>}
  </Dialog>
}
