import { Lock, Receipt, ShieldCheck } from 'lucide-react'
import type { PaymentReturnManifestDto } from '../types/paymentReturnTypes'

interface PaymentSuccessHeroProps {
  manifest: PaymentReturnManifestDto
}

export function PaymentSuccessHero({ manifest }: PaymentSuccessHeroProps) {
  return (
    <section className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
      {/* Shield Icon with Fretrix Orange Dual Accent Rings */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center shadow-inner">
          <div className="w-[72px] h-[72px] rounded-full bg-slate-900 flex items-center justify-center shadow-md">
            <ShieldCheck className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <span className="absolute -top-1 -right-1 flex h-6 w-6">
          <span className="relative inline-flex rounded-full h-6 w-6 bg-orange-600 items-center justify-center text-white font-mono text-xs font-bold shadow-xs">
            ✓
          </span>
        </span>
      </div>

      {/* Security Badge */}
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-xs font-semibold uppercase mb-3 border border-slate-200">
        <Lock className="w-4 h-4 text-orange-600" />
        XÁC THỰC MẬT MÃ SHA-256 THÀNH CÔNG
      </span>

      {/* Main Title */}
      <h1 className="font-sora text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mb-2.5">
        Giao Dịch Thanh Toán Thành Công!
      </h1>

      {/* Subtitle Description */}
      <p className="text-sm sm:text-base text-slate-600 max-w-[680px] mb-6 leading-relaxed">
        Hệ thống SmartTruckHub đã đối soát tức thời với Cổng Quốc Gia PayOS. Vé đỗ xe điện tử và mã QR Barie tự động mở cổng đã sẵn sàng trong cabin của bạn.
      </p>

      {/* Transaction Manifest Ribbon */}
      <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 font-mono text-xs sm:text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-orange-600 shrink-0" />
          <span>
            MÃ GD: <strong className="text-slate-900 font-bold">{manifest.transactionCode}</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            KÊNH: <strong className="text-slate-900 font-bold">{manifest.paymentChannel}</strong>
          </span>
          <span className="text-slate-300">·</span>
          <span>
            NGÂN HÀNG: <strong className="text-slate-900 font-bold">{manifest.bankName}</strong>
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-orange-600 font-bold">{manifest.amountText}</span>
        </div>
      </div>
    </section>
  )
}
