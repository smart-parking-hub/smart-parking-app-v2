import { useEffect } from 'react'
import { ArrowRightLeft, X } from 'lucide-react'

interface DeclineSlotConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  queueCode: string
  parkingLotName: string
  berthCode?: string
}

export function DeclineSlotConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  queueCode,
  parkingLotName,
  berthCode,
}: DeclineSlotConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="decline-slot-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80 shrink-0">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <h3
              id="decline-slot-modal-title"
              className="text-xl md:text-2xl font-bold font-sora text-slate-900"
            >
              Xác Nhận Nhường Lượt?
            </h3>
            <p className="text-sm text-slate-500 font-mono font-semibold mt-0.5">
              {queueCode}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-5 mb-6 space-y-2 text-slate-700">
          <p className="font-bold text-slate-900 text-base md:text-lg">
            {parkingLotName}
          </p>
          {berthCode && (
            <p className="text-sm font-semibold text-brand-primary font-mono">
              Vị trí được cấp: {berthCode}
            </p>
          )}
          <p className="text-sm md:text-base text-amber-800 leading-relaxed font-medium pt-1">
            Bãi đỗ đã dành sẵn chỗ cho xe của bạn. Nếu xác nhận nhường lượt, vị trí này sẽ được chuyển ngay cho phương tiện kế tiếp trong hàng đợi. Bạn sẽ tiếp tục chờ lượt sau.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl text-sm md:text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer active:scale-95"
          >
            Quay lại giữ chỗ
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover transition-colors shadow-md cursor-pointer active:scale-95"
          >
            <ArrowRightLeft className="w-5 h-5" />
            <span>Xác nhận nhường lượt</span>
          </button>
        </div>
      </div>
    </div>
  )
}

