import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { resetMapRuntimeConfigForTests } from '@/shared/maps'
import { MerchantLotLocationMap } from './MerchantLotLocationMap'

const mapHandlers: Record<string, (() => void)[]> = {}
const mockMapInstance = {
  addControl: vi.fn(),
  on: vi.fn((event: string, cb: () => void) => {
    mapHandlers[event] = [...(mapHandlers[event] ?? []), cb]
  }),
  setStyle: vi.fn(),
  resize: vi.fn(),
  remove: vi.fn(),
}

const mockMarkerInstance = {
  setLngLat: vi.fn().mockReturnThis(),
  addTo: vi.fn().mockReturnThis(),
  remove: vi.fn(),
}

vi.mock('maplibre-gl', () => ({
  Map: vi.fn(() => mockMapInstance),
  Marker: vi.fn(() => mockMarkerInstance),
  NavigationControl: vi.fn(() => ({})),
}))

describe('MerchantLotLocationMap (MapLibre GL JS + OpenFreeMap viewer)', () => {
  beforeEach(() => {
    resetMapRuntimeConfigForTests()
    for (const key of Object.keys(mapHandlers)) delete mapHandlers[key]
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

  it('mounts MapLibre vector map at [lng, lat] without any API key and transitions to ready on load', () => {
    render(
      <MerchantLotLocationMap
        latitude={10.7721328}
        longitude={106.6948199}
        lotName="Bến Cảng Quận 1"
      />,
    )

    const region = screen.getByRole('region', { name: 'Bản đồ vị trí bãi đỗ' })
    expect(region).toHaveAttribute('data-map-state', 'loading')
    expect(mockMarkerInstance.setLngLat).toHaveBeenCalledWith([
      106.6948199,
      10.7721328,
    ])

    act(() => {
      mapHandlers.load?.forEach((cb) => cb())
    })
    expect(region).toHaveAttribute('data-map-state', 'ready')
  })

  it('shows error fallback and Google Maps link when vector style fails to load', () => {
    render(
      <MerchantLotLocationMap
        latitude={10.7721328}
        longitude={106.6948199}
        lotName="Bến Cảng Quận 1"
      />,
    )

    act(() => {
      mapHandlers.error?.forEach((cb) => cb())
    })

    expect(screen.getByRole('alert')).toHaveTextContent(/Google Maps/i)
    expect(
      screen.getByRole('link', { name: /Mở trên Google Maps/i }),
    ).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=10.7721328%2C106.6948199',
    )
  })
})
