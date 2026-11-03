import { useState } from 'react'
import { X, AlertTriangle, Loader2 } from 'lucide-react'
import type { BookingItemDto } from '../types/bookingTypes'

interface CancelBookingModalProps {
  isOpen: boolean
  onClose: () => void
  booking: BookingItemDto | null
  onConfirmCancel: (reason: string, bankAccount?: string) => Promise<void>
}

const CANCEL_REASONS = [
  'Thay đổi lịch trình bốc dỡ hàng tại cảng',
  'Xe đầu kéo gặp sự cố kỹ thuật dọc đường',
  'Đã tìm được điểm đỗ khác thuận tiện hơn',
  'Chủ bãi thông báo điều phối lại cổng vào',
  'Lý do cá nhân khác',
]

export function CancelBookingModal({
  isOpen,
  onClose,
  booking,
  onConfirmCancel,
}: CancelBookingModalProps) {
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0])
  const [bankAccount, setBankAccount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !booking) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onConfirmCancel(selectedReason, bankAccount)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 relative border border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-red-100 text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-red-600 font-bold">
              XÁC NHẬN HỦY VÉ
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Hủy Đặt Chỗ #{booking.bookingCode}
            </h3>
          </div>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
          <p className="font-semibold">Chính sách bảo chứng hoàn cọc:</p>
          <p className="text-[11px] text-amber-800">
            Hủy trước giờ check-in dự kiến tối thiểu 60 phút sẽ được hoàn 100% tiền cọc (100.000 đ) vào ví hoặc tài khoản ngân hàng trong vòng 24 giờ.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700">Lý do hủy đặt chỗ:</label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#d95f00]"
            >
              {CANCEL_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700">
              Số tài khoản hoàn tiền (nếu không dùng ví SmartTruck Pay):
            </label>
            <input
              type="text"
              placeholder="VD: 1903... Techcombank - NGUYEN VAN TUAN"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#d95f00]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Giữ lại vé
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Xác nhận hủy</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
