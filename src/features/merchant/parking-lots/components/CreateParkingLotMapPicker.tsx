import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface CreateParkingLotMapPickerProps {
  latitude: number
  longitude: number
  accuracy?: number
  onCoordinatesChange: (lat: number, lng: number) => void
}

export function CreateParkingLotMapPicker({ latitude, longitude, accuracy, onCoordinatesChange }: CreateParkingLotMapPickerProps) {
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const marker = useRef<L.CircleMarker | null>(null)
  const onChange = useRef(onCoordinatesChange)
  const [tileError, setTileError] = useState(false)
  useEffect(() => { onChange.current = onCoordinatesChange }, [onCoordinatesChange])

  useEffect(() => {
    if (!container.current) return
    const instance = L.map(container.current).setView([16.05, 108.2], 5)
    map.current = instance
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(instance)
    tiles.on('tileerror', () => setTileError(true))
    instance.on('click', (event: L.LeafletMouseEvent) => {
      onChange.current(Number(event.latlng.lat.toFixed(7)), Number(event.latlng.lng.toFixed(7)))
    })
    const observer = new ResizeObserver(() => instance.invalidateSize())
    observer.observe(container.current)
    return () => {
      observer.disconnect()
      instance.remove()
      map.current = null
      marker.current = null
    }
  }, [])

  useEffect(() => {
    if (!map.current || !Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return
    const position: L.LatLngExpression = [latitude, longitude]
    if (marker.current) marker.current.setLatLng(position)
    else marker.current = L.circleMarker(position, { radius: 10, color: '#d95f00', fillColor: '#d95f00', fillOpacity: 0.8 }).addTo(map.current)
    map.current.setView(position, 16)
  }, [latitude, longitude])

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">Chọn vị trí bãi đỗ trên bản đồ</p>
      <div ref={container} aria-label="Bản đồ chọn vị trí bãi đỗ" className="relative z-0 h-[360px] w-full rounded-xl border border-slate-200" />
      {tileError && <p role="alert" className="text-sm text-red-600">Không tải được một số ô bản đồ. Kiểm tra kết nối mạng hoặc nhập tọa độ ở trên.</p>}
      {Number.isFinite(latitude) && Number.isFinite(longitude) && <p className="text-xs text-slate-500">Vị trí đang chọn: {latitude.toFixed(7)}, {longitude.toFixed(7)}</p>}
      <p className="text-sm text-slate-500">Nhấn trên bản đồ để đặt ghim. Bạn cũng có thể nhập tọa độ hoặc lấy vị trí thiết bị.</p>
      {accuracy !== undefined && <p className="text-xs text-slate-500">Sai số vị trí thiết bị: ±{Math.round(accuracy)} m.</p>}
    </div>
  )
}
