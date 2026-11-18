import type { VerificationStatus } from '../types/merchantVerificationTypes'

interface VerificationStatusBadgeProps {
  status: VerificationStatus
  className?: string
}

export function VerificationStatusBadge({ status, className = '' }: VerificationStatusBadgeProps) {
  switch (status) {
    case 'VERIFIED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
          Đã xác thực
        </span>
      )
    case 'PENDING_REVIEW':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" aria-hidden="true" />
          Chờ duyệt
        </span>
      )
    case 'CHANGES_REQUESTED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20 ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-rose-600" aria-hidden="true" />
          Yêu cầu bổ sung
        </span>
      )
    case 'DRAFT':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/20 ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" aria-hidden="true" />
          Bản nháp
        </span>
      )
    case 'NOT_SUBMITTED':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/20 ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden="true" />
          Chưa nộp
        </span>
      )
  }
}
