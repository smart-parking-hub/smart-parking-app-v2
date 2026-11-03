import { Truck, Download, PlusCircle } from 'lucide-react'

interface VehiclesCommandHeaderProps {
  onOpenExport: () => void
  onScrollToRegister: () => void
}

export function VehiclesCommandHeader({
  onOpenExport,
  onScrollToRegister,
}: VehiclesCommandHeaderProps) {
  return (
    <div className="flex flex-col gap-6 mb-6">
      {/* Top Operational Alert Strip */}
      <div className="w-full bg-slate-900 text-white rounded-2xl px-4 md:px-5 py-2.5 shadow-xs">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-slate-300 uppercase tracking-wider font-semibold">
              CỔNG KIỂM SOÁT ĐĂNG KIỂM & ALPR GATEWAY:
            </span>
            <span className="text-white font-medium hidden sm:inline">
              Hệ thống đồng bộ biển số tự động với Cục Đăng Kiểm & Cổng Cảng Cát Lái/Tân Cảng
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>GIAO THỨC: ALPR-V3.8-TLS</span>
            <span className="text-orange-400 font-bold">TRẠNG THÁI: TRỰC TUYẾN 100%</span>
          </div>
        </div>
      </div>

      {/* Main Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold tracking-wider uppercase">
            <Truck className="w-4 h-4 text-orange-600" />
            <span>ĐỘI XE VẬN TẢI THƯƠNG MẠI · GIÁM SÁT TẢI TRỌNG THỰC ĐỊA</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-sora text-slate-900 tracking-tight">
            Quản Lý Phương Tiện Của Tôi
          </h1>

          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Khai báo chính xác quy cách đầu kéo, rơ-moóc và tải trọng trục để hệ thống tự động lọc đúng kích thước ô đỗ, tính cước niêm yết và mở barie nhận diện ALPR camera tự động tại hơn 320 bãi đỗ thương mại.
          </p>
        </div>

        {/* Top Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenExport}
            className="h-11 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs md:text-sm flex items-center gap-2 transition-colors border border-slate-200"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>XUẤT DANH SÁCH ĐỘI XE</span>
          </button>

          <button
            type="button"
            onClick={onScrollToRegister}
            className="h-11 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-sm shadow-orange-600/20 transition-all active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ ĐĂNG KÝ PHƯƠNG TIỆN MỚI</span>
          </button>
        </div>
      </div>
    </div>
  )
}
