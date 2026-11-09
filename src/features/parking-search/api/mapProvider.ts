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

// Public Nominatim is queried on explicit submission or as fallback when autocomplete service is unavailable.
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

interface PhotonFeature {
  geometry?: { coordinates?: [number, number] }
  properties?: {
    osm_id?: number
    osm_type?: string
    name?: string
    housenumber?: string
    street?: string
    district?: string
    suburb?: string
    city?: string
    county?: string
    state?: string
    country?: string
    countrycode?: string
  }
}

function formatPhotonLabel(p: NonNullable<PhotonFeature['properties']>): string {
  const streetLine = [p.housenumber, p.street].filter(Boolean).join(' ').trim()
  const parts = [
    p.name,
    streetLine && streetLine !== p.name ? streetLine : '',
    p.district || p.suburb,
    p.city || p.county,
    p.state,
  ].filter((part): part is string => Boolean(part && part.trim()))

  const seen = new Set<string>()
  const unique: string[] = []
  for (const part of parts) {
    const key = part.trim().toLocaleLowerCase('vi')
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(part.trim())
    }
  }
  return unique.join(', ')
}

export async function autocompleteLocations(
  query: string,
  signal?: AbortSignal,
): Promise<Place[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const params = new URLSearchParams({
    q: trimmed,
    limit: '8',
    lat: '10.7769',
    lon: '106.7009',
  })

  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?${params}`,
      { signal },
    )
    if (response.ok) {
      const payload = (await response.json()) as { features?: PhotonFeature[] }
      const features = Array.isArray(payload.features) ? payload.features : []
      const vietnamPlaces: Place[] = []
      const seenLabels = new Set<string>()

      for (const feature of features) {
        const props = feature.properties ?? {}
        const countryCode = props.countrycode?.toUpperCase()
        const countryName = props.country?.toLocaleLowerCase('vi') ?? ''
        const isVietnam =
          countryCode === 'VN' ||
          countryName === 'vietnam' ||
          countryName === 'việt nam'
        if (!isVietnam) continue

        const coords = feature.geometry?.coordinates
        if (!coords || coords.length < 2) continue
        const longitude = Number(coords[0])
        const latitude = Number(coords[1])
        const label = formatPhotonLabel(props)
        if (!label || !validCoordinates({ latitude, longitude })) continue

        const dedupKey = label.toLocaleLowerCase('vi')
        if (seenLabels.has(dedupKey)) continue
        seenLabels.add(dedupKey)

        vietnamPlaces.push({
          id: `${props.osm_type ?? 'p'}-${props.osm_id ?? vietnamPlaces.length}-${latitude.toFixed(4)}`,
          label,
          latitude,
          longitude,
        })
        if (vietnamPlaces.length >= 5) break
      }

      if (vietnamPlaces.length > 0) {
        return vietnamPlaces
      }
    }
  } catch (error) {
    if (signal?.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
      throw error
    }
    // Fallback below if Photon fails on current network
  }

  return trimmed.length >= 3 ? searchLocations(trimmed, signal) : []
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
