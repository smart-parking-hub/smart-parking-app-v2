import { type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

// Re-export standardized compound components & types
export { Dialog, type DialogProps } from './Dialog'
export { DataTable, type Column, type DataTableProps } from './DataTable'
export { Badge, type BadgeProps } from './Badge'

export const control =
  'w-full rounded-xl border border-brand-border bg-white px-3 py-3 text-sm text-brand-navy outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-brand-primary focus-visible:ring-offset-1 disabled:opacity-50 transition-colors'
export const button =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#d95f00] bg-brand-primary px-4 py-3 text-sm font-semibold text-white hover:bg-brand-primary-hover active:bg-brand-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs'
export const secondary =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-surface disabled:opacity-50 transition-colors'

export const money = (value: unknown) =>
  typeof value === 'number'
    ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value)
    : '—'

export const date = (value: unknown) =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value))
    ? new Date(value).toLocaleString('vi-VN')
    : '—'

export function Workspace({
  title,
  eyebrow = 'SMARTTRUCK / OPERATIONS',
  description,
  actions,
  children,
}: {
  title: string
  eyebrow?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="mx-auto w-full max-w-[1440px] space-y-6 p-4 font-inter text-brand-navy md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-brand-border pb-6">
        <div>
          <p className="mb-3 font-mono text-xs tracking-[.18em] text-brand-muted">
            {eyebrow}
          </p>
          <h1 className="font-sora text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-muted">
              {description}
            </p>
          )}
        </div>
        {actions}
      </header>
      {children}
    </section>
  )
}

export function Panel({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl border border-brand-border bg-white p-5 md:p-6 ${className}`}
    >
      {title && (
        <h2 className="mb-5 font-sora text-lg font-semibold">{title}</h2>
      )}
      {children}
    </section>
  )
}

export function Notice({
  children,
  error = false,
}: {
  children: ReactNode
  error?: boolean
}) {
  return (
    <div
      role={error ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${error ? 'border-red-200 bg-red-50 text-red-800' : 'border-brand-border bg-brand-surface text-brand-navy'}`}
    >
      <AlertCircle size={18} className="shrink-0" />
      {children}
    </div>
  )
}

export function Metrics({
  items,
}: {
  items: { label: string; value: ReactNode; note?: string }[]
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, i) => (
        <Panel
          key={item.label}
          className={
            i === 0 ? '!border-brand-navy !bg-brand-navy !text-white' : ''
          }
        >
          <p
            className={`text-xs ${i === 0 ? 'text-slate-300' : 'text-brand-muted'}`}
          >
            {item.label}
          </p>
          <p className="my-3 break-words font-sora text-2xl font-semibold tabular-nums">
            {item.value}
          </p>
          {item.note && (
            <p
              className={`text-xs ${i === 0 ? 'text-slate-300' : 'text-brand-muted'}`}
            >
              {item.note}
            </p>
          )}
        </Panel>
      ))}
    </div>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
    </label>
  )
}
