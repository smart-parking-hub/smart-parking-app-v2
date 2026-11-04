import React from 'react'
import { cn } from '@/shared/utils/cn'

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-800/60', className)}
      aria-hidden="true"
      {...props}
    />
  )
}
