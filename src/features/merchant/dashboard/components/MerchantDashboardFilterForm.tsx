import { useMemo } from 'react'
import { Building2, RotateCw, Calendar } from 'lucide-react'
import { Select, type SelectOption } from '@/shared/components/Select'
import { merchantDashboardFilterSchema } from '../types/merchantDashboardSchemas'
import type { TimeRangeFilter } from '../store/merchantDashboardStore'

interface ParkingLotOption {
  id: number
  name: string
}

interface MerchantDashboardFilterFormProps {
  lots: ParkingLotOption[]
  totalLots: number
  selectedLotId: number | null
  selectedLotName?: string
  currentNetRevenueFormatted?: string
  timeRange: TimeRangeFilter
  onLotChange: (lotId: number | null) => void
  onTimeRangeChange: (range: TimeRangeFilter) => void
  onManualRefresh: () => void
  isRefetching?: boolean
}

const TIME_RANGE_OPTIONS: { key: TimeRangeFilter; label: string }[] = [
  { key: 'ALL', label: 'Toàn thời gian' },
  { key: 'TODAY', label: 'Hôm nay' },
  { key: 'WEEK', label: '7 ngày qua' },
  { key: 'MONTH', label: '30 ngày qua' },
]

export function MerchantDashboardFilterForm({
  lots,
  totalLots,
  selectedLotId,
  selectedLotName,
  currentNetRevenueFormatted,
  timeRange,
  onLotChange,
  onTimeRangeChange,
  onManualRefresh,
  isRefetching = false,
}: MerchantDashboardFilterFormProps) {
  const lotSelectOptions = useMemo<SelectOption[]>(
    () => [
      { value: '', label: `Tất cả bãi đỗ (${totalLots})` },
      ...lots.map((lot) => ({ value: String(lot.id), label: lot.name })),
    ],
    [lots, totalLots],
  )

  const handleLotSelectChange = (nextVal: string) => {
    const rawVal = nextVal ? Number(nextVal) : null
    const result = merchantDashboardFilterSchema.shape.parkingLotId.safeParse(rawVal)
    if (result.success) {
      onLotChange(result.data ?? null)
    }
  }

  const handleTimeRangeClick = (range: TimeRangeFilter) => {
    const result = merchantDashboardFilterSchema.shape.timeRange.safeParse(range)
    if (result.success) {
      onTimeRangeChange(result.data)
    }
  }

  return (
    <form
      role="search"
      aria-label="Bộ lọc cơ sở bãi đỗ và kỳ báo cáo"
      onSubmit={(e) => e.preventDefault()}
      data-testid="merchant-dashboard-filter-form"
      className="flex flex-col gap-4 bg-white px-5 py-4 rounded-2xl border border-slate-200/90 shadow-2xs"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Lot Selector using shared default Select component */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#0d1c2e] font-semibold">
          <label htmlFor="lot-filter-select" className="shrink-0">
            Lọc theo cơ sở bãi đỗ:
          </label>
          <div className="min-w-0 max-w-full w-full sm:w-auto sm:min-w-[240px] sm:max-w-[440px]">
            <Select
              id="lot-filter-select"
              value={selectedLotId !== null ? String(selectedLotId) : ''}
              onChange={handleLotSelectChange}
              options={lotSelectOptions}
              placeholder=""
              prefixIcon={
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              }
              ariaLabel="Mở bộ lọc cơ sở bãi đỗ"
              variant="default"
              size="md"
              dropdownClassName="w-full min-w-[260px]"
            />
          </div>
        </div>

        {/* Selected Lot Active Indicator */}
        {selectedLotId !== null && (
          <span className="font-mono text-xs text-[#d95f00] font-bold">
            <span>Đang xem bãi: {selectedLotName}</span>
            {currentNetRevenueFormatted && (
              <span className="ml-1 text-slate-500 font-normal">
                ({currentNetRevenueFormatted})
              </span>
            )}
          </span>
        )}
      </div>

      {/* Time Range Pills & Manual Refresh Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 mr-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Kỳ báo cáo:</span>
          </span>
          {TIME_RANGE_OPTIONS.map(({ key, label }) => {
            const isActive = timeRange === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleTimeRangeClick(key)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-navy text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Refresh Action */}
        <button
          type="button"
          onClick={onManualRefresh}
          disabled={isRefetching}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RotateCw
            className={`h-3.5 w-3.5 text-slate-500 ${
              isRefetching ? 'animate-spin' : ''
            }`}
          />
          <span>{isRefetching ? 'Đang làm mới...' : 'Làm mới dữ liệu'}</span>
        </button>
      </div>
    </form>
  )
}
