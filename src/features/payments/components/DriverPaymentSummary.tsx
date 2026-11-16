import { Clock3, ReceiptText, ShieldAlert, Wallet } from 'lucide-react'
import { paymentMoney, type PaymentRecord } from '../api/paymentDataApi'

export function DriverPaymentSummary({ rows, total }: { rows: PaymentRecord[]; total: number }) {
  const successful = rows.filter((item) => item.status === 'SUCCESS' && item.type !== 'REFUND')
  const reviewCount = rows.filter((item) => item.status === 'REQUIRES_REVIEW').length
  const metrics = [
    {
      label: 'Tổng giao dịch',
      value: total,
      note: 'Tất cả giao dịch của bạn',
      icon: ReceiptText,
      featured: false,
    },
    {
      label: 'Đã thanh toán trên trang này',
      value: paymentMoney(successful.reduce((sum, item) => sum + item.amount, 0)),
      note: 'Không gồm khoản hoàn tiền',
      icon: Wallet,
      featured: true,
    },
    {
      label: 'Chờ thanh toán trên trang này',
      value: rows.filter((item) => item.status === 'PENDING').length,
      note: 'Giao dịch chưa hoàn tất',
      icon: Clock3,
      featured: false,
    },
    {
      label: 'Cần đối soát trên trang này',
      value: reviewCount,
      note: reviewCount ? 'Cần kiểm tra trạng thái giao dịch' : 'Không có giao dịch cần đối soát',
      icon: ShieldAlert,
      featured: false,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4" aria-label="Tổng quan thanh toán">
      {metrics.map(({ label, value, note, icon: Icon, featured }) => (
        <div
          key={label}
          className={`relative flex min-w-0 flex-col rounded-2xl border p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs ${
            featured
              ? 'border-orange-300 bg-white ring-1 ring-orange-400/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span
            className={`absolute right-4 top-4 sm:right-5 sm:top-5 flex size-8 items-center justify-center rounded-xl ${
              featured ? 'bg-orange-50 text-[#d95f00]' : 'bg-slate-50 text-slate-400'
            }`}
          >
            <Icon size={17} aria-hidden="true" />
          </span>
          <p
            className={`min-h-8 pr-8 text-xs font-semibold leading-4 flex items-center gap-1.5 ${
              featured ? 'text-orange-950' : 'text-slate-500'
            }`}
          >
            {label}
          </p>
          <p className="mt-2 font-sora text-xl font-bold leading-8 tracking-tight tabular-nums text-slate-900 [overflow-wrap:anywhere] sm:text-2xl">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">{note}</p>
        </div>
      ))}
    </div>
  )
}
