import type { SlotMatrixItem, VehicleType } from '../types/merchantSlotsTypes'
import { MerchantSlotCard } from './MerchantSlotCard'

interface MerchantSlotMatrixGridProps {
  slots: SlotMatrixItem[]
  drafts: Record<VehicleType, number>
  onChangeDraft: (vehicleType: VehicleType, nextValue: number) => void
  onViolation: (message: string) => void
  disabled?: boolean
}

export function MerchantSlotMatrixGrid({
  slots,
  drafts,
  onChangeDraft,
  onViolation,
  disabled = false,
}: MerchantSlotMatrixGridProps) {
  return (
    <section className="flex flex-col gap-4">
      {/* Grid Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-sora text-lg lg:text-xl text-slate-900 font-bold">
            Phân Bổ Định Biên 5 Loại Phương Tiện Chuẩn Hóa
          </h2>
          <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-slate-200 text-slate-800 font-semibold">
            SRS V2.8
          </span>
        </div>
        <span className="font-mono text-xs text-slate-500">
          Dữ liệu tham chiếu Database Schema: tbl_parking_slots
        </span>
      </div>

      {/* Grid of 5 Cards */}
      <div className="grid grid-cols-1 gap-4">
        {slots.map((item) => (
          <MerchantSlotCard
            key={item.vehicleType}
            item={item}
            draftCapacity={drafts[item.vehicleType] ?? item.totalCapacity}
            onChangeCapacity={(nextVal) => onChangeDraft(item.vehicleType, nextVal)}
            onViolation={onViolation}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  )
}
