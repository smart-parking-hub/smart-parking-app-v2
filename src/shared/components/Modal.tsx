import React, { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useDialogLifecycle } from './useDialogLifecycle'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
  ariaLabelledBy?: string
  returnFocusRef?: React.RefObject<HTMLElement | null>
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = 'md',
  closeOnBackdrop = true,
  ariaLabelledBy,
  returnFocusRef,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  useDialogLifecycle(dialogRef, isOpen, undefined, undefined, returnFocusRef)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !isOpen || e.defaultPrevented) return
      const dialogs = document.querySelectorAll('dialog[open]')
      if (dialogs[dialogs.length - 1] === dialogRef.current) {
        e.preventDefault()
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-4xl',
  }

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy ?? (title ? titleId : undefined)}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={event => { event.preventDefault(); onClose() }}
      className="fixed inset-0 z-50 m-0 hidden h-dvh max-h-none w-full max-w-none items-center justify-center border-0 p-4 bg-slate-900/60 backdrop-blur-xs backdrop:bg-transparent open:flex animate-in fade-in duration-200"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={cn(
          'relative w-full rounded-2xl bg-white p-6 shadow-2xl transition-all border border-slate-200 text-slate-800 max-h-[92vh] overflow-y-auto',
          maxWidthStyles[maxWidth],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng cửa sổ"
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] cursor-pointer"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {title && (
          <div className="mb-4 pr-8">
            <h3 id={titleId} className="text-lg font-bold text-slate-900 leading-tight">{title}</h3>
            {description && <p id={descriptionId} className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>}
          </div>
        )}

        {children}
      </div>
    </dialog>
  )
}

