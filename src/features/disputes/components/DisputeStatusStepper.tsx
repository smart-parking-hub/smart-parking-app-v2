import { CheckCircle2, Clock, FileCheck2, ShieldAlert, XCircle } from 'lucide-react'
import { disputeTimeLabel, normalizeDisputeStatus } from '../api/driverDisputesApi'

export interface DisputeStatusStepperProps {
  status: string
  bookingId?: number
  merchantId?: number | null
  createdAt: string
  updatedAt?: string
}

export function DisputeStatusStepper({
  status,
  createdAt,
  updatedAt,
}: DisputeStatusStepperProps) {
  const normalized = normalizeDisputeStatus(status)
  const isFinished = normalized === 'RESOLVED' || normalized === 'REJECTED'

  const steps = [
    {
      id: 'submitted',
      title: '1. Tiếp nhận hồ sơ',
      detail: disputeTimeLabel(createdAt),
      state: 'completed' as const,
      icon: FileCheck2,
    },
    {
      id: 'reviewing',
      title: '2. Đối soát & Xác minh',
      detail: isFinished ? 'Đã hoàn tất đối soát' : 'Đang xử lý',
      state: isFinished ? ('completed' as const) : ('active' as const),
      icon: Clock,
    },
    {
      id: 'verdict',
      title: '3. Phán quyết & Biên bản',
      detail: isFinished ? disputeTimeLabel(updatedAt) : 'Chờ kết luận',
      state:
        normalized === 'RESOLVED'
          ? ('completed' as const)
          : normalized === 'REJECTED'
            ? ('rejected' as const)
            : ('upcoming' as const),
      icon:
        normalized === 'RESOLVED'
          ? CheckCircle2
          : normalized === 'REJECTED'
            ? XCircle
            : ShieldAlert,
    },
  ]

  return (
    <section
      aria-label="Tiến độ giải quyết khiếu nại"
      className="rounded-2xl border border-brand-border bg-white p-5 md:p-6 shadow-2xs"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-sora text-lg font-semibold text-slate-900">
          Tiến độ giải quyết của Quản trị viên
        </h2>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-sm font-medium text-slate-800">
          {isFinished ? 'Bước 3/3 · Đã đóng hồ sơ' : 'Bước 2/3 · Đang đối soát'}
        </span>
      </div>

      <ol className="grid gap-3 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon
          const style =
            step.state === 'completed'
              ? {
                  card: 'border-emerald-200 bg-emerald-50/40',
                  iconWrap: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                  detailText: 'text-emerald-800',
                }
              : step.state === 'active'
                ? {
                    card: 'border-brand-primary-border bg-brand-primary-subtle/70',
                    iconWrap: 'bg-white text-brand-primary border-brand-primary-border',
                    detailText: 'text-brand-primary-active',
                  }
                : step.state === 'rejected'
                  ? {
                      card: 'border-rose-200 bg-rose-50/50',
                      iconWrap: 'bg-rose-100 text-rose-700 border-rose-200',
                      detailText: 'text-rose-800',
                    }
                  : {
                      card: 'border-slate-200 bg-slate-50/60',
                      iconWrap: 'bg-white text-slate-400 border-slate-200',
                      detailText: 'text-slate-600',
                    }

          return (
            <li
              key={step.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${style.card}`}
            >
              <span
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${style.iconWrap}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
                <p className={`mt-0.5 text-sm font-medium tabular-nums ${style.detailText}`}>
                  {step.detail}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

