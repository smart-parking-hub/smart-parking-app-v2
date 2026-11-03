import { Link } from 'react-router-dom'
import { Radio, ShieldCheck, Plus, Sparkles, Activity } from 'lucide-react'
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Eyebrow, Title & Description */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200/80">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Hệ thống điều phối hàng đợi thông minh
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              Radar {telemetry.radarRadiusKm}km Active
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-sora text-slate-900 tracking-tight">
            Hàng Đợi Ảo (Virtual Queues)
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl">
            Theo dõi vị trí thời gian thực, nhận phân bổ slot thông minh theo chuẩn FIFO ALPR và tự động chuyển đổi thành vé đỗ xe khi bãi giải phóng chỗ.
          </p>
        </div>

        {/* Right: Telemetry chips & CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
            <Activity className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="text-xs">
              <div className="text-slate-500 font-medium">Toàn hệ thống</div>
              <div className="font-semibold text-slate-800">
                {telemetry.processingCount} xe đang chờ • ~{telemetry.avgReleaseMinutes}p/xe
              </div>
            </div>
          </div>

          <Link
            to="/parking"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-colors shadow-sm shadow-orange-600/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tìm bãi & Đăng ký</span>
          </Link>
        </div>
      </div>

      {/* Bottom Segmented Controls */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-slate-100/80 rounded-xl border border-slate-200" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'ACTIVE'}
            onClick={() => onTabChange('ACTIVE')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'ACTIVE'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'ACTIVE' ? 'text-orange-500' : 'text-slate-400'}`} />
            <span>Đang hoạt động</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'ACTIVE'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {activeCount}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'HISTORY'}
            onClick={() => onTabChange('HISTORY')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'HISTORY'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Lịch sử xếp hàng</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'HISTORY'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {historyCount}
            </span>
          </button>
        </div>

        {/* Realtime Status Badges */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Chuẩn ALPR FIFO 100%
          </span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:flex items-center gap-1 font-medium">
            Cập nhật thời gian thực
          </span>
        </div>
      </div>
    </div>
  )
}
