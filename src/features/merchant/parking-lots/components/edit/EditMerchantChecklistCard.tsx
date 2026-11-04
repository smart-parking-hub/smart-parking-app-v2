import { CheckSquare } from 'lucide-react'

interface EditMerchantChecklistCardProps {
  gpsChecked?: boolean
  photosChecked?: boolean
  responseChecked?: boolean
}

export function EditMerchantChecklistCard({
  gpsChecked = true,
  photosChecked = true,
  responseChecked = true,
}: EditMerchantChecklistCardProps) {
  const completedCount = [gpsChecked, photosChecked, responseChecked].filter(Boolean).length

  return (
    <div className="bg-white rounded-2xl p-5 space-y-3.5 shadow-2xs border border-slate-200/80">
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#131b2e] pb-2 border-b border-slate-100">
        <span>Tiến độ hoàn thiện hồ sơ</span>
        <span className="font-mono text-[#d95f00] font-bold bg-[#ffdbca]/40 px-2 py-0.5 rounded-md">
          {completedCount}/3 HẠNG MỤC
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#eff4ff] h-2.5 rounded-full overflow-hidden border border-slate-200">
        <div
          className="bg-[#d95f00] h-full transition-all duration-300 rounded-full"
          style={{ width: `${(completedCount / 3) * 100}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2 pt-1 text-xs sm:text-sm text-slate-700">
        <div className="flex items-center gap-2.5">
          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className={gpsChecked ? 'text-slate-800 font-medium' : 'text-slate-400'}>
            Đã căn chỉnh tọa độ GPS tim cổng Barie
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className={photosChecked ? 'text-slate-800 font-medium' : 'text-slate-400'}>
            Đã chuẩn bị ảnh ban đêm &amp; trụ cứu hỏa
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className={responseChecked ? 'text-slate-800 font-medium' : 'text-slate-400'}>
            Đã điền ghi chú giải trình cho Admin
          </span>
        </div>
      </div>
    </div>
  )
}
