import { refundStatusLabels } from '@/features/driver-wallet'
import { ArrowUpRight, ReceiptText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Dialog, Notice, secondary } from '@/shared/components/Workspace'
import { paymentMoney, paymentTime, paymentTypeLabels, type PaymentRecord } from '../api/paymentDataApi'
import { DriverPaymentStatus } from './DriverPaymentList'

export function DriverPaymentDetails({ payment, onClose }: { payment: PaymentRecord; onClose: () => void }) {
  return <Dialog title="Chi tiết giao dịch" onClose={onClose} maxWidth="sm">
    <div className="space-y-5">
      <div className="rounded-xl border border-brand-border bg-brand-surface/60 p-5">
        <div className="mb-3 flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-xs text-brand-muted"><ReceiptText size={16} aria-hidden="true" />Số tiền</span><DriverPaymentStatus status={payment.status} /></div>
        <p className="break-words font-sora text-3xl font-semibold tracking-tight text-brand-navy tabular-nums">{paymentMoney(payment.amount)}</p>
        <p className="mt-2 text-xs text-brand-muted">{paymentTypeLabels[payment.type]}</p>
      </div>
      <dl className="divide-y divide-brand-border text-sm">{[
        ['Mã giao dịch', payment.transactionCode || `#${payment.id}`], ['Booking', `#${payment.bookingId}`],
        ['Bãi đỗ', payment.parkingLotId == null ? '—' : `#${payment.parkingLotId}`], ['Mã đơn thanh toán', payment.orderCode ?? '—'],
        ['Kênh thanh toán', payment.gateway === 'WALLET' ? 'Ví tài xế' : payment.gateway === 'DEMO' ? 'Demo (thử nghiệm)' : payment.gateway === 'PAYOS' ? 'PayOS' : payment.gateway],
        ['Thời gian', paymentTime(payment.createdAt)],
      ].map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 py-3 first:pt-0"><dt className="text-xs leading-5 text-brand-muted">{label}</dt><dd className="break-all text-right text-xs font-medium leading-5 text-brand-navy">{value}</dd></div>)}</dl>
      {payment.refundAmount != null && <Notice><div><p>Khoản hoàn: {paymentMoney(payment.refundAmount)} · {refundStatusLabels[payment.refundStatus ?? 'NONE'] ?? payment.refundStatus}</p><p>Kênh hoàn: {payment.refundChannel === 'WALLET' ? 'Ví tài xế' : 'Ngân hàng thủ công'}</p>{payment.refundReference && <p>Mã hoàn: {payment.refundReference}</p>}<Link className="underline text-brand-primary" to="/wallet">Xem ví</Link></div></Notice>}
      {payment.status === 'REQUIRES_REVIEW'  && <Notice>Giao dịch đang cần đối soát. Kiểm tra trạng thái booking trước khi thực hiện thanh toán khác.</Notice>}
      <div className="flex flex-wrap justify-end gap-2 border-t border-brand-border pt-4">
        <button type="button" className={`${secondary} !min-h-10 !px-3 !py-2 !text-xs`} onClick={onClose}>Đóng chi tiết</button>
        <Link className={`${secondary} !min-h-10 !px-3 !py-2 !text-xs`} to="/bookings">Xem đặt chỗ<ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>
    </div>
  </Dialog>
}
