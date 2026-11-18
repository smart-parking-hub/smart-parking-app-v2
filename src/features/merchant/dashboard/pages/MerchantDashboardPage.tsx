import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  fetchMerchantDashboardData,
  fetchRevenueStats,
} from '../api/merchantDashboardApi'
import { MerchantCommandSurface } from '../components/MerchantCommandSurface'
import { MerchantDashboardSkeleton } from '../components/MerchantDashboardSkeleton'
import { RevenueVolumeComboChart } from '../components/RevenueVolumeComboChart'
import { MerchantDashboardFilterForm } from '../components/MerchantDashboardFilterForm'
import { RecentMerchantBookings } from '../components/RecentMerchantBookings'
import { MerchantChannelBreakdownCards } from '../../components/MerchantChannelBreakdownCards'
import { MerchantRevenueByLotTable } from '../../components/MerchantRevenueByLotTable'
import {
  resolveLotTransferGross,
  resolveScopedRevenueMetrics,
} from '../../components/merchantRevenueMetrics'
import {
  Notice,
  Panel,
  Badge,
  money,
  secondary,
} from '@/shared/components/Workspace'
import { Toast } from '@/shared/components/Toast'
import {
  useMerchantDashboardStore,
  type TimeRangeFilter,
} from '../store/merchantDashboardStore'
import { computeDateRange } from '../types/merchantDashboardSchemas'

const TIME_RANGE_LABELS: Record<TimeRangeFilter, string> = {
  ALL: 'Toàn thời gian',
  TODAY: 'Hôm nay',
  WEEK: '7 ngày qua',
  MONTH: '30 ngày qua',
}

export function MerchantDashboardPage() {
  const selectedLotId = useMerchantDashboardStore((s) => s.selectedLotId)
  const timeRange = useMerchantDashboardStore((s) => s.timeRange)
  const setSelectedLotId = useMerchantDashboardStore((s) => s.setSelectedLotId)
  const setTimeRange = useMerchantDashboardStore((s) => s.setTimeRange)
  const toast = useMerchantDashboardStore((s) => s.toast)
  const showToast = useMerchantDashboardStore((s) => s.showToast)
  const clearToast = useMerchantDashboardStore((s) => s.clearToast)

  const dateRange = useMemo(() => computeDateRange(timeRange), [timeRange])
  const usePeriodValues = timeRange !== 'ALL'
  const periodLabel = TIME_RANGE_LABELS[timeRange]

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['merchant-dashboard-summary', timeRange],
    queryFn: () =>
      fetchMerchantDashboardData(dateRange.startDate, dateRange.endDate),
    staleTime: 20000,
  })

  const lotRevenueQuery = useQuery({
    queryKey: ['merchant-revenue-stats', selectedLotId, timeRange],
    queryFn: () =>
      fetchRevenueStats(selectedLotId, dateRange.startDate, dateRange.endDate),
    enabled: selectedLotId !== null,
    staleTime: 20000,
    retry: false,
  })

  const handleManualRefresh = async () => {
    try {
      const summaryRes = await refetch()
      let lotResSuccess = true
      if (selectedLotId !== null) {
        const lotRes = await lotRevenueQuery.refetch()
        lotResSuccess = !lotRes.isError
      }
      if (summaryRes.isError || !lotResSuccess) {
        showToast(
          'Không thể làm mới dữ liệu. Vui lòng kiểm tra kết nối.',
          'error',
        )
      } else {
        showToast(
          'Dữ liệu bảng điều khiển chủ bãi đã được làm mới thành công!',
          'success',
        )
      }
    } catch {
      showToast('Có lỗi xảy ra khi kết nối máy chủ.', 'error')
    }
  }

  if (isLoading && !data) return <MerchantDashboardSkeleton />
  if (error && !data)
    return (
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10 space-y-4">
        <Notice error>
          Không thể tải dữ liệu bảng điều khiển chủ bãi. Vui lòng kiểm tra kết nối
          và thử lại.
        </Notice>
        <button
          type="button"
          className={secondary}
          disabled={isRefetching}
          onClick={() => void refetch()}
        >
          {isRefetching ? 'Đang thử lại...' : 'Tải lại dữ liệu'}
        </button>
      </div>
    )
  if (!data) return null

  const isLotScoped = selectedLotId !== null
  const isLotRevenuePending = isLotScoped && lotRevenueQuery.isPending
  const isLotRevenueError = isLotScoped && lotRevenueQuery.isError && !lotRevenueQuery.data
  const activeRevenue = isLotScoped ? (lotRevenueQuery.data ?? null) : data.revenue

  const currentRevenueSeries = activeRevenue?.series ?? []

  const selectedLotName = data.lots.content.find(
    (l) => l.id === selectedLotId,
  )?.name

  const scopedMetrics = activeRevenue
    ? resolveScopedRevenueMetrics(activeRevenue, usePeriodValues)
    : null

  const currentNetRevenue = scopedMetrics?.transferNet ?? 0
  const currentCashRevenue = scopedMetrics?.cash ?? 0
  const currentCashBookings = scopedMetrics?.cashBookings ?? 0
  const currentTransferRevenue = scopedMetrics?.transferGross ?? 0
  const currentTransferCount = scopedMetrics?.transferCount ?? 0
  const currentTotalRevenue = scopedMetrics?.totalGrossCombined ?? 0
  const currentUnclassifiedRevenue = scopedMetrics?.unclassifiedGross ?? 0
  const currentUnclassifiedCount = scopedMetrics?.unclassifiedCount ?? 0

  const currentBookings = isLotScoped
    ? (lotRevenueQuery.data?.completedBookings ?? '—')
    : data.bookings.totalElements

  const breakdownByLotId = new Map(
    data.revenue.revenueByParkingLot.map((b) => [b.parkingLotId, b]),
  )

  const scopeLabel = selectedLotName
    ? selectedLotName
    : `Tất cả bãi đỗ (${data.lots.totalElements})`

  return (
    <div className="w-full flex flex-col pb-12">
      {/* Toast Feedback Notification */}
      {toast && (
        <div
          data-testid="merchant-dashboard-toast"
          className="fixed top-20 right-4 sm:right-6 z-[100] max-w-sm sm:max-w-md animate-in fade-in slide-in-from-top-2 slide-in-from-right-4 duration-200"
        >
          <Toast
            title={
              toast.type === 'success'
                ? 'Thành công'
                : toast.type === 'error'
                  ? 'Lỗi kết nối'
                  : 'Thông báo'
            }
            message={toast.message}
            variant={toast.type}
            onClose={clearToast}
            duration={4000}
          />
        </div>
      )}

      <MerchantCommandSurface />

      <div className="max-w-[1280px] w-full mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {/* Clean 5-Card KPI Strip — never attributes stale or all-lot numbers to a pending/errored lot */}
        {isLotRevenueError ? (
          <div
            data-testid="merchant-lot-revenue-error"
            className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50/60 p-5"
          >
            <Notice error>
              Không thể tải số liệu doanh thu cho bãi{' '}
              <strong>{selectedLotName ?? `#${selectedLotId}`}</strong>. Vui lòng thử lại.
            </Notice>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={secondary}
                disabled={lotRevenueQuery.isFetching}
                onClick={() => void lotRevenueQuery.refetch()}
              >
                {lotRevenueQuery.isFetching ? 'Đang thử lại...' : 'Thử lại'}
              </button>
              <button
                type="button"
                className="text-xs font-semibold text-[#d95f00] hover:underline cursor-pointer"
                onClick={() => setSelectedLotId(null)}
              >
                ← Quay lại tất cả bãi đỗ
              </button>
            </div>
          </div>
        ) : isLotRevenuePending ? (
          <div
            data-testid="merchant-lot-revenue-skeleton"
            role="status"
            aria-label="Đang tải số liệu bãi đã chọn"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 animate-pulse"
          >
            {[
              'TỔNG DOANH THU (TRƯỚC PHÍ)',
              'TIỀN MẶT THU TẠI BÃI',
              'SỐ DƯ VÍ',
              'BÃI ĐỖ CỦA TÔI',
              'TỔNG LƯỢT ĐẶT CHỖ',
            ].map((label) => (
              <Panel key={label}>
                <p className="font-mono text-xs text-brand-muted">{label}</p>
                <div className="mt-3 h-8 w-32 rounded-lg bg-slate-200" />
              </Panel>
            ))}
          </div>
        ) : (
          <div
            data-testid="merchant-dashboard-kpis"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          >
            <Panel>
              <p className="font-mono text-xs text-brand-muted">
                TỔNG DOANH THU (TRƯỚC PHÍ)
              </p>
              <p
                data-testid="merchant-kpi-total-value"
                className="font-sora text-2xl font-bold mt-3 tabular-nums"
              >
                {money(currentTotalRevenue)}
              </p>
            </Panel>

            <Panel>
              <p className="font-mono text-xs text-brand-muted">
                TIỀN MẶT THU TẠI BÃI
              </p>
              <p
                data-testid="merchant-kpi-cash-value"
                className="font-sora text-2xl font-bold mt-3 tabular-nums"
              >
                {money(currentCashRevenue)}
              </p>
            </Panel>

            <Panel>
              <p className="font-mono text-xs text-brand-muted">SỐ DƯ VÍ</p>
              <p className="font-sora text-2xl font-bold mt-3 tabular-nums">
                {money(data.revenue.currentWalletBalance)}
              </p>
            </Panel>

            <Panel>
              <p className="font-mono text-xs text-brand-muted">BÃI ĐỖ CỦA TÔI</p>
              <p className="font-sora text-2xl font-bold mt-3 tabular-nums">
                {data.lots.totalElements}
              </p>
            </Panel>

            <Panel>
              <p className="font-mono text-xs text-brand-muted">
                TỔNG LƯỢT ĐẶT CHỖ
              </p>
              <p className="font-sora text-2xl font-bold mt-3 tabular-nums">
                {currentBookings}
              </p>
            </Panel>
          </div>
        )}

        {/* Empty Lots Notice */}
        {data.lots.totalElements === 0 && (
          <Notice>
            Bạn chưa có bãi đỗ nào. Đăng ký bãi mới để bắt đầu quản lý.
          </Notice>
        )}

        {/* Filter Form Toolbar */}
        {data.lots.totalElements > 0 && (
          <MerchantDashboardFilterForm
            lots={data.lots.content}
            totalLots={data.lots.totalElements}
            selectedLotId={selectedLotId}
            selectedLotName={selectedLotName}
            currentNetRevenueFormatted={
              activeRevenue ? money(currentTotalRevenue) : undefined
            }
            timeRange={timeRange}
            onLotChange={setSelectedLotId}
            onTimeRangeChange={setTimeRange}
            onManualRefresh={handleManualRefresh}
            isRefetching={isRefetching || lotRevenueQuery.isRefetching}
          />
        )}

        {/* Channel Revenue Breakdown */}
        {activeRevenue && !isLotRevenuePending && !isLotRevenueError && (
          <MerchantChannelBreakdownCards
            transferAmount={currentTransferRevenue}
            transferCount={currentTransferCount}
            cashAmount={currentCashRevenue}
            cashBookingCount={currentCashBookings}
            unclassifiedAmount={currentUnclassifiedRevenue}
            unclassifiedCount={currentUnclassifiedCount}
            scopeLabel={scopeLabel}
            periodLabel={periodLabel}
          />
        )}

        {/* Main Grid: Chart + Per-Lot Table + Booking List + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Panel title="Doanh thu theo kỳ">
              <RevenueVolumeComboChart
                data={currentRevenueSeries}
                isLoading={lotRevenueQuery.isLoading}
                parkingLotName={selectedLotName}
                totalNetRevenue={currentNetRevenue}
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <Link
                  to="/merchant/revenue"
                  className="underline font-semibold text-brand-navy"
                >
                  Xem báo cáo doanh thu chi tiết
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

            {data.lots.totalElements > 0 && (
              <MerchantRevenueByLotTable
                lots={data.lots.content}
                breakdowns={data.revenue.revenueByParkingLot}
                selectedLotId={selectedLotId}
                onSelectLot={setSelectedLotId}
                usePeriodValues={usePeriodValues}
                useGrossTransfer={true}
                periodLabel={periodLabel}
              />
            )}

            <RecentMerchantBookings bookings={data.bookings.content} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Panel title={`Bãi đỗ của tôi (${data.lots.totalElements})`}>
              {data.lots.content.length === 0 ? (
                <p>Chưa có bãi đỗ.</p>
              ) : (
                <ul className="space-y-4">
                  {data.lots.content.slice(0, 5).map((lot) => {
                    const stats = breakdownByLotId.get(lot.id)
                    const lotCash = usePeriodValues
                      ? (stats?.periodCashRevenue ?? 0)
                      : (stats?.cashRevenue ?? 0)
                    const lotTransfer = resolveLotTransferGross(
                      stats,
                      usePeriodValues,
                    )

                    return (
                      <li
                        key={lot.id}
                        className="space-y-2 border-b border-brand-border pb-3"
                      >
                        <Link
                          to={`/merchant/parking-lots/${lot.id}`}
                          className="font-semibold underline"
                        >
                          {lot.name}
                        </Link>
                        <p className="text-sm text-brand-muted">
                          {lot.address || '—'}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <Badge value={lot.status} />
                          <span className="rounded-md bg-orange-50 px-2 py-0.5 font-mono font-semibold text-[#b84e00] border border-orange-200/80">
                            Tiền mặt: {money(lotCash)}
                          </span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-slate-700">
                            Chuyển khoản: {money(lotTransfer)}
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
              <Link
                to="/merchant/parking-lots"
                className="mt-4 inline-block underline"
              >
                Quản lý bãi đỗ, slot &amp; giá
              </Link>
            </Panel>

            <Panel title="Trạm Barie & Camera ALPR">
              <p className="mb-4 text-sm text-brand-muted">
                Chưa có dữ liệu kết nối camera ALPR.
              </p>
              <Link to="/merchant/qr-scanner" className={secondary}>
                Mở trạm quét QR
              </Link>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}
