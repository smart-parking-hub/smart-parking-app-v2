import React, { useId } from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  label?: React.ReactNode
  description?: string
  error?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked = false,
      indeterminate = false,
      onChange,
      label,
      description,
      error,
      disabled = false,
      id: customId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const checkboxId = customId || generatedId

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return
      onChange?.(e.target.checked)
    }

    const ariaCheckedState = indeterminate ? 'mixed' : checked

    return (
      <div className={cn('inline-flex flex-col gap-1 text-left', className)}>
        <label
          htmlFor={checkboxId}
          className={cn(
            'inline-flex items-start gap-2.5 select-none transition-colors group',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          )}
        >
          <div className="relative flex items-center justify-center shrink-0 mt-0.5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={handleChange}
              aria-checked={ariaCheckedState}
              aria-invalid={Boolean(error)}
              className="sr-only peer"
              {...props}
            />

            <div
              className={cn(
                'w-5 h-5 rounded-md border flex items-center justify-center transition-all',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-[#d95f00]/40 peer-focus-visible:ring-offset-1',
                checked || indeterminate
                  ? 'bg-[#d95f00] border-[#d95f00] text-white'
                  : 'bg-white border-slate-300 group-hover:border-slate-400',
                error && !checked && !indeterminate && 'border-rose-400',
                disabled && 'bg-slate-100 border-slate-200'
              )}
            >
              {checked && !indeterminate && (
                <Check className="w-3.5 h-3.5 stroke-[3] text-white" aria-hidden="true" />
              )}
              {indeterminate && (
                <Minus className="w-3.5 h-3.5 stroke-[3] text-white" aria-hidden="true" />
              )}
            </div>
          </div>

          {(label || description) && (
            <div className="flex flex-col">
              {label && (
                <span className="text-sm font-medium text-slate-800 leading-tight">
                  {label}
                </span>
              )}
              {description && (
                <span className="text-xs text-slate-500 mt-0.5 leading-normal">
                  {description}
                </span>
              )}
            </div>
          )}
        </label>

        {error && (
          <p role="alert" className="text-xs text-rose-600 font-medium pl-7">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
