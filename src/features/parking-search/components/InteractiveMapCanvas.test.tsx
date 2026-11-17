import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { InteractiveMapCanvas } from './InteractiveMapCanvas'
import * as mapProvider from '../api/mapProvider'
import * as sharedMaps from '@/shared/maps'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

const sampleLot: ParkingLotItem = {
  id: 1,
  name: 'Bãi Container Cát Lái',
  address: '789 Nguyễn Thị Định, TP. Thủ Đức',
  distanceKm: 4.2,
  etaMinutes: 12,
  availableSlots: 5,
  totalSlots: 20,
  slotTypeLabel: 'CONTAINER',
  hourlyRate: 50000,
  depositAmount: 100000,
  amenities: ['24/7'],
  latitude: 10.762622,
  longitude: 106.7865,
  ratingAverage: 4.8,
}

const secondLot: ParkingLotItem = {
  ...sampleLot,
  id: 2,
  name: 'Bãi ICD Sóng Thần',
  latitude: 10.8924,
  longitude: 106.7725,
}

function renderCanvas(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return {
    client,
    ...render(
      <QueryClientProvider client={client}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>,
    ),
  }
}

function createGoogleMapsMocks() {
  const extendedPoints: google.maps.LatLngLiteral[] = []
  class FakeLatLngBounds {
    extend(point: google.maps.LatLngLiteral) {
      extendedPoints.push(point)
      return this
    }
  }

  vi.stubGlobal('google', {
    maps: {
      LatLngBounds: FakeLatLngBounds,
    },
  })

  const mapInstance = {
    panTo: vi.fn(),
    panBy: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn(() => 12),
    fitBounds: vi.fn(),
  }

  const infoWindowInstance = {
    setContent: vi.fn(),
    open: vi.fn(),
    close: vi.fn(),
  }

  const polylineSetMap = vi.fn()
  const MapCtor = vi.fn(() => mapInstance)
  const InfoWindowCtor = vi.fn(() => infoWindowInstance)
  const PolylineCtor = vi.fn(() => ({ setMap: polylineSetMap }))
  const createdMarkers: Array<{
    options: Record<string, unknown>
    map: unknown
    addListener: ReturnType<typeof vi.fn>
  }> = []

  const AdvancedMarkerCtor = vi.fn((options: Record<string, unknown>) => {
    const markerObj = {
      options,
      map: options.map,
      addListener: vi.fn(() => ({ remove: vi.fn() })),
    }
    createdMarkers.push(markerObj)
    return markerObj
  })

  vi.spyOn(sharedMaps, 'loadGoogleMapsCore').mockResolvedValue({
    maps: {
      Map: MapCtor,
      InfoWindow: InfoWindowCtor,
      Polyline: PolylineCtor,
    },
    marker: {
      AdvancedMarkerElement: AdvancedMarkerCtor,
    },
  } as never)

  return {
    mapInstance,
    infoWindowInstance,
    MapCtor,
    PolylineCtor,
    polylineSetMap,
    AdvancedMarkerCtor,
    createdMarkers,
    extendedPoints,
  }
}

describe('InteractiveMapCanvas (Google Maps + Advanced Markers + Routes)', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 1280,
    })
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      get: () => 720,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('mounts Google Map, renders AdvancedMarkerElements, and draws route Polyline', async () => {
    const mocks = createGoogleMapsMocks()

    vi.spyOn(mapProvider, 'getDrivingRoute').mockResolvedValue({
      points: [
        { latitude: 10.77, longitude: 106.66 },
        { latitude: 10.766, longitude: 106.72 },
        { latitude: 10.762622, longitude: 106.7865 },
      ],
      distanceKm: 13.5,
      durationMinutes: 25,
    })

    renderCanvas(
      <InteractiveMapCanvas
        lots={[sampleLot]}
        selectedLot={sampleLot}
        origin={{ latitude: 10.77, longitude: 106.66 }}
        onSelectLot={vi.fn()}
        onQuickBook={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(mocks.MapCtor).toHaveBeenCalledTimes(1)
    })

    // 1 parking lot marker + 1 origin marker
    expect(mocks.AdvancedMarkerCtor).toHaveBeenCalledTimes(2)
    expect(mocks.infoWindowInstance.open).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(mocks.PolylineCtor).toHaveBeenCalledWith(
        expect.objectContaining({
          strokeColor: '#ea580c',
          clickable: false,
          path: [
            { lat: 10.77, lng: 106.66 },
            { lat: 10.766, lng: 106.72 },
            { lat: 10.762622, lng: 106.7865 },
          ],
        }),
      )
    })

    expect(await screen.findByText(/13\.5 km/i)).toBeInTheDocument()
    expect(screen.getByText(/tuyến lái xe tham khảo Google Maps/i)).toBeInTheDocument()
  })

  it('avoids spurious panTo when lots array reference refreshes with identical selected lot', async () => {
    const mocks = createGoogleMapsMocks()
    const onSelectLot = vi.fn()
    const onQuickBook = vi.fn()

    const { rerender, client } = renderCanvas(
      <InteractiveMapCanvas
        lots={[sampleLot]}
        selectedLot={sampleLot}
        onSelectLot={onSelectLot}
        onQuickBook={onQuickBook}
      />,
    )

    await waitFor(() => {
      expect(mocks.mapInstance.panTo).toHaveBeenCalledTimes(1)
    })

    rerender(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <InteractiveMapCanvas
            lots={[{ ...sampleLot }]}
            selectedLot={{ ...sampleLot }}
            onSelectLot={onSelectLot}
            onQuickBook={onQuickBook}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(mocks.mapInstance.panTo).toHaveBeenCalledTimes(1)
  })

  it('re-fits all parking lots when origin is cleared back to unfiltered scope', async () => {
    const mocks = createGoogleMapsMocks()

    vi.spyOn(mapProvider, 'getDrivingRoute').mockResolvedValue({
      points: [
        { latitude: 10.77, longitude: 106.66 },
        { latitude: 10.762622, longitude: 106.7865 },
      ],
      distanceKm: 13.5,
      durationMinutes: 25,
    })

    const onSelectLot = vi.fn()
    const onQuickBook = vi.fn()

    const { rerender, client } = renderCanvas(
      <InteractiveMapCanvas
        lots={[sampleLot, secondLot]}
        selectedLot={sampleLot}
        origin={{ latitude: 10.77, longitude: 106.66 }}
        onSelectLot={onSelectLot}
        onQuickBook={onQuickBook}
      />,
    )

    await waitFor(() => {
      expect(mocks.mapInstance.fitBounds).toHaveBeenCalledTimes(1)
    })

    rerender(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <InteractiveMapCanvas
            lots={[sampleLot, secondLot]}
            selectedLot={sampleLot}
            origin={undefined}
            onSelectLot={onSelectLot}
            onQuickBook={onQuickBook}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(mocks.mapInstance.fitBounds).toHaveBeenCalledTimes(2)
    })
  })

  it('shows clear fallback banner with external Google Maps link when SDK fails to load', async () => {
    vi.spyOn(sharedMaps, 'loadGoogleMapsCore').mockRejectedValue(
      new sharedMaps.GoogleMapsError(
        'MISSING_API_KEY',
        'Thiếu cấu hình VITE_GOOGLE_MAPS_API_KEY cho Google Maps.',
      ),
    )

    renderCanvas(
      <InteractiveMapCanvas
        lots={[sampleLot]}
        selectedLot={sampleLot}
        onSelectLot={vi.fn()}
        onQuickBook={vi.fn()}
      />,
    )

    expect(
      await screen.findByText(/Thiếu cấu hình VITE_GOOGLE_MAPS_API_KEY/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Mở chỉ đường Google Maps/i }),
    ).toHaveAttribute(
      'href',
      'https://www.google.com/maps/dir/?api=1&destination=10.762622%2C106.7865&travelmode=driving',
    )
  })
})
