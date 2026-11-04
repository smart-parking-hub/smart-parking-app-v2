import { Check, MapPin, Radio, Scale } from 'lucide-react'
import type { ParkingLotTelemetry } from '../types'
import { Badge } from '@/shared/components/Badge'
import { Button } from '@/shared/components/Button'

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
    <div className="bg-[#0F172A] border border-[#1E3A5F] rounded-lg p-6 lg:p-8 max-w-4xl mx-auto shadow-2xl">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#1E3A5F]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {telemetry.verified && (
              <Badge variant="orange" size="sm" className="bg-[#060D1A] border-[#1E3A5F]">
                XÁC THỰC BỞI SMARTTRUCKHUB
              </Badge>
            )}
            <span className="text-xs text-slate-400 font-inter">
              Cập nhật {telemetry.lastUpdatedMinutesAgo} phút trước
            </span>
          </div>
          <h3 className="font-sora text-xl sm:text-2xl font-bold text-white">
            {telemetry.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-inter mt-1 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#F97316] shrink-0" aria-hidden="true" />
            <span>
              {telemetry.address} · {telemetry.distanceToPort}
            </span>
          </p>
        </div>
        <div className="flex flex-col sm:items-end">
          <div className="text-xs text-slate-400 font-inter uppercase">Giá niêm yết theo khối giờ</div>
          <div className="font-sora text-2xl font-bold text-[#F97316]">
            {telemetry.priceBlockAmount.toLocaleString('vi-VN')} {telemetry.currency}{' '}
            <span className="text-xs font-normal text-slate-300 font-inter">
              / block {telemetry.priceBlockHours} giờ
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-inter">Đã bao gồm VAT &amp; Phí bảo vệ</span>
        </div>
      </div>

      {/* Facilities Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-6 border-b border-[#1E3A5F]">
        {telemetry.facilities.map((fac) => {
          const isHighlighted = activeAmenityId === fac.amenityId
          return (
            <div
              key={fac.title}
              className={`flex items-center gap-3 p-2 rounded transition-colors ${
                isHighlighted ? 'bg-[#1E293B]/70 ring-1 ring-[#F97316]' : ''
              }`}
            >
              <div className="w-8 h-8 rounded bg-[#060D1A] border border-[#1E3A5F] flex items-center justify-center text-[#F97316] shrink-0">
                <Check className="h-[18px] w-[18px]" aria-hidden="true" />
              </div>
              <div className="text-xs font-inter text-slate-200">
                <span className="font-semibold block text-white">{fac.title}</span>
                {fac.subtitle}
              </div>
            </div>
          )
        })}
      </div>

      {/* Hardware Telemetry Bar */}
      <div className="py-4 border-b border-[#1E3A5F] grid grid-cols-2 gap-3 font-inter text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Radio className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
          <span>Barie ALPR: <strong className="text-white">{telemetry.alprResponseTime}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Scale className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
          <span>Trạm cân: <strong className="text-white">{telemetry.weighStationCapacity}</strong></span>
        </div>
      </div>

      {/* Footer Action of Card */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs font-inter text-slate-300">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F97316]"></span>
          </span>
          <span>
            Còn trống <strong className="text-white">{telemetry.availableSpots} ô đỗ {telemetry.spotType}</strong> trong 45 phút tới
          </span>
        </div>
        <Button
          type="button"
          onClick={onReserveClick}
          className="w-full sm:w-auto bg-[#F97316] hover:bg-[#EA580C] text-white font-inter font-semibold text-xs sm:text-sm px-6 py-3 rounded"
        >
          ĐẶT GIỮ CHỖ NGAY TẠI BÃI NÀY
        </Button>
      </div>
    </div>
  )
}

