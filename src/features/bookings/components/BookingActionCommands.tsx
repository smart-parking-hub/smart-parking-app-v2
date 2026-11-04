import {
  CreditCard,
  Receipt,
  Navigation,
  PhoneCall,
  Star,
  XCircle,
} from 'lucide-react'
import type { BookingItemDto } from '../types/bookingTypes'
import { Link } from 'react-router-dom'

interface BookingActionCommandsProps {
  booking: BookingItemDto
  onPayFinal: () => void
  onPayDeposit: () => void
  onCancelBooking: () => void
  onOpenReview: () => void
  onPayCashAtGate?: () => void
  onOpenMapDirections?: () => void
}

export function BookingActionCommands({
  booking,
  onPayFinal,
  onPayDeposit,
  onCancelBooking,
  onOpenReview,
  onPayCashAtGate,
  onOpenMapDirections,
}: BookingActionCommandsProps) {
  const isParking = booking.status === 'PARKING'
  const isAwaitingFinal = booking.status === 'AWAITING_FINAL_PAYMENT'
  const isPendingPayment = booking.status === 'PENDING_PAYMENT'
  const isCompleted = booking.status === 'COMPLETED'
  const canCancel =
    booking.status === 'PENDING_PAYMENT' || booking.status === 'PENDING_CHECKIN'

  const handleCallHotline = () => {
    window.location.href = 'tel:0908123456'
  }

  return (
    <div className="flex flex-col gap-3">
      {isCompleted && <Link to={`/disputes?bookingId=${booking.id}`} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800">Gửi khiếu nại về lượt đỗ</Link>}
      {/* Primary CTA Buttons according to lifecycle */}
      {(isParking || isAwaitingFinal) && (
        <button
          type="button"
          onClick={onPayFinal}
          className="w-full h-12 py-3 px-6 bg-[#d95f00] hover:bg-[#b84e00] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
        >
          <CreditCard className="w-5 h-5 text-white" />
          <span>THANH TOÁN KHOẢN CUỐI QUA PAYOS VIETQR ➔</span>
        </button>
      )}

      {isPendingPayment && (
        <button
          type="button"
          onClick={onPayDeposit}
          className="w-full h-12 py-3 px-6 bg-[#d95f00] hover:bg-[#b84e00] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
        >
          <CreditCard className="w-5 h-5 text-white" />
          <span>THANH TOÁN TIỀN CỌC 100.000 Đ QUA PAYOS VIETQR ➔</span>
        </button>
      )}

      {isCompleted && (
        <button
          type="button"
          onClick={onOpenReview}
          className="w-full h-12 py-3 px-6 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
        >
          <Star className="w-5 h-5 fill-slate-900 text-slate-900" />
          <span>ĐÁNH GIÁ TRẢI NGHIỆM BÃI ĐỖ XE</span>
        </button>
      )}

      {/* Secondary Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onPayCashAtGate}
          className="h-10 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Receipt className="w-4 h-4 text-slate-500" />
          <span>Trả tiền mặt tại cổng</span>
        </button>

        <button
          type="button"
          onClick={onOpenMapDirections}
          className="h-10 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-[#455f87]" />
          <span>Chỉ đường Maps tới cổng</span>
        </button>

        <button
          type="button"
          onClick={handleCallHotline}
          className="h-10 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 text-[#d95f00]" />
          <span>Trực ban: 0908 123 456</span>
        </button>
      </div>

      {/* Cancel Action if within allowed window */}
      {canCancel && (
        <button
          type="button"
          onClick={onCancelBooking}
          className="text-xs text-red-600 hover:text-red-700 font-semibold py-1 flex items-center justify-center gap-1 hover:underline cursor-pointer"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Hủy đặt chỗ này (Hoàn tiền cọc theo quy định)</span>
        </button>
      )}
    </div>
  )
}
