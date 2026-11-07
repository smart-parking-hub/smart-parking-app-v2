import React, { useId } from 'react'
import { cn } from '@/shared/utils/cn'

export interface SwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  isLoading?: boolean
  size?: 'sm' | 'md'
  id?: string
  className?: string
  name?: string
}

export function Switch({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  isLoading = false,
  size = 'md',
  id: customId,
  className,
  name,
}: SwitchProps) {
  const generatedId = useId()
  const switchId = customId || generatedId

  const handleToggle = () => {
    if (disabled || isLoading) return
    onChange?.(!checked)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleToggle()
    }
  }

  const trackSizes = {
    sm: 'w-8 h-4.5 p-0.5',
    md: 'w-11 h-6 p-0.5',
  }

  const thumbSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
  }

  const translateSizes = {
    sm: checked ? 'translate-x-3.5' : 'translate-x-0',
    md: checked ? 'translate-x-5' : 'translate-x-0',
  }

  return (
    <div className={cn('inline-flex items-start gap-3 select-none text-left', className)}>
      <button
        id={switchId}
        type="button"
        role="switch"
        name={name}
        aria-checked={checked}
        aria-busy={isLoading}
        disabled={disabled || isLoading}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00]/40 focus-visible:ring-offset-2',
          checked ? 'bg-[#d95f00]' : 'bg-slate-300 hover:bg-slate-400',
          (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
          trackSizes[size]
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-xs transform ring-0 transition duration-200 ease-in-out flex items-center justify-center',
            thumbSizes[size],
            translateSizes[size]
          )}
        >
          {isLoading && (
            <span
              className="h-2.5 w-2.5 animate-spin rounded-full border border-slate-400 border-t-transparent"
              aria-hidden="true"
            />
          )}
        </span>
      </button>

      {(label || description) && (
        <label
          htmlFor={switchId}
          onClick={handleToggle}
          className={cn(
            'flex flex-col',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          )}
        >
          {label && (
            <span className="text-sm font-semibold text-slate-800 leading-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 mt-0.5 leading-normal">
              {description}
            </span>
          )}
        </label>
      )}
    </div>
  )
}
