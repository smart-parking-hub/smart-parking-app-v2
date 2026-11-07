import React, { useId, useState } from 'react'
import { AlertCircle, Eye, EyeOff, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  isRequired?: boolean
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
  onClear?: () => void
  showPasswordToggle?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      required,
      isRequired,
      error,
      helperText,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      id: customId,
      disabled,
      readOnly,
      type = 'text',
      value,
      onChange,
      onClear,
      showPasswordToggle = false,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = customId || generatedId
    const isFieldRequired = Boolean(required || isRequired)
    const [showPassword, setShowPassword] = useState(false)

    const isPasswordType = type === 'password'
    const computedType = isPasswordType && showPassword ? 'text' : type

    const sizeStyles = {
      sm: 'h-8 text-xs px-3',
      md: 'h-10 text-sm px-3.5',
      lg: 'h-12 text-base px-4 min-h-[44px]',
    }

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-slate-700 leading-none select-none"
          >
            {label}
            {isFieldRequired && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
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
            type={computedType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              'w-full bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 transition-all font-sans',
              'focus:outline-none focus:ring-2 focus:ring-[#d95f00]/20 focus:border-[#d95f00]',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200',
              'read-only:bg-slate-50/80 read-only:cursor-default read-only:border-slate-200',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900'
                : 'border-slate-200 hover:border-slate-300',
              leftIcon && 'pl-10',
              (rightIcon || (isPasswordType && showPasswordToggle) || (onClear && value)) && 'pr-10',
              sizeStyles[inputSize],
              className
            )}
            {...props}
          />

          {/* Interactive Trailing Actions: Clear button or Password visibility */}
          {onClear && value && !disabled && !readOnly ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="Xóa nội dung nhập"
              className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#d95f00]/40"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : isPasswordType && showPasswordToggle ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#d95f00]/40"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400 shrink-0">
              {rightIcon}
            </div>
          ) : null}
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
