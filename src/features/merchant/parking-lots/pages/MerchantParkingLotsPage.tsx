import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchMerchantLotCounts, fetchMerchantParkingLots, type OwnedMerchantLot } from '../api/merchantParkingLotApi'
import { MerchantParkingLotsHeader } from '../components/MerchantParkingLotsHeader'
import { MerchantParkingLotsMetrics } from '../components/MerchantParkingLotsMetrics'
import { MerchantParkingLotsFilterBar, type ViewMode } from '../components/MerchantParkingLotsFilterBar'
import { MerchantParkingLotsPagination } from '../components/MerchantParkingLotsPagination'
import { MerchantParkingLotsSkeleton } from '../components/MerchantParkingLotsSkeleton'
import { Notice, Badge, secondary, date } from '@/shared/components/Workspace'

function LotActions({ lot }: { lot: OwnedMerchantLot }) {
  const root = `/merchant/parking-lots/${lot.id}`
  return <div className="flex flex-wrap gap-3 text-xs font-semibold">
    <Link className="underline" to={root}>Chi tiết</Link>
    {lot.status === 'APPROVED' ? <>
      <Link className="underline" to={`${root}/slots`}>Cấu hình slot</Link>
      <Link className="underline" to={`${root}/pricing`}>Bảng giá</Link>
      <Link className="underline" to={`/merchant/qr-scanner?yardId=${lot.id}`}>Quét QR</Link>
    </> : <Link className="underline" to={`${root}/edit`}>Chỉnh sửa hồ sơ</Link>}
  </div>
}

export function MerchantParkingLotsPage() {
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState('ALL')
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('createdAt,desc')
  const [viewMode, setViewMode] = useState<ViewMode>(() => localStorage.getItem('merchant_lots_view_mode') === 'table' ? 'table' : 'grid')
  const size = 10
  const list = useQuery({
    queryKey: ['merchant-owned-parking-lots', { page, size, status, keyword, sort }],
    staleTime: 0,
    queryFn: ({ signal }) => fetchMerchantParkingLots({ page, size, status, keyword, sort }, signal),
  })
  const counts = useQuery({
    queryKey: ['merchant-owned-parking-lot-counts'],
    staleTime: 0,
    queryFn: ({ signal }) => fetchMerchantLotCounts(signal),
  })
  const data = list.isError ? undefined : list.data
  const filtered = Boolean(keyword.trim() || status !== 'ALL')
  function exportPage() {
    if (!data?.content.length) return
    const cell = (value: unknown) => {
      const text = String(value ?? '')
      return `"${(/^[=+@\-\t\r\n]/.test(text) ? "'" + text : text).replace(/"/g, '""')}"`
    }
    const rows = [['ID', 'Tên bãi', 'Địa chỉ', 'Trạng thái', 'Ngày tạo'], ...data.content.map(lot => [lot.id, lot.name, lot.address, lot.status, lot.createdAt])]
    const url = URL.createObjectURL(new Blob(['\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `bai-do-trang-${page + 1}.csv`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <main className="w-full bg-[#f8f9ff] min-h-screen pb-16">
    <MerchantParkingLotsHeader onOpenExportModal={exportPage} exportDisabled={!data?.content.length || list.isFetching} />
    <MerchantParkingLotsMetrics counts={counts.isError ? undefined : counts.data} />
    {counts.isError && <div className="max-w-[1280px] mx-auto px-4 mt-4"><Notice error>
      Không tải được số lượng bãi. <button className="underline" onClick={() => void counts.refetch()} disabled={counts.isFetching}>Tải lại thống kê</button>
    </Notice></div>}
    <MerchantParkingLotsFilterBar keyword={keyword} onKeywordChange={value => { setPage(0); setKeyword(value) }}
      status={status} onStatusChange={value => { setPage(0); setStatus(value) }}
      sort={sort} onSortChange={value => { setPage(0); setSort(value) }}
      viewMode={viewMode} onViewModeChange={value => { setViewMode(value); localStorage.setItem('merchant_lots_view_mode', value) }}
      totalResults={data?.totalElements ?? 0} />
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      {list.isPending ? <MerchantParkingLotsSkeleton /> : list.isError ? <Notice error>
        Không thể tải danh sách bãi đỗ. Vui lòng thử lại.
        <button className="underline" onClick={() => void list.refetch()} disabled={list.isFetching}>Thử lại</button>
      </Notice> : data && data.content.length === 0 ? <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-2xs space-y-4">
        <h2 className="font-sora text-base font-bold text-[#0d1c2e]">{filtered ? 'Không tìm thấy bãi đỗ nào phù hợp bộ lọc' : 'Bạn chưa đăng ký bãi đỗ xe nào'}</h2>
        {filtered && <button className={secondary} onClick={() => { setKeyword(''); setStatus('ALL'); setPage(0) }}>Xóa Bộ Lọc</button>}
        <Link className={secondary} to="/merchant/parking-lots/new">Đăng ký bãi đỗ mới</Link>
      </div> : data && (viewMode === 'grid' ? <section className="grid gap-5 md:grid-cols-2" aria-label="Danh sách bãi đỗ dạng lưới">
        {data.content.map(lot => <article key={lot.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-sora font-bold text-brand-navy">{lot.name}</h2><Badge value={lot.status} />
          <p className="text-sm text-brand-muted">{lot.address || 'Chưa có địa chỉ'}</p>
          <p className="text-xs text-brand-muted">Ngày tạo: {date(lot.createdAt)}</p><LotActions lot={lot} />
        </article>)}
      </section> : <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white" aria-label="Danh sách bãi đỗ dạng bảng">
        <table className="w-full text-left text-sm"><thead className="bg-[#eff4ff]"><tr>
          {['Tên cơ sở', 'Địa chỉ vận hành', 'Trạng thái', 'Ngày tạo', 'Thao tác'].map(title => <th key={title} scope="col" className="p-4">{title}</th>)}
        </tr></thead><tbody>{data.content.map(lot => <tr key={lot.id} className="border-t border-slate-100">
          <td className="p-4 font-semibold">{lot.name}</td><td className="p-4">{lot.address || '—'}</td>
          <td className="p-4"><Badge value={lot.status} /></td><td className="p-4">{date(lot.createdAt)}</td><td className="p-4"><LotActions lot={lot} /></td>
        </tr>)}</tbody></table>
      </section>)}
      {data && data.content.length > 0 && <MerchantParkingLotsPagination currentPage={data.currentPage} totalPages={data.totalPages}
        totalElements={data.totalElements} pageSize={size} onPageChange={setPage} />}
    </div>
  </main>
}
