import { AlertTriangle, X, Trash2 } from 'lucide-react'

interface LeaveQueueConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  queueCode: string
  parkingLotName: string
  isLeaving: boolean
}

export function LeaveQueueConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  queueCode,
  parkingLotName,
  isLeaving,
}: LeaveQueueConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-queue-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/80 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 id="leave-queue-modal-title" className="text-lg font-bold font-sora text-slate-900">
              Rời Hàng Đợi Ảo?
            </h3>
            <p className="text-xs text-slate-500 font-mono">{queueCode}</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900 mb-1">{parkingLotName}</p>
          <p className="text-xs text-rose-600 leading-relaxed font-medium">
            Cảnh báo: Nếu rời hàng đợi lúc này, vị trí ưu tiên hiện tại của bạn sẽ bị hủy bỏ và nhường lại cho tài xế kế tiếp. Bạn sẽ phải xếp hàng lại từ đầu nếu muốn đỗ tại bãi này.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLeaving}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Giữ lượt chờ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLeaving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm shadow-rose-600/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isLeaving ? 'Đang hủy...' : 'Xác nhận rời hàng'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
