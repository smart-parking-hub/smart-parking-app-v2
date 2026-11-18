import { Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import type { VerificationHistory } from '../types/merchantVerificationTypes'
import { getVerificationItemLabel } from '../merchantVerificationLabels'

interface VerificationHistoryTimelineProps {
  history: VerificationHistory[]
}

function actionDetails(action: string) {
  switch (action) {
    case 'SUBMITTED':
      return {
        label: 'Gửi hồ sơ xét duyệt',
        icon: <Clock className="h-4 w-4 text-blue-600" />,
        badgeClass: 'bg-blue-50 text-blue-700',
      }
    case 'CHANGES_REQUESTED':
      return {
        label: 'Yêu cầu bổ sung hồ sơ',
        icon: <AlertTriangle className="h-4 w-4 text-rose-600" />,
        badgeClass: 'bg-rose-50 text-rose-700',
      }
    case 'APPROVED':
      return {
        label: 'Phê duyệt hồ sơ',
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
        badgeClass: 'bg-emerald-50 text-emerald-700',
      }
    default:
      return {
        label: action,
        icon: <Calendar className="h-4 w-4 text-slate-500" />,
        badgeClass: 'bg-slate-50 text-slate-700',
      }
  }
}

export function VerificationHistoryTimeline({ history }: VerificationHistoryTimelineProps) {
  if (!history || history.length === 0) return null

  return (
    <div className="rounded-xl border border-brand-border bg-white p-4">
      <h4 className="text-sm font-semibold text-brand-navy mb-4">Lịch sử thẩm định hồ sơ</h4>
      <div className="flow-root">
        <ul className="-mb-6">
          {history.map((event, eventIdx) => {
            const { label, icon, badgeClass } = actionDetails(event.action)
            const dateStr = event.occurredAt
              ? new Date(event.occurredAt).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '—'

            return (
              <li key={`${event.submissionVersion}-${eventIdx}`} className="relative pb-6">
                {eventIdx !== history.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-brand-border"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 ring-4 ring-white">
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
                        Phiên bản {event.submissionVersion} · {label}
                      </span>
                      <time className="text-xs text-brand-muted tabular-nums">{dateStr}</time>
                    </div>

                    {event.actor && <p className="mt-2 text-xs text-brand-muted">{event.actor}</p>}

                    {event.note && (
                      <p className="mt-2 text-xs text-brand-navy/90 bg-brand-surface/60 p-2.5 rounded-lg border border-brand-border/60">
                        {event.note}
                      </p>
                    )}

                    {event.items && event.items.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium text-rose-700">Các mục cần bổ sung:</p>
                        <ul className="list-disc pl-4 text-xs text-brand-navy/90 space-y-0.5">
                          {event.items.map((item, i) => (
                            <li key={i}>
                              <span className="font-semibold">{getVerificationItemLabel(item.key)}:</span> {item.reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
