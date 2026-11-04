import { useNavigate } from 'react-router-dom'
import { Truck, ArrowRight } from 'lucide-react'
import type { DetailedParkingLotSlot } from '../../types/merchantParkingLotTypes'

interface MerchantLotCapacitySectionProps {
  lotId: number
  slots: DetailedParkingLotSlot[]
  canConfigure?: boolean
}

export function MerchantLotCapacitySection({
  lotId,
  slots,
  canConfigure = true,
}: MerchantLotCapacitySectionProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-slate-800">
            <Truck className="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold">
              Phân Bổ Tải Trọng &amp; Sức Chứa Slot
            </h2>
            <p className="text-xs text-slate-500">
              Quy hoạch mặt bằng theo phân loại xe tải nặng, xe container và nguồn sạc 380V
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!canConfigure}
          onClick={() => navigate(`/merchant/parking-lots/${lotId}/slots`)}
          className="inline-flex items-center gap-1 font-mono text-xs text-[#d95f00] hover:underline font-bold disabled:opacity-40 disabled:hover:no-underline cursor-pointer"
        >
          <span>Cập nhật nhanh sức chứa (SCR-032)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List of 4-5 Vehicle Slot Types */}
      <div className="flex flex-col gap-3">
        {slots.map((slot) => {
          const isFull = slot.occupancyPercent >= 100
          const isHigh = slot.occupancyPercent >= 80

          return (
            <div
              key={slot.id}
              className={`p-4 rounded-xl flex flex-col gap-2 transition-colors border ${
                isFull
                  ? 'bg-slate-50 border-slate-200/80'
                  : isHigh
                    ? 'bg-[#ffdbca]/10 border-[#ffdbca]/40'
                    : 'bg-[#eff4ff]/40 border-[#eff4ff]'
              }`}
            >
              {/* Row 1: Name and Capacity Count */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-xs shrink-0 ${
                      slot.tagColor === 'orange'
                        ? 'bg-[#d95f00]'
                        : slot.tagColor === 'dark'
                          ? 'bg-[#131b2e]'
                          : slot.tagColor === 'blue'
                            ? 'bg-blue-600'
                            : 'bg-slate-400'
                    }`}
                  />
                  <span className="font-semibold text-xs sm:text-sm text-[#0d1c2e]">
                    {slot.typeNameVi}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#0d1c2e]">
                    {slot.totalCapacity - slot.availableCapacity} / {slot.totalCapacity} Chỗ
                  </span>
                  {slot.totalCapacity > 0 ? (
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                        isFull
                          ? 'bg-[#131b2e] text-white'
                          : isHigh
                            ? 'bg-[#ffdbca] text-[#d95f00]'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {slot.occupancyPercent}% {isFull ? 'HẾT CHỖ' : isHigh ? 'ĐẦY' : 'SỬ DỤNG'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-mono text-[11px]">
                      KHÔNG KÊ KHAI
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Progress Bar */}
              {slot.totalCapacity > 0 && (
                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      slot.tagColor === 'orange'
                        ? 'bg-[#d95f00]'
                        : slot.tagColor === 'dark'
                          ? 'bg-[#131b2e]'
                          : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, slot.occupancyPercent))}%` }}
                  />
                </div>
              )}

              {/* Row 3: Dimension Note & Status Notice */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-[11px] text-slate-500">
                <span>{slot.dimensionNote}</span>
                {slot.isQueueActivated ? (
                  <span className="text-[#d95f00] font-bold uppercase tracking-wide">
                    {slot.statusNotice}
                  </span>
                ) : (
                  <span
                    className={
                      isHigh ? 'text-[#d95f00] font-semibold' : 'text-slate-700 font-semibold'
                    }
                  >
                    {slot.statusNotice}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
