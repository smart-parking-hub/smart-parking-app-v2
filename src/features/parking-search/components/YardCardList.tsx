import { AlertCircle } from 'lucide-react'
import type { ParkingLotItem } from '../types/parkingSearchTypes'
import { YardCardItem } from './YardCardItem'

interface YardCardListProps {
  lots: ParkingLotItem[]
  selectedLotId?: number
  onSelectLot: (lot: ParkingLotItem) => void
  onQuickBook: (lot: ParkingLotItem) => void
  onQueue?: (lot: ParkingLotItem) => void
}

export function YardCardList({
  lots,
  selectedLotId,
  onSelectLot,
  onQuickBook,
  onQueue,
}: YardCardListProps) {
  if (lots.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-sm">
        <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <h4 className="font-sora text-base font-bold text-[#0d1c2e]">
          Không tìm thấy bãi đỗ nào phù hợp
        </h4>
        <p className="text-xs text-[#45464d] mt-1 max-w-xs mx-auto">
          Hãy thử tăng bán kính quét hoặc bật tùy chọn &quot;Hiện bãi đã đầy&quot; trên thanh công cụ.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
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
