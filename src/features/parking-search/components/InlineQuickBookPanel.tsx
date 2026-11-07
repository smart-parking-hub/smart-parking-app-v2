import { useState, useEffect } from 'react'
import {
  Timer,
  X,
  Hourglass,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

interface InlineQuickBookPanelProps {
  open: boolean
  onClose: () => void
  lot?: ParkingLotItem
  onConfirmSuccess?: (reservationCode: string) => void
}

export function InlineQuickBookPanel({
  open,
  onClose,
  lot,
  onConfirmSuccess,
}: InlineQuickBookPanelProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [reservationCode, setReservationCode] = useState('')
  const [secondsRemaining, setSecondsRemaining] = useState(600) // 10 minutes

  // Retrieve authenticated driver identity
  const [identity] = useState(() => {
    let phone = ''
    try {
      phone =
        (
          JSON.parse(
            localStorage.getItem('smart-truck-parking.auth') || '{}',
          ) as { phone?: string }
        ).phone || '0909 128 374'
    } catch {
      phone = '0909 128 374'
    }
    const name = localStorage.getItem('smart-truck-parking.driver_name') || 'Trần Quốc Tuấn'
    return { name, phone }
  })

  // Reset state on open and start countdown timer
  useEffect(() => {
    if (open) {
      setConfirmed(false)
      setSecondsRemaining(600)
      setReservationCode('')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // Countdown timer effect
  useEffect(() => {
    if (!open || confirmed) return
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [open, confirmed])

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

  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const progressPercent = (secondsRemaining / 600) * 100

  const handleConfirm = () => {
    const code = `BK-HOLD-2026-${Math.floor(1000 + Math.random() * 9000)}`
    try {
      localStorage.setItem(
        'smart-truck-parking.active_hold',
        JSON.stringify({
          code,
          parkingLotId: lot?.id,
          parkingLotName: lot?.name,
          heldAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        }),
      )
    } catch {
      // ignore storage errors
    }
    setReservationCode(code)
    setConfirmed(true)
    onConfirmSuccess?.(code)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel giữ chỗ nhanh 10 phút"
      className="fixed inset-0 z-50 bg-[#131b2e]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl max-w-[540px] w-full p-6 lg:p-7 shadow-2xl relative border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-[#d95f00] flex items-center justify-center shrink-0">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-sora text-base sm:text-lg text-[#0d1c2e] font-bold">
                  Đặt giữ chỗ khẩn cấp (10 Phút)
                </h4>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-[#d95f00]">
                  GAP-04
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
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
          /* Confirmation Success Alert (SCR-MOD-06 Success View) */
          <div className="py-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 animate-in zoom-in">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h5 className="font-sora text-xl font-bold text-[#0d1c2e]">
              Giữ Chỗ Thành Công!
            </h5>
            <p className="text-sm text-slate-600 mt-1 max-w-sm">
              Mã giữ slot: <strong className="font-mono text-[#d95f00] font-bold">{reservationCode}</strong>
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-4 w-full text-left">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-500">Bãi đỗ:</span>
                <strong className="text-slate-900 font-semibold">{lot.name}</strong>
              </div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-500">Biển số ALPR:</span>
                <strong className="font-mono text-slate-900 font-bold">51D-894.12 / 51R-024.89</strong>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Thời hạn vào bãi:</span>
                <strong className="text-emerald-700 font-bold">10 phút (Trước 14:45)</strong>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <Link
                to="/bookings"
                className="flex-1 h-11 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                <QrCode className="w-4 h-4" />
                <span>Mở Vé QR &amp; Đặt Chỗ</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Live 10-Minute Countdown Bar */}
            <div className="my-3.5 p-3 rounded-xl bg-orange-50/80 border border-orange-200">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Hourglass className="w-4 h-4 text-[#d95f00] animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">
                    Thời gian giữ chỗ: 10 phút.
                  </span>
                </div>
                <span className="font-mono text-base font-bold text-[#d95f00]">
                  {formattedTime}
                </span>
              </div>
              <div className="w-full h-1.5 bg-orange-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d95f00] transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                Nếu xe không quét mã Barie vào bãi trước thời hạn, slot sẽ tự động hoàn lại cho tài xế khác.
              </p>
            </div>

            {/* Yard Info Highlight */}
            <div className="bg-slate-50 rounded-xl p-4 mb-3.5 border border-slate-200">
              <span className="text-xs text-slate-500 block font-medium">Bãi xe được chỉ định:</span>
              <div className="font-sora text-base font-bold text-slate-900 mt-0.5">
                {lot.name}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Đơn giá áp dụng</span>
                  <span className="font-mono text-slate-900 font-bold text-sm">
                    {formatCurrency(lot.hourlyRate)} / giờ
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Tình trạng slot</span>
                  <span className="text-xs text-[#d95f00] font-bold">
                    {lot.slotTypeLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle & ALPR Confirmation Details */}
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium flex items-center justify-between">
                  <span>Xe nhận chỗ &amp; Quét Barie</span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Đã xác thực ALPR
                  </span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={`51D-894.12 · Rơ-moóc 40FT (Tài xế: ${identity.name})`}
                  className="w-full bg-[#f8f9ff] px-3.5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold text-slate-900 border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1 font-medium">
                    Thời gian dự kiến đến (ETA)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${lot.etaMinutes} phút nữa (14:35)`}
                    className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl font-mono text-slate-900 text-xs sm:text-sm focus:outline-none border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1 font-medium">
                    Cọc giữ slot
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${formatCurrency(lot.depositAmount)} (Ví Ops)`}
                    className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl font-mono font-bold text-[#d95f00] text-xs sm:text-sm focus:outline-none border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 h-11 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                HỦY BỎ
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white h-11 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-primary/25 cursor-pointer active:scale-[0.99]"
              >
                <span>XÁC NHẬN GIỮ CHỖ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export const QuickBookingDrawer = InlineQuickBookPanel
