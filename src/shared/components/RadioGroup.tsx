import React, { useId } from 'react'
import { cn } from '@/shared/utils/cn'

export interface RadioOption {
  label: string
  value: string
  description?: string
  badge?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  name: string
  options: RadioOption[]
  selectedValue?: string
  value?: string
  onChange?: (val: string) => void
  orientation?: 'horizontal' | 'vertical'
  label?: string
  error?: string
  className?: string
}

export function RadioGroup({
  name,
  options,
  selectedValue,
  value,
  onChange,
  orientation = 'vertical',
  label,
  error,
  className,
}: RadioGroupProps) {
  const currentVal = selectedValue !== undefined ? selectedValue : value

  return (
    <div className={cn('w-full space-y-2 text-left', className)} role="radiogroup" aria-label={label}>
      {label && (
        <span className="block text-sm font-semibold text-slate-700 leading-none select-none mb-1">
          {label}
        </span>
      )}

      <div
        className={cn(
          'flex gap-3',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
      >
        {options.map((option) => {
          const isSelected = currentVal === option.value
          const isDisabled = Boolean(option.disabled)

          return (
            <label
              key={option.value}
              className={cn(
                'relative flex items-start gap-3 p-3.5 rounded-xl border transition-all select-none',
                isDisabled
                  ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:border-slate-300 bg-white',
                isSelected
                  ? 'border-[#d95f00] ring-1 ring-[#d95f00] bg-orange-50/20'
                  : 'border-slate-200'
              )}
            >
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => onChange?.(option.value)}
                  className="sr-only peer"
                />
                <div
                  className={cn(
                    'w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-[#d95f00]/40 peer-focus-visible:ring-offset-1',
                    isSelected
                      ? 'border-[#d95f00] bg-white'
                      : 'border-slate-300 bg-white'
                  )}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#d95f00]" />
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn('text-sm font-medium', isSelected ? 'text-slate-900 font-semibold' : 'text-slate-800')}>
                    {option.label}
                  </span>
                  {option.badge && (
                    <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-[#d95f00]">
                      {option.badge}
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                    {option.description}
                  </p>
                )}
              </div>
            </label>
          )
        })}
      </div>

      {error && (
        <p role="alert" className="text-xs text-rose-600 font-medium mt-1">
          {error}
        </p>
      )}
    </div>
  )
}

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode
  description?: string
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, checked, disabled, id: customId, ...props }, ref) => {
    const generatedId = useId()
    const radioId = customId || generatedId

    return (
      <label
        htmlFor={radioId}
        className={cn(
          'inline-flex items-start gap-2.5 select-none transition-colors group',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          className
        )}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            checked={checked}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all bg-white',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-[#d95f00]/40 peer-focus-visible:ring-offset-1',
              checked ? 'border-[#d95f00]' : 'border-slate-300 group-hover:border-slate-400'
            )}
          >
            {checked && <div className="w-2.5 h-2.5 rounded-full bg-[#d95f00]" />}
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col text-left">
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
    )
  }
)

Radio.displayName = 'Radio'
