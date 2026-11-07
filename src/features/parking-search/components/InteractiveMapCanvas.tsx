import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Navigation, LocateFixed, MapPin, ArrowUpRight } from 'lucide-react'
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
  const [tilesUnavailable, setTilesUnavailable] = useState(false)
  const [ready, setReady] = useState(false)
  const select = useRef(onSelectLot)

  useEffect(() => {
    select.current = onSelectLot
  }, [onSelectLot])

  useEffect(() => {
    if (!container.current) return
    const instance = L.map(container.current, {
      zoomControl: false,
      scrollWheelZoom: false,
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

    tiles.on('tileerror', () => setTilesUnavailable(true))
    tiles.on('tileload', () => {
      loaded = true
      setTilesUnavailable(false)
    })

    // Position zoom controls cleanly with high z-index
    L.control.zoom({ position: 'topright' }).addTo(instance)
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(instance)

    const resize = new ResizeObserver(() => instance.invalidateSize())
    resize.observe(container.current)
    setReady(true)

    return () => {
      clearTimeout(tileTimeout)
      resize.disconnect()
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

      const popup = document.createElement('div')
      popup.className = 'min-w-[200px] space-y-2 p-1 font-inter text-brand-navy'
      const name = document.createElement('strong')
      name.textContent = lot.name
      const address = document.createElement('p')
      address.className = 'text-sm text-brand-muted'
      address.textContent = lot.address
      const price = document.createElement('p')
      price.textContent = `${lot.availableSlots > 0 ? `Còn ${lot.availableSlots} chỗ` : 'Hết chỗ'} · ${new Intl.NumberFormat('vi-VN').format(lot.hourlyRate)} đ/h`
      popup.append(name, address, price)

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
        .bindPopup(popup, { offset: [0, -32], closeButton: true })
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
      L.circleMarker([origin.latitude, origin.longitude], {
        radius: 9,
        color: 'white',
        weight: 3,
        fillColor: 'var(--color-map-route)',
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
    if (selectedLot && validCoordinates(selectedLot)) {
      instance.flyTo(
        [selectedLot.latitude, selectedLot.longitude],
        Math.max(instance.getZoom(), 15),
        { duration: 0.5 },
      )
    } else {
      const points = lots
        .filter(validCoordinates)
        .map((lot) => [lot.latitude, lot.longitude] as [number, number])
      if (points.length)
        instance.fitBounds(points, { padding: [70, 70], maxZoom: 14 })
    }
  }, [selectedLot, lots, ready])

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
  })

  useEffect(() => {
    const instance = map.current
    if (!instance || !route.data) return
    const line = L.polyline(route.data.points, {
      color: 'var(--color-map-route)',
      weight: 5,
      opacity: 0.9,
    }).addTo(instance)
    instance.fitBounds(line.getBounds(), {
      paddingTopLeft: [55, 90],
      paddingBottomRight: [55, 100],
    })
    return () => {
      line.remove()
    }
  }, [route.data, ready])

  return (
    <section
      aria-label="Bản đồ bãi đỗ OpenStreetMap"
      className="parking-map sticky top-[calc(var(--driver-header-height)+24px)] min-w-0 space-y-4"
    >
      <div className="overflow-hidden rounded-3xl border border-brand-border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <MapPin size={19} className="text-brand-orange" />
            <div>
              <h2 className="font-sora text-base font-semibold">
                Bản đồ khu vực
              </h2>
              <p className="mt-1 text-sm text-brand-muted">
                OpenStreetMap · {lots.length} bãi đang hiển thị
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Hiển thị tất cả bãi trên bản đồ"
            className="flex items-center gap-2 rounded-xl border border-brand-border px-3 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={() => {
              const points = lots
                .filter(validCoordinates)
                .map((lot) => [lot.latitude, lot.longitude] as [number, number])
              if (points.length)
                map.current?.fitBounds(points, {
                  padding: [60, 60],
                  maxZoom: 14,
                })
            }}
          >
            <LocateFixed size={17} />
            Toàn khu vực
          </button>
        </div>
        <div className="relative isolate">
          <div
            ref={container}
            className="h-[440px] w-full sm:h-[560px] xl:h-[min(65vh,760px)] xl:min-h-[520px]"
          />
          {tilesUnavailable && (
            <div
              role="status"
              className="absolute bottom-9 left-4 right-4 z-[500] rounded-xl border border-brand-border bg-white p-4 text-sm text-brand-muted"
            >
              <p>
                Chưa tải được nền bản đồ. Kiểm tra kết nối mạng để tải dữ liệu
                OpenStreetMap.
              </p>
              <button
                type="button"
                className="mt-3 font-semibold text-brand-navy underline underline-offset-4 cursor-pointer"
                onClick={() => tileLayer.current?.redraw()}
              >
                Thử tải lại bản đồ
              </button>
            </div>
          )}
        </div>
        {selectedLot && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-border p-5 sm:p-6 bg-slate-50/50">
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-semibold tracking-wider text-[#d95f00]">
                BÃI ĐANG CHỌN
              </p>
              <h3 className="font-sora text-base font-semibold leading-relaxed text-brand-navy">
                {selectedLot.name}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 mb-1">
                {selectedLot.address}
              </p>
              <p className="text-xs font-medium text-brand-muted">
                <span className="font-semibold text-emerald-700">
                  {selectedLot.availableSlots} chỗ trống
                </span>{' '}
                ·{' '}
                <span className="font-mono font-bold text-slate-900">
                  {new Intl.NumberFormat('vi-VN').format(selectedLot.hourlyRate)} đ/h
                </span>
              </p>
            </div>
            <button
              type="button"
              disabled={selectedLot.isFull || selectedLot.availableSlots === 0}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#d95f00] hover:bg-[#b85000] px-5 text-sm font-semibold text-white disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
              onClick={() => onQuickBook(selectedLot)}
            >
              Giữ chỗ
              <ArrowUpRight size={17} />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-brand-border bg-white px-5 py-4 text-sm leading-6 text-brand-muted">
        <Navigation size={19} className="mt-1 shrink-0 text-brand-orange" />
        <div>
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
          <p className="mt-1 text-xs">
            Tuyến tham khảo cho ô tô. Cần kiểm tra biển cấm tải và giới hạn
            phương tiện thực tế.
          </p>
        </div>
      </div>
    </section>
  )
}
