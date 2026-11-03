import { useState } from 'react'
import {
  X,
  Lock,
  Unlock,
  Loader2,
  CheckCircle2,
  Wallet,
  Building2,
} from 'lucide-react'
import type {
  PaymentMethodType,
  ReservationDetailState,
} from '../types/parkingDetailTypes'

interface BookingPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  facilityName: string
  reservationState: ReservationDetailState
  onPaymentSuccess?: (bookingId: string) => void
}

export function BookingPaymentModal({
  isOpen,
  onClose,
  facilityName,
  reservationState,
  onPaymentSuccess,
}: BookingPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>('WALLET')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
  }

  const handleConfirmPayment = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const msg = `ĐẶT CHỖ THÀNH CÔNG! Slot ${reservationState.suggestedBerth} đã được khóa cho xe ${reservationState.registeredPlate} trong 10 phút. Barie sẽ tự động mở khi xe đến cổng.`
      setSuccessMessage(msg)
      if (onPaymentSuccess) {
        onPaymentSuccess('BK-2025-CLG2-014')
      }
    }, 1200)
  }

  const handleModalClose = () => {
    setSuccessMessage(null)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div
      id="booking-flow-modal"
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleModalClose()
        }
      }}
    >
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto border border-slate-100">
        {/* Close Button */}
        <button
          id="btn-close-modal"
          type="button"
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Đóng modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 pr-8">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#d95f00] flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-[#d95f00]" />
          </div>
          <div>
            <span className="text-xs font-mono text-[#d95f00] uppercase font-bold tracking-wider">
              THANH TOÁN GIỮ CHỖ VẬT LÝ
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              Xác Nhận Giữ Slot (10 Phút)
            </h4>
          </div>
        </div>

        {/* Success Alert if already confirmed */}
        {successMessage ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Giao dịch giữ chỗ thành công</span>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              {successMessage}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
              >
                ĐÃ HIỂU &amp; QUAY LẠI
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Order Summary Card */}
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Bãi chỉ định:</span>
                <span className="font-bold text-slate-900">{facilityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vị trí ô đỗ gợi ý:</span>
                <span className="font-mono font-bold text-slate-900">
                  {reservationState.suggestedBerth}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Biển số nhận diện ALPR:</span>
                <span className="font-mono font-bold text-slate-900">
                  {reservationState.registeredPlate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Thời gian giữ chỗ:</span>
                <span className="font-mono font-bold text-[#d95f00]">
                  16:30 ➔ 16:40 (10 phút)
                </span>
              </div>

              <div className="w-full h-px bg-slate-200 my-1" />

              <div className="flex justify-between items-center pt-0.5">
                <span className="font-bold text-slate-900 text-sm">
                  Số tiền cọc trừ ví:
                </span>
                <span className="text-lg font-bold text-[#d95f00] font-mono">
                  {formatCurrency(reservationState.depositAmount)}
                </span>
              </div>
            </div>

            {/* Payment Source Selection */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-800">
                Phương Thức Thanh Toán
              </span>

              {/* Method 1: Driver Wallet */}
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'WALLET'
                    ? 'bg-amber-50/50 border-[#d95f00]'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment-method"
                    value="WALLET"
                    checked={paymentMethod === 'WALLET'}
                    onChange={() => setPaymentMethod('WALLET')}
                    className="accent-[#d95f00]"
                  />
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#d95f00]" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Ví Tài Xế SmartTruck Pay
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Số dư khả dụng:{' '}
                        <span className="font-mono font-bold text-slate-800">
                          1.450.000 ₫
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-mono text-[10px] font-bold">
                  KHUYÊN DÙNG
                </span>
              </label>

              {/* Method 2: Enterprise Post-Paid */}
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === 'ENTERPRISE'
                    ? 'bg-amber-50/50 border-[#d95f00]'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment-method"
                    value="ENTERPRISE"
                    checked={paymentMethod === 'ENTERPRISE'}
                    onChange={() => setPaymentMethod('ENTERPRISE')}
                    className="accent-[#d95f00]"
                  />
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#455f87]" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Tài Khoản Doanh Nghiệp (Post-Paid)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Công ty TNHH Vận Tải An Phát Logistics
                      </p>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-mono text-[10px] font-bold">
                  HẠN MỨC 50M
                </span>
              </label>
            </div>

            {/* Action Footer */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                id="btn-confirm-payment"
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmPayment}
                className="w-full bg-[#d95f00] hover:bg-[#b84e00] disabled:bg-slate-400 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>ĐANG KHÓA SLOT VẬT LÝ &amp; GỬI ALPR...</span>
                  </>
                ) : (
                  <>
                    <span>
                      THANH TOÁN {formatCurrency(reservationState.depositAmount)} &amp; MỞ KHÓA BARIE
                    </span>
                    <Unlock className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-500 leading-normal">
                Sau khi thanh toán, hệ thống sẽ kích hoạt camera ALPR nhận diện biển số{' '}
                <strong className="text-slate-800 font-mono">
                  {reservationState.registeredPlate}
                </strong>{' '}
                ngay lập tức.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
