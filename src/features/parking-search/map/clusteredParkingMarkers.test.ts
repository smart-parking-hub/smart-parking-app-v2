import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import type { Map as LibreMap } from 'maplibre-gl'
import type { ParkingLotItem } from '../types/parkingSearchTypes'
import { mountClusteredParkingMarkers } from './clusteredParkingMarkers'

const created = vi.hoisted(() => [] as { element: HTMLButtonElement; removed: boolean }[])
vi.mock('maplibre-gl', () => ({
  Marker: class {
    entry: typeof created[number]
    constructor({ element }: { element: HTMLButtonElement }) {
      this.entry = { element, removed: false }
      created.push(this.entry)
    }
    setLngLat() { return this }
    addTo() { return this }
    remove() { this.entry.removed = true }
  },
}))

const lot: ParkingLotItem = {
  id: 1, name: '<Bãi thử>', address: 'Thủ Đức', latitude: 10.77, longitude: 106.7,
  hourlyRate: 50000, availableSlots: 0, totalSlots: 10, distanceKm: 1, etaMinutes: 3,
  depositAmount: 10000, slotTypeLabel: 'HEAVY_TRUCK', amenities: [], ratingAverage: 4,
}
const point = (properties: Record<string, number>, coordinates = [106.7, 10.77]): GeoJSON.Feature<GeoJSON.Point> => ({
  type: 'Feature', properties, geometry: { type: 'Point', coordinates },
})

function setup(features: GeoJSON.Feature<GeoJSON.Point>[] = []) {
  let registered = false
  let layerRegistered = false
  const handlers = new Map<string, Set<(event?: unknown) => void>>()
  const source = { setData: vi.fn(), getClusterExpansionZoom: vi.fn().mockResolvedValue(15) }
  const map = {
    getSource: vi.fn(() => registered ? source : undefined),
    getLayer: vi.fn(() => layerRegistered ? {} : undefined),
    addSource: vi.fn(() => { registered = true }), addLayer: vi.fn(() => { layerRegistered = true }),
    getStyle: vi.fn(() => ({})), isSourceLoaded: vi.fn(() => true),
    queryRenderedFeatures: vi.fn(() => features), flyTo: vi.fn(),
    on: vi.fn((name: string, callback: (event?: unknown) => void) => {
      if (!handlers.has(name)) handlers.set(name, new Set())
      handlers.get(name)!.add(callback)
    }),
    off: vi.fn((name: string, callback: (event?: unknown) => void) => handlers.get(name)?.delete(callback)),
  }
  const select = vi.fn()
  const mount = (lots = [lot]) => mountClusteredParkingMarkers(map as unknown as LibreMap, lots, select)
  const emit = (name: string, event?: unknown) => handlers.get(name)?.forEach(cb => cb(event))
  return { map, source, mount, emit, select, handlers, removeStyle: () => { registered = false; layerRegistered = false } }
}

beforeEach(() => {
  created.length = 0
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
})
afterEach(() => vi.unstubAllGlobals())

it('uses native clustering, excludes invalid coordinates and keeps longitude first', () => {
  const state = setup()
  state.mount([lot, { ...lot, id: 2, latitude: NaN }])()
  expect(state.map.addSource).toHaveBeenCalledWith('parking-search-clusters', expect.objectContaining({
    cluster: true, clusterRadius: 64,
    data: { type: 'FeatureCollection', features: [point({ lotId: 1 })] },
  }))
})

it('deduplicates tile features and preserves accessible individual lot selection', () => {
  const feature = point({ lotId: 1 })
  const state = setup([feature, feature, point({ lotId: 99 })])
  const cleanup = state.mount()
  expect(created).toHaveLength(1)
  const button = created[0].element
  expect(button.tagName).toBe('BUTTON')
  expect(button).toHaveAttribute('aria-label', lot.name)
  expect(button.querySelector('.parking-map-pin')).toHaveAttribute('data-compact', 'true')
  expect(button.querySelector('.parking-map-pin')).toHaveAttribute('data-full', 'true')
  expect(button.querySelector('bãi')).toBeNull()
  fireEvent.click(button)
  expect(state.select).toHaveBeenCalledWith(lot)
  cleanup()
  expect(created[0].removed).toBe(true)
  expect([...state.handlers.values()].every(set => set.size === 0)).toBe(true)
})

it('expands a cluster using its real expansion zoom and reduced-motion preference', async () => {
  const state = setup([point({ cluster_id: 17, point_count: 3 })])
  const cleanup = state.mount()
  expect(created[0].element).toHaveAttribute('aria-label', '3 bãi đỗ gần nhau. Phóng to để chọn bãi')
  fireEvent.click(created[0].element)
  await waitFor(() => expect(state.map.flyTo).toHaveBeenCalledWith({ center: [106.7, 10.77], zoom: 15, duration: 0 }))
  expect(state.source.getClusterExpansionZoom).toHaveBeenCalledWith(17)
  expect(state.select).not.toHaveBeenCalled()
  cleanup()
})

it('removes obsolete clusters after zoom and retains stable buttons during redraw', () => {
  const state = setup([point({ cluster_id: 17, point_count: 3 })])
  const cleanup = state.mount()
  state.emit('render')
  expect(created).toHaveLength(1)
  state.map.queryRenderedFeatures.mockReturnValue([point({ lotId: 1 })])
  state.emit('sourcedata', { sourceId: 'parking-search-clusters' })
  expect(created[0].removed).toBe(true)
  expect(created[1].element).toHaveAttribute('aria-label', lot.name)
  cleanup()
})

it('recreates sources after style changes and waits for loaded source features', () => {
  const state = setup([point({ lotId: 1 })])
  state.map.isSourceLoaded.mockReturnValue(false)
  const cleanup = state.mount()
  expect(created).toHaveLength(0)
  state.map.isSourceLoaded.mockReturnValue(true)
  state.emit('sourcedata', { sourceId: 'another-source' })
  expect(created).toHaveLength(0)
  state.emit('sourcedata', { sourceId: 'parking-search-clusters' })
  expect(created).toHaveLength(1)
  state.removeStyle()
  state.emit('style.load')
  expect(state.map.addSource).toHaveBeenCalledTimes(2)
  cleanup()
})

it('does not move the map for an expansion completed after disposal', async () => {
  const state = setup([point({ cluster_id: 17, point_count: 3 })])
  let complete!: (zoom: number) => void
  state.source.getClusterExpansionZoom.mockReturnValue(new Promise<number>(resolve => { complete = resolve }))
  const cleanup = state.mount()
  fireEvent.click(created[0].element)
  cleanup()
  complete(15)
  await Promise.resolve()
  expect(state.map.flyTo).not.toHaveBeenCalled()
})

it('flushes final visible features on idle after tile loading finishes', () => {
  const state = setup([point({ lotId: 1 })])
  state.map.isSourceLoaded.mockReturnValue(false)
  const cleanup = state.mount()
  expect(created).toHaveLength(0)
  state.map.isSourceLoaded.mockReturnValue(true)
  state.emit('idle')
  expect(created).toHaveLength(1)
  cleanup()
})

it('offers a retry after an expansion error rather than an unhandled rejection', async () => {
  const state = setup([point({ cluster_id: 17, point_count: 3 })])
  state.source.getClusterExpansionZoom.mockRejectedValueOnce(new Error('Cluster changed'))
  const cleanup = state.mount()
  fireEvent.click(created[0].element)
  await waitFor(() => expect(created[0].element).toHaveTextContent('Thử lại'))
  fireEvent.click(created[0].element)
  await waitFor(() => expect(state.map.flyTo).toHaveBeenCalledTimes(1))
  cleanup()
})
