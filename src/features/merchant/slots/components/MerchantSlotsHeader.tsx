import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  QrCode,
  MapPin,
  Sparkles,
} from 'lucide-react'
import type { SimpleLotHeaderInfo } from '../types/merchantSlotsTypes'

interface MerchantSlotsHeaderProps {
  lotInfo: SimpleLotHeaderInfo
}

export function MerchantSlotsHeader({ lotInfo }: MerchantSlotsHeaderProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Title & Breadcrumbs */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
            <span>QUẢN LÝ MẶT BẰNG &amp; PHÂN BỔ TẢI TRỌNG · MOD-04</span>
          </div>

          <h1 className="font-sora text-2xl lg:text-3xl text-slate-900 font-bold mt-1 tracking-tight">
            Cấu Hình Sức Chứa Bãi Đỗ (Slot Capacity Matrix)
          </h1>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-slate-600 text-sm">
            <span className="flex items-center gap-1 font-medium text-slate-800">
              <MapPin className="w-4 h-4 text-[#d95f00]" />
              {lotInfo.name}
            </span>
            <span className="px-2 py-0.5 rounded font-mono text-xs bg-slate-200 text-slate-800 font-bold">
              Mã: {lotInfo.code}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-medium border border-emerald-200">
              <Sparkles className="w-3 h-3" />
              {lotInfo.alprStatusText}
            </span>
          </div>
        </div>

        {/* 3 Quick Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/merchant/parking-lots/${lotInfo.id}`}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Chi Tiết Bãi</span>
          </Link>

          <Link
            to="/merchant/qr-scanner"
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 text-slate-600" />
            <span>Trạm Quét QR Barie</span>
          </Link>

          <Link
            to={`/merchant/parking-lots/${lotInfo.id}#pricing`}
            className="px-3.5 py-2 rounded-lg bg-[#341100] hover:bg-black text-[#ffdbca] transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <span>Biểu Phí Niêm Yết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
