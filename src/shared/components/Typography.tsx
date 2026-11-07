import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
}

export function Heading({ level = 2, className, children, ...props }: HeadingProps) {
  const Component = `h${level}` as const

  const levelStyles = {
    1: 'font-sora text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900',
    2: 'font-sora text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900',
    3: 'font-sora text-xl sm:text-2xl font-bold tracking-tight text-slate-900',
    4: 'font-sora text-lg sm:text-xl font-bold tracking-tight text-slate-900',
    5: 'font-sora text-base font-bold text-slate-900',
    6: 'font-sora text-sm font-semibold text-slate-800',
  }

  return (
    <Component className={cn(levelStyles[level], className)} {...props}>
      {children}
    </Component>
  )
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div'
  variant?: 'body' | 'lead' | 'small' | 'muted' | 'error' | 'success'
  children: React.ReactNode
}

export function Text({
  as: Component = 'p',
  variant = 'body',
  className,
  children,
  ...props
}: TextProps) {
  const variantStyles = {
    body: 'font-inter text-sm sm:text-base text-slate-700 leading-relaxed',
    lead: 'font-inter text-base sm:text-lg text-slate-600 leading-relaxed font-normal',
    small: 'font-inter text-xs sm:text-sm text-slate-600',
    muted: 'font-inter text-xs text-slate-500',
    error: 'font-inter text-xs text-rose-600 font-medium',
    success: 'font-inter text-xs text-emerald-600 font-medium',
  }

  return (
    <Component className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Component>
  )
}

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Code({ className, children, ...props }: CodeProps) {
  return (
    <code
      className={cn(
        'font-mono text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 select-all',
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}

export function Caption({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('font-inter text-2xs text-slate-400 uppercase tracking-wider', className)} {...props}>
      {children}
    </span>
  )
}
