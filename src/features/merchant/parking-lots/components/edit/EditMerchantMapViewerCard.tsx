import { Layers, MapPin, ExternalLink } from 'lucide-react'

interface EditMerchantMapViewerCardProps {
  latitude: number
  longitude: number
  isCalibrated?: boolean
  locationName?: string
}

export function EditMerchantMapViewerCard({
  latitude,
  longitude,
  isCalibrated = true,
  locationName = 'Đường Gò Cát, Phường Phú Hữu, TP Thủ Đức, TP Hồ Chí Minh',
}: EditMerchantMapViewerCardProps) {
  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white rounded-2xl p-5 space-y-4 shadow-2xs border border-slate-200/80">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#455f87]" />
          <h3 className="font-sora text-sm font-bold text-[#131b2e]">Tọa Độ Ghim Thực Địa</h3>
        </div>
        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[#e6eeff] text-[#131b2e] font-semibold border border-slate-200">
          RTK &lt; 0.5m
        </span>
      </div>

      {/* Simulated Satellite/Map Canvas */}
      <div className="relative w-full h-72 rounded-xl overflow-hidden bg-[#131b2e] border border-slate-300 shadow-inner group">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105 bg-[url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80')]"
          data-location={locationName}
        />

        {/* Dark Tactical Logistics Overlay */}
        <div className="absolute inset-0 bg-[#131b2e]/50 pointer-events-none" />

        {/* Road Axis Vector Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#eff4ff]/60 transform -rotate-6 pointer-events-none" />

        {/* Calibrated Pin Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none">
          <div className="px-2.5 py-1 rounded-md bg-[#341100] text-[#ffdbca] font-mono text-[10px] font-bold shadow-md uppercase tracking-wider whitespace-nowrap mb-1 border border-[#d95f00]/40">
            {isCalibrated ? 'VỊ TRÍ ĐÃ HIỆU CHỈNH' : 'VỊ TRÍ BAN ĐẦU'}
          </div>
          <MapPin className="w-9 h-9 text-[#d95f00] fill-[#d95f00] drop-shadow-lg animate-bounce" />
          <div className="w-6 h-1.5 rounded-full bg-black/60 blur-2xs mt-[-2px]" />
        </div>

        {/* Legend Overlay */}
        <div className="absolute top-3 left-3 bg-[#131b2e]/90 text-white px-2.5 py-1.5 rounded-lg font-mono text-[10px] space-y-0.5 backdrop-blur-xs border border-white/10 shadow-sm pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
            <span>LÀN BARIE: #01 (INBOUND)</span>
          </div>
          <div className="text-slate-300">BÁN KÍNH AN TOÀN: 25.0 MET</div>
        </div>

        {/* Open Google Maps Button */}
        <button
          type="button"
          onClick={handleOpenGoogleMaps}
          className="absolute bottom-3 right-3 bg-white text-[#131b2e] hover:bg-slate-100 px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-md border border-slate-200 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#455f87]" />
          <span>Google Maps</span>
        </button>
      </div>

      {/* Offset Analytics */}
      <div className="space-y-2 font-mono text-xs text-slate-700 bg-[#eff4ff] p-3 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <span>Độ lệch tim đường cũ:</span>
          <span className="text-red-600 font-bold">-15.2 mét (Khai báo sai)</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Độ lệch sau cân chỉnh:</span>
          <span
            className={`font-bold ${isCalibrated ? 'text-emerald-700' : 'text-amber-700'}`}
          >
            {isCalibrated ? '0.0 mét (Khớp Barie)' : '-15.2 mét (Chưa hiệu chỉnh)'}
          </span>
        </div>
      </div>
    </div>
  )
}
