import { Percent, Receipt, FileCheck } from 'lucide-react'
import type { MerchantProfile } from '../types/merchantProfileTypes'

interface MerchantPolicyCardProps {
  profile: MerchantProfile
}

export function MerchantPolicyCard({ profile }: MerchantPolicyCardProps) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#455f87] shrink-0 border border-slate-200">
          <FileCheck className="w-3.5 h-3.5 text-[#455f87]" />
        </div>
        <h2 className="font-sora text-xs font-bold text-[#0d1c2e] uppercase tracking-wider">
          Chính Sách Cắt Cước &amp; Thuế
        </h2>
      </div>

      <ul className="space-y-3 text-xs text-[#0d1c2e] m-0 p-0 list-none">
        <li className="flex items-start gap-3 p-3 rounded-xl bg-[#eff4ff] border border-slate-200/60">
          <div className="w-7 h-7 rounded-lg bg-[#ffdbca] flex items-center justify-center text-[#d95f00] shrink-0 mt-0.5">
            <Percent className="w-3.5 h-3.5 text-[#d95f00]" />
          </div>
          <div>
            <span className="font-bold text-[#0d1c2e] block">Phí dịch vụ nền tảng:</span>
            <p className="text-slate-600 mt-0.5 leading-relaxed m-0">
              Cố định <strong className="text-[#0d1c2e]">{profile.platformFeeRate.toFixed(1)}%</strong> trên
              mỗi giao dịch giữ chỗ xe tải thành công qua cổng SmartTruck.
            </p>
          </div>
        </li>

        <li className="flex items-start gap-3 p-3 rounded-xl bg-[#eff4ff] border border-slate-200/60">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#455f87] shrink-0 mt-0.5 border border-slate-200">
            <Receipt className="w-3.5 h-3.5 text-[#455f87]" />
          </div>
          <div>
            <span className="font-bold text-[#0d1c2e] block">Hóa đơn điện tử VAT tổng hợp:</span>
            <p className="text-slate-600 mt-0.5 leading-relaxed m-0">
              {profile.vatInvoiceDesc}
            </p>
          </div>
        </li>
      </ul>
    </section>
  )
}
