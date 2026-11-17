import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Navigation,
  LocateFixed,
  ArrowUpRight,
  Plus,
  Minus,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import {
  buildGoogleMapsDirectionsUrl,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  getGoogleMapsConfig,
  GoogleMapsError,
  isValidCoordinates,
  loadGoogleMapsCore,
  subscribeGoogleMapsAuthFailure,
  toLatLngLiteral,
  type Coordinates,
} from '@/shared/maps'
import { createParkingMarkerElement } from '@/entities/parking-lot/parkingGoogleMarker'
import type { ParkingLotItem } from '../types/parkingSearchTypes'
import { getDrivingRoute } from '../api/mapProvider'

interface Props {
  lots: ParkingLotItem[]
  selectedLot?: ParkingLotItem
  origin?: Coordinates
  onSelectLot: (lot: ParkingLotItem) => void
  onQuickBook: (lot: ParkingLotItem) => void
}

function getContainerWidth(container: HTMLDivElement | null): number {
  return container?.clientWidth ?? 0
}

function getBoundsPadding(isDesktop: boolean): google.maps.Padding {
  return isDesktop
    ? { top: 88, right: 80, bottom: 120, left: 470 }
    : { top: 48, right: 48, bottom: 48, left: 48 }
}

function fitAllParkingLots(
  mapInstance: google.maps.Map,
  lots: ParkingLotItem[],
  container: HTMLDivElement | null,
) {
  const validLots = lots.filter(isValidCoordinates)
  if (!validLots.length) return

  if (validLots.length === 1) {
    const target = toLatLngLiteral(validLots[0])
    mapInstance.panTo(target)
    mapInstance.setZoom(14)
    return
  }

  const bounds = new google.maps.LatLngBounds()
  for (const lot of validLots) {
    bounds.extend(toLatLngLiteral(lot))
  }
  const isDesktop = getContainerWidth(container) >= 960
  mapInstance.fitBounds(bounds, getBoundsPadding(isDesktop))
}

function resolveRouteColor(element: HTMLElement | null): string {
  if (!element || typeof window === 'undefined') return '#ea580c'
  const value = window
    .getComputedStyle(element)
    .getPropertyValue('--color-map-route')
    .trim()
  return value || '#ea580c'
}

function createOriginMarkerElement(color: string): HTMLDivElement {
  const dot = document.createElement('div')
  dot.className = 'parking-map-origin-dot'
  dot.style.width = '18px'
  dot.style.height = '18px'
  dot.style.borderRadius = '9999px'
  dot.style.backgroundColor = color
  dot.style.border = '3px solid #ffffff'
  dot.style.boxShadow = '0 2px 8px rgba(13, 28, 46, 0.35)'
  dot.setAttribute('aria-label', 'Điểm xuất phát của bạn')
  return dot
}

function createLotPopupContent(lot: ParkingLotItem): HTMLDivElement {
  const popup = document.createElement('div')
  popup.className = 'parking-map-popup'

  const name = document.createElement('strong')
  name.textContent = lot.name

  const address = document.createElement('p')
  address.textContent = lot.address

  const details = document.createElement('p')
  details.textContent = `${lot.availableSlots > 0 ? `Còn ${lot.availableSlots} chỗ` : 'Hết chỗ'} · ${new Intl.NumberFormat('vi-VN').format(lot.hourlyRate)} đ/h`

  popup.append(name, address, details)
  return popup
}

export function InteractiveMapCanvas({
  lots,
  selectedLot,
  origin,
  onSelectLot,
  onQuickBook,
}: Props) {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const mapsLibRef = useRef<google.maps.MapsLibrary | null>(null)
  const markerLibRef = useRef<google.maps.MarkerLibrary | null>(null)
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  const lastFocusedKey = useRef<string | null>(null)
  const lastFittedRouteKey = useRef<string | null>(null)
  const hadOriginRef = useRef(false)
  const pendingOriginResetFit = useRef(false)
  const select = useRef(onSelectLot)

  const [ready, setReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    select.current = onSelectLot
  }, [onSelectLot])

  useEffect(() => {
    if (!container.current) return

    let disposed = false
    setReady(false)
    setMapError(null)

    const unsubscribeAuth = subscribeGoogleMapsAuthFailure(() => {
      if (disposed) return
      setMapError(
        'Khóa Google Maps API không hợp lệ hoặc bị giới hạn trên domain hiện tại.',
      )
      setReady(false)
    })

    void loadGoogleMapsCore()
      .then(({ maps, marker }) => {
        if (disposed || !container.current) return
        const config = getGoogleMapsConfig()
        const instance = new maps.Map(container.current, {
          center: toLatLngLiteral(DEFAULT_MAP_CENTER),
          zoom: DEFAULT_MAP_ZOOM,
          mapId: config.mapId,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
        })

        mapRef.current = instance
        mapsLibRef.current = maps
        markerLibRef.current = marker
        infoWindowRef.current = new maps.InfoWindow({
          disableAutoPan: true,
        })
        setReady(true)
      })
      .catch((error: unknown) => {
        if (disposed) return
        const message =
          error instanceof GoogleMapsError
            ? error.message
            : 'Chưa tải được nền Google Maps. Kiểm tra kết nối mạng hoặc cấu hình khóa API.'
        setMapError(message)
      })

    return () => {
      disposed = true
      unsubscribeAuth()
      infoWindowRef.current?.close()
      infoWindowRef.current = null
      lastFocusedKey.current = null
      lastFittedRouteKey.current = null
      hadOriginRef.current = false
      pendingOriginResetFit.current = false
      mapRef.current = null
      mapsLibRef.current = null
      markerLibRef.current = null
    }
  }, [retryToken])

  useEffect(() => {
    const instance = mapRef.current
    const markerLib = markerLibRef.current
    const infoWindow = infoWindowRef.current
    if (!instance || !markerLib || !ready) return

    const createdMarkers: google.maps.marker.AdvancedMarkerElement[] = []
    const cleanupListeners: (() => void)[] = []
    let selectedMarker: google.maps.marker.AdvancedMarkerElement | null = null
    let selectedLotMatch: ParkingLotItem | null = null

    for (const lot of lots.filter(isValidCoordinates)) {
      const isSelected = lot.id === selectedLot?.id
      const content = createParkingMarkerElement({
        hourlyRate: lot.hourlyRate,
        availableSlots: lot.availableSlots,
        selected: isSelected,
        full: lot.isFull || lot.availableSlots === 0,
        title: lot.name,
      })

      const markerInstance = new markerLib.AdvancedMarkerElement({
        map: instance,
        position: toLatLngLiteral(lot),
        title: lot.name,
        content,
        zIndex: isSelected ? 1000 : 100,
        gmpClickable: true,
      })

      const handleSelect = () => select.current(lot)
      const clickListener = markerInstance.addListener?.(
        'gmp-click',
        handleSelect,
      )
      const keydownHandler = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleSelect()
        }
      }
      content.tabIndex = 0
      content.setAttribute('role', 'button')
      content.addEventListener('keydown', keydownHandler)

      cleanupListeners.push(() => {
        clickListener?.remove()
        content.removeEventListener('keydown', keydownHandler)
      })
      createdMarkers.push(markerInstance)

      if (isSelected) {
        selectedMarker = markerInstance
        selectedLotMatch = lot
      }
    }

    if (selectedMarker && selectedLotMatch && infoWindow) {
      infoWindow.setContent(createLotPopupContent(selectedLotMatch))
      infoWindow.open({
        map: instance,
        anchor: selectedMarker,
        shouldFocus: false,
      })
    } else {
      infoWindow?.close()
    }

    if (origin && isValidCoordinates(origin)) {
      const routeColor = resolveRouteColor(container.current)
      const originMarker = new markerLib.AdvancedMarkerElement({
        map: instance,
        position: toLatLngLiteral(origin),
        title: 'Điểm xuất phát của bạn',
        content: createOriginMarkerElement(routeColor),
        zIndex: 900,
      })
      createdMarkers.push(originMarker)
    }

    return () => {
      for (const cleanup of cleanupListeners) {
        cleanup()
      }
      for (const markerInstance of createdMarkers) {
        markerInstance.map = null
      }
    }
  }, [lots, selectedLot?.id, origin, ready])

  useEffect(() => {
    const instance = mapRef.current
    if (!instance || !ready) return
    const validLots = lots.filter(isValidCoordinates)
    const hasOrigin = Boolean(origin && isValidCoordinates(origin))

    if (hasOrigin) {
      hadOriginRef.current = true
      pendingOriginResetFit.current = false
    } else if (hadOriginRef.current) {
      hadOriginRef.current = false
      pendingOriginResetFit.current = true
    }

    const focusKey =
      selectedLot && isValidCoordinates(selectedLot)
        ? `lot:${selectedLot.id}:${selectedLot.latitude},${selectedLot.longitude}`
        : hasOrigin
          ? `origin:${origin!.latitude},${origin!.longitude}`
          : `all:${validLots.map((l) => l.id).join(',')}`

    if (pendingOriginResetFit.current) {
      if (!validLots.length) return
      pendingOriginResetFit.current = false
      lastFocusedKey.current = focusKey
      fitAllParkingLots(instance, validLots, container.current)
      return
    }

    if (lastFocusedKey.current === focusKey) return
    lastFocusedKey.current = focusKey

    if (selectedLot && isValidCoordinates(selectedLot)) {
      const currentZoom = instance.getZoom() ?? DEFAULT_MAP_ZOOM
      const targetZoom = Math.max(currentZoom, 15)
      instance.panTo(toLatLngLiteral(selectedLot))
      instance.setZoom(targetZoom)
      if (getContainerWidth(container.current) >= 960) {
        instance.panBy(-215, 0)
      }
    } else if (validLots.length > 0) {
      fitAllParkingLots(instance, validLots, container.current)
    } else if (hasOrigin && origin) {
      instance.panTo(toLatLngLiteral(origin))
      instance.setZoom(13)
    }
  }, [selectedLot, lots, origin, ready])

  const route = useQuery({
    queryKey: [
      'google-driving-route',
      origin?.latitude,
      origin?.longitude,
      selectedLot?.latitude,
      selectedLot?.longitude,
    ],
    enabled: Boolean(
      origin &&
      selectedLot &&
      isValidCoordinates(origin) &&
      isValidCoordinates(selectedLot),
    ),
    queryFn: ({ signal }) => getDrivingRoute(origin!, selectedLot!, signal),
    retry: false,
    staleTime: 120000,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    const instance = mapRef.current
    const mapsLib = mapsLibRef.current
    if (!instance || !mapsLib || !ready) return
    if (!route.data) {
      lastFittedRouteKey.current = null
      return
    }

    const routeColor = resolveRouteColor(container.current)
    const path = route.data.points.map(toLatLngLiteral)
    const line = new mapsLib.Polyline({
      map: instance,
      path,
      strokeColor: routeColor,
      strokeWeight: 5,
      strokeOpacity: 0.9,
      clickable: false,
    })

    const routeKey = `${origin?.latitude},${origin?.longitude}->${selectedLot?.id}`
    if (lastFittedRouteKey.current !== routeKey && path.length > 0) {
      lastFittedRouteKey.current = routeKey
      const bounds = new google.maps.LatLngBounds()
      for (const point of path) {
        bounds.extend(point)
      }
      const isDesktop = getContainerWidth(container.current) >= 960
      instance.fitBounds(
        bounds,
        isDesktop
          ? { top: 90, right: 90, bottom: 130, left: 470 }
          : { top: 90, right: 55, bottom: 100, left: 55 },
      )
    }

    return () => {
      line.setMap(null)
    }
  }, [route.data, ready, origin?.latitude, origin?.longitude, selectedLot?.id])

  const selectedDirectionsUrl = selectedLot
    ? buildGoogleMapsDirectionsUrl({
        destination: isValidCoordinates(selectedLot) ? selectedLot : null,
        destinationAddress: selectedLot.address,
        origin: origin && isValidCoordinates(origin) ? origin : null,
      })
    : null

  return (
    <section
      aria-label="Bản đồ bãi đỗ Google Maps"
      className="parking-map relative w-full lg:h-full isolate"
    >
      {/* Full-bleed Map Canvas */}
      <div className="relative w-full h-[440px] sm:h-[520px] lg:h-full">
        <div ref={container} className="h-full w-full" />

        {mapError && (
          <div
            role="status"
            className="absolute top-20 left-4 right-4 lg:left-[448px] xl:left-[476px] lg:right-4 z-[1000] rounded-2xl border border-brand-border bg-white/95 backdrop-blur-md p-4 text-sm text-brand-muted shadow-lg"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-amber-600"
                aria-hidden="true"
              />
              <div className="space-y-2">
                <p className="text-brand-navy font-medium">{mapError}</p>
                <p className="text-xs text-brand-muted">
                  Bạn vẫn có thể xem danh sách bãi đỗ, lọc theo loại xe và đặt
                  giữ chỗ bình thường.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 font-semibold text-brand-navy underline underline-offset-4 cursor-pointer"
                    onClick={() => setRetryToken((count) => count + 1)}
                  >
                    <RefreshCw size={14} aria-hidden="true" />
                    Thử tải lại bản đồ
                  </button>
                  {selectedDirectionsUrl && (
                    <a
                      href={selectedDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-brand-orange underline underline-offset-4"
                    >
                      Mở chỉ đường Google Maps
                      <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom-Right Map Controls (positioned cleanly above Google attribution & AiCopilot) */}
        <div className="absolute bottom-8 right-3 lg:bottom-24 lg:right-4 z-[1000] flex flex-col items-end gap-2">
          <button
            type="button"
            aria-label="Hiển thị tất cả bãi trên bản đồ"
            title="Toàn khu vực"
            className="flex h-10 items-center gap-1.5 rounded-xl border border-brand-border bg-white/95 backdrop-blur-md px-3 text-xs font-semibold text-brand-navy shadow-lg hover:bg-slate-50 hover:text-brand-orange transition-colors cursor-pointer"
            onClick={() => {
              if (mapRef.current) {
                fitAllParkingLots(mapRef.current, lots, container.current)
              }
            }}
          >
            <LocateFixed size={16} className="text-brand-orange shrink-0" />
            <span className="hidden sm:inline">Toàn khu vực</span>
          </button>

          <div className="flex flex-col overflow-hidden rounded-xl border border-brand-border bg-white/95 backdrop-blur-md shadow-lg divide-y divide-slate-200">
            <button
              type="button"
              aria-label="Phóng to bản đồ"
              title="Phóng to"
              onClick={() => {
                const instance = mapRef.current
                if (!instance) return
                instance.setZoom((instance.getZoom() ?? DEFAULT_MAP_ZOOM) + 1)
              }}
              className="flex h-10 w-10 items-center justify-center text-brand-navy hover:bg-slate-50 hover:text-brand-orange transition-colors cursor-pointer"
            >
              <Plus size={18} />
            </button>
            <button
              type="button"
              aria-label="Thu nhỏ bản đồ"
              title="Thu nhỏ"
              onClick={() => {
                const instance = mapRef.current
                if (!instance) return
                instance.setZoom((instance.getZoom() ?? DEFAULT_MAP_ZOOM) - 1)
              }}
              className="flex h-10 w-10 items-center justify-center text-brand-navy hover:bg-slate-50 hover:text-brand-orange transition-colors cursor-pointer"
            >
              <Minus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Selected Lot & Route HUD (Floating over open map on desktop, stacked below map on mobile) */}
      {(selectedLot || origin) && (
        <div className="mx-3 mt-3 lg:mx-0 lg:mt-0 lg:absolute lg:bottom-8 lg:left-[432px] xl:left-[464px] lg:right-24 lg:max-w-[540px] lg:z-[1000]">
          <div className="rounded-2xl border border-brand-border/90 bg-white/95 backdrop-blur-md p-3.5 shadow-xl">
            {selectedLot && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold tracking-wider text-[#d95f00] uppercase">
                      Bãi đang chọn
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        selectedLot.isFull || selectedLot.availableSlots === 0
                          ? 'text-rose-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {selectedLot.availableSlots} chỗ trống
                    </span>
                    <span className="tabular-nums text-xs font-bold text-brand-navy">
                      {new Intl.NumberFormat('vi-VN').format(
                        selectedLot.hourlyRate,
                      )}{' '}
                      đ/h
                    </span>
                  </div>
                  <h3 className="font-sora text-sm font-bold text-brand-navy truncate">
                    {selectedLot.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    {selectedLot.address}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {selectedDirectionsUrl && (
                    <a
                      href={selectedDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1 rounded-xl border border-brand-border bg-white px-2.5 text-xs font-semibold text-brand-navy hover:bg-slate-50 transition-colors"
                      title="Mở chỉ đường trên Google Maps"
                    >
                      Chỉ đường
                      <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  )}
                  <Link
                    to={`/parking/${selectedLot.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-brand-border bg-white px-3 text-xs font-semibold text-brand-navy hover:bg-slate-50 transition-colors"
                  >
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    disabled={
                      selectedLot.isFull || selectedLot.availableSlots === 0
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover px-3.5 text-xs font-bold text-white disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
                    onClick={() => onQuickBook(selectedLot)}
                  >
                    Giữ chỗ
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            )}

            <div
              className={`flex items-start gap-2 text-xs text-brand-muted ${
                selectedLot ? 'mt-2.5 pt-2 border-t border-slate-100' : ''
              }`}
            >
              <Navigation
                size={14}
                className="mt-0.5 shrink-0 text-brand-orange"
              />
              <div className="min-w-0 flex-1">
                {route.isFetching ? (
                  <p>Đang tính tuyến đường Google Maps…</p>
                ) : route.data ? (
                  <p className="font-semibold text-brand-navy">
                    {route.data.distanceKm.toFixed(1)} km · Khoảng{' '}
                    {route.data.durationMinutes} phút{' '}
                    <span className="font-normal text-brand-muted">
                      (tuyến lái xe tham khảo Google Maps)
                    </span>
                  </p>
                ) : (
                  <p>
                    {route.isError
                      ? 'Chưa tải được tuyến đường Google Maps. Bạn vẫn có thể xem vị trí bãi hoặc mở chỉ đường trực tiếp.'
                      : 'Chọn vị trí xuất phát hoặc bật định vị để xem tuyến đường.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
