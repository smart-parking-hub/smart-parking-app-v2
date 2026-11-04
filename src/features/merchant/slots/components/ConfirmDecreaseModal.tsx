import { AlertTriangle, ArrowRight, X } from 'lucide-react'
import type { SlotMatrixItem, VehicleType } from '../types/merchantSlotsTypes'

interface DecreasedSlotInfo {
  typeNameVi: string
  oldTotal: number
  newTotal: number
  occupied: number
}

interface ConfirmDecreaseModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  slots: SlotMatrixItem[]
  drafts: Record<VehicleType, number>
  isSaving: boolean
}

export function ConfirmDecreaseModal({
  isOpen,
  onClose,
  onConfirm,
  slots,
  drafts,
  isSaving,
}: ConfirmDecreaseModalProps) {
  if (!isOpen) return null

  const decreasedList: DecreasedSlotInfo[] = slots
    .filter((slot) => {
      const nextVal = drafts[slot.vehicleType] ?? slot.totalCapacity
      return nextVal < slot.totalCapacity
    })
    .map((slot) => ({
      typeNameVi: slot.typeNameVi,
      oldTotal: slot.totalCapacity,
      newTotal: drafts[slot.vehicleType] ?? slot.totalCapacity,
      occupied: slot.occupiedCapacity,
    }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5 text-amber-700">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-sora text-base font-bold text-slate-900">
                Xác nhận giảm sức chứa?
              </h3>
              <p className="text-xs text-slate-500">
                Hệ thống đã kiểm tra đảm bảo không vi phạm số xe đang đỗ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-600 leading-relaxed">
            Bạn đang yêu cầu giảm sức chứa cho <strong>{decreasedList.length}</strong> nhóm phương
            tiện sau:
          </p>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {decreasedList.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-800">{item.typeNameVi}</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    Xe đang đỗ thực tế: {item.occupied} xe
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono font-bold">
                  <span className="text-slate-500 line-through">{item.oldTotal}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[#d95f00] text-sm">{item.newTotal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] text-white text-xs font-bold transition-colors shadow-xs"
          >
            {isSaving ? 'Đang lưu cấu hình...' : 'Xác nhận & Lưu tất cả'}
          </button>
        </div>
      </div>
    </div>
  )
}
