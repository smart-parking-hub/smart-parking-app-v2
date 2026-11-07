import React from 'react'
import { cn } from '@/shared/utils/cn'

export function TableContainer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Table({
  className,
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn('w-full border-collapse text-left text-sm text-slate-700 font-sans', className)}
      {...props}
    >
      {children}
    </table>
  )
}

export function TableHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn('bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 text-xs tracking-wider uppercase', className)}
      {...props}
    >
      {children}
    </thead>
  )
}

export function TableBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('divide-y divide-slate-100 bg-white', className)} {...props}>
      {children}
    </tbody>
  )
}

export function TableFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn('border-t border-slate-200 bg-slate-50/70 font-medium text-slate-700', className)}
      {...props}
    >
      {children}
    </tfoot>
  )
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isInteractive?: boolean
}

export function TableRow({
  className,
  isInteractive = true,
  children,
  ...props
}: TableRowProps) {
  return (
    <tr
      className={cn(
        'transition-colors',
        isInteractive && 'hover:bg-slate-50/80',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right'
}

export function TableHead({
  className,
  align = 'left',
  children,
  ...props
}: TableHeadProps) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <th
      className={cn(
        'px-4 py-3.5 select-none font-semibold text-slate-700',
        alignStyles[align],
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right'
}

export function TableCell({
  className,
  align = 'left',
  children,
  ...props
}: TableCellProps) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <td
      className={cn(
        'px-4 py-3.5 text-sm text-slate-700 align-middle',
        alignStyles[align],
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
}
