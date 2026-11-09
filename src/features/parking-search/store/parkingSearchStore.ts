import { useSyncExternalStore } from 'react'
import type {
  ParkingLotItem,
  SearchFilterState,
} from '../types/parkingSearchTypes'
import type { Coordinates, Place } from '../api/mapProvider'

export interface ParkingSearchState {
  filters: SearchFilterState
  selectedLotId: number | null
  quickBookLot: ParkingLotItem | null
  quickBookOpen: boolean
  searchText: string
  origin?: Coordinates
}

const initialFilters: SearchFilterState = {
  selectedVehicleId: 'cont40',
  vehicleType: 'CONTAINER',
  radiusKm: 15,
  sortBy: 'distance',
  includeFull: true,
  keyword: '',
}

const initialState: ParkingSearchState = {
  filters: initialFilters,
  selectedLotId: 1,
  quickBookLot: null,
  quickBookOpen: false,
  searchText: '',
  origin: undefined,
}

let state: ParkingSearchState = { ...initialState }
const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export const parkingSearchStore = {
  getState: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setFilters: (updated: Partial<SearchFilterState>) => {
    state = {
      ...state,
      filters: { ...state.filters, ...updated },
    }
    emitChange()
  },
  setSelectedLotId: (id: number | null) => {
    state = { ...state, selectedLotId: id }
    emitChange()
  },
  openQuickBook: (lot: ParkingLotItem) => {
    state = {
      ...state,
      selectedLotId: lot.id,
      quickBookLot: lot,
      quickBookOpen: true,
    }
    emitChange()
  },
  closeQuickBook: () => {
    state = { ...state, quickBookOpen: false }
    emitChange()
  },
  setSearchText: (text: string) => {
    state = { ...state, searchText: text }
    emitChange()
  },
  setOrigin: (point?: Coordinates) => {
    state = { ...state, origin: point }
    emitChange()
  },
  locateMe: (point: Coordinates) => {
    state = {
      ...state,
      origin: point,
      searchText: 'Vị trí hiện tại của tôi',
      filters: {
        ...state.filters,
        latitude: point.latitude,
        longitude: point.longitude,
        keyword: '',
      },
    }
    emitChange()
  },
  selectPlace: (place: Place) => {
    state = {
      ...state,
      origin: place,
      searchText: place.label,
      filters: {
        ...state.filters,
        latitude: place.latitude,
        longitude: place.longitude,
        keyword: '',
      },
    }
    emitChange()
  },
  clearLocation: () => {
    state = {
      ...state,
      origin: undefined,
      searchText: '',
      filters: {
        ...state.filters,
        latitude: undefined,
        longitude: undefined,
        keyword: '',
      },
    }
    emitChange()
  },
  resetFilters: () => {
    state = {
      ...state,
      filters: initialFilters,
      searchText: '',
      origin: undefined,
    }
    emitChange()
  },
}

export function useParkingSearchStore<T>(selector: (state: ParkingSearchState) => T): T {
  return useSyncExternalStore(
    parkingSearchStore.subscribe,
    () => selector(parkingSearchStore.getState()),
    () => selector(initialState),
  )
}

