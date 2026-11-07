import React from 'react'
import { cn } from '@/shared/utils/cn'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface IconProps {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  size?: IconSize
  className?: string
  'aria-label'?: string
}

export function Icon({
  icon: IconComponent,
  size = 'md',
  className,
  'aria-label': ariaLabel,
}: IconProps) {
  const sizeStyles = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }

  const isDecorative = !ariaLabel

  return (
    <IconComponent
      aria-hidden={isDecorative}
      aria-label={ariaLabel}
      className={cn('shrink-0 inline-block', sizeStyles[size], className)}
    />
  )
}
