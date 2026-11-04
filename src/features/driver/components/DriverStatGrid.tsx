import { Link } from 'react-router-dom'
import {
  Truck,
  CalendarCheck,
  Clock,
  ListOrdered,
  ChevronRight,
  QrCode,
} from 'lucide-react'
import type { BookingDto } from '../types/driverTypes'

interface DriverStatGridProps {
  vehicleTotal: number
  bookingTotal: number
  activeCount: number
  queueCount?: number
  activeBooking?: BookingDto
  onOpenQr: () => void
}

export function DriverStatGrid({
  vehicleTotal,
  bookingTotal,
  activeCount,
  queueCount = 0,
  activeBooking,
  onOpenQr,
}: DriverStatGridProps) {
  const formattedVehicle = String(vehicleTotal).padStart(2, '0')
  const formattedBooking = String(bookingTotal).padStart(2, '0')
  const formattedActive = String(activeCount).padStart(2, '0')
  const formattedQueue = String(queueCount).padStart(2, '0')

  const berthDisplay = activeBooking?.berthNumber || '#C-12'
  const yardName = activeBooking?.parkingLotName
    ? activeBooking.parkingLotName.split(' ')[0] + ' ' + (activeBooking.parkingLotName.split(' ')[1] || '')
    : 'Bãi Sóng Thần'

  return (
    <section className="w-full mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Personal Fleet (SCR-020) */}
        <Link
          to="/vehicles"
          className="group flex flex-col justify-between p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#131b2e]">
              <Truck className="w-5 h-5 text-blue-600" />
            </span>
            <span className="font-mono text-xs text-[#76777d] uppercase tracking-wider">
              FLEET-OPS
            </span>
          </div>
          <div>
            <span className="block font-sora text-2xl lg:text-3xl font-bold text-[#0d1c2e] tracking-tight group-hover:text-[#d95f00] transition-colors">
              {formattedVehicle} Đầu Kéo
            </span>
            <p className="text-xs text-[#45464d] mt-1">Phương tiện đã xác thực an toàn</p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#455f87]">
            <span>Xem danh sách xe</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Lifetime Bookings (SCR-017) */}
        <Link
          to="/bookings"
          className="group flex flex-col justify-between p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#131b2e]">
              <CalendarCheck className="w-5 h-5 text-amber-600" />
            </span>
            <span className="font-mono text-xs text-[#76777d] uppercase tracking-wider">
              LOGS
            </span>
          </div>
          <div>
            <span className="block font-sora text-2xl lg:text-3xl font-bold text-[#0d1c2e] tracking-tight group-hover:text-[#d95f00] transition-colors">
              {formattedBooking} Lượt
            </span>
            <p className="text-xs text-[#45464d] mt-1">100% hoàn thành xuất bãi an toàn</p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#455f87]">
            <span>Lịch sử đặt chỗ</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: HIGHLIGHTED HERO (Active Spot) */}
        <div className="relative overflow-hidden flex flex-col justify-between p-6 bg-[#131b2e] text-white rounded-2xl shadow-lg border border-[#233144]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#d95f00]/15 rounded-full blur-2xl" />
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d95f00] animate-pulse" />
              <span className="text-xs uppercase text-[#ffdbca] tracking-wider font-semibold">
                ĐANG SỬ DỤNG
              </span>
            </div>
            <Clock className="w-5 h-5 text-[#d95f00]" />
          </div>
          <div className="relative z-10 my-1">
            <span className="block font-sora text-xl lg:text-2xl font-bold text-white tracking-tight">
              {formattedActive} Chuyến Đang Đỗ
            </span>
            <p className="text-xs text-[#bec6e0] mt-1">
              {yardName} · Slot{' '}
              <span className="font-mono font-bold text-[#ffb690]">{berthDisplay}</span>
            </p>
            <p className="font-mono text-[#7c839b] text-[11px] mt-0.5">
              Thời hạn ra bãi trước 22:00
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenQr}
            className="relative z-10 mt-3 w-full py-2.5 px-3 rounded-xl bg-[#d95f00] hover:bg-[#b85000] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
          >
            <span>MỞ VÉ QR CHECK-OUT</span>
            <QrCode className="w-4 h-4" />
          </button>
        </div>

        {/* Card 4: Virtual Queue (SCR-018) */}
        <Link
          to="/queues"
          className="group flex flex-col justify-between p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#131b2e]">
              <ListOrdered className="w-5 h-5 text-emerald-600" />
            </span>
            <span className="font-mono text-xs text-[#76777d] uppercase tracking-wider">
              PRIORITY
            </span>
          </div>
          <div>
            <span className="block font-sora text-2xl lg:text-3xl font-bold text-[#0d1c2e] tracking-tight group-hover:text-[#d95f00] transition-colors">
              {formattedQueue} Suất Chờ
            </span>
            <p className="text-xs text-[#45464d] mt-1">Sẵn sàng nhận chỗ ưu tiên các bãi cảng</p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#455f87]">
            <span>Đăng ký hàng đợi</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </section>
  )
}

