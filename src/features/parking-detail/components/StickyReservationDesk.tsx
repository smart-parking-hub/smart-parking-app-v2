import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck,
  CheckCircle2,
  Clock,
  Hourglass,
  HelpCircle,
  ArrowRight,
  ListOrdered,
  Gavel,
  ShieldCheck,
} from 'lucide-react'
import type { ReservationDetailState } from '../types/parkingDetailTypes'

interface StickyReservationDeskProps {
  reservationState: ReservationDetailState
  onOpenBookingModal: () => void
}

export function StickyReservationDesk({
  reservationState,
  onOpenBookingModal,
}: StickyReservationDeskProps) {
  // 10-minute lock countdown timer
  const [secondsLeft, setSecondsLeft] = useState(10 * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedCountdown = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
  }

  return (
    <div className="lg:col-span-4 sticky top-[84px] flex flex-col gap-4">
      {/* Primary Reservation Terminal Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-md p-6 flex flex-col gap-4">
        {/* Header & Countdown Timer Badge */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono text-[#d95f00] uppercase font-bold tracking-wider">
              ĐIỀU PHỐI TỨC THÌ
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">
              ĐẶT GIỮ CHỖ VẬT LÝ
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Khóa slot thông minh qua Barie ALPR
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="bg-[#fff7ed] text-[#d95f00] border border-[#ffedd5] px-2 py-0.5 rounded font-mono font-bold text-[11px]">
              LOCK 10 PHÚT
            </span>
            <span
              id="lock-countdown"
              className="font-mono text-slate-900 font-bold text-xl mt-1 tracking-tight"
            >
              {formattedCountdown}
            </span>
          </div>
        </div>

        {/* Vehicle Selection Picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Phương Tiện Đăng Ký</span>
            <Link
              to="/vehicles"
              className="text-[#d95f00] hover:underline font-normal text-xs"
            >
              + Đổi xe khác
            </Link>
          </label>
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-slate-200 rounded-md">
                <Truck className="w-5 h-5 text-[#455f87]" />
              </div>
              <div>
                <p className="font-mono font-bold text-slate-900 text-sm">
                  {reservationState.registeredPlate}
                </p>
                <p className="text-xs text-slate-500">
                  {reservationState.vehicleDescription}
                </p>
              </div>
            </div>
            {reservationState.isVerifiedPlate && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-mono text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                ĐÃ XÁC THỰC
              </span>
            )}
          </div>
        </div>

        {/* Realtime Availability Confirmation Banner */}
        <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-lg flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-[#d95f00] shrink-0" />
          <p className="text-xs text-slate-800 font-medium leading-snug">
            CÒN{' '}
            <strong className="text-[#d95f00] font-mono font-bold">
              {reservationState.matchingSlotsCount} SLOT TRỐNG
            </strong>{' '}
            PHÙ HỢP HOÀN TOÀN VỚI XE BẠN
          </p>
        </div>

        {/* Operational Arrival & Duration Controls */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">Giờ vào dự kiến</span>
            <div className="bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-lg text-slate-900 font-mono text-xs font-bold flex items-center justify-between">
              <span>{reservationState.estimatedArrivalText}</span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">Thời gian đỗ</span>
            <div className="bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-lg text-slate-900 font-mono text-xs font-bold flex items-center justify-between">
              <span>{reservationState.durationUntilText}</span>
              <Hourglass className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Financial Breakdown Ledger */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>
              Tiền giờ đỗ ({reservationState.durationHours}h × {formatCurrency(reservationState.parkingRatePerHour)}):
            </span>
            <span className="font-mono font-semibold text-slate-900">
              {formatCurrency(reservationState.parkingTotalAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              <span>Cọc giữ slot 10 phút:</span>
              <span
                title="Hoàn 100% nếu check-in đúng hẹn hoặc hủy trước 60 phút"
                className="inline-flex cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </span>
            </span>
            <span className="font-mono font-semibold text-slate-900">
              {formatCurrency(reservationState.depositAmount)}
            </span>
          </div>

          <div className="w-full h-px bg-slate-200 my-0.5" />

          <div className="flex items-center justify-between text-slate-900">
            <span className="font-bold text-sm">Tổng thanh toán cọc ngay:</span>
            <span className="text-lg font-bold text-[#d95f00] font-mono">
              {formatCurrency(reservationState.depositAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>Số tiền quyết toán tại bãi lúc xuất xe:</span>
            <span className="font-mono font-semibold text-slate-700">
              {formatCurrency(reservationState.settlementAtExitAmount)}
            </span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <button
          type="button"
          id="btn-open-booking-modal"
          onClick={onOpenBookingModal}
          className="w-full bg-[#d95f00] hover:bg-[#b84e00] text-white font-bold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.99] cursor-pointer"
        >
          <span>XÁC NHẬN ĐẶT CHỖ &amp; MỞ THANH TOÁN CỌC</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Virtual Queue Fallback Link */}
        <div className="pt-1 text-center">
          <Link
            to="/queues"
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg w-full justify-center transition-colors border border-slate-200/80"
          >
            <ListOrdered className="w-4 h-4 text-[#455f87]" />
            <span>Tham Gia Hàng Đợi Ảo Cát Lái (Nhận Push Ưu Tiên)</span>
          </Link>
        </div>
      </div>

      {/* Yard Regulations & Policy Mini-Dossier */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 flex flex-col gap-2.5 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Gavel className="w-4 h-4 text-[#455f87]" />
          <span>CAM KẾT DỊCH VỤ SMARTTRUCK OPS</span>
        </div>
        <ul className="space-y-1.5 list-disc list-inside text-slate-600 leading-relaxed">
          <li>Hoàn trả 100% tiền cọc tự động qua ví nếu bãi hết chỗ khi đến.</li>
          <li>Quá hạn 10 phút không check-in ALPR, slot sẽ được nhường cho xe khác.</li>
          <li>
            Tổng đài hỗ trợ sự cố điều phối 24/7 qua{' '}
            <strong className="text-slate-900 font-semibold">1900 6868</strong>.
          </li>
        </ul>
      </div>
    </div>
  )
}
