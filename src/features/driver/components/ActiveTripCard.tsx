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
        <h3 className="font-sora text-lg font-bold text-[#0d1c2e]">Chưa có chuyến đỗ nào đang hoạt động</h3>
        <p className="text-sm text-[#45464d] max-w-md mx-auto mt-1 mb-5">
          Hiện tại phương tiện của bạn không có phiên đỗ xe nào cần xử lý. Hãy tìm bãi đỗ an toàn trên lộ trình.
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
      <div className="px-6 py-4 bg-[#eff4ff] border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Truck className="w-5 h-5 text-[#0d1c2e]" />
          <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold tracking-tight">
            CHUYẾN ĐỖ ĐANG HOẠT ĐỘNG THỜI GIAN THỰC
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#ffdbca] text-[#341100] text-xs font-semibold tracking-wide border border-[#ffb690]/40">
            <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
            ĐANG ĐỖ TẠI BÃI (PARKING)
          </span>
          <span className="font-mono text-xs text-[#45464d] bg-[#e6eeff] px-2.5 py-1 rounded font-medium">
            MÃ ĐƠN: {booking.bookingCode}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Yard & Vehicle Manifest */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-start gap-2.5 mb-3">
              <MapPin className="w-5 h-5 text-[#455f87] shrink-0 mt-0.5" />
              <div>
                <span className="font-sora text-lg text-[#0d1c2e] font-semibold block leading-tight">
                  {booking.parkingLotName}
                </span>
                <p className="text-sm text-[#45464d] mt-1 leading-snug">
                  {booking.parkingLotAddress}
                </p>
              </div>
            </div>

            {/* Vessel/Yard Tech Specs Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8f9ff] text-[#0d1c2e] text-xs font-medium border border-slate-200">
                <Square className="w-3.5 h-3.5 text-[#455f87]" />
                Vị trí: <strong className="font-mono text-[#d95f00]">{booking.berthNumber || 'BERTH C-12'}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8f9ff] text-[#0d1c2e] text-xs font-medium border border-slate-200">
                <Ruler className="w-3.5 h-3.5 text-[#455f87]" />
                Chiều dài: <strong className="font-mono">{booking.usableLength || '18.5m'}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8f9ff] text-emerald-800 text-xs font-medium border border-emerald-200 bg-emerald-50">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                Điện bờ 3 pha: Có sẵn
              </span>
            </div>
          </div>

          {/* Vehicle Manifest Sub-card */}
          <div className="p-4 bg-[#eff4ff]/60 rounded-xl border border-blue-100/60">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#76777d] block mb-2 font-semibold">
              HỒ SƠ PHƯƠNG TIỆN CHECK-IN
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-xs text-[#45464d] block">Đầu kéo:</span>
                <strong className="font-mono text-sm text-[#0d1c2e]">
                  {booking.vehicleLicensePlate}
                </strong>
              </div>
              <div>
                <span className="text-xs text-[#45464d] block">Rơ-moóc:</span>
                <strong className="font-mono text-sm text-[#0d1c2e]">
                  {booking.trailerLicensePlate || '51R-024.89'}
                </strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs text-[#45464d] block">Quy cách hàng:</span>
                <strong className="font-mono text-xs text-[#0d1c2e] truncate block">
                  {booking.containerType || 'CONTAINER 40FT HEAVY'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Telemetry Clock, Payment & Barie Pass */}
        <div className="lg:col-span-5 bg-[#f8f9ff] p-5 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-4">
          {/* Real-time Parking Counter */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs text-[#45464d] block mb-0.5">Giờ vào bến:</span>
              <span className="font-mono text-base font-bold text-[#0d1c2e]">
                {booking.checkInTime || '14:15'} (Hôm nay)
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#45464d] block mb-0.5">Thời gian đã đỗ:</span>
              <span className="font-mono text-lg font-bold text-[#d95f00]">
                {booking.parkingDuration || '03h 45m'}
              </span>
            </div>
          </div>

          {/* Pricing Ledger summary */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#45464d]">
              <span>Đơn giá niêm yết:</span>
              <span className="font-mono font-medium">{formatCurrency(booking.hourlyRate || 40000)}/h</span>
            </div>
            <div className="flex justify-between text-[#45464d]">
              <span>Tiền cọc giữ chỗ:</span>
              <span className="font-mono font-medium text-emerald-700">
                - {formatCurrency(booking.depositAmount || 100000)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-sm">
              <span className="font-bold text-[#0d1c2e]">Tạm tính hiện tại:</span>
              <span className="font-mono font-bold text-base text-[#0d1c2e]">
                {formatCurrency(booking.totalPrice || 180000)}
              </span>
            </div>
          </div>

          {/* Action Button Strip */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={onOpenQr}
              className="w-full py-3 px-4 rounded-xl bg-[#d95f00] hover:bg-[#b85000] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>MÃ QR XUẤT BÃI (BARIE CHECK-OUT)</span>
            </button>
            <div className="flex gap-2">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-white border border-slate-200 text-[#0d1c2e] hover:bg-slate-50 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#455f87]" />
                <span>Chỉ đường</span>
              </a>
              <a
                href="tel:19006868"
                className="flex-1 py-2 px-3 rounded-lg bg-white border border-slate-200 text-[#0d1c2e] hover:bg-slate-50 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
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

