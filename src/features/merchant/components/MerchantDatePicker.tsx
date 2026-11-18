import { useEffect, useMemo, useRef, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface MerchantDatePickerProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hasError?: boolean
  ariaDescribedBy?: string
  className?: string
}

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const

const MONTH_NAMES = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
] as const

function parseIsoDate(raw: string): Date | null {
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null
  const [y, m, d] = raw.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null
  }
  return date
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDisplayDate(raw: string): string {
  const parsed = parseIsoDate(raw)
  if (!parsed) return ''
  const d = String(parsed.getDate()).padStart(2, '0')
  const m = String(parsed.getMonth() + 1).padStart(2, '0')
  return `${d}/${m}/${parsed.getFullYear()}`
}

export function MerchantDatePicker({
  id,
  label,
  value,
  onChange,
  placeholder = 'dd/mm/yyyy',
  hasError = false,
  ariaDescribedBy,
  className,
}: MerchantDatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const selectedDate = useMemo(() => parseIsoDate(value), [value])
  const todayIso = useMemo(() => toIsoDate(new Date()), [])

  const [viewMonth, setViewMonth] = useState(() => {
    const base = selectedDate ?? new Date()
    return { year: base.getFullYear(), month: base.getMonth() }
  })

  useEffect(() => {
    if (selectedDate) {
      setViewMonth({
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth(),
      })
    }
  }, [selectedDate])

  useEffect(() => {
    if (!isOpen) return
    const handleOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(viewMonth.year, viewMonth.month, 1)
    // Convert Sunday=0..Saturday=6 into Monday=0..Sunday=6
    const startOffset = (firstOfMonth.getDay() + 6) % 7
    const startDate = new Date(viewMonth.year, viewMonth.month, 1 - startOffset)
    return Array.from({ length: 42 }, (_, idx) => {
      const date = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + idx,
      )
      return {
        iso: toIsoDate(date),
        day: date.getDate(),
        inCurrentMonth: date.getMonth() === viewMonth.month,
      }
    })
  }, [viewMonth.year, viewMonth.month])

  const shiftMonth = (delta: number) => {
    setViewMonth((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  const displayText = formatDisplayDate(value)

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex flex-col min-w-0 shrink-0 gap-2 text-sm font-medium w-full sm:w-[190px]',
        className,
      )}
    >
      <label htmlFor={id}>{label}</label>

      {/* Hidden native date input keeps form / Testing Library getByLabelText compatibility */}
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        aria-invalid={hasError}
        aria-describedby={ariaDescribedBy}
        className="sr-only"
      />

      {/* Styled interactive trigger with crisp hover state */}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={`Chọn ${label.toLowerCase()}`}
          className={cn(
            'group flex h-[44px] w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 text-sm font-medium shadow-2xs transition-all cursor-pointer outline-none',
            hasError
              ? 'border-rose-400 text-rose-900 hover:border-rose-500 focus-visible:ring-2 focus-visible:ring-rose-500/20'
              : isOpen
                ? 'border-[#d95f00] bg-orange-50/20 text-[#0d1c2e] ring-2 ring-[#d95f00]/20'
                : 'border-slate-200 text-[#0d1c2e] hover:border-[#d95f00] hover:bg-orange-50/30 hover:shadow-xs focus-visible:border-[#d95f00] focus-visible:ring-2 focus-visible:ring-[#d95f00]/20',
          )}
        >
          <span
            className={cn(
              'truncate tabular-nums',
              displayText ? 'font-semibold text-[#0d1c2e]' : 'text-slate-400 font-normal',
            )}
          >
            {displayText || placeholder}
          </span>
          <Calendar
            className={cn(
              'h-4 w-4 shrink-0 transition-colors',
              isOpen
                ? 'text-[#d95f00]'
                : 'text-slate-400 group-hover:text-[#d95f00]',
            )}
            aria-hidden="true"
          />
        </button>

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange('')
            }}
            aria-label={`Xóa ${label.toLowerCase()}`}
            className="absolute right-9 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-orange-100 hover:text-[#d95f00] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Custom Branded Calendar Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={`Lịch chọn ${label.toLowerCase()}`}
          className="absolute left-0 top-full z-50 mt-2 w-[292px] rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Tháng trước"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#d95f00]/40 hover:bg-orange-50 hover:text-[#d95f00] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            <span className="font-sora text-sm font-bold text-[#0d1c2e]">
              {MONTH_NAMES[viewMonth.month]} {viewMonth.year}
            </span>

            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Tháng sau"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#d95f00]/40 hover:bg-orange-50 hover:text-[#d95f00] cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mb-1.5 grid grid-cols-7 text-center">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="py-1 font-mono text-[11px] font-bold text-slate-400"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell) => {
              const isSelected = value === cell.iso
              const isToday = cell.iso === todayIso
              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => {
                    onChange(cell.iso)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'flex h-8 w-full items-center justify-center rounded-lg text-xs font-medium tabular-nums transition-all cursor-pointer',
                    isSelected
                      ? 'bg-[#d95f00] font-bold text-white shadow-xs hover:bg-[#b84e00]'
                      : cell.inCurrentMonth
                        ? isToday
                          ? 'bg-orange-50 font-bold text-[#d95f00] ring-1 ring-[#d95f00]/40 hover:bg-orange-100'
                          : 'text-[#0d1c2e] hover:bg-orange-50 hover:text-[#d95f00]'
                        : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600',
                  )}
                >
                  {cell.day}
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
            <button
              type="button"
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
              className="rounded-lg px-2.5 py-1 font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              Xóa
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(todayIso)
                setIsOpen(false)
              }}
              className="rounded-lg px-2.5 py-1 font-semibold text-[#d95f00] transition-colors hover:bg-orange-50 cursor-pointer"
            >
              Hôm nay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
