import React from 'react'
import { FolderOpen } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  className,
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed border-slate-300 bg-slate-50/50',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 mb-1">{title}</h4>
      {description && <p className="text-sm text-slate-500 max-w-sm mb-4 leading-relaxed">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

