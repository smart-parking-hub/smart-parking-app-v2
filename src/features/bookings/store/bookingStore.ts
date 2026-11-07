import { useSyncExternalStore } from 'react'
import type { FilterStatusTab } from '../types/bookingTypes'

export interface BookingUIState {
  activeTab: FilterStatusTab
  searchKeyword: string
  selectedBookingId: number | null
  isCancelModalOpen: boolean
  isReviewModalOpen: boolean
  isPayOsModalOpen: boolean
  payOsType: 'DEPOSIT' | 'FINAL'
  toastMessage: string | null
  toastType: 'success' | 'error' | 'info'
}

export interface BookingUIActions {
  setActiveTab: (tab: FilterStatusTab) => void
  setSearchKeyword: (keyword: string) => void
  setSelectedBookingId: (id: number | null) => void
  openCancelModal: () => void
  closeCancelModal: () => void
  openReviewModal: () => void
  closeReviewModal: () => void
  openPayOsModal: (type: 'DEPOSIT' | 'FINAL') => void
  closePayOsModal: () => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
  resetStore: () => void
}

export type BookingStore = BookingUIState & BookingUIActions

const initialState: BookingUIState = {
  activeTab: 'ALL',
  searchKeyword: '',
  selectedBookingId: 1,
  isCancelModalOpen: false,
  isReviewModalOpen: false,
  isPayOsModalOpen: false,
  payOsType: 'FINAL',
  toastMessage: null,
  toastType: 'info',
}

let state: BookingStore = {
  ...initialState,
  setActiveTab: (tab) => {
    state = { ...state, activeTab: tab }
    emitChange()
  },
  setSearchKeyword: (keyword) => {
    state = { ...state, searchKeyword: keyword }
    emitChange()
  },
  setSelectedBookingId: (id) => {
    state = { ...state, selectedBookingId: id }
    emitChange()
  },
  openCancelModal: () => {
    state = { ...state, isCancelModalOpen: true }
    emitChange()
  },
  closeCancelModal: () => {
    state = { ...state, isCancelModalOpen: false }
    emitChange()
  },
  openReviewModal: () => {
    state = { ...state, isReviewModalOpen: true }
    emitChange()
  },
  closeReviewModal: () => {
    state = { ...state, isReviewModalOpen: false }
    emitChange()
  },
  openPayOsModal: (type) => {
    state = { ...state, isPayOsModalOpen: true, payOsType: type }
    emitChange()
  },
  closePayOsModal: () => {
    state = { ...state, isPayOsModalOpen: false }
    emitChange()
  },
  showToast: (message, type = 'info') => {
    state = { ...state, toastMessage: message, toastType: type }
    emitChange()
  },
  clearToast: () => {
    state = { ...state, toastMessage: null }
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

export function useBookingStore<T = BookingStore>(
  selector: (s: BookingStore) => T = (s) => s as unknown as T,
): T {
  const current = useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange)
      return () => {
        listeners.delete(onStoreChange)
      }
    },
    () => selector(state),
    () => selector(state),
  )
  return current
}

export function getBookingStoreSnapshot(): BookingStore {
  return state
}

