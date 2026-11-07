import React from 'react'
import { cn } from '@/shared/utils/cn'
import { SearchField } from './SearchField'

export interface SearchToolbarProps {
  searchValue?: string
  onSearchChange?: (val: string) => void
  onSearchSubmit?: (val: string) => void
  onClearSearch?: () => void
  searchPlaceholder?: string
  filters?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  isSearching?: boolean
}

export function SearchToolbar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  searchPlaceholder = 'Tìm kiếm dữ liệu...',
  filters,
  actions,
  className,
  isSearching = false,
}: SearchToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs md:flex-row md:items-center md:justify-between',
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs md:max-w-sm">
          <SearchField
            value={searchValue}
            onChange={onSearchChange}
            onSearch={onSearchSubmit}
            onClear={onClearSearch}
            placeholder={searchPlaceholder}
            isSearching={isSearching}
            size="md"
          />
        </div>

        {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
      </div>

      {actions && (
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  )
}
