import type { Coordinates } from './coordinates'

export const DEFAULT_MAP_CENTER: Coordinates = {
  latitude: 10.7769,
  longitude: 106.7009,
}

export const DEFAULT_MAP_ZOOM = 12
export const DEFAULT_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
export const DEFAULT_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
export const DEFAULT_TILE_MAX_ZOOM = 19
export const DEFAULT_PHOTON_URL = 'https://photon.komoot.io/api/'

export interface MapRuntimeConfig {
  tileUrl: string
  tileAttribution: string
  maxZoom: number
  photonUrl: string
  geocoderEnabled: boolean
}

export type PartialMapRuntimeConfig = Partial<MapRuntimeConfig>

declare global {
  interface Window {
    __SMART_PARKING_MAP_CONFIG__?: PartialMapRuntimeConfig
  }
}

function isAllowedEndpointUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    if (parsed.username || parsed.password) return false
    if (parsed.protocol === 'https:') return true
    if (
      parsed.protocol === 'http:' &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
    ) {
      return true
    }
    return false
  } catch {
    return false
  }
}

function isValidTileUrlTemplate(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  // Replace tile placeholders temporarily so URL validation works on template strings.
  const probe = trimmed
    .replace(/\{s\}/g, 'a')
    .replace(/\{[xyz]\}/g, '0')
    .replace(/\{r\}/g, '')
  return isAllowedEndpointUrl(probe)
}

function sanitizeAttribution(value: unknown): string {
  if (typeof value !== 'string') return DEFAULT_TILE_ATTRIBUTION
  const trimmed = value.trim()
  if (!trimmed || /<script|on\w+\s*=/i.test(trimmed)) {
    return DEFAULT_TILE_ATTRIBUTION
  }
  return trimmed
}

function sanitizeMaxZoom(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return DEFAULT_TILE_MAX_ZOOM
  return Math.min(22, Math.max(10, Math.round(num)))
}

function parseBooleanFlag(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'false' || normalized === '0' || normalized === 'off') {
      return false
    }
    if (normalized === 'true' || normalized === '1' || normalized === 'on') {
      return true
    }
  }
  return fallback
}

export function validateMapRuntimeConfig(
  raw: PartialMapRuntimeConfig | null | undefined,
  base: MapRuntimeConfig,
): MapRuntimeConfig {
  if (!raw || typeof raw !== 'object') return base

  const tileUrl =
    typeof raw.tileUrl === 'string' && isValidTileUrlTemplate(raw.tileUrl)
      ? raw.tileUrl.trim()
      : base.tileUrl

  const photonUrl =
    typeof raw.photonUrl === 'string' && isAllowedEndpointUrl(raw.photonUrl.trim())
      ? raw.photonUrl.trim()
      : base.photonUrl

  const tileAttribution =
    raw.tileAttribution !== undefined
      ? sanitizeAttribution(raw.tileAttribution)
      : base.tileAttribution

  const maxZoom =
    raw.maxZoom !== undefined ? sanitizeMaxZoom(raw.maxZoom) : base.maxZoom

  const geocoderEnabled = parseBooleanFlag(
    raw.geocoderEnabled,
    base.geocoderEnabled,
  )

  return {
    tileUrl,
    tileAttribution,
    maxZoom,
    photonUrl,
    geocoderEnabled,
  }
}

function getBuildTimeDefaults(): MapRuntimeConfig {
  const env = import.meta.env as Record<string, string | undefined>
  const base: MapRuntimeConfig = {
    tileUrl: DEFAULT_TILE_URL,
    tileAttribution: DEFAULT_TILE_ATTRIBUTION,
    maxZoom: DEFAULT_TILE_MAX_ZOOM,
    photonUrl: DEFAULT_PHOTON_URL,
    geocoderEnabled: true,
  }

  return validateMapRuntimeConfig(
    {
      tileUrl: env.VITE_MAP_TILE_URL || env.VITE_OSM_TILE_URL,
      tileAttribution: env.VITE_MAP_TILE_ATTRIBUTION,
      maxZoom: env.VITE_MAP_TILE_MAX_ZOOM
        ? Number(env.VITE_MAP_TILE_MAX_ZOOM)
        : undefined,
      photonUrl: env.VITE_MAP_PHOTON_URL,
      geocoderEnabled: parseBooleanFlag(env.VITE_MAP_GEOCODER_ENABLED, true),
    },
    base,
  )
}

let runtimeOverride: PartialMapRuntimeConfig | null = null
let runtimeFetchPromise: Promise<MapRuntimeConfig> | null = null

export function getMapRuntimeConfig(): MapRuntimeConfig {
  const buildDefaults = getBuildTimeDefaults()
  const windowConfig =
    typeof window !== 'undefined' ? window.__SMART_PARKING_MAP_CONFIG__ : undefined

  const withWindow = validateMapRuntimeConfig(windowConfig, buildDefaults)
  return validateMapRuntimeConfig(runtimeOverride, withWindow)
}

/**
 * Optionally loads a same-origin /map-config.json override once per session so
 * operations can switch tile endpoints or disable the public geocoder without rebuilding.
 */
export async function loadMapRuntimeConfig(): Promise<MapRuntimeConfig> {
  if (runtimeFetchPromise) return runtimeFetchPromise

  runtimeFetchPromise = (async () => {
    if (typeof window === 'undefined' || typeof fetch !== 'function') {
      return getMapRuntimeConfig()
    }
    try {
      const response = await fetch('/map-config.json', {
        cache: 'no-store',
        credentials: 'same-origin',
      })
      if (response.ok) {
        const contentType = response.headers.get('content-type') ?? ''
        if (contentType.includes('application/json')) {
          const parsed = (await response.json()) as PartialMapRuntimeConfig
          runtimeOverride = parsed
        }
      }
    } catch {
      // Safe fallback to build-time/default configuration
    }
    return getMapRuntimeConfig()
  })()

  return runtimeFetchPromise
}

export function setMapRuntimeConfigOverrideForTests(
  override: PartialMapRuntimeConfig | null,
) {
  runtimeOverride = override
}

export function resetMapRuntimeConfigForTests() {
  runtimeOverride = null
  runtimeFetchPromise = null
}
