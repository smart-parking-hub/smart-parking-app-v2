import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Check, ChevronDown, Clock3, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/Popover'
import { control } from '@/shared/components/Workspace'

interface Props {
  day: string
  value: string
  times: string[]
  unavailableTimes?: Readonly<Record<string,string>>
  emptyLabel: string
  onChange: (time: string) => void
  onRefresh: () => void
}
const periods = [
  { label: 'Đêm / sáng sớm', from: 0, to: 6 },
  { label: 'Buổi sáng', from: 6, to: 12 },
  { label: 'Buổi chiều', from: 12, to: 18 },
  { label: 'Buổi tối', from: 18, to: 24 },
]

export function BookingArrivalPicker({ day, value, times, emptyLabel, onChange, onRefresh, unavailableTimes = {} }: Props) {
  const [open, setOpen] = useState(false)
  const [focusedTime, setFocusedTime] = useState(value)
  const [side, setSide] = useState<'top' | 'bottom'>('bottom')
  const [scrollHeight, setScrollHeight] = useState(240)
  const trigger = useRef<HTMLButtonElement>(null)
  const choices = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const id = useId()
  const disabled = times.length === 0
  const selected = times.includes(value) ? value : ''
  const firstTime = times.find(time => !unavailableTimes[time])
  const focusTarget = selected && !unavailableTimes[selected] ? selected : firstTime

  useEffect(() => {
    if (!open) return
    if (disabled) { setOpen(false); return }
    const target = focusTarget ? choices.current?.querySelector<HTMLButtonElement>(`[data-time="${focusTarget}"]`) : null
    setFocusedTime(focusTarget || '')
    if (target) target.focus({ preventScroll: true })
    else closeButton.current?.focus({ preventScroll: true })
    const viewport = choices.current
    if (target && viewport && viewport.clientHeight > 0) {
      const top = target.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop
      if (top < viewport.scrollTop) viewport.scrollTop = top
      else if (top + target.offsetHeight > viewport.scrollTop + viewport.clientHeight) viewport.scrollTop = top + target.offsetHeight - viewport.clientHeight
    }
  }, [open, disabled, focusTarget])

  const close = () => { setOpen(false); trigger.current?.focus({ preventScroll: true }) }
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, time: string) => {
    const index = times.indexOf(time)
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 4, ArrowUp: -4 }
    let next = event.key === 'Home' ? 0 : event.key === 'End' ? times.length - 1 :
      event.key in moves ? index + moves[event.key] : undefined
    if (next === undefined) return
    event.preventDefault()
    const step = event.key === 'Home' ? 1 : event.key === 'End' ? -1 : moves[event.key]
    while (next >= 0 && next < times.length && unavailableTimes[times[next]]) next += step
    if (next < 0 || next >= times.length) return
    setFocusedTime(times[next])
    choices.current?.querySelector<HTMLButtonElement>(`[data-time="${times[next]}"]`)?.focus()
  }
  const measure = () => {
    onRefresh()
    const rect = trigger.current?.getBoundingClientRect()
    if (!rect) return
    const dialog = trigger.current?.closest('[aria-modal="true"], dialog')?.getBoundingClientRect()
    const above = rect.top - Math.max(12, dialog?.top ?? 12)
    const below = Math.min(window.innerHeight - 12, dialog?.bottom ?? window.innerHeight - 12) - rect.bottom
    const nextSide = below < 320 && above > below ? 'top' : 'bottom'
    setSide(nextSide)
    setScrollHeight(Math.max(80, Math.min(240, (nextSide === 'top' ? above : below) - 112)))
  }

  return <div className="min-w-0 space-y-2" onBlur={event => {
    if (open && !event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }} onKeyDownCapture={event => {
    if (open && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close() }
  }}>
    <label id={`${id}-label`} htmlFor={id} className="text-sm font-medium">Giờ vào dự kiến</label>
    <Popover open={open} onOpenChange={setOpen} className="block w-full">
      <PopoverTrigger asChild>
        <button ref={trigger} id={id} type="button" disabled={disabled} aria-labelledby={`${id}-label`} aria-describedby={`${id}-value`}
          onClick={measure} onFocus={onRefresh}
          className={`${control} flex min-h-12 cursor-pointer items-center justify-between gap-3 text-left hover:border-brand-primary disabled:cursor-not-allowed`}>
          <span className="flex min-w-0 items-center gap-2.5"><Clock3 size={18} aria-hidden="true" className="shrink-0 text-brand-primary"/><span id={`${id}-value`} className={`truncate ${selected ? 'font-semibold tabular-nums' : 'text-xs text-brand-muted'}`}>{selected || emptyLabel}</span></span>
          <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-brand-muted transition-transform ${open ? 'rotate-180' : ''}`}/>
        </button>
      </PopoverTrigger>
      <PopoverContent side={side} ariaLabel="Chọn giờ vào dự kiến" className="w-full min-w-0 max-w-sm overflow-hidden p-0">
        <header className="flex items-start justify-between gap-2 border-b border-brand-border px-3 py-3">
          <div><h3 className="text-sm font-semibold">Chọn giờ vào</h3><p className="mt-1 text-[11px] text-brand-muted">{day.split('-').reverse().join('/')} · Giờ Việt Nam</p></div>
          <button ref={closeButton} type="button" aria-label="Đóng bảng giờ" onClick={close} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-brand-muted hover:bg-brand-surface focus-visible:outline-2 focus-visible:outline-brand-primary"><X size={16} aria-hidden="true"/></button>
        </header>
        <div ref={choices} role="group" aria-label="Giờ vào khả dụng" className="space-y-3 overflow-y-auto overscroll-contain p-3" style={{ maxHeight: scrollHeight }}>
          {!firstTime && <p className="text-xs leading-5 text-brand-muted">Ngày này không còn giờ trống. Hãy chọn ngày khác.</p>}
          {periods.map(period => {
            const values = times.filter(time => Number(time.slice(0, 2)) >= period.from && Number(time.slice(0, 2)) < period.to)
            if (!values.length) return null
            return <div key={period.label} className="space-y-2"><h4 className="text-[11px] font-medium text-brand-muted">{period.label}</h4><div className="grid grid-cols-4 gap-1.5">
              {values.map(time => <button key={time} type="button" data-time={time} aria-pressed={time === selected}
                disabled={Boolean(unavailableTimes[time])} aria-label={unavailableTimes[time] ? `${time} · ${unavailableTimes[time]}` : time}
                tabIndex={time === focusedTime ? 0 : -1} onFocus={() => setFocusedTime(time)} onKeyDown={event => navigate(event, time)}
                onClick={() => { if (!unavailableTimes[time]) { onChange(time); close() } }}
                className={`relative flex min-h-11 min-w-0 flex-col items-center justify-center rounded-lg border px-0.5 py-1 text-xs font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-primary ${unavailableTimes[time] ? 'cursor-not-allowed border-brand-border bg-slate-100 text-slate-500' : time === selected ? 'border-brand-primary bg-brand-primary text-white' : 'border-brand-border bg-white text-brand-navy hover:border-brand-primary hover:bg-orange-50'}`}>
                <span>{time}</span>{unavailableTimes[time] && <span className="mt-0.5 text-[9px] font-normal leading-3">{unavailableTimes[time]}</span>}{time === selected && !unavailableTimes[time] && <Check size={10} aria-hidden="true" className="absolute right-0.5 top-0.5"/>}
              </button>)}
            </div></div>
          })}
        </div>
        <p className="border-t border-brand-border bg-brand-surface px-3 py-2 text-[10px] text-brand-muted">Giờ hết chỗ hoặc có khoảng đệm không chọn được · Mũi tên để di chuyển, Enter để chọn</p>
      </PopoverContent>
    </Popover>
  </div>
}
