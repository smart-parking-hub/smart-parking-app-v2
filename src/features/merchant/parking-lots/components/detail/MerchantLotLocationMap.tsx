import { LeafletMapView } from '@/shared/maps'

interface MerchantLotLocationMapProps {
  latitude: number
  longitude: number
  lotName?: string
  address?: string
  googleMapsEmbedUrl?: string | null
}

export function MerchantLotLocationMap({
  latitude,
  longitude,
  lotName,
  address,
  googleMapsEmbedUrl,
}: MerchantLotLocationMapProps) {
  const title = lotName ? `${lotName} · Vị trí bãi đỗ` : 'Nhà xe · Vị trí bãi đỗ'

  return (
    <div className="lot-location-map">
      <LeafletMapView
        coordinates={{ latitude, longitude }}
        markerTitle={title}
        address={address}
        googleMapsEmbedUrl={googleMapsEmbedUrl}
        zoom={15}
        ariaLabel="Bản đồ vị trí bãi đỗ"
        className="lot-location-map-canvas"
      />
    </div>
  )
}
