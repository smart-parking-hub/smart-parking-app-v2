import { Headphones } from 'lucide-react'

export function GateSupportHelpStrip() {
  return (
    <div className="p-4 sm:p-5 bg-slate-100 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-orange-500 flex items-center justify-center shrink-0">
          <Headphones className="w-5 h-5" />
        </div>
        <div>
          <div className="font-sora text-xs sm:text-sm font-bold text-slate-900">
            Cần hỗ trợ Barie khẩn cấp tại cổng?
          </div>
          <div className="text-xs text-slate-600">
            Liên hệ trực tiếp giám sát trực cổng bãi Tân Cảng qua bộ đàm hoặc Hotline.
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 font-mono text-xs sm:text-sm shrink-0">
        <span className="text-slate-500 uppercase">HOTLINE TRỰC CỔNG:</span>
        <a
          href="tel:19006868"
          className="text-orange-600 font-bold hover:underline"
        >
          1900 6868 (Phím 1)
        </a>
      </div>
    </div>
  )
}
