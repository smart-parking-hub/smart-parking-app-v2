import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { QueryState } from '@/shared/components/QueryState'
import { Workspace, DataTable, Field, control, secondary, money, date } from '@/shared/components/Workspace'
import { getAdminTransactions, transactionKeys, transactionSortOptions, type AdminTransaction, type TransactionSort } from '../api/adminTransactionsApi'
import { TransactionStatus, TransactionType } from '../components/TransactionBadges'
import { TransactionDetailDialog } from '../components/TransactionDetailDialog'

export function AdminTransactionsPage() {
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<TransactionSort>('createdAt,desc')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const query = useQuery({
    queryKey: transactionKeys.list(page, sort),
    queryFn: ({ signal }) => getAdminTransactions(page, sort, signal),
    retry: false,
  })
  const detailButton = (row: AdminTransaction) => <button type="button"
    className={`${secondary} min-h-11 focus-visible:outline-2 focus-visible:outline-brand-primary`}
    aria-label={`Xem chi tiết giao dịch ${row.transactionCode}`}
    onClick={() => setSelectedId(row.id)}>Xem chi tiết</button>

  return <Workspace title="Giám sát giao dịch" eyebrow="ADMIN / PAYMENTS"
    description="Theo dõi các giao dịch thanh toán toàn hệ thống. Chọn giao dịch để xem thông tin mới nhất và đối chiếu."
    actions={<button type="button" className={secondary} disabled={query.isFetching}
      aria-busy={query.isFetching} onClick={() => void query.refetch()}>Làm mới danh sách</button>}>
    <Field label="Sắp xếp giao dịch">
      <select className={`${control} sm:max-w-xs`} value={sort} onChange={event => {
        const option = transactionSortOptions.find(item => item.value === event.target.value)
        if (option) { setSort(option.value); setPage(0) }
      }}>
        {transactionSortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </Field>
    <QueryState query={query}>{data => <DataTable rows={data.content}
      page={page} totalPages={data.totalPages} totalItems={data.totalElements} onPage={setPage}
      emptyText="Chưa có giao dịch thanh toán."
      columns={[
        { label: 'Mã giao dịch', render: row => <span className="break-all font-mono text-xs font-semibold">{row.transactionCode}</span> },
        { label: 'Booking', render: row => row.bookingCode || '—' },
        { label: 'Số tiền', align: 'right', render: row => <span className="whitespace-nowrap font-semibold tabular-nums">{money(row.amount)}</span> },
        { label: 'Loại', render: row => <TransactionType value={row.type} /> },
        { label: 'Trạng thái', render: row => <TransactionStatus value={row.status} /> },
        { label: 'Cổng thanh toán', render: row => row.gateway },
        { label: 'Thời điểm', render: row => <span className="whitespace-nowrap text-xs">{date(row.createdAt)}</span> },
        { label: 'Chi tiết', render: detailButton },
      ]}
      renderMobileCard={row => <article aria-label={`Giao dịch ${row.transactionCode}`}
        className="space-y-3 rounded-xl border border-brand-border p-4">
        <p className="break-all font-mono text-sm font-semibold">{row.transactionCode}</p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TransactionStatus value={row.status} /><span className="font-semibold tabular-nums">{money(row.amount)}</span>
        </div>
        <p className="break-all text-sm">Booking: {row.bookingCode || '—'}</p>
        <div className="flex flex-wrap items-center gap-2"><TransactionType value={row.type} /><span>{row.gateway}</span></div>
        <p className="text-xs text-brand-muted">{date(row.createdAt)}</p>
        {detailButton(row)}
      </article>} />}</QueryState>
    {selectedId !== null && <TransactionDetailDialog key={selectedId} id={selectedId} onClose={() => setSelectedId(null)} />}
  </Workspace>
}
