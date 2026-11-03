import { useState } from 'react'
import { Wallet, X, ShieldCheck, CheckCircle2 } from 'lucide-react'
import type { MerchantProfile } from '../types/merchantProfileTypes'

interface FastWithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  profile: MerchantProfile
  onConfirm: (amount: number) => Promise<void>
  isSubmitting: boolean
}

export function FastWithdrawModal({
  isOpen,
  onClose,
  profile,
  onConfirm,
  isSubmitting,
}: FastWithdrawModalProps) {
  const [amountStr, setAmountStr] = useState(
    new Intl.NumberFormat('vi-VN').format(profile.walletBalance),
  )

  if (!isOpen) return null

  const parseAmount = (val: string) => {
    const raw = val.replace(/\D/g, '')
    return raw ? parseInt(raw, 10) : 0
  }

  const handleAllClick = () => {
    setAmountStr(new Intl.NumberFormat('vi-VN').format(profile.walletBalance))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseAmount(e.target.value)
    if (num > profile.walletBalance) {
      setAmountStr(new Intl.NumberFormat('vi-VN').format(profile.walletBalance))
    } else {
      setAmountStr(new Intl.NumberFormat('vi-VN').format(num))
    }
  }

  const handleSubmit = async () => {
    const amount = parseAmount(amountStr)
    if (amount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ cần rút!')
      return
    }
    await onConfirm(amount)
  }

  const formatMoney = (val: number) => new Intl.NumberFormat('vi-VN').format(val)

  return (
    <div
      id="withdraw-modal"
      className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#341100] border border-[#d95f00]/30 flex items-center justify-center text-[#d95f00]">
              <Wallet className="w-4 h-4 text-[#d95f00]" />
            </div>
            <h3 className="font-sora text-base lg:text-lg font-bold text-[#0d1c2e]">
              Yêu Cầu Rút Tiền Về {profile.bankShortName} Bank
            </h3>
          </div>

          <button
            type="button"
            id="btn-close-withdraw-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4">
          {/* Target Account Badge */}
          <div className="p-3.5 bg-[#eff4ff] rounded-xl border border-slate-200/70 space-y-1">
            <span className="font-mono text-[11px] text-slate-500 block uppercase font-medium">
              Tài khoản thụ hưởng nhận tiền:
            </span>
            <div className="font-mono text-xs lg:text-sm font-bold text-[#0d1c2e] flex items-center gap-2">
              <span>
                {profile.bankShortName.toUpperCase()} BANK • {profile.bankAccountNum}
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#455f87]" />
            </div>
            <div className="font-mono text-[11px] text-slate-600 font-semibold">
              {profile.bankAccountHolder}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-[#0d1c2e]">
              <span>Số tiền muốn rút (VND)</span>
              <span className="font-mono text-[#d95f00] font-bold">
                Tối đa: {formatMoney(profile.walletBalance)} ₫
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={amountStr}
                onChange={handleInputChange}
                className="w-full h-12 px-3.5 bg-white rounded-xl border border-slate-300 font-sora text-lg lg:text-xl font-bold text-[#0d1c2e] focus:outline-none focus:border-[#d95f00] pr-20"
              />
              <button
                type="button"
                onClick={handleAllClick}
                className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-[#eff4ff] font-mono text-[11px] font-bold text-[#0d1c2e] hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
              >
                TẤT CẢ
              </button>
            </div>
          </div>

          {/* Fee & Telemetry Details */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 font-mono text-[11px] space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Phí xử lý giao dịch Napas:</span>
              <span className="text-[#0d1c2e] font-bold">0 ₫ (Miễn phí)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Thời gian chuyển khoản:</span>
              <span className="text-[#0d1c2e] font-bold">5 - 15 phút (24/7)</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            id="btn-cancel-modal"
            onClick={onClose}
            className="h-10 px-4 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            id="btn-confirm-withdraw"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-10 px-5 rounded-xl bg-[#d95f00] hover:bg-[#b85000] text-white font-sora font-bold text-xs flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'ĐANG XỬ LÝ LỆNH...' : 'Xác Nhận Rút Tiền Ngay'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
