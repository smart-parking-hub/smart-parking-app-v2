import { forwardRef } from 'react'
import { Scan } from 'lucide-react'
import type { BookingItemDto } from '../types/bookingTypes'

interface BookingQrTerminalPanelProps {
  booking: BookingItemDto
}

export const BookingQrTerminalPanel = forwardRef<SVGSVGElement, BookingQrTerminalPanelProps>(
  ({ booking }, ref) => {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-6">
        {/* 180x180 Sharp QR Container */}
        <div className="shrink-0 flex flex-col items-center gap-2 p-3 bg-white border-2 border-slate-900 rounded-xl shadow-xs">
          {/* Professional Crisp SVG QR simulation with STH logistics center shield */}
          <svg
            ref={ref}
            id="booking-ticket-qr-svg"
            className="w-[180px] h-[180px]"
            fill="none"
            viewBox="0 0 180 180"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background */}
            <rect fill="#FFFFFF" height="180" width="180" />
            {/* Corner Finder 1 (Top Left) */}
            <rect fill="#0F172A" height="40" width="40" x="12" y="12" />
            <rect fill="#FFFFFF" height="28" width="28" x="18" y="18" />
            <rect fill="#0F172A" height="16" width="16" x="24" y="24" />
            {/* Corner Finder 2 (Top Right) */}
            <rect fill="#0F172A" height="40" width="40" x="128" y="12" />
            <rect fill="#FFFFFF" height="28" width="28" x="134" y="18" />
            <rect fill="#0F172A" height="16" width="16" x="140" y="24" />
            {/* Corner Finder 3 (Bottom Left) */}
            <rect fill="#0F172A" height="40" width="40" x="12" y="128" />
            <rect fill="#FFFFFF" height="28" width="28" x="18" y="134" />
            <rect fill="#0F172A" height="16" width="16" x="24" y="140" />
            {/* Timing Patterns & Sync Lines */}
            <rect fill="#0F172A" height="4" width="60" x="58" y="24" />
            <rect fill="#0F172A" height="60" width="4" x="24" y="58" />
            {/* Data Matrix Elements */}
            <rect fill="#0F172A" height="8" width="8" x="58" y="36" />
            <rect fill="#0F172A" height="8" width="12" x="74" y="36" />
            <rect fill="#0F172A" height="8" width="8" x="94" y="36" />
            <rect fill="#0F172A" height="8" width="8" x="110" y="36" />
            <rect fill="#0F172A" height="8" width="16" x="58" y="52" />
            <rect fill="#0F172A" height="16" width="8" x="82" y="52" />
            <rect fill="#0F172A" height="8" width="20" x="98" y="52" />
            <rect fill="#0F172A" height="16" width="8" x="58" y="68" />
            <rect fill="#0F172A" height="8" width="16" x="74" y="76" />
            <rect fill="#0F172A" height="16" width="12" x="98" y="68" />
            <rect fill="#0F172A" height="8" width="8" x="118" y="68" />
            {/* Center Logistics Logo Shield Badge */}
            <rect fill="#0F172A" height="44" rx="4" width="44" x="68" y="68" />
            <rect fill="#F8F9FA" height="36" rx="2" width="36" x="72" y="72" />
            <text
              fill="#D95F00"
              fontFamily="sans-serif"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              x="90"
              y="94"
            >
              STH
            </text>
            {/* Data Matrix Elements (Lower Area) */}
            <rect fill="#0F172A" height="8" width="16" x="58" y="116" />
            <rect fill="#0F172A" height="8" width="8" x="82" y="116" />
            <rect fill="#0F172A" height="8" width="16" x="98" y="116" />
            <rect fill="#0F172A" height="24" width="8" x="122" y="116" />
            <rect fill="#0F172A" height="24" width="8" x="58" y="132" />
            <rect fill="#0F172A" height="8" width="20" x="74" y="132" />
            <rect fill="#0F172A" height="8" width="12" x="102" y="132" />
            <rect fill="#0F172A" height="16" width="8" x="74" y="148" />
            <rect fill="#0F172A" height="8" width="24" x="90" y="148" />
            <rect fill="#0F172A" height="8" width="16" x="122" y="148" />
            <rect fill="#0F172A" height="16" width="16" x="146" y="148" />
            <rect fill="#0F172A" height="8" width="8" x="122" y="58" />
            <rect fill="#0F172A" height="8" width="24" x="138" y="58" />
            <rect fill="#0F172A" height="24" width="8" x="130" y="74" />
            <rect fill="#0F172A" height="8" width="16" x="146" y="74" />
            <rect fill="#0F172A" height="16" width="8" x="146" y="90" />
            <rect fill="#0F172A" height="8" width="24" x="138" y="114" />
            <rect fill="#0F172A" height="10" width="8" x="146" y="130" />
          </svg>
          <span className="font-mono text-[11px] font-bold text-slate-900 tracking-widest">
            GATE-TOKEN: {booking.gateToken}
          </span>
        </div>

        {/* Instruction & Operational Barcode */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-[#d95f00]" />
            <h3 className="text-base font-bold text-slate-900">
              Mã QR Barie Check-out Tự Động
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Đưa mã QR này trước camera barie tự động ALPR tại cổng xuất bãi để tự động nhận diện và tính cước. Hệ thống hỗ trợ quét qua kính chắn gió cabin hoặc màn hình điện thoại từ cự ly 1.5 mét.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex flex-col gap-1 mt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Biển số camera ghi nhận:</span>
              <span className="font-mono font-bold text-slate-900">
                {booking.vehiclePlate} ({booking.alprMatchRate || 'TRÙNG KHỚP 100%'})
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Cổng chỉ định xuất bãi:</span>
              <span className="font-mono font-semibold text-[#d95f00]">
                {booking.gateOutName || 'LÀN 02 (OUT CONTAINER NẶNG)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

BookingQrTerminalPanel.displayName = 'BookingQrTerminalPanel'
