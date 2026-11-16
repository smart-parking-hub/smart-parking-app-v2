import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, ChevronLeft, ChevronRight, ListFilter, ReceiptText, RefreshCw, Search, SearchX } from 'lucide-react'
import { Workspace, Notice, Field, control, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { fetchPaymentPage, paymentStatusLabels, type PaymentRecord } from '../api/paymentDataApi'
import { DriverPaymentSummary } from '../components/DriverPaymentSummary'
import { DriverPaymentList } from '../components/DriverPaymentList'
import { DriverPaymentDetails } from '../components/DriverPaymentDetails'

export function DriverPaymentsPage() {
  const [searchParams] = useSearchParams()
  const bookingParam = searchParams.get('bookingId') ?? searchParams.get('bookingCode') ?? searchParams.get('search') ?? ''
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<PaymentRecord['status'] | ''>('')
  const [search, setSearch] = useState(bookingParam)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const query = useQuery({ queryKey: ['driver-payment-page', page], queryFn: () => fetchPaymentPage(page), retry: false })
  const rows = query.data?.content ?? []

  useEffect(() => {
    if (bookingParam && rows.length > 0 && selectedId === null) {
      const match = rows.find(
        (item) => String(item.bookingId) === bookingParam || item.transactionCode === bookingParam
      )
      if (match) {
        setSelectedId(match.id)
      }
    }
  }, [bookingParam, rows, selectedId])
  const filtered = rows.filter(item => (!status || item.status === status) && `${item.transactionCode ?? ''} ${item.bookingId}`.toLowerCase().includes(search.trim().toLowerCase()))
  const selected = rows.find(item => item.id === selectedId)
  const resetFilters = () => { setSearch(''); setStatus('') }
  const changePage = (next: number) => { setSelectedId(null); resetFilters(); setPage(next) }

  return <Workspace eyebrow="TÀI KHOẢN / GIAO DỊCH" title="Lịch sử thanh toán" description="Theo dõi tiền cọc, thanh toán và hoàn tiền của bạn tại một nơi." actions={<Link className={`${secondary} !min-h-10 !py-2.5 !text-xs`} to="/bookings">Xem đặt chỗ<ArrowUpRight size={16} aria-hidden="true" /></Link>}>
    {query.isPending ? <div role="status" className="space-y-4"><p className="text-sm text-brand-muted">Đang tải giao dịch…</p><div className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-hidden="true">{[1, 2, 3, 4].map(value => <div key={value} className="h-36 animate-pulse rounded-2xl border border-brand-border bg-white" />)}</div><div aria-hidden="true" className="h-72 animate-pulse rounded-2xl border border-brand-border bg-white" /></div>
      : query.isError ? <Notice error><div>{errorMessage(query.error)}<button className={`${secondary} mt-3`} onClick={() => void query.refetch()}>Thử lại</button></div></Notice>
        : <>
          <DriverPaymentSummary rows={rows} total={query.data.totalElements} />
          {query.data.totalElements === 0 ? <section className="rounded-2xl border border-brand-border bg-white px-6 py-14 text-center"><span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-surface text-brand-muted"><ReceiptText size={25} aria-hidden="true" /></span><h2 className="font-sora text-lg font-semibold">Bạn chưa có giao dịch thanh toán nào.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-brand-muted">Các khoản thanh toán sẽ xuất hiện ở đây khi bạn sử dụng dịch vụ đặt chỗ.</p><Link className={`${secondary} mt-5 !text-xs`} to="/bookings">Xem đặt chỗ<ArrowUpRight size={15} aria-hidden="true" /></Link></section>
            : <section aria-labelledby="payment-list-title" className="overflow-hidden rounded-2xl border border-brand-border bg-white">
              <div className="space-y-5 p-4 sm:p-5 lg:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5"><h2 id="payment-list-title" className="font-sora text-base font-semibold">Danh sách giao dịch</h2><span className="rounded-md bg-brand-surface px-2 py-0.5 text-xs font-medium text-brand-muted">{filtered.length}</span></div>
                  <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50" disabled={query.isFetching} onClick={() => void query.refetch()}><RefreshCw size={14} aria-hidden="true" className={query.isFetching ? 'animate-spin' : ''} />Làm mới</button>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="min-w-0 flex-1"><Field label="Tìm trong trang hiện tại"><span className="relative block"><Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" /><input className={`${control} !min-h-11 !py-2.5 !pl-10 !text-xs`} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Mã giao dịch hoặc ID booking" /></span></Field></div>
                  <div className="sm:w-64"><Field label="Trạng thái trong trang hiện tại"><span className="relative block"><ListFilter size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" /><select aria-label="Trạng thái trong trang hiện tại" className={`${control} !min-h-11 !py-2.5 !pl-10 !text-xs`} value={status} onChange={event => setStatus(event.target.value as PaymentRecord['status'] | '')}><option value="">Tất cả trạng thái</option>{Object.entries(paymentStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></span></Field></div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[11px] leading-relaxed text-brand-muted"><p>Số liệu thanh toán và bộ lọc áp dụng cho trang hiện tại.</p><span>Giờ Việt Nam · UTC+7</span></div>
              </div>
              {!filtered.length ? <div className="border-y border-brand-border px-5 py-12 text-center"><SearchX size={28} className="mx-auto mb-3 text-brand-muted" aria-hidden="true" /><p className="text-sm font-medium">Không có giao dịch phù hợp trong trang này.</p><button type="button" onClick={resetFilters} className={`${secondary} mt-4 !min-h-10 !py-2 !text-xs`}>Xóa bộ lọc</button></div> : <DriverPaymentList rows={filtered} onSelect={setSelectedId} />}
              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-border px-4 py-4 sm:px-6">
                <p className="text-xs text-brand-muted">Trang <span className="font-semibold text-brand-navy">{query.data.currentPage + 1}/{Math.max(1, query.data.totalPages)}</span><span className="mx-2 text-brand-border">|</span>{filtered.length} / {rows.length} giao dịch trên trang</p>
                <div className="flex gap-2"><button type="button" className={`${secondary} !min-h-10 !px-3 !py-2 !text-xs`} disabled={page === 0} onClick={() => changePage(page - 1)}><ChevronLeft size={15} aria-hidden="true" />Trang trước</button><button type="button" className={`${secondary} !min-h-10 !px-3 !py-2 !text-xs`} disabled={page + 1 >= query.data.totalPages} onClick={() => changePage(page + 1)}>Trang sau<ChevronRight size={15} aria-hidden="true" /></button></div>
              </footer>
            </section>}
          {selected && <DriverPaymentDetails payment={selected} onClose={() => setSelectedId(null)} />}
        </>}
  </Workspace>
}
