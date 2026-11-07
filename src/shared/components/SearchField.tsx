import React, { useState } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface SearchFieldProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onClear?: () => void
  placeholder?: string
  isSearching?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  autoFocus?: boolean
  id?: string
  'aria-label'?: string
}

export function SearchField({
  value: controlledValue,
  defaultValue = '',
  onChange,
  onSearch,
  onClear,
  placeholder = 'Tìm kiếm dữ liệu...',
  isSearching = false,
  className,
  size = 'md',
  autoFocus = false,
  id = 'search-field',
  'aria-label': ariaLabel = 'Tìm kiếm dữ liệu',
}: SearchFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (!isControlled) {
      setInternalValue(val)
    }
    onChange?.(val)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSearch?.(currentValue)
    }
  }

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('')
    }
    onChange?.('')
    onClear?.()
  }

  const sizeStyles = {
    sm: 'h-8 text-xs pl-8 pr-7',
    md: 'h-10 text-sm pl-10 pr-9',
    lg: 'h-12 text-base pl-12 pr-10',
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5 left-2.5',
    md: 'w-4 h-4 left-3.5',
    lg: 'w-5 h-5 left-4',
  }

  return (
    <div className={cn('relative flex items-center w-full', className)} role="search">
      <div
        className={cn(
          'absolute flex items-center pointer-events-none text-slate-400 shrink-0',
          iconSizes[size]
        )}
      >
        {isSearching ? (
          <Loader2 className="animate-spin text-brand-orange" aria-hidden="true" />
        ) : (
          <Search aria-hidden="true" />
        )}
      </div>

      <input
        id={id}
        type="search"
        autoFocus={autoFocus}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          'w-full bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 font-sans transition-all',
          'focus:outline-none focus:ring-2 focus:ring-[#d95f00]/20 focus:border-[#d95f00] hover:border-slate-300',
          sizeStyles[size]
        )}
      />

      {currentValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Xóa từ khóa tìm kiếm"
          className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#d95f00]/40 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
