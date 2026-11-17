import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import * as sharedMaps from '@/shared/maps'
import { CreateParkingLotMapPicker } from './CreateParkingLotMapPicker'

describe('CreateParkingLotMapPicker (Google Maps)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('mounts Google Maps picker, places AdvancedMarkerElement, and emits 7-decimal coordinates on map click', async () => {
    let mapClickHandler: ((event: google.maps.MapMouseEvent) => void) | undefined
    const mapInstance = {
      addListener: vi.fn((event: string, cb: (e: google.maps.MapMouseEvent) => void) => {
        if (event === 'click') mapClickHandler = cb
        return { remove: vi.fn() }
      }),
      panTo: vi.fn(),
      setZoom: vi.fn(),
    }

    const markerInstance: {
      position: google.maps.LatLngLiteral
      map: unknown
      addListener: ReturnType<typeof vi.fn>
    } = {
      position: { lat: 10.762622, lng: 106.7865 },
      map: mapInstance,
      addListener: vi.fn(() => ({ remove: vi.fn() })),
    }

    const circleInstance = {
      setCenter: vi.fn(),
      setRadius: vi.fn(),
      setMap: vi.fn(),
    }

    const MapCtor = vi.fn(() => mapInstance)
    const CircleCtor = vi.fn(() => circleInstance)
    const AdvancedMarkerCtor = vi.fn(() => markerInstance)

    vi.spyOn(sharedMaps, 'loadGoogleMapsCore').mockResolvedValue({
      maps: { Map: MapCtor, Circle: CircleCtor },
      marker: { AdvancedMarkerElement: AdvancedMarkerCtor },
    } as never)

    const onCoordinatesChange = vi.fn()
    render(
      <CreateParkingLotMapPicker
        latitude={10.762622}
        longitude={106.7865}
        accuracy={25.4}
        onCoordinatesChange={onCoordinatesChange}
      />,
    )

    await waitFor(() => {
      expect(MapCtor).toHaveBeenCalledTimes(1)
      expect(AdvancedMarkerCtor).toHaveBeenCalledTimes(1)
    })

    expect(CircleCtor).toHaveBeenCalledWith(
      expect.objectContaining({
        center: { lat: 10.762622, lng: 106.7865 },
        radius: 25.4,
      }),
    )
    expect(screen.getByText(/10\.7626220, 106\.7865000/)).toBeInTheDocument()
    expect(screen.getByText(/±25 m/)).toBeInTheDocument()

    mapClickHandler?.({
      latLng: { lat: () => 10.771234567, lng: () => 106.791234567 },
    } as google.maps.MapMouseEvent)

    expect(onCoordinatesChange).toHaveBeenCalledWith(10.7712346, 106.7912346)
  })

  it('displays error banner with retry option while preserving coordinate readout when SDK fails', async () => {
    vi.spyOn(sharedMaps, 'loadGoogleMapsCore').mockRejectedValue(
      new sharedMaps.GoogleMapsError(
        'MISSING_API_KEY',
        'Thiếu cấu hình VITE_GOOGLE_MAPS_API_KEY cho Google Maps.',
      ),
    )

    render(
      <CreateParkingLotMapPicker
        latitude={10.762622}
        longitude={106.7865}
        onCoordinatesChange={vi.fn()}
      />,
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /VITE_GOOGLE_MAPS_API_KEY/i,
    )
    expect(screen.getByRole('button', { name: /Thử tải lại bản đồ/i })).toBeInTheDocument()
    expect(screen.getByText(/10\.7626220, 106\.7865000/)).toBeInTheDocument()
  })
})
