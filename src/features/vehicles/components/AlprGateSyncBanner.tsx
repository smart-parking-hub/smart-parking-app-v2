import { ScanLine } from 'lucide-react'

export function AlprGateSyncBanner() {
  return (
    <div className="p-5 md:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
          <ScanLine className="w-6 h-6 text-slate-900" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm md:text-base font-bold font-sora text-slate-900">
            Đồng Bộ Nhận Diện Tự Động ALPR Tại Trạm Cân & Cổng Barie
          </h3>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl">
            Xe đã duyệt hồ sơ sẽ không cần dừng trình giấy tờ tại 320+ bãi thông minh. Camera quét biển số nhận diện trong 0.2 giây để mở barie tự động và kích hoạt phiên đỗ xe thực địa.
          </p>
        </div>
      </div>

      <div className="shrink-0 bg-slate-50 border border-slate-200 px-5 py-3 rounded-xl text-left min-w-[140px]">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Tốc độ mở gate:
        </div>
        <div className="text-xl md:text-2xl font-bold font-mono text-orange-600 mt-0.5">
          ≤ 0.2 Giây
        </div>
      </div>
    </div>
  )
}
