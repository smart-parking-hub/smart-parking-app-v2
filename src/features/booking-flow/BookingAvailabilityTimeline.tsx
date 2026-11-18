import { CalendarDays, Columns3, LayoutGrid } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Notice, secondary } from '@/shared/components/Workspace'
import type { ScheduleAvailability } from './availability'
import { bookingDayOffset, bookingTimestamp } from './time'

interface Props {
  data?: ScheduleAvailability
  loading: boolean
  error?: string
  start: string
  end: string
  onSelect: (start: string) => void
  onRetry: () => void
  disabled?: boolean
  hasMore?: boolean
  loadingMore?: boolean
  onLoadNext?: () => void
}

const viewOptions = [
  { value: 'grid', label: 'Lưới', icon: LayoutGrid },
  { value: 'row', label: 'Hàng ngang', icon: Columns3 },
] as const

const legend = [
  { label: 'Có thể đặt', color: 'bg-emerald-600' },
  { label: 'Hết chỗ', color: 'bg-red-600' },
  { label: 'Khoảng đệm', color: 'bg-amber-500' },
  { label: 'Đã qua', color: 'bg-slate-400' },
  { label: 'Khung đã chọn', color: 'border-2 border-brand-primary' },
]

export function BookingAvailabilityTimeline({
  data, loading, error, start, end, onSelect, onRetry, disabled = false,
  hasMore = false, loadingMore = false, onLoadNext,
}: Props) {
  const [view, setView] = useState<(typeof viewOptions)[number]['value']>('grid')
  const track = useRef<HTMLDivElement>(null)
  const firstBlockStart = loading || error ? undefined : data?.blocks[0]?.start
  const isGrid = view === 'grid'

  useEffect(() => {
    const viewport = track.current
    const selected = viewport?.querySelector<HTMLElement>('[data-selection-start="true"]')
    if (!viewport || !selected) return

    // Keep the selected start visible without scrolling the surrounding form.
    viewport.scrollTop = isGrid ? selected.offsetTop - (viewport.clientHeight - selected.offsetHeight) / 2 : 0
    viewport.scrollLeft = isGrid ? 0 : selected.offsetLeft - (viewport.clientWidth - selected.offsetWidth) / 2
  }, [start, firstBlockStart, isGrid])

  if (error) return <Notice error><p>{error}</p><button type="button" className={secondary} onClick={onRetry}>Tải lại lịch trống</button></Notice>
  if (loading || !data) return <p role="status">Đang tải lịch trống…</p>

  const lastBlock = data.blocks.at(-1)
  const startDate = start.slice(0, 10).split('-').reverse().join('/')
  const lastDate = lastBlock?.start.slice(0, 10).split('-').reverse().join('/')
  const startTime = bookingTimestamp(start)
  const endTime = bookingTimestamp(end)
  const now = Date.now()

  return (
    <section aria-label="Lịch đặt theo block 30 phút" className="@container min-w-0 space-y-3 rounded-xl border border-brand-border bg-white p-3 sm:p-4">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-primary-subtle text-brand-primary-hover">
            <CalendarDays aria-hidden="true" className="size-4.5" />
          </span>
          <div>
            <h3 className="font-semibold">{data.allocationMode === 'PHYSICAL' ? 'Lịch chỗ đỗ' : 'Lịch sức chứa'}</h3>
            <p className="text-xs leading-5 text-brand-muted">
              {startDate}{lastDate && lastDate !== startDate ? ` – ${lastDate}` : ''} · Mỗi ô 30 phút
            </p>
          </div>
        </div>
        <div role="group" aria-label="Kiểu hiển thị lịch" className="inline-flex rounded-xl border border-brand-border bg-brand-surface p-0.5 @max-sm:w-full">
          {viewOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={view === value}
              disabled={disabled}
              onClick={() => setView(value)}
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-xs font-semibold text-brand-muted enabled:hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:opacity-60 aria-pressed:bg-white aria-pressed:text-brand-navy aria-pressed:shadow-xs"
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </header>

      <ul aria-label="Chú thích lịch" className="flex flex-wrap gap-x-3 gap-y-1.5 border-t border-brand-border pt-3 text-xs text-brand-muted">
        {legend.map(({ label, color }) => (
          <li key={label} className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className={`size-2.5 rounded-full ${color}`} />
            {label}
          </li>
        ))}
      </ul>

      {data.blocks.length === 0 ? (
        <p role="status" className="rounded-lg bg-brand-surface px-3 py-4 text-sm text-brand-muted">Chưa có khung giờ để hiển thị.</p>
      ) : (
        <div
          ref={track}
          className={`relative min-w-0 rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-brand-primary ${isGrid ? 'max-h-72 overflow-y-auto' : 'overflow-x-auto pb-2'}`}
          tabIndex={0}
          role="region"
          aria-label={isGrid ? 'Lịch dạng lưới' : 'Cuộn ngang để xem lịch'}
        >
          <div className={`grid gap-2 ${isGrid ? 'grid-cols-[repeat(auto-fill,minmax(4.75rem,1fr))]' : 'w-max grid-flow-col auto-cols-[5.25rem]'}`}>
            {data.blocks.map(block => {
              const blockTime = bookingTimestamp(block.start)
              const selected = blockTime >= startTime && blockTime < endTime
              const past = block.status === 'PAST' || blockTime <= now
              const unavailable = block.remainingCapacity === 0
              const buffer = block.status === 'BUFFER'
              const label = past ? 'Đã qua' : buffer ? 'Đệm 30p' : unavailable ? 'Hết chỗ' : `${block.remainingCapacity} chỗ`
              const color = past ? 'border-slate-200 bg-slate-100 text-slate-600'
                : buffer ? 'border-amber-200 bg-amber-50 text-amber-900'
                : unavailable ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-emerald-200 bg-emerald-50 text-emerald-900 enabled:hover:bg-emerald-100'
              const extraDays = bookingDayOffset(start, block.start)
              const dateLabel = block.start.slice(0, 10).split('-').reverse().join('/')
              const dayLabel = extraDays > 0 ? ` (+${extraDays} ngày, ${dateLabel})` : ''

              return (
                <button
                  key={block.start}
                  type="button"
                  disabled={disabled || past || unavailable}
                  aria-pressed={selected}
                  data-selection-start={blockTime === startTime}
                  aria-label={`${block.start.slice(11, 16)} đến ${block.end.slice(11, 16)}${dayLabel}: ${label}`}
                  onClick={() => onSelect(block.start.slice(0, 16))}
                  className={`flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-lg border px-1 py-2 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${color} aria-pressed:ring-2 aria-pressed:ring-inset aria-pressed:ring-brand-primary`}
                >
                  <span className="text-sm font-semibold tabular-nums">{block.start.slice(11, 16)}</span>
                  {extraDays > 0 && <span className="text-[10px] tabular-nums">{dateLabel}</span>}
                  <span>{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {hasMore && onLoadNext && <button type="button" className={secondary} disabled={disabled || loadingMore} onClick={onLoadNext}>{loadingMore ? 'Đang tải ngày tiếp theo…' : 'Xem ngày tiếp theo'}</button>}
      <p className="border-t border-brand-border pt-2.5 text-xs leading-5 text-brand-muted">
        Số chỗ đã tính khoảng đệm 30 phút. Hệ thống kiểm tra lại toàn bộ thời gian đỗ trước khi giữ chỗ.
      </p>
    </section>
  )
}
