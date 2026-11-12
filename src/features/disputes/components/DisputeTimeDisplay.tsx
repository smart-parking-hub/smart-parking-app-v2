import { disputeTimeParts } from '../api/driverDisputesApi'

export interface DisputeTimeDisplayProps {
  value: string | null | undefined
  align?: 'left' | 'right' | 'responsive-right'
  className?: string
  timeClassName?: string
  dateClassName?: string
}

export function DisputeTimeDisplay({
  value,
  align = 'left',
  className = '',
  timeClassName = 'text-sm font-medium text-slate-900',
  dateClassName = 'text-xs text-slate-500',
}: DisputeTimeDisplayProps) {
  const parts = disputeTimeParts(value)
  if (!parts) {
    return <span className={className}>—</span>
  }

  const alignClass =
    align === 'right'
      ? 'text-right'
      : align === 'responsive-right'
        ? 'text-left sm:text-right'
        : 'text-left'

  return (
    <div className={`space-y-0.5 tabular-nums leading-tight ${alignClass} ${className}`}>
      <p className={timeClassName}>{parts.time}</p>
      <p className={dateClassName}>{parts.date}</p>
    </div>
  )
}

