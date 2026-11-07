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
          className="group flex flex-col justify-between p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-normal text-slate-500">Đội xe đăng ký</span>
            <Truck className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
          <div>
            <span className="block font-sora text-2xl font-bold text-slate-900 tracking-tight tabular-nums group-hover:text-[#d95f00] transition-colors whitespace-nowrap">
              {formattedVehicle} Đầu Kéo
            </span>
            <p className="text-xs text-slate-600 mt-1">
              Phương tiện đã xác thực an toàn
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
            <span>Xem danh sách xe</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Lifetime Bookings */}
        <Link
          to="/bookings"
          className="group flex flex-col justify-between p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-normal text-slate-500">Lịch sử điều phối</span>
            <CalendarCheck className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
          <div>
            <span className="block font-sora text-2xl font-bold text-slate-900 tracking-tight tabular-nums group-hover:text-[#d95f00] transition-colors whitespace-nowrap">
              {formattedBooking} Lượt Đỗ
            </span>
            <p className="text-xs text-slate-600 mt-1">
              100% hoàn thành xuất bãi an toàn
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
            <span>Lịch sử đặt chỗ</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        {/* Card 3: Active Spot */}
        <div className="flex flex-col justify-between p-5 bg-white rounded-xl border border-orange-300/80 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#c2410c] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d95f00]" />
              Đang sử dụng bãi
            </span>
            <Clock className="w-4 h-4 text-[#d95f00]" />
          </div>
          <div>
            <span className="block font-sora text-2xl font-bold text-slate-900 tracking-tight tabular-nums whitespace-nowrap">
              {formattedActive} Chuyến Đang Đỗ
            </span>
            <p className="text-xs text-slate-600 mt-1 truncate">
              {yardName} · Slot <span className="font-semibold text-slate-900">{berthDisplay}</span>
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Thời hạn ra bãi trước 22:00
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onOpenQr}
              className="w-full py-2 px-3 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Mở vé QR check-out</span>
            </button>
          </div>
        </div>

        {/* Card 4: Virtual Queue */}
        <Link
          to="/queues"
          className="group flex flex-col justify-between p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-normal text-slate-500">Hàng đợi bến</span>
            <ListOrdered className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
          <div>
            <span className="block font-sora text-2xl font-bold text-slate-900 tracking-tight tabular-nums group-hover:text-[#d95f00] transition-colors whitespace-nowrap">
              {formattedQueue} Suất Chờ
            </span>
            <p className="text-xs text-slate-600 mt-1">
              Hàng đợi điều phối tự động cảng biển
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
            <span>Hàng đợi của tôi</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>
    </section>
  )
}
