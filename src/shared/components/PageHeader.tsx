import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb'

export interface PageHeaderProps {
  title: string
  eyebrow?: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  badge?: React.ReactNode
  backHref?: string
  onBack?: () => void
  className?: string
}

export function PageHeader({
  title,
  eyebrow,
  description,
  breadcrumbs,
  actions,
  badge,
  backHref,
  onBack,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('space-y-4 border-b border-slate-200/80 pb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-2">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          {eyebrow && (
            <p className="font-mono text-xs font-semibold tracking-wider uppercase text-slate-500">
              {eyebrow}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {backHref ? (
              <Link
                to={backHref}
                aria-label="Quay lại"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            ) : onBack ? (
              <button
                type="button"
                onClick={onBack}
                aria-label="Quay lại"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : null}

            <h1 className="font-sora text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>

            {badge && <div className="shrink-0">{badge}</div>}
          </div>

          {description && (
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end sm:self-auto">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
