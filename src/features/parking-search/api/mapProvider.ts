import {
  DEFAULT_MAP_CENTER,
  GOOGLE_MAPS_COUNTRY_CODES,
  GOOGLE_MAPS_LANGUAGE,
  GOOGLE_MAPS_REGION,
  GoogleMapsError,
  fromLatLng,
  isValidCoordinates,
  loadGoogleMapsLibrary,
  toLatLngLiteral,
  type Coordinates,
} from '@/shared/maps'

export type { Coordinates }
export const validCoordinates = isValidCoordinates

export interface Place extends Coordinates {
  id: string
  label: string
  placeId?: string
}

export interface PlaceSuggestion {
  id: string
  placeId: string
  label: string
  mainText?: string
  secondaryText?: string
  resolvePlace: () => Promise<Place>
}

export interface DrivingRoute {
  points: Coordinates[]
  distanceKm: number
  durationMinutes: number
}

export interface PlacesAutocompleteSession {
  suggest: (query: string) => Promise<PlaceSuggestion[]>
  resolveSuggestion: (suggestion: PlaceSuggestion) => Promise<Place>
  reset: () => void
}

function createAbortError(): Error {
  if (typeof DOMException !== 'undefined') {
    return new DOMException('The operation was aborted.', 'AbortError')
  }
  const error = new Error('The operation was aborted.')
  error.name = 'AbortError'
  return error
}

function toGoogleMapsError(
  error: unknown,
  code: 'PLACES_ERROR' | 'ROUTES_ERROR',
  fallbackMessage: string,
): GoogleMapsError {
  if (error instanceof GoogleMapsError) {
    return error
  }
  return new GoogleMapsError(code, fallbackMessage, error)
}

/**
 * Creates a session-scoped Google Places Autocomplete (New) controller.
 * Each typing session reuses a single AutocompleteSessionToken and concludes it
 * when the user selects a suggestion (calling toPlace().fetchFields()).
 * Predictions are never cached across sessions.
 */
export function createPlacesAutocompleteSession(): PlacesAutocompleteSession {
  let activeToken: google.maps.places.AutocompleteSessionToken | null = null

  const ensureToken = (
    placesLib: google.maps.PlacesLibrary,
  ): google.maps.places.AutocompleteSessionToken => {
    if (!activeToken) {
      activeToken = new placesLib.AutocompleteSessionToken()
    }
    return activeToken
  }

  const reset = () => {
    activeToken = null
  }

  const suggest = async (query: string): Promise<PlaceSuggestion[]> => {
    const trimmed = query.trim()
    if (trimmed.length < 2) return []

    const placesLib = await loadGoogleMapsLibrary('places')
    const sessionToken = ensureToken(placesLib)

    try {
      const response =
        await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: trimmed,
          includedRegionCodes: [...GOOGLE_MAPS_COUNTRY_CODES],
          language: GOOGLE_MAPS_LANGUAGE,
          region: GOOGLE_MAPS_REGION,
          locationBias: {
            center: toLatLngLiteral(DEFAULT_MAP_CENTER),
            radius: 50000,
          },
          sessionToken,
        })

      const rawSuggestions = Array.isArray(response?.suggestions)
        ? response.suggestions
        : []

      const results: PlaceSuggestion[] = []
      const seenPlaceIds = new Set<string>()

      for (const item of rawSuggestions) {
        const prediction = item.placePrediction
        if (!prediction) continue

        const placeId = prediction.placeId
        const label = prediction.text?.text?.trim() ?? ''
        if (!placeId || !label || seenPlaceIds.has(placeId)) continue
        seenPlaceIds.add(placeId)

        results.push({
          id: placeId,
          placeId,
          label,
          mainText: prediction.mainText?.text?.trim() || undefined,
          secondaryText: prediction.secondaryText?.text?.trim() || undefined,
          resolvePlace: async () => {
            try {
              const place = prediction.toPlace()
              await place.fetchFields({
                fields: ['location', 'formattedAddress', 'displayName'],
              })

              if (!place.location) {
                throw new GoogleMapsError(
                  'PLACES_ERROR',
                  'Địa điểm này chưa có tọa độ trên Google Maps.',
                )
              }

              const coords = fromLatLng(place.location)
              if (!isValidCoordinates(coords)) {
                throw new GoogleMapsError(
                  'INVALID_COORDINATES',
                  'Tọa độ địa điểm trả về từ Google Maps không hợp lệ.',
                )
              }

              const resolvedLabel =
                place.formattedAddress?.trim() ||
                place.displayName?.trim() ||
                label

              return {
                id: placeId,
                placeId,
                label: resolvedLabel,
                latitude: coords.latitude,
                longitude: coords.longitude,
              }
            } catch (error) {
              throw toGoogleMapsError(
                error,
                'PLACES_ERROR',
                'Không lấy được tọa độ chi tiết của địa điểm đã chọn.',
              )
            }
          },
        })

        if (results.length >= 5) break
      }

      return results
    } catch (error) {
      throw toGoogleMapsError(
        error,
        'PLACES_ERROR',
        'Chưa tải được gợi ý địa điểm từ Google Places. Vui lòng thử lại.',
      )
    }
  }

  const resolveSuggestion = async (
    suggestion: PlaceSuggestion,
  ): Promise<Place> => {
    try {
      return await suggestion.resolvePlace()
    } finally {
      // Conclude the Places session after Place Details fetchFields().
      reset()
    }
  }

  return {
    suggest,
    resolveSuggestion,
    reset,
  }
}

export async function autocompleteLocations(
  query: string,
  signal?: AbortSignal,
  session?: PlacesAutocompleteSession,
): Promise<PlaceSuggestion[]> {
  if (signal?.aborted) {
    throw createAbortError()
  }
  const activeSession = session ?? createPlacesAutocompleteSession()
  const suggestions = await activeSession.suggest(query)
  if (signal?.aborted) {
    throw createAbortError()
  }
  return suggestions
}

export async function getDrivingRoute(
  origin: Coordinates,
  destination: Coordinates,
  signal?: AbortSignal,
): Promise<DrivingRoute> {
  if (!isValidCoordinates(origin) || !isValidCoordinates(destination)) {
    throw new GoogleMapsError(
      'INVALID_COORDINATES',
      'Tọa độ tuyến đường chưa hợp lệ.',
    )
  }

  if (signal?.aborted) {
    throw createAbortError()
  }

  const routesLib = await loadGoogleMapsLibrary('routes')

  if (signal?.aborted) {
    throw createAbortError()
  }

  let response: Awaited<ReturnType<typeof routesLib.Route.computeRoutes>>
  try {
    response = await routesLib.Route.computeRoutes({
      origin: toLatLngLiteral(origin),
      destination: toLatLngLiteral(destination),
      travelMode: 'DRIVING',
      fields: ['durationMillis', 'distanceMeters', 'path'],
      language: GOOGLE_MAPS_LANGUAGE,
      region: GOOGLE_MAPS_REGION,
    })
  } catch (error) {
    throw toGoogleMapsError(
      error,
      'ROUTES_ERROR',
      'Dịch vụ chỉ đường Google Routes tạm thời không khả dụng.',
    )
  }

  if (signal?.aborted) {
    throw createAbortError()
  }

  const primaryRoute = response?.routes?.[0]
  const rawPath = primaryRoute?.path ?? []
  const distanceMeters = primaryRoute?.distanceMeters
  const durationMillis = primaryRoute?.durationMillis

  if (
    !primaryRoute ||
    rawPath.length === 0 ||
    typeof distanceMeters !== 'number' ||
    !Number.isFinite(distanceMeters)
  ) {
    throw new GoogleMapsError(
      'ROUTES_ERROR',
      'Chưa tìm thấy tuyến đường tới bãi.',
    )
  }

  const points = rawPath.map(fromLatLng).filter(isValidCoordinates)
  if (points.length === 0) {
    throw new GoogleMapsError(
      'ROUTES_ERROR',
      'Dữ liệu hình học tuyến đường không hợp lệ.',
    )
  }

  const durationMinutes =
    typeof durationMillis === 'number' && Number.isFinite(durationMillis)
      ? Math.max(1, Math.round(durationMillis / 60000))
      : 1

  return {
    points,
    distanceKm: distanceMeters / 1000,
    durationMinutes,
  }
}
