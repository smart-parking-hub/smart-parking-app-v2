import { Check, MapPin, Radio, Scale } from 'lucide-react'
import type { ParkingLotTelemetry } from '../types'

export interface ParkingLotLivePreviewCardProps {
  telemetry: ParkingLotTelemetry
  activeAmenityId?: string
  onReserveClick?: () => void
}

export function ParkingLotLivePreviewCard({
  telemetry,
  activeAmenityId,
  onReserveClick,
}: ParkingLotLivePreviewCardProps) {
  return (
    <div className="bg-[#0B1528] border border-slate-800 rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {telemetry.verified && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#060D1A] text-brand-orange border border-slate-800">
                XÁC THỰC BỞI SMARTTRUCKHUB
              </span>
            )}
            <span className="text-xs text-slate-400 font-inter">
              Cập nhật {telemetry.lastUpdatedMinutesAgo} phút trước
            </span>
          </div>
          <h3 className="font-sora text-xl sm:text-2xl font-bold text-white">
            {telemetry.name}
          </h3>
          <p className="text-sm text-slate-300 font-inter mt-1.5 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-orange shrink-0" aria-hidden="true" />
            <span>
              {telemetry.address} · {telemetry.distanceToPort}
            </span>
          </p>
        </div>
        <div className="flex flex-col sm:items-end">
          <div className="text-xs text-slate-400 font-inter">Giá niêm yết theo khối giờ</div>
          <div className="font-sora text-2xl font-bold text-brand-orange">
            {telemetry.priceBlockAmount.toLocaleString('vi-VN')} {telemetry.currency}{' '}
            <span className="text-xs font-normal text-slate-300 font-inter">
              / block {telemetry.priceBlockHours} giờ
            </span>
          </div>
          <span className="text-xs text-slate-400 font-inter mt-0.5">Đã bao gồm VAT &amp; Phí bảo vệ</span>
        </div>
      </div>

      {/* Facilities Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-6 border-b border-slate-800/80">
        {telemetry.facilities.map((fac) => {
          const isHighlighted = activeAmenityId === fac.amenityId
          return (
            <div
              key={fac.title}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isHighlighted
                  ? 'bg-slate-900 border-2 border-brand-orange'
                  : 'bg-slate-900/40 border border-slate-800/50'
              }`}
            >
              <Check className="h-5 w-5 text-brand-orange shrink-0" aria-hidden="true" />
              <div className="text-xs font-inter text-slate-200">
                <span className="font-semibold block text-white text-sm">{fac.title}</span>
                <span className="text-slate-400">{fac.subtitle}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Hardware Telemetry Bar */}
      <div className="py-4 border-b border-slate-800/80 grid grid-cols-2 gap-3 font-inter text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <Radio className="h-4 w-4 text-brand-orange" aria-hidden="true" />
          <span>Barie ALPR: <strong className="text-white">{telemetry.alprResponseTime}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Scale className="h-4 w-4 text-brand-orange" aria-hidden="true" />
          <span>Trạm cân: <strong className="text-white">{telemetry.weighStationCapacity}</strong></span>
        </div>
      </div>

      {/* Footer Action of Card */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm font-inter text-slate-300">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange"></span>
          </span>
          <span>
            Còn trống <strong className="text-white">{telemetry.availableSpots} ô đỗ {telemetry.spotType}</strong> trong 45 phút tới
          </span>
        </div>
        <button
          type="button"
          onClick={onReserveClick}
          className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] font-sora font-bold text-sm px-7 py-3.5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        >
          ĐẶT GIỮ CHỖ NGAY TẠI BÃI NÀY
        </button>
      </div>
    </div>
  )
}
