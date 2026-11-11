import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, X, Trash2 } from 'lucide-react'
import { Select } from '@/shared/components/Select'
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
    setValue,
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
        className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isLeaving}
          aria-label="Đóng"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header: Chữ to, rõ ràng */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-13 h-13 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/80 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 id="leave-queue-modal-title" className="text-xl md:text-2xl font-bold font-sora text-slate-900">
              Rời Hàng Đợi Ảo?
            </h3>
            <p className="text-sm text-slate-500 font-mono font-semibold mt-0.5">{queueCode}</p>
          </div>
        </div>

        {/* Warning card: Chữ to hơn, dễ nhìn */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-5 mb-5 text-slate-700">
          <p className="font-bold text-slate-900 text-base md:text-lg mb-1.5">{parkingLotName}</p>
          <p className="text-sm md:text-base text-rose-600 leading-relaxed font-medium">
            Cảnh báo: Nếu rời hàng đợi lúc này, vị trí ưu tiên hiện tại của bạn sẽ bị hủy bỏ và nhường lại cho tài xế kế tiếp. Bạn sẽ phải xếp hàng lại từ đầu nếu muốn đỗ tại bãi này.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Reason Select: Dùng shared component Select, chữ to */}
          <div>
            <label
              htmlFor="leave-reason-select"
              className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2"
            >
              Lý do rời hàng đợi <span className="text-rose-500">*</span>
            </label>
            <Select
              id="leave-reason-select"
              value={selectedReason}
              onChange={(val) => setValue('reason', val as LeaveQueueFormData['reason'], { shouldValidate: true })}
              options={[...leaveQueueReasonOptions]}
              placeholder="Chọn lý do rời hàng đợi..."
              size="lg"
              disabled={isLeaving}
              triggerClassName="text-sm md:text-base font-medium h-12 rounded-xl"
            />
            {errors.reason && (
              <p className="text-sm text-rose-600 mt-1.5 font-medium">{errors.reason.message}</p>
            )}
          </div>

          {/* Custom reason if OTHER */}
          {selectedReason === 'OTHER' && (
            <div>
              <label
                htmlFor="leave-custom-reason"
                className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2"
              >
                Chi tiết lý do <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="leave-custom-reason"
                rows={3}
                placeholder="Vui lòng nêu rõ lý do bạn muốn rời hàng đợi..."
                {...register('customReason')}
                disabled={isLeaving}
                className="w-full text-sm md:text-base rounded-xl border border-slate-300 bg-white p-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-colors"
              />
              {errors.customReason && (
                <p className="text-sm text-rose-600 mt-1.5 font-medium">{errors.customReason.message}</p>
              )}
            </div>
          )}

          {/* Optional contact phone */}
          <div>
            <label
              htmlFor="leave-contact-phone"
              className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-2"
            >
              Số điện thoại liên hệ (Tùy chọn)
            </label>
            <input
              id="leave-contact-phone"
              type="tel"
              placeholder="0912345678"
              {...register('contactPhone')}
              disabled={isLeaving}
              className="w-full text-sm md:text-base rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-colors"
            />
            {errors.contactPhone && (
              <p className="text-sm text-rose-600 mt-1.5 font-medium">{errors.contactPhone.message}</p>
            )}
          </div>

          {/* Confirmation Checkbox: Chữ to hơn */}
          <div className="pt-1">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('confirmCheckbox')}
                disabled={isLeaving}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 shrink-0 cursor-pointer"
              />
              <span className="text-sm md:text-base text-slate-800 leading-snug font-medium">
                Tôi xác nhận hiểu rõ việc hủy lượt xếp hàng sẽ chuyển quyền ưu tiên cho phương tiện tiếp theo.
              </span>
            </label>
            {errors.confirmCheckbox && (
              <p className="text-sm text-rose-600 mt-1.5 font-medium">{errors.confirmCheckbox.message}</p>
            )}
          </div>

          {/* Action buttons: To hơn, rõ ràng */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLeaving}
              className="px-5 py-3 rounded-xl text-sm md:text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Giữ lượt chờ
            </button>
            <button
              type="submit"
              disabled={isLeaving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm shadow-rose-600/20 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
              <span>{isLeaving ? 'Đang hủy...' : 'Xác nhận rời hàng'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
