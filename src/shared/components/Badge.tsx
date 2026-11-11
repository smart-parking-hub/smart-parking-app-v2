import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'outline'
    | 'orange'
    | 'neutral'
    | 'plate'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  hasDot?: boolean
  value?: unknown
}

const statusDictionary: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  PENDING_APPROVAL: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  SUSPENDED: 'Tạm dừng',
  PAID: 'Đã chi',
  OPEN: 'Chờ xử lý',
  IN_REVIEW: 'Đang xem xét',
  RESOLVED: 'Đã giải quyết',
  ACTIVE: 'Hoạt động',
  BANNED: 'Đã khóa',
  PARKING: 'Đang đỗ',
  COMPLETED: 'Hoàn tất',
  PENDING_PAYMENT: 'Chờ thanh toán',
  PENDING_CHECKIN: 'Chờ vào bãi',
  CANCELLED: 'Đã hủy',
  OVERTIME: 'Quá giờ',
  SUCCESS: 'Thành công',
  HOLD: 'Đang giữ slot',
}

export function Badge({
  className,
  variant,
  size = 'md',
  dot = false,
  hasDot = false,
  value,
  children,
  ...props
}: BadgeProps) {
  // If `value` prop is provided (Workspace compatibility mode)
  let resolvedVariant = variant || 'default'
  let displayContent = children

  if (value !== undefined) {
    const text = String(value ?? '—')
    displayContent = children ?? (statusDictionary[text] || text)

    if (!variant) {
      if (/APPROVED|ACTIVE|COMPLETED|SUCCESS|PAID|RESOLVED/.test(text)) {
        resolvedVariant = 'success'
      } else if (/REJECT|BANNED|CANCEL|OVERTIME|SUSPENDED|FAIL/.test(text)) {
        resolvedVariant = 'danger'
      } else if (/IN_REVIEW/.test(text)) {
        resolvedVariant = 'info'
      } else if (/PENDING|OPEN|HOLD|WAITING/.test(text)) {
        resolvedVariant = 'warning'
      } else {
        resolvedVariant = 'default'
      }
    }
  }

  const showDot = dot || hasDot

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    outline: 'bg-transparent text-slate-700 border-slate-300',
    orange: 'bg-[#fff7ed] text-[#d95f00] border-[#fed7aa]',
    plate: 'bg-slate-100 text-slate-900 border-slate-300 font-mono tracking-widest font-bold',
  }

  const dotStyles = {
    default: 'bg-slate-500',
    neutral: 'bg-slate-500',
    primary: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    outline: 'bg-slate-500',
    orange: 'bg-[#d95f00]',
    plate: 'bg-slate-700',
  }

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide uppercase whitespace-nowrap',
        variantStyles[resolvedVariant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full inline-block shrink-0', dotStyles[resolvedVariant])}
          aria-hidden="true"
        />
      )}
      {displayContent}
    </span>
  )
}
