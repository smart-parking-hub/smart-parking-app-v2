import {
  DEFAULT_MAP_CENTER,
  getMapRuntimeConfig,
  isValidCoordinates,
  type Coordinates,
} from '@/shared/maps'

export type { Coordinates }
export const validCoordinates = isValidCoordinates

export interface Place extends Coordinates {
  id: string
  label: string
}

export type GeocoderErrorCode = 'RATE_LIMITED' | 'DISABLED' | 'UNAVAILABLE'

export class GeocoderError extends Error {
  readonly code: GeocoderErrorCode

  constructor(code: GeocoderErrorCode, message: string) {
    super(message)
    this.name = 'GeocoderError'
    this.code = code
  }
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

interface CacheEntry {
  expiresAt: number
  places: Place[]
}

const CACHE_TTL_MS = 120_000
const MAX_CACHE_ENTRIES = 50
const MIN_PHOTON_QUERY_LENGTH = 3
const MAX_PHOTON_RESULTS = 5

const photonCache = new Map<string, CacheEntry>()

export function clearGeocoderCacheForTests() {
  photonCache.clear()
}

function formatPhotonLabel(
  p: NonNullable<PhotonFeature['properties']>,
): string {
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

function buildCacheKey(query: string, biasCenter: Coordinates, endpoint: string): string {
  return `${endpoint}|${biasCenter.latitude.toFixed(2)},${biasCenter.longitude.toFixed(2)}|${query.toLocaleLowerCase('vi')}`
}

function readFromCache(key: string): Place[] | null {
  const entry = photonCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    photonCache.delete(key)
    return null
  }
  return entry.places
}

function writeToCache(key: string, places: Place[]) {
  if (photonCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = photonCache.keys().next().value
    if (oldestKey !== undefined) {
      photonCache.delete(oldestKey)
    }
  }
  photonCache.set(key, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    places,
  })
}

export interface AutocompleteLocationsOptions {
  signal?: AbortSignal
  biasCenter?: Coordinates
}

/**
 * Queries Photon for Vietnam location suggestions (search-as-you-type).
 * - Requires at least 3 characters
 * - Returns at most 5 deduplicated Vietnam results
 * - Uses short in-memory cache and never retries on HTTP 429
 * - Does NOT fall back to public Nominatim (policy compliance)
 */
export async function autocompleteLocations(
  query: string,
  options: AutocompleteLocationsOptions = {},
): Promise<Place[]> {
  const trimmed = query.trim()
  if (trimmed.length < MIN_PHOTON_QUERY_LENGTH) return []

  const config = getMapRuntimeConfig()
  if (!config.geocoderEnabled) {
    throw new GeocoderError(
      'DISABLED',
      'Gợi ý địa điểm ngoài hệ thống đang tạm tắt. Bạn vẫn có thể chọn bãi trên hệ thống hoặc dùng GPS.',
    )
  }

  const biasCenter =
    options.biasCenter && isValidCoordinates(options.biasCenter)
      ? options.biasCenter
      : DEFAULT_MAP_CENTER

  const cacheKey = buildCacheKey(trimmed, biasCenter, config.photonUrl)
  const cached = readFromCache(cacheKey)
  if (cached) {
    return cached
  }

  const url = new URL(config.photonUrl)
  url.searchParams.set('q', trimmed)
  url.searchParams.set('limit', '8')
  url.searchParams.set('lat', String(biasCenter.latitude))
  url.searchParams.set('lon', String(biasCenter.longitude))

  let response: Response
  try {
    response = await fetch(url.toString(), { signal: options.signal })
  } catch (error) {
    if (
      options.signal?.aborted ||
      (error instanceof DOMException && error.name === 'AbortError')
    ) {
      throw error
    }
    throw new GeocoderError(
      'UNAVAILABLE',
      'Không kết nối được dịch vụ gợi ý địa điểm. Bạn vẫn có thể chọn bãi trên hệ thống hoặc dùng GPS.',
    )
  }

  if (response.status === 429) {
    throw new GeocoderError(
      'RATE_LIMITED',
      'Dịch vụ gợi ý địa điểm đang giới hạn lưu lượng tạm thời. Vui lòng thử lại sau ít giây hoặc dùng GPS.',
    )
  }

  if (!response.ok) {
    throw new GeocoderError(
      'UNAVAILABLE',
      'Dịch vụ gợi ý địa điểm tạm thời không khả dụng. Bạn vẫn có thể chọn bãi trên hệ thống hoặc dùng GPS.',
    )
  }

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

    // GeoJSON order is [longitude, latitude]
    const longitude = Number(coords[0])
    const latitude = Number(coords[1])
    const label = formatPhotonLabel(props)
    if (!label || !isValidCoordinates({ latitude, longitude })) continue

    const dedupKey = label.toLocaleLowerCase('vi')
    if (seenLabels.has(dedupKey)) continue
    seenLabels.add(dedupKey)

    vietnamPlaces.push({
      id: `${props.osm_type ?? 'p'}-${props.osm_id ?? vietnamPlaces.length}-${latitude.toFixed(4)}`,
      label,
      latitude,
      longitude,
    })

    if (vietnamPlaces.length >= MAX_PHOTON_RESULTS) break
  }

  writeToCache(cacheKey, vietnamPlaces)
  return vietnamPlaces
}
