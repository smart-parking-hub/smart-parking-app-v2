import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import L from 'leaflet'
import { resetMapRuntimeConfigForTests } from '@/shared/maps'
import { MerchantLotLocationMap } from './MerchantLotLocationMap'

describe('MerchantLotLocationMap (Hybrid Leaflet viewer)', () => {
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

  it('mounts Leaflet map without Google key and transitions to ready on tileload', () => {
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
      <MerchantLotLocationMap
        latitude={10.7721328}
        longitude={106.6948199}
        lotName="Bến Cảng Quận 1"
      />,
    )

    const region = screen.getByRole('region', { name: 'Bản đồ vị trí bãi đỗ' })
    expect(region).toHaveAttribute('data-map-state', 'loading')

    act(() => {
      handlers.tileload?.()
    })
    expect(region).toHaveAttribute('data-map-state', 'ready')
  })

  it('shows tile error fallback and Google Maps link when OpenStreetMap tiles fail', () => {
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
      <MerchantLotLocationMap
        latitude={10.7721328}
        longitude={106.6948199}
        lotName="Bến Cảng Quận 1"
      />,
    )

    act(() => {
      handlers.tileerror?.()
    })

    expect(screen.getByRole('alert')).toHaveTextContent(/OpenStreetMap/i)
    expect(
      screen.getByRole('link', { name: /Mở trên Google Maps/i }),
    ).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=10.7721328%2C106.6948199',
    )
  })
})
