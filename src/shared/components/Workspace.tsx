import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft, ArrowRight, Search, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export const control =
  'w-full rounded-xl border border-brand-border bg-white px-3 py-3 text-sm text-brand-navy outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50'
export const button =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white hover:bg-brand-primary-hover active:bg-brand-primary-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
export const secondary =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-surface disabled:opacity-50'
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
const statuses: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  PENDING_APPROVAL: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  SUSPENDED: 'Tạm dừng',
  PAID: 'Đã chi',
  OPEN: 'Đang mở',
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
}
export function Badge({ value }: { value: unknown }) {
  const text = String(value ?? '—')
  const color = /APPROVED|ACTIVE|COMPLETED|SUCCESS|PAID|RESOLVED/.test(text)
    ? 'bg-emerald-50 text-emerald-800'
    : /REJECT|BANNED|CANCEL|OVERTIME|SUSPENDED|FAIL/.test(text)
      ? 'bg-red-50 text-red-800'
      : 'bg-amber-50 text-amber-900'
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold ${color}`}
    >
      {statuses[text] || text}
    </span>
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
export function Dialog({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const element = ref.current
    const previous = document.activeElement
    if (element) {
      element.setAttribute('open', '')
      if (typeof element.showModal === 'function') {
        element.showModal()
      }
    }
    return () => {
      if (element) {
        element.removeAttribute('open')
        if (typeof element.close === 'function') {
          element.close()
        }
      }
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className="m-auto max-h-[85dvh] w-[min(95vw,640px)] overflow-y-auto rounded-2xl border border-brand-border bg-white p-6 text-brand-navy shadow-2xl backdrop:bg-brand-navy/70"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 id={titleId} className="font-sora text-xl font-semibold">
          {title}
        </h2>
        <button className={secondary} onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </button>
      </div>
      {children}
    </dialog>
  )
}
export interface Column<T> {
  label: string
  render: (row: T) => ReactNode
  align?: 'left' | 'center' | 'right'
}
export function DataTable<T extends { id: number }>({
  rows,
  columns,
  searchText,
  page,
  totalPages,
  onPage,
  detailLink,
}: {
  rows: T[]
  columns: Column<T>[]
  searchText?: (row: T) => string
  page?: number
  totalPages?: number
  onPage?: (page: number) => void
  detailLink?: (row: T) => string
}) {
  const [search, setSearch] = useState('')
  const shown = searchText
    ? rows.filter((row) =>
        searchText(row)
          .toLocaleLowerCase('vi')
          .includes(search.toLocaleLowerCase('vi')),
      )
    : rows
  return (
    <Panel>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-muted">
          {rows.length} bản ghi trên trang này
        </p>
        {searchText && (
          <label className="flex w-full items-center gap-2 sm:w-80">
            <Search size={18} />
            <input
              aria-label="Lọc trong trang hiện tại"
              placeholder="Lọc trong trang hiện tại…"
              className={control}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-y border-brand-border bg-brand-surface text-xs text-brand-muted">
            <tr>
              {columns.map((col) => (
                <th
                  className={cn(
                    'whitespace-nowrap px-4 py-4',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    (!col.align || col.align === 'left') && 'text-left'
                  )}
                  key={col.label}
                  scope="col"
                >
                  {col.label}
                </th>
              ))}
              {detailLink && (
                <th scope="col" className="px-4">
                  Chi tiết
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {shown.map((row) => (
              <tr key={row.id} className="hover:bg-brand-surface/50">
                {columns.map((col) => (
                  <td
                    className={cn(
                      'max-w-md px-4 py-5',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center'
                    )}
                    key={col.label}
                  >
                    {col.render(row)}
                  </td>
                ))}
                {detailLink && (
                  <td className="px-4">
                    <Link
                      aria-label={`Xem chi tiết #${row.id}`}
                      className={secondary}
                      to={detailLink(row)}
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {!shown.length && (
          <p className="py-16 text-center text-brand-muted">
            Không có dữ liệu phù hợp.
          </p>
        )}
      </div>
      {onPage && (
        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            className={secondary}
            disabled={!page}
            onClick={() => onPage((page ?? 0) - 1)}
          >
            <ArrowLeft size={16} />
            Trước
          </button>
          <span className="text-sm">
            Trang {(page ?? 0) + 1} / {Math.max(1, totalPages ?? 1)}
          </span>
          <button
            className={secondary}
            disabled={(page ?? 0) + 1 >= (totalPages ?? 1)}
            onClick={() => onPage((page ?? 0) + 1)}
          >
            Sau
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </Panel>
  )
}
