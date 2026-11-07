import React, { useId } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      required,
      error,
      helperText,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      id: customId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = customId || generatedId

    const sizeStyles = {
      sm: 'h-8 text-xs px-3',
      md: 'h-10 text-sm px-3.5',
      lg: 'h-12 text-base px-4',
    }

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-slate-700 leading-none select-none"
          >
            {label}
            {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 shrink-0">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              'w-full bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 transition-all font-sans',
              'focus:outline-none focus:ring-2 focus:ring-[#d95f00]/20 focus:border-[#d95f00]',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900'
                : 'border-slate-200 hover:border-slate-300',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              sizeStyles[inputSize],
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400 shrink-0">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-rose-600 font-medium flex items-center gap-1.5 mt-1"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-slate-500 mt-1 leading-normal">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
