import React, { createContext, useContext, useState, useRef, useEffect, useId, useCallback } from 'react'
import { cn } from '@/shared/utils/cn'

interface PopoverContextType {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  close: () => void
  popoverId: string
}

const PopoverContext = createContext<PopoverContextType | null>(null)

export interface PopoverProps {
  children: React.ReactNode
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Popover({ children, className, open: controlledOpen, onOpenChange }: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen
  const popoverId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

  const setIsOpen = (next: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof next === 'function' ? next(isOpen) : next
    if (!isControlled) {
      setInternalOpen(nextVal)
    }
    onOpenChange?.(nextVal)
  }

  const close = useCallback(() => {
    if (!isControlled) {
      setInternalOpen(false)
    }
    onOpenChange?.(false)
  }, [isControlled, onOpenChange])

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
  }, [isOpen, close])

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen, close, popoverId }}>
      <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

export interface PopoverTriggerProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

export function PopoverTrigger({ children, className, asChild = false }: PopoverTriggerProps) {
  const context = useContext(PopoverContext)
  if (!context) throw new Error('PopoverTrigger must be used within Popover')

  const { isOpen, setIsOpen, popoverId } = context

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<{
      onClick?: React.MouseEventHandler
      'aria-haspopup'?: string
      'aria-expanded'?: boolean
      'aria-controls'?: string
    }>
    return React.cloneElement(childElement, {
      onClick: (e: React.MouseEvent) => {
        childElement.props.onClick?.(e)
        handleClick(e)
      },
      'aria-haspopup': 'dialog',
      'aria-expanded': isOpen,
      'aria-controls': popoverId,
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={popoverId}
      className={cn('inline-flex items-center cursor-pointer', className)}
    >
      {children}
    </button>
  )
}

export interface PopoverContentProps {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom'
}

export function PopoverContent({
  children,
  className,
  align = 'start',
  side = 'bottom',
}: PopoverContentProps) {
  const context = useContext(PopoverContext)
  if (!context) throw new Error('PopoverContent must be used within Popover')

  const { isOpen, popoverId } = context
  if (!isOpen) return null

  const sideStyles = {
    bottom: 'top-full mt-2',
    top: 'bottom-full mb-2',
  }

  const alignStyles = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  }

  return (
    <div
      id={popoverId}
      role="dialog"
      aria-modal="false"
      className={cn(
        'absolute z-50 rounded-2xl border border-slate-200/90 bg-white p-4 text-slate-800 shadow-xl outline-none animate-in fade-in zoom-in-95 duration-150',
        sideStyles[side],
        alignStyles[align],
        className
      )}
    >
      {children}
    </div>
  )
}
