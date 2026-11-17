import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  autocompleteLocations,
  clearGeocoderCacheForTests,
} from './mapProvider'
import { fetchParkingLots } from './parkingSearchApi'
import { apiClient } from '@/shared/api/client'
import {
  resetMapRuntimeConfigForTests,
  setMapRuntimeConfigOverrideForTests,
} from '@/shared/maps'

describe('Hybrid parking-search geocoder (Photon, no Google Billing, no Nominatim fallback)', () => {
  beforeEach(() => {
    clearGeocoderCacheForTests()
    resetMapRuntimeConfigForTests()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    clearGeocoderCacheForTests()
    resetMapRuntimeConfigForTests()
  })

  it('requires at least 3 characters before querying Photon', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    expect(await autocompleteLocations('ab')).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('filters Photon results to Vietnam, converts GeoJSON [lng, lat], deduplicates, and caps at 5', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        features: [
          {
            geometry: { coordinates: [106.7865, 10.7715] },
            properties: {
              osm_id: 10,
              osm_type: 'N',
              name: 'Cảng Cát Lái',
              district: 'Phường Cát Lái',
              city: 'TP. Thủ Đức',
              countrycode: 'VN',
            },
          },
          {
            geometry: { coordinates: [100.5, 13.7] },
            properties: {
              osm_id: 11,
              name: 'Outside VN',
              countrycode: 'TH',
            },
          },
          {
            geometry: { coordinates: [106.7865, 10.7715] },
            properties: {
              osm_id: 12,
              name: 'Cảng Cát Lái',
              district: 'Phường Cát Lái',
              city: 'TP. Thủ Đức',
              countrycode: 'VN',
            },
          },
        ],
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const results = await autocompleteLocations('Cát Lái')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(String(fetchMock.mock.calls[0][0])).toContain('photon.komoot.io')
    expect(results).toEqual([
      {
        id: 'N-10-10.7715',
        label: 'Cảng Cát Lái, Phường Cát Lái, TP. Thủ Đức',
        latitude: 10.7715,
        longitude: 106.7865,
      },
    ])

    // Short in-memory cache serves repeated query without hitting Photon again
    const cached = await autocompleteLocations('Cát Lái')
    expect(cached).toEqual(results)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('surfaces HTTP 429 rate-limit error without retry loops or Nominatim fallback', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(autocompleteLocations('Sóng Thần')).rejects.toMatchObject({
      name: 'GeocoderError',
      code: 'RATE_LIMITED',
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(String(fetchMock.mock.calls[0][0])).not.toContain('nominatim')
  })

  it('throws UNAVAILABLE on Photon error and never falls back to public Nominatim', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(autocompleteLocations('Cát Lái')).rejects.toMatchObject({
      name: 'GeocoderError',
      code: 'UNAVAILABLE',
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('respects runtime geocoderEnabled=false configuration without issuing network requests', async () => {
    setMapRuntimeConfigOverrideForTests({ geocoderEnabled: false })
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(autocompleteLocations('Cát Lái')).rejects.toMatchObject({
      name: 'GeocoderError',
      code: 'DISABLED',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('preserves zero capacity and prices and sends real search coordinates to the backend', async () => {
    const request = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: {
        data: {
          content: [
            {
              id: 1,
              name: 'Bãi',
              address: 'Địa chỉ',
              latitude: 10.7,
              longitude: 106.7,
              availableCapacity: 0,
              basePricePerHour: 0,
              distanceKm: 0,
              averageRating: 0,
            },
          ],
        },
      },
    })
    const result = await fetchParkingLots({
      selectedVehicleId: 'type:BUS_COACH',
      vehicleType: 'BUS_COACH',
      radiusKm: 15,
      sortBy: 'distance',
      includeFull: true,
      keyword: '',
      latitude: 10.7,
      longitude: 106.7,
    })
    expect(request.mock.calls[0][0]).toBe('/api/v1/parking-lots/search')
    expect(request.mock.calls[0][1]?.params).toMatchObject({
      includeFull: true,
      vehicleType: 'BUS_COACH',
      latitude: 10.7,
      longitude: 106.7,
    })
    expect(result[0]).toMatchObject({
      availableSlots: 0,
      hourlyRate: 0,
      distanceKm: 0,
      ratingAverage: 0,
      isFull: true,
    })
  })
})
