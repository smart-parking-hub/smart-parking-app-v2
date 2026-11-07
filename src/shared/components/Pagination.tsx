import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  pageSize?: number
  zeroIndexed?: boolean
}

export function Pagination({
  className,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  zeroIndexed = false,
  ...props
}: PaginationProps) {
  const activePage = zeroIndexed ? currentPage + 1 : currentPage
  const hasPrevious = activePage > 1
  const hasNext = activePage < totalPages

  const handlePrev = () => {
    if (hasPrevious) {
      onPageChange(zeroIndexed ? currentPage - 1 : currentPage - 1)
    }
  }

  const handleNext = () => {
    if (hasNext) {
      onPageChange(zeroIndexed ? currentPage + 1 : currentPage + 1)
    }
  }

  if (totalPages <= 1 && totalItems === undefined) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 text-xs text-slate-600',
        className
      )}
      {...props}
    >
      <div>
        {totalItems !== undefined && (
          <span>
            Hiển thị{' '}
            <strong className="text-slate-900 font-semibold">
              {pageSize ? Math.min((activePage - 1) * pageSize + 1, totalItems) : activePage}
            </strong>
            {' – '}
            <strong className="text-slate-900 font-semibold">
              {pageSize ? Math.min(activePage * pageSize, totalItems) : activePage}
            </strong>{' '}
            trên tổng số{' '}
            <strong className="text-slate-900 font-semibold">{totalItems}</strong> mục
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!hasPrevious}
          aria-label="Trang trước"
          className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Trước</span>
        </button>

        <span className="px-3 py-1 font-mono text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg">
          Trang {activePage} / {Math.max(1, totalPages)}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={!hasNext}
          aria-label="Trang sau"
          className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
