import { useState } from 'react'
import { Check, MapPin, Plus, Search, UserRound, Wallet, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Workspace, Panel, Notice, button, control, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { fetchVehiclePage, deactivateVehicle, type VehicleRecord } from '../api/vehicleDataApi'
import { VehiclesTable } from '../components/VehiclesTable'
import { VehicleEditor } from '../components/VehicleEditor'

export function VehiclesPage() {
  const cache = useQueryClient()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<VehicleRecord | 'new' | null>(null)
  const [deleting, setDeleting] = useState<VehicleRecord | null>(null)
  const [success, setSuccess] = useState('')
  const query = useQuery({ queryKey: ['driver-vehicle-page', page], queryFn: () => fetchVehiclePage(page), retry: false })
  const refresh = async () => {
    await Promise.all([
      cache.invalidateQueries({ queryKey: ['driver-vehicle-page'] }),
      cache.invalidateQueries({ queryKey: ['booking-vehicles'] }),
      cache.invalidateQueries({ queryKey: ['driver-dashboard'] }),
    ])
  }
  const remove = useMutation({ mutationFn: deactivateVehicle, onSuccess: async () => { setDeleting(null); setSuccess('Đã ngừng sử dụng phương tiện.'); await refresh() } })
  const vehicles = query.data?.content.filter(vehicle => `${vehicle.licensePlate} ${vehicle.brandModel ?? ''}`.toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi'))) ?? []
  return <Workspace eyebrow="TÀI KHOẢN / PHƯƠNG TIỆN" title="Đội xe của tôi" description="Quản lý phương tiện đăng ký với tài khoản của bạn." actions={<button className={button} disabled={editor !== null} onClick={() => { setSuccess(''); setEditor('new') }}><Plus size={17} aria-hidden="true" />Thêm phương tiện</button>}>
    <nav aria-label="Liên kết tài khoản" className="flex flex-wrap gap-2 text-sm">
      <Link to="/profile" className={`${secondary} !min-h-10 !py-2`}><UserRound size={16} aria-hidden="true" />Hồ sơ</Link>
      <Link to="/payments" className={`${secondary} !min-h-10 !py-2`}><Wallet size={16} aria-hidden="true" />Lịch sử thanh toán</Link>
      <Link to="/parking" className={`${secondary} !min-h-10 !py-2`}><MapPin size={16} aria-hidden="true" />Tìm bãi đỗ</Link>
    </nav>
    {success && <div role="status" className="flex items-center gap-3 rounded-xl border border-brand-orange/20 bg-brand-orange/5 px-4 py-3 text-sm text-brand-navy"><Check size={18} aria-hidden="true" className="text-brand-orange-ink" /><span className="flex-1">{success}</span><button type="button" aria-label="Đóng thông báo lưu xe" className="rounded-lg p-2 hover:bg-brand-orange/10" onClick={() => setSuccess('')}><X size={16} aria-hidden="true" /></button></div>}
    {editor && <VehicleEditor key={editor === 'new' ? 'new' : editor.id} vehicle={editor === 'new' ? undefined : editor} onClose={() => setEditor(null)} onSaved={async () => { setEditor(null); setSuccess('Đã lưu phương tiện.'); await refresh() }} />}
    {deleting && <Panel title="Ngừng sử dụng phương tiện?"><p className="mb-4">Xe {deleting.licensePlate} sẽ không còn được chọn khi đặt chỗ. Thông tin xe vẫn được giữ trong hồ sơ.</p><div className="flex flex-wrap gap-3"><button className={button} disabled={remove.isPending} onClick={() => remove.mutate(deleting.id)}>Xác nhận ngừng sử dụng</button><button className={secondary} disabled={remove.isPending} onClick={() => { setDeleting(null); remove.reset() }}>Hủy</button></div>{remove.isError && <div className="mt-4"><Notice error>{errorMessage(remove.error)}</Notice></div>}</Panel>}
    {query.isPending ? <p role="status">Đang tải phương tiện…</p> : query.isError ? <Notice error><div>{errorMessage(query.error)}<button className={`${secondary} mt-3`} onClick={() => void query.refetch()}>Thử lại</button></div></Notice> : <section aria-labelledby="vehicles-list-title" className="overflow-hidden rounded-2xl border border-brand-border bg-white">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-brand-border bg-brand-surface px-5 py-4">
        <div>
          <h2 id="vehicles-list-title" className="font-sora text-lg font-semibold">Phương tiện đã đăng ký ({query.data.totalElements})</h2>
          <p className="mt-1 text-xs leading-5 text-brand-muted">Chỉ xe đang sử dụng mới được chọn khi đặt chỗ.</p>
        </div>
        {query.data.totalElements > 0 && <div className="w-full sm:w-80">
          <label htmlFor="vehicle-table-search" className="mb-1.5 block text-xs font-medium text-brand-muted">Tìm trong trang hiện tại</label>
          <div className="relative"><Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-3.5 text-brand-muted" /><input id="vehicle-table-search" className={`${control} pl-10`} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Biển số, nhãn hiệu…" /></div>
        </div>}
      </div>
      {query.data.totalElements === 0 ? <div className="p-5"><Notice>Bạn chưa có phương tiện nào. Thêm xe để bắt đầu đặt chỗ.</Notice></div> : <>
        {!vehicles.length ? <div className="p-5"><Notice>Không có phương tiện phù hợp trong trang này.</Notice></div> : <VehiclesTable vehicles={vehicles} onEdit={vehicle => { setSuccess(''); setEditor(vehicle) }} onDeactivate={vehicle => { setSuccess(''); remove.reset(); setDeleting(vehicle) }} />}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-border bg-brand-surface/60 px-5 py-3">
          <p className="text-xs text-brand-muted">Hiển thị {vehicles.length} phương tiện trên trang này</p>
          <div className="flex flex-wrap items-center gap-2"><span className="mr-2 text-xs text-brand-muted">Trang {query.data.currentPage + 1}/{Math.max(1, query.data.totalPages)}</span><button className={`${secondary} !min-h-9 !px-3 !py-2 !text-xs`} disabled={page === 0} onClick={() => { setSearch(''); setPage(page - 1) }}>Trang trước</button><button className={`${secondary} !min-h-9 !px-3 !py-2 !text-xs`} disabled={page + 1 >= query.data.totalPages} onClick={() => { setSearch(''); setPage(page + 1) }}>Trang sau</button></div>
        </div>
      </>}
    </section>}
  </Workspace>
}
