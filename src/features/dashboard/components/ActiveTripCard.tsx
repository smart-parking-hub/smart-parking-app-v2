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
import type { BookingDto } from '../types/dashboardTypes'

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

            {/* Yard specs chip matrix */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2.5 py-1 rounded bg-[#e6eeff] text-[#0d1c2e] text-xs flex items-center gap-1.5">
                <Square className="w-3.5 h-3.5 text-[#455f87]" />
                Vị trí: <strong className="font-mono text-[#d95f00]">{booking.berthNumber || 'BERTH C-12'}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-[#e6eeff] text-[#0d1c2e] text-xs flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-[#455f87]" />
                Chiều dài lọt lòng: <strong>{booking.usableLength || '18.5m'}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-[#e6eeff] text-[#0d1c2e] text-xs flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#455f87]" />
                Điện bãi 380V: <strong>Sẵn sàng (Shore Power)</strong>
              </span>
            </div>
          </div>

          {/* Vehicle specs row */}
          <div className="p-4 bg-[#eff4ff] rounded-xl border border-blue-100">
            <div className="font-mono text-[#76777d] uppercase text-[11px] mb-1.5 font-medium">
              PHƯƠNG TIỆN ĐÃ ĐĂNG KÝ VÀO BÃI
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs text-[#45464d] block">Đầu kéo</span>
                  <span className="font-sora text-base lg:text-lg font-bold font-mono text-[#0d1c2e]">
                    {booking.vehicleLicensePlate}
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-300" />
                <div>
                  <span className="text-xs text-[#45464d] block">Rơ-moóc chuyên dụng</span>
                  <span className="font-sora text-base lg:text-lg font-bold font-mono text-[#0d1c2e]">
                    {booking.trailerLicensePlate || '51R-024.89'}
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-[#dce9ff] text-[#001c3b] text-xs font-semibold">
                {booking.containerType || 'CONTAINER 40FT HEAVY'}
              </span>
            </div>
          </div>

          {/* Operational Timeline Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-slate-200/60">
              <span className="text-xs text-[#45464d] block">Check-in ALPR</span>
              <span className="font-mono text-base font-bold text-[#0d1c2e]">
                {booking.checkInTime || '14:15'}
              </span>
              <span className="text-[11px] text-[#76777d] block font-mono">
                Hôm nay ({booking.gateName || 'Cổng B1'})
              </span>
            </div>
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-slate-200/60">
              <span className="text-xs text-[#45464d] block">Dự kiến trả chỗ</span>
              <span className="font-mono text-base font-bold text-[#0d1c2e]">20:15</span>
              <span className="text-[11px] text-[#76777d] block font-mono">Hôm nay (6h chuẩn)</span>
            </div>
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-slate-200/60">
              <span className="text-xs text-[#45464d] block">Thời gian đỗ</span>
              <span className="font-mono text-base font-bold text-[#d95f00]">
                {booking.parkingDuration || '03h 45m'}
              </span>
              <span className="text-[11px] text-[#76777d] block font-mono">Đồng hồ tự động</span>
            </div>
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-slate-200/60">
              <span className="text-xs text-[#45464d] block">Chi phí tạm tính</span>
              <span className="font-mono text-base font-bold text-[#0d1c2e]">
                {formatCurrency(booking.totalPrice || 180000)}
              </span>
              <span className="text-[11px] text-[#76777d] block font-mono">
                {formatCurrency(booking.hourlyRate || 40000)}/h
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Parking Bay Map Snapshot + QR Action Column */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#eff4ff] p-5 rounded-xl border border-blue-100">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-[#0d1c2e] uppercase tracking-wide">
                SƠ ĐỒ VỊ TRÍ ĐỖ {booking.berthNumber || 'BERTH C-12'}
              </span>
              <span className="font-mono text-[11px] text-[#455f87]">CẬP NHẬT 1 PHÚT TRƯỚC</span>
            </div>

            {/* Integrated Map Canvas with Industrial Grid Styling */}
            <div className="w-full h-44 rounded-lg relative overflow-hidden shadow-inner flex items-end p-2.5 bg-slate-900 border border-slate-800">
              {/* Grid graphic lines */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #38bdf8 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '24px 24px, 12px 12px, 12px 12px',
                }}
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-1 rounded text-[11px] font-mono text-emerald-400">
                GPS: 10.8924° N, 106.7725° E
              </div>
              <div className="relative z-10 bg-[#131b2e]/90 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 shadow-md border border-white/10">
                <MapPin className="text-[#d95f00] w-4 h-4 shrink-0" />
                <span className="truncate">ICD Sóng Thần 2 · Vị trí đỗ {booking.berthNumber || 'C-12'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#45464d] px-1">
              <span>Tiền cọc giữ chỗ (PayOS VietQR):</span>
              <span className="font-mono font-bold text-[#0d1c2e]">
                {formatCurrency(booking.depositAmount || 100000)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#45464d] px-1">
              <span>Cần thanh toán thêm khi ra cổng:</span>
              <span className="font-mono font-bold text-[#d95f00]">
                {formatCurrency(booking.remainingAmount || 80000)}
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={onOpenQr}
                className="w-full h-11 rounded-xl bg-[#d95f00] hover:bg-[#b85000] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
              >
                <QrCode className="w-5 h-5" />
                <span>MÃ QR XUẤT BÃI (BARIE CHECK-OUT)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 rounded-xl bg-[#233144] hover:bg-[#131b2e] text-[#eaf1ff] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors text-center border border-white/5"
                >
                  <Navigation className="w-4 h-4" />
                  <span>CHỈ ĐƯỜNG CỔNG</span>
                </a>
                <a
                  href="tel:0908123456"
                  className="h-10 rounded-xl bg-white hover:bg-slate-100 text-[#0d1c2e] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors text-center border border-slate-300/80"
                >
                  <Phone className="w-4 h-4" />
                  <span>TRỰC BAN BÃI</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
