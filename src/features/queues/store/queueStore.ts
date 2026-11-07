import { useSyncExternalStore } from 'react'
import type { QueueTab, QueueStatus } from '../types/queueTypes'

export interface QueueUIState {
  activeTab: QueueTab
  searchKeyword: string
  statusFilter: QueueStatus | 'ALL'
  isLeaveModalOpen: boolean
  isAcceptSuccessOpen: boolean
  isLeaving: boolean
  createdBooking: {
    bookingCode: string
    berthCode?: string
    parkingLotName: string
  }
  toastMessage: string | null
  toastType: 'success' | 'error' | 'info'
}

export interface QueueUIActions {
  setActiveTab: (tab: QueueTab) => void
  setSearchKeyword: (keyword: string) => void
  setStatusFilter: (status: QueueStatus | 'ALL') => void
  openLeaveModal: () => void
  closeLeaveModal: () => void
  openAcceptSuccessModal: () => void
  closeAcceptSuccessModal: () => void
  setCreatedBooking: (booking: {
    bookingCode: string
    berthCode?: string
    parkingLotName: string
  }) => void
  setIsLeaving: (isLeaving: boolean) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
  resetStore: () => void
}

export type QueueStore = QueueUIState & QueueUIActions

const initialState: QueueUIState = {
  activeTab: 'ACTIVE',
  searchKeyword: '',
  statusFilter: 'ALL',
  isLeaveModalOpen: false,
  isAcceptSuccessOpen: false,
  isLeaving: false,
  createdBooking: {
    bookingCode: 'BK-2026-9081',
    berthCode: 'Berth #B04',
    parkingLotName: 'Bãi Đỗ Xe Cảng Cát Lái - Phân khu Container 02',
  },
  toastMessage: null,
  toastType: 'info',
}

let state: QueueStore = {
  ...initialState,
  setActiveTab: (tab) => {
    state = { ...state, activeTab: tab }
    emitChange()
  },
  setSearchKeyword: (keyword) => {
    state = { ...state, searchKeyword: keyword }
    emitChange()
  },
  setStatusFilter: (status) => {
    state = { ...state, statusFilter: status }
    emitChange()
  },
  openLeaveModal: () => {
    state = { ...state, isLeaveModalOpen: true }
    emitChange()
  },
  closeLeaveModal: () => {
    state = { ...state, isLeaveModalOpen: false }
    emitChange()
  },
  openAcceptSuccessModal: () => {
    state = { ...state, isAcceptSuccessOpen: true }
    emitChange()
  },
  closeAcceptSuccessModal: () => {
    state = { ...state, isAcceptSuccessOpen: false }
    emitChange()
  },
  setCreatedBooking: (booking) => {
    state = { ...state, createdBooking: booking }
    emitChange()
  },
  setIsLeaving: (isLeaving) => {
    state = { ...state, isLeaving }
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

export function useQueueStore<T = QueueStore>(
  selector: (s: QueueStore) => T = (s) => s as unknown as T
): T {
  const current = useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange)
      return () => {
        listeners.delete(onStoreChange)
      }
    },
    () => state,
    () => state
  )
  return selector(current)
}

export function getQueueStoreSnapshot(): QueueStore {
  return state
}
