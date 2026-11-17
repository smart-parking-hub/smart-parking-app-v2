import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, ExternalLink, MapPinOff, RefreshCw } from 'lucide-react'
import {
  getGoogleMapsConfig,
  GoogleMapsError,
} from './config'
import {
  isValidCoordinates,
  toLatLngLiteral,
  type Coordinates,
} from './coordinates'
import {
  loadGoogleMapsCore,
  subscribeGoogleMapsAuthFailure,
} from './loader'
import { buildGoogleMapsSearchUrl } from './urls'
import { createParkingMarkerElement } from '@/entities/parking-lot/parkingGoogleMarker'

export interface GoogleMapViewProps {
  coordinates?: Partial<Coordinates> | null
  markerTitle?: string
  address?: string
  zoom?: number
  className?: string
  ariaLabel?: string
  showExternalLinkOnError?: boolean
  markerContentFactory?: () => HTMLElement
  onReady?: () => void
  onError?: (error: GoogleMapsError) => void
}

export function GoogleMapView({
  coordinates,
  markerTitle,
  address,
  zoom = 16,
  className = 'h-full w-full',
  ariaLabel = 'Bản đồ Google Maps',
  showExternalLinkOnError = true,
  markerContentFactory,
  onReady,
  onError,
}: GoogleMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const onReadyRef = useRef(onReady)
  const onErrorRef = useRef(onError)
  const markerFactoryRef = useRef(markerContentFactory)

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  useEffect(() => {
    markerFactoryRef.current = markerContentFactory
  }, [markerContentFactory])

  const valid = isValidCoordinates(coordinates)
  const lat = valid ? coordinates.latitude : null
  const lng = valid ? coordinates.longitude : null

  const externalUrl = buildGoogleMapsSearchUrl({
    coordinates: valid ? coordinates : null,
    query: address || markerTitle,
  })

  useEffect(() => {
    if (!valid || lat === null || lng === null) return
    const container = containerRef.current
    if (!container) return

    let disposed = false
    setStatus('loading')
    setErrorMessage('')

    const unsubscribeAuth = subscribeGoogleMapsAuthFailure(() => {
      if (disposed) return
      const err = new GoogleMapsError(
        'AUTH_FAILURE',
        'Khóa Google Maps API không hợp lệ hoặc bị hạn chế trên domain hiện tại.',
      )
      setStatus('error')
      setErrorMessage(err.message)
      onErrorRef.current?.(err)
    })

    let resizeObserver: ResizeObserver | null = null

    void loadGoogleMapsCore()
      .then(({ maps, marker }) => {
        if (disposed || !containerRef.current) return

        const config = getGoogleMapsConfig()
        const center = toLatLngLiteral({ latitude: lat, longitude: lng })
        const mapInstance = new maps.Map(containerRef.current, {
          center,
          zoom,
          mapId: config.mapId,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
        })
        mapRef.current = mapInstance

        const content =
          markerFactoryRef.current?.() ??
          createParkingMarkerElement({ title: markerTitle })

        markerRef.current = new marker.AdvancedMarkerElement({
          map: mapInstance,
          position: center,
          title: markerTitle,
          content,
        })

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => {
            if (mapRef.current) {
              mapRef.current.setCenter(center)
            }
          })
          resizeObserver.observe(containerRef.current)
        }

        setStatus('ready')
        onReadyRef.current?.()
      })
      .catch((rawError: unknown) => {
        if (disposed) return
        const err =
          rawError instanceof GoogleMapsError
            ? rawError
            : new GoogleMapsError(
                'SDK_LOAD_ERROR',
                'Chưa thể tải Google Maps. Vui lòng thử lại hoặc mở trực tiếp trên Google Maps.',
                rawError,
              )
        setStatus('error')
        setErrorMessage(err.message)
        onErrorRef.current?.(err)
      })

    return () => {
      disposed = true
      unsubscribeAuth()
      resizeObserver?.disconnect()
      if (markerRef.current) {
        markerRef.current.map = null
        markerRef.current = null
      }
      mapRef.current = null
    }
  }, [valid, lat, lng, zoom, markerTitle, retryCount])

  if (!valid) {
    return (
      <div
        role="status"
        data-map-state="missing-coordinates"
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-600 ${className}`}
      >
        <MapPinOff className="h-5 w-5 text-slate-400" aria-hidden="true" />
        <p className="font-semibold text-slate-700">Chưa có tọa độ vị trí hợp lệ</p>
        <p className="max-w-xs text-slate-500">
          Vui lòng cập nhật vĩ độ và kinh độ để hiển thị ghim trên Google Maps.
        </p>
      </div>
    )
  }

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      data-map-state={status}
      className={`relative overflow-hidden ${className}`}
    >
      <div ref={containerRef} className="h-full w-full" />

      {status === 'loading' && (
        <div
          role="status"
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-100/80 text-xs font-medium text-slate-600"
        >
          Đang tải Google Maps…
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-slate-50/95 p-4 text-center text-xs text-slate-700"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
          <p className="max-w-sm font-medium text-slate-800">{errorMessage}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setRetryCount((c) => c + 1)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Thử tải lại
            </button>
            {showExternalLinkOnError && externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0d1c2e] px-3 py-1.5 font-semibold text-white hover:bg-[#1e3a5f]"
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
