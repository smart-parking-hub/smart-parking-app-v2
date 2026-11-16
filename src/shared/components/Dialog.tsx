import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface DialogProps {
  isOpen?: boolean
  onClose: () => void
  onAfterClose?: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
}

export function Dialog({
  isOpen = true,
  onClose,
  onAfterClose,
  title,
  description,
  children,
  className,
  maxWidth = 'md',
  closeOnBackdrop = true,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descId = useId()
  const afterClose = useRef(onAfterClose)
  useEffect(() => { afterClose.current = onAfterClose }, [onAfterClose])

  useEffect(() => {
    const element = dialogRef.current
    const previous = document.activeElement
    const previousOverflow = document.body.style.overflow

    if (isOpen && element) {
      if (typeof element.showModal === 'function' && !element.open) {
        try {
          element.showModal()
        } catch {
          element.setAttribute('open', '')
        }
      } else {
        element.setAttribute('open', '')
      }
      document.body.style.overflow = 'hidden'
    }

    return () => {
      if (isOpen) document.body.style.overflow = previousOverflow
      if (element) {
        if (typeof element.close === 'function' && element.open) {
          try {
            element.close()
          } catch {
            element.removeAttribute('open')
          }
        } else {
          element.removeAttribute('open')
        }
      }
      if (previous instanceof HTMLElement && previous !== document.body && previous.isConnected) {
        const target = previous.matches(':disabled')
          ? previous.closest('form')?.querySelector<HTMLElement>('input:not(:disabled), select:not(:disabled), button:not(:disabled)')
          : previous
        target?.focus()
      }
      if (isOpen) afterClose.current?.()
    }
  }, [isOpen])

  if (!isOpen) return null

  const maxWidthStyles = {
    sm: 'w-[min(95vw,420px)]',
    md: 'w-[min(95vw,640px)]',
    lg: 'w-[min(95vw,800px)]',
    xl: 'w-[min(95vw,1024px)]',
    full: 'w-[min(95vw,1200px)]',
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === dialogRef.current) {
          onClose()
        }
      }}
      className={cn(
        'm-auto max-h-[88vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-xs animate-in fade-in duration-200',
        maxWidthStyles[maxWidth],
        className
      )}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 id={titleId} className="font-sora text-xl font-semibold text-slate-900">
            {title}
          </h2>
          {description && (
            <p id={descId} className="text-sm text-slate-500 mt-1">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div className="text-slate-700">{children}</div>
    </dialog>
  )
}
