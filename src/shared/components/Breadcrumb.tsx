import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showHomeIcon?: boolean
  homeHref?: string
  className?: string
  separator?: React.ReactNode
}

export function Breadcrumb({
  items,
  showHomeIcon = false,
  homeHref = '/',
  className,
  separator = <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />,
}: BreadcrumbProps) {
  if (!items || items.length === 0) return null

  const allItems: BreadcrumbItem[] = showHomeIcon
    ? [{ label: 'Trang chủ', href: homeHref, icon: Home }, ...items]
    : items

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs sm:text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 list-none p-0 m-0">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          const IconComponent = item.icon

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <span aria-hidden="true">{separator}</span>}

              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-[320px] flex items-center gap-1.5"
                >
                  {IconComponent && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  to={item.href}
                  className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
                >
                  {IconComponent && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="text-slate-500 flex items-center gap-1.5">
                  {IconComponent && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
