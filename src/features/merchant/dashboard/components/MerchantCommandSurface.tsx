import { useNavigate } from 'react-router-dom'
import { Radio, Plus } from 'lucide-react'

export function MerchantCommandSurface() {
  const navigate = useNavigate()

  return (
    <div className="w-full bg-[#eff4ff] px-4 lg:px-8 py-6 lg:py-8 border-b border-slate-200/80">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
        {/* Eyebrow & Page Title & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
              <span className="font-mono text-xs text-[#d95f00] tracking-wider uppercase font-bold">
                TỔNG QUAN VẬN HÀNH BẾN BÃI · CẬP NHẬT REALTIME 10S
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="font-mono text-xs text-[#45464d] font-semibold">
                VẬN HÀNH CẢNG BIỂN &amp; ICD
              </span>
            </div>

            <h1 className="font-sora text-2xl lg:text-3xl text-[#0d1c2e] tracking-tight font-bold m-0 mt-0.5">
              Bảng Điều Khiển Doanh Thu &amp; Lưu Lượng
            </h1>

            <p className="text-xs lg:text-sm text-[#45464d] max-w-3xl m-0 leading-relaxed">
              Giám sát trực tiếp 03 cụm bãi đỗ thương mại: Cát Lái Gate 2, ICD Sóng Thần 2, Depot
              Phú Hữu. Đồng bộ cảm biến tải trọng và hệ thống camera quét biển số tự động ALPR.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/merchant/qr-scanner')}
              className="h-11 px-4 bg-white text-[#0d1c2e] hover:bg-slate-50 font-bold text-xs lg:text-sm rounded-xl flex items-center gap-2 transition-all shadow-xs border border-slate-200 cursor-pointer"
            >
              <Radio className="w-4 h-4 text-[#455f87]" />
              <span>Mở Trạm Quét Barie ALPR</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/merchant/parking-lots/new')}
              className="h-11 px-5 bg-[#341100] text-[#d95f00] hover:bg-black hover:text-white font-bold text-xs lg:text-sm rounded-xl flex items-center gap-2 transition-all shadow-xs border border-[#d95f00]/40 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#d95f00]" />
              <span>+ Đăng Ký Bãi Đỗ Mới</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
