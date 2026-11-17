import { GoogleMapView } from '@/shared/maps'
import { createParkingMarkerElement } from '@/entities/parking-lot/parkingGoogleMarker'

interface MerchantLotLocationMapProps {
  latitude: number
  longitude: number
  lotName?: string
  address?: string
}

export function MerchantLotLocationMap({
  latitude,
  longitude,
  lotName,
  address,
}: MerchantLotLocationMapProps) {
  const title = lotName ? `${lotName} · Vị trí bãi đỗ` : 'Nhà xe · Vị trí bãi đỗ'

  return (
    <div className="lot-location-map">
      <GoogleMapView
        coordinates={{ latitude, longitude }}
        markerTitle={title}
        address={address}
        zoom={15}
        ariaLabel="Bản đồ vị trí bãi đỗ"
        className="lot-location-map-canvas"
        markerContentFactory={() =>
          createParkingMarkerElement({
            selected: true,
            title,
          })
        }
      />
    </div>
  )
}
