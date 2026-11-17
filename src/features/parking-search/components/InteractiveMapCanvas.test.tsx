import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import L from 'leaflet'
import { InteractiveMapCanvas } from './InteractiveMapCanvas'
import { resetMapRuntimeConfigForTests } from '@/shared/maps'
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

function createCanvas2dStub(): CanvasRenderingContext2D {
  return {
    scale: vi.fn(),
    translate: vi.fn(),
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    setTransform: vi.fn(),
    setLineDash: vi.fn(),
  } as unknown as CanvasRenderingContext2D
}

function renderCanvas(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('InteractiveMapCanvas (Hybrid Leaflet + OSM + Google Maps Directions CTA)', () => {
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
    resetMapRuntimeConfigForTests()
  })

  it('renders Leaflet markers, origin indicator, and Google Maps directions CTA without calling Routes/OSRM', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      createCanvas2dStub(),
    )
    const circleSpy = vi.spyOn(L, 'circleMarker')
    const polylineSpy = vi.spyOn(L, 'polyline')

    renderCanvas(
      <InteractiveMapCanvas
        lots={[sampleLot]}
        selectedLot={sampleLot}
        origin={{ latitude: 10.77, longitude: 106.66 }}
        onSelectLot={vi.fn()}
        onQuickBook={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('region', { name: 'Bản đồ bãi đỗ OpenStreetMap' }),
    ).toBeInTheDocument()
    expect(circleSpy).toHaveBeenCalledWith(
      [10.77, 106.66],
      expect.objectContaining({
        fillColor: '#ea580c',
      }),
    )
    // No in-app polyline / Routes calculation (H03)
    expect(polylineSpy).not.toHaveBeenCalled()

    const directionsLink = screen.getByRole('link', {
      name: /Chỉ đường bằng Google Maps/i,
    })
    expect(directionsLink).toHaveAttribute(
      'href',
      'https://www.google.com/maps/dir/?api=1&destination=10.762622%2C106.7865&travelmode=driving&origin=10.77%2C106.66',
    )
  })

  it('offers Google Maps directions CTA even without an origin and avoids spurious flyTo on lot array refresh', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const flyToSpy = vi.spyOn(L.Map.prototype, 'flyTo')
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

    expect(flyToSpy).toHaveBeenCalledTimes(1)
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

    expect(flyToSpy).toHaveBeenCalledTimes(1)
  })

  it('re-fits all parking lots when origin is cleared back to unfiltered scope', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      createCanvas2dStub(),
    )
    const fitBoundsSpy = vi.spyOn(L.Map.prototype, 'fitBounds')
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
      expect(fitBoundsSpy).toHaveBeenCalledTimes(1)
    })
    expect(fitBoundsSpy.mock.calls[0][0]).toEqual([
      [sampleLot.latitude, sampleLot.longitude],
      [secondLot.latitude, secondLot.longitude],
    ])
  })

  it('shows tile error banner with retry and Google Maps directions fallback when tiles fail', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      createCanvas2dStub(),
    )
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

    renderCanvas(
      <InteractiveMapCanvas
        lots={[sampleLot]}
        selectedLot={sampleLot}
        onSelectLot={vi.fn()}
        onQuickBook={vi.fn()}
      />,
    )

    act(() => {
      handlers.tileerror?.()
    })

    expect(
      screen.getByText(/Chưa tải được nền bản đồ OpenStreetMap/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Thử tải lại bản đồ/i }),
    ).toBeInTheDocument()
  })
})
