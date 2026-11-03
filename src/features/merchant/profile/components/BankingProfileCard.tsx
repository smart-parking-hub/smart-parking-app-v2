import { useState } from 'react'
import {
  CreditCard,
  Building2,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import type { MerchantProfile } from '../types/merchantProfileTypes'

interface BankingProfileCardProps {
  profile: MerchantProfile
}

export function BankingProfileCard({ profile }: BankingProfileCardProps) {
  const [revealSensitive, setRevealSensitive] = useState(false)

  const displayedAccountNum = revealSensitive
    ? profile.bankAccountNum
    : profile.maskedBankAccount || `${profile.bankAccountNum.slice(0, 4)}****${profile.bankAccountNum.slice(-4)}`

  return (
    <section className="bg-white rounded-2xl p-6 lg:p-7 shadow-xs border border-slate-200/80 space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-md bg-[#131b2e] text-white flex items-center justify-center font-mono text-[11px] font-bold">
            02
          </span>
          <h2 className="font-sora text-base lg:text-lg font-bold text-[#0d1c2e]">
            Tài Khoản Ngân Hàng Thụ Hưởng Rút Tiền
          </h2>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#eff4ff] text-[#0d1c2e] font-mono text-[11px] font-bold border border-slate-200">
          <RefreshCw className="w-3.5 h-3.5 text-[#d95f00]" />
          <span>VIETQR NAPAS247</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {/* Beneficiary Bank */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0d1c2e] block">
            Ngân hàng thụ hưởng đối soát
          </label>
          <div className="w-full h-12 px-3.5 bg-[#eff4ff] rounded-xl flex items-center justify-between border border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded bg-[#131b2e] text-white flex items-center justify-center font-bold text-[10px] font-mono">
                {profile.bankShortName}
              </span>
              <span className="font-semibold text-xs lg:text-sm text-[#0d1c2e]">
                {profile.bankName}
              </span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#455f87]" />
          </div>
        </div>

        {/* Branch Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0d1c2e] block">Chi nhánh mở tài khoản</label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={profile.bankBranch}
              className="w-full h-12 px-3.5 bg-[#eff4ff] rounded-xl text-xs lg:text-sm text-[#0d1c2e] focus:outline-none cursor-not-allowed pl-10 border border-slate-200"
            />
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
          </div>
        </div>

        {/* Account Number with Mask / Reveal Toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#0d1c2e]">
              Số tài khoản thanh toán (STK)
            </label>
            <button
              type="button"
              id="btn-toggle-mask"
              onClick={() => setRevealSensitive((prev) => !prev)}
              className="font-mono text-[11px] text-[#d95f00] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              {revealSensitive ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" id="eye-icon" />
                  <span id="eye-text">Ẩn số tài khoản</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" id="eye-icon" />
                  <span id="eye-text">Hiển thị đầy đủ</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              id="bank-acc-input"
              readOnly
              value={displayedAccountNum}
              data-masked={profile.maskedBankAccount}
              data-full={profile.bankAccountNum}
              className="w-full h-12 px-3.5 bg-[#eff4ff] rounded-xl font-mono text-xs lg:text-sm text-[#0d1c2e] tracking-wider font-bold focus:outline-none pl-10 pr-24 border border-slate-200"
            />
            <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            <span className="font-mono text-[10px] absolute right-3.5 top-4 text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
              VND • ACTIVE
            </span>
          </div>
        </div>

        {/* Account Holder Name (Uppercase) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0d1c2e] block">
            Tên chủ tài khoản thụ hưởng
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={profile.bankAccountHolder}
              className="w-full h-12 px-3.5 bg-[#eff4ff] rounded-xl font-mono text-xs lg:text-sm text-[#0d1c2e] uppercase font-bold focus:outline-none pl-10 border border-slate-200"
            />
            <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
          </div>
        </div>
      </div>

      {/* Security Callout Warning Banner */}
      <div className="p-4 rounded-xl bg-[#eff4ff] border border-blue-100 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#d95f00] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#0d1c2e]">
          <strong className="font-semibold block text-[#0d1c2e]">
            Quy chuẩn bảo mật giải ngân tài chính:
          </strong>
          <p className="text-slate-600 leading-relaxed m-0">
            Tên chủ tài khoản ngân hàng phải khớp 100% với tên trên Giấy phép kinh doanh đã duyệt. Bất
            kỳ yêu cầu đổi số tài khoản nào sẽ cần tải lên Biên bản họp HĐTV/HĐQT, xác thực OTP qua số
            hotline giám đốc và tạm dừng lệnh rút trong{' '}
            <strong className="text-[#0d1c2e]">24 giờ</strong> để phòng chống rủi ro gian lận.
          </p>
        </div>
      </div>
    </section>
  )
}
