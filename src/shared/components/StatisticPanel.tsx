import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface StatisticTrend {
  value: number | string
  label?: string
  isPositive?: boolean
}

export interface StatisticPanelProps {
  label: string
  value: React.ReactNode
  icon?: React.ElementType
  trend?: StatisticTrend
  note?: string
  variant?: 'default' | 'primary' | 'dark'
  className?: string
}

export function StatisticPanel({
  label,
  value,
  icon: IconComponent,
  trend,
  note,
  variant = 'default',
  className,
}: StatisticPanelProps) {
  const variantStyles = {
    default: 'bg-white border-slate-200/90 text-slate-800 shadow-2xs',
    primary: 'bg-orange-50/60 border-orange-200 text-slate-900 shadow-2xs',
    dark: 'bg-[#0d1c2e] border-slate-800 text-white shadow-md',
  }

  const labelStyles = {
    default: 'text-slate-500',
    primary: 'text-orange-950/80',
    dark: 'text-slate-400',
  }

  const iconWrapperStyles = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-orange-100 text-brand-primary',
    dark: 'bg-slate-800 text-orange-400',
  }

  return (
    <div
      className={cn(
        'rounded-2xl border p-5 transition-all flex flex-col justify-between',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className={cn('text-xs font-medium tracking-wide uppercase', labelStyles[variant])}>
          {label}
        </p>

        {IconComponent && (
          <div className={cn('p-2 rounded-xl shrink-0', iconWrapperStyles[variant])}>
            <IconComponent className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
      </div>

      <div>
        <p className="font-sora text-2xl sm:text-3xl font-bold tracking-tight tabular-nums mb-1.5 break-words">
          {value}
        </p>

        {(trend || note) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {trend && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 font-semibold rounded-md px-1.5 py-0.5',
                  trend.isPositive !== false
                    ? 'text-emerald-700 bg-emerald-100/80'
                    : 'text-rose-700 bg-rose-100/80'
                )}
              >
                {trend.isPositive !== false ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {typeof trend.value === 'number' && trend.value > 0 ? `+${trend.value}%` : `${trend.value}%`}
                </span>
              </span>
            )}

            {(trend?.label || note) && (
              <span className={cn('text-xs', labelStyles[variant])}>
                {trend?.label || note}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
