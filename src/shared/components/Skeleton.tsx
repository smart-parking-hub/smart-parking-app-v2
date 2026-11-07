import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular' | 'card' | 'table'
  rows?: number
}

export function Skeleton({ className, variant = 'default', rows = 3, ...props }: SkeletonProps) {
  if (variant === 'circular') {
    return (
      <div
        className={cn('animate-pulse rounded-full bg-slate-200/70 shrink-0', className)}
        aria-hidden="true"
        {...props}
      />
    )
  }

  if (variant === 'text') {
    return (
      <div
        className={cn('animate-pulse h-4 rounded-md bg-slate-200/70 w-full', className)}
        aria-hidden="true"
        {...props}
      />
    )
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'animate-pulse rounded-2xl bg-white border border-slate-200 p-5 space-y-4',
          className
        )}
        aria-hidden="true"
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="h-5 w-1/3 bg-slate-200 rounded-md" />
          <div className="h-4 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-slate-100 rounded-md" />
          <div className="h-4 w-1/2 bg-slate-100 rounded-md" />
        </div>
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div
        className={cn(
          'animate-pulse rounded-2xl bg-white border border-slate-200 p-4 space-y-3',
          className
        )}
        aria-hidden="true"
        {...props}
      >
        <div className="h-9 w-full bg-slate-100 rounded-lg" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 w-full bg-slate-50 border border-slate-100 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200/70', className)}
      aria-hidden="true"
      {...props}
    />
  )
}
