import React from 'react'
import { FolderOpen } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType
  title: string
  description?: string
  action?: React.ReactNode
  variant?: 'card' | 'dashed' | 'plain'
}

export function EmptyState({
  className,
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  variant = 'dashed',
  ...props
}: EmptyStateProps) {
  const variantStyles = {
    dashed: 'border border-dashed border-slate-300 bg-slate-50/50 rounded-2xl',
    card: 'border border-slate-200 bg-white rounded-2xl shadow-xs',
    plain: 'border-none bg-transparent',
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 lg:p-12',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 mb-4 shadow-xs">
        <Icon className="h-7 w-7 text-slate-600" aria-hidden="true" />
      </div>
      <h4 className="text-base font-bold text-slate-900 mb-1.5">{title}</h4>
      {description && <p className="text-sm text-slate-600 max-w-md mb-5 leading-relaxed">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

