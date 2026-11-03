import { Link } from 'react-router-dom'
import {
  Navigation2,
  Clock,
  Warehouse,
  ArrowRight,
  Shield,
  Zap,
  Video,
  DoorOpen,
  ShowerHead,
  Hourglass,
  Lock,
} from 'lucide-react'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

interface YardCardItemProps {
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
}: YardCardItemProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
  }

  // Render amenity icon
  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.includes('camera')) return <Video className="w-3.5 h-3.5 text-[#455f87]" />
    if (lower.includes('barie')) return <DoorOpen className="w-3.5 h-3.5 text-[#455f87]" />
    if (lower.includes('reefer') || lower.includes('sạc'))
      return <Zap className="w-3.5 h-3.5 text-[#d95f00]" />
    if (lower.includes('tắm') || lower.includes('giặt'))
      return <ShowerHead className="w-3.5 h-3.5 text-[#455f87]" />
    return <Shield className="w-3.5 h-3.5 text-[#455f87]" />
  }

  return (
    <div
      onClick={() => onSelect(lot)}
      className={`bg-white rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-200 border cursor-pointer shrink-0 ${
        isSelected
          ? 'border-[#d95f00] ring-2 ring-[#d95f00]/20 shadow-md'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      {/* Best Match Flag */}
      {lot.isBestMatch && (
        <div className="absolute top-0 right-0 bg-[#131b2e] text-[#bec6e0] px-3 py-1 rounded-bl-xl font-mono uppercase tracking-wider text-[11px] font-bold border-b border-l border-white/10">
          BEST MATCH · TỐI ƯU TẢI TRỌNG
        </div>
      )}

      {/* Main Yard Info */}
      <div className="flex items-start justify-between gap-3 mt-0.5">
        <div>
          <h3 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold tracking-tight">
            {lot.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-[#45464d] mt-1">
            <span className="font-semibold text-[#0d1c2e] flex items-center gap-1">
              <Navigation2 className="w-3.5 h-3.5 text-[#d95f00]" />
              {lot.distanceKm} km
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#455f87]" />
              {lot.etaMinutes} phút di chuyển
            </span>
          </div>
          <p className="text-xs text-[#45464d] mt-1 leading-snug">{lot.address}</p>
        </div>
      </div>

      {/* Slots Info Badges */}
      <div className="flex flex-wrap items-center gap-2 my-3">
        {lot.isFull ? (
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-rose-600" /> {lot.slotTypeLabel}
          </span>
        ) : (
          <span className="bg-[#341100] text-[#ffdbca] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-[#d95f00]/30">
            <Warehouse className="w-3.5 h-3.5 text-[#d95f00]" /> {lot.slotTypeLabel}
          </span>
        )}

        {lot.maxVehicleLength && (
          <span className="bg-[#eff4ff] text-[#0d1c2e] px-2.5 py-1 rounded-lg text-xs font-semibold">
            {lot.maxVehicleLength}
          </span>
        )}

        {lot.queueActive && (
          <span className="bg-[#dae2fd] text-[#131b2e] px-2.5 py-0.5 rounded-lg font-mono text-[11px] font-bold">
            VIRTUAL QUEUE HOẠT ĐỘNG
          </span>
        )}
      </div>

      {/* Pricing / Queue Stats Row */}
      {lot.isFull && lot.queueActive ? (
        <div className="bg-[#eff4ff] rounded-xl p-3 flex items-center justify-between mb-3 border border-blue-100">
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-[#455f87]" />
            <p className="text-xs text-[#0d1c2e]">
              Có <strong className="text-[#d95f00]">{lot.queueWaitingCount} xe</strong> đang xếp
              hàng chờ giải tỏa
            </p>
          </div>
          <span className="font-mono text-xs text-[#45464d] font-bold">
            ETA: ~{lot.queueEtaMinutes}p/xe
          </span>
        </div>
      ) : (
        <div className="bg-[#eff4ff] rounded-xl p-3 flex items-center justify-between mb-3 border border-blue-100">
          <div>
            <span className="text-xs text-[#45464d] block">Đơn giá lưu bãi</span>
            <span className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold font-mono">
              {formatCurrency(lot.hourlyRate)}
              <span className="text-xs font-normal text-[#45464d]"> / giờ</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#45464d] block">Cọc giữ chỗ tức thời</span>
            <span className="text-xs lg:text-sm text-[#455f87] font-semibold font-mono">
              {formatCurrency(lot.depositAmount)}
            </span>
          </div>
        </div>
      )}

      {/* Amenities Strip */}
      {lot.amenities.length > 0 && (
        <div className="text-xs text-[#45464d] mb-4 flex flex-wrap gap-1.5">
          {lot.amenities.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-[#f8f9ff] px-2 py-0.5 rounded-md text-[#0d1c2e] border border-slate-200/60"
            >
              {getAmenityIcon(item)}
              <span>{item}</span>
            </span>
          ))}
        </div>
      )}

      {/* Action CTA Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        {lot.isFull ? (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onQueue?.(lot)
              }}
              className="bg-[#233144] hover:bg-black text-white h-11 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>XẾP HÀNG ẢO</span>
              <Hourglass className="w-4 h-4 text-[#d95f00]" />
            </button>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0d1c2e] h-11 px-3 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
            >
              XEM BẢNG GIÁ
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onQuickBook(lot)
              }}
              className="bg-black hover:bg-[#233144] text-white h-11 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>ĐẶT GIỮ CHỖ 10P</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to={`/dashboard/parking/${lot.id}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0d1c2e] h-11 px-3 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors text-center"
            >
              XEM CHI TIẾT
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
