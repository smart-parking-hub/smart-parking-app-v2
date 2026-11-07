import { Link } from 'react-router-dom'
import { Radio, Plus } from 'lucide-react'
import type { QueueTab, QueueTelemetryData } from '../types/queueTypes'

interface QueueCommandToolbarProps {
  activeTab: QueueTab
  onTabChange: (tab: QueueTab) => void
  activeCount: number
  historyCount: number
  telemetry: QueueTelemetryData
}

export function QueueCommandToolbar({
  activeTab,
  onTabChange,
  activeCount,
  historyCount,
  telemetry,
}: QueueCommandToolbarProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 md:p-5 mb-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Eyebrow, Title & Clean Description */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200/80">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Hệ thống điều phối hàng đợi thông minh
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              Radar {telemetry.radarRadiusKm}km Active
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-sora text-slate-900 tracking-tight">
            Lượt Chờ Vào Bãi
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl">
            Theo dõi số thứ tự thực tế và nhận thông báo ngay khi bãi đỗ giải phóng chỗ trống phù hợp cho phương tiện của bạn.
          </p>
        </div>

        {/* Right: Outbound CTA matching user brand primary button specification */}
        <div className="flex items-center gap-3">
          <Link
            to="/parking"
            className="h-11 px-5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold transition-colors shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tìm bãi & Đăng ký</span>
          </Link>
        </div>
      </div>

      {/* Bottom Segmented Controls (Tightened separator) */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="inline-flex p-1 bg-slate-100/80 rounded-xl border border-slate-200" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'ACTIVE'}
            onClick={() => onTabChange('ACTIVE')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'ACTIVE'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
          >
            <span>Đang hoạt động</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
              {activeCount}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'HISTORY'}
            onClick={() => onTabChange('HISTORY')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'HISTORY'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
          >
            <span>Lịch sử giữ chỗ</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
              {historyCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
