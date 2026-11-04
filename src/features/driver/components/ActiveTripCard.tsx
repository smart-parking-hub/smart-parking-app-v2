import { Link } from 'react-router-dom'
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
      <section className="w-full bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-sm mb-6">
        <div className="w-14 h-14 bg-[#eff4ff] text-[#455f87] rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Truck className="w-7 h-7" />
        </div>
        <h3 className="font-sora text-lg font-bold text-[#0d1c2e]">
          Chưa có chuyến đỗ nào đang hoạt động
        </h3>
        <p className="text-sm text-[#45464d] max-w-md mx-auto mt-1 mb-5">
          Hiện tại phương tiện của bạn không có phiên đỗ xe nào cần xử lý. Hãy tìm bãi đỗ an toàn
          trên lộ trình.
        </p>
        <Link
          to="/parking"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d95f00] text-white font-semibold text-sm hover:bg-[#b85000] transition-colors"
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
    <section className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
      {/* Header Strip */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#eff4ff] to-[#f8faff] border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[#131b2e] text-white flex items-center justify-center">
            <Truck className="w-4 h-4 text-brand-orange" />
          </span>
          <div>
            <h2 className="font-sora text-sm sm:text-base text-[#0d1c2e] font-bold tracking-tight">
              CHUYẾN ĐỖ ĐANG HOẠT ĐỘNG THỜI GIAN THỰC
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 text-[#9c3f00] text-xs font-semibold tracking-wide border border-orange-200/60">
            <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
            ĐANG ĐỖ TẠI BÃI (PARKING)
          </span>
          <span className="font-mono text-xs text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md font-medium">
            MÃ ĐƠN: {booking.bookingCode}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 cols: Yard & Vehicle Manifest */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-11 h-11 rounded-xl bg-orange-50 text-[#d95f00] flex items-center justify-center shrink-0 mt-0.5 border border-orange-100">
                <MapPin className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-sora text-xl sm:text-2xl text-[#0d1c2e] font-bold leading-tight">
                  {booking.parkingLotName}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mt-1 leading-snug">
                  {booking.parkingLotAddress}
                </p>
              </div>
            </div>

            {/* Prominent Yard Tech Specs Grid (Hình 1 & Hình 2 fix: to rõ, lấp đầy khoảng trống) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Spec 1: Slot / Vị trí */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-orange-50/90 border border-orange-200 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#d95f00] flex items-center justify-center shrink-0">
                  <Square className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Vị trí đỗ:</span>
                  <strong className="font-mono text-base font-bold text-[#d95f00]">
                    {booking.berthNumber || 'BERTH C-12'}
                  </strong>
                </div>
              </div>

              {/* Spec 2: Usable Length */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Chiều dài bến:</span>
                  <strong className="font-mono text-base font-bold text-slate-900">
                    {booking.usableLength || '18.5m'}
                  </strong>
                </div>
              </div>

              {/* Spec 3: 3-Phase Shore Power */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Điện bờ 3 pha:</span>
                  <strong className="text-sm font-bold text-emerald-800">
                    Có sẵn (380V)
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Manifest Sub-card (To rõ, dễ nhìn, cân đối layout) */}
          <div className="p-4 sm:p-5 bg-slate-50/90 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-200/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#455f87]" />
                HỒ SƠ PHƯƠNG TIỆN CHECK-IN
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Khớp biển số ALPR
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-500 block mb-1 font-medium">Đầu kéo:</span>
                <strong className="font-mono text-base sm:text-lg font-bold text-slate-900 block">
                  {booking.vehicleLicensePlate}
                </strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1 font-medium">Rơ-moóc:</span>
                <strong className="font-mono text-base sm:text-lg font-bold text-slate-900 block">
                  {booking.trailerLicensePlate || '51R-024.89'}
                </strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-500 block mb-1 font-medium">Quy cách hàng:</span>
                <strong className="font-mono text-sm sm:text-base font-bold text-slate-800 truncate block">
                  {booking.containerType || 'CONTAINER 40FT HEAVY'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Telemetry Clock, Payment & Fast Barie Pass */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#f8faff] to-[#eef4ff] p-5 sm:p-6 rounded-xl border border-blue-100 flex flex-col justify-between gap-4">
          {/* Real-time Parking Counter */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
            <div>
              <span className="text-xs text-slate-500 block mb-0.5 font-medium">Giờ vào bến:</span>
              <span className="font-mono text-base sm:text-lg font-bold text-slate-900">
                {booking.checkInTime || '14:15'}{' '}
                <span className="text-xs font-normal text-slate-500">(Hôm nay)</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block mb-0.5 font-medium">Thời gian đã đỗ:</span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#d95f00]">
                {booking.parkingDuration || '03h 45m'}
              </span>
            </div>
          </div>

          {/* Pricing Ledger summary */}
          <div className="space-y-2.5 bg-white/80 p-4 rounded-xl border border-slate-200/60 shadow-2xs">
            <div className="flex justify-between text-slate-600 text-sm">
              <span className="font-medium">Đơn giá niêm yết:</span>
              <span className="font-mono font-semibold">{formatCurrency(booking.hourlyRate || 40000)}/h</span>
            </div>
            <div className="flex justify-between text-slate-600 text-sm">
              <span className="font-medium">Tiền cọc giữ chỗ:</span>
              <span className="font-mono font-bold text-emerald-700">
                - {formatCurrency(booking.depositAmount || 100000)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2.5 border-t border-slate-200">
              <span className="font-bold text-slate-900 text-base">Tạm tính hiện tại:</span>
              <span className="font-mono font-bold text-xl text-slate-900">
                {formatCurrency(booking.totalPrice || 180000)}
              </span>
            </div>
          </div>

          {/* Action Button Strip */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              type="button"
              onClick={onOpenQr}
              className="w-full h-12 px-4 rounded-xl bg-[#d95f00] hover:bg-[#b85000] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#d95f00]/25 active:scale-[0.99] cursor-pointer"
            >
              <QrCode className="w-5 h-5" />
              <span>MÃ QR XUẤT BÃI (BARIE CHECK-OUT)</span>
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 px-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Navigation className="w-4 h-4 text-[#455f87]" />
                <span>Chỉ đường</span>
              </a>
              <a
                href="tel:19006868"
                className="h-10 px-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Phone className="w-4 h-4 text-[#455f87]" />
                <span>Trực ban bến</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
