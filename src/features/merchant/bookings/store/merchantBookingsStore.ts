import { useSyncExternalStore } from 'react'
import {
  DEFAULT_MERCHANT_BOOKINGS_PAGE_SIZE,
  type MerchantBookingStatusFilter,
  type MerchantBookingToastState,
} from '../types/merchantBookingsTypes'

export { DEFAULT_MERCHANT_BOOKINGS_PAGE_SIZE }

export interface MerchantBookingsUIState {
  page: number
  pageSize: number
  statusFilter: MerchantBookingStatusFilter
  parkingLotId: number | null
  searchKeyword: string
  selectedBookingId: number | null
  toast: MerchantBookingToastState | null
}

export interface MerchantBookingsUIActions {
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setStatusFilter: (status: MerchantBookingStatusFilter) => void
  setParkingLotId: (lotId: number | null) => void
  setSearchKeyword: (keyword: string) => void
  setSelectedBookingId: (id: number | null) => void
  resetFilters: () => void
  showToast: (
    title: string,
    variant?: MerchantBookingToastState['variant'],
    message?: string,
  ) => void
  clearToast: () => void
  resetStore: () => void
}

export type MerchantBookingsStore = MerchantBookingsUIState & MerchantBookingsUIActions

const initialState: MerchantBookingsUIState = {
  page: 0,
  pageSize: DEFAULT_MERCHANT_BOOKINGS_PAGE_SIZE,
  statusFilter: 'ALL',
  parkingLotId: null,
  searchKeyword: '',
  selectedBookingId: null,
  toast: null,
}

let nextToastId = 1

let state: MerchantBookingsStore = {
  ...initialState,
  setPage: (page) => {
    const safePage = Math.max(0, Math.floor(page))
    if (state.page === safePage) return
    state = { ...state, page: safePage, selectedBookingId: null }
    emitChange()
  },
  setPageSize: (size) => {
    const safeSize = Math.max(1, Math.floor(size))
    if (state.pageSize === safeSize) return
    state = { ...state, pageSize: safeSize, page: 0, selectedBookingId: null }
    emitChange()
  },
  setStatusFilter: (status) => {
    if (state.statusFilter === status) return
    state = { ...state, statusFilter: status, page: 0, selectedBookingId: null }
    emitChange()
  },
  setParkingLotId: (lotId) => {
    const normalized =
      typeof lotId === 'number' && Number.isFinite(lotId) && lotId > 0 ? lotId : null
    if (state.parkingLotId === normalized) return
    state = { ...state, parkingLotId: normalized, page: 0, selectedBookingId: null }
    emitChange()
  },
  setSearchKeyword: (keyword) => {
    if (state.searchKeyword === keyword) return
    state = { ...state, searchKeyword: keyword, page: 0, selectedBookingId: null }
    emitChange()
  },
  setSelectedBookingId: (id) => {
    if (state.selectedBookingId === id) return
    state = { ...state, selectedBookingId: id }
    emitChange()
  },
  resetFilters: () => {
    state = {
      ...state,
      page: 0,
      statusFilter: 'ALL',
      parkingLotId: null,
      searchKeyword: '',
      selectedBookingId: null,
    }
    emitChange()
  },
  showToast: (title, variant = 'info', message) => {
    state = {
      ...state,
      toast: {
        id: nextToastId++,
        title,
        message,
        variant,
      },
    }
    emitChange()
  },
  clearToast: () => {
    if (state.toast === null) return
    state = { ...state, toast: null }
    emitChange()
  },
  resetStore: () => {
    state = { ...state, ...initialState }
    emitChange()
  },
}

const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export function useMerchantBookingsStore<T = MerchantBookingsStore>(
  selector: (s: MerchantBookingsStore) => T = (s) => s as unknown as T,
): T {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange)
      return () => {
        listeners.delete(onStoreChange)
      }
    },
    () => selector(state),
    () => selector(state),
  )
}

export function getMerchantBookingsStoreSnapshot(): MerchantBookingsStore {
  return state
}
