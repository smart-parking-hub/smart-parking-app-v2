import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

export function Separator({
  orientation = 'horizontal',
  label,
  className,
  ...props
}: SeparatorProps) {
  if (label && orientation === 'horizontal') {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn('relative flex items-center w-full my-4', className)}
        {...props}
      >
        <div className="flex-grow border-t border-slate-200" />
        <span className="flex-shrink mx-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-grow border-t border-slate-200" />
      </div>
    )
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'bg-slate-200 shrink-0',
        orientation === 'horizontal' ? 'h-px w-full my-3' : 'w-px h-full min-h-[1em] mx-3 inline-block',
        className
      )}
      {...props}
    />
  )
}
