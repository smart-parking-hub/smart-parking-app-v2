import { useQuery } from '@tanstack/react-query'
import { CreditCard, ReceiptText, RefreshCw } from 'lucide-react'
import { Dialog, Notice, Badge, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import {
  fetchPaymentPage,
  paymentMoney,
  paymentTime,
  paymentTypeLabels,
  paymentStatusLabels,
  type PaymentRecord,
} from '@/features/payments/api/paymentDataApi'
import type { Booking } from '@/features/booking-flow'

export interface BookingPaymentHistoryModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
}

function PaymentDetailCard({ payment }: { payment: PaymentRecord }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-orange-50 text-brand-primary">
            <CreditCard className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <span className="text-xs font-semibold text-slate-800">
              {paymentTypeLabels[payment.type]}
            </span>
          </div>
        </div>
        <Badge value={payment.status}>
          {paymentStatusLabels[payment.status]}
        </Badge>
      </div>

      {/* Amount Display */}
      <div className="rounded-lg bg-slate-50 p-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-slate-500">Số tiền giao dịch:</span>
          <span className="font-sora text-xl font-bold text-slate-900 tabular-nums">
            {paymentMoney(payment.amount)}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <dl className="divide-y divide-slate-100 text-xs leading-5">
        {[
          ['Mã giao dịch', payment.transactionCode || `#${payment.id}`],
          ['Mã đơn PayOS', payment.orderCode ? String(payment.orderCode) : '—'],
          ['Loại giao dịch', paymentTypeLabels[payment.type]],
          [
            'Kênh thanh toán',
            payment.gateway === 'DEMO'
              ? 'Demo (thử nghiệm)'
              : payment.gateway === 'PAYOS'
                ? 'PayOS (VietQR)'
                : payment.gateway,
          ],
          ['Thời gian thanh toán', paymentTime(payment.createdAt)],
        ].map(([label, val]) => (
          <div key={label} className="grid grid-cols-[140px_minmax(0,1fr)] gap-3 py-2 first:pt-0">
            <dt className="text-slate-500">{label}</dt>
            <dd className="break-all text-right font-medium text-slate-900">{val}</dd>
          </div>
        ))}
      </dl>

      {payment.status === 'REQUIRES_REVIEW' && (
        <Notice>
          Giao dịch đang cần đối soát. Vui lòng kiểm tra lại trước khi thực hiện giao dịch khác.
        </Notice>
      )}
    </div>
  )
}

export function BookingPaymentHistoryModal({
  booking,
  isOpen,
  onClose,
}: BookingPaymentHistoryModalProps) {
  const query = useQuery({
    queryKey: ['booking-payments', booking?.id],
    queryFn: () => (booking?.id ? fetchPaymentPage(0, booking.id) : null),
    enabled: Boolean(isOpen && booking?.id),
    staleTime: 10_000,
  })

  if (!isOpen || !booking) return null

  const payments = query.data?.content ?? []

  // Mỗi vé chỉ hiển thị 1 lịch sử thanh toán đại diện duy nhất
  // Ưu tiên: SUCCESS (FINAL_PAYMENT > DEPOSIT) > PENDING / REQUIRES_REVIEW > giao dịch mới nhất
  const primaryPayment = (() => {
    if (payments.length === 0) return null
    if (payments.length === 1) return payments[0]
    const successPayments = payments.filter((p) => p.status === 'SUCCESS')
    if (successPayments.length > 0) {
      const finalPayment = successPayments.find((p) => p.type === 'FINAL_PAYMENT')
      return finalPayment ?? successPayments[0]
    }
    const pendingPayments = payments.filter(
      (p) => p.status === 'PENDING' || p.status === 'REQUIRES_REVIEW'
    )
    if (pendingPayments.length > 0) return pendingPayments[0]
    return payments[0]
  })()

  return (
    <Dialog
      title={`Lịch sử thanh toán #${booking.bookingCode}`}
      onClose={onClose}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Context Strip: Directly displays booking info */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <span>
            Bãi: <strong className="text-slate-900">{booking.parkingLotName || `#${booking.parkingLotId}`}</strong>
          </span>
          {booking.vehiclePlate && (
            <span>
              Biển số: <strong className="font-mono text-slate-900">{booking.vehiclePlate}</strong>
            </span>
          )}
          <span>
            Mã đơn: <strong className="font-mono text-brand-primary">#{booking.bookingCode}</strong>
          </span>
        </div>

        {query.isPending ? (
          <div role="status" className="py-10 text-center text-sm text-brand-muted">
            <RefreshCw className="mx-auto mb-2 h-6 w-6 animate-spin text-brand-primary" />
            <p>Đang tải chi tiết thanh toán của vé…</p>
          </div>
        ) : query.isError ? (
          <Notice error>
            <div>
              {errorMessage(query.error)}
              <button
                type="button"
                className={`${secondary} mt-3 !text-xs`}
                onClick={() => void query.refetch()}
              >
                Thử lại
              </button>
            </div>
          </Notice>
        ) : !primaryPayment ? (
          <div className="py-10 text-center">
            <ReceiptText className="mx-auto mb-2 h-10 w-10 text-slate-300" aria-hidden="true" />
            <h4 className="font-sora text-sm font-semibold text-slate-800">
              Chưa có giao dịch thanh toán nào
            </h4>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Vé #{booking.bookingCode} chưa phát sinh giao dịch cọc hoặc thanh toán nào trên hệ thống.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Hiển thị đúng 1 chi tiết giao dịch thanh toán đại diện cho vé */}
            <PaymentDetailCard payment={primaryPayment} />
          </div>
        )}

        <div className="flex justify-end border-t border-slate-200 pt-3">
          <button
            type="button"
            className={`${secondary} !min-h-10 !px-4 !py-2 !text-xs cursor-pointer`}
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </Dialog>
  )
}
