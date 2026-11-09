import type { ParkingLotItem } from '../types/parkingSearchTypes'
import { YardCardItem } from './YardCardItem'
import { SearchParkingEmptyState } from './SearchParkingEmptyState'

interface YardCardListProps {
  lots: ParkingLotItem[]
  selectedLotId?: number
  onSelectLot: (lot: ParkingLotItem) => void
  onQuickBook: (lot: ParkingLotItem) => void
  onQueue?: (lot: ParkingLotItem) => void
  radiusKm?: number
  includeFull?: boolean
  onExpandRadius?: () => void
  onToggleIncludeFull?: () => void
  onResetFilters?: () => void
}

export function YardCardList({
  lots,
  selectedLotId,
  onSelectLot,
  onQuickBook,
  onQueue,
  radiusKm = 15,
  includeFull = true,
  onExpandRadius,
  onToggleIncludeFull,
  onResetFilters,
}: YardCardListProps) {
  if (lots.length === 0) {
    return (
      <SearchParkingEmptyState
        radiusKm={radiusKm}
        includeFull={includeFull}
        onExpandRadius={onExpandRadius || (() => {})}
        onToggleIncludeFull={onToggleIncludeFull || (() => {})}
        onResetFilters={onResetFilters || (() => {})}
      />
    )
  }

  return (
    /* Shows card stream inside the enclosing left container with padded scrollport so rounded borders are never clipped */
    <div className="flex flex-col gap-2 flex-1 min-h-0 lg:overflow-y-auto p-1 pr-1.5 custom-scrollbar">
      {lots.map((lot) => (
        <YardCardItem
          key={lot.id}
          lot={lot}
          isSelected={selectedLotId === lot.id}
          onSelect={onSelectLot}
          onQuickBook={onQuickBook}
          onQueue={onQueue}
        />
      ))}
    </div>
  )
}
