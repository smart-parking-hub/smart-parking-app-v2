import { Building2, Camera, CheckCircle2, TrendingUp } from 'lucide-react'
import type { OwnerLotPreviewTelemetry } from '../types'
import { Badge } from '@/shared/components/Badge'

export interface OwnerLotLiveCardProps {
  telemetry: OwnerLotPreviewTelemetry
  onActionClick?: () => void
  actionLabel?: string
}

export function OwnerLotLiveCard({
  telemetry,
  onActionClick,
  actionLabel = 'Xem Chi Tiết Bãi',
}: OwnerLotLiveCardProps) {
  const formatVND = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + ' đ'

  return (
    <div className="bg-brand-navy-light border border-[#1E3A5F] hover:border-brand-orange/60 transition-all duration-300 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-slate-300 font-semibold">
            {telemetry.hubCode}
          </span>
          <Badge variant={telemetry.isOnline ? 'success' : 'warning'} size="sm">
            {telemetry.isOnline ? 'Trạm Cổng AI Online' : 'Offline'}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-xs text-brand-orange font-sora font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{telemetry.capacityPercent}% Công Suất</span>
        </div>
      </div>

      <h4 className="font-sora font-bold text-lg text-white group-hover:text-brand-orange transition-colors mb-1.5">
        {telemetry.name}
      </h4>
      <p className="font-inter text-xs text-slate-300 flex items-center gap-1.5 mb-5">
        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="truncate">{telemetry.location}</span>
      </p>

      {/* Metric Grid */}
      <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-brand-navy border border-slate-800 text-center font-inter mb-5">
        <div>
          <div className="text-[10px] uppercase text-slate-400 font-medium">Xe trong bãi</div>
          <div className="font-sora font-bold text-sm sm:text-base text-white mt-0.5">
            {telemetry.currentActiveTrucks} / {telemetry.totalCapacitySlots}
          </div>
        </div>
        <div className="border-x border-slate-800">
          <div className="text-[10px] uppercase text-slate-400 font-medium flex items-center justify-center gap-1">
            <Camera className="w-3 h-3 text-brand-orange" />
            <span>ALPR</span>
          </div>
          <div className="font-sora font-bold text-sm sm:text-base text-brand-orange mt-0.5">
            {telemetry.alprScanTime}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-400 font-medium">Doanh thu ngày</div>
          <div className="font-sora font-bold text-xs sm:text-sm text-emerald-400 mt-0.5 truncate">
            {formatVND(telemetry.estimatedDailyRevenue)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange" />
          <span>PayOS T+1: {telemetry.payOsStatus}</span>
        </div>
        {onActionClick && (
          <button
            type="button"
            onClick={onActionClick}
            className="text-brand-orange hover:text-white font-semibold transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {actionLabel} &rarr;
          </button>
        )}
      </div>
    </div>
  )
}
