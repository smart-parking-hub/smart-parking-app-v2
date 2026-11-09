import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  Navigation,
  LocateFixed,
  ArrowUpRight,
  Plus,
  Minus,
} from 'lucide-react'
import type { ParkingLotItem } from '../types/parkingSearchTypes'
import {
  getDrivingRoute,
  validCoordinates,
  type Coordinates,
} from '../api/mapProvider'

interface Props {
  lots: ParkingLotItem[]
  selectedLot?: ParkingLotItem
  origin?: Coordinates
  onSelectLot: (lot: ParkingLotItem) => void
  onQuickBook: (lot: ParkingLotItem) => void
}

function fitAllParkingLots(instance: L.Map, lots: ParkingLotItem[]) {
  const points = lots
    .filter(validCoordinates)
    .map((lot) => [lot.latitude, lot.longitude] as [number, number])
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

function resolveRouteColor(element: HTMLElement | null): string {
  if (!element || typeof window === 'undefined') return '#ea580c'
  const value = window
    .getComputedStyle(element)
    .getPropertyValue('--color-map-route')
    .trim()
  return value || '#ea580c'
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
  const lastFittedRouteKey = useRef<string | null>(null)
  const hadOriginRef = useRef(false)
  const pendingOriginResetFit = useRef(false)
  const [tilesUnavailable, setTilesUnavailable] = useState(false)
  const [ready, setReady] = useState(false)
  const select = useRef(onSelectLot)

  useEffect(() => {
    select.current = onSelectLot
  }, [onSelectLot])

  useEffect(() => {
    if (!container.current) return
    // Render route vectors on a generous-padding Canvas layer (fallback SVG 0.5)
    // so horizontal/vertical map panning glides cleanly without Chromium SVG viewBox desync.
    const canvasRenderer = hasCanvas2dSupport()
      ? L.canvas({ padding: 0.5 })
      : null
    if (canvasRenderer) {
      // Guard orphaned requestAnimationFrame redraws if map unmounts right after _update()
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
      scrollWheelZoom: false,
      renderer: vectorRenderer,
    }).setView([10.7769, 106.7009], 12)
    map.current = instance

    const tiles = L.tileLayer(
      import.meta.env.VITE_OSM_TILE_URL ||
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ).addTo(instance)
    tileLayer.current = tiles

    let loaded = false
    const tileTimeout = setTimeout(() => {
      if (!loaded) setTilesUnavailable(true)
    }, 12000)

    tiles.on('tileerror', () => {
      if (!loaded) setTilesUnavailable(true)
    })
    tiles.on('tileload', () => {
      loaded = true
      setTilesUnavailable(false)
    })

    const resize = new ResizeObserver(() => instance.invalidateSize())
    resize.observe(container.current)
    setReady(true)

    return () => {
      clearTimeout(tileTimeout)
      resize.disconnect()
      lastFocusedKey.current = null
      lastFittedRouteKey.current = null
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

    for (const lot of lots.filter(validCoordinates)) {
      const isSelected = lot.id === selectedLot?.id
      const label = document.createElement('span')
      label.className = 'parking-pin-label'
      label.dataset.selected = String(isSelected)
      label.dataset.full = String(lot.isFull || lot.availableSlots === 0)
      label.textContent = `${new Intl.NumberFormat('vi-VN').format(lot.hourlyRate / 1000)}K · ${lot.availableSlots} chỗ`

      const marker = L.marker([lot.latitude, lot.longitude], {
        icon: L.divIcon({
          html: label,
          className: 'parking-pin',
          iconSize: [130, 42],
          iconAnchor: [65, 42],
        }),
        title: lot.name,
        keyboard: true,
        zIndexOffset: isSelected ? 1000 : 100,
      })
        .bindPopup(
          `<div style="font-family: inherit; min-width: 200px; padding: 2px;">
            <div style="font-weight: 700; font-size: 13px; color: #0d1c2e; margin-bottom: 3px;">${lot.name}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px; line-height: 1.4;">${lot.address}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 5px; font-size: 11px;">
              <span style="color: ${lot.availableSlots > 0 ? '#10b981' : '#f43f5e'}; font-weight: 700;">
                ${lot.availableSlots > 0 ? `Còn ${lot.availableSlots} chỗ` : 'Hết chỗ'}
              </span>
              <span style="font-weight: 700; color: #0d1c2e; font-variant-numeric: tabular-nums;">
                ${new Intl.NumberFormat('vi-VN').format(lot.hourlyRate)} đ/h
              </span>
            </div>
          </div>`,
          { offset: [0, -32], closeButton: true, autoPan: false }
        )
        .on('click', () => select.current(lot))
        .addTo(layer)

      if (isSelected) {
        selectedMarker = marker
      }
    }

    if (selectedMarker) {
      selectedMarker.openPopup()
    }

    if (origin && validCoordinates(origin)) {
      const routeColor = resolveRouteColor(container.current)
      L.circleMarker([origin.latitude, origin.longitude], {
        radius: 9,
        color: 'white',
        weight: 3,
        fillColor: routeColor,
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
    const validLots = lots.filter(validCoordinates)
    const hasOrigin = Boolean(origin && validCoordinates(origin))

    if (hasOrigin) {
      hadOriginRef.current = true
      pendingOriginResetFit.current = false
    } else if (hadOriginRef.current) {
      hadOriginRef.current = false
      pendingOriginResetFit.current = true
    }

    const focusKey =
      selectedLot && validCoordinates(selectedLot)
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

    if (selectedLot && validCoordinates(selectedLot)) {
      const targetZoom = Math.max(instance.getZoom(), 15)
      const isDesktop = instance.getSize().x >= 960
      if (isDesktop) {
        const projected = instance.project(
          [selectedLot.latitude, selectedLot.longitude],
          targetZoom,
        )
        const offsetLatLng = instance.unproject(
          projected.subtract([215, 0]),
          targetZoom,
        )
        instance.flyTo(offsetLatLng, targetZoom, { duration: 0.5 })
      } else {
        instance.flyTo(
          [selectedLot.latitude, selectedLot.longitude],
          targetZoom,
          { duration: 0.5 },
        )
      }
    } else if (validLots.length > 0) {
      fitAllParkingLots(instance, validLots)
    } else if (hasOrigin && origin) {
      instance.flyTo([origin.latitude, origin.longitude], 13, { duration: 0.5 })
    }
  }, [selectedLot, lots, origin, ready])

  const route = useQuery({
    queryKey: [
      'osm-driving-route',
      origin?.latitude,
      origin?.longitude,
      selectedLot?.latitude,
      selectedLot?.longitude,
    ],
    enabled: Boolean(
      origin &&
      selectedLot &&
      validCoordinates(origin) &&
      validCoordinates(selectedLot),
    ),
    queryFn: ({ signal }) => getDrivingRoute(origin!, selectedLot!, signal),
    retry: false,
    staleTime: 120000,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    const instance = map.current
    if (!instance || !ready) return
    if (!route.data) {
      lastFittedRouteKey.current = null
      return
    }
    const routeColor = resolveRouteColor(container.current)
    const line = L.polyline(route.data.points, {
      color: routeColor,
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      smoothFactor: 1,
      noClip: true,
      interactive: false,
    }).addTo(instance)

    const routeKey = `${origin?.latitude},${origin?.longitude}->${selectedLot?.id}`
    if (lastFittedRouteKey.current !== routeKey) {
      lastFittedRouteKey.current = routeKey
      const isDesktop = instance.getSize().x >= 960
      instance.fitBounds(line.getBounds(), {
        paddingTopLeft: isDesktop ? [470, 90] : [55, 90],
        paddingBottomRight: isDesktop ? [90, 130] : [55, 100],
      })
    }
    return () => {
      line.remove()
    }
  }, [route.data, ready, origin?.latitude, origin?.longitude, selectedLot?.id])

  return (
    <section
      aria-label="Bản đồ bãi đỗ OpenStreetMap"
      className="parking-map relative w-full lg:h-full isolate"
    >
      {/* Full-bleed Map Canvas */}
      <div className="relative w-full h-[440px] sm:h-[520px] lg:h-full">
        <div ref={container} className="h-full w-full" />

        {tilesUnavailable && (
          <div
            role="status"
            className="absolute top-20 left-4 right-4 lg:left-[448px] xl:left-[476px] lg:right-4 z-[1000] rounded-2xl border border-brand-border bg-white/95 backdrop-blur-md p-4 text-sm text-brand-muted shadow-lg"
          >
            <p>
              Chưa tải được nền bản đồ. Kiểm tra kết nối mạng để tải dữ liệu
              OpenStreetMap.
            </p>
            <button
              type="button"
              className="mt-2 font-semibold text-brand-navy underline underline-offset-4 cursor-pointer"
              onClick={() => tileLayer.current?.redraw()}
            >
              Thử tải lại bản đồ
            </button>
          </div>
        )}

        {/* Bottom-Right Map Controls (Google Maps style, placed cleanly above AiCopilot) */}
        <div className="absolute bottom-4 right-3 lg:bottom-24 lg:right-4 z-[1000] flex flex-col items-end gap-2">
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

      {/* Bottom Selected Lot & Route HUD (Floating over open map on desktop, stacked below map on mobile) */}
      {(selectedLot || origin) && (
        <div className="mx-3 mt-3 lg:mx-0 lg:mt-0 lg:absolute lg:bottom-4 lg:left-[432px] xl:left-[464px] lg:right-24 lg:max-w-[540px] lg:z-[1000]">
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
                      {new Intl.NumberFormat('vi-VN').format(selectedLot.hourlyRate)} đ/h
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
                  <Link
                    to={`/parking/${selectedLot.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-brand-border bg-white px-3 text-xs font-semibold text-brand-navy hover:bg-slate-50 transition-colors"
                  >
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    disabled={selectedLot.isFull || selectedLot.availableSlots === 0}
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
              <Navigation size={14} className="mt-0.5 shrink-0 text-brand-orange" />
              <div className="min-w-0 flex-1">
                {route.isFetching ? (
                  <p>Đang tìm tuyến đường…</p>
                ) : route.data ? (
                  <p className="font-semibold text-brand-navy">
                    {route.data.distanceKm.toFixed(1)} km · Khoảng{' '}
                    {route.data.durationMinutes} phút{' '}
                    <span className="font-normal text-brand-muted">qua OSRM</span>
                  </p>
                ) : (
                  <p>
                    {route.isError
                      ? 'Chưa tải được tuyến đường. Bạn vẫn có thể xem vị trí bãi.'
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
