import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  onRetry?: () => void
  retryText?: string
  isRetrying?: boolean
  errorDetail?: string | Error
  variant?: 'card' | 'dashed' | 'plain'
}

export function ErrorState({
  title = 'Đã có lỗi xảy ra',
  description = 'Không thể tải dữ liệu hoặc xử lý yêu cầu. Vui lòng thử lại sau giây lát.',
  onRetry,
  retryText = 'Thử lại',
  isRetrying = false,
  errorDetail,
  variant = 'card',
  className,
  ...props
}: ErrorStateProps) {
  const variantStyles = {
    card: 'border border-rose-200 bg-rose-50/30 rounded-2xl p-8 shadow-xs',
    dashed: 'border border-dashed border-rose-300 bg-rose-50/20 rounded-2xl p-8',
    plain: 'border-none bg-transparent p-4',
  }

  const detailString =
    typeof errorDetail === 'string'
      ? errorDetail
      : errorDetail instanceof Error
        ? errorDetail.message
        : undefined

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center max-w-lg mx-auto',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-xs">
        <AlertCircle className="w-7 h-7" aria-hidden="true" />
      </div>

      <h4 className="text-base font-bold text-slate-900 mb-1.5">{title}</h4>
      <p className="text-sm text-slate-600 mb-5 leading-relaxed">{description}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover active:bg-brand-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
        >
          <RefreshCw className={cn('w-4 h-4', isRetrying && 'animate-spin')} aria-hidden="true" />
          <span>{isRetrying ? 'Đang tải lại...' : retryText}</span>
        </button>
      )}

      {detailString && (
        <details className="mt-4 w-full text-left">
          <summary className="text-xs text-rose-600 hover:text-rose-700 cursor-pointer font-medium text-center">
            Chi tiết kỹ thuật
          </summary>
          <pre className="mt-2 p-3 bg-white border border-rose-200 rounded-xl text-xs text-rose-800 font-mono overflow-x-auto whitespace-pre-wrap">
            {detailString}
          </pre>
        </details>
      )}
    </div>
  )
}
