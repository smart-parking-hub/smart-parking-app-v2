import type { StyleSpecification } from 'maplibre-gl'
import type { MapRuntimeConfig } from './runtimeConfig'

export type MapBasemapId = 'google-roadmap' | 'openfreemap'

export const DEFAULT_MAP_BASEMAP: MapBasemapId = 'google-roadmap'

export const GOOGLE_ROADMAP_TILES = [
  'https://mt0.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}',
  'https://mt1.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}',
  'https://mt2.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}',
  'https://mt3.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}',
] as const

export function isValidBasemapId(value: unknown): value is MapBasemapId {
  return value === 'google-roadmap' || value === 'openfreemap'
}

export function getBasemapDisplayName(basemap: MapBasemapId): string {
  return basemap === 'google-roadmap' ? 'Google Maps' : 'OpenFreeMap'
}

/**
 * Builds a MapLibre raster StyleSpecification backed by Google Maps Vietnamese street tiles.
 * Intended for academic capstone / non-commercial usage; falls back cleanly to OpenFreeMap.
 */
export function createGoogleRoadmapStyle(maxZoom = 20): StyleSpecification {
  const safeMaxZoom = Number.isFinite(maxZoom)
    ? Math.min(20, Math.max(10, Math.round(maxZoom)))
    : 20

  return {
    version: 8,
    name: 'Google Maps Đường phố',
    sources: {
      'google-roadmap': {
        type: 'raster',
        tiles: [...GOOGLE_ROADMAP_TILES],
        tileSize: 256,
        maxzoom: safeMaxZoom,
        attribution: '© Google Maps',
      },
    },
    layers: [
      {
        id: 'google-roadmap-layer',
        type: 'raster',
        source: 'google-roadmap',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  }
}

export function resolveMapStyle(
  config: Pick<MapRuntimeConfig, 'defaultBasemap' | 'styleUrl' | 'maxZoom'>,
  basemap?: MapBasemapId,
): string | StyleSpecification {
  const effectiveBasemap = basemap ?? config.defaultBasemap
  if (effectiveBasemap === 'openfreemap') {
    return config.styleUrl
  }
  return createGoogleRoadmapStyle(config.maxZoom)
}
