import { Info } from 'lucide-react'
import type { PricingRuleItem } from '../types/parkingDetailTypes'

interface PricingRulesTableSectionProps {
  pricingRules: PricingRuleItem[]
}

export function PricingRulesTableSection({ pricingRules }: PricingRulesTableSectionProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
  }

  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Biểu Phí Niêm Yết Minh Bạch</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Tự động tính cước qua cổng nhận diện ALPR · Xuất hóa đơn VAT điện tử
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
          QUY ĐỊNH VẬN HÀNH 2025
        </span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">Loại Phương Tiện</th>
              <th className="py-3 px-4">Giá Cơ Bản (VND/h)</th>
              <th className="py-3 px-4">Cao Điểm (+20%)</th>
              <th className="py-3 px-4">Qua Đêm (22h - 06h)</th>
              <th className="py-3 px-4">Phạt Quá Giờ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {pricingRules.map((rule) => {
              const isHighlight = !!rule.isHighlight

              return (
                <tr
                  key={rule.id}
                  className={`transition-colors ${
                    isHighlight
                      ? 'bg-amber-50/50 hover:bg-amber-50 font-medium'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    {isHighlight && (
                      <span className="w-2 h-2 rounded-full bg-[#d95f00] shrink-0" />
                    )}
                    <span>{rule.vehicleType}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {formatCurrency(rule.baseRatePerHour)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#d95f00] font-semibold">
                    {formatCurrency(rule.peakRatePerHour)}
                    {rule.peakHoursNote && (
                      <span className="text-xs text-slate-500 font-normal">
                        {rule.peakHoursNote}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {formatCurrency(rule.overnightRate)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-red-600 font-semibold">
                    {rule.overtimePenaltyNote}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Deposit footnote */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-600 flex items-center gap-2">
        <Info className="w-4 h-4 text-[#455f87] shrink-0" />
        <span>
          Phí cọc giữ chỗ vật lý cố định <strong className="text-slate-900 font-bold">100.000 ₫/lượt</strong>. Hoàn 100% khi check-in đúng hẹn hoặc hủy trước 60 phút.
        </span>
      </div>
    </section>
  )
}
