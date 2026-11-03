import { Truck } from 'lucide-react'
import type {
  SearchFilterState,
  VehicleClassification,
  VehicleOption,
} from '../types/parkingSearchTypes'

interface TopFilterBarProps {
  filters: SearchFilterState
  vehicles: VehicleOption[]
  onChangeFilters: (updated: Partial<SearchFilterState>) => void
}

const VEHICLE_TYPES: { type: VehicleClassification; label: string }[] = [
  { type: 'CONTAINER', label: 'Container 40/45FT' },
  { type: 'HEAVY_TRUCK', label: 'Tải nặng (>10T)' },
  { type: 'MEDIUM_TRUCK', label: 'Tải trung (3.5-10T)' },
  { type: 'LIGHT_TRUCK', label: 'Tải nhỏ (<3.5T)' },
  { type: 'SEDAN_SUV', label: 'Khách / Sedan' },
]

export function TopFilterBar({
  filters,
  vehicles,
  onChangeFilters,
}: TopFilterBarProps) {
  const handleSelectVehicle = (vehicleId: string) => {
    const v = vehicles.find((item) => item.id === vehicleId)
    onChangeFilters({
      selectedVehicleId: vehicleId,
      vehicleType: v ? v.type : filters.vehicleType,
    })
  }

  return (
    <section className="w-full bg-white shadow-sm rounded-2xl p-4 lg:p-5 mb-5 border border-slate-200/80">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Vehicle Selector & Type Badges */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Vehicle Selector */}
          <div className="relative min-w-[270px]">
            <span className="text-xs text-[#45464d] block mb-1 font-medium">
              Phương tiện điều hành
            </span>
            <div className="flex items-center gap-2 bg-[#eff4ff] px-3 py-2 rounded-xl border border-blue-100">
              <Truck className="w-5 h-5 text-[#455f87] shrink-0" />
              <select
                className="bg-transparent text-xs lg:text-sm font-semibold text-[#0d1c2e] focus:outline-none w-full cursor-pointer"
                value={filters.selectedVehicleId}
                onChange={(e) => handleSelectVehicle(e.target.value)}
                aria-label="Chọn phương tiện điều hành"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vehicle Classification Badges */}
          <div className="flex flex-col flex-1">
            <span className="text-xs text-[#45464d] block mb-1 font-medium">
              Loại phương tiện tải trọng
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {VEHICLE_TYPES.map(({ type, label }) => {
                const isActive = filters.vehicleType === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onChangeFilters({ vehicleType: type })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-[#eff4ff] text-[#0d1c2e] hover:bg-[#dce9ff]'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Radius Slider + Sort + Full Lot Checkbox */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          {/* Radius Slider */}
          <div className="flex flex-col min-w-[160px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#45464d]">Bán kính quét:</span>
              <span className="font-mono text-[#d95f00] font-bold text-xs">
                {filters.radiusKm} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.radiusKm}
              onChange={(e) => onChangeFilters({ radiusKm: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-[#d95f00]"
              aria-label="Bán kính quét"
            />
          </div>

          {/* Sort Select */}
          <div className="flex flex-col min-w-[130px]">
            <span className="text-xs text-[#45464d] mb-1">Sắp xếp theo</span>
            <select
              className="bg-[#eff4ff] text-[#0d1c2e] text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none cursor-pointer border border-blue-100"
              value={filters.sortBy}
              onChange={(e) =>
                onChangeFilters({
                  sortBy: e.target.value as 'distance' | 'price' | 'rating',
                })
              }
              aria-label="Tiêu chí sắp xếp"
            >
              <option value="distance">Gần nhất (Distance)</option>
              <option value="price">Giá thấp nhất</option>
              <option value="rating">Đánh giá trạm cao nhất</option>
            </select>
          </div>

          {/* Full lot toggle */}
          <div className="flex flex-col justify-end pt-3 sm:pt-0">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.includeFull}
                onChange={(e) => onChangeFilters({ includeFull: e.target.checked })}
                className="w-4 h-4 rounded text-[#d95f00] focus:ring-0 cursor-pointer accent-[#d95f00]"
              />
              <span className="text-xs text-[#0d1c2e] font-medium whitespace-nowrap">
                Hiện bãi đã đầy
              </span>
            </label>
          </div>
        </div>
      </div>
    </section>
  )
}
