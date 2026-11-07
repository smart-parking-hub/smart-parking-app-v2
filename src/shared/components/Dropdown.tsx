import React, { createContext, useContext, useState, useRef, useEffect, useId } from 'react'
import { cn } from '@/shared/utils/cn'

interface DropdownContextType {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  close: () => void
  menuId: string
}

const DropdownContext = createContext<DropdownContextType | null>(null)

export interface DropdownProps {
  children: React.ReactNode
  className?: string
}

export function Dropdown({ children, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

  const close = () => setIsOpen(false)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        close()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, close, menuId }}>
      <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export interface DropdownTriggerProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

export function DropdownTrigger({ children, className }: DropdownTriggerProps) {
  const context = useContext(DropdownContext)
  if (!context) throw new Error('DropdownTrigger must be used within Dropdown')

  const { isOpen, setIsOpen, menuId } = context

  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={menuId}
      onClick={() => setIsOpen((prev) => !prev)}
      className={cn('inline-flex items-center justify-center cursor-pointer', className)}
    >
      {children}
    </button>
  )
}

export interface DropdownContentProps {
  children: React.ReactNode
  align?: 'left' | 'right'
  className?: string
  width?: string
}

export function DropdownContent({
  children,
  align = 'right',
  className,
  width = 'w-56',
}: DropdownContentProps) {
  const context = useContext(DropdownContext)
  if (!context) throw new Error('DropdownContent must be used within Dropdown')

  const { isOpen, menuId } = context
  if (!isOpen) return null

  return (
    <div
      id={menuId}
      role="menu"
      className={cn(
        'absolute z-50 mt-2 rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 focus:outline-none',
        align === 'right' ? 'right-0' : 'left-0',
        width,
        className
      )}
    >
      {children}
    </div>
  )
}

export interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
  icon?: React.ReactNode
  variant?: 'default' | 'danger'
  disabled?: boolean
  className?: string
}

export function DropdownItem({
  children,
  onClick,
  icon,
  variant = 'default',
  disabled = false,
  className,
}: DropdownItemProps) {
  const context = useContext(DropdownContext)
  if (!context) throw new Error('DropdownItem must be used within Dropdown')

  const handleClick = () => {
    if (disabled) return
    onClick?.()
    context.close()
  }

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg font-medium transition-colors cursor-pointer select-none',
        variant === 'default'
          ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          : 'text-rose-600 hover:bg-rose-50 hover:text-rose-700',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 text-left">{children}</span>
    </button>
  )
}

export function DropdownSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cn('h-px bg-slate-100 my-1', className)} />
}
