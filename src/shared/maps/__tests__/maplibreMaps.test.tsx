import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import {
  createAccuracyCircleGeoJson,
  DEFAULT_MAP_STYLE_URL,
  getMapRuntimeConfig,
  MapLibreMapView,
  resetMapRuntimeConfigForTests,
  toLngLatTuple,
} from '../index'

const mapHandlers: Record<string, (() => void)[]> = {}
const mockMapInstance = {
  addControl: vi.fn(),
  on: vi.fn((event: string, cb: () => void) => {
    mapHandlers[event] = [...(mapHandlers[event] ?? []), cb]
  }),
  setStyle: vi.fn(),
  resize: vi.fn(),
  remove: vi.fn(),
}

const mockMarkerInstance = {
  setLngLat: vi.fn().mockReturnThis(),
  addTo: vi.fn().mockReturnThis(),
  remove: vi.fn(),
}

vi.mock('maplibre-gl', () => ({
  Map: vi.fn(() => mockMapInstance),
  Marker: vi.fn(() => mockMarkerInstance),
  NavigationControl: vi.fn(() => ({})),
}))

const VALID_SHARE_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d106.7865!3d10.7712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1svi!2svn!4v1700000000000'

describe('shared/maps MapLibre + OpenFreeMap foundation', () => {
  beforeEach(() => {
    resetMapRuntimeConfigForTests()
    for (const key of Object.keys(mapHandlers)) delete mapHandlers[key]
    vi.clearAllMocks()
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
    vi.unstubAllGlobals()
    resetMapRuntimeConfigForTests()
  })

  it('defaults to OpenFreeMap Liberty vector style without requiring any API key', () => {
    const config = getMapRuntimeConfig()
    expect(config.styleUrl).toBe(DEFAULT_MAP_STYLE_URL)
    expect(config.styleUrl).toBe('https://tiles.openfreemap.org/styles/liberty')
  })

  it('converts Coordinates to [lng, lat] order and builds valid GeoJSON accuracy circle', () => {
    expect(toLngLatTuple({ latitude: 10.7712, longitude: 106.7865 })).toEqual([
      106.7865,
      10.7712,
    ])

    const circle = createAccuracyCircleGeoJson(
      { latitude: 10.7712, longitude: 106.7865 },
      50,
      24,
    )
    expect(circle.geometry.type).toBe('Polygon')
    expect(circle.geometry.coordinates[0]).toHaveLength(25)
    expect(circle.geometry.coordinates[0][0]).toEqual(
      circle.geometry.coordinates[0][24],
    )
  })

  it('mounts MapLibreMapView with OpenFreeMap style and transitions ready/error cleanly', () => {
    const { rerender, unmount } = render(
      <MapLibreMapView
        coordinates={{ latitude: 10.7712, longitude: 106.7865 }}
        markerTitle="Bãi Cát Lái"
      />,
    )

    const region = screen.getByRole('region', { name: 'Bản đồ vị trí bãi đỗ' })
    expect(region).toHaveAttribute('data-map-state', 'loading')
    expect(mockMarkerInstance.setLngLat).toHaveBeenCalledWith([106.7865, 10.7712])

    act(() => {
      mapHandlers.load?.forEach((cb) => cb())
    })
    expect(region).toHaveAttribute('data-map-state', 'ready')

    rerender(
      <MapLibreMapView
        coordinates={{ latitude: 10.8924, longitude: 106.7725 }}
        markerTitle="Bãi Sóng Thần"
      />,
    )
    act(() => {
      mapHandlers.error?.forEach((cb) => cb())
    })
    expect(region).toHaveAttribute('data-map-state', 'error')
    expect(screen.getByRole('alert')).toHaveTextContent(/OpenFreeMap/i)

    unmount()
    expect(mockMarkerInstance.remove).toHaveBeenCalled()
    expect(mockMapInstance.remove).toHaveBeenCalled()
  })

  it('renders optional validated Google Share embed with toggle back to vector map', () => {
    render(
      <MapLibreMapView
        coordinates={{ latitude: 10.7712, longitude: 106.7865 }}
        markerTitle="Bãi Cát Lái"
        googleMapsEmbedUrl={VALID_SHARE_URL}
      />,
    )

    expect(screen.getByTitle(/Bản đồ Google Maps nhúng/i)).toHaveAttribute(
      'src',
      VALID_SHARE_URL,
    )
    fireEvent.click(screen.getByRole('button', { name: /Xem bản đồ Vector/i }))
    expect(
      screen.getByRole('button', { name: /Xem bản đồ Google nhúng/i }),
    ).toBeInTheDocument()
  })
})
