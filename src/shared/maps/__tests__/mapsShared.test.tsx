import { describe, expect, it } from 'vitest'
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsSearchUrl,
  formatCoordinate,
  fromLatLng,
  isValidCoordinates,
  roundCoordinate,
  toLatLngLiteral,
  toLatLngTuple,
} from '../index'

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

  it('converts between Coordinates, tuples, and LatLng shapes safely', () => {
    expect(toLatLngTuple({ latitude: 10.77, longitude: 106.7 })).toEqual([10.77, 106.7])
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

describe('shared/maps Google Maps URL helpers (no API key required)', () => {
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

  it('builds official Google Maps Directions URLs with driving travelmode and optional origin', () => {
    const withCoords = buildGoogleMapsDirectionsUrl({
      destination: { latitude: 10.7712, longitude: 106.7865 },
      destinationAddress: 'Cảng Cát Lái',
    })
    expect(withCoords).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=10.7712%2C106.7865&travelmode=driving',
    )

    const withOrigin = buildGoogleMapsDirectionsUrl({
      destination: { latitude: 10.7712, longitude: 106.7865 },
      origin: { latitude: 10.77, longitude: 106.66 },
    })
    expect(withOrigin).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=10.7712%2C106.7865&travelmode=driving&origin=10.77%2C106.66',
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
