import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_MAP_STYLE_URL,
  DEFAULT_PHOTON_URL,
  extractAndValidateGoogleShareEmbedUrl,
  getMapRuntimeConfig,
  loadMapRuntimeConfig,
  resetMapRuntimeConfigForTests,
  validateMapRuntimeConfig,
} from '../index'

const VALID_SHARE_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d106.7865!3d10.7712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1svi!2svn!4v1700000000000'

describe('shared/maps runtimeConfig', () => {
  beforeEach(() => {
    resetMapRuntimeConfigForTests()
    delete window.__SMART_PARKING_MAP_CONFIG__
  })

  afterEach(() => {
    resetMapRuntimeConfigForTests()
    delete window.__SMART_PARKING_MAP_CONFIG__
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('returns safe OpenFreeMap vector style and Photon defaults without requiring any API key', () => {
    const config = getMapRuntimeConfig()
    expect(config.styleUrl).toBe(DEFAULT_MAP_STYLE_URL)
    expect(config.photonUrl).toBe(DEFAULT_PHOTON_URL)
    expect(config.geocoderEnabled).toBe(true)
    expect(config.maxZoom).toBe(19)
  })

  it('validates custom runtime endpoints and rejects unsafe schemes', () => {
    const base = getMapRuntimeConfig()
    const sanitized = validateMapRuntimeConfig(
      {
        styleUrl: 'javascript:alert(1)',
        photonUrl: 'http://evil.example.com/api/',
        maxZoom: 99,
        geocoderEnabled: false,
      },
      base,
    )

    expect(sanitized.styleUrl).toBe(DEFAULT_MAP_STYLE_URL)
    expect(sanitized.photonUrl).toBe(DEFAULT_PHOTON_URL)
    expect(sanitized.maxZoom).toBe(22)
    expect(sanitized.geocoderEnabled).toBe(false)
  })

  it('loads same-origin /map-config.json override when present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          styleUrl: 'https://tiles.openfreemap.org/styles/bright',
          geocoderEnabled: false,
        }),
      }),
    )

    const loaded = await loadMapRuntimeConfig()
    expect(loaded.styleUrl).toBe('https://tiles.openfreemap.org/styles/bright')
    expect(loaded.geocoderEnabled).toBe(false)
  })
})

describe('shared/maps Google Share embed validator', () => {
  it('accepts valid Google Maps Share embed URLs and extracts src from iframe HTML', () => {
    expect(extractAndValidateGoogleShareEmbedUrl(VALID_SHARE_URL)).toEqual({
      valid: true,
      url: VALID_SHARE_URL,
    })

    const iframeSnippet = `<iframe src="${VALID_SHARE_URL}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
    expect(extractAndValidateGoogleShareEmbedUrl(iframeSnippet)).toEqual({
      valid: true,
      url: VALID_SHARE_URL,
    })
  })

  it.each([
    ['Embed API v1 (requires billing/key)', 'https://www.google.com/maps/embed/v1/place?key=AIzaSyTest&q=Cat+Lai'],
    ['legacy output=embed', 'https://www.google.com/maps?q=10.77,106.78&output=embed'],
    ['short link', 'https://maps.app.goo.gl/abcdef123456'],
    ['spoofed host', 'https://www.google.com.evil.example/maps/embed?pb=!1m18!1m12!1m3!1d3919'],
    ['http scheme', 'http://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919'],
    ['javascript scheme', 'javascript:alert(1)'],
    ['credentials in URL', 'https://user:pass@www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919'],
    ['missing pb param', 'https://www.google.com/maps/embed'],
  ])('rejects invalid embed input: %s', (_label, badInput) => {
    const result = extractAndValidateGoogleShareEmbedUrl(badInput)
    expect(result.valid).toBe(false)
  })
})
