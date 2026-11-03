import { RefreshCw, Inbox } from 'lucide-react'
import type { BookingItemDto } from '../types/bookingTypes'
import { BookingCardItem } from './BookingCardItem'

interface BookingMasterListProps {
  bookings: BookingItemDto[]
  selectedBookingId: number
  onSelectBooking: (booking: BookingItemDto) => void
  onRefresh: () => void
  isRefreshing?: boolean
  onPayDepositQuick?: (booking: BookingItemDto) => void
}

export function BookingMasterList({
  bookings,
  selectedBookingId,
  onSelectBooking,
  onRefresh,
  isRefreshing,
  onPayDepositQuick,
}: BookingMasterListProps) {
  return (
    <section aria-label="Danh sách vé đặt chỗ" className="lg:col-span-5 flex flex-col gap-4">
      {/* Header bar of list */}
      <div className="flex items-center justify-between pb-1">
        <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold">
          DANH SÁCH PHIÊN VẬN HÀNH ({bookings.length} ĐƠN)
        </span>
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1 text-xs font-semibold text-[#d95f00] hover:underline cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Cards List or Empty State */}
      {bookings.length === 0 ? (
        <div className="p-8 bg-white rounded-xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center gap-2">
          <Inbox className="w-8 h-8 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Không tìm thấy phiên đặt chỗ nào</p>
          <p className="text-xs text-slate-400">
            Vui lòng thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc trạng thái khác.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <BookingCardItem
              key={booking.id}
              booking={booking}
              isSelected={booking.id === selectedBookingId}
              onSelect={onSelectBooking}
              onPayDepositQuick={onPayDepositQuick}
            />
          ))}
        </div>
      )}
    </section>
  )
}
