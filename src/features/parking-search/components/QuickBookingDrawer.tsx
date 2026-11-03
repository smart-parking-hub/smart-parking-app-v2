import { useState, useEffect } from 'react'
import { Timer, X, Hourglass, CheckCircle2 } from 'lucide-react'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

interface QuickBookingDrawerProps {
  open: boolean
  onClose: () => void
  lot?: ParkingLotItem
  onConfirmSuccess?: () => void
}

export function QuickBookingDrawer({
  open,
  onClose,
  lot,
  onConfirmSuccess,
}: QuickBookingDrawerProps) {
  const [confirmed, setConfirmed] = useState(false)

  // Reset state on open
  useEffect(() => {
    if (open) {
      setConfirmed(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open || !lot) return null

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
  }

  const handleConfirm = () => {
    setConfirmed(true)
    setTimeout(() => {
      onConfirmSuccess?.()
      onClose()
    }, 1500)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl max-w-[520px] w-full p-6 lg:p-7 shadow-2xl relative border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#d95f00]">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold">
                Đặt giữ chỗ khẩn cấp (10 Phút)
              </h4>
              <p className="text-xs text-[#45464d]">
                Bãi sẽ khóa slot vật lý ngay sau khi bạn xác nhận
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmed ? (
          /* Confirmation Success Alert */
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-3 animate-bounce" />
            <h5 className="font-sora text-lg font-bold text-[#0d1c2e]">
              Giữ Chỗ Thành Công!
            </h5>
            <p className="text-xs text-[#45464d] mt-1 max-w-sm">
              Slot đã được bảo lưu 10 phút. Barie tự động tại bãi{' '}
              <strong>{lot.name}</strong> đã được đồng bộ mã check-in của xe.
            </p>
          </div>
        ) : (
          <>
            {/* Yard Info Highlight */}
            <div className="bg-[#eff4ff] rounded-xl p-4 my-4 border border-blue-100">
              <span className="text-xs text-[#45464d] block font-medium">Bãi được chỉ định:</span>
              <div className="font-sora text-base font-bold text-[#0d1c2e] mt-0.5">
                {lot.name}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-blue-200/60">
                <div>
                  <span className="text-xs text-[#45464d] block">Đơn giá áp dụng</span>
                  <span className="font-mono text-[#0d1c2e] font-bold text-sm">
                    {formatCurrency(lot.hourlyRate)} / giờ
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#45464d] block">Tình trạng slot</span>
                  <span className="text-xs text-[#d95f00] font-bold">
                    {lot.slotTypeLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Hold Expiry Countdown Warning */}
            <div className="bg-amber-50 rounded-xl p-3 mb-4 flex items-center gap-2.5 border border-amber-200/80">
              <Hourglass className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs text-amber-900 leading-snug">
                <strong>Thời gian giữ chỗ: 10 phút.</strong> Nếu xe không quét mã Barie vào bãi
                trước thời hạn, slot sẽ tự động hoàn lại cho các tài xế khác.
              </div>
            </div>

            {/* Vehicle Confirmation Details */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-[#45464d] block mb-1 font-medium">
                  Xe nhận chỗ &amp; Quét Barie
                </label>
                <input
                  type="text"
                  readOnly
                  value="51D-894.12 · Rơ-moóc 40FT (Tài xế: Trần Quốc Tuấn)"
                  className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs font-semibold text-[#0d1c2e] focus:outline-none border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#45464d] block mb-1 font-medium">
                    Thời gian dự kiến đến (ETA)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${lot.etaMinutes} phút nữa (14:35)`}
                    className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl font-mono text-[#0d1c2e] text-xs focus:outline-none border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#45464d] block mb-1 font-medium">
                    Cọc giữ slot
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${formatCurrency(lot.depositAmount)} (Ví Ops)`}
                    className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl font-mono font-bold text-[#0d1c2e] text-xs focus:outline-none border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] h-11 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                HỦY BỎ
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 bg-black hover:bg-[#233144] text-white h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>XÁC NHẬN GIỮ CHỖ</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
