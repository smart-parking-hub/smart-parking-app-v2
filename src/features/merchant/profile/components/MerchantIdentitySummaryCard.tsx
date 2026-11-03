import { Phone, FileText, Warehouse, Clock } from 'lucide-react'
import type { MerchantProfile } from '../types/merchantProfileTypes'

interface MerchantIdentitySummaryCardProps {
  profile: MerchantProfile
}

export function MerchantIdentitySummaryCard({ profile }: MerchantIdentitySummaryCardProps) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-5">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-[#131b2e] p-2 shrink-0 flex items-center justify-center overflow-hidden border border-slate-300">
          <img
            src={profile.avatarUrl}
            alt={profile.companyName}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#d95f00] font-bold">
              {profile.merchantCode}
            </span>
            <span className="text-slate-300 font-mono text-[11px]">•</span>
            <span className="font-mono text-[11px] text-slate-500 font-semibold uppercase">
              ACTIVE PARTNER
            </span>
          </div>

          <h2 className="font-sora text-base lg:text-lg font-bold text-[#0d1c2e] leading-snug mt-1">
            {profile.companyName}
          </h2>

          <div className="text-xs text-slate-600 mt-1">
            Đại diện pháp luật:{' '}
            <strong className="text-[#0d1c2e] font-semibold">{profile.fullName}</strong>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* Legal & Contact Attribute Manifest */}
      <div className="space-y-2.5 font-mono text-xs">
        {/* Hotline */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff4ff] border border-slate-200/60">
          <span className="text-slate-600 flex items-center gap-2 font-inter font-medium text-xs">
            <Phone className="w-3.5 h-3.5 text-[#455f87]" />
            Hotline Điều Hành
          </span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0d1c2e] tracking-wide">{profile.phone}</span>
            <span className="px-1.5 py-0.5 rounded bg-white text-[10px] font-bold text-[#0d1c2e] uppercase border border-slate-200">
              OTP VERIFIED
            </span>
          </div>
        </div>

        {/* GPKD */}
        <div className="flex items-start justify-between p-2.5 rounded-xl bg-[#eff4ff] border border-slate-200/60">
          <span className="text-slate-600 flex items-center gap-2 font-inter font-medium text-xs mt-0.5">
            <FileText className="w-3.5 h-3.5 text-[#455f87]" />
            Giấy Phép Kinh Doanh
          </span>
          <div className="text-right">
            <div className="font-bold text-[#0d1c2e]">{profile.businessLicense}</div>
            <div className="text-[10px] text-slate-500">
              {profile.businessLicenseIssuer} • {profile.businessLicenseDate}
            </div>
          </div>
        </div>

        {/* Managed Yards */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff4ff] border border-slate-200/60">
          <span className="text-slate-600 flex items-center gap-2 font-inter font-medium text-xs">
            <Warehouse className="w-3.5 h-3.5 text-[#455f87]" />
            Bến Bãi Quản Lý
          </span>
          <span className="font-bold text-[#0d1c2e] font-inter text-xs">
            {profile.managedYardsDesc}
          </span>
        </div>
      </div>

      {/* Ambient Operation Metric Footnote */}
      <div className="p-3 bg-[#e6eeff]/60 rounded-xl flex items-center justify-between border border-blue-100">
        <span className="font-mono text-[11px] text-slate-600 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          Hạn kiểm duyệt định kỳ:
        </span>
        <span className="font-mono text-[11px] font-bold text-[#0d1c2e]">
          {profile.auditDeadline} (CÒN {profile.auditDaysRemaining} NGÀY)
        </span>
      </div>
    </section>
  )
}
