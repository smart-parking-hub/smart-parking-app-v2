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
      className={`group shrink-0 rounded-xl border p-3 transition-all duration-200 cursor-pointer select-none ${
        isSelected
          ? 'border-[#d95f00] shadow-[0_0_0_1px_rgba(217,95,0,0.45)] bg-orange-50/25'
          : 'border-slate-200/90 bg-white hover:border-[#d95f00]/60 hover:shadow-xs hover:bg-slate-50/40'
      }`}
    >
      {/* Top Meta Row: Availability + Distance + Best Match + Rating */}
      <div className="mb-1.5 flex items-center justify-between gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold tabular-nums ${
              lot.isFull || lot.availableSlots === 0
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : lot.availableSlots <= 3
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <Warehouse size={12} />
            {lot.isFull || lot.availableSlots === 0
              ? 'Hiện đã hết chỗ'
              : `${lot.availableSlots} chỗ trống`}
          </span>
          {lot.distanceKm > 0 && (
            <span className="text-[11px] font-semibold tabular-nums text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {lot.distanceKm.toFixed(1)} km
            </span>
          )}
          {lot.isBestMatch && (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#d95f00] bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-md">
              <Check size={11} />
              Gợi ý phù hợp
            </span>
          )}
        </div>
        {lot.ratingAverage > 0 && (
          <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold tabular-nums text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-200">
            <Star size={11} className="text-amber-500 fill-amber-500" />
            {lot.ratingAverage.toFixed(1)}
          </span>
        )}
      </div>

      {/* Yard Title */}
      <h3>
        <span
          className={`font-sora text-sm font-bold leading-snug tracking-tight transition-colors line-clamp-1 ${
            isSelected
              ? 'text-[#d95f00]'
              : 'text-slate-900 group-hover:text-[#d95f00]'
          }`}
        >
          {lot.name}
        </span>
      </h3>

      {/* Address */}
      <div className="mt-0.5 flex items-start gap-1.5 text-xs text-slate-600 leading-snug">
        <MapPin
          size={13}
          className={`mt-0.5 shrink-0 transition-colors ${
            isSelected ? 'text-[#d95f00]' : 'text-slate-400 group-hover:text-[#d95f00]'
          }`}
        />
        <span className={`line-clamp-1 ${isSelected ? 'text-slate-900 font-medium' : ''}`}>
          {lot.address}
        </span>
      </div>

      {/* Compact Single-Row Price & Deposit Strip (unified font) */}
      <div className="my-2 flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-200/70 text-xs">
        <div className="flex items-baseline gap-1 min-w-0">
          <span className="text-[11px] text-slate-500 font-medium shrink-0">Giá:</span>
          <span className="text-sm font-bold tabular-nums text-slate-900 truncate">
            {currency(lot.hourlyRate)}
            <span className="ml-0.5 text-[11px] font-normal text-slate-500">
              ₫/giờ
            </span>
          </span>
        </div>
        <div className="h-3.5 w-px bg-slate-200 shrink-0" />
        <div className="flex items-baseline gap-1 min-w-0 justify-end">
          <span className="text-[11px] text-slate-500 font-medium shrink-0">Cọc:</span>
          <span className="text-xs font-semibold tabular-nums text-slate-900 truncate">
            {lot.depositAmount > 0
              ? `${currency(lot.depositAmount)} ₫`
              : 'Khi đặt chỗ'}
          </span>
        </div>
      </div>

      {/* Amenities Tags (compact single line / wrap) */}
      {!!lot.amenities.length && (
        <div className="mb-2 flex flex-wrap gap-1 text-[10px] text-slate-600">
          {lot.amenities.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-slate-200 font-medium"
            >
              {item.toLowerCase().includes('điện') ? (
                <Zap size={10} className="text-emerald-600" />
              ) : (
                <Check size={10} className="text-[#d95f00]" />
              )}
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Queue Indicator for full lots */}
      {(lot.isFull || lot.availableSlots === 0) && lot.queueActive && (
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
          <Hourglass size={12} className="text-amber-600 shrink-0 animate-pulse" />
          <span>{lot.queueWaitingCount ?? 1} xe đang trong hàng đợi điều phối</span>
        </p>
      )}

      {/* Compact Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
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
          className={`inline-flex h-9 items-center justify-center gap-1 rounded-lg px-2.5 text-xs font-bold transition-all shadow-xs active:scale-[0.99] cursor-pointer ${
            lot.isFull || lot.availableSlots === 0
              ? 'bg-[#131b2e] hover:bg-[#233144] text-white'
              : 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-sm shadow-brand-primary/20'
          }`}
        >
          <span>
            {lot.isFull || lot.availableSlots === 0 ? 'ĐỢI SLOT' : 'ĐẶT GIỮ CHỖ 10P'}
          </span>
          <ArrowUpRight size={14} />
        </button>
        <Link
          onClick={(e) => e.stopPropagation()}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 text-xs font-semibold text-slate-800 transition-colors"
          to={`/parking/${lot.id}`}
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  )
}
