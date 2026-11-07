import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Workspace, Panel, Notice, Metrics, Field, control, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { fetchPaymentPage, paymentMoney, paymentTime, paymentStatusLabels, paymentTypeLabels, type PaymentRecord } from '../api/paymentDataApi'

export function DriverPaymentsPage() {
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<PaymentRecord['status'] | ''>('')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const query = useQuery({ queryKey: ['driver-payment-page', page], queryFn: () => fetchPaymentPage(page), retry: false })
  const rows = query.data?.content ?? []
  const filtered = rows.filter(item => (!status || item.status === status) && `${item.transactionCode ?? ''} ${item.bookingId}`.toLowerCase().includes(search.trim().toLowerCase()))
  const selected = rows.find(item => item.id === selectedId)
  const successful = rows.filter(item => item.status === 'SUCCESS' && item.type !== 'REFUND')
  return <Workspace eyebrow="TÀI KHOẢN / GIAO DỊCH" title="Lịch sử thanh toán" description="Theo dõi các giao dịch thanh toán của tài khoản. Thời gian hiển thị theo giờ Việt Nam (UTC+7)." actions={<Link className={secondary} to="/bookings">Xem đặt chỗ</Link>}>
    {query.isPending ? <p role="status">Đang tải giao dịch…</p> : query.isError ? <Notice error><div>{errorMessage(query.error)}<button className={`${secondary} mt-3`} onClick={() => void query.refetch()}>Thử lại</button></div></Notice> : <>
      <Metrics items={[
        { label: 'Tổng giao dịch', value: query.data.totalElements },
        { label: 'Đã thanh toán trên trang này', value: paymentMoney(successful.reduce((sum, item) => sum + item.amount, 0)), note: 'Chỉ cộng giao dịch thành công, không gồm khoản hoàn tiền.' },
        { label: 'Chờ thanh toán trên trang này', value: rows.filter(item => item.status === 'PENDING').length },
        { label: 'Cần đối soát trên trang này', value: rows.filter(item => item.status === 'REQUIRES_REVIEW').length },
      ]} />
      {query.data.totalElements === 0 ? <Notice>Bạn chưa có giao dịch thanh toán nào.</Notice> : <Panel title="Danh sách giao dịch">
        <div className="mb-6 grid gap-4 sm:grid-cols-2"><Field label="Tìm trong trang hiện tại"><input className={control} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Mã giao dịch hoặc ID booking" /></Field><Field label="Trạng thái trong trang hiện tại"><select aria-label="Trạng thái trong trang hiện tại" className={control} value={status} onChange={event => setStatus(event.target.value as PaymentRecord['status'] | '')}><option value="">Tất cả</option>{Object.entries(paymentStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field></div>
        {!filtered.length ? <Notice>Không có giao dịch phù hợp trong trang này.</Notice> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-brand-border text-brand-muted">{['Giao dịch / Booking', 'Thời gian', 'Loại thanh toán', 'Kênh', 'Số tiền', 'Trạng thái', 'Thao tác'].map(label => <th scope="col" className="p-3" key={label}>{label}</th>)}</tr></thead><tbody>{filtered.map(item => <tr key={item.id} className="border-b border-brand-border"><td className="p-3"><p className="max-w-56 break-all font-semibold">{item.transactionCode || `Giao dịch #${item.id}`}</p><p className="mt-1 text-brand-muted">Booking #{item.bookingId}</p></td><td className="p-3">{paymentTime(item.createdAt)}</td><td className="p-3">{paymentTypeLabels[item.type]}</td><td className="p-3">{item.gateway === 'DEMO' ? 'Demo (thử nghiệm)' : item.gateway}</td><td className="whitespace-nowrap p-3 font-semibold tabular-nums">{paymentMoney(item.amount)}</td><td className="p-3"><span className={`inline-flex whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold ${item.status === 'SUCCESS' ? 'bg-brand-surface text-brand-navy' : 'border border-brand-border text-brand-navy'}`}>{paymentStatusLabels[item.status]}</span></td><td className="p-3"><button className={secondary} onClick={() => setSelectedId(item.id)} aria-label={`Chi tiết giao dịch ${item.transactionCode || item.id}`}>Chi tiết</button></td></tr>)}</tbody></table></div>}
        <div className="mt-5 flex flex-wrap items-center gap-3"><span className="text-sm text-brand-muted">Trang {query.data.currentPage + 1}/{Math.max(1, query.data.totalPages)}</span><button className={secondary} disabled={page === 0} onClick={() => { setSelectedId(null); setSearch(''); setStatus(''); setPage(page - 1) }}>Trang trước</button><button className={secondary} disabled={page + 1 >= query.data.totalPages} onClick={() => { setSelectedId(null); setSearch(''); setStatus(''); setPage(page + 1) }}>Trang sau</button><button className={secondary} disabled={query.isFetching} onClick={() => void query.refetch()}>Làm mới</button></div>
      </Panel>}
      {selected && <Panel title="Chi tiết giao dịch"><dl className="grid gap-4 sm:grid-cols-2">{[
        ['Mã giao dịch', selected.transactionCode || `#${selected.id}`], ['Booking', `#${selected.bookingId}`],
        ['Bãi đỗ', selected.parkingLotId == null ? '—' : `#${selected.parkingLotId}`], ['Mã đơn thanh toán', selected.orderCode ?? '—'],
        ['Số tiền', paymentMoney(selected.amount)], ['Trạng thái', paymentStatusLabels[selected.status]],
      ].map(([label, value]) => <div key={label}><dt className="text-sm text-brand-muted">{label}</dt><dd className="mt-1 break-all font-semibold">{value}</dd></div>)}</dl>{selected.status === 'REQUIRES_REVIEW' && <div className="mt-5"><Notice>Giao dịch đang cần đối soát. Kiểm tra trạng thái booking trước khi thực hiện thanh toán khác.</Notice></div>}<button className={`${secondary} mt-5`} onClick={() => setSelectedId(null)}>Đóng chi tiết</button></Panel>}
    </>}
  </Workspace>
}
