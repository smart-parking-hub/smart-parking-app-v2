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
        {/* Card 1: Personal Fleet */}
        <Link
          to="/vehicles"
          className="group flex flex-col justify-between p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#131b2e]">
              <Truck className="w-5 h-5 text-blue-600" />
            </span>
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
              FLEET-OPS
            </span>
          </div>
          <div>
            <span className="block font-sora text-xl xl:text-2xl font-bold text-[#0d1c2e] tracking-tight group-hover:text-[#d95f00] transition-colors whitespace-nowrap">
              {formattedVehicle} Đầu Kéo
            </span>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Phương tiện đã xác thực an toàn
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#455f87]">
            <span>Xem danh sách xe</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Lifetime Bookings */}
        <Link
          to="/bookings"
          className="group flex flex-col justify-between p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#131b2e]">
              <CalendarCheck className="w-5 h-5 text-amber-600" />
            </span>
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
              LOGS
            </span>
          </div>
          <div>
            <span className="block font-sora text-xl xl:text-2xl font-bold text-[#0d1c2e] tracking-tight group-hover:text-[#d95f00] transition-colors whitespace-nowrap">
              {formattedBooking} Lượt Đỗ
            </span>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              100% hoàn thành xuất bãi an toàn
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#455f87]">
            <span>Lịch sử đặt chỗ</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: Active Spot (Fix xuống dòng vô lý & cân bằng chỗ trống) */}
        <div className="group flex flex-col justify-between p-5 bg-white rounded-2xl border border-orange-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#d95f00]">
              <Clock className="w-5 h-5 text-[#d95f00]" />
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-[#b85000] text-xs font-semibold border border-orange-200/50">
              <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
              ĐANG SỬ DỤNG
            </span>
          </div>
          <div>
            <span className="block font-sora text-xl xl:text-2xl font-bold text-[#0d1c2e] tracking-tight whitespace-nowrap">
              {formattedActive} Chuyến Đang Đỗ
            </span>
            <p className="text-xs text-slate-600 mt-1 font-medium truncate">
              {yardName} · Slot <span className="font-mono font-bold text-[#d95f00]">{berthDisplay}</span>
            </p>
            <p className="font-mono text-slate-400 text-[11px] mt-0.5">
              Thời hạn ra bãi trước 22:00
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onOpenQr}
              className="w-full py-2 px-3 rounded-xl bg-[#d95f00] hover:bg-[#b85000] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer active:scale-[0.99]"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>MỞ VÉ QR CHECK-OUT</span>
            </button>
          </div>
        </div>

        {/* Card 4: Virtual Queue */}
        <Link
          to="/queues"
          className="group flex flex-col justify-between p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#131b2e]">
              <ListOrdered className="w-5 h-5 text-emerald-600" />
            </span>
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
              PRIORITY
            </span>
          </div>
          <div>
            <span className="block font-sora text-xl xl:text-2xl font-bold text-[#0d1c2e] tracking-tight group-hover:text-[#d95f00] transition-colors whitespace-nowrap">
              {formattedQueue} Suất Chờ
            </span>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Hàng đợi điều phối tự động cảng biển
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#455f87]">
            <span>Hàng đợi của tôi</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </section>
  )
}
