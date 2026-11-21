import { useId, useRef, type ReactNode, type RefObject } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useDialogLifecycle } from './useDialogLifecycle'

export interface DialogProps {
  isOpen?: boolean
  onClose: () => void
  onAfterClose?: () => void
  initialFocusRef?: RefObject<HTMLElement | null>
  title: string
  description?: string
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
  footer?: ReactNode
}

export function Dialog({
  isOpen = true,
  onClose,
  onAfterClose,
  initialFocusRef,
  title,
  description,
  children,
  className,
  maxWidth = 'md',
  closeOnBackdrop = true,
  footer,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descId = useId()
  useDialogLifecycle(dialogRef, isOpen, initialFocusRef, onAfterClose)
  const hasFooter = footer != null

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
        'm-auto max-h-[88vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-xs animate-in fade-in duration-200',
        maxWidthStyles[maxWidth],
        hasFooter && 'hidden flex-col overflow-hidden p-0 open:flex',
        className
      )}
    >
      <div className={cn('mb-5 flex items-start justify-between gap-4', hasFooter && 'mb-0 shrink-0 p-6 pb-5')}>
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="font-sora text-xl font-semibold text-slate-900 break-words">
            {title}
          </h2>
          {description && (
            <p id={descId} className="text-sm text-slate-500 mt-1 break-words">
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

      <div className={cn('text-slate-700', hasFooter && 'min-h-0 overflow-y-auto px-6 pb-6')}>{children}</div>
      {hasFooter && <div className="shrink-0 border-t border-slate-200 bg-white p-6">{footer}</div>}
    </dialog>
  )
}
