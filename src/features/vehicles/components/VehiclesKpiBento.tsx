import { Truck, Scale, ShieldCheck, CheckCircle2 } from 'lucide-react'
import type { FleetKpiMetrics } from '../types/vehicleTypes'

interface VehiclesKpiBentoProps {
  metrics: FleetKpiMetrics
}

export function VehiclesKpiBento({ metrics }: VehiclesKpiBentoProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Vehicles */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider">
            TỔNG SỐ XE ĐĂNG KÝ
          </span>
          <Truck className="w-5 h-5 text-slate-600" />
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl md:text-3xl font-bold font-sora text-slate-900">
            {metrics.totalVehicles.toString().padStart(2, '0')}
          </span>
          <span className="text-sm font-medium text-slate-500">Phương tiện</span>
        </div>

        <div className="mt-3 pt-2.5 flex items-center gap-2 font-mono text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
          <span className="font-bold text-slate-900">{metrics.tractorCount.toString().padStart(2, '0')}</span> Đầu kéo ·{' '}
          <span className="font-bold text-slate-900">{metrics.trailerCount.toString().padStart(2, '0')}</span> Rơ-moóc
        </div>
      </div>

      {/* Card 2: Default Vehicle */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider">
            XE MẶC ĐỊNH VẬN HÀNH
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
        </div>

        <div className="flex flex-col mt-1">
          <span className="text-xl md:text-2xl font-bold font-mono text-slate-900 tracking-tight">
            {metrics.defaultPlate}
          </span>
          <span className="text-xs text-slate-500 mt-0.5">{metrics.defaultSpec}</span>
        </div>

        <div className="mt-3 pt-2.5 flex items-center justify-between font-mono text-xs bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
          <span className="text-slate-500">VỊ TRÍ THỰC:</span>
          <span className="text-orange-600 font-bold">{metrics.defaultLocationStatus}</span>
        </div>
      </div>

      {/* Card 3: Verification ALPR & Registry */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider">
            XÁC THỰC ALPR & ĐĂNG KIỂM
          </span>
          <ShieldCheck className="w-5 h-5 text-slate-600" />
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl md:text-3xl font-bold font-sora text-slate-900">
            {metrics.alprVerifiedRate}
          </span>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            HỢP LỆ
          </span>
        </div>

        <div className="mt-3 pt-2.5 flex items-center gap-1.5 font-mono text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{metrics.verifiedRatioText}</span>
        </div>
      </div>

      {/* Card 4: Total Tonnage */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider">
            TỔNG TẢI TRỌNG LƯU HÀNH
          </span>
          <Scale className="w-5 h-5 text-slate-600" />
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl md:text-3xl font-bold font-sora text-slate-900">
            {metrics.totalTonnage}
          </span>
          <span className="text-sm font-medium text-slate-500">Tấn</span>
        </div>

        <div className="mt-3 pt-2.5 flex items-center gap-1 font-mono text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 truncate">
          <span className="text-slate-800 font-medium truncate">{metrics.eligibleRoutesText}</span>
        </div>
      </div>
    </div>
  )
}
