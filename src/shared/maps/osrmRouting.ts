import { isValidCoordinates, type Coordinates } from './coordinates'
import { getMapRuntimeConfig } from './runtimeConfig'

export interface DrivingRouteResult {
  geometry: GeoJSON.LineString
  distanceMeters: number
  durationSeconds: number
  provider: 'osrm'
}

export type RoutingErrorCode =
  | 'DISABLED'
  | 'INVALID_COORDINATES'
  | 'NO_ROUTE'
  | 'RATE_LIMITED'
  | 'TIMEOUT'
  | 'UNAVAILABLE'

export class RoutingError extends Error {
  readonly code: RoutingErrorCode

  constructor(code: RoutingErrorCode, message: string) {
    super(message)
    this.name = 'RoutingError'
    this.code = code
  }
}

interface OsrmRoutePayload {
  code?: string
  routes?: Array<{
    distance?: number
    duration?: number
    geometry?: {
      type?: string
      coordinates?: unknown
    }
  }>
}

interface RouteCacheEntry {
  expiresAt: number
  route: DrivingRouteResult
}

const ROUTE_CACHE_TTL_MS = 5 * 60_000
const MAX_ROUTE_CACHE_ENTRIES = 50
const DEFAULT_TIMEOUT_MS = 8_000

const routeCache = new Map<string, RouteCacheEntry>()

export function clearDrivingRouteCacheForTests(): void {
  routeCache.clear()
}

function buildRouteCacheKey(
  baseUrl: string,
  origin: Coordinates,
  destination: Coordinates,
): string {
  const oLat = origin.latitude.toFixed(4)
  const oLng = origin.longitude.toFixed(4)
  const dLat = destination.latitude.toFixed(4)
  const dLng = destination.longitude.toFixed(4)
  return `${baseUrl}|${oLng},${oLat};${dLng},${dLat}`
}

function readRouteCache(key: string): DrivingRouteResult | null {
  const entry = routeCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    routeCache.delete(key)
    return null
  }
  return entry.route
}

function writeRouteCache(key: string, route: DrivingRouteResult): void {
  if (routeCache.size >= MAX_ROUTE_CACHE_ENTRIES) {
    const oldestKey = routeCache.keys().next().value
    if (oldestKey !== undefined) {
      routeCache.delete(oldestKey)
    }
  }
  routeCache.set(key, {
    expiresAt: Date.now() + ROUTE_CACHE_TTL_MS,
    route,
  })
}

function isValidLineStringCoordinates(
  coords: unknown,
): coords is [number, number][] {
  if (!Array.isArray(coords) || coords.length < 2) return false
  return coords.every(
    (point) =>
      Array.isArray(point) &&
      point.length >= 2 &&
      typeof point[0] === 'number' &&
      typeof point[1] === 'number' &&
      Number.isFinite(point[0]) &&
      Number.isFinite(point[1]),
  )
}

export interface FetchDrivingRouteOptions {
  signal?: AbortSignal
  timeoutMs?: number
}

/**
 * Fetches a real driving route (GeoJSON LineString, distance, duration) from OSRM.
 * Uses [longitude, latitude] coordinate order, in-memory caching, AbortController, and timeout.
 */
export async function fetchDrivingRoute(
  origin: Coordinates,
  destination: Coordinates,
  options: FetchDrivingRouteOptions = {},
): Promise<DrivingRouteResult> {
  if (!isValidCoordinates(origin) || !isValidCoordinates(destination)) {
    throw new RoutingError(
      'INVALID_COORDINATES',
      'Tọa độ điểm xuất phát hoặc bãi đỗ không hợp lệ.',
    )
  }

  const config = getMapRuntimeConfig()
  if (!config.routingEnabled) {
    throw new RoutingError(
      'DISABLED',
      'Tính năng vẽ tuyến đường OSRM hiện đang tạm tắt.',
    )
  }

  const baseUrl = config.osrmUrl.replace(/\/+$/, '')
  const cacheKey = buildRouteCacheKey(baseUrl, origin, destination)
  const cached = readRouteCache(cacheKey)
  if (cached) {
    return cached
  }

  const url =
    `${baseUrl}/route/v1/driving/` +
    `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}` +
    `?overview=full&geometries=geojson&steps=false`

  const controller = new AbortController()
  let timedOut = false
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const timer = globalThis.setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)

  const onCallerAbort = () => controller.abort()
  if (options.signal) {
    if (options.signal.aborted) {
      globalThis.clearTimeout(timer)
      throw new DOMException('The operation was aborted.', 'AbortError')
    }
    options.signal.addEventListener('abort', onCallerAbort, { once: true })
  }

  let response: Response
  try {
    response = await fetch(url, { signal: controller.signal })
  } catch (error) {
    if (timedOut) {
      throw new RoutingError(
        'TIMEOUT',
        'Hết thời gian tính tuyến đường OSRM. Bạn vẫn có thể mở chỉ đường bằng Google Maps.',
      )
    }
    if (
      options.signal?.aborted ||
      (error instanceof DOMException && error.name === 'AbortError')
    ) {
      throw error
    }
    throw new RoutingError(
      'UNAVAILABLE',
      'Chưa kết nối được dịch vụ định tuyến OSRM. Bạn vẫn có thể mở chỉ đường bằng Google Maps.',
    )
  } finally {
    globalThis.clearTimeout(timer)
    options.signal?.removeEventListener('abort', onCallerAbort)
  }

  if (response.status === 429) {
    throw new RoutingError(
      'RATE_LIMITED',
      'Dịch vụ định tuyến OSRM đang bận tạm thời. Bạn có thể mở chỉ đường bằng Google Maps.',
    )
  }

  if (!response.ok) {
    throw new RoutingError(
      'UNAVAILABLE',
      'Không tải được tuyến đường từ OSRM. Bạn vẫn có thể mở chỉ đường bằng Google Maps.',
    )
  }

  const payload = (await response.json()) as OsrmRoutePayload
  const firstRoute = Array.isArray(payload.routes) ? payload.routes[0] : undefined
  const coords = firstRoute?.geometry?.coordinates

  if (
    payload.code !== 'Ok' ||
    !firstRoute ||
    firstRoute.geometry?.type !== 'LineString' ||
    !isValidLineStringCoordinates(coords)
  ) {
    throw new RoutingError(
      'NO_ROUTE',
      'Không tìm thấy tuyến đường bộ phù hợp giữa hai điểm đã chọn.',
    )
  }

  const distanceMeters = Number(firstRoute.distance)
  const durationSeconds = Number(firstRoute.duration)
  if (!Number.isFinite(distanceMeters) || !Number.isFinite(durationSeconds)) {
    throw new RoutingError(
      'UNAVAILABLE',
      'Dữ liệu tuyến đường OSRM không hợp lệ.',
    )
  }

  const result: DrivingRouteResult = {
    geometry: {
      type: 'LineString',
      coordinates: coords,
    },
    distanceMeters: Math.max(0, distanceMeters),
    durationSeconds: Math.max(0, durationSeconds),
    provider: 'osrm',
  }

  writeRouteCache(cacheKey, result)
  return result
}

export function formatRouteDistance(distanceMeters: number): string {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) return ''
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`
  }
  const km = distanceMeters / 1000
  const formatted = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: km < 10 ? 1 : 0,
    maximumFractionDigits: 1,
  }).format(km)
  return `${formatted} km`
}

export function formatRouteDuration(durationSeconds: number): string {
  if (!Number.isFinite(durationSeconds) || durationSeconds < 0) return ''
  const totalMinutes = Math.max(1, Math.round(durationSeconds / 60))
  if (totalMinutes < 60) {
    return `${totalMinutes} phút`
  }
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return minutes > 0 ? `${hours} giờ ${minutes} phút` : `${hours} giờ`
}
