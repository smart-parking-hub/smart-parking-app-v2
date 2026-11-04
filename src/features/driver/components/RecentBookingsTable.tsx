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
      <div className="p-5 lg:p-6 bg-[#eff4ff] border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold tracking-tight">
            Lịch Sử Đỗ Xe Gần Đây
          </h3>
          <p className="text-xs text-[#45464d] mt-0.5">
            3 lượt đặt chỗ hoàn thành gần nhất trên toàn hệ thống cảng bãi
          </p>
        </div>
        <Link
          to="/bookings"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#e6eeff] text-[#0d1c2e] text-xs font-semibold transition-colors border border-slate-200/80 w-fit cursor-pointer"
        >
          <span>Xem toàn bộ {totalCount} chuyến (SCR-017)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Table responsive wrapper */}
      <div className="w-full overflow-x-auto">
        {bookings.length === 0 ? (
          <div className="p-8 text-center text-[#76777d]">
            <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs">Chưa có lịch sử chuyến xe nào được ghi nhận</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-10 bg-[#e6eeff] text-[#45464d] text-xs font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4 lg:px-6">Mã Đơn</th>
                <th className="py-2.5 px-4 lg:px-6">Bãi Đỗ Xe</th>
                <th className="py-2.5 px-4 lg:px-6">Biển Số Xe</th>
                <th className="py-2.5 px-4 lg:px-6">Thời Gian Đỗ</th>
                <th className="py-2.5 px-4 lg:px-6">Tổng Chi Phí</th>
                <th className="py-2.5 px-4 lg:px-6 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-[#0d1c2e]">
              {bookings.map((b) => (
                <tr
                  key={b.id || b.bookingCode}
                  className="h-14 hover:bg-[#eff4ff]/60 transition-colors"
                >
                  <td className="py-3 px-4 lg:px-6 font-mono font-bold text-[#0d1c2e]">
                    {b.bookingCode}
                  </td>
                  <td className="py-3 px-4 lg:px-6">
                    <span className="font-semibold block text-[#0d1c2e]">
                      {b.parkingLotName}
                    </span>
                    <span className="text-[#45464d] text-[11px] block truncate max-w-xs">
                      {b.parkingLotAddress}
                    </span>
                  </td>
                  <td className="py-3 px-4 lg:px-6 font-mono">
                    <span>{b.vehicleLicensePlate}</span>{' '}
                    <span className="text-[#76777d] text-[11px]">
                      / {b.trailerLicensePlate || '51R-024.89'}
                    </span>
                  </td>
                  <td className="py-3 px-4 lg:px-6">
                    <span className="block font-medium">18/02/2026</span>
                    <span className="text-[#45464d] text-[11px] block">
                      {b.parkingDuration || '10h 30m (Qua đêm)'}
                    </span>
                  </td>
                  <td className="py-3 px-4 lg:px-6 font-mono font-bold text-[#0d1c2e]">
                    {formatCurrency(b.totalPrice)}
                  </td>
                  <td className="py-3 px-4 lg:px-6 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
