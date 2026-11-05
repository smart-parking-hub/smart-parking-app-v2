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
    /* Shows card stream with comfortable gap and responsive scroll */
    <div className="flex flex-col gap-4 xl:max-h-[1050px] xl:overflow-y-auto xl:pr-2 custom-scrollbar">
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
