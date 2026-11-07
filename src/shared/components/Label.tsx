import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  isRequired?: boolean
  children: React.ReactNode
}

export function Label({
  className,
  required,
  isRequired,
  children,
  ...props
}: LabelProps) {
  const isFieldRequired = Boolean(required || isRequired)

  return (
    <label
      className={cn(
        'block text-sm font-semibold text-slate-700 leading-none select-none text-left',
        className
      )}
      {...props}
    >
      {children}
      {isFieldRequired && (
        <span className="text-rose-500 ml-1" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}
