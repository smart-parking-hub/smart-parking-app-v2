import type { Coordinates } from './coordinates'

export const DEFAULT_MAP_CENTER: Coordinates = {
  latitude: 10.7769,
  longitude: 106.7009,
}

export const DEFAULT_MAP_ZOOM = 12

export const GOOGLE_MAPS_LANGUAGE = 'vi'
export const GOOGLE_MAPS_REGION = 'VN'
export const GOOGLE_MAPS_COUNTRY_CODES = ['vn'] as const
export const DEMO_GOOGLE_MAPS_MAP_ID = 'DEMO_MAP_ID'

export type GoogleMapsErrorCode =
  | 'MISSING_API_KEY'
  | 'SDK_LOAD_ERROR'
  | 'AUTH_FAILURE'
  | 'PLACES_ERROR'
  | 'ROUTES_ERROR'
  | 'INVALID_COORDINATES'

export class GoogleMapsError extends Error {
  readonly code: GoogleMapsErrorCode
  readonly cause?: unknown

  constructor(code: GoogleMapsErrorCode, message: string, cause?: unknown) {
    super(message)
    this.name = 'GoogleMapsError'
    this.code = code
    this.cause = cause
  }
}

export interface GoogleMapsRuntimeConfig {
  apiKey: string
  mapId: string
  hasCustomMapId: boolean
  language: string
  region: string
}

export function getGoogleMapsConfig(): GoogleMapsRuntimeConfig {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '').trim()
  const rawMapId = (import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? '').trim()

  return {
    apiKey,
    mapId: rawMapId || DEMO_GOOGLE_MAPS_MAP_ID,
    hasCustomMapId: Boolean(rawMapId),
    language: GOOGLE_MAPS_LANGUAGE,
    region: GOOGLE_MAPS_REGION,
  }
}

export function isGoogleMapsConfigured(): boolean {
  return getGoogleMapsConfig().apiKey.length > 0
}
