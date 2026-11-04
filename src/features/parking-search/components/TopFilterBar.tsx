import { Truck } from 'lucide-react'
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
    <section className="w-full bg-white shadow-sm rounded-2xl p-5 lg:p-7 mb-6 border border-brand-border [&_span]:leading-relaxed [&_button]:min-h-8">
      {/* 3 Even Columns: 1. Phương tiện điều hành -> 2. Sắp xếp theo -> 3. Bán kính quét */}
      <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr_1fr] gap-6 lg:gap-10 items-start">
        {/* 1. Phương tiện điều hành */}
        <div className="flex flex-col w-full">
          <span className="text-xs text-[#45464d] block mb-1.5 font-medium">
            Phương tiện điều hành
          </span>
          <Select
            value={selectValue}
            onChange={handleSelectVehicle}
            groups={vehicleGroups}
            prefixIcon={<Truck className="w-4 h-4 text-[#455f87] shrink-0" />}
            ariaLabel="Phương tiện điều hành"
            variant="subtle"
          />
        </div>

        {/* 2. Sắp xếp theo */}
        <div className="flex flex-col w-full">
          <span className="text-xs text-[#45464d] block mb-1.5 font-medium">
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
          />
        </div>

        {/* 3. Bán kính quét */}
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#45464d] font-medium">
              Bán kính quét:
            </span>
            <span className="font-mono text-[#d95f00] font-bold text-xs bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded-full">
              {filters.radiusKm} km
            </span>
          </div>
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
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-medium">
            {[5, 15, 30, 50].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => onChangeFilters({ radiusKm: km })}
                className={cn(
                  'px-1.5 py-0.5 rounded hover:text-[#d95f00] transition-colors cursor-pointer',
                  filters.radiusKm === km &&
                    'font-bold text-[#d95f00] bg-orange-50',
                )}
              >
                {km}km
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
