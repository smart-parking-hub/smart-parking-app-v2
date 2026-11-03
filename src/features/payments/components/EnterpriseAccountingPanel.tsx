import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Mail,
  FileCode2,
  Zap,
} from 'lucide-react'
import type { CompanyInvoiceConfig } from '../types/paymentTypes'

interface EnterpriseAccountingPanelProps {
  config: CompanyInvoiceConfig
  onEditConfig: () => void
}

export function EnterpriseAccountingPanel({
  config,
  onEditConfig,
}: EnterpriseAccountingPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Panel 1: Enterprise VAT Direct Dispatch */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-700" />
            <h3 className="text-base md:text-lg font-bold font-sora text-slate-900">
              Đồng Bộ Kế Toán Doanh Nghiệp
            </h3>
          </div>

          <button
            type="button"
            onClick={onEditConfig}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700"
          >
            Chỉnh sửa
          </button>
        </div>

        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          Tất cả hóa đơn VAT xuất từ bến bãi trong mạng lưới SmartTruckHub được mã hóa và gửi tự động tới hòm thư kế toán trưởng đã cấu hình:
        </p>

        {/* Accounting Sync Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email nhận hóa đơn:
            </span>
            <span className="font-mono font-bold text-slate-900">
              {config.accountingEmail}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
              Định dạng tự động:
            </span>
            <span className="font-mono font-bold text-slate-900">
              {config.autoSendXml ? 'XML HĐĐT + PDF TT78' : 'PDF TT78'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-slate-400" />
              Chu kỳ xuất gộp:
            </span>
            <span className="font-mono font-bold text-slate-900">
              Tức thời (Ngay khi rời bãi)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đã liên kết thành công với phần mềm <strong>{config.integrationSoftware}</strong>.</span>
        </div>
      </div>

      {/* Panel 2: Anti-Fraud & Deposit Guarantee Protocol */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-orange-600" />
          <h3 className="text-base md:text-lg font-bold font-sora text-slate-900">
            Chính Sách Hoàn Cọc 10 Phút
          </h3>
        </div>

        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          Tiền cọc giữ chỗ (100.000 ₫/lượt) được bảo chứng bởi SmartTruckHub và được hoàn lại 100% tự động qua tài khoản gốc ngay khi xe quét camera nhận diện ALPR tại cổng bãi trong khung giờ đăng ký.
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 font-mono text-xs">
          <span className="text-slate-500 uppercase">TỶ LỆ HOÀN CỌC ĐÚNG HẸN:</span>
          <span className="font-bold text-slate-900 px-2.5 py-1 bg-slate-100 rounded-lg">
            100.0% (4/4 LƯỢT)
          </span>
        </div>
      </div>
    </div>
  )
}
