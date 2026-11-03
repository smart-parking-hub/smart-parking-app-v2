import { Wallet, Lock, ArrowRight, Zap } from 'lucide-react'
import type { MerchantProfile } from '../types/merchantProfileTypes'

interface MerchantWalletSummaryCardProps {
  profile: MerchantProfile
  onOpenWithdrawModal: () => void
}

export function MerchantWalletSummaryCard({
  profile,
  onOpenWithdrawModal,
}: MerchantWalletSummaryCardProps) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  return (
    <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#341100] border border-[#d95f00]/30 flex items-center justify-center text-[#d95f00] shrink-0">
            <Wallet className="w-4 h-4 text-[#d95f00]" />
          </div>
          <h2 className="font-sora text-sm font-bold text-[#0d1c2e] uppercase tracking-wider">
            Ví Doanh Thu Sẵn Sàng Rút
          </h2>
        </div>

        <span className="font-mono text-[10px] px-2.5 py-1 rounded-md bg-[#eff4ff] text-[#0d1c2e] font-bold border border-slate-200/70">
          NAPAS 24/7 AUTO
        </span>
      </div>

      {/* Revenue Balance Display Block */}
      <div className="p-4 rounded-xl bg-[#eff4ff] border border-slate-200/60 space-y-3">
        <div>
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
            Số Dư Khả Dụng (Rút Tức Thì)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-sora text-3xl lg:text-4xl text-[#d95f00] font-extrabold tracking-tight">
              {formatMoney(profile.walletBalance)}
            </span>
            <span className="font-sora text-xl text-[#d95f00] font-bold">₫</span>
          </div>
        </div>

        <div className="h-px bg-slate-200/70 w-full" />

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium text-xs">Đang tạm giữ đối soát (72h):</span>
          </div>
          <span className="font-mono text-xs font-bold text-[#0d1c2e]">
            {formatMoney(profile.pendingBalance)} ₫
          </span>
        </div>
      </div>

      {/* Call to Action: Withdraw Initiation */}
      <button
        type="button"
        onClick={onOpenWithdrawModal}
        id="btn-open-withdraw-modal"
        className="w-full h-12 bg-[#d95f00] hover:bg-[#b85000] text-white rounded-xl font-sora text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
      >
        <Zap className="w-4 h-4 fill-current" />
        <span className="tracking-wide uppercase">TẠO YÊU CẦU RÚT TIỀN NGAY</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <p className="font-mono text-[11px] text-slate-500 text-center leading-relaxed m-0">
        Lệnh rút tiền qua Napas247 xử lý trong 5-15 phút. Miễn phí rút cho giao dịch từ 5.000.000 ₫
        trở lên.
      </p>
    </section>
  )
}
