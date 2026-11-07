import { useState, useEffect } from 'react'
import { X, QrCode, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import type { BookingItemDto } from '../types/bookingTypes'

interface PayOsCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  booking: BookingItemDto | null
  paymentType: 'DEPOSIT' | 'FINAL'
  onPaymentCompleted: (bookingId: number, type: 'DEPOSIT' | 'FINAL') => void
}

export function PayOsCheckoutModal({
  isOpen,
  onClose,
  booking,
  paymentType,
  onPaymentCompleted,
}: PayOsCheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !booking) return null

  const amount =
    paymentType === 'DEPOSIT'
      ? booking.depositPaid || 100000
      : booking.remainingFinalPayment

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ'
  }

  const handleSimulatePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setSuccess(true)
      setTimeout(() => {
        onPaymentCompleted(booking.id, paymentType)
        setSuccess(false)
        onClose()
      }, 1200)
    }, 1000)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cổng thanh toán trực tuyến PayOS VietQR"
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 relative border border-slate-100 text-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng cổng thanh toán"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00]"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs uppercase font-mono font-bold text-[#d95f00]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CỔNG THANH TOÁN TỰ ĐỘNG</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            PayOS VietQR Chuyển Khoản 24/7
          </h3>
        </div>

        {success ? (
          <div className="py-6 flex flex-col items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-12 h-12" />
            <p className="font-bold text-sm text-slate-900">
              Giao dịch PayOS đã xác nhận thành công!
            </p>
            <p className="text-xs text-slate-500">
              Hệ thống đang mở khóa barie ALPR cho xe {booking.vehiclePlate}...
            </p>
          </div>
        ) : (
          <>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-xs text-slate-600">
                {paymentType === 'DEPOSIT'
                  ? 'Thanh toán cọc giữ chỗ 20%'
                  : 'Quyết toán cước thực tế'}
              </span>
              <span className="font-sora text-2xl font-bold text-[#d95f00]">
                {formatCurrency(amount)}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Mã giao dịch: PAYOS-{booking.bookingCode} • Biển số: {booking.vehiclePlate}
              </span>
            </div>

            {/* VietQR Mock Card */}
            <div className="border border-dashed border-slate-200 p-4 rounded-xl flex flex-col items-center gap-2 bg-slate-50/50">
              <div className="bg-white p-2 rounded-lg shadow-2xs border border-slate-100">
                <QrCode className="w-32 h-32 text-slate-800" />
              </div>
              <span className="text-xs text-slate-600">
                Quét bằng app ngân hàng bất kỳ để thanh toán tự động
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bảo mật chuẩn ngân hàng NAPAS &amp; PayOS Webhook</span>
            </div>

            {/* Action Button */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang đồng bộ giao dịch PayOS...</span>
                  </>
                ) : (
                  <span>MÔ PHỎNG QUÉT THANH TOÁN THÀNH CÔNG</span>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 py-1 cursor-pointer focus-visible:outline-none focus-visible:underline"
              >
                Đóng / Thanh toán sau
              </button>
            </div>
          </>
        )}

        <span className="text-[11px] text-slate-600 font-mono">
          Chuẩn ISO/IEC 27001 • Mã hóa bảo mật SSL 256-bit
        </span>
      </div>
    </div>
  )
}
