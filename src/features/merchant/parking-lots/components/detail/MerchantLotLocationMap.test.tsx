import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import * as sharedMaps from '@/shared/maps'
import * as mapsLoader from '@/shared/maps/loader'
import { MerchantLotLocationMap } from './MerchantLotLocationMap'

describe('MerchantLotLocationMap (Google Maps viewer)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders Google Map with AdvancedMarkerElement at lot coordinates', async () => {
    const MapCtor = vi.fn(() => ({ setCenter: vi.fn() }))
    const AdvancedMarkerCtor = vi.fn(() => ({ map: null }))

    vi.spyOn(mapsLoader, 'loadGoogleMapsCore').mockResolvedValue({
      maps: { Map: MapCtor },
      marker: { AdvancedMarkerElement: AdvancedMarkerCtor },
    } as never)

    render(
      <MerchantLotLocationMap
        latitude={10.7721328}
        longitude={106.6948199}
        lotName="Bến Cảng Quận 1"
      />,
    )

    await waitFor(() => {
      expect(MapCtor).toHaveBeenCalledTimes(1)
      expect(AdvancedMarkerCtor).toHaveBeenCalledTimes(1)
    })

    expect(
      screen.getByRole('region', { name: 'Bản đồ vị trí bãi đỗ' }),
    ).toHaveAttribute('data-map-state', 'ready')
  })

  it('shows fallback UI and Google Maps link when SDK fails to load', async () => {
    vi.spyOn(mapsLoader, 'loadGoogleMapsCore').mockRejectedValue(
      new sharedMaps.GoogleMapsError(
        'SDK_LOAD_ERROR',
        'Không thể tải thư viện Google Maps.',
      ),
    )

    render(
      <MerchantLotLocationMap
        latitude={10.7721328}
        longitude={106.6948199}
        lotName="Bến Cảng Quận 1"
      />,
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /Không thể tải thư viện Google Maps/i,
    )
    expect(
      screen.getByRole('link', { name: /Mở trên Google Maps/i }),
    ).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=10.7721328%2C106.6948199',
    )
  })
})
