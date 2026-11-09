import { Check, Truck } from 'lucide-react'
import type {
  SearchFilterState,
  VehicleClassification,
  VehicleOption,
} from '../types/parkingSearchTypes'
import {
  Select,
  type SelectGroup,
  type SelectOption,
} from '../../../shared/components/Select'
import { cn } from '../../../shared/utils/cn'

interface TopFilterBarProps {
  filters: SearchFilterState
  vehicles: VehicleOption[]
  onChangeFilters: (updated: Partial<SearchFilterState>) => void
  totalResults?: number
  onToggleIncludeFull?: (value: boolean) => void
}

const STANDARD_CLASSIFICATIONS: {
  type: VehicleClassification
  label: string
  badge?: string
}[] = [
  { type: 'CONTAINER', label: 'Container 40/45FT', badge: 'Standard' },
  { type: 'HEAVY_TRUCK', label: 'Tải nặng (>10T)', badge: '>10T' },
  { type: 'BUS_COACH', label: 'Xe khách (16–45 chỗ)', badge: 'Bus/Coach' },
  { type: 'LIGHT_TRUCK', label: 'Tải nhỏ (<3.5T)', badge: '<3.5T' },
  { type: 'SEDAN_SUV', label: 'Khách / Sedan', badge: 'Sedan/SUV' },
]

const SORT_OPTIONS: SelectOption[] = [
  { value: 'distance', label: 'Gần nhất (Distance)' },
  { value: 'price', label: 'Giá thấp nhất' },
  { value: 'rating', label: 'Đánh giá trạm cao nhất' },
]

export function TopFilterBar({
  filters,
  vehicles,
  onChangeFilters,
  totalResults = 0,
  onToggleIncludeFull,
}: TopFilterBarProps) {
  const handleSelectVehicle = (val: string) => {
    if (val.startsWith('type:')) {
      const type = val.replace('type:', '') as VehicleClassification
      onChangeFilters({
        selectedVehicleId: val,
        vehicleType: type,
      })
    } else {
      const v = vehicles.find((item) => item.id === val)
      onChangeFilters({
        selectedVehicleId: val,
        vehicleType: v ? v.type : filters.vehicleType,
      })
    }
  }

  // Determine current select value
  const selectValue = filters.selectedVehicleId.startsWith('type:')
    ? filters.selectedVehicleId
    : vehicles.some((v) => v.id === filters.selectedVehicleId)
      ? filters.selectedVehicleId
      : `type:${filters.vehicleType}`

  const vehicleGroups: SelectGroup[] = [
    {
      label: 'Xe điều hành của bạn',
      options: vehicles.map((v) => ({
        value: v.id,
        label: v.label,
      })),
    },
    {
      label: 'Loại phương tiện & Tải trọng',
      options: STANDARD_CLASSIFICATIONS.map((c) => ({
        value: `type:${c.type}`,
        label: c.label,
        badge: c.badge,
      })),
    },
  ]

  // Dynamic slider background calculation for smooth progress
  const radiusPercent = Math.round(((filters.radiusKm - 1) / (50 - 1)) * 100)

  return (
    <section
      aria-label="Bộ lọc tìm bãi đỗ"
      className="w-full bg-white/95 backdrop-blur-md shadow-lg rounded-2xl p-3.5 sm:p-4 border border-brand-border/90 [&_span]:leading-relaxed"
    >
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="min-w-0">
          <h1 className="font-sora text-sm font-bold tracking-tight text-brand-navy truncate">
            Điểm đỗ phù hợp. Hành trình an tâm.
          </h1>
        </div>
        <span className="shrink-0 rounded-full border border-brand-border bg-brand-surface px-2.5 py-0.5 text-[11px] font-medium text-brand-muted">
          Bản đồ OpenStreetMap
        </span>
      </div>

      {/* 2 Compact Columns: Phương tiện điều hành + Sắp xếp theo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-start">
        <div className="flex flex-col w-full min-w-0">
          <span className="text-[11px] text-[#45464d] block mb-1 font-semibold">
            Phương tiện điều hành
          </span>
          <Select
            value={selectValue}
            onChange={handleSelectVehicle}
            groups={vehicleGroups}
            prefixIcon={<Truck className="w-3.5 h-3.5 text-[#455f87] shrink-0" />}
            ariaLabel="Phương tiện điều hành"
            variant="subtle"
            size="sm"
          />
        </div>

        <div className="flex flex-col w-full min-w-0">
          <span className="text-[11px] text-[#45464d] block mb-1 font-semibold">
            Sắp xếp theo
          </span>
          <Select
            value={filters.sortBy}
            onChange={(val) =>
              onChangeFilters({
                sortBy: val as 'distance' | 'price' | 'rating',
              })
            }
            options={SORT_OPTIONS}
            ariaLabel="Tiêu chí sắp xếp"
            variant="subtle"
            size="sm"
          />
        </div>
      </div>

      {/* Radius Slider */}
      <div className="mt-2.5 flex flex-col w-full">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] text-[#45464d] font-semibold">
            Bán kính quét:
          </span>
          <span className="tabular-nums text-[#d95f00] font-bold text-[11px] bg-orange-50 border border-orange-200/70 px-2 py-0.5 rounded-full">
            {filters.radiusKm} km
          </span>
        </div>

        <div className="py-1.5 flex items-center">
          <input
            type="range"
            min="1"
            max="50"
            value={filters.radiusKm}
            onChange={(e) =>
              onChangeFilters({ radiusKm: Number(e.target.value) })
            }
            className="w-full custom-range-slider"
            style={{
              background: `linear-gradient(to right, #d95f00 0%, #d95f00 ${radiusPercent}%, #e2e8f0 ${radiusPercent}%, #e2e8f0 100%)`,
            }}
            aria-label="Bán kính quét"
          />
        </div>

        {/* Positioned km milestones aligned directly below their slider track positions */}
        <div className="relative h-5 w-full mt-0.5">
          {[5, 15, 30, 50].map((km) => {
            const isMax = km === 50
            const ratio = (km - 1) / (50 - 1)
            return (
              <button
                key={km}
                type="button"
                onClick={() => onChangeFilters({ radiusKm: km })}
                style={
                  isMax
                    ? { right: 0 }
                    : { left: `calc(7px + (100% - 14px) * ${ratio})` }
                }
                className={cn(
                  'absolute top-0 flex flex-col items-center tabular-nums text-[10px] leading-none transition-colors cursor-pointer rounded px-1 py-0.5',
                  !isMax && '-translate-x-1/2',
                  filters.radiusKm === km
                    ? 'font-bold text-[#d95f00]'
                    : 'font-medium text-slate-400 hover:text-[#d95f00]',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'mb-0.5 h-1 w-px',
                    filters.radiusKm === km ? 'bg-[#d95f00]' : 'bg-slate-300',
                  )}
                />
                <span>{km}km</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Count + Circular Include Full Toggle */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-brand-muted">
        <p className="tabular-nums">
          Tìm thấy{' '}
          <strong className="font-semibold text-brand-navy">
            {totalResults} bãi xe
          </strong>{' '}
          trong{' '}
          <span className="font-semibold text-brand-navy">
            {filters.radiusKm} km
          </span>
        </p>
        <label className="inline-flex items-center gap-2 text-xs font-semibold text-brand-navy cursor-pointer select-none group">
          <span className="relative inline-flex items-center justify-center">
            <input
              type="checkbox"
              checked={filters.includeFull}
              onChange={(event) => {
                if (onToggleIncludeFull) {
                  onToggleIncludeFull(event.target.checked)
                } else {
                  onChangeFilters({ includeFull: event.target.checked })
                }
              }}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                'flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-all',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-orange/40 peer-focus-visible:ring-offset-1',
                filters.includeFull
                  ? 'border-brand-orange bg-brand-orange text-white shadow-2xs'
                  : 'border-slate-300 bg-white text-transparent group-hover:border-brand-orange/70',
              )}
            >
              <Check size={11} strokeWidth={3} />
            </span>
          </span>
          <span>Hiện bãi đã đầy</span>
        </label>
      </div>
    </section>
  )
}
