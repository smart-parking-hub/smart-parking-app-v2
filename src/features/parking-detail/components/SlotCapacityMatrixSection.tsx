import { Truck, Navigation, Car, AlertTriangle } from 'lucide-react'
import type { SlotCapacityCategory } from '../types/parkingDetailTypes'

interface SlotCapacityMatrixSectionProps {
  categories: SlotCapacityCategory[]
  totalAvailable: number
  totalCapacity: number
  totalAreaM2: number
  lastUpdatedSecondsAgo: number
}

export function SlotCapacityMatrixSection({
  categories,
  totalAvailable,
  totalCapacity,
  totalAreaM2,
  lastUpdatedSecondsAgo,
}: SlotCapacityMatrixSectionProps) {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'directions_boat':
        return <Truck className="w-5 h-5 text-[#d95f00]" />
      case 'local_shipping':
        return <Truck className="w-5 h-5 text-[#455f87]" />
      case 'rv_hookup':
        return <Navigation className="w-5 h-5 text-[#455f87]" />
      case 'fire_truck':
        return <Truck className="w-5 h-5 text-[#455f87]" />
      case 'directions_car':
      default:
        return <Car className="w-5 h-5 text-[#455f87]" />
    }
  }

  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
      {/* Header with realtime badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Trạng Thái Sức Chứa Thời Gian Thực
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Tổng diện tích {totalAreaM2.toLocaleString('vi-VN')} m² · Cập nhật cảm biến vòng từ
            cách đây {lastUpdatedSecondsAgo} giây
          </p>
        </div>
        <span className="px-3 py-1 bg-slate-100 text-slate-700 font-mono text-xs font-bold rounded uppercase tracking-wider">
          TOTAL: {totalAvailable}/{totalCapacity} TRỐNG
        </span>
      </div>

      {/* 5 Categories List */}
      <div className="space-y-3 pt-1">
        {categories.map((cat) => {
          const isHighDemand = !!cat.highDemandLabel

          return (
            <div
              key={cat.id}
              className={`p-4 rounded-lg flex flex-col gap-2.5 transition-colors border ${
                isHighDemand
                  ? 'bg-amber-50/40 border-amber-200/80'
                  : 'bg-slate-50 border-slate-200/60'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isHighDemand ? 'bg-amber-100/70' : 'bg-slate-200/60'
                    }`}
                  >
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">
                        {cat.categoryName}
                      </span>
                      {cat.highDemandLabel && (
                        <span className="inline-flex items-center gap-1 bg-[#fff7ed] text-[#d95f00] border border-[#fed7aa] text-[11px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                          <AlertTriangle className="w-3 h-3 text-[#d95f00]" />
                          {cat.highDemandLabel}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{cat.subDescription}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xl font-bold font-mono ${
                      isHighDemand ? 'text-[#d95f00]' : 'text-slate-900'
                    }`}
                  >
                    {cat.availableSlots}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">
                    {' '}/ {cat.totalSlots} chỗ trống
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isHighDemand
                      ? 'bg-[#d95f00]'
                      : cat.occupiedPercent > 40
                        ? 'bg-[#455f87]'
                        : 'bg-slate-400'
                  }`}
                  style={{ width: `${cat.occupiedPercent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
