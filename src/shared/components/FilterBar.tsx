import { Filter, X, RotateCcw } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface FilterChip {
  id: string
  label: string
  value: string
}

export interface FilterBarProps {
  chips: FilterChip[]
  onRemoveChip: (chipId: string) => void
  onClearAll?: () => void
  resultCount?: number
  className?: string
}

export function FilterBar({
  chips,
  onRemoveChip,
  onClearAll,
  resultCount,
  className,
}: FilterBarProps) {
  if (chips.length === 0) return null

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700',
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-slate-500 font-medium mr-1">
        <Filter className="w-3.5 h-3.5" />
        <span>Bộ lọc áp dụng:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {chips.map((chip) => (
          <span
            key={chip.id}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs"
          >
            <span className="text-slate-500">{chip.label}:</span>
            <span className="font-semibold text-slate-900">{chip.value}</span>
            <button
              type="button"
              onClick={() => onRemoveChip(chip.id)}
              aria-label={`Xóa bộ lọc ${chip.label}`}
              className="ml-1 rounded-sm text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-[#d95f00] hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Xóa tất cả</span>
        </button>
      )}

      {resultCount !== undefined && (
        <span className="text-slate-400 font-medium pl-2 border-l border-slate-200">
          Tìm thấy <strong className="text-slate-700 font-semibold">{resultCount}</strong> kết quả
        </span>
      )}
    </div>
  )
}
