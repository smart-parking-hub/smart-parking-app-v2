import { ShieldCheck, MapPin, Star, Phone, Gauge } from 'lucide-react'
import type { ParkingFacilityDetail } from '../types/parkingDetailTypes'

interface FacilityHeaderSectionProps {
  facility: ParkingFacilityDetail
}

export function FacilityHeaderSection({ facility }: FacilityHeaderSectionProps) {
  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
      {/* Top badges & yard code */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fff7ed] text-[#d95f00] border border-[#ffedd5] rounded-md text-xs font-semibold tracking-wide uppercase">
          <ShieldCheck className="w-4 h-4 text-[#d95f00]" />
          <span>ĐÃ KIỂM DUYỆT BỞI SMARTTRUCK (VERIFIED YARD)</span>
        </div>
        <span className="font-mono text-xs text-slate-500">
          MÃ BÃI: <strong className="text-slate-900 font-bold">{facility.code}</strong>
        </span>
      </div>

      {/* Main Title & Address */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
          {facility.name}
        </h1>
        <p className="text-sm text-slate-600 mt-2 flex items-start gap-1.5">
          <MapPin className="w-4 h-4 text-[#d95f00] shrink-0 mt-0.5" />
          <span>
            {facility.address}{' '}
            <span className="text-slate-900 font-semibold">{facility.distanceToPortHint}</span>
          </span>
        </p>
      </div>

      {/* Facility Metrics Footer */}
      <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-3 text-sm text-slate-800 border-t border-slate-100">
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="font-bold text-lg text-slate-900">
            {facility.ratingAverage.toFixed(1)}
          </span>
          <span className="text-slate-500 text-xs">
            / 5.0 ({facility.reviewCount} lượt tài xế đánh giá)
          </span>
        </div>

        <div className="w-px h-4 bg-slate-200 hidden sm:block" />

        {/* Hotline */}
        <div className="flex items-center gap-1.5 text-slate-800">
          <Phone className="w-4 h-4 text-[#455f87]" />
          <span className="text-slate-500 text-xs">Hotline trực 24/7:</span>
          <a
            href={`tel:${facility.hotline.replace(/\s+/g, '')}`}
            className="font-mono font-bold text-slate-900 hover:text-[#d95f00] transition-colors"
          >
            {facility.hotline}
          </a>
        </div>

        <div className="w-px h-4 bg-slate-200 hidden sm:block" />

        {/* Clearance specs */}
        <div className="flex items-center gap-1.5 font-mono text-xs text-[#455f87]">
          <Gauge className="w-4 h-4" />
          <span>
            GATE CLEARANCE: {facility.gateClearanceMeters}M TẢI TRỌNG MAX {facility.maxGrossWeightTons}T
          </span>
        </div>
      </div>
    </section>
  )
}
