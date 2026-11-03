import { ReceiptText, Settings2, Download, ShieldCheck } from 'lucide-react'

interface PaymentsCommandHeaderProps {
  onOpenConfig: () => void
  onOpenExport: () => void
  companyTaxId?: string
  transportUnitCode?: string
}

export function PaymentsCommandHeader({
  onOpenConfig,
  onOpenExport,
  companyTaxId = '0301489271',
  transportUnitCode = 'VTP-VN-51C-LOGISTICS',
}: PaymentsCommandHeaderProps) {
  return (
    <div className="flex flex-col gap-6 mb-6">
      {/* Top Context Scrim / Notification Ticker */}
      <div className="w-full bg-slate-100/90 border border-slate-200/90 rounded-2xl py-2.5 px-4 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
            <span className="font-mono font-bold uppercase tracking-wider text-slate-800">
              KẾT NỐI TỔNG CỤC THUẾ (HĐĐT TT78):
            </span>
            <span className="font-mono text-slate-600 hidden sm:inline">
              ĐỒNG BỘ THỜI GIAN THỰC (09:42:01 ICT)
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-600 font-mono">
            <span>
              MÃ ĐƠN VỊ VẬN TẢI: <strong className="text-slate-900">{transportUnitCode}</strong>
            </span>
            <span className="hidden sm:inline text-slate-300">/</span>
            <span>
              MST CÔNG TY: <strong className="text-slate-900">{companyTaxId}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-4 h-4 text-orange-600" />
            <span className="font-mono text-xs uppercase tracking-widest text-orange-600 font-bold">
              SỔ CÁI CHI PHÍ & ĐỐI SOÁT HÓA ĐƠN
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Chuẩn TT78 CQT
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-sora text-slate-900 tracking-tight">
            Lịch Sử Thanh Toán & Hóa Đơn VAT
          </h1>

          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Minh bạch từng đồng chi phí bãi đỗ, tiền cọc hoàn trả và tự động đồng bộ hóa đơn điện tử theo Thông tư 78 gửi về kế toán doanh nghiệp.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-end">
          <button
            type="button"
            onClick={onOpenConfig}
            className="h-12 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs md:text-sm rounded-xl transition-colors flex items-center gap-2 border border-slate-200"
          >
            <Settings2 className="w-4 h-4 text-slate-600" />
            <span>CẤU HÌNH XUẤT HÓA ĐƠN CÔNG TY</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="h-12 px-5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs md:text-sm rounded-xl transition-all shadow-sm shadow-orange-600/20 flex items-center gap-2 active:scale-[0.99]"
          >
            <Download className="w-4 h-4" />
            <span>XUẤT BÁO CÁO EXCEL / PDF ➞</span>
          </button>
        </div>
      </div>
    </div>
  )
}
