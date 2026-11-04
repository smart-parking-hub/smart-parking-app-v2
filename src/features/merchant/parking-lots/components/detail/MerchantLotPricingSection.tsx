import { useNavigate } from 'react-router-dom'
import { ReceiptText, ArrowRight, Info } from 'lucide-react'
import type { DetailedPricingMatrix } from '../../types/merchantParkingLotTypes'

interface MerchantLotPricingSectionProps {
  lotId: number
  pricing: DetailedPricingMatrix
  canConfigure?: boolean
}

export function MerchantLotPricingSection({
  lotId,
  pricing,
  canConfigure = true,
}: MerchantLotPricingSectionProps) {
  const navigate = useNavigate()

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-slate-800">
            <ReceiptText className="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold">
              Biểu Phí Niêm Yết Đang Áp Dụng
            </h2>
            <p className="text-xs text-slate-500">
              Mức giá đồng bộ tự động với ứng dụng tài xế và trạm quét thẻ Barie ALPR
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!canConfigure}
          onClick={() => navigate(`/merchant/parking-lots/${lotId}/pricing`)}
          className="inline-flex items-center gap-1 font-mono text-xs text-[#d95f00] hover:underline font-bold disabled:opacity-40 disabled:hover:no-underline cursor-pointer"
        >
          <span>Điều chỉnh bảng giá (SCR-033)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Card 1: Giờ Cơ Bản */}
        <div className="p-3.5 bg-[#eff4ff]/50 rounded-xl border border-slate-200/60 flex flex-col">
          <span className="font-mono text-[11px] text-slate-500 uppercase font-semibold">
            Giờ Cơ Bản
          </span>
          <span className="font-sora text-lg sm:text-xl text-[#0d1c2e] font-bold mt-1">
            {formatMoney(pricing.baseHourlyRate)}
          </span>
          <span className="font-mono text-[11px] text-slate-500 mt-0.5">
            {pricing.baseHourlyNote}
          </span>
        </div>

        {/* Card 2: Phụ Thu Cao Điểm */}
        <div className="p-3.5 bg-[#eff4ff]/50 rounded-xl border border-slate-200/60 flex flex-col">
          <span className="font-mono text-[11px] text-slate-500 uppercase font-semibold">
            Phụ Thu Cao Điểm
          </span>
          <span className="font-sora text-lg sm:text-xl text-[#d95f00] font-bold mt-1">
            +{pricing.peakSurgePercent}%
          </span>
          <span className="font-mono text-[11px] text-slate-500 mt-0.5">
            {pricing.peakWindowNote}
          </span>
        </div>

        {/* Card 3: Lưu Bãi Qua Đêm */}
        <div className="p-3.5 bg-[#eff4ff]/50 rounded-xl border border-slate-200/60 flex flex-col">
          <span className="font-mono text-[11px] text-slate-500 uppercase font-semibold">
            Lưu Bãi Qua Đêm
          </span>
          <span className="font-sora text-lg sm:text-xl text-[#0d1c2e] font-bold mt-1">
            {formatMoney(pricing.overnightRate)}
          </span>
          <span className="font-mono text-[11px] text-slate-500 mt-0.5">
            {pricing.overnightWindowNote}
          </span>
        </div>

        {/* Card 4: Tiền Cọc Giữ Chỗ */}
        <div className="p-3.5 bg-[#eff4ff]/50 rounded-xl border border-slate-200/60 flex flex-col">
          <span className="font-mono text-[11px] text-slate-500 uppercase font-semibold">
            Tiền Cọc Giữ Chỗ (10p)
          </span>
          <span className="font-sora text-lg sm:text-xl text-[#0d1c2e] font-bold mt-1">
            {formatMoney(pricing.depositRate)}
          </span>
          <span className="font-mono text-[11px] text-slate-500 mt-0.5">
            {pricing.depositPolicyNote}
          </span>
        </div>
      </div>

      {/* Footer Info Notice */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 font-mono text-[11px] text-slate-700 flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
        <span>{pricing.legalNotice}</span>
      </div>
    </div>
  )
}
