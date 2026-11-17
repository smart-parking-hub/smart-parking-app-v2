import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import {
  formatCoordinate,
  fromLatLng,
  getGoogleMapsConfig,
  GoogleMapsError,
  isValidCoordinates,
  loadGoogleMapsCore,
  roundCoordinate,
  subscribeGoogleMapsAuthFailure,
  toLatLngLiteral,
} from '@/shared/maps'
import { createParkingMarkerElement } from '@/entities/parking-lot/parkingGoogleMarker'

interface CreateParkingLotMapPickerProps {
  latitude: number
  longitude: number
  accuracy?: number
  onCoordinatesChange: (lat: number, lng: number) => void
}

const VIETNAM_OVERVIEW_CENTER = { lat: 16.05, lng: 108.2 }
const VIETNAM_OVERVIEW_ZOOM = 5

export function CreateParkingLotMapPicker({
  latitude,
  longitude,
  accuracy,
  onCoordinatesChange,
}: CreateParkingLotMapPickerProps) {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const mapsLibRef = useRef<google.maps.MapsLibrary | null>(null)
  const markerLibRef = useRef<google.maps.MarkerLibrary | null>(null)
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const markerDragListenerRef = useRef<google.maps.MapsEventListener | null>(null)
  const accuracyCircleRef = useRef<google.maps.Circle | null>(null)
  const onChange = useRef(onCoordinatesChange)

  const [ready, setReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    onChange.current = onCoordinatesChange
  }, [onCoordinatesChange])

  useEffect(() => {
    if (!container.current) return

    let disposed = false
    setReady(false)
    setMapError(null)

    const unsubscribeAuth = subscribeGoogleMapsAuthFailure(() => {
      if (disposed) return
      setMapError(
        'Khóa Google Maps API không hợp lệ hoặc bị từ chối quyền truy cập. Bạn vẫn có thể nhập tọa độ thủ công ở trên.',
      )
      setReady(false)
    })

    let clickListener: google.maps.MapsEventListener | null = null

    void loadGoogleMapsCore()
      .then(({ maps, marker }) => {
        if (disposed || !container.current) return
        const config = getGoogleMapsConfig()
        const instance = new maps.Map(container.current, {
          center: VIETNAM_OVERVIEW_CENTER,
          zoom: VIETNAM_OVERVIEW_ZOOM,
          mapId: config.mapId,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'greedy',
        })

        mapRef.current = instance
        mapsLibRef.current = maps
        markerLibRef.current = marker

        clickListener = instance.addListener(
          'click',
          (event: google.maps.MapMouseEvent) => {
            if (!event.latLng) return
            const coords = fromLatLng(event.latLng)
            onChange.current(
              roundCoordinate(coords.latitude, 7),
              roundCoordinate(coords.longitude, 7),
            )
          },
        )

        setReady(true)
      })
      .catch((error: unknown) => {
        if (disposed) return
        const message =
          error instanceof GoogleMapsError
            ? `${error.message} Bạn vẫn có thể nhập tọa độ ở trên.`
            : 'Không tải được Google Maps. Kiểm tra kết nối mạng hoặc nhập tọa độ ở trên.'
        setMapError(message)
      })

    return () => {
      disposed = true
      unsubscribeAuth()
      clickListener?.remove()
      markerDragListenerRef.current?.remove()
      markerDragListenerRef.current = null
      if (markerRef.current) {
        markerRef.current.map = null
        markerRef.current = null
      }
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setMap(null)
        accuracyCircleRef.current = null
      }
      mapRef.current = null
      mapsLibRef.current = null
      markerLibRef.current = null
    }
  }, [retryToken])

  useEffect(() => {
    const instance = mapRef.current
    const mapsLib = mapsLibRef.current
    const markerLib = markerLibRef.current
    if (!instance || !mapsLib || !markerLib || !ready) return

    const valid = isValidCoordinates({ latitude, longitude })
    if (!valid) {
      if (markerRef.current) {
        markerRef.current.map = null
        markerRef.current = null
      }
      markerDragListenerRef.current?.remove()
      markerDragListenerRef.current = null
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setMap(null)
        accuracyCircleRef.current = null
      }
      return
    }

    const position = toLatLngLiteral({ latitude, longitude })

    if (markerRef.current) {
      markerRef.current.position = position
    } else {
      const markerInstance = new markerLib.AdvancedMarkerElement({
        map: instance,
        position,
        title: 'Nhà xe · Vị trí đang chọn',
        content: createParkingMarkerElement({
          selected: true,
          title: 'Nhà xe · Vị trí đang chọn',
        }),
        gmpDraggable: true,
      })

      markerDragListenerRef.current =
        markerInstance.addListener?.('dragend', () => {
          const currentPos = markerInstance.position
          if (!currentPos) return
          const coords = fromLatLng(currentPos)
          onChange.current(
            roundCoordinate(coords.latitude, 7),
            roundCoordinate(coords.longitude, 7),
          )
        }) ?? null

      markerRef.current = markerInstance
    }

    if (
      typeof accuracy === 'number' &&
      Number.isFinite(accuracy) &&
      accuracy > 0 &&
      typeof mapsLib.Circle === 'function'
    ) {
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setCenter(position)
        accuracyCircleRef.current.setRadius(accuracy)
      } else {
        accuracyCircleRef.current = new mapsLib.Circle({
          map: instance,
          center: position,
          radius: accuracy,
          strokeColor: '#ea580c',
          strokeOpacity: 0.65,
          strokeWeight: 1.5,
          fillColor: '#ea580c',
          fillOpacity: 0.12,
          clickable: false,
        })
      }
    } else if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setMap(null)
      accuracyCircleRef.current = null
    }

    instance.panTo(position)
    instance.setZoom(16)
  }, [latitude, longitude, accuracy, ready])

  const hasFinitePair =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">Chọn vị trí bãi đỗ trên Google Maps</p>
      <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-slate-200">
        <div
          ref={container}
          role="region"
          aria-label="Bản đồ chọn vị trí bãi đỗ"
          data-map-state={mapError ? 'error' : ready ? 'ready' : 'loading'}
          className="relative z-0 h-full w-full"
        />

        {mapError && (
          <div
            role="alert"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 bg-slate-50/95 p-4 text-center text-xs text-slate-700"
          >
            <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
            <p className="max-w-md font-medium text-slate-800">{mapError}</p>
            <button
              type="button"
              onClick={() => setRetryToken((c) => c + 1)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Thử tải lại bản đồ
            </button>
          </div>
        )}
      </div>

      {hasFinitePair && (
        <p className="text-xs text-slate-500">
          Vị trí đang chọn: {formatCoordinate(latitude, 7)},{' '}
          {formatCoordinate(longitude, 7)}
        </p>
      )}
      <p className="text-sm text-slate-500">
        Nhấn trên bản đồ hoặc kéo ghim để đặt vị trí. Bạn cũng có thể nhập tọa
        độ hoặc lấy vị trí thiết bị.
      </p>
      {accuracy !== undefined && (
        <p className="text-xs text-slate-500">
          Sai số vị trí thiết bị: ±{Math.round(accuracy)} m.
        </p>
      )}
    </div>
  )
}
