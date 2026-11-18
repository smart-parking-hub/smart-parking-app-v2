import { afterEach, describe, expect, it } from 'vitest'
import {
  createGoogleRoadmapStyle,
  DEFAULT_MAP_BASEMAP,
  DEFAULT_MAP_STYLE_URL,
  DEFAULT_OSRM_URL,
  getBasemapDisplayName,
  getMapRuntimeConfig,
  GOOGLE_ROADMAP_TILES,
  resetMapRuntimeConfigForTests,
  resolveMapStyle,
  setMapRuntimeConfigOverrideForTests,
  validateMapRuntimeConfig,
} from '../index'

describe('shared/maps basemaps & extended runtime config', () => {
  afterEach(() => {
    resetMapRuntimeConfigForTests()
  })

  it('defaults to Google Maps Street basemap and OSRM routing without API keys', () => {
    const config = getMapRuntimeConfig()
    expect(config.defaultBasemap).toBe(DEFAULT_MAP_BASEMAP)
    expect(config.defaultBasemap).toBe('google-roadmap')
    expect(config.osrmUrl).toBe(DEFAULT_OSRM_URL)
    expect(config.routingEnabled).toBe(true)
    expect(config.styleUrl).toBe(DEFAULT_MAP_STYLE_URL)
  })

  it('builds a valid MapLibre raster StyleSpecification for Google Maps Vietnamese street tiles', () => {
    const style = createGoogleRoadmapStyle(19)
    expect(style.version).toBe(8)
    expect(style.layers).toEqual([
      expect.objectContaining({
        id: 'google-roadmap-layer',
        type: 'raster',
        source: 'google-roadmap',
      }),
    ])
    const source = style.sources['google-roadmap']
    expect(source).toMatchObject({
      type: 'raster',
      tileSize: 256,
      maxzoom: 19,
      attribution: '© Google Maps',
      tiles: [...GOOGLE_ROADMAP_TILES],
    })
  })

  it('resolves Google Maps raster style by default and OpenFreeMap style URL when requested', () => {
    const config = getMapRuntimeConfig()
    const defaultStyle = resolveMapStyle(config)
    expect(typeof defaultStyle).toBe('object')

    const fallbackStyle = resolveMapStyle(config, 'openfreemap')
    expect(fallbackStyle).toBe(DEFAULT_MAP_STYLE_URL)

    expect(getBasemapDisplayName('google-roadmap')).toBe('Google Maps')
    expect(getBasemapDisplayName('openfreemap')).toBe('OpenFreeMap')
  })

  it('validates runtime overrides and rejects unsafe OSRM URLs or unknown basemaps', () => {
    const base = getMapRuntimeConfig()
    const safe = validateMapRuntimeConfig(
      {
        defaultBasemap: 'openfreemap',
        osrmUrl: 'https://osrm.smartparking.local/',
        routingEnabled: false,
      },
      base,
    )
    expect(safe.defaultBasemap).toBe('openfreemap')
    expect(safe.osrmUrl).toBe('https://osrm.smartparking.local')
    expect(safe.routingEnabled).toBe(false)

    const sanitized = validateMapRuntimeConfig(
      {
        // @ts-expect-error testing invalid runtime JSON value
        defaultBasemap: 'unknown-provider',
        osrmUrl: 'http://evil.example.com/osrm',
      },
      base,
    )
    expect(sanitized.defaultBasemap).toBe('google-roadmap')
    expect(sanitized.osrmUrl).toBe(DEFAULT_OSRM_URL)

    setMapRuntimeConfigOverrideForTests({ defaultBasemap: 'openfreemap' })
    expect(getMapRuntimeConfig().defaultBasemap).toBe('openfreemap')
  })
})
