import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import {
  createAccuracyCircleGeoJson,
  ensureMapLibreWorkerConfigured,
  formatCoordinate,
  getMapRuntimeConfig,
  isValidCoordinates,
  loadMapRuntimeConfig,
  resolveMapStyle,
  roundCoordinate,
  toLngLatTuple,
  type MapBasemapId,
} from '@/shared/maps'
import { createParkingMarkerElement } from '@/entities/parking-lot/parkingMapMarker'

interface CreateParkingLotMapPickerProps {
  latitude: number
  longitude: number
  accuracy?: number
  onCoordinatesChange: (lat: number, lng: number) => void
}

const VIETNAM_OVERVIEW_CENTER: [number, number] = [108.2, 16.05]
const VIETNAM_OVERVIEW_ZOOM = 5
const ACCURACY_SOURCE_ID = 'picker-gps-accuracy'
const ACCURACY_FILL_LAYER_ID = 'picker-gps-accuracy-fill'
const ACCURACY_LINE_LAYER_ID = 'picker-gps-accuracy-line'

export function CreateParkingLotMapPicker({
  latitude,
  longitude,
  accuracy,
  onCoordinatesChange,
}: CreateParkingLotMapPickerProps) {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const onChange = useRef(onCoordinatesChange)

  const [ready, setReady] = useState(false)
  const [styleVersion, setStyleVersion] = useState(0)
  const [mapState, setMapState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )
  const [activeBasemap, setActiveBasemap] = useState<MapBasemapId>(
    () => getMapRuntimeConfig().defaultBasemap,
  )
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    onChange.current = onCoordinatesChange
  }, [onCoordinatesChange])

  useEffect(() => {
    if (!container.current) return

    let disposed = false
    let loaded = false
    setReady(false)
    setStyleVersion(0)
    setMapState('loading')

    const initialConfig = getMapRuntimeConfig()
    const initialBasemap = initialConfig.defaultBasemap
    setActiveBasemap(initialBasemap)

    let instance: maplibregl.Map
    try {
      ensureMapLibreWorkerConfigured()
      instance = new maplibregl.Map({
        container: container.current,
        style: resolveMapStyle(initialConfig, initialBasemap),
        center: VIETNAM_OVERVIEW_CENTER,
        zoom: VIETNAM_OVERVIEW_ZOOM,
        attributionControl: { compact: true },
      })
    } catch {
      setMapState('error')
      return
    }

    mapRef.current = instance
    instance.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right',
    )

    instance.on('load', () => {
      if (disposed) return
      loaded = true
      setStyleVersion((v) => v + 1)
      setMapState('ready')
    })

    instance.on('style.load', () => {
      if (disposed) return
      setStyleVersion((v) => v + 1)
    })

    instance.on('error', () => {
      if (!disposed && !loaded) {
        setMapState('error')
      }
    })

    instance.on('click', (event: maplibregl.MapMouseEvent) => {
      onChange.current(
        roundCoordinate(event.lngLat.lat, 7),
        roundCoordinate(event.lngLat.lng, 7),
      )
    })

    void loadMapRuntimeConfig().then((runtimeConfig) => {
      if (disposed) return
      const nextBasemap = runtimeConfig.defaultBasemap
      const styleChanged =
        nextBasemap !== initialBasemap ||
        (nextBasemap === 'openfreemap' &&
          runtimeConfig.styleUrl !== initialConfig.styleUrl)
      if (styleChanged) {
        setActiveBasemap(nextBasemap)
        instance.setStyle(resolveMapStyle(runtimeConfig, nextBasemap))
      }
    })

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => instance.resize())
        : null
    observer?.observe(container.current)

    setReady(true)

    return () => {
      disposed = true
      observer?.disconnect()
      markerRef.current?.remove()
      markerRef.current = null
      instance.remove()
      mapRef.current = null
    }
  }, [retryToken])

  useEffect(() => {
    const instance = mapRef.current
    if (!instance || !ready) return

    const valid = isValidCoordinates({ latitude, longitude })
    if (!valid) {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      return
    }

    const position = toLngLatTuple({ latitude, longitude })

    if (markerRef.current) {
      markerRef.current.setLngLat(position)
    } else {
      const pinElement = createParkingMarkerElement({
        selected: true,
        title: 'Nhà xe · Vị trí đang chọn',
      })
      pinElement.title = 'Nhà xe · Vị trí đang chọn'
      pinElement.style.cursor = 'grab'

      const markerInstance = new maplibregl.Marker({
        element: pinElement,
        anchor: 'bottom',
        draggable: true,
      })
        .setLngLat(position)
        .addTo(instance)

      markerInstance.on('dragend', () => {
        const nextLngLat = markerInstance.getLngLat()
        onChange.current(
          roundCoordinate(nextLngLat.lat, 7),
          roundCoordinate(nextLngLat.lng, 7),
        )
      })

      markerRef.current = markerInstance
    }

    instance.jumpTo({ center: position, zoom: 16 })
  }, [latitude, longitude, ready])

  useEffect(() => {
    const instance = mapRef.current
    if (!instance || styleVersion === 0) return

    const removeAccuracyLayer = () => {
      if (instance.getLayer?.(ACCURACY_LINE_LAYER_ID)) {
        instance.removeLayer(ACCURACY_LINE_LAYER_ID)
      }
      if (instance.getLayer?.(ACCURACY_FILL_LAYER_ID)) {
        instance.removeLayer(ACCURACY_FILL_LAYER_ID)
      }
      if (instance.getSource?.(ACCURACY_SOURCE_ID)) {
        instance.removeSource(ACCURACY_SOURCE_ID)
      }
    }

    const valid = isValidCoordinates({ latitude, longitude })
    if (
      !valid ||
      typeof accuracy !== 'number' ||
      !Number.isFinite(accuracy) ||
      accuracy <= 0
    ) {
      removeAccuracyLayer()
      return
    }

    const circleGeoJson = createAccuracyCircleGeoJson(
      { latitude, longitude },
      accuracy,
    )

    const existingSource = instance.getSource?.(ACCURACY_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined

    if (existingSource) {
      existingSource.setData(circleGeoJson)
    } else {
      instance.addSource(ACCURACY_SOURCE_ID, {
        type: 'geojson',
        data: circleGeoJson,
      })
      instance.addLayer({
        id: ACCURACY_FILL_LAYER_ID,
        type: 'fill',
        source: ACCURACY_SOURCE_ID,
        paint: {
          'fill-color': '#ea580c',
          'fill-opacity': 0.14,
        },
      })
      instance.addLayer({
        id: ACCURACY_LINE_LAYER_ID,
        type: 'line',
        source: ACCURACY_SOURCE_ID,
        paint: {
          'line-color': '#ea580c',
          'line-opacity': 0.7,
          'line-width': 1.5,
        },
      })
    }
  }, [latitude, longitude, accuracy, styleVersion])

  const hasFinitePair =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">
        Chọn vị trí bãi đỗ trên bản đồ Google Maps
      </p>
      <div className="parking-map relative h-[360px] w-full overflow-hidden rounded-xl border border-slate-200">
        <div
          ref={container}
          role="region"
          aria-label="Bản đồ chọn vị trí bãi đỗ"
          data-map-state={mapState}
          data-map-basemap={activeBasemap}
          className="relative z-0 h-full w-full"
        />

        {mapState === 'error' && (
          <div
            role="alert"
            className="absolute inset-x-3 bottom-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-white/95 p-3 text-xs text-slate-700 shadow-md"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle
                className="h-4 w-4 shrink-0 text-amber-600"
                aria-hidden="true"
              />
              <span>
                Chưa tải được nền bản đồ Google Maps. Bạn vẫn có thể nhập tọa
                độ hoặc dùng GPS ở trên.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRetryToken((c) => c + 1)}
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
