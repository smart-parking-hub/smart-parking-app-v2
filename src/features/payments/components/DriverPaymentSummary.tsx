import { Clock3, ReceiptText, ShieldAlert, Wallet } from 'lucide-react'
import { paymentMoney, type PaymentRecord } from '../api/paymentDataApi'

export function DriverPaymentSummary({ rows, total }: { rows: PaymentRecord[]; total: number }) {
  const successful = rows.filter(item => item.status === 'SUCCESS' && item.type !== 'REFUND')
  const reviewCount = rows.filter(item => item.status === 'REQUIRES_REVIEW').length
  const metrics = [
    { label: 'Tổng giao dịch', value: total, note: 'Tất cả giao dịch của bạn', icon: ReceiptText },
    { label: 'Đã thanh toán trên trang này', value: paymentMoney(successful.reduce((sum, item) => sum + item.amount, 0)), note: 'Không gồm khoản hoàn tiền', icon: Wallet, featured: true },
    { label: 'Chờ thanh toán trên trang này', value: rows.filter(item => item.status === 'PENDING').length, note: 'Giao dịch chưa hoàn tất', icon: Clock3 },
    { label: 'Cần đối soát trên trang này', value: reviewCount, note: reviewCount ? 'Cần kiểm tra trạng thái giao dịch' : 'Không có giao dịch cần đối soát', icon: ShieldAlert },
  ]

  return <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4" aria-label="Tổng quan thanh toán">
    {metrics.map(({ label, value, note, icon: Icon, featured }) => <div key={label} className={`relative flex min-w-0 flex-col rounded-2xl border p-4 sm:p-5 ${featured ? 'border-brand-navy bg-brand-navy text-white' : 'border-brand-border bg-white text-brand-navy'}`}>
      <Icon size={17} aria-hidden="true" className={`absolute right-4 top-4 sm:right-5 sm:top-5 ${featured ? 'text-brand-orange' : 'text-brand-muted'}`} />
      <p className={`min-h-8 pr-6 text-xs leading-4 ${featured ? 'text-slate-300' : 'text-brand-muted'}`}>{label}</p>
      <p className="mt-2 font-sora text-xl font-semibold leading-8 tracking-tight tabular-nums [overflow-wrap:anywhere] sm:text-2xl">{value}</p>
      <p className={`mt-2 text-[11px] leading-relaxed ${featured ? 'text-slate-300' : 'text-brand-muted'}`}>{note}</p>
    </div>)}
  </div>
}
