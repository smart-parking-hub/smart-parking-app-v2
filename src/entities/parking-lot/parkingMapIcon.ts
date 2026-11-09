import L from 'leaflet'
import './parking-map-icon.css'

interface ParkingMapIconOptions {
  hourlyRate?: number
  availableSlots?: number
  selected?: boolean
  full?: boolean
}

/** The pointer, rather than the label's center, is anchored to the lot's GPS. */
export function createParkingMapIcon(options: ParkingMapIconOptions = {}) {
  const detailed = options.hourlyRate !== undefined
  const pin = document.createElement('span')
  pin.className = 'parking-map-pin'
  pin.dataset.selected = String(Boolean(options.selected))
  pin.dataset.full = String(Boolean(options.full))
  pin.dataset.compact = String(!detailed)
  pin.setAttribute('aria-hidden', 'true')

  const badge = document.createElement('span')
  badge.className = 'parking-map-pin__badge'
  const symbol = document.createElement('span')
  symbol.className = 'parking-map-pin__symbol'
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.7')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  for (const d of [
    'M3 21V8l9-5 9 5v13H3Z',
    'M7 21V11h10v10M7 14h10',
    'M9 18h6M9 21v-3m6 3v-3',
  ]) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', d)
    svg.append(path)
  }
  symbol.append(svg)
  badge.append(symbol)

  if (detailed) {
    const info = document.createElement('span')
    info.className = 'parking-map-pin__info'
    const price = document.createElement('span')
    price.className = 'parking-map-pin__price'
    price.textContent = `${new Intl.NumberFormat('vi-VN').format(options.hourlyRate! / 1000)}K / giờ`
    const capacity = document.createElement('span')
    capacity.className = 'parking-map-pin__capacity'
    capacity.textContent = options.full ? 'Hết chỗ' : `${options.availableSlots ?? 0} chỗ trống`
    info.append(price, capacity)
    badge.append(info)
  }
  pin.append(badge)
  return L.divIcon({
    html: pin,
    className: 'parking-map-marker',
    iconSize: detailed ? [156, 64] : [44, 52],
    iconAnchor: detailed ? [22, 64] : [22, 52],
    popupAnchor: detailed ? [56, -58] : [0, -46],
    tooltipAnchor: [0, -48],
  })
}
