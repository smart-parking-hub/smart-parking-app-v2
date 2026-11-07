import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface TableActionBarProps {
  selectedCount: number
  onClearSelection?: () => void
  actions?: React.ReactNode
  className?: string
  totalCount?: number
}

export function TableActionBar({
  selectedCount,
  onClearSelection,
  actions,
  className,
  totalCount,
}: TableActionBarProps) {
  if (selectedCount <= 0) return null

  return (
    <div
      role="region"
      aria-label="Thao tác hàng loạt"
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-orange-50/90 px-4 py-3 text-sm text-slate-800 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="font-semibold text-brand-navy">
          Đã chọn <strong className="text-brand-primary font-bold">{selectedCount}</strong>
          {totalCount !== undefined ? ` / ${totalCount}` : ''} mục
        </span>

        {onClearSelection && (
          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Bỏ chọn</span>
          </button>
        )}
      </div>

      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  )
}

export const BulkSelection = TableActionBar
