import { useState } from 'react'
import { MapPin, Navigation, Search, X } from 'lucide-react'

interface SmartLocationBarProps {
  value: string
  onChange: (val: string) => void
  onLocateMe: () => void
  totalResults: number
  radiusKm: number
  includeFull: boolean
  onToggleIncludeFull: (val: boolean) => void
}

export function SmartLocationBar({
  value,
  onChange,
  onLocateMe,
  totalResults,
  radiusKm,
  includeFull,
  onToggleIncludeFull,
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
    <div className="flex flex-col gap-2.5 w-full">
      {/* Extended Search Input and Locate Button */}
      <div className="bg-white rounded-2xl p-2.5 shadow-sm flex items-center gap-3 border border-slate-200/80 w-full">
        <div className="flex items-center flex-1 gap-3 bg-[#eff4ff] px-4 py-3 rounded-xl transition-all focus-within:ring-2 focus-within:ring-[#d95f00]/20 focus-within:bg-[#eaf1ff]">
          <MapPin className="text-[#d95f00] w-5 h-5 shrink-0" />
          <input
            type="text"
            className="bg-transparent text-sm text-[#0d1c2e] font-medium w-full focus:outline-none placeholder:text-slate-400"
            placeholder="Nhập địa chỉ cảng, KCN hoặc bến bãi..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Địa chỉ tìm kiếm"
          />
          {value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
          )}
        </div>

        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          className="bg-[#233144] hover:bg-black text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap text-xs font-bold cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
        >
          <Navigation className={`w-4 h-4 text-[#d95f00] ${locating ? 'animate-spin' : ''}`} />
          <span className="uppercase tracking-wider">Vị trí của tôi</span>
        </button>
      </div>

      {/* Result Count (Left) & Full Lot Filter Toggle (Right) - Evenly Aligned */}
      <div className="flex items-center justify-between px-1.5 min-h-[36px]">
        {/* Left: Result indicator */}
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d95f00] shrink-0 block" />
          <p className="text-xs text-[#45464d] font-medium flex items-center gap-1.5">
            <span>Tìm thấy</span>
            <strong className="text-[#0d1c2e] font-bold">{totalResults} bãi xe</strong>
            <span>trong</span>
            <span className="font-mono font-bold text-[#0d1c2e]">{radiusKm} km</span>
          </p>
        </div>

        {/* Right: Toggle Include Full Lots */}
        <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeFull}
            onChange={(e) => onToggleIncludeFull(e.target.checked)}
            className="w-4 h-4 rounded text-[#d95f00] focus:ring-0 cursor-pointer accent-[#d95f00]"
          />
          <span className="text-xs text-[#0d1c2e] font-semibold whitespace-nowrap">
            Hiện bãi đã đầy
          </span>
        </label>
      </div>
    </div>
  )
}
