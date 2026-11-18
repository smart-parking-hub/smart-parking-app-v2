import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { resetMapRuntimeConfigForTests } from '@/shared/maps'
import { CreateParkingLotMapPicker } from './CreateParkingLotMapPicker'

const mapHandlers: Record<string, ((event?: unknown) => void)[]> = {}
const markerHandlers: Record<string, (() => void)[]> = {}
let currentMarkerLngLat = { lng: 106.7865, lat: 10.762622 }

const mockMapInstance = {
  addControl: vi.fn(),
  on: vi.fn((event: string, cb: (payload?: unknown) => void) => {
    mapHandlers[event] = [...(mapHandlers[event] ?? []), cb]
  }),
  setStyle: vi.fn(),
  jumpTo: vi.fn(),
  resize: vi.fn(),
  remove: vi.fn(),
  getSource: vi.fn(() => undefined),
  getLayer: vi.fn(() => undefined),
  addSource: vi.fn(),
  addLayer: vi.fn(),
  removeSource: vi.fn(),
  removeLayer: vi.fn(),
}

const mockMarkerInstance = {
  setLngLat: vi.fn().mockReturnThis(),
  addTo: vi.fn().mockReturnThis(),
  on: vi.fn((event: string, cb: () => void) => {
    markerHandlers[event] = [...(markerHandlers[event] ?? []), cb]
  }),
  getLngLat: vi.fn(() => currentMarkerLngLat),
  remove: vi.fn(),
}

vi.mock('maplibre-gl', () => ({
  Map: vi.fn(() => mockMapInstance),
  Marker: vi.fn(() => mockMarkerInstance),
  NavigationControl: vi.fn(() => ({})),
}))

describe('CreateParkingLotMapPicker (MapLibre GL JS: click + drag + GPS accuracy)', () => {
  beforeEach(() => {
    resetMapRuntimeConfigForTests()
    for (const key of Object.keys(mapHandlers)) delete mapHandlers[key]
    for (const key of Object.keys(markerHandlers)) delete markerHandlers[key]
    currentMarkerLngLat = { lng: 106.7865, lat: 10.762622 }
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

  it('places draggable marker in [lng, lat], renders GPS accuracy GeoJSON layer, and rounds click/drag to 7 decimals', () => {
    const onCoordinatesChange = vi.fn()

    render(
      <CreateParkingLotMapPicker
        latitude={10.762622}
        longitude={106.7865}
        accuracy={25.4}
        onCoordinatesChange={onCoordinatesChange}
      />,
    )

    expect(mockMarkerInstance.setLngLat).toHaveBeenCalledWith([106.7865, 10.762622])
    expect(screen.getByText(/10\.7626220, 106\.7865000/)).toBeInTheDocument()
    expect(screen.getByText(/±25 m/)).toBeInTheDocument()

    // Trigger map style load to draw accuracy polygon
    act(() => {
      mapHandlers.load?.forEach((cb) => cb())
    })
    expect(mockMapInstance.addSource).toHaveBeenCalledWith(
      'picker-gps-accuracy',
      expect.objectContaining({ type: 'geojson' }),
    )
    expect(mockMapInstance.addLayer).toHaveBeenCalledTimes(2)

    // Simulate click on map
    act(() => {
      mapHandlers.click?.forEach((cb) =>
        cb({ lngLat: { lat: 10.771234567, lng: 106.791234567 } }),
      )
    })
    expect(onCoordinatesChange).toHaveBeenLastCalledWith(10.7712346, 106.7912346)

    // Simulate dragging the marker
    currentMarkerLngLat = { lat: 10.801234567, lng: 106.811234567 }
    act(() => {
      markerHandlers.dragend?.forEach((cb) => cb())
    })
    expect(onCoordinatesChange).toHaveBeenLastCalledWith(10.8012346, 106.8112346)
  })

  it('shows non-blocking error alert with retry while preserving coordinate readout', () => {
    render(
      <CreateParkingLotMapPicker
        latitude={10.762622}
        longitude={106.7865}
        onCoordinatesChange={vi.fn()}
      />,
    )

    act(() => {
      mapHandlers.error?.forEach((cb) => cb())
    })

    expect(screen.getByRole('alert')).toHaveTextContent(/OpenFreeMap/i)
    expect(
      screen.getByRole('button', { name: /Thử tải lại bản đồ/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/10\.7626220, 106\.7865000/)).toBeInTheDocument()
  })
})
