import React from 'react'
import { FolderOpen } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Spinner } from './Spinner'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'

export interface LoadingPanelProps {
  message?: string
  description?: string
  className?: string
  minHeight?: string
}

export function LoadingPanel({
  message = 'Đang tải dữ liệu...',
  description,
  className,
  minHeight = 'min-h-[240px]',
}: LoadingPanelProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-slate-200/80 bg-white shadow-2xs',
        minHeight,
        className
      )}
    >
      <Spinner size="lg" variant="primary" className="mb-3" />
      <h5 className="text-sm font-semibold text-slate-800">{message}</h5>
      {description && <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>}
    </div>
  )
}

export interface EmptyDataPanelProps {
  icon?: React.ElementType
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyDataPanel({
  icon = FolderOpen,
  title = 'Không có dữ liệu',
  description = 'Chưa có bản ghi nào được ghi nhận trong danh mục này.',
  action,
  className,
}: EmptyDataPanelProps) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      action={action}
      variant="card"
      className={className}
    />
  )
}

export interface ErrorRecoveryPanelProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryText?: string
  isRetrying?: boolean
  errorDetail?: string | Error
  className?: string
}

export function ErrorRecoveryPanel({
  title,
  description,
  onRetry,
  retryText,
  isRetrying,
  errorDetail,
  className,
}: ErrorRecoveryPanelProps) {
  return (
    <ErrorState
      title={title}
      description={description}
      onRetry={onRetry}
      retryText={retryText}
      isRetrying={isRetrying}
      errorDetail={errorDetail}
      variant="card"
      className={className}
    />
  )
}
