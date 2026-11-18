import type { Coordinates } from './coordinates'
import {
  DEFAULT_MAP_BASEMAP,
  isValidBasemapId,
  type MapBasemapId,
} from './basemaps'

export const DEFAULT_MAP_CENTER: Coordinates = {
  latitude: 10.7769,
  longitude: 106.7009,
}

export const DEFAULT_MAP_ZOOM = 12
export const DEFAULT_MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'
export const DEFAULT_MAP_MAX_ZOOM = 19
export const DEFAULT_PHOTON_URL = 'https://photon.komoot.io/api/'
export const DEFAULT_OSRM_URL = 'https://router.project-osrm.org'

export interface MapRuntimeConfig {
  defaultBasemap: MapBasemapId
  styleUrl: string
  maxZoom: number
  photonUrl: string
  geocoderEnabled: boolean
  osrmUrl: string
  routingEnabled: boolean
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

function sanitizeMaxZoom(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return DEFAULT_MAP_MAX_ZOOM
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

  const defaultBasemap = isValidBasemapId(raw.defaultBasemap)
    ? raw.defaultBasemap
    : base.defaultBasemap

  const styleUrl =
    typeof raw.styleUrl === 'string' && isAllowedEndpointUrl(raw.styleUrl.trim())
      ? raw.styleUrl.trim()
      : base.styleUrl

  const photonUrl =
    typeof raw.photonUrl === 'string' && isAllowedEndpointUrl(raw.photonUrl.trim())
      ? raw.photonUrl.trim()
      : base.photonUrl

  const osrmUrl =
    typeof raw.osrmUrl === 'string' && isAllowedEndpointUrl(raw.osrmUrl.trim())
      ? raw.osrmUrl.trim().replace(/\/+$/, '')
      : base.osrmUrl

  const maxZoom =
    raw.maxZoom !== undefined ? sanitizeMaxZoom(raw.maxZoom) : base.maxZoom

  const geocoderEnabled = parseBooleanFlag(
    raw.geocoderEnabled,
    base.geocoderEnabled,
  )

  const routingEnabled = parseBooleanFlag(
    raw.routingEnabled,
    base.routingEnabled,
  )

  return {
    defaultBasemap,
    styleUrl,
    maxZoom,
    photonUrl,
    geocoderEnabled,
    osrmUrl,
    routingEnabled,
  }
}

function getBuildTimeDefaults(): MapRuntimeConfig {
  const env = import.meta.env as Record<string, string | undefined>
  const base: MapRuntimeConfig = {
    defaultBasemap: DEFAULT_MAP_BASEMAP,
    styleUrl: DEFAULT_MAP_STYLE_URL,
    maxZoom: DEFAULT_MAP_MAX_ZOOM,
    photonUrl: DEFAULT_PHOTON_URL,
    geocoderEnabled: true,
    osrmUrl: DEFAULT_OSRM_URL,
    routingEnabled: true,
  }

  return validateMapRuntimeConfig(
    {
      defaultBasemap: isValidBasemapId(env.VITE_MAP_DEFAULT_BASEMAP?.trim())
        ? (env.VITE_MAP_DEFAULT_BASEMAP.trim() as MapBasemapId)
        : undefined,
      styleUrl: env.VITE_MAP_STYLE_URL,
      maxZoom: env.VITE_MAP_MAX_ZOOM
        ? Number(env.VITE_MAP_MAX_ZOOM)
        : undefined,
      photonUrl: env.VITE_MAP_PHOTON_URL,
      geocoderEnabled: parseBooleanFlag(env.VITE_MAP_GEOCODER_ENABLED, true),
      osrmUrl: env.VITE_MAP_OSRM_URL,
      routingEnabled: parseBooleanFlag(env.VITE_MAP_ROUTING_ENABLED, true),
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
 * operations can switch vector styles or disable the public geocoder without rebuilding.
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
