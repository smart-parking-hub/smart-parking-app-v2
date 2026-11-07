import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon: React.ReactNode
  'aria-label': string
  tooltip?: string
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      disabled,
      icon,
      'aria-label': ariaLabel,
      tooltip,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary:
        'bg-[#d95f00] hover:bg-[#b84e00] active:bg-[#9e4300] text-white shadow-xs focus-visible:ring-[#d95f00]/40 active:scale-[0.97]',
      secondary:
        'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200 focus-visible:ring-slate-400 active:scale-[0.97]',
      outline:
        'bg-transparent hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-300 focus-visible:ring-slate-400 active:scale-[0.97]',
      ghost:
        'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 focus-visible:ring-slate-400 active:scale-[0.97]',
      danger:
        'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs focus-visible:ring-rose-500 active:scale-[0.97]',
    }

    const sizeStyles = {
      sm: 'w-8 h-8 rounded-lg text-xs',
      md: 'w-10 h-10 rounded-xl text-sm min-w-[40px] min-h-[40px]',
      lg: 'w-12 h-12 rounded-xl text-base min-w-[48px] min-h-[48px]',
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-label={ariaLabel}
        title={tooltip || ariaLabel}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none shrink-0',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent shrink-0"
            aria-hidden="true"
          />
        ) : (
          icon
        )}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
