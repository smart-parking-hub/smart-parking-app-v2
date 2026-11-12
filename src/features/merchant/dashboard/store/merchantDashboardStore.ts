import { useSyncExternalStore } from 'react'

export type TimeRangeFilter = 'ALL' | 'TODAY' | 'WEEK' | 'MONTH'

export interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
}

export interface MerchantDashboardUIState {
  selectedLotId: number | null
  timeRange: TimeRangeFilter
  toast: ToastState | null
}

export interface MerchantDashboardUIActions {
  setSelectedLotId: (id: number | null) => void
  setTimeRange: (range: TimeRangeFilter) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
  resetStore: () => void
}

export type MerchantDashboardStore = MerchantDashboardUIState &
  MerchantDashboardUIActions

const initialState: MerchantDashboardUIState = {
  selectedLotId: null,
  timeRange: 'ALL',
  toast: null,
}

let state: MerchantDashboardStore = {
  ...initialState,
  setSelectedLotId: (id) => {
    state = { ...state, selectedLotId: id }
    emitChange()
  },
  setTimeRange: (range) => {
    state = { ...state, timeRange: range }
    emitChange()
  },
  showToast: (message, type = 'success') => {
    state = { ...state, toast: { message, type } }
    emitChange()
  },
  clearToast: () => {
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

export function useMerchantDashboardStore<T = MerchantDashboardStore>(
  selector: (s: MerchantDashboardStore) => T = (s) => s as unknown as T,
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

export function getMerchantDashboardStoreSnapshot(): MerchantDashboardStore {
  return state
}

