import type { DriverNotificationStats } from '../types/notificationTypes'

interface DailyOperationsKpiSidebarCardProps {
  stats: DriverNotificationStats
}

export function DailyOperationsKpiSidebarCard({
  stats,
}: DailyOperationsKpiSidebarCardProps) {
  return (
    <div className="flex flex-col gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs">
      <h3 className="font-sora font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
        Thống Kê Vận Hành Hôm Nay
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: Barie check-in */}
        <div className="flex flex-col p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            BARIE CHECK-IN
          </span>
          <span className="text-2xl font-bold font-sora text-slate-900 mt-1">
            {stats.barieCheckinsToday.toString().padStart(2, '0')}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5">
            Tổ hợp xe hoàn tất
          </span>
        </div>

        {/* Metric 2: Queue saved minutes */}
        <div className="flex flex-col p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            TIẾT KIỆM CHỜ
          </span>
          <span className="text-2xl font-bold font-sora text-[#d95f00] mt-1">
            {stats.queueSavedMinutes}m
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5">
            Nhờ hàng đợi ảo
          </span>
        </div>
      </div>

      {/* On-time rate progress bar */}
      <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            Tỷ Lệ Check-in Đúng Giờ
          </span>
          <span className="font-mono font-bold text-slate-900">
            {stats.onTimeRatePercent}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-[#d95f00] rounded-full transition-all duration-500"
            style={{ width: `${stats.onTimeRatePercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
