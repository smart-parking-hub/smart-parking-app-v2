import { Marker, type GeoJSONSource, type Map as LibreMap } from 'maplibre-gl'
import { createParkingMarkerElement } from '@/entities/parking-lot/parkingMapMarker'
import { isValidCoordinates, toLngLatTuple } from '@/shared/maps/coordinates'
import type { ParkingLotItem } from '../types/parkingSearchTypes'
import './parking-clusters.css'

const SOURCE = 'parking-search-clusters'
const LAYER = 'parking-search-cluster-points'

/** Native GeoJSON clustering with keyboard-accessible HTML markers. */
export function mountClusteredParkingMarkers(
  map: LibreMap,
  lots: ParkingLotItem[],
  onSelect: (lot: ParkingLotItem) => void,
): () => void {
  let disposed = false
  const validLots = lots.filter(isValidCoordinates)
  const byId = new Map(validLots.map(lot => [lot.id, lot]))
  const markers = new Map<string, Marker>()
  const data: GeoJSON.FeatureCollection<GeoJSON.Point> = {
    type: 'FeatureCollection',
    features: validLots.map(lot => ({
      type: 'Feature', properties: { lotId: lot.id },
      geometry: { type: 'Point', coordinates: toLngLatTuple(lot) },
    })),
  }

  function refresh() {
    if (disposed || !byId.size || !map.getSource(SOURCE) || !map.getLayer(LAYER) || !map.isSourceLoaded(SOURCE)) return
    const visible = new Set<string>()
    for (const feature of map.queryRenderedFeatures({ layers: [LAYER] })) {
      if (feature.geometry.type !== 'Point') continue
      const [lng, lat] = feature.geometry.coordinates
      const clusterId: unknown = feature.properties?.cluster_id
      const count: unknown = feature.properties?.point_count
      const lot = byId.get(Number(feature.properties?.lotId))
      const cluster = typeof clusterId === 'number' && typeof count === 'number' && count > 1
      if (!cluster && !lot) continue
      const key = cluster ? `cluster:${clusterId}:${count}:${lng}:${lat}` : `lot:${lot!.id}:${lng}:${lat}`
      // Adjacent visible tiles can return the same feature at a tile boundary.
      if (visible.has(key)) continue
      visible.add(key)
      if (markers.has(key)) continue

      const button = document.createElement('button')
      button.type = 'button'
      button.className = cluster ? 'parking-map-marker parking-map-cluster' : 'parking-map-marker parking-map-lot-point cursor-pointer'
      if (cluster) {
        button.textContent = String(count)
        button.title = `${count} bãi đỗ gần nhau. Phóng to để chọn bãi`
        button.setAttribute('aria-label', button.title)
        button.addEventListener('click', () => {
          const source = map.getSource(SOURCE) as GeoJSONSource | undefined
          if (!source || disposed) return
          void source.getClusterExpansionZoom(clusterId).then(zoom => {
            if (disposed || map.getSource(SOURCE) !== source) return
            map.flyTo({
              center: [lng, lat], zoom,
              duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500,
            })
          }).catch(() => {
            if (disposed || map.getSource(SOURCE) !== source) return
            button.textContent = 'Thử lại'
            button.title = `Chưa phóng to được nhóm ${count} bãi. Nhấn để thử lại.`
            button.setAttribute('aria-label', button.title)
            button.setAttribute('aria-live', 'polite')
          })
        })
      } else if (lot) {
        button.title = lot.name
        button.setAttribute('aria-label', lot.name)
        button.append(createParkingMarkerElement({ full: lot.isFull || lot.availableSlots === 0 }))
        button.addEventListener('click', () => onSelect(lot))
      }
      markers.set(key, new Marker({ element: button, anchor: cluster ? 'center' : 'bottom' })
        .setLngLat([lng, lat]).addTo(map))
    }
    for (const [key, marker] of markers) {
      if (!visible.has(key)) {
        marker.remove()
        markers.delete(key)
      }
    }
  }

  function install() {
    if (disposed) return
    const source = map.getSource(SOURCE) as GeoJSONSource | undefined
    if (source) source.setData(data)
    else map.addSource(SOURCE, { type: 'geojson', data, cluster: true, clusterRadius: 64, clusterMaxZoom: 18, maxzoom: 19 })
    if (!map.getLayer(LAYER)) {
      // A source-backed layer keeps the required tiles loaded for HTML marker queries.
      map.addLayer({ id: LAYER, type: 'circle', source: SOURCE,
        paint: { 'circle-radius': 2, 'circle-color': '#d95f00', 'circle-opacity': 0.3 } })
    }
    refresh()
  }
  const onSourceData = (event: { sourceId?: string }) => {
    if (event.sourceId === SOURCE) refresh()
  }
  map.on('style.load', install)
  map.on('render', refresh)
  map.on('idle', refresh)
  map.on('sourcedata', onSourceData)
  // A parsed style can accept sources while tiles are still loading.
  if (map.getStyle()) install()

  return () => {
    disposed = true
    map.off('style.load', install)
    map.off('render', refresh)
    map.off('idle', refresh)
    map.off('sourcedata', onSourceData)
    for (const marker of markers.values()) marker.remove()
    markers.clear()
    // The next render reuses and updates the source; map.remove owns final disposal.
  }
}
