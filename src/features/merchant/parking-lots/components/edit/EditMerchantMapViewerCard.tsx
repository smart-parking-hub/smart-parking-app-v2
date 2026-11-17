import { Layers, ExternalLink } from 'lucide-react'
import {
  buildGoogleMapsSearchUrl,
  GoogleMapView,
} from '@/shared/maps'

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
  locationName = '',
}: EditMerchantMapViewerCardProps) {
  const googleMapsUrl = buildGoogleMapsSearchUrl({
    coordinates: { latitude, longitude },
    query: locationName,
  })

  return (
    <div className="bg-white rounded-2xl p-5 space-y-4 shadow-2xs border border-slate-200/80">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#455f87]" />
          <h3 className="font-sora text-sm font-bold text-[#131b2e]">
            Tọa Độ Ghim Thực Địa
          </h3>
        </div>
        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[#e6eeff] text-[#131b2e] font-semibold border border-slate-200">
          {isCalibrated ? 'Google Maps' : 'Chưa hiệu chỉnh'}
        </span>
      </div>

      <div className="relative w-full h-72 rounded-xl overflow-hidden border border-slate-300 shadow-inner">
        <GoogleMapView
          coordinates={{ latitude, longitude }}
          markerTitle={locationName || 'Vị trí bãi đỗ'}
          address={locationName}
          zoom={16}
          ariaLabel="Bản đồ xem trước tọa độ bãi đỗ"
          className="w-full h-full"
        />
      </div>

      {googleMapsUrl && (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#131b2e] hover:bg-slate-100 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#455f87]" />
          <span>Mở trên Google Maps</span>
        </a>
      )}
    </div>
  )
}
