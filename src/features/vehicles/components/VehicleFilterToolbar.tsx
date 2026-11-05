import { Search, RotateCcw } from 'lucide-react'
import type { VehicleClassType, VehicleStatusType } from '../types/vehicleTypes'

interface VehicleFilterToolbarProps {
  search: string
  onSearchChange: (val: string) => void
  typeFilter: 'all' | VehicleClassType
  onTypeFilterChange: (val: 'all' | VehicleClassType) => void
  statusFilter: 'all' | VehicleStatusType
  onStatusFilterChange: (val: 'all' | VehicleStatusType) => void
  onReset: () => void
  totalCount: number
  tractorCount: number
  trailerCount: number
}

export function VehicleFilterToolbar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
  totalCount,
  tractorCount,
  trailerCount,
}: VehicleFilterToolbarProps) {
  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[280px]">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id="vehicles-search-input"
          name="vehicleSearch"
          aria-label="Tìm kiếm theo biển kiểm soát, nhãn hiệu hoặc số khung"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo biển kiểm soát, nhãn hiệu (Hyundai Xcient...), số khung..."
          className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type Filter */}
        <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-xl px-3 py-1">
          <label htmlFor="vehicle-type-filter-select" className="text-xs font-semibold text-slate-500 mr-2 whitespace-nowrap">
            Phân loại:
          </label>
          <select
            id="vehicle-type-filter-select"
            name="vehicleTypeFilter"
            aria-label="Lọc theo phân loại phương tiện"
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value as 'all' | VehicleClassType)}
            className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer py-1"
          >
            <option value="all">Tất cả xe ({totalCount.toString().padStart(2, '0')})</option>
            <option value="CONTAINER">Xe đầu kéo Container ({tractorCount.toString().padStart(2, '0')})</option>
            <option value="TRAILER">Rơ-moóc chuyên dụng ({trailerCount.toString().padStart(2, '0')})</option>
            <option value="HEAVY">Xe tải nặng &gt;10T (00)</option>
            <option value="MEDIUM">Xe tải trung (00)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-xl px-3 py-1">
          <label htmlFor="vehicle-status-filter-select" className="text-xs font-semibold text-slate-500 mr-2 whitespace-nowrap">
            Trạng thái:
          </label>
          <select
            id="vehicle-status-filter-select"
            name="vehicleStatusFilter"
            aria-label="Lọc theo trạng thái phương tiện"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as 'all' | VehicleStatusType)}
            className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer py-1"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động ({totalCount.toString().padStart(2, '0')})</option>
            <option value="LOCKED">Tạm khóa (00)</option>
            <option value="PENDING">Chờ duyệt đăng kiểm (00)</option>
          </select>
        </div>

        {/* Reset button */}
        <button
          type="button"
          onClick={onReset}
          title="Đặt lại bộ lọc"
          className="h-11 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors border border-slate-200 flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
