import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearDrivingRouteCacheForTests,
  fetchDrivingRoute,
  formatRouteDistance,
  formatRouteDuration,
  resetMapRuntimeConfigForTests,
  RoutingError,
  setMapRuntimeConfigOverrideForTests,
} from '../index'

const ORIGIN = { latitude: 10.77, longitude: 106.66 }
const DEST = { latitude: 10.762622, longitude: 106.7865 }

describe('shared/maps OSRM driving route client', () => {
  beforeEach(() => {
    clearDrivingRouteCacheForTests()
    resetMapRuntimeConfigForTests()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    clearDrivingRouteCacheForTests()
    resetMapRuntimeConfigForTests()
  })

  it('requests OSRM with [lng, lat] order, parses GeoJSON LineString, and caches subsequent calls', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        code: 'Ok',
        routes: [
          {
            distance: 15420.5,
            duration: 1680,
            geometry: {
              type: 'LineString',
              coordinates: [
                [106.66, 10.77],
                [106.72, 10.766],
                [106.7865, 10.762622],
              ],
            },
          },
        ],
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const first = await fetchDrivingRoute(ORIGIN, DEST)
    expect(first).toEqual({
      provider: 'osrm',
      distanceMeters: 15420.5,
      durationSeconds: 1680,
      geometry: {
        type: 'LineString',
        coordinates: [
          [106.66, 10.77],
          [106.72, 10.766],
          [106.7865, 10.762622],
        ],
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://router.project-osrm.org/route/v1/driving/106.66,10.77;106.7865,10.762622?overview=full&geometries=geojson&steps=false',
    )

    // Second identical call returns cached result without invoking fetch again
    const second = await fetchDrivingRoute(ORIGIN, DEST)
    expect(second).toEqual(first)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws DISABLED RoutingError without network calls when routingEnabled is false', async () => {
    setMapRuntimeConfigOverrideForTests({ routingEnabled: false })
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchDrivingRoute(ORIGIN, DEST)).rejects.toMatchObject({
      name: 'RoutingError',
      code: 'DISABLED',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('classifies HTTP 429 and NoRoute responses cleanly', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
      }),
    )

    await expect(fetchDrivingRoute(ORIGIN, DEST)).rejects.toBeInstanceOf(
      RoutingError,
    )
    await expect(fetchDrivingRoute(ORIGIN, DEST)).rejects.toMatchObject({
      code: 'RATE_LIMITED',
    })

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ code: 'NoRoute', routes: [] }),
      }),
    )

    await expect(fetchDrivingRoute(ORIGIN, DEST)).rejects.toMatchObject({
      code: 'NO_ROUTE',
    })
  })

  it('formats Vietnamese distance and duration strings accurately', () => {
    expect(formatRouteDistance(650)).toBe('650 m')
    expect(formatRouteDistance(6420)).toBe('6,4 km')
    expect(formatRouteDistance(15420)).toBe('15,4 km')

    expect(formatRouteDuration(25)).toBe('1 phút')
    expect(formatRouteDuration(960)).toBe('16 phút')
    expect(formatRouteDuration(4500)).toBe('1 giờ 15 phút')
    expect(formatRouteDuration(3600)).toBe('1 giờ')
  })
})
