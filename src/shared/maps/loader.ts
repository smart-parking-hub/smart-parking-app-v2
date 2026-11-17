import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { getGoogleMapsConfig, GoogleMapsError } from './config'

export type GoogleMapsLibraryName = keyof google.maps.ImportLibraryMap

let configuredApiKey: string | null = null
const libraryPromises = new Map<
  GoogleMapsLibraryName,
  Promise<google.maps.ImportLibraryMap[GoogleMapsLibraryName]>
>()
let authFailed = false
let authListenerInstalled = false
const authFailureListeners = new Set<() => void>()

function installAuthFailureHook() {
  if (authListenerInstalled || typeof window === 'undefined') return
  authListenerInstalled = true

  const win = window as Window & { gm_authFailure?: () => void }
  const previousHandler = win.gm_authFailure
  win.gm_authFailure = () => {
    authFailed = true
    for (const listener of authFailureListeners) {
      listener()
    }
    previousHandler?.()
  }
}

export function subscribeGoogleMapsAuthFailure(listener: () => void): () => void {
  installAuthFailureHook()
  authFailureListeners.add(listener)
  if (authFailed) {
    listener()
  }
  return () => {
    authFailureListeners.delete(listener)
  }
}

export function hasGoogleMapsAuthFailed(): boolean {
  return authFailed
}

function ensureLoaderConfigured() {
  const config = getGoogleMapsConfig()
  if (!config.apiKey) {
    throw new GoogleMapsError(
      'MISSING_API_KEY',
      'Thiếu cấu hình VITE_GOOGLE_MAPS_API_KEY cho Google Maps.',
    )
  }

  installAuthFailureHook()

  if (configuredApiKey !== config.apiKey) {
    setOptions({
      key: config.apiKey,
      v: 'weekly',
      language: config.language,
      region: config.region,
      mapIds: config.hasCustomMapId ? [config.mapId] : undefined,
    })
    configuredApiKey = config.apiKey
  }
}

/**
 * Loads a specific Google Maps JS API library on demand using a singleton cache.
 * Failed promises are evicted so users can retry after transient network failures.
 */
export async function loadGoogleMapsLibrary<
  TLibraryName extends GoogleMapsLibraryName,
>(libraryName: TLibraryName): Promise<google.maps.ImportLibraryMap[TLibraryName]> {
  if (authFailed) {
    throw new GoogleMapsError(
      'AUTH_FAILURE',
      'Khóa Google Maps API không hợp lệ hoặc bị từ chối quyền truy cập.',
    )
  }

  ensureLoaderConfigured()

  const cached = libraryPromises.get(libraryName)
  if (cached) {
    return cached as Promise<google.maps.ImportLibraryMap[TLibraryName]>
  }

  const loadPromise = Promise.resolve()
    .then(() => importLibrary(libraryName))
    .catch((error: unknown) => {
      libraryPromises.delete(libraryName)
      if (error instanceof GoogleMapsError) {
        throw error
      }
      throw new GoogleMapsError(
        'SDK_LOAD_ERROR',
        'Không thể tải thư viện Google Maps. Vui lòng kiểm tra kết nối mạng hoặc khóa API.',
        error,
      )
    })

  libraryPromises.set(
    libraryName,
    loadPromise as Promise<google.maps.ImportLibraryMap[GoogleMapsLibraryName]>,
  )

  return loadPromise
}

export async function loadGoogleMapsCore(): Promise<{
  maps: google.maps.MapsLibrary
  marker: google.maps.MarkerLibrary
}> {
  const [maps, marker] = await Promise.all([
    loadGoogleMapsLibrary('maps'),
    loadGoogleMapsLibrary('marker'),
  ])
  return { maps, marker }
}

export function resetGoogleMapsLoaderForTests() {
  configuredApiKey = null
  libraryPromises.clear()
  authFailed = false
  authFailureListeners.clear()
  authListenerInstalled = false
}
