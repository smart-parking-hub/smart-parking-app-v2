export interface Coordinates {
  latitude: number
  longitude: number
}

/** [latitude, longitude] tuple */
export type LatLngTuple = [number, number]

/** [longitude, latitude] tuple required by MapLibre GL JS and GeoJSON */
export type LngLatTuple = [number, number]

export interface LatLngLike {
  lat: number | (() => number)
  lng: number | (() => number)
}

export interface LatLngLiteral {
  lat: number
  lng: number
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

export function toLatLngTuple(point: Coordinates): LatLngTuple {
  return [point.latitude, point.longitude]
}

export function toLngLatTuple(point: Coordinates): LngLatTuple {
  return [point.longitude, point.latitude]
}

export function toLatLngLiteral(point: Coordinates): LatLngLiteral {
  return {
    lat: point.latitude,
    lng: point.longitude,
  }
}

export function fromLatLng(point: LatLngLike): Coordinates {
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

/**
 * Builds a GeoJSON Polygon approximating a geodesic circle (in meters) around a coordinate.
 * Used by MapLibre GL JS to display GPS accuracy rings.
 */
export function createAccuracyCircleGeoJson(
  center: Coordinates,
  radiusMeters: number,
  steps = 48,
): GeoJSON.Feature<GeoJSON.Polygon> {
  const earthRadiusMeters = 6371008.8
  const latRad = (center.latitude * Math.PI) / 180
  const lngRad = (center.longitude * Math.PI) / 180
  const angularDistance = radiusMeters / earthRadiusMeters

  const ring: LngLatTuple[] = []
  for (let i = 0; i <= steps; i++) {
    const bearing = (i / steps) * 2 * Math.PI
    const destLat = Math.asin(
      Math.sin(latRad) * Math.cos(angularDistance) +
        Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearing),
    )
    const destLng =
      lngRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latRad),
        Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(destLat),
      )
    ring.push([(destLng * 180) / Math.PI, (destLat * 180) / Math.PI])
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [ring],
    },
  }
}
