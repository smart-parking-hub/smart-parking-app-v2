import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { SearchField } from './SearchField'
import { Spinner } from './Spinner'
import { Checkbox } from './Checkbox'

export interface Column<T> {
  key?: string
  label: string
  render: (row: T) => ReactNode
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  className?: string
}

export interface DataTableProps<T extends { id?: string | number }> {
  rows: T[]
  columns: Column<T>[]
  searchText?: (row: T) => string
  searchPlaceholder?: string
  page?: number
  totalPages?: number
  onPage?: (page: number) => void
  totalItems?: number
  detailLink?: (row: T) => string
  detailLabel?: string
  renderMobileCard?: (row: T) => ReactNode
  selectable?: boolean
  selectedIds?: (string | number)[]
  onSelectRow?: (id: string | number) => void
  onSelectAll?: () => void
  isLoading?: boolean
  emptyText?: string
  className?: string
}

export function DataTable<T extends { id?: string | number }>({
  rows,
  columns,
  searchText,
  searchPlaceholder = 'Lọc trong trang hiện tại…',
  page,
  totalPages,
  onPage,
  totalItems,
  detailLink,
  detailLabel = 'Chi tiết',
  renderMobileCard,
  selectable = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  isLoading = false,
  emptyText = 'Không có dữ liệu phù hợp.',
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const filteredRows = searchText
    ? rows.filter((row) =>
        searchText(row)
          .toLocaleLowerCase('vi')
          .includes(search.toLocaleLowerCase('vi'))
      )
    : rows

  const isAllSelected =
    selectable &&
    filteredRows.length > 0 &&
    filteredRows.every((r) => r.id !== undefined && selectedIds.includes(r.id))

  const isSomeSelected =
    selectable &&
    !isAllSelected &&
    filteredRows.some((r) => r.id !== undefined && selectedIds.includes(r.id))

  const handleHeaderSort = (colKey?: string) => {
    if (!colKey) return
    if (sortKey === colKey) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(colKey)
      setSortOrder('asc')
    }
  }

  const secondaryBtnStyle =
    'inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs'

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/90 bg-white p-5 md:p-6 shadow-xs text-slate-800',
        className
      )}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs sm:text-sm text-slate-500 font-medium">
          {totalItems !== undefined ? (
            <span>
              Tổng số <strong className="text-slate-900 font-semibold">{totalItems}</strong> bản ghi
            </span>
          ) : (
            <span>
              <strong className="text-slate-900 font-semibold">{rows.length}</strong> bản ghi trên trang này
            </span>
          )}
        </div>

        {searchText && (
          <div className="w-full sm:w-72">
            <SearchField
              placeholder={searchPlaceholder}
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              size="sm"
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Spinner size="lg" variant="primary" />
          <p className="text-xs text-slate-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {renderMobileCard && filteredRows.length > 0 && (
            <div className="space-y-3 md:hidden">
              {filteredRows.map((row, idx) => (
                <div key={row.id ?? idx}>{renderMobileCard(row)}</div>
              ))}
            </div>
          )}

          <div
            className={cn(
              'overflow-x-auto rounded-xl border border-slate-200/80',
              renderMobileCard && filteredRows.length > 0 && 'hidden md:block'
            )}
          >
            <table className="w-full text-left text-sm border-collapse">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600 tracking-wider uppercase">
                <tr>
                  {selectable && (
                    <th scope="col" className="w-10 px-4 py-3.5 text-center">
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        onChange={() => onSelectAll?.()}
                        aria-label="Chọn tất cả"
                      />
                    </th>
                  )}
                  {columns.map((col, idx) => {
                    const isSorted = col.key && sortKey === col.key
                    return (
                      <th
                        key={col.key || col.label || idx}
                        scope="col"
                        className={cn(
                          'whitespace-nowrap px-4 py-3.5 select-none',
                          col.align === 'right' && 'text-right',
                          col.align === 'center' && 'text-center',
                          (!col.align || col.align === 'left') && 'text-left',
                          col.sortable && 'cursor-pointer hover:bg-slate-100/70 transition-colors',
                          col.className
                        )}
                        onClick={col.sortable ? () => handleHeaderSort(col.key) : undefined}
                      >
                        <div
                          className={cn(
                            'inline-flex items-center gap-1.5',
                            col.align === 'right' && 'justify-end',
                            col.align === 'center' && 'justify-center'
                          )}
                        >
                          <span>{col.label}</span>
                          {col.sortable && (
                            <span className="text-slate-400">
                              {isSorted ? (
                                sortOrder === 'asc' ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-brand-orange" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-brand-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    )
                  })}
                  {detailLink && (
                    <th scope="col" className="px-4 py-3.5 text-right w-24">
                      {detailLabel}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRows.map((row, idx) => {
                  const rowId = row.id ?? idx
                  const isChecked = row.id !== undefined && selectedIds.includes(row.id)

                  return (
                    <tr
                      key={rowId}
                      className={cn(
                        'transition-colors hover:bg-slate-50/70',
                        isChecked && 'bg-orange-50/40 hover:bg-orange-50/60'
                      )}
                    >
                      {selectable && (
                        <td className="w-10 px-4 py-4 text-center">
                          <Checkbox
                            checked={isChecked}
                            onChange={() => row.id !== undefined && onSelectRow?.(row.id)}
                            aria-label={`Chọn hàng ${rowId}`}
                          />
                        </td>
                      )}
                      {columns.map((col, cIdx) => (
                        <td
                          key={col.key || col.label || cIdx}
                          className={cn(
                            'px-4 py-4 align-middle text-slate-700',
                            col.align === 'right' && 'text-right',
                            col.align === 'center' && 'text-center',
                            col.className
                          )}
                        >
                          {col.render(row)}
                        </td>
                      ))}
                      {detailLink && (
                        <td className="px-4 py-4 text-right">
                          <Link
                            aria-label={`Xem chi tiết #${rowId}`}
                            className={secondaryBtnStyle}
                            to={detailLink(row)}
                          >
                            <ArrowRight className="w-4 h-4 text-slate-600" />
                          </Link>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredRows.length === 0 && (
              <div className="py-16 text-center text-slate-400 text-sm font-medium">
                {emptyText}
              </div>
            )}
          </div>
        </>
      )}

      {onPage && (
        <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className={secondaryBtnStyle}
            disabled={!page || page <= 0}
            onClick={() => onPage((page ?? 0) - 1)}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trước</span>
          </button>
          <span className="px-3 py-1 font-mono text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg">
            Trang {(page ?? 0) + 1} / {Math.max(1, totalPages ?? 1)}
          </span>
          <button
            type="button"
            className={secondaryBtnStyle}
            disabled={(page ?? 0) + 1 >= (totalPages ?? 1)}
            onClick={() => onPage((page ?? 0) + 1)}
          >
            <span>Sau</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
