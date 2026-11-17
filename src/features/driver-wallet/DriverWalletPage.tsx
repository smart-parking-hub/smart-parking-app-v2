import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { QueryState } from '@/shared/components/QueryState'
import { Workspace, Panel, DataTable, Metrics, Notice, secondary, money } from '@/shared/components/Workspace'
import { getWallet, getWalletEntries, walletKeys, walletEntryLabels } from './api'

export function DriverWalletPage() {
  const [page, setPage] = useState(0)
  const balance = useQuery({ queryKey: walletKeys.balance, queryFn: getWallet, retry: false, refetchInterval: 15000 })
  const entries = useQuery({ queryKey: walletKeys.entries(page), queryFn: () => getWalletEntries(page), retry: false, refetchInterval: 15000 })
  return <Workspace title="Ví của tôi" eyebrow="TÀI XẾ / VÍ" description="Theo dõi tiền hoàn cọc và dùng số dư cho lần đặt tiếp theo."
    actions={<button className={secondary} disabled={balance.isFetching || entries.isFetching} onClick={() => { void balance.refetch(); void entries.refetch() }}>Làm mới ví</button>}>
    <Notice>Số dư ví dùng để trả toàn bộ tiền cọc khi đủ tiền. Hiện chưa hỗ trợ nạp, rút về ngân hàng hoặc kết hợp ví với PayOS.</Notice>
    <QueryState query={balance}>{data => <>
      <Metrics items={[{ label: 'Số dư khả dụng', value: money(data.availableAmount) }, { label: 'Đang giữ chờ xác nhận', value: money(data.heldAmount), note: 'Tự cập nhật sau khi có kết quả thanh toán' }]} />
      {!data.enabled && <Notice>Thanh toán và hoàn ví mới đang tạm dừng. Giao dịch đang xử lý vẫn được kiểm tra kết quả.</Notice>}
    </>}</QueryState>
    <Panel title="Lịch sử ví"><QueryState query={entries}>{data => <DataTable rows={data.content} page={page} totalPages={data.totalPages} totalItems={data.totalElements} onPage={setPage}
      renderMobileCard={row => <article aria-label={`Giao dịch ví ${row.id}`} className="space-y-3 rounded-xl border border-brand-border p-4">
        <p className="font-semibold">{walletEntryLabels[row.entryType] ?? row.entryType}</p>
        <dl className="space-y-2 text-sm"><div className="flex justify-between gap-3"><dt>Khả dụng +/−</dt><dd className="font-semibold">{row.amount > 0 ? '+' : ''}{money(row.amount)}</dd></div><div className="flex justify-between gap-3"><dt>Tiền giữ +/−</dt><dd>{row.heldDelta > 0 ? '+' : ''}{money(row.heldDelta)}</dd></div></dl>
        <p className="text-xs text-brand-muted">{new Date(`${row.createdAt}+07:00`).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
        {row.bookingId && <Link className="text-sm text-brand-primary underline" to={`/bookings?bookingId=${row.bookingId}`}>Xem đặt chỗ #{row.bookingId}</Link>}
      </article>}
      emptyText="Chưa có biến động ví. Khoản hoàn cọc hợp lệ sẽ xuất hiện tại đây."
      columns={[
        { label: 'Thời gian', render: row => new Date(`${row.createdAt}+07:00`).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) },
        { label: 'Nội dung', render: row => walletEntryLabels[row.entryType] ?? row.entryType },
        { label: 'Khả dụng +/−', align: 'right', render: row => `${row.amount > 0 ? '+' : ''}${money(row.amount)}` },
        { label: 'Tiền giữ +/−', align: 'right', render: row => `${row.heldDelta > 0 ? '+' : ''}${money(row.heldDelta)}` },
        { label: 'Đặt chỗ', render: row => row.bookingId ? <Link className="text-brand-primary underline" to={`/bookings?bookingId=${row.bookingId}`}>#{row.bookingId}</Link> : '—' },
        { label: 'Giao dịch', render: row => row.paymentId ? `#${row.paymentId}` : '—' },
      ]} />}</QueryState></Panel>
  </Workspace>
}
