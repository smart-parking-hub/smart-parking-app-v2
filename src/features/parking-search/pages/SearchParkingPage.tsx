import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, RefreshCw } from 'lucide-react'

import {
  searchFilterSchema,
  type ParkingLotItem,
  type SearchFilterState,
} from '../types/parkingSearchTypes'
import {
  fetchParkingLots,
} from '../api/parkingSearchApi'
import {
  useParkingSearchStore,
  parkingSearchStore,
} from '../store/parkingSearchStore'
import { fetchVehicles } from '@/features/booking-flow'
import { TopFilterBar } from '../components/TopFilterBar'
import { SmartLocationBar } from '../components/SmartLocationBar'
import { YardCardList } from '../components/YardCardList'
import { InteractiveMapCanvas } from '../components/InteractiveMapCanvas'
import { InlineQuickBookPanel } from '../components/InlineQuickBookPanel'
import { SearchParkingSkeleton } from '../components/SearchParkingSkeleton'
import type { Coordinates, Place } from '../api/mapProvider'

export function SearchParkingPage() {
  const vehicleQuery = useQuery({ queryKey: ['booking-vehicles'], queryFn: fetchVehicles, retry: false })
  const vehicleOptions = (vehicleQuery.data ?? []).map(vehicle => ({ id: String(vehicle.id), label: vehicle.licensePlate, type: vehicle.vehicleType }))
  const filters = useParkingSearchStore((s) => s.filters)
  const selectedLotId = useParkingSearchStore((s) => s.selectedLotId)
  const quickBookLot = useParkingSearchStore((s) => s.quickBookLot)
  const quickBookOpen = useParkingSearchStore((s) => s.quickBookOpen)
  const searchText = useParkingSearchStore((s) => s.searchText)
  const origin = useParkingSearchStore((s) => s.origin)

  useEffect(() => {
    if (vehicleQuery.data?.length && !filters.selectedVehicleId.startsWith('type:') && !vehicleQuery.data.some(vehicle => String(vehicle.id) === filters.selectedVehicleId)) {
      parkingSearchStore.setFilters({ selectedVehicleId: String(vehicleQuery.data[0].id), vehicleType: vehicleQuery.data[0].vehicleType })
    }
  }, [vehicleQuery.data, filters.selectedVehicleId])
  // Validate filter parameters with Zod schema
  const parsedFilters = searchFilterSchema.safeParse(filters)
  const validFilters = parsedFilters.success ? parsedFilters.data : filters

  const {
    data: lots = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['parking-lots-search', validFilters],
    queryFn: () => fetchParkingLots(validFilters),
    staleTime: 30000,
  })

  const handleFilterChange = (updated: Partial<SearchFilterState>) => {
    parkingSearchStore.setFilters(updated)
  }

  const selectedLot = lots.find((l) => l.id === selectedLotId) || lots[0]

  const handleOpenQuickBook = (lot: ParkingLotItem) => {
    parkingSearchStore.openQuickBook(lot)
  }

  const handleLocateMe = (point: Coordinates) => {
    parkingSearchStore.locateMe(point)
  }

  const handleSelectPlace = (place: Place) => {
    parkingSearchStore.selectPlace(place)
  }

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-brand-surface font-inter">
      <div className="mx-auto w-full max-w-[1800px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10 2xl:px-14">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[.2em] text-brand-muted">
              SMARTTRUCK / TÌM ĐIỂM ĐỖ
            </p>
            <h1 className="font-sora text-3xl font-semibold leading-snug tracking-tight text-brand-navy lg:text-4xl">
              Điểm đỗ phù hợp. Hành trình an tâm.
            </h1>
            <p className="mt-3 text-base text-brand-muted">
              Chọn phương tiện, khám phá bãi đỗ và giữ chỗ trước khi đến.
            </p>
          </div>
          <span className="rounded-full border border-brand-border bg-white px-4 py-2 text-sm text-brand-muted">
            Bản đồ OpenStreetMap
          </span>
        </header>

        {/* Top Control Filter Bar: 3 Evenly Spaced Columns (Phương tiện -> Sắp xếp -> Bán kính) */}
        <TopFilterBar
          filters={filters}
          vehicles={vehicleOptions}
          onChangeFilters={handleFilterChange}
        />

        {/* Full-width Search & Result Stats Bar with 'Hiện bãi đã đầy' Toggle */}
        <div className="w-full mb-5">
          <SmartLocationBar
            value={searchText}
            onChange={(text) => parkingSearchStore.setSearchText(text)}
            onLocateMe={handleLocateMe}
            onSelectPlace={handleSelectPlace}
            totalResults={lots.length}
            radiusKm={filters.radiusKm}
            includeFull={filters.includeFull}
            onToggleIncludeFull={(includeFull) =>
              handleFilterChange({ includeFull })
            }
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <SearchParkingSkeleton />
        ) : error ? (
          /* Error State (Mã lỗi: ERR_GEO_DISPATCH_TIMEOUT) */
          <div
            role="alert"
            className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center my-6"
          >
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-2" />
            <h4 className="font-sora text-base font-bold text-rose-900">
              Không thể tải dữ liệu bản đồ bãi xe (Mã lỗi: ERR_GEO_DISPATCH_TIMEOUT)
            </h4>
            <p className="text-xs text-rose-700 mt-1 mb-4">
              Hệ thống tìm kiếm định vị tạm thời gián đoạn. Vui lòng kiểm tra
              mạng hoặc thử lại.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isRefetching}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-semibold hover:bg-brand-orange-hover transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`}
              />
              <span>{isRefetching ? 'Đang thử lại...' : 'Tải lại bãi xe'}</span>
            </button>
          </div>
        ) : (
          /* Split View Workbench: Left Yard List and Right Map */
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(380px,0.8fr)_minmax(0,1.35fr)] gap-7 2xl:gap-10 items-start mt-2">
            {/* Left Column: Operational Yard List (5 cols ~ 42%) */}
            <div className="min-w-0 flex flex-col gap-4">
              <YardCardList
                lots={lots}
                selectedLotId={selectedLot?.id}
                onSelectLot={(lot) => parkingSearchStore.setSelectedLotId(lot.id)}
                onQuickBook={handleOpenQuickBook}
                onQueue={handleOpenQuickBook}
                radiusKm={filters.radiusKm}
                includeFull={filters.includeFull}
                onExpandRadius={() => handleFilterChange({ radiusKm: 35 })}
                onToggleIncludeFull={() =>
                  handleFilterChange({ includeFull: !filters.includeFull })
                }
                onResetFilters={() => parkingSearchStore.resetFilters()}
              />
            </div>

            {/* Right Column: Interactive Leaflet Map Canvas (7 cols ~ 58%) */}
            <div className="min-w-0">
              <InteractiveMapCanvas
                lots={lots}
                selectedLot={selectedLot}
                origin={origin}
                onSelectLot={(lot) => parkingSearchStore.setSelectedLotId(lot.id)}
                onQuickBook={handleOpenQuickBook}
              />
            </div>
          </div>
        )}

        {/* GAP-04: Inline Quick Reservation Drawer Panel (SCR-MOD-06) */}
        <InlineQuickBookPanel
          open={quickBookOpen}
          onClose={() => parkingSearchStore.closeQuickBook()}
          lot={quickBookLot || undefined}
        />
      </div>
    </div>
  )
}
