import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  Check,
  Loader2,
  MapPin,
  Search,
  Star,
  Truck,
  Warehouse,
  X,
} from 'lucide-react'
import type {
  ParkingLotItem,
  SearchFilterState,
  VehicleClassification,
  VehicleOption,
} from '../types/parkingSearchTypes'
import { rankParkingLotSuggestions } from '../api/parkingSearchApi'
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
  activeLots?: ParkingLotItem[]
  isLoadingSuggestions?: boolean
  suggestionsError?: boolean
  onSearchFocus?: () => void
  onSelectSuggestedLot?: (lot: ParkingLotItem) => void
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
  activeLots = [],
  isLoadingSuggestions = false,
  suggestionsError = false,
  onSearchFocus,
  onSelectSuggestedLot,
}: TopFilterBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const trimmedKeyword = filters.keyword.trim()

  const suggestions = useMemo(() => {
    const eligible = filters.includeFull
      ? activeLots
      : activeLots.filter((lot) => !lot.isFull && lot.availableSlots > 0)

    if (!trimmedKeyword) {
      return eligible.slice(0, 6)
    }
    return rankParkingLotSuggestions(eligible, trimmedKeyword, 8)
  }, [activeLots, filters.includeFull, trimmedKeyword])

  useEffect(() => {
    setActiveIndex((prev) =>
      prev >= suggestions.length ? suggestions.length - 1 : prev,
    )
  }, [suggestions.length])

  const handleSelectSuggestion = (lot: ParkingLotItem) => {
    onChangeFilters({ keyword: lot.name })
    onSelectSuggestedLot?.(lot)
    setDropdownOpen(false)
    setActiveIndex(-1)
  }

  const handleClearKeyword = () => {
    onChangeFilters({ keyword: '' })
    setActiveIndex(-1)
  }

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

  const showDropdown =
    dropdownOpen &&
    (trimmedKeyword.length > 0 ||
      isLoadingSuggestions ||
      suggestionsError ||
      suggestions.length > 0)

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
          Google Maps · OSRM
        </span>
      </div>

      {/* Real-time Active Parking Lot Search (Database-backed, zero mock data) */}
      <div ref={searchWrapperRef} className="relative mb-2.5">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-[#f4f7fc] px-2.5 h-9 transition-colors focus-within:border-brand-orange focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-orange/15">
          {isLoadingSuggestions ? (
            <Loader2
              className="w-3.5 h-3.5 text-brand-orange shrink-0 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Search
              className="w-3.5 h-3.5 text-[#455f87] shrink-0"
              aria-hidden="true"
            />
          )}
          <input
            type="text"
            role="combobox"
            aria-label="Tìm nhanh bãi đỗ đang hoạt động"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-controls={listboxId}
            aria-activedescendant={
              activeIndex >= 0 && suggestions[activeIndex]
                ? `${listboxId}-opt-${suggestions[activeIndex].id}`
                : undefined
            }
            value={filters.keyword}
            placeholder="Tìm nhanh tên bãi đỗ hoặc địa chỉ..."
            onFocus={() => {
              setDropdownOpen(true)
              onSearchFocus?.()
            }}
            onChange={(event) => {
              onChangeFilters({ keyword: event.target.value })
              setDropdownOpen(true)
              setActiveIndex(-1)
              onSearchFocus?.()
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                if (!dropdownOpen) {
                  setDropdownOpen(true)
                  onSearchFocus?.()
                }
                if (suggestions.length > 0) {
                  setActiveIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : 0,
                  )
                }
              } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                if (suggestions.length > 0) {
                  setActiveIndex((prev) =>
                    prev > 0 ? prev - 1 : suggestions.length - 1,
                  )
                }
              } else if (event.key === 'Enter') {
                if (dropdownOpen && activeIndex >= 0 && suggestions[activeIndex]) {
                  event.preventDefault()
                  handleSelectSuggestion(suggestions[activeIndex])
                } else if (dropdownOpen && trimmedKeyword && suggestions.length === 1) {
                  event.preventDefault()
                  handleSelectSuggestion(suggestions[0])
                }
              } else if (event.key === 'Escape') {
                setDropdownOpen(false)
                setActiveIndex(-1)
              }
            }}
            className="w-full min-w-0 bg-transparent text-xs font-medium text-brand-navy placeholder:text-slate-400 focus:outline-none"
          />
          {filters.keyword.length > 0 && (
            <button
              type="button"
              aria-label="Xóa từ khóa bãi đỗ"
              onClick={handleClearKeyword}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/70 hover:text-brand-navy transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </button>
          )}
        </div>

        {showDropdown && (
          <div
            id={listboxId}
            role="listbox"
            aria-label="Gợi ý bãi đỗ đang hoạt động"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-64 overflow-y-auto custom-scrollbar rounded-xl border border-brand-border bg-white p-1.5 shadow-xl"
          >
            <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>
                {trimmedKeyword
                  ? 'Bãi đang hoạt động phù hợp'
                  : 'Bãi đang hoạt động'}
              </span>
              {isLoadingSuggestions && (
                <span className="font-medium normal-case text-brand-orange">
                  Đang đồng bộ...
                </span>
              )}
            </div>

            {suggestionsError && suggestions.length === 0 ? (
              <p className="px-2.5 py-2.5 text-xs text-rose-600">
                Không thể tải danh sách bãi đỗ đang hoạt động từ máy chủ.
              </p>
            ) : suggestions.length === 0 ? (
              isLoadingSuggestions ? (
                <p className="px-2.5 py-2.5 text-xs text-slate-500">
                  Đang tải dữ liệu bãi đỗ từ hệ thống...
                </p>
              ) : (
                <p className="px-2.5 py-2.5 text-xs text-slate-500">
                  {trimmedKeyword
                    ? `Không tìm thấy bãi đỗ đang hoạt động phù hợp với “${trimmedKeyword}”.`
                    : 'Chưa có bãi đỗ đang hoạt động phù hợp với loại xe này.'}
                </p>
              )
            ) : (
              suggestions.map((lot, index) => {
                const isActive = index === activeIndex
                const isLotFull = lot.isFull || lot.availableSlots === 0
                return (
                  <button
                    key={lot.id}
                    id={`${listboxId}-opt-${lot.id}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => handleSelectSuggestion(lot)}
                    className={cn(
                      'w-full flex items-start justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer',
                      isActive ? 'bg-orange-50/90' : 'hover:bg-slate-50',
                    )}
                  >
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <Warehouse
                        className={cn(
                          'w-3.5 h-3.5 mt-0.5 shrink-0',
                          isLotFull ? 'text-rose-500' : 'text-brand-orange',
                        )}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-brand-navy truncate">
                          {lot.name}
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5">
                          <MapPin
                            className="w-3 h-3 shrink-0 text-slate-400"
                            aria-hidden="true"
                          />
                          <span className="truncate">{lot.address}</span>
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-0.5 tabular-nums">
                      <span className="text-[11px] font-bold text-brand-navy">
                        {new Intl.NumberFormat('vi-VN').format(lot.hourlyRate)}{' '}
                        đ/h
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-semibold',
                          isLotFull ? 'text-rose-600' : 'text-emerald-700',
                        )}
                      >
                        {isLotFull
                          ? 'Hết chỗ'
                          : `Còn ${lot.availableSlots} chỗ`}
                      </span>
                      {lot.ratingAverage > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-medium">
                          <Star
                            className="w-2.5 h-2.5 fill-amber-400 text-amber-400"
                            aria-hidden="true"
                          />
                          {lot.ratingAverage.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        )}
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
              background: `linear-gradient(to right, var(--color-brand-orange) 0%, var(--color-brand-orange) ${radiusPercent}%, var(--color-brand-border) ${radiusPercent}%, var(--color-brand-border) 100%)`,
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
