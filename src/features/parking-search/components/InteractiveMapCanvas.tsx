import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
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
  getMapRuntimeConfig,
  isValidCoordinates,
  loadMapRuntimeConfig,
  toLngLatTuple,
  type Coordinates,
} from '@/shared/maps'
import { createParkingMarkerElement } from '@/entities/parking-lot/parkingMapMarker'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

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

/** Respect the user's reduced-motion preference for map camera animations. */
function flyDurationMs(): number {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 500
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500
}

function fitAllParkingLots(
  instance: maplibregl.Map,
  lots: ParkingLotItem[],
  container: HTMLDivElement | null,
) {
  const validLots = lots.filter(isValidCoordinates)
  if (!validLots.length) return

  const isDesktop = getContainerWidth(container) >= 960

  if (validLots.length === 1) {
    instance.flyTo({
      center: toLngLatTuple(validLots[0]),
      zoom: 14,
      padding: isDesktop
        ? { top: 88, bottom: 120, left: 470, right: 80 }
        : { top: 48, bottom: 48, left: 48, right: 48 },
      duration: flyDurationMs(),
    })
    return
  }

  const bounds = new maplibregl.LngLatBounds()
  for (const lot of validLots) {
    bounds.extend(toLngLatTuple(lot))
  }

  instance.fitBounds(bounds, {
    padding: isDesktop
      ? { top: 88, bottom: 120, left: 470, right: 80 }
      : { top: 48, bottom: 48, left: 48, right: 48 },
    maxZoom: 14,
    duration: flyDurationMs(),
  })
}

function resolveAccentColor(element: HTMLElement | null): string {
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
  dot.title = 'Điểm xuất phát của bạn'
  dot.setAttribute('aria-label', 'Điểm xuất phát của bạn')
  return dot
}

function createLotPopupElement(lot: ParkingLotItem): HTMLDivElement {
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
  const mapRef = useRef<maplibregl.Map | null>(null)
  const lastFocusedKey = useRef<string | null>(null)
  const hadOriginRef = useRef(false)
  const pendingOriginResetFit = useRef(false)
  const select = useRef(onSelectLot)

  const [ready, setReady] = useState(false)
  const [mapState, setMapState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    select.current = onSelectLot
  }, [onSelectLot])

  useEffect(() => {
    if (!container.current) return

    let disposed = false
    let loaded = false
    setReady(false)
    setMapState('loading')

    const initialConfig = getMapRuntimeConfig()
    let instance: maplibregl.Map
    try {
      instance = new maplibregl.Map({
        container: container.current,
        style: initialConfig.styleUrl,
        center: toLngLatTuple(DEFAULT_MAP_CENTER),
        zoom: DEFAULT_MAP_ZOOM,
        attributionControl: { compact: false },
      })
    } catch {
      setMapState('error')
      return
    }

    mapRef.current = instance

    instance.on('load', () => {
      if (disposed) return
      loaded = true
      setMapState('ready')
    })

    instance.on('error', () => {
      if (!disposed && !loaded) {
        setMapState('error')
      }
    })

    void loadMapRuntimeConfig().then((runtimeConfig) => {
      if (disposed) return
      if (runtimeConfig.styleUrl !== initialConfig.styleUrl) {
        instance.setStyle(runtimeConfig.styleUrl)
      }
    })

    const loadTimeout = window.setTimeout(() => {
      if (!disposed && !loaded) {
        setMapState('error')
      }
    }, 12000)

    const resize =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => instance.resize())
        : null
    resize?.observe(container.current)
    setReady(true)

    return () => {
      disposed = true
      window.clearTimeout(loadTimeout)
      resize?.disconnect()
      lastFocusedKey.current = null
      hadOriginRef.current = false
      pendingOriginResetFit.current = false
      instance.remove()
      mapRef.current = null
    }
  }, [retryToken])

  useEffect(() => {
    const instance = mapRef.current
    if (!instance || !ready) return

    const createdMarkers: maplibregl.Marker[] = []
    const cleanups: (() => void)[] = []
    let activePopup: maplibregl.Popup | null = null

    for (const lot of lots.filter(isValidCoordinates)) {
      const isSelected = lot.id === selectedLot?.id
      const pinElement = createParkingMarkerElement({
        hourlyRate: lot.hourlyRate,
        availableSlots: lot.availableSlots,
        selected: isSelected,
        full: lot.isFull || lot.availableSlots === 0,
        title: lot.name,
      })

      const markerWrapper = document.createElement('div')
      markerWrapper.className = 'parking-map-marker cursor-pointer'
      markerWrapper.style.zIndex = isSelected ? '20' : '1'
      markerWrapper.tabIndex = 0
      markerWrapper.setAttribute('role', 'button')
      markerWrapper.setAttribute('aria-label', lot.name)
      markerWrapper.title = lot.name
      markerWrapper.append(pinElement)

      const handleSelect = () => select.current(lot)
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleSelect()
        }
      }
      markerWrapper.addEventListener('click', handleSelect)
      markerWrapper.addEventListener('keydown', handleKeydown)
      cleanups.push(() => {
        markerWrapper.removeEventListener('click', handleSelect)
        markerWrapper.removeEventListener('keydown', handleKeydown)
      })

      const marker = new maplibregl.Marker({
        element: markerWrapper,
        anchor: 'bottom',
      })
        .setLngLat(toLngLatTuple(lot))
        .addTo(instance)

      createdMarkers.push(marker)

      if (isSelected) {
        activePopup = new maplibregl.Popup({
          offset: [0, -64],
          closeButton: true,
          closeOnClick: false,
        })
          .setLngLat(toLngLatTuple(lot))
          .setDOMContent(createLotPopupElement(lot))
          .addTo(instance)
      }
    }

    if (origin && isValidCoordinates(origin)) {
      const accentColor = resolveAccentColor(container.current)
      const originMarker = new maplibregl.Marker({
        element: createOriginMarkerElement(accentColor),
        anchor: 'center',
      })
        .setLngLat(toLngLatTuple(origin))
        .addTo(instance)
      createdMarkers.push(originMarker)
    }

    return () => {
      activePopup?.remove()
      for (const cleanup of cleanups) {
        cleanup()
      }
      for (const marker of createdMarkers) {
        marker.remove()
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

    const isDesktop = getContainerWidth(container.current) >= 960

    if (selectedLot && isValidCoordinates(selectedLot)) {
      const targetZoom = Math.max(instance.getZoom(), 15)
      instance.flyTo({
        center: toLngLatTuple(selectedLot),
        zoom: targetZoom,
        padding: isDesktop
          ? { top: 40, bottom: 120, left: 430, right: 40 }
          : { top: 20, bottom: 20, left: 20, right: 20 },
        duration: flyDurationMs(),
      })
    } else if (validLots.length > 0) {
      fitAllParkingLots(instance, validLots, container.current)
    } else if (hasOrigin && origin) {
      instance.flyTo({
        center: toLngLatTuple(origin),
        zoom: 13,
        duration: flyDurationMs(),
      })
    }
  }, [selectedLot, lots, origin, ready])

  const selectedDirectionsUrl = selectedLot
    ? buildGoogleMapsDirectionsUrl({
        destination: isValidCoordinates(selectedLot) ? selectedLot : null,
        destinationAddress: selectedLot.address,
        origin: origin && isValidCoordinates(origin) ? origin : null,
      })
    : null

  return (
    <section
      aria-label="Bản đồ bãi đỗ OpenFreeMap"
      data-map-state={mapState}
      className="parking-map relative w-full lg:h-full isolate"
    >
      {/* Full-bleed MapLibre GL JS Vector Canvas */}
      <div className="relative w-full h-[440px] sm:h-[520px] lg:h-full">
        <div ref={container} className="h-full w-full" />

        {mapState === 'error' && (
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
                <p className="text-brand-navy font-medium">
                  Chưa tải được nền bản đồ vector OpenFreeMap. Kiểm tra kết nối
                  mạng hoặc WebGL trên trình duyệt rồi thử lại.
                </p>
                <p className="text-xs text-brand-muted">
                  Bạn vẫn có thể xem danh sách bãi đỗ, lọc theo loại xe, đặt giữ
                  chỗ và mở chỉ đường bằng Google Maps.
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
                      Chỉ đường bằng Google Maps
                      <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom-Right Map Controls (positioned cleanly above attribution & AiCopilot) */}
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
              onClick={() => mapRef.current?.zoomIn()}
              className="flex h-10 w-10 items-center justify-center text-brand-navy hover:bg-slate-50 hover:text-brand-orange transition-colors cursor-pointer"
            >
              <Plus size={18} />
            </button>
            <button
              type="button"
              aria-label="Thu nhỏ bản đồ"
              title="Thu nhỏ"
              onClick={() => mapRef.current?.zoomOut()}
              className="flex h-10 w-10 items-center justify-center text-brand-navy hover:bg-slate-50 hover:text-brand-orange transition-colors cursor-pointer"
            >
              <Minus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Selected Lot & Unlimited-Free Google Maps Directions CTA HUD */}
      {(selectedLot || origin) && (
        <div className="mx-3 mt-3 lg:mx-0 lg:mt-0 lg:absolute lg:bottom-8 lg:left-[432px] xl:left-[464px] lg:right-24 lg:max-w-[580px] lg:z-[1000]">
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
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {selectedDirectionsUrl && (
                    <a
                      href={selectedDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-brand-orange/40 bg-orange-50 px-3 text-xs font-semibold text-[#b84e00] hover:bg-orange-100 transition-colors"
                    >
                      <Navigation size={13} aria-hidden="true" />
                      Chỉ đường bằng Google Maps
                      <ExternalLink size={12} aria-hidden="true" />
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
              <p className="min-w-0 flex-1">
                {selectedLot
                  ? origin && isValidCoordinates(origin)
                    ? 'Bấm “Chỉ đường bằng Google Maps” để xem tuyến đường và thời gian di chuyển từ vị trí bạn đã chọn.'
                    : 'Bấm “Chỉ đường bằng Google Maps” để mở tuyến đường và thời gian di chuyển tới cổng bãi.'
                  : 'Đã chọn điểm tìm kiếm. Chọn một bãi trên danh sách hoặc bản đồ để mở chỉ đường bằng Google Maps.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
