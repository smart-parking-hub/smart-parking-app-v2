import { Link } from 'react-router-dom'
import { statusLabels } from '@/features/booking-flow'
import {
  Truck,
  MapPin,
  Square,
  Ruler,
  Zap,
  QrCode,
  Navigation,
  Phone,
  Search,
  CheckCircle2,
} from 'lucide-react'
import type { BookingDto } from '../types/driverTypes'

interface ActiveTripCardProps {
  booking?: BookingDto
  onOpenQr: () => void
}

export function ActiveTripCard({ booking, onOpenQr }: ActiveTripCardProps) {
  if (!booking) {
    return (
      <section className="w-full bg-white rounded-xl border border-slate-200 p-8 text-center mb-6">
        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Truck className="w-6 h-6" />
        </div>
        <h3 className="font-sora text-base sm:text-lg font-bold text-slate-900">
          Chưa có chuyến đỗ nào đang hoạt động
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1 mb-5">
          Hiện tại phương tiện của bạn không có phiên đỗ xe nào cần xử lý. Hãy tìm bãi đỗ an toàn
          trên lộ trình.
        </p>
        <Link
          to="/parking"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white font-medium text-xs sm:text-sm hover:bg-brand-primary-hover transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Tìm Bãi Đỗ Ngay</span>
        </Link>
      </section>
    )
  }

  const formatCurrency = (val?: number) => {
    if (typeof val !== 'number') return '0 ₫'
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
  }

  return (
    <section className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
      {/* Header Strip: Flat and clean */}
      <div className="px-5 lg:px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Truck className="w-5 h-5 text-[#d95f00]" />
          <h2 className="font-sora text-sm sm:text-base text-slate-900 font-semibold tracking-tight">
            CHUYẾN ĐỖ ĐANG HOẠT ĐỘNG THỜI GIAN THỰC
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-[#c2410c] text-xs font-medium border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d95f00]" />
            {statusLabels[booking.status]}
          </span>
          <span className="font-mono text-xs text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded font-medium tabular-nums">
            MÃ ĐƠN: {booking.bookingCode}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 cols: Yard & Vehicle Manifest */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#d95f00] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-sora text-lg sm:text-xl text-slate-900 font-bold leading-tight">
                  {booking.parkingLotName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
                  {booking.parkingLotAddress}
                </p>
              </div>
            </div>

            {/* Yard Tech Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Spec 1: Slot / Vị trí */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                <Square className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Vị trí đỗ:</span>
                  <strong className="font-mono text-sm sm:text-base font-bold text-[#c2410c] tabular-nums">
                    {booking.berthNumber || 'BERTH C-12'}
                  </strong>
                </div>
              </div>

              {/* Spec 2: Usable Length */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                <Ruler className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Chiều dài bến:</span>
                  <strong className="font-mono text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                    {booking.usableLength || '18.5m'}
                  </strong>
                </div>
              </div>

              {/* Spec 3: 3-Phase Shore Power */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Điện bờ 3 pha:</span>
                  <strong className="text-xs sm:text-sm font-semibold text-emerald-800">
                    Có sẵn (380V)
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Manifest Sub-card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-slate-500" />
                Hồ sơ phương tiện check-in
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Khớp biển số ALPR
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Đầu kéo:</span>
                <strong className="font-mono text-sm sm:text-base font-bold text-slate-900 block tabular-nums">
                  {booking.vehicleLicensePlate}
                </strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Rơ-moóc:</span>
                <strong className="font-mono text-sm sm:text-base font-bold text-slate-900 block tabular-nums">
                  {booking.trailerLicensePlate || '51R-024.89'}
                </strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-500 block mb-0.5">Quy cách hàng:</span>
                <strong className="font-mono text-xs sm:text-sm font-semibold text-slate-800 truncate block">
                  {booking.containerType || 'CONTAINER 40FT HEAVY'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Telemetry Clock, Payment & Fast Barie Pass */}
        <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between gap-4">
          {/* Real-time Parking Counter */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block mb-0.5">Giờ vào bến:</span>
              <span className="font-mono text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                {booking.checkInTime || '14:15'}{' '}
                <span className="text-xs font-normal text-slate-500">(Hôm nay)</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block mb-0.5">Thời gian đã đỗ:</span>
              <span className="font-mono text-lg sm:text-xl font-bold text-[#d95f00] tabular-nums">
                {booking.parkingDuration || '03h 45m'}
              </span>
            </div>
          </div>

          {/* Pricing Ledger summary */}
          <div className="space-y-2 bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="flex justify-between text-slate-600 text-xs sm:text-sm">
              <span>Đơn giá niêm yết:</span>
              <span className="font-mono font-medium tabular-nums">{formatCurrency(booking.hourlyRate || 40000)}/h</span>
            </div>
            <div className="flex justify-between text-slate-600 text-xs sm:text-sm">
              <span>Tiền cọc giữ chỗ:</span>
              <span className="font-mono font-semibold text-emerald-800 tabular-nums">
                - {formatCurrency(booking.depositAmount || 100000)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-900 text-sm">Tạm tính hiện tại:</span>
              <span className="font-mono font-bold text-base sm:text-lg text-slate-900 tabular-nums">
                {formatCurrency(booking.totalPrice || 180000)}
              </span>
            </div>
          </div>

          {/* Action Button Strip */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={onOpenQr}
              className="w-full h-11 px-3 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 shrink-0" />
              <span className="truncate">MÃ QR XUẤT BÃI (BARIE CHECK-OUT)</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={
                  booking.parkingLotAddress
                    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${booking.parkingLotName} ${booking.parkingLotAddress}`)}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.parkingLotName || 'Bãi đỗ xe')}`
                }
                target="_blank"
                rel="noreferrer"
                className="h-9 px-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                title={`Chỉ đường tới ${booking.parkingLotName}`}
              >
                <Navigation className="w-3.5 h-3.5 text-slate-500" />
                <span>Chỉ đường</span>
              </a>
              <a
                href="tel:19006868"
                className="h-9 px-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Trực ban bến</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
