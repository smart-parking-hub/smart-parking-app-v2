import React from 'react'
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import { cn } from '@/shared/utils/cn'

export type ConfirmationVariant = 'primary' | 'danger' | 'warning'

export interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: React.ReactNode
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  variant?: ConfirmationVariant
  className?: string
}

const variantConfig: Record<
  ConfirmationVariant,
  {
    icon: React.ComponentType<{ className?: string }>
    iconBg: string
    iconText: string
    buttonVariant: 'primary' | 'danger' | 'secondary'
  }
> = {
  primary: {
    icon: HelpCircle,
    iconBg: 'bg-orange-50 border-orange-200',
    iconText: 'text-brand-primary',
    buttonVariant: 'primary',
  },
  danger: {
    icon: AlertCircle,
    iconBg: 'bg-rose-50 border-rose-200',
    iconText: 'text-rose-600',
    buttonVariant: 'danger',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-50 border-amber-200',
    iconText: 'text-amber-600',
    buttonVariant: 'primary',
  },
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isLoading = false,
  variant = 'primary',
  className,
}: ConfirmationDialogProps) {
  const { icon: IconComponent, iconBg, iconText, buttonVariant } = variantConfig[variant]

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" className={className}>
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={cn(
            'w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 shadow-2xs',
            iconBg
          )}
        >
          <IconComponent className={cn('w-6 h-6', iconText)} />
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{title}</h3>

        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          {message}
        </div>

        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>

          <Button
            variant={buttonVariant}
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export interface DestructiveActionDialogProps
  extends Omit<ConfirmationDialogProps, 'variant'> {
  confirmPhrase?: string
}

export function DestructiveActionDialog(props: DestructiveActionDialogProps) {
  return <ConfirmationDialog {...props} variant="danger" confirmText={props.confirmText || 'Xóa bỏ'} />
}
