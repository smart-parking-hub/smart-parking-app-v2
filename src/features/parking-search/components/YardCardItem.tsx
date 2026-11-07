import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  MapPin,
  Star,
  Warehouse,
  Hourglass,
  Check,
  Zap,
} from 'lucide-react'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

interface Props {
  lot: ParkingLotItem
  isSelected: boolean
  onSelect: (lot: ParkingLotItem) => void
  onQuickBook: (lot: ParkingLotItem) => void
  onQueue?: (lot: ParkingLotItem) => void
}

export function YardCardItem({
  lot,
  isSelected,
  onSelect,
  onQuickBook,
  onQueue,
}: Props) {
  const currency = (value: number) =>
    new Intl.NumberFormat('vi-VN').format(value)

  return (
    <article
      onClick={() => onSelect(lot)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Chọn bãi xe ${lot.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(lot)
        }
      }}
      className={`group shrink-0 rounded-2xl border p-5 sm:p-6 transition-all duration-200 cursor-pointer select-none ${
        isSelected
          ? 'border-[#d95f00] ring-2 ring-[#d95f00]/30 shadow-md bg-orange-50/15'
          : 'border-slate-200/90 bg-white hover:border-[#d95f00]/60 hover:shadow-md hover:bg-slate-50/40'
      }`}
    >
      {/* Top Badges */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-bold ${
            lot.isFull || lot.availableSlots === 0
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : lot.availableSlots <= 3
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <Warehouse size={15} />
          {lot.isFull || lot.availableSlots === 0
            ? 'Hiện đã hết chỗ'
            : `${lot.availableSlots} chỗ còn trống`}
        </span>
        {lot.ratingAverage > 0 && (
          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            {lot.ratingAverage.toFixed(1)}
          </span>
        )}
      </div>

      {/* Yard Title */}
      <h3>
        <span
          className={`font-sora text-base sm:text-lg font-bold leading-snug tracking-tight transition-colors ${
            isSelected
              ? 'text-[#d95f00]'
              : 'text-slate-900 group-hover:text-[#d95f00]'
          }`}
        >
          {lot.name}
        </span>
      </h3>

      {/* Address */}
      <div className="mt-2 flex items-start gap-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <MapPin
          size={16}
          className={`mt-0.5 shrink-0 transition-colors ${
            isSelected ? 'text-[#d95f00]' : 'text-slate-400 group-hover:text-[#d95f00]'
          }`}
        />
        <span className={isSelected ? 'text-slate-900 font-medium' : ''}>
          {lot.address}
        </span>
      </div>

      {/* Distance & Best Match Chips */}
      {(lot.distanceKm > 0 || lot.isBestMatch) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          {lot.distanceKm > 0 && (
            <span className="font-semibold bg-slate-100 px-2.5 py-0.5 rounded-md">
              {lot.distanceKm.toFixed(1)} km từ vị trí tìm kiếm
            </span>
          )}
          {lot.isBestMatch && (
            <span className="inline-flex items-center gap-1 font-bold text-[#d95f00] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-md">
              <Check size={13} />
              Gợi ý phù hợp nhất
            </span>
          )}
        </div>
      )}

      {/* Price & Deposit Matrix */}
      <div className="my-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200/70">
        <div>
          <p className="mb-1 text-xs text-slate-500 font-medium">Giá đỗ niêm yết</p>
          <p className="text-lg sm:text-xl font-bold font-mono text-slate-900">
            {currency(lot.hourlyRate)}
            <span className="ml-1 text-xs font-normal text-slate-500 font-sans">
              ₫/giờ
            </span>
          </p>
        </div>
        <div className="border-l border-slate-200 pl-4">
          <p className="mb-1 text-xs text-slate-500 font-medium">Cọc giữ slot</p>
          <p className="text-sm sm:text-base font-bold font-mono text-slate-900">
            {lot.depositAmount > 0
              ? `${currency(lot.depositAmount)} ₫`
              : 'Xác nhận khi đặt chỗ'}
          </p>
        </div>
      </div>

      {/* Amenities Tags */}
      {!!lot.amenities.length && (
        <div className="mb-4 flex flex-wrap gap-2 text-xs text-slate-600">
          {lot.amenities.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium"
            >
              {item.toLowerCase().includes('điện') ? (
                <Zap size={13} className="text-emerald-600" />
              ) : (
                <Check size={13} className="text-[#d95f00]" />
              )}
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Queue Indicator for full lots */}
      {(lot.isFull || lot.availableSlots === 0) && lot.queueActive && (
        <p className="mb-4 flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
          <Hourglass size={15} className="text-amber-600 shrink-0 animate-pulse" />
          <span>{lot.queueWaitingCount ?? 1} xe đang trong hàng đợi điều phối</span>
        </p>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (lot.isFull || lot.availableSlots === 0) {
              onQueue?.(lot)
            } else {
              onQuickBook(lot)
            }
          }}
          className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-[0.99] cursor-pointer ${
            lot.isFull || lot.availableSlots === 0
              ? 'bg-[#131b2e] hover:bg-[#233144] text-white'
              : 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-md shadow-brand-primary/20'
          }`}
        >
          <span>
            {lot.isFull || lot.availableSlots === 0 ? 'ĐỢI SLOT' : 'ĐẶT GIỮ CHỖ 10P'}
          </span>
          <ArrowUpRight size={16} />
        </button>
        <Link
          onClick={(e) => e.stopPropagation()}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 text-xs sm:text-sm font-semibold text-slate-800 transition-colors shadow-2xs"
          to={`/parking/${lot.id}`}
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  )
}
