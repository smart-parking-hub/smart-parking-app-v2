import React, { useId } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
  isRequired?: boolean
  error?: string
  helperText?: string
  showCount?: boolean
  maxLength?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      required,
      isRequired,
      error,
      helperText,
      id: customId,
      disabled,
      readOnly,
      maxLength,
      showCount = false,
      value,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const textareaId = customId || generatedId
    const isFieldRequired = Boolean(required || isRequired)

    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full space-y-1.5 text-left">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-sm font-semibold text-slate-700 leading-none select-none"
            >
              {label}
              {isFieldRequired && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
            </label>
          )}

          {showCount && maxLength && (
            <span className="text-xs text-slate-400 font-mono">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          className={cn(
            'w-full bg-white border rounded-xl p-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all font-sans',
            'focus:outline-none focus:ring-2 focus:ring-[#d95f00]/20 focus:border-[#d95f00]',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200',
            'read-only:bg-slate-50/80 read-only:cursor-default read-only:border-slate-200',
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900'
              : 'border-slate-200 hover:border-slate-300',
            className
          )}
          {...props}
        />

        {error ? (
          <p
            id={`${textareaId}-error`}
            role="alert"
            className="text-xs text-rose-600 font-medium flex items-center gap-1.5 mt-1"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={`${textareaId}-helper`} className="text-xs text-slate-500 mt-1 leading-normal">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
