import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, X, Trash2 } from 'lucide-react'
import {
  leaveQueueSchema,
  leaveQueueReasonOptions,
  type LeaveQueueFormData,
} from '../schemas/queueSchemas'

interface LeaveQueueConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data?: LeaveQueueFormData) => void
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
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeaveQueueFormData>({
    resolver: zodResolver(leaveQueueSchema),
    defaultValues: {
      reason: 'CHANGED_PLAN',
      customReason: '',
      contactPhone: '',
      confirmCheckbox: true,
    },
  })

  const selectedReason = watch('reason')

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      reset({
        reason: 'CHANGED_PLAN',
        customReason: '',
        contactPhone: '',
        confirmCheckbox: true,
      })
    }
  }, [isOpen, reset])

  // Escape key handler & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLeaving) {
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
  }, [isOpen, isLeaving, onClose])

  if (!isOpen) return null

  const onSubmit = (data: LeaveQueueFormData) => {
    onConfirm(data)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-queue-modal-title"
      onClick={() => {
        if (!isLeaving) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isLeaving}
          aria-label="Đóng"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Reason Select */}
          <div>
            <label
              htmlFor="leave-reason-select"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Lý do rời hàng đợi <span className="text-rose-500">*</span>
            </label>
            <select
              id="leave-reason-select"
              {...register('reason')}
              disabled={isLeaving}
              className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
            >
              {leaveQueueReasonOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.reason && (
              <p className="text-xs text-rose-600 mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* Custom reason if OTHER */}
          {selectedReason === 'OTHER' && (
            <div>
              <label
                htmlFor="leave-custom-reason"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Chi tiết lý do <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="leave-custom-reason"
                rows={2}
                placeholder="Vui lòng nêu rõ lý do bạn muốn rời hàng đợi..."
                {...register('customReason')}
                disabled={isLeaving}
                className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
              />
              {errors.customReason && (
                <p className="text-xs text-rose-600 mt-1">{errors.customReason.message}</p>
              )}
            </div>
          )}

          {/* Optional contact phone */}
          <div>
            <label
              htmlFor="leave-contact-phone"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Số điện thoại liên hệ (Tùy chọn)
            </label>
            <input
              id="leave-contact-phone"
              type="tel"
              placeholder="0912345678"
              {...register('contactPhone')}
              disabled={isLeaving}
              className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
            />
            {errors.contactPhone && (
              <p className="text-xs text-rose-600 mt-1">{errors.contactPhone.message}</p>
            )}
          </div>

          {/* Confirmation Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('confirmCheckbox')}
                disabled={isLeaving}
                className="mt-1 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-xs text-slate-600 leading-snug">
                Tôi xác nhận hiểu rõ việc hủy lượt xếp hàng sẽ chuyển quyền ưu tiên cho phương tiện tiếp theo.
              </span>
            </label>
            {errors.confirmCheckbox && (
              <p className="text-xs text-rose-600 mt-1">{errors.confirmCheckbox.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLeaving}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Giữ lượt chờ
            </button>
            <button
              type="submit"
              disabled={isLeaving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm shadow-rose-600/20 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isLeaving ? 'Đang hủy...' : 'Xác nhận rời hàng'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
