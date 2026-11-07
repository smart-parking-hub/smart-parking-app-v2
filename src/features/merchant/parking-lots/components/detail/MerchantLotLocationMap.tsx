import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export function MerchantLotLocationMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  const container = useRef<HTMLDivElement>(null)
  const [tileError, setTileError] = useState(false)
  useEffect(() => {
    if (!container.current) return
    setTileError(false)
    const map = L.map(container.current, { scrollWheelZoom: false }).setView([latitude, longitude], 15)
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)
    tiles.on('tileerror', () => setTileError(true))
    const color = getComputedStyle(container.current).getPropertyValue('--color-brand-primary').trim()
    L.circleMarker([latitude, longitude], { radius: 10, color, fillColor: color, fillOpacity: 0.9, weight: 3 }).addTo(map)
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(container.current)
    return () => { observer.disconnect(); map.remove() }
  }, [latitude, longitude])
  return <div className="lot-location-map"><div ref={container} role="region" aria-label="Bản đồ vị trí bãi đỗ" className="lot-location-map-canvas" />{tileError && <p className="lot-map-error" role="status">Chưa tải được bản đồ. Bạn có thể mở vị trí trên Google Maps bên dưới.</p>}</div>
}
