// Pure map primitives & Google Maps URL helpers (zero SDK dependency)
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

// Temporary Google SDK re-exports kept only until P3 finishes removing Google SDK callers
export {
  DEMO_GOOGLE_MAPS_MAP_ID,
  GOOGLE_MAPS_COUNTRY_CODES,
  GOOGLE_MAPS_LANGUAGE,
  GOOGLE_MAPS_REGION,
  GoogleMapsError,
  getGoogleMapsConfig,
  isGoogleMapsConfigured,
  type GoogleMapsErrorCode,
  type GoogleMapsRuntimeConfig,
} from './config'

export {
  hasGoogleMapsAuthFailed,
  loadGoogleMapsCore,
  loadGoogleMapsLibrary,
  resetGoogleMapsLoaderForTests,
  subscribeGoogleMapsAuthFailure,
  type GoogleMapsLibraryName,
} from './loader'

export { GoogleMapView, type GoogleMapViewProps } from './GoogleMapView'
