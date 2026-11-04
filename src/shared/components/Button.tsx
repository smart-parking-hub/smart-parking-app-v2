import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary:
        'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-sm focus-visible:ring-[#F97316]',
      secondary:
        'bg-[#0F172A] hover:bg-[#1E293B] text-slate-200 border border-[#1E3A5F] focus-visible:ring-slate-400',
      outline:
        'bg-transparent hover:bg-slate-100 text-slate-800 border border-slate-300 focus-visible:ring-slate-400',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-700 focus-visible:ring-slate-400',
      danger:
        'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-600',
    }

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 rounded',
      md: 'text-sm px-5 py-2.5 rounded-lg',
      lg: 'text-base px-7 py-3.5 rounded-lg font-semibold',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

