import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createPlacesAutocompleteSession,
  getDrivingRoute,
} from './mapProvider'
import { fetchParkingLots } from './parkingSearchApi'
import { apiClient } from '@/shared/api/client'
import * as sharedMaps from '@/shared/maps'

describe('Google Maps parking-search services (Places New & Routes)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('calls Google Routes Route.computeRoutes with DRIVING mode and minimal field mask', async () => {
    const computeRoutes = vi.fn().mockResolvedValue({
      routes: [
        {
          distanceMeters: 12500,
          durationMillis: 900000,
          path: [
            { lat: 10.7, lng: 106.7 },
            { lat: 10.8, lng: 106.8 },
          ],
        },
      ],
    })

    vi.spyOn(sharedMaps, 'loadGoogleMapsLibrary').mockResolvedValue({
      Route: { computeRoutes },
    } as never)

    const result = await getDrivingRoute(
      { latitude: 10.7, longitude: 106.7 },
      { latitude: 10.8, longitude: 106.8 },
    )

    expect(computeRoutes).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: { lat: 10.7, lng: 106.7 },
        destination: { lat: 10.8, lng: 106.8 },
        travelMode: 'DRIVING',
        fields: ['durationMillis', 'distanceMeters', 'path'],
        language: 'vi',
        region: 'VN',
      }),
    )

    expect(result).toEqual({
      points: [
        { latitude: 10.7, longitude: 106.7 },
        { latitude: 10.8, longitude: 106.8 },
      ],
      distanceKm: 12.5,
      durationMinutes: 15,
    })
  })

  it('reports a routing failure rather than drawing an invented straight-line route', async () => {
    const computeRoutes = vi.fn().mockResolvedValue({ routes: [] })
    vi.spyOn(sharedMaps, 'loadGoogleMapsLibrary').mockResolvedValue({
      Route: { computeRoutes },
    } as never)

    await expect(
      getDrivingRoute(
        { latitude: 10.7, longitude: 106.7 },
        { latitude: 10.8, longitude: 106.8 },
      ),
    ).rejects.toThrow('Chưa tìm thấy tuyến đường')
  })

  it('uses Places Autocomplete (New) restricted to VN, manages session tokens, and fetches Details on selection', async () => {
    let tokenCounter = 0
    class FakeSessionToken {
      readonly id = ++tokenCounter
    }

    const fetchFields = vi.fn().mockImplementation(async function (this: {
      location?: { lat: () => number; lng: () => number }
      formattedAddress?: string
      displayName?: string
    }) {
      this.location = { lat: () => 10.7715, lng: () => 106.7865 }
      this.formattedAddress = 'Cảng Cát Lái, Phường Cát Lái, TP. Thủ Đức'
      this.displayName = 'Cảng Cát Lái'
    })

    const fetchAutocompleteSuggestions = vi.fn().mockResolvedValue({
      suggestions: [
        {
          placePrediction: {
            placeId: 'place-cat-lai',
            text: { text: 'Cảng Cát Lái, TP. Thủ Đức' },
            mainText: { text: 'Cảng Cát Lái' },
            secondaryText: { text: 'TP. Thủ Đức' },
            toPlace: () => ({ fetchFields }),
          },
        },
      ],
    })

    vi.spyOn(sharedMaps, 'loadGoogleMapsLibrary').mockResolvedValue({
      AutocompleteSessionToken: FakeSessionToken,
      AutocompleteSuggestion: { fetchAutocompleteSuggestions },
    } as never)

    const session = createPlacesAutocompleteSession()
    const firstBatch = await session.suggest('Cát')
    const secondBatch = await session.suggest('Cát Lái')

    expect(fetchAutocompleteSuggestions).toHaveBeenCalledTimes(2)
    const firstReq = fetchAutocompleteSuggestions.mock.calls[0][0]
    const secondReq = fetchAutocompleteSuggestions.mock.calls[1][0]

    expect(firstReq.includedRegionCodes).toEqual(['vn'])
    expect(firstReq.language).toBe('vi')
    expect(firstReq.sessionToken).toBe(secondReq.sessionToken)

    expect(firstBatch).toHaveLength(1)
    expect(secondBatch[0]).toMatchObject({
      id: 'place-cat-lai',
      label: 'Cảng Cát Lái, TP. Thủ Đức',
    })

    const resolved = await session.resolveSuggestion(secondBatch[0])
    expect(fetchFields).toHaveBeenCalledWith({
      fields: ['location', 'formattedAddress', 'displayName'],
    })
    expect(resolved).toEqual({
      id: 'place-cat-lai',
      placeId: 'place-cat-lai',
      label: 'Cảng Cát Lái, Phường Cát Lái, TP. Thủ Đức',
      latitude: 10.7715,
      longitude: 106.7865,
    })

    // Next query after selection must start a new session token.
    await session.suggest('Sóng Thần')
    const thirdReq = fetchAutocompleteSuggestions.mock.calls[2][0]
    expect(thirdReq.sessionToken).not.toBe(firstReq.sessionToken)
  })

  it('propagates Google Places errors without silently falling back to Nominatim or Photon', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    vi.spyOn(sharedMaps, 'loadGoogleMapsLibrary').mockResolvedValue({
      AutocompleteSessionToken: class {},
      AutocompleteSuggestion: {
        fetchAutocompleteSuggestions: vi
          .fn()
          .mockRejectedValue(new Error('OVER_QUERY_LIMIT')),
      },
    } as never)

    const session = createPlacesAutocompleteSession()
    await expect(session.suggest('Cát Lái')).rejects.toMatchObject({
      code: 'PLACES_ERROR',
    })
    expect(fetchSpy).not.toHaveBeenCalled()
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
