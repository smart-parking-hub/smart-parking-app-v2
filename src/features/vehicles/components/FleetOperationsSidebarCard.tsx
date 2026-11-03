import { Truck, Headphones } from 'lucide-react'

export function FleetOperationsSidebarCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold font-sora text-slate-900">
            Hạ Tầng Đội Xe ALPR
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            GATEWAY V3.8-TLS • ONLINE 100%
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Phương tiện mặc định được đồng bộ tức thì với camera ALPR tại 320+ bãi Tân Cảng, Cát Lái và Hải Phòng. Thời gian mở barie tự động ≤ 0.2 giây.
      </p>

      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-medium">Đối soát Cục Đăng Kiểm:</span>
          <span className="font-bold text-slate-900 font-mono">15 PHÚT / LẦN</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-medium">Bảo hiểm TNDS bắt buộc:</span>
          <span className="font-bold text-slate-900 font-mono">HIỆU LỰC 100%</span>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <Headphones className="w-4 h-4 text-orange-600" />
          <span>Hỗ trợ kỹ thuật bãi:</span>
        </div>
        <span className="font-mono font-bold text-slate-900">1900 6868 (Ext 2)</span>
      </div>
    </div>
  )
}
