// Pure map primitives & Google Maps URL helpers (zero paid API / billing dependency)
export {
  createAccuracyCircleGeoJson,
  formatCoordinate,
  fromLatLng,
  isValidCoordinates,
  roundCoordinate,
  toLatLngLiteral,
  toLatLngTuple,
  toLngLatTuple,
  type Coordinates,
  type LatLngLike,
  type LatLngLiteral,
  type LatLngTuple,
  type LngLatTuple,
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
  DEFAULT_MAP_MAX_ZOOM,
  DEFAULT_MAP_STYLE_URL,
  DEFAULT_MAP_ZOOM,
  DEFAULT_PHOTON_URL,
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

export { MapLibreMapView, type MapLibreMapViewProps } from './MapLibreMapView'
