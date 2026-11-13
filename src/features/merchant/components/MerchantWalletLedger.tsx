import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { QueryState } from '@/shared/components/QueryState'
import { DataTable, Panel, date, money, secondary } from '@/shared/components/Workspace'
import { getMerchantLedger, ledgerEntryLabels } from '../operations/merchantFinanceApi'

export function MerchantWalletLedger() {
  const [page, setPage] = useState(0)
  const query = useQuery({
    queryKey: ['merchant-wallet-ledger', page],
    queryFn: () => getMerchantLedger(page),
    retry: false,
  })
  return (
    <Panel title="Sổ cái ví">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-brand-muted">Các bút toán ví đã ghi nhận, mới nhất trước. Số dương cộng vào ví, số âm trừ khỏi ví. Bộ lọc doanh thu không áp dụng cho sổ cái.</p>
        <button type="button" className={secondary} disabled={query.isFetching} onClick={() => void query.refetch()}>Làm mới sổ cái</button>
      </div>
      <QueryState query={query}>{data => (
        <DataTable rows={data.content} page={page} totalPages={data.totalPages} totalItems={data.totalElements} onPage={setPage}
          emptyText="Chưa có biến động ví."
          columns={[
            { label: 'Bút toán', render: entry => `#${entry.id}` },
            { label: 'Thời gian', render: entry => date(entry.createdAt) },
            { label: 'Loại', render: entry => ledgerEntryLabels[entry.entryType] ?? entry.entryType },
            { label: 'Đặt chỗ', render: entry => entry.bookingId === null ? '—' : `#${entry.bookingId}` },
            { label: 'Gộp', align: 'right', render: entry => money(entry.grossAmount) },
            { label: 'Phí', align: 'right', render: entry => money(entry.feeAmount) },
            { label: 'Biến động ví', align: 'right', render: entry => `${entry.netAmount > 0 ? '+' : ''}${money(entry.netAmount)}` },
            { label: 'Ghi chú', render: entry => entry.note || '—' },
          ]} />
      )}</QueryState>
    </Panel>
  )
}
