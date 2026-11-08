import { CheckCircle2, Truck, ArrowRight } from 'lucide-react'
import type { TimelineVehicleItem } from '../types/queueTypes'

interface QueueTimelineFlowProps {
  items?: TimelineVehicleItem[]
  status: 'WAITING' | 'NOTIFIED' | 'CONVERTED' | 'EXPIRED' | 'CANCELLED'
}

export function QueueTimelineFlow({ items, status }: QueueTimelineFlowProps) {
  if (!items || items.length === 0) return null

  return (
    <div className="pt-1">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-slate-700" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Tiến trình điều phối thực tế (ALPR Pipeline)
          </h4>
        </div>
        <span className="text-xs font-medium text-slate-500">
          {status === 'NOTIFIED' ? 'Đã cấp slot trống' : 'Xếp hàng tự động'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 relative">
        {items.map((item, idx) => {
          const isUser = item.isUser
          const isPast = item.isPast

          return (
            <div
              key={item.id}
              className={`relative rounded-xl p-3 border transition-all bg-white border-slate-200 shadow-2xs ${
                isPast ? 'text-slate-600' : 'text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isUser
                      ? 'bg-brand-primary text-white'
                      : isPast
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.label}
                </span>

                {isPast ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isUser ? (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary" />
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">#{(idx + 1).toString().padStart(2, '0')}</span>
                )}
              </div>

              <div className="font-mono font-bold text-sm text-slate-900 tracking-wide mb-0.5">
                {item.plate}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {item.statusText}
              </p>

              {idx < items.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
