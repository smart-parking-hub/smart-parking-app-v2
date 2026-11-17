import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import {
  formatCoordinate,
  getMapRuntimeConfig,
  isValidCoordinates,
  loadMapRuntimeConfig,
  roundCoordinate,
  toLatLngTuple,
} from '@/shared/maps'
import { createParkingLeafletIcon } from '@/entities/parking-lot/parkingMapMarker'

interface CreateParkingLotMapPickerProps {
  latitude: number
  longitude: number
  accuracy?: number
  onCoordinatesChange: (lat: number, lng: number) => void
}

const VIETNAM_OVERVIEW_CENTER: [number, number] = [16.05, 108.2]
const VIETNAM_OVERVIEW_ZOOM = 5

export function CreateParkingLotMapPicker({
  latitude,
  longitude,
  accuracy,
  onCoordinatesChange,
}: CreateParkingLotMapPickerProps) {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const accuracyCircleRef = useRef<L.Circle | null>(null)
  const onChange = useRef(onCoordinatesChange)

  const [ready, setReady] = useState(false)
  const [tilesState, setTilesState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  useEffect(() => {
    onChange.current = onCoordinatesChange
  }, [onCoordinatesChange])

  useEffect(() => {
    if (!container.current) return

    let disposed = false
    let tileLoaded = false
    setReady(false)
    setTilesState('loading')

    const instance = L.map(container.current).setView(
      VIETNAM_OVERVIEW_CENTER,
      VIETNAM_OVERVIEW_ZOOM,
    )
    mapRef.current = instance

    const initialConfig = getMapRuntimeConfig()

    const attachTiles = (tileUrl: string, attribution: string, maxZoom: number) => {
      if (disposed) return
      if (tileLayerRef.current) {
        tileLayerRef.current.remove()
      }
      const layer = L.tileLayer(tileUrl, {
        attribution,
        maxZoom,
      }).addTo(instance)

      layer.on('tileload', () => {
        if (disposed) return
        tileLoaded = true
        setTilesState('ready')
      })

      layer.on('tileerror', () => {
        if (!disposed && !tileLoaded) {
          setTilesState('error')
        }
      })

      tileLayerRef.current = layer
    }

    attachTiles(
      initialConfig.tileUrl,
      initialConfig.tileAttribution,
      initialConfig.maxZoom,
    )

    void loadMapRuntimeConfig().then((runtimeConfig) => {
      if (disposed) return
      if (
        runtimeConfig.tileUrl !== initialConfig.tileUrl ||
        runtimeConfig.tileAttribution !== initialConfig.tileAttribution ||
        runtimeConfig.maxZoom !== initialConfig.maxZoom
      ) {
        attachTiles(
          runtimeConfig.tileUrl,
          runtimeConfig.tileAttribution,
          runtimeConfig.maxZoom,
        )
      }
    })

    instance.on('click', (event: L.LeafletMouseEvent) => {
      onChange.current(
        roundCoordinate(event.latlng.lat, 7),
        roundCoordinate(event.latlng.lng, 7),
      )
    })

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => instance.invalidateSize())
        : null
    observer?.observe(container.current)

    setReady(true)

    return () => {
      disposed = true
      observer?.disconnect()
      markerRef.current = null
      accuracyCircleRef.current = null
      tileLayerRef.current = null
      instance.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const instance = mapRef.current
    if (!instance || !ready) return

    const valid = isValidCoordinates({ latitude, longitude })
    if (!valid) {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.remove()
        accuracyCircleRef.current = null
      }
      return
    }

    const position = toLatLngTuple({ latitude, longitude })

    if (markerRef.current) {
      markerRef.current.setLatLng(position)
    } else {
      const markerInstance = L.marker(position, {
        icon: createParkingLeafletIcon({
          selected: true,
          title: 'Nhà xe · Vị trí đang chọn',
        }),
        title: 'Nhà xe · Vị trí đang chọn',
        draggable: true,
        keyboard: true,
      }).addTo(instance)

      markerInstance.on('dragend', () => {
        const nextLatLng = markerInstance.getLatLng()
        onChange.current(
          roundCoordinate(nextLatLng.lat, 7),
          roundCoordinate(nextLatLng.lng, 7),
        )
      })

      markerRef.current = markerInstance
    }

    if (
      typeof accuracy === 'number' &&
      Number.isFinite(accuracy) &&
      accuracy > 0
    ) {
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setLatLng(position)
        accuracyCircleRef.current.setRadius(accuracy)
      } else {
        accuracyCircleRef.current = L.circle(position, {
          radius: accuracy,
          color: '#ea580c',
          opacity: 0.65,
          weight: 1.5,
          fillColor: '#ea580c',
          fillOpacity: 0.12,
          interactive: false,
        }).addTo(instance)
      }
    } else if (accuracyCircleRef.current) {
      accuracyCircleRef.current.remove()
      accuracyCircleRef.current = null
    }

    instance.setView(position, 16)
  }, [latitude, longitude, accuracy, ready])

  const hasFinitePair =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">
        Chọn vị trí bãi đỗ trên bản đồ OpenStreetMap
      </p>
      <div className="parking-map relative h-[360px] w-full overflow-hidden rounded-xl border border-slate-200">
        <div
          ref={container}
          role="region"
          aria-label="Bản đồ chọn vị trí bãi đỗ"
          data-map-state={tilesState}
          className="relative z-0 h-full w-full"
        />

        {tilesState === 'error' && (
          <div
            role="alert"
            className="absolute inset-x-3 bottom-3 z-[1000] flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-white/95 p-3 text-xs text-slate-700 shadow-md"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle
                className="h-4 w-4 shrink-0 text-amber-600"
                aria-hidden="true"
              />
              <span>
                Không tải được một số ô bản đồ OpenStreetMap. Bạn vẫn có thể
                nhập tọa độ hoặc dùng GPS ở trên.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setTilesState('loading')
                tileLayerRef.current?.redraw()
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-semibold text-slate-800 hover:bg-slate-100 cursor-pointer"
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
