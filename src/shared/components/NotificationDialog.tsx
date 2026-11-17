import { useEffect, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { Dialog } from './Dialog'
import { button } from './Workspace'

const tones = {
  success: { icon: CheckCircle2, style: 'bg-emerald-50 text-emerald-700' },
  error: { icon: AlertCircle, style: 'bg-rose-50 text-rose-700' },
  warning: { icon: TriangleAlert, style: 'bg-amber-50 text-amber-700' },
  info: { icon: Info, style: 'bg-sky-50 text-sky-700' },
}

/** Shared notification presentation; Dialog owns focus, Escape and backdrop dismissal. */
export function NotificationDialog({ title, message, variant = 'success', onClose, onAfterClose, children, actionLabel, duration }: {
  title: string
  message: string
  variant?: keyof typeof tones
  onClose: () => void
  onAfterClose?: () => void
  children?: ReactNode
  actionLabel?: string
  duration?: number
}) {
  useEffect(() => {
    if (!duration) return
    const timer = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timer)
  }, [duration, onClose])
  const { icon: Icon, style } = tones[variant]
  return <Dialog title={title} onClose={onClose} onAfterClose={onAfterClose} maxWidth="sm">
    <div className="space-y-5 text-center">
      <div className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${style}`}>
        <Icon size={32} aria-hidden="true" />
      </div>
      <p role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'} className="text-sm leading-7 text-brand-navy">{message}</p>
      {children}
      {actionLabel && <button type="button" className={`${button} w-full`} onClick={onClose}>{actionLabel}</button>}
    </div>
  </Dialog>
}
