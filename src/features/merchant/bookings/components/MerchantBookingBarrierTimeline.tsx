import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  DoorOpen,
  History,
  Info,
  LogOut,
  ShieldAlert,
} from 'lucide-react'
import { Panel } from '@/shared/components/Workspace'
import type {
  BarrierTimelineDeltaTone,
  BarrierTimelineEvent,
  BarrierTimelineEventTone,
  BookingBarrierSummary,
} from '../types/merchantBookingsTypes'

interface MerchantBookingBarrierTimelineProps {
  summary: BookingBarrierSummary
}

const toneCircleStyles: Record<BarrierTimelineEventTone, string> = {
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  current: 'border-sky-200 bg-sky-50 text-sky-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  upcoming: 'border-slate-200 bg-slate-50 text-slate-500',
}

const toneLineStyles: Record<BarrierTimelineEventTone, string> = {
  completed: 'bg-emerald-200',
  current: 'bg-sky-200',
  warning: 'bg-amber-200',
  danger: 'bg-rose-200',
  upcoming: 'bg-slate-200',
}

const deltaBadgeStyles: Record<BarrierTimelineDeltaTone, string> = {
  neutral: 'border-slate-200 bg-slate-100 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
}

function renderEventIcon(event: BarrierTimelineEvent) {
  switch (event.category) {
    case 'GATE_IN':
      return <DoorOpen className="h-4 w-4" aria-hidden="true" />
    case 'GATE_OUT':
      return <LogOut className="h-4 w-4" aria-hidden="true" />
    case 'HOLD':
      return <CreditCard className="h-4 w-4" aria-hidden="true" />
    case 'CANCELLED':
      return <ShieldAlert className="h-4 w-4" aria-hidden="true" />
    case 'PARKING':
      return event.tone === 'danger' ? (
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Clock className="h-4 w-4" aria-hidden="true" />
      )
    case 'SETTLEMENT':
      return event.tone === 'completed' ? (
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Clock className="h-4 w-4" aria-hidden="true" />
      )
    default:
      return <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
  }
}

export function MerchantBookingBarrierTimeline({
  summary,
}: MerchantBookingBarrierTimelineProps) {
  const {
    events,
    parkingDurationLabel,
    plannedDurationLabel,
    checkInVarianceLabel,
    checkOutVarianceLabel,
  } = summary

  const hasSummaryChips = Boolean(
    parkingDurationLabel ||
      plannedDurationLabel ||
      checkInVarianceLabel ||
      checkOutVarianceLabel,
  )

  return (
    <Panel className="shadow-2xs">
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-orange-200/80 bg-orange-50 text-[#d95f00]">
            <History className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-sora text-lg font-semibold text-brand-navy">
              Nhật ký Barie &amp; Tiến trình Vận hành
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-brand-muted">
              Theo dõi thứ tự các mốc tạo đơn, xác nhận cọc, check-in/check-out qua barie và quyết toán.
            </p>
          </div>
        </div>
      </div>

      {hasSummaryChips && (
        <div
          data-testid="barrier-timeline-metrics"
          className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {plannedDurationLabel && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
              <p className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
                Thời lượng đặt
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-900">
                {plannedDurationLabel}
              </p>
            </div>
          )}
          {parkingDurationLabel && (
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-3 py-2.5">
              <p className="font-mono text-[11px] uppercase tracking-wide text-emerald-700">
                Lưu bãi thực tế
              </p>
              <p className="mt-1 text-xs font-semibold text-emerald-950">
                {parkingDurationLabel}
              </p>
            </div>
          )}
          {checkInVarianceLabel && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
              <p className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
                Chênh lệch vào bãi
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-900">
                {checkInVarianceLabel}
              </p>
            </div>
          )}
          {checkOutVarianceLabel && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
              <p className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
                Chênh lệch ra bãi
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-900">
                {checkOutVarianceLabel}
              </p>
            </div>
          )}
        </div>
      )}

      <ol
        aria-label="Tiến trình nhật ký barie và trạng thái đơn"
        className="space-y-0"
      >
        {events.map((event, index) => {
          const isLast = index === events.length - 1
          return (
            <li
              key={event.id}
              data-testid={`barrier-event-${event.id}`}
              className="relative flex gap-3.5 pb-5 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${toneCircleStyles[event.tone]}`}
                >
                  {renderEventIcon(event)}
                </span>
                {!isLast && (
                  <span
                    className={`mt-1.5 w-0.5 flex-1 rounded-full ${toneLineStyles[event.tone]}`}
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {event.title}
                    </h3>
                    {event.deltaBadge && (
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${deltaBadgeStyles[event.deltaBadge.tone]}`}
                      >
                        {event.deltaBadge.label}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    {event.timeMetaLabel && (
                      <span className="mr-1.5 text-[11px] font-medium text-slate-500">
                        {event.timeMetaLabel}:
                      </span>
                    )}
                    <time className="font-mono text-xs font-semibold tabular-nums text-slate-700">
                      {event.timestampLabel}
                    </time>
                  </div>
                </div>

                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {event.description}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <div
        role="note"
        className="mt-5 flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs leading-relaxed text-slate-600"
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
        <p>
          Nhật ký được tổng hợp trực tiếp từ các mốc thời gian xác thực của đơn đặt chỗ trên{' '}
          <span className="font-mono font-medium text-slate-700">Booking Service</span>. Dữ liệu
          lượt quét QR thất bại nhiều lần hoặc ảnh camera ALPR sẽ bổ sung khi có API log phần cứng.
        </p>
      </div>
    </Panel>
  )
}

