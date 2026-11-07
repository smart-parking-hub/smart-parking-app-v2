import { useId } from 'react'
import { Calendar, AlertCircle } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface DatePickerProps {
  value?: string
  onChange?: (date: string) => void
  label?: string
  min?: string
  max?: string
  placeholder?: string
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  className?: string
  id?: string
  'aria-label'?: string
}

export function DatePicker({
  value,
  onChange,
  label,
  min,
  max,
  placeholder = 'Chọn ngày...',
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  id: customId,
  'aria-label': ariaLabel,
}: DatePickerProps) {
  const autoId = useId()
  const inputId = customId || autoId

  return (
    <div className={cn('w-full space-y-1.5 text-left', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-700 leading-none select-none"
        >
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 shrink-0">
          <Calendar className="w-4 h-4" aria-hidden="true" />
        </div>

        <input
          id={inputId}
          type="date"
          value={value}
          min={min}
          max={max}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={ariaLabel || label || placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            'w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 h-10 text-sm text-slate-900 font-sans transition-all',
            'focus:outline-none focus:ring-2 focus:ring-[#d95f00]/20 focus:border-[#d95f00] hover:border-slate-300',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
          )}
        />
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-xs text-rose-600 font-medium flex items-center gap-1.5 mt-1"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-xs text-slate-500 mt-1 leading-normal">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export interface DateRangePickerProps {
  startDate?: string
  endDate?: string
  onChange?: (range: { startDate: string; endDate: string }) => void
  onStartDateChange?: (date: string) => void
  onEndDateChange?: (date: string) => void
  label?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function DateRangePicker({
  startDate = '',
  endDate = '',
  onChange,
  onStartDateChange,
  onEndDateChange,
  label,
  error,
  disabled = false,
  className,
}: DateRangePickerProps) {
  const handleStartChange = (val: string) => {
    onStartDateChange?.(val)
    onChange?.({ startDate: val, endDate })
  }

  const handleEndChange = (val: string) => {
    onEndDateChange?.(val)
    onChange?.({ startDate, endDate: val })
  }

  return (
    <div className={cn('w-full space-y-1.5 text-left', className)}>
      {label && (
        <span className="block text-sm font-semibold text-slate-700 leading-none select-none">
          {label}
        </span>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <DatePicker
          value={startDate}
          max={endDate || undefined}
          onChange={handleStartChange}
          disabled={disabled}
          placeholder="Từ ngày"
          aria-label="Từ ngày"
        />
        <span className="text-slate-400 font-medium text-sm hidden sm:inline">—</span>
        <DatePicker
          value={endDate}
          min={startDate || undefined}
          onChange={handleEndChange}
          disabled={disabled}
          placeholder="Đến ngày"
          aria-label="Đến ngày"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs text-rose-600 font-medium flex items-center gap-1.5 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
