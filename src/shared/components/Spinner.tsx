import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'white' | 'slate'
  label?: string
}

export function Spinner({
  size = 'md',
  variant = 'primary',
  label = 'Đang tải...',
  className,
  ...props
}: SpinnerProps) {
  const sizeStyles = {
    xs: 'w-3 h-3 border-[1.5px]',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  const variantStyles = {
    primary: 'border-[#d95f00] border-t-transparent',
    white: 'border-white border-t-transparent',
    slate: 'border-slate-500 border-t-transparent',
  }

  return (
    <span
      role="status"
      className={cn(
        'inline-block animate-spin rounded-full shrink-0',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </span>
  )
}
