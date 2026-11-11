import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchMerchantDashboardData, fetchRevenueStats } from '../api/merchantDashboardApi'
import { MerchantCommandSurface } from '../components/MerchantCommandSurface'
import { MerchantDashboardSkeleton } from '../components/MerchantDashboardSkeleton'
import { RevenueVolumeComboChart } from '../components/RevenueVolumeComboChart'
import { Notice, Panel, Badge, money, secondary } from '@/shared/components/Workspace'

export function MerchantDashboardPage() {
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null)

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['merchant-dashboard-summary'],
    queryFn: fetchMerchantDashboardData,
    staleTime: 20000,
  })

  const lotRevenueQuery = useQuery({
    queryKey: ['merchant-revenue-stats', selectedLotId],
    queryFn: () => fetchRevenueStats(selectedLotId),
    enabled: selectedLotId !== null,
    staleTime: 20000,
  })

  if (isLoading) return <MerchantDashboardSkeleton />
  if (error || !data) return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10 space-y-4">
      <Notice error>Không thể tải dữ liệu bảng điều khiển chủ bãi. Vui lòng kiểm tra kết nối và thử lại.</Notice>
      <button type="button" className={secondary} disabled={isRefetching} onClick={() => void refetch()}>
        {isRefetching ? 'Đang thử lại...' : 'Tải lại dữ liệu'}
      </button>
    </div>
  )

  const currentRevenueSeries =
    selectedLotId !== null ? (lotRevenueQuery.data?.series ?? []) : data.revenue.series

  const selectedLotName = data.lots.content.find((l) => l.id === selectedLotId)?.name

  const currentNetRevenue =
    selectedLotId !== null
      ? (lotRevenueQuery.data?.totalNetRevenue ?? 0)
      : data.revenue.totalNetRevenue

  const currentBookings =
    selectedLotId !== null
      ? (lotRevenueQuery.data?.completedBookings ?? '—')
      : data.bookings.totalElements

  const metrics = [
    ['TỔNG DOANH THU THỰC NHẬN', money(currentNetRevenue)],
    ['SỐ DƯ VÍ', money(data.revenue.currentWalletBalance)],
    ['BÃI ĐỖ CỦA TÔI', data.lots.totalElements],
    ['TỔNG LƯỢT ĐẶT CHỖ', currentBookings],
  ] as const
  return (
    <div className="w-full flex flex-col pb-12">
      <MerchantCommandSurface />
      <div className="max-w-[1280px] w-full mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {metrics.map(([label, value]) => <Panel key={label}>
            <p className="font-mono text-xs text-brand-muted">{label}</p>
            <p className="font-sora text-2xl font-bold mt-3">{value}</p>
          </Panel>)}
        </div>
        {data.lots.totalElements === 0 && <Notice>Bạn chưa có bãi đỗ nào. Đăng ký bãi mới để bắt đầu quản lý.</Notice>}
        {data.lots.totalElements > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-2 text-sm text-[#0d1c2e] font-semibold">
              <label htmlFor="lot-filter-select" className="shrink-0">
                Lọc theo cơ sở bãi đỗ:
              </label>
              <select
                id="lot-filter-select"
                aria-label="Lọc theo cơ sở bãi đỗ"
                value={selectedLotId ?? ''}
                onChange={(e) => setSelectedLotId(e.target.value ? Number(e.target.value) : null)}
                className="bg-[#eff4ff] border border-blue-100 text-[#0d1c2e] text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#d95f00]"
              >
                <option value="">Tất cả bãi đỗ ({data.lots.totalElements})</option>
                {data.lots.content.map((lot) => (
                  <option key={lot.id} value={lot.id}>
                    {lot.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedLotId !== null && (
              <span className="font-mono text-xs text-[#d95f00] font-bold">
                <span>Đang xem bãi: {selectedLotName}</span>
                <span className="ml-1 text-slate-500 font-normal">({money(currentNetRevenue)})</span>
              </span>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Panel title="Doanh thu theo kỳ">
              <RevenueVolumeComboChart
                data={currentRevenueSeries}
                isLoading={lotRevenueQuery.isLoading}
                parkingLotName={selectedLotName}
                totalNetRevenue={
                  selectedLotId !== null
                    ? (lotRevenueQuery.data?.totalNetRevenue ?? 0)
                    : data.revenue.totalNetRevenue
                }
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <Link to="/merchant/revenue" className="underline font-semibold text-brand-navy">
                  Xem báo cáo doanh thu
                </Link>
                {selectedLotId !== null && (
                  <button
                    type="button"
                    onClick={() => setSelectedLotId(null)}
                    className="font-mono text-[#d95f00] hover:underline cursor-pointer"
                  >
                    ← Trở lại xem tất cả bãi đỗ
                  </button>
                )}
              </div>
            </Panel>
            <Panel title="Đặt chỗ gần nhất">
              {data.bookings.content.length === 0 ? <Notice>Chưa có lượt đặt chỗ.</Notice> : <ul className="space-y-4">
                {data.bookings.content.map(booking => <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border pb-3">
                  <Link to={`/merchant/bookings/${booking.id}`} className="underline">{booking.bookingCode}</Link>
                  <span>{booking.vehicleLicensePlate || '—'}</span><span>{booking.parkingLotName || '—'}</span><Badge value={booking.status} />
                </li>)}
              </ul>}
              <Link to="/merchant/bookings" className="mt-4 inline-block underline">Xem tất cả đặt chỗ</Link>
            </Panel>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Panel title={`Bãi đỗ của tôi (${data.lots.totalElements})`}>
              {data.lots.content.length === 0 ? <p>Chưa có bãi đỗ.</p> : <ul className="space-y-4">
                {data.lots.content.slice(0, 5).map(lot => <li key={lot.id} className="space-y-2 border-b border-brand-border pb-3">
                  <Link to={`/merchant/parking-lots/${lot.id}`} className="font-semibold underline">{lot.name}</Link>
                  <p className="text-sm text-brand-muted">{lot.address || '—'}</p><Badge value={lot.status} />
                </li>)}
              </ul>}
              <Link to="/merchant/parking-lots" className="mt-4 inline-block underline">Quản lý bãi đỗ, slot &amp; giá</Link>
            </Panel>
            <Panel title="Trạm Barie & Camera ALPR">
              <p className="mb-4 text-sm text-brand-muted">Chưa có dữ liệu kết nối camera ALPR.</p>
              <Link to="/merchant/qr-scanner" className={secondary}>Mở trạm quét QR</Link>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}
