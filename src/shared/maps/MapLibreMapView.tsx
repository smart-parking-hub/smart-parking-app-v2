import { useEffect, useMemo, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { AlertTriangle, ExternalLink, Layers, MapPinOff, RefreshCw } from 'lucide-react'
import {
  isValidCoordinates,
  toLngLatTuple,
  type Coordinates,
} from './coordinates'
import {
  resolveMapStyle,
  type MapBasemapId,
} from './basemaps'
import {
  getMapRuntimeConfig,
  loadMapRuntimeConfig,
} from './runtimeConfig'
import { extractAndValidateGoogleShareEmbedUrl } from './shareEmbed'
import { buildGoogleMapsSearchUrl } from './urls'
import { ensureMapLibreWorkerConfigured } from './maplibreWorker'
import { createParkingMarkerElement } from '@/entities/parking-lot/parkingMapMarker'

export interface MapLibreMapViewProps {
  coordinates?: Partial<Coordinates> | null
  markerTitle?: string
  address?: string
  zoom?: number
  className?: string
  ariaLabel?: string
  googleMapsEmbedUrl?: string | null
  showExternalLinkOnError?: boolean
  onReady?: () => void
  onError?: () => void
}

/**
 * Key-less, unlimited-free MapLibre GL JS + OpenFreeMap vector viewer.
 * Zero billing, zero API key, smooth WebGL rendering, with optional validated Google Share embed toggle.
 */
export function MapLibreMapView({
  coordinates,
  markerTitle = 'Vị trí bãi đỗ',
  address,
  zoom = 16,
  className = 'h-full w-full',
  ariaLabel = 'Bản đồ vị trí bãi đỗ',
  googleMapsEmbedUrl,
  showExternalLinkOnError = true,
  onReady,
  onError,
}: MapLibreMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onReadyRef = useRef(onReady)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const embedCheck = useMemo(
    () => extractAndValidateGoogleShareEmbedUrl(googleMapsEmbedUrl),
    [googleMapsEmbedUrl],
  )
  const validEmbedUrl = embedCheck.valid ? embedCheck.url : null
  const validCoords = isValidCoordinates(coordinates)
  const lat = validCoords ? coordinates.latitude : null
  const lng = validCoords ? coordinates.longitude : null

  const [viewMode, setViewMode] = useState<'vector' | 'google-embed'>(() =>
    validEmbedUrl ? 'google-embed' : 'vector',
  )

  useEffect(() => {
    if (!validEmbedUrl && viewMode === 'google-embed') {
      setViewMode('vector')
    }
  }, [validEmbedUrl, viewMode])

  const [mapState, setMapState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )
  const [activeBasemap, setActiveBasemap] = useState<MapBasemapId>(
    () => getMapRuntimeConfig().defaultBasemap,
  )
  const [retryCount, setRetryCount] = useState(0)

  const externalUrl = buildGoogleMapsSearchUrl({
    coordinates: validCoords ? coordinates : null,
    query: address || markerTitle,
  })

  const showingEmbed = viewMode === 'google-embed' && Boolean(validEmbedUrl)

  useEffect(() => {
    if (showingEmbed) return
    if (!validCoords || lat === null || lng === null) return
    const container = containerRef.current
    if (!container) return

    let disposed = false
    let loaded = false
    setMapState('loading')

    const initialConfig = getMapRuntimeConfig()
    const initialBasemap = initialConfig.defaultBasemap
    setActiveBasemap(initialBasemap)
    const center = toLngLatTuple({ latitude: lat, longitude: lng })

    let mapInstance: maplibregl.Map
    try {
      ensureMapLibreWorkerConfigured()
      mapInstance = new maplibregl.Map({
        container,
        style: resolveMapStyle(initialConfig, initialBasemap),
        center,
        zoom,
        attributionControl: { compact: true },
      })
    } catch {
      setMapState('error')
      onErrorRef.current?.()
      return
    }

    mapInstance.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right',
    )

    const pinElement = createParkingMarkerElement({
      selected: true,
      title: markerTitle,
    })
    pinElement.title = markerTitle

    const marker = new maplibregl.Marker({
      element: pinElement,
      anchor: 'bottom',
    })
      .setLngLat(center)
      .addTo(mapInstance)

    mapInstance.on('load', () => {
      if (disposed) return
      loaded = true
      setMapState('ready')
      onReadyRef.current?.()
    })

    mapInstance.on('error', () => {
      if (disposed || loaded) return
      setMapState('error')
      onErrorRef.current?.()
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
        mapInstance.setStyle(resolveMapStyle(runtimeConfig, nextBasemap))
      }
    })

    const timeout = window.setTimeout(() => {
      if (!disposed && !loaded) {
        setMapState('error')
        onErrorRef.current?.()
      }
    }, 12000)

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => mapInstance.resize())
        : null
    resizeObserver?.observe(container)

    return () => {
      disposed = true
      window.clearTimeout(timeout)
      resizeObserver?.disconnect()
      marker.remove()
      mapInstance.remove()
    }
  }, [showingEmbed, validCoords, lat, lng, zoom, markerTitle, retryCount])

  if (!validCoords && !validEmbedUrl) {
    return (
      <div
        role="status"
        data-map-state="missing-coordinates"
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-600 ${className}`}
      >
        <MapPinOff className="h-5 w-5 text-slate-400" aria-hidden="true" />
        <p className="font-semibold text-slate-700">
          Chưa có tọa độ vị trí hợp lệ
        </p>
        <p className="max-w-xs text-slate-500">
          Vui lòng cập nhật vĩ độ và kinh độ để hiển thị ghim trên bản đồ.
        </p>
      </div>
    )
  }

  if (showingEmbed && validEmbedUrl) {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        data-map-state="embed"
        className={`relative overflow-hidden ${className}`}
      >
        <iframe
          title={`Bản đồ Google Maps nhúng · ${markerTitle}`}
          src={validEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-full w-full border-0"
        />
        <div className="absolute right-2.5 top-2.5 z-10 flex flex-wrap items-center gap-1.5">
          {validCoords && (
            <button
              type="button"
              onClick={() => setViewMode('vector')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-sm hover:bg-slate-50 cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              Xem bản đồ Vector
            </button>
          )}
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-[#0d1c2e]/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-[#1e3a5f]"
            >
              Mở Google Maps
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      data-map-state={mapState}
      data-map-basemap={activeBasemap}
      className={`parking-map relative overflow-hidden ${className}`}
    >
      <div ref={containerRef} className="h-full w-full" />

      {validEmbedUrl && (
        <div className="absolute left-2.5 top-2.5 z-20">
          <button
            type="button"
            onClick={() => setViewMode('google-embed')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-sm hover:bg-slate-50 cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            Xem bản đồ Google nhúng
          </button>
        </div>
      )}

      {mapState === 'error' && (
        <div
          role="alert"
          className="absolute inset-x-3 bottom-3 z-20 flex flex-col items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white/95 p-3 text-center text-xs text-slate-700 shadow-md backdrop-blur-sm"
        >
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <AlertTriangle
              className="h-4 w-4 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <span>Chưa tải được nền bản đồ Google Maps.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setRetryCount((c) => c + 1)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-semibold text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Thử tải lại
            </button>
            {showExternalLinkOnError && externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0d1c2e] px-2.5 py-1 font-semibold text-white hover:bg-[#1e3a5f]"
              >
                Mở trên Google Maps
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
