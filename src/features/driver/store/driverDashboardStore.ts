import { useSyncExternalStore } from 'react'

export interface DriverDashboardState {
  qrModalOpen: boolean
  searchQuery: string
  successToast: string | null
  setQrModalOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setSuccessToast: (msg: string | null) => void
  clearToast: () => void
}

let state: DriverDashboardState = {
  qrModalOpen: false,
  searchQuery: '',
  successToast: null,
  setQrModalOpen: (open: boolean) => {
    state = { ...state, qrModalOpen: open }
    emitChange()
  },
  setSearchQuery: (query: string) => {
    state = { ...state, searchQuery: query }
    emitChange()
  },
  setSuccessToast: (msg: string | null) => {
    state = { ...state, successToast: msg }
    emitChange()
  },
  clearToast: () => {
    state = { ...state, successToast: null }
    emitChange()
  },
}

const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export function useDriverDashboardStore<T = DriverDashboardState>(
  selector: (s: DriverDashboardState) => T = (s) => s as unknown as T,
): T {
  const current = useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange)
      return () => {
        listeners.delete(onStoreChange)
      }
    },
    () => state,
  )
  return selector(current)
}

