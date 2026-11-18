import * as maplibregl from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'

let workerConfigured = false

/**
 * Configures MapLibre GL JS v6's external worker script URL explicitly via Vite's
 * `?url` asset import so vector tile decoding works reliably in both Vite dev
 * server and production bundles (`dist/assets/`).
 */
export function ensureMapLibreWorkerConfigured(): void {
  if (workerConfigured) return
  workerConfigured = true

  try {
    if (
      Object.prototype.hasOwnProperty.call(maplibregl, 'setWorkerUrl') &&
      typeof maplibregl.setWorkerUrl === 'function' &&
      typeof maplibreWorkerUrl === 'string' &&
      maplibreWorkerUrl.length > 0
    ) {
      maplibregl.setWorkerUrl(maplibreWorkerUrl)
    }
  } catch {
    // Safe no-op in partial test mocks that omit setWorkerUrl
  }
}
