import { useQuery } from '@tanstack/react-query'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { fetchMerchantDashboardData } from '../api/merchantDashboardApi'
import { MerchantCommandSurface } from '../components/MerchantCommandSurface'
import { MerchantBentoMetrics } from '../components/MerchantBentoMetrics'
import { RevenueVolumeComboChart } from '../components/RevenueVolumeComboChart'
import { RecentCheckinManifestTable } from '../components/RecentCheckinManifestTable'
import { LiveYardsCapacityList } from '../components/LiveYardsCapacityList'
import { AlprGateControllerCard } from '../components/AlprGateControllerCard'
import { MerchantDashboardSkeleton } from '../components/MerchantDashboardSkeleton'

export function MerchantDashboardPage() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['merchant-dashboard-summary'],
    queryFn: fetchMerchantDashboardData,
    staleTime: 20000,
  })

  if (isLoading) {
    return <MerchantDashboardSkeleton />
  }

  if (error || !data) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
          <h3 className="font-sora text-lg font-bold text-rose-900">
            Không thể tải dữ liệu bảng điều khiển chủ bãi
          </h3>
          <p className="text-xs lg:text-sm text-rose-700 mt-1 mb-5">
            Dịch vụ thống kê doanh thu và cổng trạm ALPR đang gián đoạn kết nối. Vui lòng thử lại.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isRefetching}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d95f00] text-white text-xs font-bold hover:bg-[#b85000] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>{isRefetching ? 'Đang thử lại...' : 'Tải lại dữ liệu'}</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col pb-12">
      {/* Top Command Surface */}
      <MerchantCommandSurface />

      {/* Main Operational Container */}
      <div className="max-w-[1280px] w-full mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {/* Bento Grid: 4 Executive KPI Cards */}
        <MerchantBentoMetrics kpis={data.kpis} />

        {/* Operational Core Canvas (Split 65% : 35% ~ 8 cols : 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (65% ~ 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <RevenueVolumeComboChart data={data.chartData} />
            <RecentCheckinManifestTable checkins={data.recentCheckins} />
          </div>

          {/* Right Column (35% ~ 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <LiveYardsCapacityList yards={data.liveYards} />
            <AlprGateControllerCard feeds={data.alprFeeds} />
          </div>
        </div>
      </div>
    </div>
  )
}
