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
    <div className="relative w-full bg-brand-surface font-inter">
      {/* Full-bleed Map Stage (occupies remaining screen height below DriverHeader while preserving DriverFooter below) */}
      <div className="relative isolate z-0 w-full lg:h-[calc(100dvh-var(--driver-header-height))] lg:min-h-[600px] flex flex-col lg:block lg:overflow-hidden">
        {/* Background Full-Bleed Map Canvas */}
        <div className="order-2 lg:order-none lg:absolute lg:inset-0 z-0 mt-2 lg:mt-0">
          <InteractiveMapCanvas
            lots={lots}
            selectedLot={selectedLot}
            origin={origin}
            onSelectLot={(lot) => parkingSearchStore.setSelectedLotId(lot.id)}
            onQuickBook={handleOpenQuickBook}
          />
        </div>

        {/* Top-Right Compact Search Bar Floating Over Map */}
        <div className="order-1 lg:order-none px-3 pt-3 lg:p-0 lg:absolute lg:top-4 lg:right-4 lg:z-30 lg:w-[min(490px,calc(100%-460px))] xl:w-[min(530px,calc(100%-492px))]">
          <SmartLocationBar
            value={searchText}
            onChange={(text) => {
              if (text === '') {
                parkingSearchStore.clearLocation()
              } else {
                parkingSearchStore.setSearchText(text)
              }
            }}
            onClear={() => parkingSearchStore.clearLocation()}
            onLocateMe={handleLocateMe}
            onSelectPlace={handleSelectPlace}
            parkingLots={lots}
            onSelectLot={(lot) => parkingSearchStore.setSelectedLotId(lot.id)}
          />
        </div>

        {/* Left Floating Dock: Filter Panel on Top + Enclosing Div for Yard Cards Below */}
        <div className="order-3 lg:order-none p-3 lg:p-0 lg:absolute lg:top-4 lg:bottom-4 lg:left-4 lg:z-20 lg:w-[400px] xl:w-[432px] flex flex-col gap-2.5 lg:pointer-events-none">
          <div className="lg:pointer-events-auto relative z-20 shrink-0">
            <TopFilterBar
              filters={filters}
              vehicles={vehicleOptions}
              onChangeFilters={handleFilterChange}
              totalResults={lots.length}
              onToggleIncludeFull={(includeFull) =>
                handleFilterChange({ includeFull })
              }
            />
          </div>

          {/* Enclosing Card Container for All Parking Yard Cards */}
          <div
            data-testid="parking-lots-container"
            className="lg:pointer-events-auto relative z-10 flex-1 min-h-0 flex flex-col rounded-2xl border border-brand-border/90 bg-white/95 backdrop-blur-md shadow-xl p-2 overflow-hidden"
          >
            {isLoading ? (
              <SearchParkingSkeleton />
            ) : error ? (
              <div
                role="alert"
                className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-center my-auto"
              >
                <AlertCircle className="w-9 h-9 text-rose-600 mx-auto mb-2" />
                <h4 className="font-sora text-sm font-bold text-rose-900">
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-semibold hover:bg-brand-orange-hover transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`}
                  />
                  <span>{isRefetching ? 'Đang thử lại...' : 'Tải lại bãi xe'}</span>
                </button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      {/* GAP-04: Inline Quick Reservation Drawer Panel (SCR-MOD-06) */}
      <InlineQuickBookPanel
        open={quickBookOpen}
        onClose={() => parkingSearchStore.closeQuickBook()}
        lot={quickBookLot || undefined}
      />
    </div>
  )
}
