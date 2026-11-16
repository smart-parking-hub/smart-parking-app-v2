import { ArrowUpRight, ReceiptText } from 'lucide-react'
import { Badge, type BadgeProps } from '@/shared/components/Badge'
import { paymentMoney, paymentStatusLabels, paymentTime, paymentTypeLabels, type PaymentRecord } from '../api/paymentDataApi'

const statusVariants: Record<PaymentRecord['status'], BadgeProps['variant']> = {
  PENDING: 'warning', SUCCESS: 'success', FAILED: 'danger', REFUNDED: 'info', REQUIRES_REVIEW: 'orange',
}

export function DriverPaymentStatus({ status }: { status: PaymentRecord['status'] }) {
  return <Badge variant={statusVariants[status]} dot className="!text-[11px] !normal-case !tracking-normal">{paymentStatusLabels[status]}</Badge>
}

export function DriverPaymentList({ rows, onSelect }: { rows: PaymentRecord[]; onSelect: (id: number) => void }) {
  return <table role="table" className="block w-full text-left text-sm lg:table">
    <caption className="sr-only">Danh sách giao dịch thanh toán trên trang hiện tại</caption>
    <thead className="hidden bg-brand-surface/60 lg:table-header-group">
      <tr role="row" className="border-y border-brand-border text-xs text-brand-muted">
        {['Giao dịch / Booking', 'Thời gian', 'Nội dung', 'Số tiền', 'Trạng thái', 'Thao tác'].map(label => <th role="columnheader" scope="col" key={label} className={`px-5 py-3 font-medium ${label === 'Số tiền' ? 'text-right' : ''}`}>{label}</th>)}
      </tr>
    </thead>
    <tbody className="grid gap-3 bg-brand-surface/40 p-3 lg:table-row-group lg:bg-white lg:p-0">
      {rows.map(item => <tr role="row" key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-4 rounded-xl border border-brand-border bg-white p-4 transition-colors lg:table-row lg:rounded-none lg:border-0 lg:border-b lg:last:border-b-0 lg:hover:bg-brand-surface/40">
        <td role="cell" className="col-start-1 row-start-1 min-w-0 lg:w-[26%] lg:px-5 lg:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden size-10 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-surface/60 text-brand-muted sm:flex"><ReceiptText size={18} aria-hidden="true" /></span>
            <div className="min-w-0"><p title={item.transactionCode || `Giao dịch #${item.id}`} className="max-w-64 truncate font-mono text-xs font-semibold leading-5 text-brand-navy">{item.transactionCode || `Giao dịch #${item.id}`}</p><p className="mt-0.5 text-xs text-brand-muted">Booking #{item.bookingId}</p></div>
          </div>
        </td>
        <td role="cell" className="col-start-1 row-start-3 self-center text-xs text-brand-muted lg:px-5 lg:py-4"><span className="sr-only lg:hidden">Thời gian: </span><time>{paymentTime(item.createdAt)}</time></td>
        <td role="cell" className="col-start-1 row-start-2 lg:px-5 lg:py-4"><p className="text-xs font-medium lg:text-sm">{paymentTypeLabels[item.type]}</p><p className="mt-1 text-xs text-brand-muted">{item.gateway === 'DEMO' ? 'Demo (thử nghiệm)' : item.gateway === 'PAYOS' ? 'PayOS' : item.gateway}</p></td>
        <td role="cell" className="col-start-2 row-start-2 self-center whitespace-nowrap text-right font-semibold tabular-nums lg:px-5 lg:py-4"><span className="sr-only lg:hidden">Số tiền: </span>{paymentMoney(item.amount)}</td>
        <td role="cell" className="col-start-2 row-start-1 self-start lg:px-5 lg:py-4"><DriverPaymentStatus status={item.status} /></td>
        <td role="cell" className="col-start-2 row-start-3 justify-self-end lg:px-5 lg:py-4">
          <button
            type="button"
            onClick={() => onSelect(item.id)}
            aria-label={`Chi tiết giao dịch ${item.transactionCode || item.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-[#d95f00] hover:bg-orange-50/80 hover:text-[#d95f00] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer transition-all duration-150"
          >
            <span>Chi tiết</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </td>
      </tr>)}
    </tbody>
  </table>
}
