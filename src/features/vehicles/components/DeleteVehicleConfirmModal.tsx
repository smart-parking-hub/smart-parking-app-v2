import { AlertTriangle, Trash2, X } from 'lucide-react'
import type { VehicleItem } from '../types/vehicleTypes'

interface DeleteVehicleConfirmModalProps {
  vehicle: VehicleItem | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (vehicle: VehicleItem) => Promise<void> | void
  isDeleting?: boolean
}

export function DeleteVehicleConfirmModal({
  vehicle,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteVehicleConfirmModalProps) {
  if (!isOpen || !vehicle) return null

  const handleConfirm = async () => {
    await onConfirm(vehicle)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-slate-900 text-base">
                Xác Nhận Hủy Phương Tiện
              </h3>
              <p className="text-xs font-mono text-slate-500">MÃ SỐ: {vehicle.licensePlate}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Bạn có chắc chắn muốn hủy liên kết phương tiện{' '}
            <strong className="text-slate-900 font-mono text-sm">{vehicle.licensePlate}</strong> (
            {vehicle.brandModel}) khỏi danh sách phương tiện vận hành của bạn?
          </p>

          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl leading-relaxed">
            <p className="font-semibold mb-1">Quy định lưu trữ dữ liệu vận tải:</p>
            <p className="text-[11px] text-amber-800">
              Hệ thống sẽ chuyển trạng thái phương tiện sang <strong>Đã ngưng sử dụng (INACTIVE)</strong>.
              Mọi lịch sử cân tải trọng, vé bến bãi và hóa đơn điện tử liên quan sẽ không bị xóa.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Đang hủy...' : 'Xác Nhận Xóa'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
