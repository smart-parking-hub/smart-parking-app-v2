import { isValidCoordinates, type Coordinates } from './coordinates'

export type GoogleMapsTravelMode = 'driving' | 'walking' | 'bicycling' | 'transit'

export interface GoogleMapsSearchUrlParams {
  coordinates?: Partial<Coordinates> | null
  query?: string | null
}

export interface GoogleMapsDirectionsUrlParams {
  destination?: Partial<Coordinates> | null
  destinationAddress?: string | null
  origin?: Partial<Coordinates> | null
  travelMode?: GoogleMapsTravelMode
}

/**
 * Builds an official Google Maps Search URL (api=1).
 * Prefers validated coordinates, falling back to a UTF-8 encoded text query.
 */
export function buildGoogleMapsSearchUrl(
  params: GoogleMapsSearchUrlParams,
): string | null {
  if (isValidCoordinates(params.coordinates)) {
    const query = `${params.coordinates.latitude},${params.coordinates.longitude}`
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  }

  const trimmedQuery = params.query?.trim()
  if (trimmedQuery) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmedQuery)}`
  }

  return null
}

/**
 * Builds an official Google Maps Directions URL (api=1).
 * Prefers validated destination coordinates, falling back to an encoded address.
 */
export function buildGoogleMapsDirectionsUrl(
  params: GoogleMapsDirectionsUrlParams,
): string | null {
  const destinationValue = isValidCoordinates(params.destination)
    ? `${params.destination.latitude},${params.destination.longitude}`
    : params.destinationAddress?.trim() || null

  if (!destinationValue) {
    return null
  }

  const searchParams = new URLSearchParams({
    api: '1',
    destination: destinationValue,
    travelmode: params.travelMode ?? 'driving',
  })

  if (isValidCoordinates(params.origin)) {
    searchParams.set('origin', `${params.origin.latitude},${params.origin.longitude}`)
  }

  return `https://www.google.com/maps/dir/?${searchParams.toString()}`
}
