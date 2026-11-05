import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Inbox } from 'lucide-react'
import type { BookingDto } from '../types/driverTypes'

interface RecentBookingsTableProps {
  bookings: BookingDto[]
  totalCount?: number
}

export function RecentBookingsTable({
  bookings,
  totalCount = 48,
}: RecentBookingsTableProps) {
  const formatCurrency = (val?: number) => {
    if (typeof val !== 'number') return '0 ₫'
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
  }

  return (
    <section className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
      {/* Header bar */}
      <div className="p-5 lg:p-6 bg-[#eff4ff] border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-sora text-lg lg:text-xl text-[#0d1c2e] font-bold tracking-tight">
            Lịch Sử Đỗ Xe Gần Đây
          </h3>
          <p className="text-sm text-slate-600 mt-0.5">
            3 lượt đặt chỗ hoàn thành gần nhất trên toàn hệ thống cảng bãi
          </p>
        </div>
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#e6eeff] text-[#0d1c2e] text-sm font-semibold transition-colors border border-slate-200 shadow-2xs w-fit cursor-pointer"
        >
          <span>Xem toàn bộ {totalCount} chuyến</span>
          <ArrowRight className="w-4 h-4 text-[#d95f00]" />
        </Link>
      </div>

      {/* Table responsive wrapper (To rõ, dễ nhìn, font chữ lớn không bị rối) */}
      <div className="w-full overflow-x-auto">
        {bookings.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">Chưa có lịch sử chuyến xe nào được ghi nhận</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-12 bg-slate-100/80 text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-5 lg:px-6">Mã Đơn</th>
                <th className="py-3 px-5 lg:px-6">Bãi Đỗ Xe</th>
                <th className="py-3 px-5 lg:px-6">Biển Số Xe</th>
                <th className="py-3 px-5 lg:px-6">Thời Gian Đỗ</th>
                <th className="py-3 px-5 lg:px-6">Tổng Chi Phí</th>
                <th className="py-3 px-5 lg:px-6 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#0d1c2e]">
              {bookings.map((b) => (
                <tr
                  key={b.id || b.bookingCode}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-4 px-5 lg:px-6 font-mono font-bold text-sm sm:text-base text-slate-900">
                    {b.bookingCode}
                  </td>
                  <td className="py-4 px-5 lg:px-6">
                    <span className="font-bold text-sm sm:text-base block text-slate-900 leading-snug">
                      {b.parkingLotName}
                    </span>
                    <span className="text-slate-500 text-xs sm:text-sm block truncate max-w-sm mt-0.5">
                      {b.parkingLotAddress}
                    </span>
                  </td>
                  <td className="py-4 px-5 lg:px-6">
                    <span className="font-mono text-sm sm:text-base font-bold text-slate-900 block">
                      {b.vehicleLicensePlate}
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-slate-500 block mt-0.5">
                      Rơ-moóc: {b.trailerLicensePlate || '51R-024.89'}
                    </span>
                  </td>
                  <td className="py-4 px-5 lg:px-6">
                    <span className="text-sm sm:text-base font-semibold text-slate-900 block">
                      18/02/2026
                    </span>
                    <span className="text-slate-500 text-xs sm:text-sm block mt-0.5">
                      {b.parkingDuration || '10h 30m (Qua đêm)'}
                    </span>
                  </td>
                  <td className="py-4 px-5 lg:px-6 font-mono font-bold text-base sm:text-lg text-slate-900">
                    {formatCurrency(b.totalPrice)}
                  </td>
                  <td className="py-4 px-5 lg:px-6 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      HOÀN THÀNH
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
