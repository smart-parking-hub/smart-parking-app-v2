import React, { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../utils/cn'

export interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
  badge?: string
  description?: string
}

export interface SelectGroup {
  label?: string
  options: SelectOption[]
}

export interface SelectProps {
  value: string
  onChange: (value: string) => void
  options?: SelectOption[]
  groups?: SelectGroup[]
  placeholder?: string
  prefixIcon?: React.ReactNode
  className?: string
  triggerClassName?: string
  dropdownClassName?: string
  disabled?: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  triggerAriaHidden?: boolean
  id?: string
  variant?: 'subtle' | 'default' | 'solid'
  size?: 'sm' | 'md' | 'lg'
}

export function Select({
  value,
  onChange,
  options,
  groups,
  placeholder = 'Chọn một tùy chọn...',
  prefixIcon,
  className,
  triggerClassName,
  dropdownClassName,
  disabled = false,
  ariaLabel,
  ariaLabelledBy,
  triggerAriaHidden = false,
  id,
  variant = 'subtle',
  size = 'md',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoId = useId()
  const selectId = id || autoId

  // Normalize options into groups
  const allGroups: SelectGroup[] = groups || (options ? [{ options }] : [])
  const allOptions: SelectOption[] = allGroups.flatMap((g) => g.options)

  const selectedOption = allOptions.find((opt) => opt.value === value)

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle key down (Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (!isOpen) {
        e.preventDefault()
        setIsOpen(true)
      }
    }
  }

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

  // Variant styles for trigger
  const variantStyles = {
    subtle:
      'bg-[#eff4ff] border border-blue-100 hover:border-blue-200 text-[#0d1c2e] focus:ring-2 focus:ring-blue-500/20',
    default:
      'bg-white border border-slate-200 hover:border-slate-300 text-[#0d1c2e] focus:ring-2 focus:ring-[#d95f00]/20',
    solid:
      'bg-[#131b2e] border border-white/10 hover:border-white/20 text-white focus:ring-2 focus:ring-white/20',
  }[variant]

  const sizeStyles = {
    sm: 'h-8 px-2.5 text-xs rounded-lg gap-1.5',
    md: 'h-10 px-3 text-xs lg:text-sm rounded-xl gap-2',
    lg: 'h-12 px-4 text-sm lg:text-base rounded-xl gap-2.5',
  }[size]

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full select-none', className)}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden Native Select for Screen Readers, Testing Library and Form Compatibility */}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        tabIndex={-1}
        aria-label={id ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className="sr-only focus-visible:ring-2 focus-visible:ring-[#d95f00]"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {allGroups.map((group, gIdx) =>
          group.label ? (
            <optgroup key={gIdx} label={group.label}>
              {group.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ) : (
            group.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          ),
        )}
      </select>

      {/* Styled Interactive Trigger */}
      <button
        type="button"
        id={`${selectId}-trigger`}
        role={triggerAriaHidden ? undefined : 'combobox'}
        aria-hidden={triggerAriaHidden ? 'true' : undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={triggerAriaHidden ? undefined : ariaLabel}
        aria-labelledby={triggerAriaHidden ? undefined : ariaLabelledBy}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={cn(
          'w-full flex items-center justify-between font-semibold transition-all cursor-pointer outline-none shadow-xs',
          variantStyles,
          sizeStyles,
          disabled && 'opacity-50 cursor-not-allowed',
          triggerClassName,
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {prefixIcon}
          {selectedOption?.icon}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-[#d95f00]',
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className={cn(
            'absolute left-0 top-full mt-1.5 z-50 min-w-full w-max max-w-[420px] bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 overflow-hidden animate-in fade-in-0 zoom-in-95 max-h-72 overflow-y-auto',
            dropdownClassName,
          )}
        >
          {allGroups.map((group, gIdx) => (
            <div key={gIdx} className={cn(gIdx > 0 && 'border-t border-slate-100 mt-1 pt-1')}>
              {group.label && (
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                  {group.label}
                </div>
              )}
              {group.options.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs lg:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-orange-50 font-bold text-[#d95f00]'
                        : 'text-[#0d1c2e] hover:bg-[#eff4ff]',
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon}
                      <div className="truncate">
                        <span className="block truncate">{opt.label}</span>
                        {opt.description && (
                          <span className="text-[11px] text-slate-400 font-normal block truncate">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.badge && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-[#d95f00] shrink-0" />}
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
