import { Dumbbell } from 'lucide-react'

interface MerchantSlotWeightCalculatorProps {
  currentLoadedTonnage?: number
  maxDesignTonnage?: number
  totalOccupied?: number
}

export function MerchantSlotWeightCalculator({
  currentLoadedTonnage = 4120,
  maxDesignTonnage = 4800,
  totalOccupied = 72,
}: MerchantSlotWeightCalculatorProps) {
  const safetyPercent = Math.min(
    100,
    parseFloat(((currentLoadedTonnage / maxDesignTonnage) * 100).toFixed(1)),
  )
  const isHighLoad = safetyPercent >= 85

  return (
    <div className="p-5 lg:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-slate-800">
            <Dumbbell className="w-4 h-4 text-slate-700" />
          </div>
          <h3 className="font-sora text-base lg:text-lg text-slate-900 font-bold">
            Bộ Giả Lập &amp; Tính Toán Nhanh Tải Trọng Quy Đổi (Surface Weight Calculator)
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded font-mono text-xs bg-slate-100 text-slate-800 font-bold">
          TCVN 4054:2005
        </span>
      </div>

      {/* 3 Metric Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
          <span className="font-mono text-xs text-slate-500 uppercase font-medium">
            Tải Trọng Thiết Kế Tối Đa
          </span>
          <span className="font-sora text-xl text-slate-900 font-bold mt-1">
            {maxDesignTonnage.toLocaleString('vi-VN')} Tấn
          </span>
          <span className="font-mono text-[11px] text-slate-500 mt-0.5">
            Sức chịu tải móng bê tông M400
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
          <span className="font-mono text-xs text-slate-500 uppercase font-medium">
            Tải Trọng Đang Chịu Lực
          </span>
          <span className="font-sora text-xl text-[#d95f00] font-bold mt-1">
            {currentLoadedTonnage.toLocaleString('vi-VN')} Tấn
          </span>
          <span className="font-mono text-[11px] text-slate-500 mt-0.5">
            Quy đổi từ {totalOccupied} đầu xe thực tế
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
          <span className="font-mono text-xs text-slate-500 uppercase font-medium">
            Hệ Số An Toàn Nền Móng
          </span>
          <span className="font-sora text-xl text-slate-900 font-bold mt-1">
            {safetyPercent}%
          </span>
          <span
            className={`font-mono text-[11px] font-semibold mt-0.5 ${
              isHighLoad ? 'text-[#d95f00]' : 'text-emerald-700'
            }`}
          >
            {isHighLoad ? 'Mức cảnh báo kỹ thuật' : 'Trong ngưỡng an toàn'}
          </span>
        </div>
      </div>

      {/* Inline Visual Progress Bar */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex justify-between font-mono text-xs">
          <span className="text-slate-600">Áp lực bề mặt Cụm Bến Gate 2:</span>
          <span className="font-bold text-slate-900">
            {currentLoadedTonnage.toLocaleString('vi-VN')} T /{' '}
            {maxDesignTonnage.toLocaleString('vi-VN')} T (Ngưỡng an toàn tối đa 92%)
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-200/80 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isHighLoad ? 'bg-[#d95f00]' : 'bg-blue-600'
            }`}
            style={{ width: `${safetyPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
