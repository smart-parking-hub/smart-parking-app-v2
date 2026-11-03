import { Building2, Truck, Banknote, ArrowUpRight } from 'lucide-react'
import type { MerchantLotsMetrics } from '../types/merchantParkingLotTypes'

interface MerchantParkingLotsMetricsProps {
  metrics: MerchantLotsMetrics
}

export function MerchantParkingLotsMetrics({ metrics }: MerchantParkingLotsMetricsProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val)
  }

  const formatNumber = (val: number) => {
    return val < 10 ? `0${val}` : `${val}`
  }

  return (
    <section className="w-full bg-[#eff4ff] px-4 sm:px-6 lg:px-8 py-5 border-b border-slate-200/80">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Tổng Cơ Sở Khai Thác
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#455f87]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-sora text-3xl font-bold text-[#0d1c2e]">
              {formatNumber(metrics.totalFacilities)}
            </span>
            <span className="text-xs font-semibold text-slate-500">Cơ sở bến bãi</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
            <span className="text-[#0d1c2e] flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d95f00]" />
              {formatNumber(metrics.activeFacilities)} Đang hoạt động
            </span>
            <span className="text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {formatNumber(metrics.underReviewFacilities)} Đang kiểm duyệt
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Năng Lực Tiếp Nhận
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#455f87]">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-sora text-3xl font-bold text-[#0d1c2e]">
              {metrics.totalCapacity}
            </span>
            <span className="text-xs font-semibold text-slate-500">Tổng Slot Quy Chuẩn</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
            <span className="text-[#d95f00] font-bold">
              {metrics.usedSlots} Đang sử dụng ({metrics.occupancyRate.toFixed(1)}%)
            </span>
            <span className="text-slate-500">
              {metrics.availableSlots} Chỗ trống
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Doanh Thu Tích Lũy Hôm Nay
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#455f87]">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-sora text-2xl sm:text-3xl font-bold text-[#0d1c2e]">
              {formatCurrency(metrics.todayRevenue)}
            </span>
            <span className="font-mono text-xs font-bold text-slate-700">VND</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
            <span className="text-[#0d1c2e] flex items-center gap-1 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#d95f00]" />
              +{metrics.revenueGrowthPercent}% so với hôm qua
            </span>
            <span className="text-slate-500">
              {metrics.todayGatePasses} Lượt qua Barie
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
