import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, RefreshCw } from 'lucide-react'

import type {
  ParkingLotItem,
  SearchFilterState,
} from '../types/parkingSearchTypes'
import {
  fetchParkingLots,
  fallbackVehicleOptions,
} from '../api/parkingSearchApi'
import { TopFilterBar } from '../components/TopFilterBar'
import { SmartLocationBar } from '../components/SmartLocationBar'
import { YardCardList } from '../components/YardCardList'
import { InteractiveMapCanvas } from '../components/InteractiveMapCanvas'
import { QuickBookingDrawer } from '../components/QuickBookingDrawer'
import { SearchParkingSkeleton } from '../components/SearchParkingSkeleton'

export function SearchParkingPage() {
  const [filters, setFilters] = useState<SearchFilterState>({
    selectedVehicleId: 'cont40',
    vehicleType: 'CONTAINER',
    radiusKm: 15,
    sortBy: 'distance',
    includeFull: true,
    keyword: '',
  })

  const [selectedLotId, setSelectedLotId] = useState<number>(1)
  const [quickBookLot, setQuickBookLot] = useState<ParkingLotItem | null>(null)
  const [quickBookOpen, setQuickBookOpen] = useState(false)

  const { data: lots = [], isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['parking-lots-search', filters],
    queryFn: () => fetchParkingLots(filters),
    staleTime: 30000,
  })

  const handleFilterChange = (updated: Partial<SearchFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }))
  }

  const selectedLot = lots.find((l) => l.id === selectedLotId) || lots[0]

  const handleOpenQuickBook = (lot: ParkingLotItem) => {
    setSelectedLotId(lot.id)
    setQuickBookLot(lot)
    setQuickBookOpen(true)
  }

  const handleLocateMe = () => {
    setFilters((prev) => ({
      ...prev,
      keyword: 'Vị trí hiện tại của tôi (GPS)',
    }))
  }

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#f8f9ff]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
        {/* Top Control Filter Bar: 3 Evenly Spaced Columns (Phương tiện -> Sắp xếp -> Bán kính) */}
        <TopFilterBar
          filters={filters}
          vehicles={fallbackVehicleOptions}
          onChangeFilters={handleFilterChange}
        />

        {/* Full-width Search & Result Stats Bar with 'Hiện bãi đã đầy' Toggle */}
        <div className="w-full mb-5">
          <SmartLocationBar
            value={filters.keyword}
            onChange={(keyword) => handleFilterChange({ keyword })}
            onLocateMe={handleLocateMe}
            totalResults={lots.length}
            radiusKm={filters.radiusKm}
            includeFull={filters.includeFull}
            onToggleIncludeFull={(includeFull) => handleFilterChange({ includeFull })}
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <SearchParkingSkeleton />
        ) : error ? (
          /* Error State */
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center my-6">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-2" />
            <h4 className="font-sora text-base font-bold text-rose-900">
              Không thể tải dữ liệu bản đồ bãi xe
            </h4>
            <p className="text-xs text-rose-700 mt-1 mb-4">
              Hệ thống tìm kiếm định vị tạm thời gián đoạn. Vui lòng kiểm tra mạng hoặc thử lại.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isRefetching}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d95f00] text-white text-xs font-semibold hover:bg-[#b85000] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
              <span>{isRefetching ? 'Đang thử lại...' : 'Tải lại bãi xe'}</span>
            </button>
          </div>
        ) : (
          /* Split View Workbench: Left Yard List (max 2 cards visible with internal scrollbar) and Right Map */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
            {/* Left Column: Operational Yard List (5 cols ~ 42%) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <YardCardList
                lots={lots}
                selectedLotId={selectedLotId}
                onSelectLot={(lot) => setSelectedLotId(lot.id)}
                onQuickBook={handleOpenQuickBook}
                onQueue={handleOpenQuickBook}
              />
            </div>

            {/* Right Column: Interactive Leaflet Map Canvas (7 cols ~ 58%) */}
            <div className="lg:col-span-7">
              <InteractiveMapCanvas
                lots={lots}
                selectedLot={selectedLot}
                onSelectLot={(lot) => setSelectedLotId(lot.id)}
                onQuickBook={handleOpenQuickBook}
              />
            </div>
          </div>
        )}

        {/* Inline Quick Reservation Drawer Modal */}
        <QuickBookingDrawer
          open={quickBookOpen}
          onClose={() => setQuickBookOpen(false)}
          lot={quickBookLot || undefined}
        />
      </div>
    </div>
  )
}
