import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import L from 'leaflet'
import {
  DEFAULT_PHOTON_URL,
  DEFAULT_TILE_URL,
  extractAndValidateGoogleShareEmbedUrl,
  getMapRuntimeConfig,
  LeafletMapView,
  loadMapRuntimeConfig,
  resetMapRuntimeConfigForTests,
  setMapRuntimeConfigOverrideForTests,
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

  it('returns safe OpenStreetMap and Photon defaults without requiring Google keys', () => {
    const config = getMapRuntimeConfig()
    expect(config.tileUrl).toBe(DEFAULT_TILE_URL)
    expect(config.photonUrl).toBe(DEFAULT_PHOTON_URL)
    expect(config.geocoderEnabled).toBe(true)
    expect(config.maxZoom).toBe(19)
  })

  it('validates custom runtime endpoints and rejects unsafe schemes or script attribution', () => {
    const base = getMapRuntimeConfig()
    const sanitized = validateMapRuntimeConfig(
      {
        tileUrl: 'javascript:alert(1)',
        photonUrl: 'http://evil.example.com/api/',
        tileAttribution: '<script>alert(1)</script>',
        maxZoom: 99,
        geocoderEnabled: false,
      },
      base,
    )

    expect(sanitized.tileUrl).toBe(DEFAULT_TILE_URL)
    expect(sanitized.photonUrl).toBe(DEFAULT_PHOTON_URL)
    expect(sanitized.tileAttribution).toBe(base.tileAttribution)
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
          tileUrl: 'https://tiles.smartparking.vn/{z}/{x}/{y}.png',
          geocoderEnabled: false,
        }),
      }),
    )

    const loaded = await loadMapRuntimeConfig()
    expect(loaded.tileUrl).toBe('https://tiles.smartparking.vn/{z}/{x}/{y}.png')
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

describe('shared/maps LeafletMapView', () => {
  beforeEach(() => {
    resetMapRuntimeConfigForTests()
    setMapRuntimeConfigOverrideForTests({
      tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    })
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        headers: new Headers(),
      }),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    resetMapRuntimeConfigForTests()
  })

  it('renders missing-coordinates state when coordinates and embed are absent', () => {
    render(<LeafletMapView coordinates={null} markerTitle="Bãi chưa có tọa độ" />)
    expect(screen.getByText(/Chưa có tọa độ vị trí hợp lệ/i)).toBeInTheDocument()
  })

  it('mounts Leaflet map without Google key and transitions to ready on tileload or error on tileerror', () => {
    const handlers: Record<string, () => void> = {}
    const fakeTileLayer = {
      addTo: vi.fn().mockReturnThis(),
      on: vi.fn((event: string, cb: () => void) => {
        handlers[event] = cb
        return fakeTileLayer
      }),
      redraw: vi.fn(),
      remove: vi.fn(),
    }
    vi.spyOn(L, 'tileLayer').mockReturnValue(fakeTileLayer as unknown as L.TileLayer)

    const { rerender } = render(
      <LeafletMapView
        coordinates={{ latitude: 10.7712, longitude: 106.7865 }}
        markerTitle="Bãi Cát Lái"
      />,
    )

    const region = screen.getByRole('region', { name: 'Bản đồ vị trí bãi đỗ' })
    expect(region).toHaveAttribute('data-map-state', 'loading')

    act(() => {
      handlers.tileload?.()
    })
    expect(region).toHaveAttribute('data-map-state', 'ready')

    // Remount with new coordinates to test tileerror degraded state
    rerender(
      <LeafletMapView
        coordinates={{ latitude: 10.8924, longitude: 106.7725 }}
        markerTitle="Bãi Sóng Thần"
      />,
    )

    act(() => {
      handlers.tileerror?.()
    })
    expect(region).toHaveAttribute('data-map-state', 'error')
    expect(screen.getByRole('alert')).toHaveTextContent(/OpenStreetMap/i)
    expect(screen.getByRole('link', { name: /Mở trên Google Maps/i })).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=10.8924%2C106.7725',
    )
  })

  it('renders validated Google Share embed with toggle back to Leaflet OSM view', () => {
    render(
      <LeafletMapView
        coordinates={{ latitude: 10.7712, longitude: 106.7865 }}
        markerTitle="Bãi Cát Lái"
        googleMapsEmbedUrl={VALID_SHARE_URL}
      />,
    )

    const iframe = screen.getByTitle(/Bản đồ Google Maps nhúng/i)
    expect(iframe).toHaveAttribute('src', VALID_SHARE_URL)
    expect(iframe).toHaveAttribute('loading', 'lazy')

    fireEvent.click(screen.getByRole('button', { name: /Xem bản đồ OSM/i }))
    expect(screen.queryByTitle(/Bản đồ Google Maps nhúng/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Xem bản đồ Google nhúng/i })).toBeInTheDocument()
  })
})
