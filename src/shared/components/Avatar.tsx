import React, { useState } from 'react'
import { User } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'busy' | 'away'
}

function getInitials(name?: string): string {
  if (!name) return ''
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  className,
  ...props
}: AvatarProps) {
  const [hasImageError, setHasImageError] = useState(false)

  const sizeStyles = {
    xs: 'w-6 h-6 text-2xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }

  const statusColors = {
    online: 'bg-emerald-500',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400',
  }

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  }

  const initials = getInitials(name)
  const shouldRenderImage = Boolean(src && !hasImageError)

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-[#060D1A] text-white font-sora font-bold shrink-0 select-none overflow-visible',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {shouldRenderImage ? (
        <img
          src={src}
          alt={alt || name || 'Ảnh đại diện người dùng'}
          onError={() => setHasImageError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User className={cn('text-slate-300', iconSizes[size])} aria-hidden="true" />
      )}

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
            statusColors[status],
            statusSizes[size]
          )}
          aria-label={`Trạng thái: ${status}`}
        />
      )}
    </div>
  )
}
