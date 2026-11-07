import { Link } from 'react-router-dom'
import { ArrowUp, Layers, Zap, ChevronRight } from 'lucide-react'
import type { MerchantKpiSummary } from '../types/merchantDashboardTypes'

interface MerchantBentoMetricsProps {
  kpis: MerchantKpiSummary
}

export function MerchantBentoMetrics({ kpis }: MerchantBentoMetricsProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {/* KPI 1: Tổng Doanh Thu Tháng */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col justify-between relative overflow-hidden transition-all hover:border-slate-300">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase tracking-wider text-[#45464d] font-bold">
              TỔNG DOANH THU THÁNG (NET)
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-sora text-2xl lg:text-3xl text-[#0d1c2e] font-bold tracking-tight tabular-nums">
                {formatCurrency(kpis.totalMonthlyRevenueNet)}
              </span>
              <span className="font-mono text-sm text-[#45464d] font-bold">₫</span>
            </div>
          </div>

          <div className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-lg font-mono text-xs font-bold flex items-center gap-1 shadow-2xs">
            <ArrowUp className="w-3.5 h-3.5 text-[#d95f00]" />
            <span className="text-[#d95f00]">+{kpis.revenueGrowthPercent}%</span>
          </div>
        </div>

        <div className="mt-4 pt-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/70">
          <div className="flex justify-between items-center text-[#45464d] font-mono text-[11px] leading-tight">
            <span>Đã trừ {kpis.platformFeePercent}% phí sàn hệ thống</span>
            <span className="text-[#0d1c2e] font-bold">
              Ví: {formatCurrency(kpis.walletBalance)} ₫
            </span>
          </div>
        </div>
      </div>

      {/* KPI 2: Tỷ Lệ Lấp Đầy Trung Bình */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col justify-between transition-all hover:border-slate-300">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase tracking-wider text-[#45464d] font-bold">
              TỶ LỆ LẤP ĐẦY TRUNG BÌNH
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-sora text-2xl lg:text-3xl text-[#0d1c2e] font-bold tracking-tight tabular-nums">
                {kpis.averageOccupancyRate}%
              </span>
              <span className="font-mono text-xs text-[#45464d] font-semibold">
                ({kpis.occupiedSlots}/{kpis.totalSlots} Slot)
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            <Layers className="w-5 h-5 text-slate-700" />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          {/* Stacked Capacity Progress */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex shadow-inner">
            <div
              className="bg-[#d95f00] h-full transition-all duration-500"
              style={{ width: `${(kpis.breakdown.cont40ftPercent * 0.65).toFixed(1)}%` }}
              title={`Container 40FT: ${kpis.breakdown.cont40ftPercent}%`}
            />
            <div
              className="bg-[#455f87] h-full transition-all duration-500"
              style={{ width: `${(kpis.breakdown.heavyTruckPercent * 0.2).toFixed(1)}%` }}
              title={`Tải nặng: ${kpis.breakdown.heavyTruckPercent}%`}
            />
            <div
              className="bg-[#94a3b8] h-full transition-all duration-500"
              style={{ width: `${(kpis.breakdown.mediumTruckPercent * 0.15).toFixed(1)}%` }}
              title={`Tải trung: ${kpis.breakdown.mediumTruckPercent}%`}
            />
          </div>

          <div className="flex justify-between items-center font-mono text-[11px] text-[#45464d] mt-0.5">
            <span className="text-[#d95f00] font-bold">
              Cont 40FT: {kpis.breakdown.cont40ftPercent}%
            </span>
            <span className="text-[#455f87] font-semibold">
              Tải nặng: {kpis.breakdown.heavyTruckPercent}%
            </span>
            <span className="font-medium text-slate-600">Tải trung: {kpis.breakdown.mediumTruckPercent}%</span>
          </div>
        </div>
      </div>

      {/* KPI 3: Lượt Xe Check-in Hôm Nay */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col justify-between transition-all hover:border-slate-300">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase tracking-wider text-[#45464d] font-bold">
              LƯỢT CHECK-IN HÔM NAY
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-sora text-2xl lg:text-3xl text-[#0d1c2e] font-bold tracking-tight tabular-nums">
                {kpis.todayCheckinCount}
              </span>
              <span className="font-mono text-xs text-[#45464d] font-semibold">Lượt Xe</span>
            </div>
          </div>
          <div className="px-2 py-0.5 bg-slate-100 text-[#0d1c2e] font-mono text-[11px] font-bold rounded-md border border-slate-200">
            GATE IN
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-[#45464d] font-mono text-xs border-t border-slate-100 pt-2.5">
          <span className="truncate">{kpis.todayCheckinBreakdown}</span>
          <span className="text-[#0d1c2e] font-bold flex items-center gap-1 shrink-0 ml-1">
            <Zap className="w-3.5 h-3.5 text-[#d95f00]" />
            <span>{kpis.alprBarrierSpeedSeconds}s Barie</span>
          </span>
        </div>
      </div>

      {/* KPI 4: Lệnh Rút Tiền Đang Chờ */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col justify-between transition-all hover:border-slate-300">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase tracking-wider text-[#45464d] font-bold">
              LỆNH RÚT TIỀN ĐANG CHỜ
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-sora text-2xl lg:text-3xl text-[#0d1c2e] font-bold tracking-tight tabular-nums">
                {formatCurrency(kpis.pendingWithdrawalAmount)}
              </span>
              <span className="font-mono text-sm text-[#45464d] font-bold">₫</span>
            </div>
          </div>
          <div className="px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>PENDING</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-[#45464d] font-mono text-xs border-t border-slate-100 pt-2.5">
          <span>{kpis.pendingWithdrawalCount.toString().padStart(2, '0')} Lệnh đang đối soát</span>
          <Link
            to="/merchant/withdrawals"
            className="text-[#d95f00] hover:underline font-bold flex items-center gap-0.5"
          >
            <span>Chi tiết ví</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
