import { Clock, Truck, Search } from 'lucide-react'
import type { FilterStatusTab } from '../types/bookingTypes'

interface BookingsCommandToolbarProps {
  activeTab: FilterStatusTab
  onTabChange: (tab: FilterStatusTab) => void
  searchKeyword: string
  onSearchChange: (keyword: string) => void
  counts: {
    all: number
    active: number
    pending: number
    completed: number
    cancelled: number
  }
  activeVehiclePlate: string
}

export function BookingsCommandToolbar({
  activeTab,
  onTabChange,
  searchKeyword,
  onSearchChange,
  counts,
  activeVehiclePlate,
}: BookingsCommandToolbarProps) {
  const formatCount = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="w-full bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6 flex flex-col gap-4">
        {/* Eyebrow & Main Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse shrink-0" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#d95f00] font-semibold">
                VÉ XE ĐIỆN TỬ &amp; ĐIỀU PHỐI VẬN TẢI • ZERO-GREEN STRICT OPS
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Quản Lý Đặt Chỗ Của Tôi
            </h1>
            <p className="text-sm text-slate-500">
              Theo dõi thời gian thực phiên đỗ, tiến độ quét ALPR và thanh toán cước phí bến bãi container liên tỉnh.
            </p>
          </div>

          {/* Quick Telemetry Chips */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200/80 shrink-0">
            <div className="px-3 py-1.5 bg-white rounded-md shadow-2xs flex items-center gap-2 border border-slate-100">
              <Clock className="w-4 h-4 text-[#d95f00]" />
              <span className="text-xs text-slate-700">
                Đồng bộ ALPR:{' '}
                <strong className="font-mono font-bold text-[#d95f00]">100% ONLINE</strong>
              </span>
            </div>
            <div className="px-3 py-1.5 bg-white rounded-md shadow-2xs flex items-center gap-2 border border-slate-100">
              <Truck className="w-4 h-4 text-[#455f87]" />
              <span className="text-xs text-slate-700">
                Biển số hoạt động:{' '}
                <strong className="font-mono font-bold text-slate-900">
                  {activeVehiclePlate}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Filters & Quick Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          {/* Status Tabs / Segmented Controller */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0" id="statusTabs">
            {/* Tab: Tất cả */}
            <button
              type="button"
              onClick={() => onTabChange('ALL')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <span>Tất cả</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${
                  activeTab === 'ALL' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {formatCount(counts.all)}
              </span>
            </button>

            {/* Tab: Đang hoạt động */}
            <button
              type="button"
              onClick={() => onTabChange('ACTIVE')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border cursor-pointer ${
                activeTab === 'ACTIVE'
                  ? 'bg-[#fff7ed] text-[#d95f00] border-[#d95f00] shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70 border-transparent'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d95f00] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d95f00]" />
              </span>
              <span>Đang hoạt động</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#d95f00] text-white font-mono font-bold">
                {formatCount(counts.active)}
              </span>
            </button>

            {/* Tab: Chờ thanh toán */}
            <button
              type="button"
              onClick={() => onTabChange('PENDING_PAYMENT')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'PENDING_PAYMENT'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <span>Chờ thanh toán</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${
                  activeTab === 'PENDING_PAYMENT'
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {formatCount(counts.pending)}
              </span>
            </button>

            {/* Tab: Đã hoàn thành */}
            <button
              type="button"
              onClick={() => onTabChange('COMPLETED')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'COMPLETED'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <span>Đã hoàn thành</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${
                  activeTab === 'COMPLETED'
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {formatCount(counts.completed)}
              </span>
            </button>

            {/* Tab: Đã hủy */}
            <button
              type="button"
              onClick={() => onTabChange('CANCELLED')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'CANCELLED'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200/70'
              }`}
            >
              <span>Đã hủy</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-200 text-slate-600 font-mono">
                {formatCount(counts.cancelled)}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="bookings-search-input"
              name="bookingSearch"
              aria-label="Tìm theo mã BK, biển số xe, tên bãi đỗ"
              type="text"
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm theo mã BK, biển số xe, tên bãi đỗ..."
              className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#d95f00] focus:ring-1 focus:ring-[#d95f00] shadow-2xs"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
