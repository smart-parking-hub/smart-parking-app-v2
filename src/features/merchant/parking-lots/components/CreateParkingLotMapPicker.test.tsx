import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import L from 'leaflet'
import { resetMapRuntimeConfigForTests } from '@/shared/maps'
import { CreateParkingLotMapPicker } from './CreateParkingLotMapPicker'

describe('CreateParkingLotMapPicker (Hybrid Leaflet: click + drag + GPS accuracy)', () => {
  beforeEach(() => {
    resetMapRuntimeConfigForTests()
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
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    resetMapRuntimeConfigForTests()
  })

  it('mounts Leaflet picker with draggable marker, accuracy circle, and 7-decimal rounding on click & dragend', () => {
    const markerSpy = vi.spyOn(L, 'marker')
    const circleSpy = vi.spyOn(L, 'circle')
    const onCoordinatesChange = vi.fn()

    render(
      <CreateParkingLotMapPicker
        latitude={10.762622}
        longitude={106.7865}
        accuracy={25.4}
        onCoordinatesChange={onCoordinatesChange}
      />,
    )

    expect(markerSpy).toHaveBeenCalledWith(
      [10.762622, 106.7865],
      expect.objectContaining({
        draggable: true,
        title: 'Nhà xe · Vị trí đang chọn',
      }),
    )
    expect(circleSpy).toHaveBeenCalledWith(
      [10.762622, 106.7865],
      expect.objectContaining({
        radius: 25.4,
      }),
    )
    expect(screen.getByText(/10\.7626220, 106\.7865000/)).toBeInTheDocument()
    expect(screen.getByText(/±25 m/)).toBeInTheDocument()

    // Simulate dragging the marker to a new coordinate
    const markerInstance = markerSpy.mock.results[0].value as L.Marker
    markerInstance.setLatLng([10.771234567, 106.791234567])
    markerInstance.fire('dragend')

    expect(onCoordinatesChange).toHaveBeenCalledWith(10.7712346, 106.7912346)
  })

  it('shows non-blocking tile error alert with retry while preserving coordinate readout', () => {
    const handlers: Record<string, () => void> = {}
    const fakeTiles = {
      addTo: vi.fn().mockReturnThis(),
      on: vi.fn((event: string, cb: () => void) => {
        handlers[event] = cb
        return fakeTiles
      }),
      redraw: vi.fn(),
      remove: vi.fn(),
    }
    vi.spyOn(L, 'tileLayer').mockReturnValue(fakeTiles as unknown as L.TileLayer)

    render(
      <CreateParkingLotMapPicker
        latitude={10.762622}
        longitude={106.7865}
        onCoordinatesChange={vi.fn()}
      />,
    )

    act(() => {
      handlers.tileerror?.()
    })

    expect(screen.getByRole('alert')).toHaveTextContent(/OpenStreetMap/i)
    expect(
      screen.getByRole('button', { name: /Thử tải lại bản đồ/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/10\.7626220, 106\.7865000/)).toBeInTheDocument()
  })
})
