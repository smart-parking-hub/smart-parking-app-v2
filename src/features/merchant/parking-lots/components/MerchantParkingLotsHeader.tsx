import { useNavigate } from 'react-router-dom'
import { Download, PlusCircle } from 'lucide-react'

interface MerchantParkingLotsHeaderProps {
  onOpenExportModal: () => void
}

export function MerchantParkingLotsHeader({ onOpenExportModal }: MerchantParkingLotsHeaderProps) {
  const navigate = useNavigate()

  return (
    <section className="w-full bg-white px-4 sm:px-6 lg:px-8 py-6 lg:py-8 border-b border-slate-200/80">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#d95f00]" />
            <span className="font-mono text-xs text-[#d95f00] tracking-widest uppercase font-semibold">
              QUẢN LÝ MẶT BẰNG &amp; NĂNG LỰC TIẾP NHẬN
            </span>
          </div>
          <h1 className="font-sora text-2xl lg:text-3xl text-[#0d1c2e] tracking-tight font-bold">
            Bãi Đỗ Xe Của Tôi
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed font-normal">
            Danh mục các cơ sở bãi đỗ thương mại, trạm dừng logistics và trạm tiếp vận container đang khai thác trên mạng lưới SmartTruck Freight Precision.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#eff4ff] text-[#0d1c2e] hover:bg-[#d5e3fc] transition-colors text-xs lg:text-sm font-semibold rounded-xl border border-slate-200/70 shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Xuất Báo Cáo Mặt Bằng</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/merchant/parking-lots/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#d95f00] hover:bg-[#b84e00] text-white transition-all text-xs lg:text-sm font-bold rounded-xl shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>+ ĐĂNG KÝ BÃI ĐỖ MỚI</span>
          </button>
        </div>
      </div>
    </section>
  )
}
