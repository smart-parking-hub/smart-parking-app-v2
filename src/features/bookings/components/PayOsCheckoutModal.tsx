import { useState } from 'react'
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
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 relative border border-slate-100 text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="font-mono text-xs uppercase text-[#d95f00] font-bold">
            CỔNG THANH TOÁN TỰ ĐỘNG
          </span>
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
            {/* PayOS VietQR Simulator Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center gap-3">
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-slate-500">Số tiền cần thanh toán:</p>
                <p className="font-mono text-xl font-bold text-[#d95f00]">
                  {formatCurrency(amount)}
                </p>
                <p className="text-[11px] font-mono text-slate-600 font-medium">
                  Nội dung: {booking.bookingCode} {booking.vehiclePlate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bảo mật chuẩn ngân hàng NAPAS &amp; PayOS Webhook</span>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
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
                className="text-xs text-slate-500 hover:text-slate-800 py-1"
              >
                Đóng / Thanh toán sau
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
