import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export type DrawerPlacement = 'right' | 'left' | 'bottom'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  placement?: DrawerPlacement
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop?: boolean
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  placement = 'right',
  className,
  size = 'md',
  closeOnBackdrop = true,
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeStyles = {
    right: {
      sm: 'max-w-xs',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-2xl',
    },
    left: {
      sm: 'max-w-xs',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-2xl',
    },
    bottom: {
      sm: 'max-h-[40vh]',
      md: 'max-h-[60vh]',
      lg: 'max-h-[80vh]',
      xl: 'max-h-[90vh]',
    },
  }

  const placementContainerStyles = {
    right: 'justify-end',
    left: 'justify-start',
    bottom: 'items-end',
  }

  const placementPanelStyles = {
    right: 'h-full border-l border-slate-200 animate-in slide-in-from-right duration-300',
    left: 'h-full border-r border-slate-200 animate-in slide-in-from-left duration-300',
    bottom: 'w-full rounded-t-3xl border-t border-slate-200 animate-in slide-in-from-bottom duration-300',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        'fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-xs',
        placementContainerStyles[placement]
      )}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={cn(
          'relative flex flex-col w-full bg-white text-slate-800 shadow-2xl overflow-hidden',
          placementPanelStyles[placement],
          sizeStyles[placement][size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-slate-100 p-5 shrink-0">
            <div>
              {title && <h3 className="text-lg font-bold text-slate-900 leading-tight">{title}</h3>}
              {description && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng bảng"
              className="rounded-xl p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {footer && <div className="border-t border-slate-100 p-4 bg-slate-50/70 shrink-0">{footer}</div>}
      </div>
    </div>
  )
}
