import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ChevronRight, ReceiptText, RefreshCw } from 'lucide-react'
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

export function BookingPaymentHistoryModal({
  booking,
  isOpen,
  onClose,
}: BookingPaymentHistoryModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)

  const query = useQuery({
    queryKey: ['booking-payments', booking?.id],
    queryFn: () => (booking?.id ? fetchPaymentPage(0, booking.id) : null),
    enabled: Boolean(isOpen && booking?.id),
    staleTime: 10_000,
  })

  if (!isOpen || !booking) return null

  const payments = query.data?.content ?? []
  const hasMultiple = payments.length > 1
  const displayedPayment = selectedPayment ?? (payments.length === 1 ? payments[0] : null)

  const handleClose = () => {
    setSelectedPayment(null)
    onClose()
  }

  return (
    <Dialog
      title={`Lịch sử thanh toán #${booking.bookingCode}`}
      onClose={handleClose}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Context Strip */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <span>
            Bãi: <strong className="text-slate-900">{booking.parkingLotName || `#${booking.parkingLotId}`}</strong>
          </span>
          {booking.vehiclePlate && (
            <span>
              Xe: <strong className="font-mono text-slate-900">{booking.vehiclePlate}</strong>
            </span>
          )}
        </div>

        {query.isPending ? (
          <div role="status" className="py-10 text-center text-sm text-brand-muted">
            <RefreshCw className="mx-auto mb-2 h-6 w-6 animate-spin text-brand-orange" />
            <p>Đang tải lịch sử giao dịch…</p>
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
        ) : payments.length === 0 ? (
          <div className="py-10 text-center">
            <ReceiptText className="mx-auto mb-2 h-10 w-10 text-slate-300" aria-hidden="true" />
            <h4 className="font-sora text-sm font-semibold text-slate-800">
              Chưa có giao dịch thanh toán nào
            </h4>
            <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
              Chưa phát sinh giao dịch cọc hoặc thanh toán cuối cho lượt đặt chỗ này.
            </p>
          </div>
        ) : displayedPayment && (!hasMultiple || selectedPayment) ? (
          /* Single payment details view */
          <div className="space-y-4">
            {hasMultiple && (
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:text-brand-orange-ink cursor-pointer"
              >
                <ArrowLeft size={14} />
                Quay lại danh sách giao dịch ({payments.length})
              </button>
            )}

            <div className="rounded-xl border border-brand-border bg-brand-surface/60 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                  <ReceiptText size={15} aria-hidden="true" />
                  {paymentTypeLabels[displayedPayment.type]}
                </span>
                <Badge value={displayedPayment.status}>
                  {paymentStatusLabels[displayedPayment.status]}
                </Badge>
              </div>
              <p className="break-words font-sora text-2xl font-bold tracking-tight text-brand-navy tabular-nums">
                {paymentMoney(displayedPayment.amount)}
              </p>
            </div>

            <dl className="divide-y divide-brand-border text-xs leading-5">
              {[
                ['Mã giao dịch', displayedPayment.transactionCode || `#${displayedPayment.id}`],
                ['Mã đơn PayOS', displayedPayment.orderCode ?? '—'],
                ['Loại giao dịch', paymentTypeLabels[displayedPayment.type]],
                ['Kênh thanh toán', displayedPayment.gateway === 'DEMO' ? 'Demo (thử nghiệm)' : displayedPayment.gateway === 'PAYOS' ? 'PayOS' : displayedPayment.gateway],
                ['Thời gian thanh toán', paymentTime(displayedPayment.createdAt)],
              ].map(([label, val]) => (
                <div key={label} className="grid grid-cols-[140px_minmax(0,1fr)] gap-3 py-2.5 first:pt-0">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="break-all text-right font-medium text-slate-900">{val}</dd>
                </div>
              ))}
            </dl>

            {displayedPayment.status === 'REQUIRES_REVIEW' && (
              <Notice>
                Giao dịch đang cần đối soát. Vui lòng kiểm tra lại trước khi thực hiện thanh toán khác.
              </Notice>
            )}
          </div>
        ) : (
          /* Multi-payment list view */
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 mb-2">
              Tìm thấy {payments.length} giao dịch liên quan đến đơn này. Chọn một giao dịch để xem chi tiết:
            </p>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
              {payments.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPayment(p)}
                  className="flex w-full items-center justify-between p-3.5 text-left text-xs transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand-orange cursor-pointer"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {paymentTypeLabels[p.type]}
                      </span>
                      <Badge value={p.status} size="sm">
                        {paymentStatusLabels[p.status]}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-slate-500">
                      <span>Mã: {p.transactionCode || `#${p.id}`}</span>
                      <span>{paymentTime(p.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {paymentMoney(p.amount)}
                    </span>
                    <ChevronRight size={15} className="text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end border-t border-brand-border pt-4">
          <button
            type="button"
            className={`${secondary} !min-h-10 !px-4 !py-2 !text-xs cursor-pointer`}
            onClick={handleClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </Dialog>
  )
}
