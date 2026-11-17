// Pure map primitives & Google Maps URL helpers (zero paid API / SDK dependency)
export {
  formatCoordinate,
  fromLatLng,
  isValidCoordinates,
  roundCoordinate,
  toLatLngLiteral,
  toLatLngTuple,
  type Coordinates,
  type LatLngLike,
  type LatLngLiteral,
  type LatLngTuple,
} from './coordinates'

export {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsSearchUrl,
  type GoogleMapsDirectionsUrlParams,
  type GoogleMapsSearchUrlParams,
  type GoogleMapsTravelMode,
} from './urls'

export {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  DEFAULT_PHOTON_URL,
  DEFAULT_TILE_ATTRIBUTION,
  DEFAULT_TILE_MAX_ZOOM,
  DEFAULT_TILE_URL,
  getMapRuntimeConfig,
  loadMapRuntimeConfig,
  resetMapRuntimeConfigForTests,
  setMapRuntimeConfigOverrideForTests,
  validateMapRuntimeConfig,
  type MapRuntimeConfig,
  type PartialMapRuntimeConfig,
} from './runtimeConfig'

export {
  extractAndValidateGoogleShareEmbedUrl,
  type GoogleShareEmbedValidationResult,
} from './shareEmbed'

export { LeafletMapView, type LeafletMapViewProps } from './LeafletMapView'
