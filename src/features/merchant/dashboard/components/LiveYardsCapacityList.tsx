import { useNavigate } from 'react-router-dom'
import { Sliders, Hourglass } from 'lucide-react'
import type { LiveYardItem } from '../types/merchantDashboardTypes'
import { cn } from '@/shared/utils/cn'

interface LiveYardsCapacityListProps {
  yards: LiveYardItem[]
}

export function LiveYardsCapacityList({ yards }: LiveYardsCapacityListProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex flex-col">
          <span className="font-mono text-[11px] text-[#45464d] uppercase tracking-wider font-bold">
            HẠ TẦNG VẬN HÀNH
          </span>
          <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold m-0 mt-0.5">
            Tình Trạng 03 Cụm Bãi
          </h2>
        </div>
        <span className="px-2.5 py-1 bg-[#eff4ff] text-[#0d1c2e] font-mono text-xs font-bold rounded-lg border border-blue-100">
          03 YARDS
        </span>
      </div>

      {/* Yard Cards Stack */}
      <div className="flex flex-col gap-3">
        {yards.map((yard) => (
          <div
            key={yard.id}
            className="bg-[#eff4ff] p-4 rounded-xl flex flex-col gap-2.5 border border-blue-50/80"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-sora text-sm font-bold text-[#0d1c2e] m-0">{yard.name}</h3>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider',
                      yard.status === 'APPROVED'
                        ? 'bg-white text-[#0d1c2e] border border-slate-200'
                        : 'bg-slate-200 text-slate-700',
                    )}
                  >
                    {yard.status}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate-500 m-0 mt-0.5">{yard.address}</p>
              </div>

              <span
                className={cn(
                  'px-2 py-0.5 rounded-md font-mono text-[11px] font-bold shrink-0',
                  yard.capacityPercent >= 85
                    ? 'bg-[#341100] text-[#ffdbca] border border-[#d95f00]/30'
                    : yard.status === 'PENDING_APPROVAL'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-white text-[#0d1c2e] border border-slate-200',
                )}
              >
                {yard.capacityStatusText}
              </span>
            </div>

            {/* Capacity Bar or Pending notice */}
            {yard.status === 'APPROVED' ? (
              <div className="flex flex-col gap-1 mt-0.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#0d1c2e] font-bold">
                    {yard.occupiedSlots} / {yard.totalSlots} Slot
                  </span>
                  <span className="text-slate-500 font-medium">{yard.remainingSlotNote}</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-500 rounded-full',
                      yard.capacityPercent >= 85 ? 'bg-[#d95f00]' : 'bg-[#455f87]',
                    )}
                    style={{ width: `${yard.capacityPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-2 bg-white rounded-lg flex items-center gap-2 border border-slate-200/60 mt-0.5">
                <Hourglass className="w-4 h-4 text-[#455f87] shrink-0" />
                <span className="text-xs text-slate-600 leading-tight">
                  {yard.pendingAuditNote || 'Đang thẩm định hồ sơ'}
                </span>
              </div>
            )}

            {/* Bottom Actions */}
            {yard.status === 'APPROVED' && (
              <div className="flex items-center justify-between pt-1 border-t border-blue-100/60 text-xs">
                <span className="font-mono text-[11px] text-[#45464d] font-semibold">
                  {yard.todayRevenueText}
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`/merchant/parking-lots/${yard.id}/slots`)}
                  className="font-mono text-xs text-[#455f87] hover:text-[#0d1c2e] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Quản lý slot &amp; giá</span>
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
