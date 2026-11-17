import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import * as jsApiLoader from '@googlemaps/js-api-loader'
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsSearchUrl,
  formatCoordinate,
  fromLatLng,
  GoogleMapsError,
  GoogleMapView,
  isValidCoordinates,
  loadGoogleMapsLibrary,
  resetGoogleMapsLoaderForTests,
  roundCoordinate,
  toLatLngLiteral,
} from '../index'

vi.mock('@googlemaps/js-api-loader', () => ({
  setOptions: vi.fn(),
  importLibrary: vi.fn(),
}))

describe('shared/maps coordinates helpers', () => {
  it('validates coordinate ranges and rejects invalid or null-island values', () => {
    expect(isValidCoordinates({ latitude: 10.7769, longitude: 106.7009 })).toBe(true)
    expect(isValidCoordinates({ latitude: 0, longitude: 0 })).toBe(false)
    expect(isValidCoordinates({ latitude: 91, longitude: 106 })).toBe(false)
    expect(isValidCoordinates({ latitude: 10, longitude: -181 })).toBe(false)
    expect(isValidCoordinates({ latitude: Number.NaN, longitude: 106 })).toBe(false)
    expect(isValidCoordinates(null)).toBe(false)
    expect(isValidCoordinates(undefined)).toBe(false)
  })

  it('converts between Coordinates and Google LatLng shapes safely', () => {
    expect(toLatLngLiteral({ latitude: 10.77, longitude: 106.7 })).toEqual({
      lat: 10.77,
      lng: 106.7,
    })
    expect(fromLatLng({ lat: 10.77, lng: 106.7 })).toEqual({
      latitude: 10.77,
      longitude: 106.7,
    })
    expect(fromLatLng({ lat: () => 21.0285, lng: () => 105.8542 })).toEqual({
      latitude: 21.0285,
      longitude: 105.8542,
    })
    expect(roundCoordinate(10.7769123456)).toBe(10.7769123)
    expect(formatCoordinate(10.77)).toBe('10.7700000')
  })
})

describe('shared/maps URL helpers', () => {
  it('builds official Google Maps Search URLs preferring valid coordinates', () => {
    expect(
      buildGoogleMapsSearchUrl({
        coordinates: { latitude: 10.7712, longitude: 106.7865 },
        query: 'Cảng Cát Lái',
      }),
    ).toBe('https://www.google.com/maps/search/?api=1&query=10.7712%2C106.7865')

    expect(
      buildGoogleMapsSearchUrl({
        coordinates: { latitude: 0, longitude: 0 },
        query: 'Cảng Cát Lái, TP. Thủ Đức',
      }),
    ).toBe(
      'https://www.google.com/maps/search/?api=1&query=C%E1%BA%A3ng%20C%C3%A1t%20L%C3%A1i%2C%20TP.%20Th%E1%BB%A7%20%C4%90%E1%BB%A9c',
    )

    expect(buildGoogleMapsSearchUrl({})).toBeNull()
  })

  it('builds official Google Maps Directions URLs with driving travelmode', () => {
    const withCoords = buildGoogleMapsDirectionsUrl({
      destination: { latitude: 10.7712, longitude: 106.7865 },
      destinationAddress: 'Cảng Cát Lái',
    })
    expect(withCoords).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=10.7712%2C106.7865&travelmode=driving',
    )

    const withAddressFallback = buildGoogleMapsDirectionsUrl({
      destinationAddress: '789 Nguyễn Thị Định, TP. Thủ Đức',
    })
    expect(withAddressFallback).toContain('https://www.google.com/maps/dir/?')
    expect(withAddressFallback).toContain('api=1')
    expect(withAddressFallback).toContain('travelmode=driving')
    expect(withAddressFallback).toContain('destination=789')
  })
})

describe('shared/maps loader & GoogleMapView', () => {
  beforeEach(() => {
    resetGoogleMapsLoaderForTests()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('throws MISSING_API_KEY when VITE_GOOGLE_MAPS_API_KEY is not set', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '')

    await expect(loadGoogleMapsLibrary('maps')).rejects.toMatchObject({
      name: 'GoogleMapsError',
      code: 'MISSING_API_KEY',
    } satisfies Partial<GoogleMapsError>)
  })

  it('configures loader once and caches loaded libraries', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'test-api-key')
    vi.stubEnv('VITE_GOOGLE_MAPS_MAP_ID', 'map-id-123')
    const mapsLib = { Map: vi.fn() }
    vi.mocked(jsApiLoader.importLibrary).mockResolvedValue(mapsLib as never)

    const first = await loadGoogleMapsLibrary('maps')
    const second = await loadGoogleMapsLibrary('maps')

    expect(first).toBe(mapsLib)
    expect(second).toBe(mapsLib)
    expect(jsApiLoader.setOptions).toHaveBeenCalledTimes(1)
    expect(jsApiLoader.setOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'test-api-key',
        language: 'vi',
        region: 'VN',
        mapIds: ['map-id-123'],
      }),
    )
    expect(jsApiLoader.importLibrary).toHaveBeenCalledTimes(1)
  })

  it('evicts rejected library promise so subsequent retries can succeed', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'test-api-key')
    const mapsLib = { Map: vi.fn() }
    vi.mocked(jsApiLoader.importLibrary)
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce(mapsLib as never)

    await expect(loadGoogleMapsLibrary('maps')).rejects.toMatchObject({
      code: 'SDK_LOAD_ERROR',
    })
    await expect(loadGoogleMapsLibrary('maps')).resolves.toBe(mapsLib)
  })

  it('renders missing-coordinates state when coordinates are absent or invalid', () => {
    render(<GoogleMapView coordinates={null} markerTitle="Bãi chưa có tọa độ" />)
    expect(screen.getByText(/Chưa có tọa độ vị trí hợp lệ/i)).toBeInTheDocument()
  })

  it('renders error fallback with external Google Maps link when API key is missing', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '')
    render(
      <GoogleMapView
        coordinates={{ latitude: 10.7712, longitude: 106.7865 }}
        markerTitle="Bãi Cát Lái"
      />,
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /VITE_GOOGLE_MAPS_API_KEY/i,
    )
    const link = screen.getByRole('link', { name: /Mở trên Google Maps/i })
    expect(link).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=10.7712%2C106.7865',
    )
  })

  it('mounts Google Map and AdvancedMarkerElement cleanly and cleans up on unmount', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'test-api-key')
    const mapInstance = { setCenter: vi.fn() }
    const MapCtor = vi.fn(() => mapInstance)
    const markerInstance: { map: unknown } = { map: mapInstance }
    const AdvancedMarkerCtor = vi.fn(() => markerInstance)

    vi.mocked(jsApiLoader.importLibrary).mockImplementation((async (name: string) => {
      if (name === 'maps') return { Map: MapCtor }
      if (name === 'marker') return { AdvancedMarkerElement: AdvancedMarkerCtor }
      return {}
    }) as never)

    const { unmount } = render(
      <GoogleMapView
        coordinates={{ latitude: 10.7712, longitude: 106.7865 }}
        markerTitle="Bãi Cát Lái"
      />,
    )

    await waitFor(() => {
      expect(MapCtor).toHaveBeenCalledTimes(1)
      expect(AdvancedMarkerCtor).toHaveBeenCalledTimes(1)
    })

    unmount()
    expect(markerInstance.map).toBeNull()
  })
})
