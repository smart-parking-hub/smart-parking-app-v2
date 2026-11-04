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
          <span>Tìm Bãi Đỗ Ngay (SCR-015)</span>
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
      <div className="px-6 py-3.5 bg-gradient-to-r from-[#eff4ff] to-[#f8faff] border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
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
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-orange-50 text-[#d95f00] flex items-center justify-center shrink-0 mt-0.5 border border-orange-100">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-sora text-lg sm:text-xl text-[#0d1c2e] font-bold leading-tight">
                  {booking.parkingLotName}
                </h3>
                <p className="text-sm text-slate-600 mt-1 leading-snug">
                  {booking.parkingLotAddress}
                </p>
              </div>
            </div>

            {/* Yard Tech Specs Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-[#0d1c2e] text-xs font-medium border border-orange-200/80">
                <Square className="w-3.5 h-3.5 text-[#d95f00]" />
                Vị trí:{' '}
                <strong className="font-mono text-sm text-[#d95f00]">
                  {booking.berthNumber || 'BERTH C-12'}
                </strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200">
                <Ruler className="w-3.5 h-3.5 text-slate-500" />
                Chiều dài: <strong className="font-mono text-slate-900">{booking.usableLength || '18.5m'}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                Điện bờ 3 pha: Có sẵn
              </span>
            </div>
          </div>

          {/* Vehicle Manifest Sub-card */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#455f87]" />
                HỒ SƠ PHƯƠNG TIỆN CHECK-IN
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Khớp biển số ALPR
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Đầu kéo:</span>
                <strong className="font-mono text-base font-bold text-slate-900">
                  {booking.vehicleLicensePlate}
                </strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">Rơ-moóc:</span>
                <strong className="font-mono text-base font-bold text-slate-900">
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
        <div className="lg:col-span-5 bg-gradient-to-br from-[#f8faff] to-[#eef4ff] p-5 rounded-xl border border-blue-100 flex flex-col justify-between gap-4">
          {/* Real-time Parking Counter */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
            <div>
              <span className="text-xs text-slate-500 block mb-0.5">Giờ vào bến:</span>
              <span className="font-mono text-base font-bold text-slate-900">
                {booking.checkInTime || '14:15'}{' '}
                <span className="text-xs font-normal text-slate-500">(Hôm nay)</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block mb-0.5">Thời gian đã đỗ:</span>
              <span className="font-mono text-xl font-bold text-[#d95f00]">
                {booking.parkingDuration || '03h 45m'}
              </span>
            </div>
          </div>

          {/* Pricing Ledger summary */}
          <div className="space-y-2 text-sm bg-white/70 p-3.5 rounded-lg border border-slate-200/50">
            <div className="flex justify-between text-slate-600 text-xs sm:text-sm">
              <span>Đơn giá niêm yết:</span>
              <span className="font-mono font-medium">{formatCurrency(booking.hourlyRate || 40000)}/h</span>
            </div>
            <div className="flex justify-between text-slate-600 text-xs sm:text-sm">
              <span>Tiền cọc giữ chỗ:</span>
              <span className="font-mono font-semibold text-emerald-700">
                - {formatCurrency(booking.depositAmount || 100000)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-900 text-sm">Tạm tính hiện tại:</span>
              <span className="font-mono font-bold text-lg text-slate-900">
                {formatCurrency(booking.totalPrice || 180000)}
              </span>
            </div>
          </div>

          {/* Action Button Strip */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={onOpenQr}
              className="w-full h-11 px-4 rounded-xl bg-[#d95f00] hover:bg-[#b85000] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#d95f00]/20 active:scale-[0.99] cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>MÃ QR XUẤT BÃI (BARIE CHECK-OUT)</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 px-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Navigation className="w-3.5 h-3.5 text-[#455f87]" />
                <span>Chỉ đường</span>
              </a>
              <a
                href="tel:19006868"
                className="h-9 px-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-[#455f87]" />
                <span>Trực ban bến</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
