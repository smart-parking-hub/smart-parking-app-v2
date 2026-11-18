import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { InteractiveMapCanvas } from './InteractiveMapCanvas'
import {
  clearDrivingRouteCacheForTests,
  resetMapRuntimeConfigForTests,
} from '@/shared/maps'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

const mapHandlers: Record<string, (() => void)[]> = {}
const addedSources = new Map<string, unknown>()
const addedLayers = new Set<string>()

const mockMapInstance = {
  on: vi.fn((event: string, cb: () => void) => {
    mapHandlers[event] = [...(mapHandlers[event] ?? []), cb]
  }),
  setStyle: vi.fn(),
  resize: vi.fn(),
  remove: vi.fn(),
  flyTo: vi.fn(),
  fitBounds: vi.fn(),
  getZoom: vi.fn(() => 12),
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  getSource: vi.fn((id: string) => addedSources.get(id)),
  getLayer: vi.fn((id: string) => (addedLayers.has(id) ? { id } : undefined)),
  addSource: vi.fn((id: string, def: unknown) => {
    addedSources.set(id, { ...((def as object) ?? {}), setData: vi.fn() })
  }),
  addLayer: vi.fn((layer: { id: string }) => {
    addedLayers.add(layer.id)
  }),
  removeSource: vi.fn((id: string) => {
    addedSources.delete(id)
  }),
  removeLayer: vi.fn((id: string) => {
    addedLayers.delete(id)
  }),
}

const createdMarkers: Array<{ lngLat?: [number, number] }> = []
const createdPopups: Array<{ lngLat?: [number, number] }> = []

vi.mock('maplibre-gl', () => {
  class FakeLngLatBounds {
    points: [number, number][] = []
    extend(point: [number, number]) {
      this.points.push(point)
      return this
    }
  }
  return {
    Map: vi.fn(() => mockMapInstance),
    LngLatBounds: FakeLngLatBounds,
    Marker: vi.fn(() => {
      const entry: { lngLat?: [number, number] } = {}
      createdMarkers.push(entry)
      return {
        setLngLat: vi.fn((coords: [number, number]) => {
          entry.lngLat = coords
          return {
            addTo: vi.fn(() => ({ remove: vi.fn() })),
          }
        }),
        remove: vi.fn(),
      }
    }),
    Popup: vi.fn(() => {
      const entry: { lngLat?: [number, number] } = {}
      createdPopups.push(entry)
      const popupApi = {
        setLngLat: vi.fn((coords: [number, number]) => {
          entry.lngLat = coords
          return popupApi
        }),
        setDOMContent: vi.fn(() => popupApi),
        addTo: vi.fn(() => popupApi),
        remove: vi.fn(),
      }
      return popupApi
    }),
  }
})

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
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('InteractiveMapCanvas (MapLibre GL JS + Google Maps Street + OSRM Routing)', () => {
  beforeEach(() => {
    resetMapRuntimeConfigForTests()
    clearDrivingRouteCacheForTests()
    for (const key of Object.keys(mapHandlers)) delete mapHandlers[key]
    addedSources.clear()
    addedLayers.clear()
    createdMarkers.length = 0
    createdPopups.length = 0
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
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('/route/v1/driving/')) {
          return {
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({
              code: 'Ok',
              routes: [
                {
                  distance: 15420,
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
          }
        }
        return {
          ok: false,
          status: 404,
          headers: new Headers(),
        }
      }),
    )
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
    vi.unstubAllGlobals()
    clearDrivingRouteCacheForTests()
    resetMapRuntimeConfigForTests()
  })

  it('mounts Google Maps basemap, draws [lng, lat] markers, popup, OSRM driving route, and Google Maps CTA', async () => {
    renderCanvas(
      <InteractiveMapCanvas
        lots={[sampleLot]}
        selectedLot={sampleLot}
        origin={{ latitude: 10.77, longitude: 106.66 }}
        onSelectLot={vi.fn()}
        onQuickBook={vi.fn()}
      />,
    )

    const region = screen.getByRole('region', {
      name: 'Bản đồ bãi đỗ Google Maps và OSRM',
    })
    expect(region).toHaveAttribute('data-map-basemap', 'google-roadmap')

    // Lot marker + origin marker placed in [lng, lat] order
    expect(createdMarkers).toEqual([
      { lngLat: [106.7865, 10.762622] },
      { lngLat: [106.66, 10.77] },
    ])
    expect(createdPopups).toEqual([{ lngLat: [106.7865, 10.762622] }])

    act(() => {
      mapHandlers.load?.forEach((cb) => cb())
    })

    await waitFor(() => {
      expect(screen.getByText('15,4 km')).toBeInTheDocument()
      expect(screen.getByText('~28 phút')).toBeInTheDocument()
    })

    expect(mockMapInstance.addSource).toHaveBeenCalledWith(
      'osrm-driving-route',
      expect.objectContaining({ type: 'geojson', attribution: 'OSRM' }),
    )
    expect(mockMapInstance.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'osrm-driving-route-casing' }),
    )
    expect(mockMapInstance.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'osrm-driving-route-line' }),
    )

    expect(
      screen.getByRole('link', { name: /Chỉ đường bằng Google Maps/i }),
    ).toHaveAttribute(
      'href',
      'https://www.google.com/maps/dir/?api=1&destination=10.762622%2C106.7865&travelmode=driving&origin=10.77%2C106.66',
    )
  })

  it('offers Google Maps directions CTA without origin and avoids spurious flyTo on lot array refresh', () => {
    const onSelectLot = vi.fn()
    const onQuickBook = vi.fn()

    const { rerender } = renderCanvas(
      <InteractiveMapCanvas
        lots={[sampleLot]}
        selectedLot={sampleLot}
        onSelectLot={onSelectLot}
        onQuickBook={onQuickBook}
      />,
    )

    expect(mockMapInstance.flyTo).toHaveBeenCalledTimes(1)
    expect(
      screen.getByRole('link', { name: /Chỉ đường bằng Google Maps/i }),
    ).toHaveAttribute(
      'href',
      'https://www.google.com/maps/dir/?api=1&destination=10.762622%2C106.7865&travelmode=driving',
    )

    rerender(
      <MemoryRouter>
        <InteractiveMapCanvas
          lots={[{ ...sampleLot }]}
          selectedLot={{ ...sampleLot }}
          onSelectLot={onSelectLot}
          onQuickBook={onQuickBook}
        />
      </MemoryRouter>,
    )

    expect(mockMapInstance.flyTo).toHaveBeenCalledTimes(1)
  })

  it('re-fits all parking lots when origin is cleared back to unfiltered scope', async () => {
    const onSelectLot = vi.fn()
    const onQuickBook = vi.fn()

    const { rerender } = renderCanvas(
      <InteractiveMapCanvas
        lots={[sampleLot, secondLot]}
        selectedLot={sampleLot}
        origin={{ latitude: 10.77, longitude: 106.66 }}
        onSelectLot={onSelectLot}
        onQuickBook={onQuickBook}
      />,
    )

    rerender(
      <MemoryRouter>
        <InteractiveMapCanvas
          lots={[sampleLot, secondLot]}
          selectedLot={sampleLot}
          origin={undefined}
          onSelectLot={onSelectLot}
          onQuickBook={onQuickBook}
        />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(mockMapInstance.fitBounds).toHaveBeenCalledTimes(1)
    })
  })

  it('shows non-blocking error banner with retry and OpenFreeMap fallback when Google Maps tiles fail', () => {
    renderCanvas(
      <InteractiveMapCanvas
        lots={[sampleLot]}
        selectedLot={sampleLot}
        onSelectLot={vi.fn()}
        onQuickBook={vi.fn()}
      />,
    )

    act(() => {
      mapHandlers.error?.forEach((cb) => cb())
    })

    expect(
      screen.getByText(/Chưa tải được nền bản đồ Google Maps/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Thử tải lại bản đồ/i }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Chuyển sang OpenFreeMap/i }),
    )
    expect(
      screen.getByRole('region', {
        name: 'Bản đồ bãi đỗ Google Maps và OSRM',
      }),
    ).toHaveAttribute('data-map-basemap', 'openfreemap')
  })
})
