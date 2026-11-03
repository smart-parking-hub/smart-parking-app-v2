import { useState } from 'react'
import { Layers, Plus, Minus, Truck, ShieldCheck, ArrowUpDown } from 'lucide-react'

interface CreateParkingLotMapPickerProps {
  latitude: number
  longitude: number
  accuracy?: number
  onCoordinatesChange: (lat: number, lng: number) => void
}

export function CreateParkingLotMapPicker({
  latitude,
  longitude,
  accuracy,
  onCoordinatesChange,
}: CreateParkingLotMapPickerProps) {
  const [zoomLevel, setZoomLevel] = useState(16)
  const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite'>('osm')

  // Handle map click to reposition pin slightly around current coordinate
  const handleMapCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    // Small delta adjustment corresponding to click offset
    const deltaLat = -(y / rect.height) * 0.002
    const deltaLng = (x / rect.width) * 0.002

    const newLat = Number((latitude + deltaLat).toFixed(7))
    const newLng = Number((longitude + deltaLng).toFixed(7))
    onCoordinatesChange(newLat, newLng)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Map Control Bar */}
      <div className="flex items-center justify-between text-xs font-semibold text-[#0d1c2e]">
        <span className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#d95f00]" />
          <span>Bản Đồ Định Vị Số Ranh Giới &amp; Trọng Tải Tiếp Cận</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveLayer(activeLayer === 'osm' ? 'satellite' : 'osm')}
            className="flex items-center gap-1 bg-[#eff4ff] hover:bg-[#d5e3fc] px-2.5 py-1 rounded-md font-mono text-[11px] text-[#0d1c2e] transition-colors border border-slate-200"
          >
            <span className="font-bold">
              {activeLayer === 'osm' ? 'LỚP: OSM VẬN TẢI CÁT LÁI' : 'LỚP: VỆ TINH PHÚ HỮU'}
            </span>
            <span className="text-slate-500">· TỈ LỆ 1:{zoomLevel * 150}</span>
          </button>
        </div>
      </div>

      {/* Viewfinder Canvas Frame */}
      <div
        onClick={handleMapCanvasClick}
        className="relative w-full h-[340px] rounded-2xl overflow-hidden shadow-inner bg-[#0d1c2e] flex flex-col justify-between p-4 cursor-crosshair border border-slate-300 select-none group"
        style={{
          backgroundImage:
            activeLayer === 'osm'
              ? 'radial-gradient(#cad7ea 1.5px, transparent 1.5px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)'
              : 'url("https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: activeLayer === 'osm' ? '24px 24px, 48px 48px, 48px 48px' : 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Subtle blueprint grid overlay for architectural logistics rigor */}
        <div className="absolute inset-0 bg-[#0d1c2e]/60 pointer-events-none" />

        {/* Top floating tools inside Map */}
        <div className="relative z-10 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 bg-[#0d1c2e]/90 text-white px-3 py-1.5 rounded-lg backdrop-blur-xs font-mono text-[11px] border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-ping" />
            <span>ZONE: DEPOT-GATE-ALPR-01</span>
          </div>

          <div className="flex flex-col gap-1 bg-white/95 rounded-lg p-1 shadow-md border border-slate-200">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setZoomLevel((z) => Math.min(z + 1, 20))
              }}
              className="w-7 h-7 flex items-center justify-center text-[#0d1c2e] hover:bg-slate-100 rounded-md font-bold text-sm cursor-pointer"
              title="Phóng to"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setZoomLevel((z) => Math.max(z - 1, 10))
              }}
              className="w-7 h-7 flex items-center justify-center text-[#0d1c2e] hover:bg-slate-100 rounded-md font-bold text-sm cursor-pointer"
              title="Thu nhỏ"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Anchor Marker */}
        <div className="relative z-10 mx-auto my-auto flex flex-col items-center pointer-events-none transform -translate-y-2 transition-transform duration-200 group-hover:scale-105">
          <div className="px-2.5 py-1 rounded-md bg-[#0d1c2e] text-white font-mono text-[11px] font-bold tracking-tight shadow-md flex items-center gap-1.5 mb-1 border border-[#d95f00]">
            <span className="w-2 h-2 rounded-full bg-[#d95f00]" />
            <span>TỌA ĐỘ BÃI ĐỖ MỚI</span>
          </div>

          <div className="w-10 h-10 rounded-full bg-[#341100] flex items-center justify-center text-[#d95f00] shadow-xl ring-4 ring-[#d95f00]/40">
            <Truck className="w-5 h-5 text-[#d95f00]" />
          </div>
          <div className="w-2.5 h-2.5 bg-[#d95f00] rotate-45 -mt-1.5 shadow-sm" />
        </div>

        {/* Map Footer Status Readout */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-[#0d1c2e]/95 text-white p-2.5 rounded-xl font-mono text-[11px] border border-slate-700/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ffb690]" />
            <span>
              Sai số định vị: {accuracy ? `±${Math.round(accuracy)}m` : '< 0.8m'} (RTK DGPS Verified)
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#ffdbca]">
            <ArrowUpDown className="w-4 h-4" />
            <span>Tĩnh không trục tiếp cận: 4.8m (Đạt chuẩn Container 40FT/45FT)</span>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 italic mt-0.5">
        * Nhấn trực tiếp lên bản đồ để điều chỉnh tâm ghim chốt trạm barie ALPR cho đoàn xe tải tiếp cận.
      </p>
    </div>
  )
}
