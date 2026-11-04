export interface Coordinates {
  latitude: number
  longitude: number
}
export interface Place extends Coordinates {
  id: string
  label: string
}
export interface DrivingRoute {
  points: [number, number][]
  distanceKm: number
  durationMinutes: number
}
export const validCoordinates = (point: Coordinates) =>
  Number.isFinite(point.latitude) &&
  Number.isFinite(point.longitude) &&
  Math.abs(point.latitude) <= 90 &&
  Math.abs(point.longitude) <= 180

// Public Nominatim is queried only on explicit submission, never autocomplete.
export async function searchLocations(
  query: string,
  signal?: AbortSignal,
): Promise<Place[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    countrycodes: 'vn',
    limit: '5',
    'accept-language': 'vi',
  })
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { signal },
  )
  if (!response.ok)
    throw new Error('Chưa tìm được địa điểm. Vui lòng thử lại sau.')
  const rows: {
    place_id: number
    display_name: string
    lat: string
    lon: string
  }[] = await response.json()
  return rows
    .map((row) => ({
      id: String(row.place_id),
      label: row.display_name,
      latitude: Number(row.lat),
      longitude: Number(row.lon),
    }))
    .filter(validCoordinates)
}

export async function getDrivingRoute(
  origin: Coordinates,
  destination: Coordinates,
  signal?: AbortSignal,
): Promise<DrivingRoute> {
  if (!validCoordinates(origin) || !validCoordinates(destination))
    throw new Error('Tọa độ tuyến đường chưa hợp lệ.')
  const points = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${points}?overview=full&geometries=geojson&steps=false`,
    { signal },
  )
  if (!response.ok)
    throw new Error('Dịch vụ chỉ đường tạm thời không khả dụng.')
  const result: {
    code: string
    routes: {
      distance: number
      duration: number
      geometry: { coordinates: [number, number][] }
    }[]
  } = await response.json()
  const route = result.routes?.[0]
  if (result.code !== 'Ok' || !route)
    throw new Error('Chưa tìm thấy tuyến đường tới bãi.')
  return {
    points: route.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
    distanceKm: route.distance / 1000,
    durationMinutes: Math.max(1, Math.round(route.duration / 60)),
  }
}
