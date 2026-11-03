import { useState, useEffect } from 'react'
import {
  MapPin,
  Timer,
  ChevronRight,
  QrCode,
} from 'lucide-react'
import type { BookingItemDto } from '../types/bookingTypes'

interface BookingCardItemProps {
  booking: BookingItemDto
  isSelected: boolean
  onSelect: (booking: BookingItemDto) => void
  onPayDepositQuick?: (booking: BookingItemDto) => void
}

export function BookingCardItem({
  booking,
  isSelected,
  onSelect,
  onPayDepositQuick,
}: BookingCardItemProps) {
  // Live countdown for PENDING_PAYMENT
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    booking.holdSecondsRemaining || 600
  )

  useEffect(() => {
    if (booking.status !== 'PENDING_PAYMENT') return
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [booking.status])

  const formatCountdown = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ'
  }

  const isPendingPayment = booking.status === 'PENDING_PAYMENT'
  const isCompleted = booking.status === 'COMPLETED' || booking.status === 'REVIEWED'
  const isParking = booking.status === 'PARKING'

  return (
    <article
      onClick={() => onSelect(booking)}
      className={`bg-white p-4 rounded-xl shadow-xs transition-all cursor-pointer relative border ${
        isSelected
          ? 'border-2 border-[#d95f00] shadow-md ring-2 ring-[#d95f00]/10'
          : 'border-slate-200/80 hover:border-slate-300'
      } ${isCompleted && !isSelected ? 'opacity-90' : ''}`}
    >
      {/* Top Floating Badge for Active Parking */}
      {isParking && (
        <div className="absolute -top-3 right-4 bg-[#d95f00] text-white px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>{booking.statusBadgeLabel}</span>
        </div>
      )}

      {/* Top Header of Card */}
      <div className="flex items-start justify-between gap-2 mt-0.5">
        <div>
          <span className="font-mono text-lg text-slate-900 font-bold tracking-tight">
            {booking.bookingCode}
          </span>
          <p className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
            {booking.parkingLotName}
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#d95f00] shrink-0" />
            <span className="line-clamp-1">{booking.parkingLotAddress}</span>
          </p>
        </div>

        {/* Status Badge for Non-Parking Cards */}
        {!isParking && (
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wide shrink-0 ${
              isPendingPayment
                ? 'bg-[#fff7ed] text-[#d95f00] border border-[#ffedd5] flex items-center gap-1'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isPendingPayment && <Timer className="w-3 h-3 text-[#d95f00]" />}
            {booking.statusBadgeLabel}
          </span>
        )}
      </div>

      {/* Specific content depending on status */}
      {isPendingPayment ? (
        <div className="my-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block">
              Thời gian giữ slot còn:
            </span>
            <span className="font-mono text-xl font-bold text-[#d95f00]">
              {formatCountdown(secondsRemaining)}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onPayDepositQuick?.(booking)
            }}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-white" />
            <span>Quét Cọc 100K</span>
          </button>
        </div>
      ) : isCompleted ? (
        <div className="my-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Hoàn thành:</span>
            <span className="font-mono text-slate-700 font-medium">
              {booking.actualCheckOutTime}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">Tổng thanh toán:</span>
            <span className="font-mono font-bold text-slate-900">
              {formatCurrency(booking.parkingSubtotal)}
            </span>
          </div>
        </div>
      ) : (
        /* Active Parking Details */
        <div className="my-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Tổ hợp phương tiện:</span>
            <span className="font-mono font-semibold text-slate-900">
              {booking.vehiclePlate}
              {booking.trailerPlate ? ` / ${booking.trailerPlate}` : ''}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Check-in barie:</span>
            <span className="font-mono text-slate-800 font-medium">
              {booking.actualCheckInTime}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Cọc PayOS đã giữ:</span>
            <span className="font-mono font-semibold text-slate-900">
              {formatCurrency(booking.depositPaid)}
            </span>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="font-mono text-xs text-[#d95f00] font-semibold truncate max-w-[220px]">
          Slot: {booking.berthCode || 'Chờ gán slot'}
        </span>
        <span className="text-xs font-semibold text-[#d95f00] flex items-center hover:underline">
          Chi tiết vé <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>
    </article>
  )
}
