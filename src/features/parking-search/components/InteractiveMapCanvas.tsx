import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
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
  toLatLngTuple,
  type Coordinates,
} from '@/shared/maps'
import { createParkingLeafletIcon } from '@/entities/parking-lot/parkingMapMarker'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

interface Props {
  lots: ParkingLotItem[]
  selectedLot?: ParkingLotItem
  origin?: Coordinates
  onSelectLot: (lot: ParkingLotItem) => void
  onQuickBook: (lot: ParkingLotItem) => void
}

function fitAllParkingLots(instance: L.Map, lots: ParkingLotItem[]) {
  const points = lots.filter(isValidCoordinates).map(toLatLngTuple)
  if (!points.length) return
  const isDesktop = instance.getSize().x >= 960
  instance.fitBounds(points, {
    paddingTopLeft: isDesktop ? [470, 88] : [48, 48],
    paddingBottomRight: isDesktop ? [80, 120] : [48, 48],
    maxZoom: 14,
  })
}

function hasCanvas2dSupport(): boolean {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext?.('2d'))
  } catch {
    return false
  }
}

function resolveAccentColor(element: HTMLElement | null): string {
  if (!element || typeof window === 'undefined') return '#ea580c'
  const value = window
    .getComputedStyle(element)
    .getPropertyValue('--color-map-route')
    .trim()
  return value || '#ea580c'
}

/** Respect the user's reduced-motion preference for map fly animations. */
function flyDuration(): number {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 0.5
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.5
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
  const map = useRef<L.Map | null>(null)
  const tileLayer = useRef<L.TileLayer | null>(null)
  const lastFocusedKey = useRef<string | null>(null)
  const hadOriginRef = useRef(false)
  const pendingOriginResetFit = useRef(false)
  const select = useRef(onSelectLot)

  const [ready, setReady] = useState(false)
  const [tilesState, setTilesState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )

  useEffect(() => {
    select.current = onSelectLot
  }, [onSelectLot])

  useEffect(() => {
    if (!container.current) return

    let disposed = false
    let loaded = false
    setTilesState('loading')

    const canvasRenderer = hasCanvas2dSupport()
      ? L.canvas({ padding: 0.5 })
      : null
    if (canvasRenderer) {
      const rendererProto = Object.getPrototypeOf(canvasRenderer) as {
        _redraw?: (this: { _ctx?: CanvasRenderingContext2D }) => void
      }
      const baseRedraw = rendererProto._redraw
      if (baseRedraw) {
        ;(
          canvasRenderer as unknown as {
            _redraw: (this: { _ctx?: CanvasRenderingContext2D }) => void
          }
        )._redraw = function guardedRedraw() {
          if (!this._ctx) return
          baseRedraw.call(this)
        }
      }
    }
    const vectorRenderer = canvasRenderer ?? L.svg({ padding: 0.5 })

    const instance = L.map(container.current, {
      zoomControl: false,
      scrollWheelZoom: true,
      renderer: vectorRenderer,
    }).setView(toLatLngTuple(DEFAULT_MAP_CENTER), DEFAULT_MAP_ZOOM)
    map.current = instance

    const initialConfig = getMapRuntimeConfig()

    const attachTiles = (tileUrl: string, attribution: string, maxZoom: number) => {
      if (disposed) return
      if (tileLayer.current) {
        tileLayer.current.remove()
      }
      const tiles = L.tileLayer(tileUrl, {
        maxZoom,
        attribution,
      }).addTo(instance)

      tiles.on('tileerror', () => {
        if (!disposed && !loaded) setTilesState('error')
      })
      tiles.on('tileload', () => {
        if (disposed) return
        loaded = true
        setTilesState('ready')
      })

      tileLayer.current = tiles
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

    const tileTimeout = window.setTimeout(() => {
      if (!disposed && !loaded) setTilesState('error')
    }, 12000)

    const resize =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => instance.invalidateSize())
        : null
    resize?.observe(container.current)
    setReady(true)

    return () => {
      disposed = true
      window.clearTimeout(tileTimeout)
      resize?.disconnect()
      lastFocusedKey.current = null
      hadOriginRef.current = false
      pendingOriginResetFit.current = false
      instance.remove()
      map.current = null
      tileLayer.current = null
    }
  }, [])

  useEffect(() => {
    const instance = map.current
    if (!instance || !ready) return
    const layer = L.layerGroup().addTo(instance)
    let selectedMarker: L.Marker | null = null

    for (const lot of lots.filter(isValidCoordinates)) {
      const isSelected = lot.id === selectedLot?.id

      const marker = L.marker(toLatLngTuple(lot), {
        icon: createParkingLeafletIcon({
          hourlyRate: lot.hourlyRate,
          availableSlots: lot.availableSlots,
          selected: isSelected,
          full: lot.isFull || lot.availableSlots === 0,
          title: lot.name,
        }),
        title: lot.name,
        keyboard: true,
        zIndexOffset: isSelected ? 1000 : 100,
      })
        .bindPopup(() => createLotPopupElement(lot), {
          closeButton: true,
          autoPan: false,
        })
        .on('click', () => select.current(lot))
        .on('keydown', (event: L.LeafletKeyboardEvent) => {
          if (
            event.originalEvent.key === 'Enter' ||
            event.originalEvent.key === ' '
          ) {
            event.originalEvent.preventDefault()
            select.current(lot)
          }
        })
        .addTo(layer)

      if (isSelected) {
        selectedMarker = marker
      }
    }

    if (selectedMarker) {
      selectedMarker.openPopup()
    }

    if (origin && isValidCoordinates(origin)) {
      const accentColor = resolveAccentColor(container.current)
      L.circleMarker(toLatLngTuple(origin), {
        radius: 9,
        color: 'white',
        weight: 3,
        fillColor: accentColor,
        fillOpacity: 1,
      })
        .bindTooltip('Điểm xuất phát của bạn')
        .addTo(layer)
    }

    return () => {
      layer.remove()
    }
  }, [lots, selectedLot?.id, origin, ready])

  useEffect(() => {
    const instance = map.current
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
      fitAllParkingLots(instance, validLots)
      return
    }

    if (lastFocusedKey.current === focusKey) return
    lastFocusedKey.current = focusKey

    if (selectedLot && isValidCoordinates(selectedLot)) {
      const targetZoom = Math.max(instance.getZoom(), 15)
      const isDesktop = instance.getSize().x >= 960
      if (isDesktop) {
        const projected = instance.project(
          toLatLngTuple(selectedLot),
          targetZoom,
        )
        const offsetLatLng = instance.unproject(
          projected.subtract([215, 0]),
          targetZoom,
        )
        instance.flyTo(offsetLatLng, targetZoom, { duration: flyDuration() })
      } else {
        instance.flyTo(toLatLngTuple(selectedLot), targetZoom, {
          duration: flyDuration(),
        })
      }
    } else if (validLots.length > 0) {
      fitAllParkingLots(instance, validLots)
    } else if (hasOrigin && origin) {
      instance.flyTo(toLatLngTuple(origin), 13, { duration: flyDuration() })
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
      aria-label="Bản đồ bãi đỗ OpenStreetMap"
      data-map-state={tilesState}
      className="parking-map relative w-full lg:h-full isolate"
    >
      {/* Full-bleed Map Canvas */}
      <div className="relative w-full h-[440px] sm:h-[520px] lg:h-full">
        <div ref={container} className="h-full w-full" />

        {tilesState === 'error' && (
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
                  Chưa tải được nền bản đồ OpenStreetMap. Kiểm tra kết nối mạng
                  hoặc thử tải lại.
                </p>
                <p className="text-xs text-brand-muted">
                  Bạn vẫn có thể xem danh sách bãi đỗ, lọc theo loại xe, đặt giữ
                  chỗ và mở chỉ đường bằng Google Maps.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 font-semibold text-brand-navy underline underline-offset-4 cursor-pointer"
                    onClick={() => {
                      setTilesState('loading')
                      tileLayer.current?.redraw()
                    }}
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

        {/* Bottom-Right Map Controls (positioned cleanly above OSM attribution & AiCopilot) */}
        <div className="absolute bottom-8 right-3 lg:bottom-24 lg:right-4 z-[1000] flex flex-col items-end gap-2">
          <button
            type="button"
            aria-label="Hiển thị tất cả bãi trên bản đồ"
            title="Toàn khu vực"
            className="flex h-10 items-center gap-1.5 rounded-xl border border-brand-border bg-white/95 backdrop-blur-md px-3 text-xs font-semibold text-brand-navy shadow-lg hover:bg-slate-50 hover:text-brand-orange transition-colors cursor-pointer"
            onClick={() => {
              if (map.current) fitAllParkingLots(map.current, lots)
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
              onClick={() => map.current?.zoomIn()}
              className="flex h-10 w-10 items-center justify-center text-brand-navy hover:bg-slate-50 hover:text-brand-orange transition-colors cursor-pointer"
            >
              <Plus size={18} />
            </button>
            <button
              type="button"
              aria-label="Thu nhỏ bản đồ"
              title="Thu nhỏ"
              onClick={() => map.current?.zoomOut()}
              className="flex h-10 w-10 items-center justify-center text-brand-navy hover:bg-slate-50 hover:text-brand-orange transition-colors cursor-pointer"
            >
              <Minus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Selected Lot & Google Maps Directions CTA HUD */}
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
