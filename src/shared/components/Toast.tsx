import React, { useEffect } from 'react'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id?: string
  title: string
  message?: string
  variant?: ToastVariant
  duration?: number
  onClose?: () => void
  className?: string
}

const variantStyles: Record<
  ToastVariant,
  {
    wrapper: string
    iconBg: string
    iconText: string
    icon: React.ComponentType<{ className?: string }>
  }
> = {
  success: {
    wrapper: 'border-emerald-200 bg-emerald-50/95 text-emerald-950',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-700',
    icon: CheckCircle2,
  },
  error: {
    wrapper: 'border-rose-200 bg-rose-50/95 text-rose-950',
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-700',
    icon: AlertCircle,
  },
  warning: {
    wrapper: 'border-amber-200 bg-amber-50/95 text-amber-950',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-700',
    icon: AlertTriangle,
  },
  info: {
    wrapper: 'border-sky-200 bg-sky-50/95 text-sky-950',
    iconBg: 'bg-sky-100',
    iconText: 'text-sky-700',
    icon: Info,
  },
}

export function Toast({
  title,
  message,
  variant = 'info',
  duration = 5000,
  onClose,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!duration || duration <= 0 || !onClose) return

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const { wrapper, iconBg, iconText, icon: IconComponent } = variantStyles[variant]

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-xs transition-all w-full max-w-sm sm:max-w-md animate-in slide-in-from-top-2 duration-200',
        wrapper,
        className
      )}
    >
      <div className={cn('p-1 rounded-xl shrink-0 mt-0.5', iconBg)}>
        <IconComponent className={cn('w-4 h-4', iconText)} />
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <h5 className="text-sm font-semibold leading-tight">{title}</h5>
        {message && <p className="text-xs opacity-90 mt-1 leading-relaxed break-words">{message}</p>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng thông báo"
          className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
