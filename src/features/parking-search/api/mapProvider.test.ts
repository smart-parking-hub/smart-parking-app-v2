import { afterEach, describe, expect, it, vi } from 'vitest'
import { getDrivingRoute, searchLocations } from './mapProvider'
import { fetchParkingLots } from './parkingSearchApi'
import { apiClient } from '@/shared/api/client'
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
describe('Real OpenStreetMap services', () => {
  it('sends longitude/latitude to OSRM and converts returned GeoJSON to Leaflet order', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        code: 'Ok',
        routes: [
          {
            distance: 12500,
            duration: 900,
            geometry: {
              coordinates: [
                [106.7, 10.7],
                [106.8, 10.8],
              ],
            },
          },
        ],
      }),
    })
    vi.stubGlobal('fetch', fetchMock)
    const result = await getDrivingRoute(
      { latitude: 10.7, longitude: 106.7 },
      { latitude: 10.8, longitude: 106.8 },
    )
    expect(fetchMock.mock.calls[0][0]).toContain('/106.7,10.7;106.8,10.8?')
    expect(result).toEqual({
      points: [
        [10.7, 106.7],
        [10.8, 106.8],
      ],
      distanceKm: 12.5,
      durationMinutes: 15,
    })
  })
  it('reports a routing failure rather than drawing an invented route', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: async () => ({ code: 'NoRoute', routes: [] }),
        }),
    )
    await expect(
      getDrivingRoute(
        { latitude: 10, longitude: 106 },
        { latitude: 11, longitude: 107 },
      ),
    ).rejects.toThrow('Chưa tìm thấy tuyến đường')
  })
  it('parses geocoder strings and limits results to Vietnam', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => [
          { place_id: 1, display_name: 'Cát Lái', lat: '10.7', lon: '106.7' },
        ],
      })
    vi.stubGlobal('fetch', fetchMock)
    expect(await searchLocations('Cát Lái')).toEqual([
      { id: '1', label: 'Cát Lái', latitude: 10.7, longitude: 106.7 },
    ])
    expect(fetchMock.mock.calls[0][0]).toContain('countrycodes=vn')
  })
  it('preserves zero capacity and prices and sends real search coordinates to the backend', async () => {
    const request = vi
      .spyOn(apiClient, 'get')
      .mockResolvedValue({
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
