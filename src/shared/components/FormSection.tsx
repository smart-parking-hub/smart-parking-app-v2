import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface FormSectionProps {
  title?: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  borderBottom?: boolean
}

export function FormSection({
  title,
  description,
  action,
  children,
  className,
  borderBottom = true,
}: FormSectionProps) {
  return (
    <div
      className={cn(
        'space-y-4 py-5',
        borderBottom && 'border-b border-slate-100 last:border-b-0',
        className
      )}
    >
      {(title || description || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && (
              <h3 className="font-sora text-base font-semibold text-slate-900 leading-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  )
}
