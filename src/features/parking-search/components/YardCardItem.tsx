import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  MapPin,
  Star,
  Warehouse,
  Hourglass,
  Check,
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
      className={`shrink-0 rounded-3xl border bg-white p-6 transition-colors sm:p-7 ${isSelected ? 'border-brand-orange shadow-sm' : 'border-brand-border hover:border-brand-muted'}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold ${lot.isFull ? 'bg-brand-surface text-brand-muted' : 'bg-brand-navy text-white'}`}
        >
          <Warehouse size={15} />
          {lot.isFull
            ? 'Hiện đã hết chỗ'
            : `${lot.availableSlots} chỗ còn trống`}
        </span>
        {lot.ratingAverage > 0 && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-navy">
            <Star size={15} className="text-brand-orange" />
            {lot.ratingAverage.toFixed(1)}
          </span>
        )}
      </div>
      <h3>
        <button
          onClick={() => onSelect(lot)}
          aria-pressed={isSelected}
          className="text-left font-sora text-lg font-semibold leading-relaxed tracking-tight text-brand-navy sm:text-xl"
        >
          {lot.name}
        </button>
      </h3>
      <p className="mt-3 flex items-start gap-2 text-[15px] leading-6 text-brand-muted">
        <MapPin size={17} className="mt-1 shrink-0" />
        {lot.address}
      </p>
      {(lot.distanceKm > 0 || lot.isBestMatch) && (
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-brand-muted">
          {lot.distanceKm > 0 && (
            <span>{lot.distanceKm.toFixed(1)} km từ điểm tìm kiếm</span>
          )}
          {lot.isBestMatch && (
            <span className="inline-flex items-center gap-1.5 font-semibold text-brand-orange">
              <Check size={15} />
              Gợi ý phù hợp
            </span>
          )}
        </div>
      )}
      <div className="my-6 grid grid-cols-2 gap-5 rounded-2xl bg-brand-surface p-5">
        <div>
          <p className="mb-2 text-sm text-brand-muted">Giá đỗ theo giờ</p>
          <p className="text-2xl font-semibold tabular-nums text-brand-navy">
            {currency(lot.hourlyRate)}
            <span className="ml-1 text-sm font-normal text-brand-muted">
              đ/giờ
            </span>
          </p>
        </div>
        <div className="border-l border-brand-border pl-5">
          <p className="mb-2 text-sm text-brand-muted">Cọc giữ chỗ</p>
          <p className="text-base font-semibold tabular-nums text-brand-navy">
            {lot.depositAmount > 0
              ? `${currency(lot.depositAmount)} đ`
              : 'Xác nhận khi đặt chỗ'}
          </p>
        </div>
      </div>
      {!!lot.amenities.length && (
        <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-brand-muted">
          {lot.amenities.map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-brand-orange" />
              {item}
            </span>
          ))}
        </div>
      )}
      {lot.isFull && lot.queueActive && (
        <p className="mb-5 flex items-center gap-2 text-sm text-brand-muted">
          <Hourglass size={17} />
          {lot.queueWaitingCount ?? 0} xe đang chờ
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => (lot.isFull ? onQueue?.(lot) : onQuickBook(lot))}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-navy px-3 text-sm font-semibold text-white hover:bg-brand-navy-light"
        >
          {lot.isFull ? 'Xếp hàng ảo' : 'ĐẶT GIỮ CHỖ 10P'}
          <ArrowUpRight size={17} />
        </button>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-brand-border px-3 text-sm font-semibold text-brand-navy hover:bg-brand-surface"
          to={`/dashboard/parking/${lot.id}`}
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  )
}
