export interface Coordinates {
  latitude: number
  longitude: number
}

export type LatLngInput =
  | google.maps.LatLng
  | google.maps.LatLngLiteral
  | google.maps.LatLngAltitude
  | {
      lat: number | (() => number)
      lng: number | (() => number)
    }

/**
 * Validates geographic coordinates.
 * Rejects non-finite values, out-of-range coordinates, and (0, 0) null-island placeholders.
 */
export function isValidCoordinates(
  point: Partial<Coordinates> | null | undefined,
): point is Coordinates {
  if (!point) return false
  const { latitude, longitude } = point
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return false
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return false
  if (latitude === 0 && longitude === 0) return false
  return true
}

export function toLatLngLiteral(point: Coordinates): google.maps.LatLngLiteral {
  return {
    lat: point.latitude,
    lng: point.longitude,
  }
}

export function fromLatLng(point: LatLngInput): Coordinates {
  const lat = typeof point.lat === 'function' ? point.lat() : point.lat
  const lng = typeof point.lng === 'function' ? point.lng() : point.lng
  return {
    latitude: Number(lat),
    longitude: Number(lng),
  }
}

export function roundCoordinate(value: number, precision = 7): number {
  if (!Number.isFinite(value)) return value
  return Number(value.toFixed(precision))
}

export function formatCoordinate(value: number, precision = 7): string {
  if (!Number.isFinite(value)) return ''
  return value.toFixed(precision)
}
