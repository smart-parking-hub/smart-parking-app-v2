import { useState } from 'react'
import { MapPin, Navigation, Search, X } from 'lucide-react'

interface SmartLocationBarProps {
  value: string
  onChange: (val: string) => void
  onLocateMe: () => void
  totalResults: number
  radiusKm: number
  filterLabel: string
}

export function SmartLocationBar({
  value,
  onChange,
  onLocateMe,
  totalResults,
  radiusKm,
  filterLabel,
}: SmartLocationBarProps) {
  const [locating, setLocating] = useState(false)

  const handleLocate = () => {
    setLocating(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocating(false)
          onLocateMe()
        },
        () => {
          setLocating(false)
          onLocateMe()
        },
      )
    } else {
      setLocating(false)
      onLocateMe()
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search Input and Locate Button */}
      <div className="bg-white rounded-2xl p-2 shadow-sm flex items-center gap-2 border border-slate-200/80">
        <div className="flex items-center flex-1 gap-2 bg-[#eff4ff] px-3 py-2 rounded-xl">
          <MapPin className="text-[#d95f00] w-5 h-5 shrink-0" />
          <input
            type="text"
            className="bg-transparent text-xs lg:text-sm text-[#0d1c2e] font-medium w-full focus:outline-none placeholder:text-slate-400"
            placeholder="Nhập địa chỉ cảng, KCN hoặc bến bãi..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Địa chỉ tìm kiếm"
          />
          {value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-slate-400" />
          )}
        </div>

        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          className="bg-[#233144] hover:bg-black text-white px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap text-xs font-bold cursor-pointer disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 text-[#d95f00] ${locating ? 'animate-spin' : ''}`} />
          <span className="uppercase">Vị trí của tôi</span>
        </button>
      </div>

      {/* Result Count & Operational Signal */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d95f00] animate-pulse" />
          <p className="text-xs text-[#45464d] font-medium">
            Tìm thấy <strong className="text-[#0d1c2e] font-bold">{totalResults} bãi xe</strong>{' '}
            trong <span className="font-mono font-semibold">{radiusKm} km</span>
          </p>
        </div>
        <span className="font-mono text-xs text-[#455f87] font-semibold text-right">
          Lọc: {filterLabel}
        </span>
      </div>
    </div>
  )
}
