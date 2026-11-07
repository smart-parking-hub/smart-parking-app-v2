import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface FormLayoutProps extends React.FormHTMLAttributes<HTMLFormElement> {
  columns?: 1 | 2 | 3
  gap?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function FormLayout({
  columns = 2,
  gap = 'md',
  children,
  footer,
  className,
  ...props
}: FormLayoutProps) {
  const columnStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }

  const gapStyles = {
    sm: 'gap-3',
    md: 'gap-4 md:gap-5',
    lg: 'gap-6',
  }

  return (
    <form className={cn('space-y-6', className)} {...props}>
      <div className={cn('grid', columnStyles[columns], gapStyles[gap])}>{children}</div>

      {footer && (
        <div className="flex flex-wrap items-center justify-end gap-3 pt-5 border-t border-slate-100">
          {footer}
        </div>
      )}
    </form>
  )
}
