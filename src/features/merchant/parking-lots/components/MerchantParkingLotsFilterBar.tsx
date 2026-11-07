import { Search, LayoutGrid, List, SlidersHorizontal } from 'lucide-react'
import { Select, type SelectOption } from '@/shared/components/Select'

export type ViewMode = 'grid' | 'table'

interface MerchantParkingLotsFilterBarProps {
  keyword: string
  onKeywordChange: (val: string) => void
  status: string
  onStatusChange: (val: string) => void
  sort: string
  onSortChange: (val: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  totalResults: number
}

const SORT_OPTIONS: SelectOption[] = [
  { value: 'createdAt,desc', label: 'Mới tạo gần đây' },
  { value: 'name,asc', label: 'Tên A–Z' },
  { value: 'name,desc', label: 'Tên Z–A' },
]

export function MerchantParkingLotsFilterBar({
  keyword,
  onKeywordChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
}: MerchantParkingLotsFilterBarProps) {
  const statusOptions: SelectOption[] = [
    { value: 'ALL', label: `Tất cả trạng thái (${totalResults})` },
    { value: 'APPROVED', label: 'Đã phê duyệt (APPROVED)' },
    { value: 'PENDING_APPROVAL', label: 'Đang chờ duyệt (PENDING_APPROVAL)' },
    { value: 'CHANGES_REQUESTED', label: 'Cần bổ sung (CHANGES_REQUESTED)' },
    { value: 'SUSPENDED', label: 'Tạm dừng (SUSPENDED)' },
    { value: 'REJECTED', label: 'Bị từ chối (REJECTED)' },
  ]

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Tìm theo tên bãi, địa chỉ..."
            className="w-full pl-10 pr-4 py-2 bg-[#eff4ff] text-[#0d1c2e] text-xs sm:text-sm rounded-xl border border-transparent focus:border-[#d95f00]/40 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 font-normal"
            aria-label="Tìm kiếm bãi đỗ"
          />
        </div>

        {/* Filters & View Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Status Filter (Shared Select Component) */}
          <div className="w-full sm:w-[270px]">
            <Select
              value={status}
              onChange={onStatusChange}
              options={statusOptions}
              prefixIcon={
                <span className="font-mono text-xs text-slate-500 font-semibold shrink-0">
                  Trạng thái:
                </span>
              }
              variant="subtle"
              size="sm"
              ariaLabel="Lọc theo trạng thái"
              triggerClassName="h-9 px-3 rounded-xl border-slate-200/60"
            />
          </div>

          {/* Sort Filter (Shared Select Component) */}
          <div className="w-full sm:w-[250px]">
            <Select
              value={sort}
              onChange={onSortChange}
              options={SORT_OPTIONS}
              prefixIcon={
                <span className="flex items-center gap-1.5 font-mono text-xs text-slate-500 font-semibold shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  Sắp xếp:
                </span>
              }
              variant="subtle"
              size="sm"
              ariaLabel="Sắp xếp danh sách"
              triggerClassName="h-9 px-3 rounded-xl border-slate-200/60"
            />
          </div>

          {/* View Switcher: Grid vs Table */}
          <div className="flex items-center bg-[#eff4ff] p-1 rounded-xl border border-slate-200/60 h-9">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`h-7 px-3 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#0d1c2e] shadow-2xs'
                  : 'text-slate-500 hover:text-[#0d1c2e]'
              }`}
              aria-label="Chế độ xem dạng lưới"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lưới</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`h-7 px-3 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#0d1c2e] shadow-2xs'
                  : 'text-slate-500 hover:text-[#0d1c2e]'
              }`}
              aria-label="Chế độ xem dạng bảng"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bảng</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
