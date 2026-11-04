import { Navigation, MapPin, ExternalLink } from 'lucide-react'
import type { YardOperationalProfile } from '../../types/merchantParkingLotTypes'

interface MerchantLotGpsGuideCardProps {
  operationalProfile: YardOperationalProfile
  lotName: string
}

export function MerchantLotGpsGuideCard({
  operationalProfile,
  lotName,
}: MerchantLotGpsGuideCardProps) {
  const {
    gpsCoordinates,
    gpsFormatted,
    heightClearance,
    maxAxleWeightTons,
    mapSnapshotUrl,
    distanceToPort,
  } = operationalProfile

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${gpsCoordinates.lat},${gpsCoordinates.lng}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-slate-800">
          <Navigation className="w-4 h-4 text-slate-700" />
        </div>
        <div>
          <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold">
            Tọa Độ GPS &amp; Luồng Xe
          </h2>
          <p className="text-xs text-slate-500">Thông số kỹ thuật tĩnh không và định vị vệ tinh</p>
        </div>
      </div>

      {/* Mini Map Container */}
      <div
        className="w-full h-44 bg-cover bg-center rounded-xl relative overflow-hidden bg-slate-800 border border-slate-200/60 shadow-inner"
        style={{ backgroundImage: `url('${mapSnapshotUrl}')` }}
        title={`Bản đồ luồng xe tiếp cận bãi ${lotName}`}
      >
        <div className="absolute inset-0 bg-[#060D1A]/20" />
        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#131b2e] text-white font-mono text-[10px] font-bold tracking-wider shadow-xs">
          GATE 2 · CÁT LÁI
        </div>
        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-white text-[#0d1c2e] font-mono text-[10px] font-bold shadow-md">
          {distanceToPort}
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="flex flex-col gap-2.5 bg-[#eff4ff]/40 p-3.5 rounded-xl border border-slate-200/60 font-mono text-xs">
        <div className="flex justify-between items-center text-[#0d1c2e]">
          <span className="text-slate-500">Tọa Độ GPS:</span>
          <strong className="font-bold">{gpsFormatted}</strong>
        </div>
        <div className="flex justify-between items-center text-[#0d1c2e]">
          <span className="text-slate-500">Tĩnh Không Cổng:</span>
          <strong className="font-bold">{heightClearance}</strong>
        </div>
        <div className="flex justify-between items-center text-[#0d1c2e]">
          <span className="text-slate-500">Trọng Tải Cho Phép:</span>
          <strong className="font-bold">Tối đa {maxAxleWeightTons} Tấn</strong>
        </div>
      </div>

      {/* Action button */}
      <button
        type="button"
        onClick={handleOpenGoogleMaps}
        className="w-full py-2.5 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#d5e3fc] text-[#0d1c2e] font-semibold text-xs lg:text-sm transition-colors flex items-center justify-center gap-2 border border-slate-200/80 cursor-pointer shadow-2xs"
      >
        <MapPin className="w-4 h-4 text-[#d95f00]" />
        <span>Mở trên Google Maps Dẫn Đường</span>
        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
      </button>
    </div>
  )
}
