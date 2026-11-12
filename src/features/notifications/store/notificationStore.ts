import { useSyncExternalStore } from 'react'
import type {
  NotificationStatusFilter,
  NotificationToastState,
  NotificationTypeFilter,
} from '../types/notificationTypes'

export interface NotificationUIState {
  statusFilter: NotificationStatusFilter
  typeFilter: NotificationTypeFilter
  searchKeyword: string
  currentPage: number
  selectedNotificationId: number | null
  toast: NotificationToastState | null
}

export interface NotificationUIActions {
  setStatusFilter: (status: NotificationStatusFilter) => void
  setTypeFilter: (type: NotificationTypeFilter) => void
  setSearchKeyword: (keyword: string) => void
  setCurrentPage: (page: number) => void
  setSelectedNotificationId: (id: number | null) => void
  resetFilters: () => void
  showToast: (
    title: string,
    variant?: NotificationToastState['variant'],
    message?: string,
  ) => void
  clearToast: () => void
  resetStore: () => void
}

export type NotificationStore = NotificationUIState & NotificationUIActions

const initialState: NotificationUIState = {
  statusFilter: 'ALL',
  typeFilter: 'ALL',
  searchKeyword: '',
  currentPage: 1,
  selectedNotificationId: null,
  toast: null,
}

let nextToastId = 1

let state: NotificationStore = {
  ...initialState,
  setStatusFilter: (status) => {
    state = { ...state, statusFilter: status, currentPage: 1 }
    emitChange()
  },
  setTypeFilter: (type) => {
    state = { ...state, typeFilter: type, currentPage: 1 }
    emitChange()
  },
  setSearchKeyword: (keyword) => {
    if (state.searchKeyword === keyword) return
    state = { ...state, searchKeyword: keyword, currentPage: 1 }
    emitChange()
  },
  setCurrentPage: (page) => {
    state = {
      ...state,
      currentPage: Math.max(1, page),
      selectedNotificationId: null,
    }
    emitChange()
  },
  setSelectedNotificationId: (id) => {
    if (state.selectedNotificationId === id) return
    state = { ...state, selectedNotificationId: id }
    emitChange()
  },
  resetFilters: () => {
    state = {
      ...state,
      statusFilter: 'ALL',
      typeFilter: 'ALL',
      searchKeyword: '',
      currentPage: 1,
      selectedNotificationId: null,
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

export function useNotificationStore<T = NotificationStore>(
  selector: (s: NotificationStore) => T = (s) => s as unknown as T,
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

export function getNotificationStoreSnapshot(): NotificationStore {
  return state
}
