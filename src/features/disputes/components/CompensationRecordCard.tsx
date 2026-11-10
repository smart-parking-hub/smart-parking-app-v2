import { CheckCircle2, Clock, Receipt, XCircle } from 'lucide-react'
import type { Dispute } from '@/entities/operations'
import { Badge } from '@/shared/components/Workspace'
import {
  disputeMoney,
  normalizeDisputeStatus,
  type DisputePaymentRecord,
} from '../api/driverDisputesApi'

export interface CompensationRecordCardProps {
  dispute: Dispute
  payments?: DisputePaymentRecord[]
}

export function CompensationRecordCard({ dispute, payments = [] }: CompensationRecordCardProps) {
  const normalized = normalizeDisputeStatus(dispute.status)
  const declaredCompensation = dispute.compensationAmount ?? dispute.amount
  const refundedPayments = payments.filter(
    (item) => item.status === 'REFUNDED' || item.type === 'REFUND',
  )
  const hasResolutionText = Boolean(dispute.resolution && dispute.resolution.trim().length > 0)

  return (
    <section
      aria-label="Biên bản bồi thường và quyết định xử lý"
      className="rounded-2xl border border-brand-border bg-white p-5 md:p-6 shadow-2xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              normalized === 'RESOLVED'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : normalized === 'REJECTED'
                  ? 'border-rose-200 bg-rose-50 text-rose-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            {normalized === 'RESOLVED' ? (
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            ) : normalized === 'REJECTED' ? (
              <XCircle className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Clock className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <div>
            <h2 className="font-sora text-lg font-semibold text-slate-900">
              Biên bản bồi thường &amp; Kết quả xử lý
            </h2>
            <p className="text-sm text-slate-600">Mã biên bản: BB-KN-{dispute.id}</p>
          </div>
        </div>

        <Badge value={dispute.status} size="md" dot />
      </div>

      <div className="mt-4 space-y-4">
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4">
          <p className="mb-1.5 text-sm font-semibold text-slate-700">
            Kết luận của Quản trị viên
          </p>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-900">
            {hasResolutionText
              ? dispute.resolution
              : 'Hồ sơ đang chờ xử lý. Chưa có kết quả giải quyết.'}
          </p>
        </div>

        {typeof declaredCompensation === 'number' && Number.isFinite(declaredCompensation) && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3.5">
            <span className="text-sm md:text-base font-medium text-emerald-900">
              Giá trị bồi thường / hoàn trả
            </span>
            <span className="font-sora text-lg font-bold tabular-nums text-emerald-800">
              {disputeMoney(declaredCompensation)}
            </span>
          </div>
        )}

        {refundedPayments.length > 0 && (
          <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
              <Receipt className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              <span>Giao dịch hoàn tiền đã ghi nhận</span>
            </p>
            <ul className="space-y-1.5 text-sm md:text-base text-emerald-900">
              {refundedPayments.map((payment) => (
                <li key={payment.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong className="font-semibold">
                      {payment.transactionCode || `#${payment.id}`}
                    </strong>{' '}
                    ({payment.gateway}) · Đã hoàn tiền
                  </span>
                  <span className="font-semibold tabular-nums">
                    {disputeMoney(payment.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

