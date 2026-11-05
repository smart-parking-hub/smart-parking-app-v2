import React from 'react'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  action?: React.ReactNode
}

export function Alert({
  className,
  variant = 'info',
  title,
  action,
  children,
  ...props
}: AlertProps) {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  }

  const styles = {
    info: 'bg-blue-50 text-blue-900 border-blue-200 [&>svg]:text-blue-600',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200 [&>svg]:text-emerald-600',
    warning: 'bg-amber-50 text-amber-900 border-amber-200 [&>svg]:text-amber-600',
    error: 'bg-rose-50 text-rose-900 border-rose-200 [&>svg]:text-rose-600',
  }

  const Icon = icons[variant]

  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4 flex items-start gap-3 text-sm',
        styles[variant],
        className
      )}
      {...props}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-1 leading-none tracking-tight">{title}</h5>}
        <div className="text-sm opacity-90 leading-relaxed">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

