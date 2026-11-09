import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import L from 'leaflet'
import { InteractiveMapCanvas } from './InteractiveMapCanvas'
import * as mapProvider from '../api/mapProvider'
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

describe('InteractiveMapCanvas pan stability', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
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
  })

  it('uses padded Canvas renderer, concrete route colors, and non-clipping non-interactive polyline', async () => {
    const ctxStub = createCanvas2dStub()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctxStub)
    const canvasSpy = vi.spyOn(L, 'canvas')
    const polylineSpy = vi.spyOn(L, 'polyline')
    const circleSpy = vi.spyOn(L, 'circleMarker')

    vi.spyOn(mapProvider, 'getDrivingRoute').mockResolvedValue({
      points: [
        [10.77, 106.66],
        [10.766, 106.72],
        [10.762622, 106.7865],
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

    expect(canvasSpy).toHaveBeenCalledWith({ padding: 0.5 })
    expect(circleSpy).toHaveBeenCalledWith(
      [10.77, 106.66],
      expect.objectContaining({
        fillColor: '#ea580c',
      }),
    )

    await waitFor(() => {
      expect(polylineSpy).toHaveBeenCalledWith(
        [
          [10.77, 106.66],
          [10.766, 106.72],
          [10.762622, 106.7865],
        ],
        expect.objectContaining({
          color: '#ea580c',
          noClip: true,
          interactive: false,
          lineCap: 'round',
          lineJoin: 'round',
        }),
      )
    })

    expect(await screen.findByText(/13\.5 km/i)).toBeInTheDocument()
  })

  it('falls back cleanly to padded SVG renderer and avoids spurious flyTo when lots array reference refreshes', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const svgSpy = vi.spyOn(L, 'svg')
    const flyToSpy = vi.spyOn(L.Map.prototype, 'flyTo')

    vi.spyOn(mapProvider, 'getDrivingRoute').mockResolvedValue({
      points: [
        [10.77, 106.66],
        [10.762622, 106.7865],
      ],
      distanceKm: 13.5,
      durationMinutes: 25,
    })

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

    expect(svgSpy).toHaveBeenCalledWith({ padding: 0.5 })
    expect(flyToSpy).toHaveBeenCalledTimes(1)

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

    expect(flyToSpy).toHaveBeenCalledTimes(1)
  })

  it('re-fits all parking lots when origin is cleared back to unfiltered scope', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      createCanvas2dStub(),
    )
    const fitBoundsSpy = vi.spyOn(L.Map.prototype, 'fitBounds')

    vi.spyOn(mapProvider, 'getDrivingRoute').mockResolvedValue({
      points: [
        [10.77, 106.66],
        [10.762622, 106.7865],
      ],
      distanceKm: 13.5,
      durationMinutes: 25,
    })

    const onSelectLot = vi.fn()
    const onQuickBook = vi.fn()

    const { rerender, client } = renderCanvas(
      <InteractiveMapCanvas
        lots={[sampleLot]}
        selectedLot={sampleLot}
        origin={{ latitude: 10.77, longitude: 106.66 }}
        onSelectLot={onSelectLot}
        onQuickBook={onQuickBook}
      />,
    )

    await waitFor(() => {
      expect(fitBoundsSpy).toHaveBeenCalledTimes(1)
    })

    rerender(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <InteractiveMapCanvas
            lots={[sampleLot]}
            selectedLot={sampleLot}
            origin={undefined}
            onSelectLot={onSelectLot}
            onQuickBook={onQuickBook}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(fitBoundsSpy).toHaveBeenCalledTimes(2)
    })
    expect(fitBoundsSpy.mock.calls[1][0]).toEqual([[sampleLot.latitude, sampleLot.longitude]])
  })
})

