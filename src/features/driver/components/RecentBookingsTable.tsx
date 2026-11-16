import { Link } from 'react-router-dom'
import { ArrowRight, Inbox } from 'lucide-react'
import { Badge, money } from '@/shared/components/Workspace'
import { bookingReference } from '@/entities/booking/bookingReference'
import { dashboardTime, parkingDuration, ticketUrl } from '../lib/dashboardBooking'
import type { BookingDto } from '../types/driverTypes'

interface RecentBookingsTableProps {
  bookings: BookingDto[]
  totalCount?: number
}

export function RecentBookingsTable({
  bookings,
  totalCount = bookings.length,
}: RecentBookingsTableProps) {

  return (
    <section className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
      {/* Header bar */}
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-sora text-base sm:text-lg text-slate-900 font-bold tracking-tight">
            Lịch Sử Đỗ Xe Gần Đây
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Các lượt đặt chỗ gần đây của bạn
          </p>
        </div>
        <Link
          to="/bookings"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors border border-slate-200 w-fit cursor-pointer"
        >
          <span>Xem toàn bộ {totalCount} chuyến</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#d95f00]" />
        </Link>
      </div>

      <div className="w-full overflow-x-auto">
        {bookings.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-xs sm:text-sm">Chưa có lịch sử chuyến xe nào được ghi nhận</p>
          </div>
        ) : (
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="h-10 text-slate-500 text-xs font-normal border-b border-slate-200">
                <th className="py-2.5 px-4 lg:px-6 font-medium w-36">Mã đơn</th>
                <th className="py-2.5 px-4 lg:px-6 font-medium">Bãi đỗ xe</th>
                <th className="py-2.5 px-4 lg:px-6 font-medium w-40">Biển số xe</th>
                <th className="py-2.5 px-4 lg:px-6 font-medium w-36">Thời gian đỗ</th>
                <th className="py-2.5 px-4 lg:px-6 font-medium text-right w-36">Tổng chi phí</th>
                <th className="py-2.5 px-4 lg:px-6 font-medium text-right w-32">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900 text-xs sm:text-sm">
              {bookings.map((b) => (
                <tr
                  key={b.id || b.bookingCode}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3.5 px-4 lg:px-6 font-mono font-semibold text-xs text-slate-700 tabular-nums whitespace-nowrap">
                    <Link to={ticketUrl(b)} className="hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-brand-primary">{bookingReference(b)}</Link>
                  </td>
                  <td className="py-3.5 px-4 lg:px-6">
                    <span className="font-semibold text-slate-900 block leading-snug">
                      {b.parkingLotName}
                    </span>
                    <span className="text-slate-500 text-xs block truncate max-w-xs sm:max-w-sm mt-0.5">
                      {b.parkingLotAddress}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 lg:px-6 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-slate-900 block tabular-nums">
                      {b.vehicleLicensePlate}
                    </span>
                    <span className="font-mono text-xs text-slate-500 block mt-0.5 tabular-nums">
                      {b.trailerLicensePlate ? `Rơ-moóc: ${b.trailerLicensePlate}` : ''}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 lg:px-6 whitespace-nowrap">
                    <span className="text-xs font-medium text-slate-900 block">
                      {dashboardTime(b.checkInTime ?? b.expectedCheckInTime)}
                    </span>
                    <span className="text-slate-500 text-xs block mt-0.5">
                      {b.checkInTime ? parkingDuration(b) : 'Chưa check-in'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 lg:px-6 font-mono font-semibold text-sm text-slate-900 text-right tabular-nums whitespace-nowrap">
                    {money(b.totalPrice)}
                  </td>
                  <td className="py-3.5 px-4 lg:px-6 text-right whitespace-nowrap">
                    <Badge value={b.status} />
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
