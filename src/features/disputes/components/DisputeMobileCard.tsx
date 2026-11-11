import { ArrowRight, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Dispute } from '@/entities/operations'
import type { DisputeBookingSummary } from '@/features/bookings'
import { Badge } from '@/shared/components/Workspace'
import { DisputeTimeDisplay } from './DisputeTimeDisplay'

export interface DisputeMobileCardProps {
  dispute: Dispute
  booking?: DisputeBookingSummary
  detailHref: string
}

export function DisputeMobileCard({ dispute, booking, detailHref }: DisputeMobileCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-sm font-bold text-slate-900 tabular-nums">KN-{dispute.id}</span>
          <p className="mt-0.5 text-sm text-slate-600 tabular-nums">
            #{dispute.bookingId}
            {booking?.bookingCode ? ` · ${booking.bookingCode}` : ''}
          </p>
        </div>
        <Badge value={dispute.status} size="sm" dot />
      </div>

      <h3 className="text-sm font-semibold text-slate-900 leading-snug">{dispute.reason}</h3>

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-sm">
        <div className="inline-flex items-start gap-2 text-slate-500">
          <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <DisputeTimeDisplay value={dispute.createdAt} />
        </div>

        <Link
          to={detailHref}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          <span>Chi tiết</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

