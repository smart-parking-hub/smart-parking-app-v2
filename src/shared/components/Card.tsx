import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'outline' | 'interactive'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white border border-slate-200/80 rounded-2xl shadow-xs',
      flat: 'bg-slate-50 border border-slate-200 rounded-2xl',
      outline: 'bg-transparent border border-slate-300 rounded-2xl',
      interactive:
        'bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer',
    }

    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden text-slate-800', variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 pb-3 flex flex-col gap-1', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-sora text-base lg:text-lg font-bold text-slate-900 leading-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-slate-500 leading-relaxed', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 pt-0', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-5 pt-3 border-t border-slate-100 flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  )
}
