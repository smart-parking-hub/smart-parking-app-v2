import { CreditCard, AlertCircle } from 'lucide-react'

export function CancelNoticeCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
      {/* Icon with Alert Badge */}
      <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xs">
        <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xs">
          <AlertCircle className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Main Text Content */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-mono font-bold uppercase tracking-wider border border-slate-200">
            GIAO DỊCH BỊ GIÁN ĐOẠN
          </span>
          <span className="font-mono text-xs text-slate-500">
            LỖI THAO TÁC / USER_CANCEL
          </span>
        </div>
        <h1 className="font-sora text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          GIAO DỊCH THANH TOÁN ĐÃ ĐƯỢC HỦY
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Bạn vừa chủ động hủy hoặc chuyển hướng khỏi phiên thanh toán trên Cổng PayOS.{' '}
          <span className="font-semibold text-slate-900">
            Tài khoản ngân hàng của bạn chưa bị trừ tiền.
          </span>
        </p>
      </div>
    </div>
  )
}
