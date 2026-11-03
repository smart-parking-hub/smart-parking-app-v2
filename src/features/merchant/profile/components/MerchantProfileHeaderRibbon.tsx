import { ShieldCheck, Info } from 'lucide-react'
import type { MerchantProfile } from '../types/merchantProfileTypes'

interface MerchantProfileHeaderRibbonProps {
  profile: MerchantProfile
  onShowCertificate?: () => void
}

export function MerchantProfileHeaderRibbon({
  profile,
  onShowCertificate,
}: MerchantProfileHeaderRibbonProps) {
  return (
    <header className="bg-white rounded-2xl p-6 lg:p-7 shadow-xs border border-slate-200/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div className="space-y-2 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-[#d95f00] tracking-wider uppercase bg-[#ffdbca]/60 px-2.5 py-0.5 rounded-md border border-[#d95f00]/20">
            ĐỊNH DANH PHÁP NHÂN &amp; TÀI KHOẢN ĐỐI SOÁT VÍ
          </span>
          <span className="text-slate-300 font-mono text-[11px]">•</span>
          <span className="font-mono text-[11px] text-slate-500 font-semibold">
            MERCHANT_ID: {profile.merchantCode}
          </span>
        </div>

        <h1 className="font-sora text-2xl lg:text-3xl font-bold text-[#0d1c2e] tracking-tight">
          Hồ Sơ Doanh Nghiệp Chủ Bãi
        </h1>

        <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">
          Thông tin pháp lý, giấy phép kinh doanh bến bãi và tài khoản ngân hàng thụ hưởng nhận tiền
          giải ngân tự động qua cổng Napas247.
        </p>
      </div>

      {/* Verified E-KYC Dual-Border Industrial Badge (Zero-Green) */}
      <div className="shrink-0 flex items-center gap-2.5 p-2 bg-[#eff4ff] rounded-xl border border-slate-200/60">
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-white shadow-xs border border-slate-200/50">
          <div className="w-8 h-8 rounded-lg bg-[#341100] border border-[#d95f00]/30 flex items-center justify-center text-[#d95f00] shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#d95f00]" />
          </div>
          <div className="flex flex-col">
            <span className="font-sora text-xs font-bold text-[#0d1c2e] uppercase tracking-tight">
              {profile.verificationLabel}
            </span>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-medium">
              {profile.standardsLabel}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onShowCertificate}
          className="w-8 h-8 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center text-slate-600 hover:text-[#d95f00] hover:bg-slate-50 transition-colors cursor-pointer"
          title="Xem chứng chỉ an toàn bảo mật ISO 27001"
          aria-label="Xem chứng chỉ bảo mật"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
