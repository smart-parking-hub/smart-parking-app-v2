import { useSyncExternalStore } from 'react'
import type {
  AdminUser,
  RoleFilter,
  StatusFilter,
} from '../types/adminUsersTypes'

export interface BanModalTarget {
  user: AdminUser
  action: 'ban' | 'unban'
}

export interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
}

export interface AdminUsersUIState {
  keyword: string
  roleFilter: RoleFilter
  statusFilter: StatusFilter
  page: number
  pageSize: number
  banModalTarget: BanModalTarget | null
  toast: ToastState | null
}

export interface AdminUsersUIActions {
  setKeyword: (keyword: string) => void
  setRoleFilter: (role: RoleFilter) => void
  setStatusFilter: (status: StatusFilter) => void
  setPage: (page: number) => void
  resetFilters: () => void
  openBanModal: (user: AdminUser, action: 'ban' | 'unban') => void
  closeBanModal: () => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
  resetStore: () => void
}

export type AdminUsersStore = AdminUsersUIState & AdminUsersUIActions

const initialState: AdminUsersUIState = {
  keyword: '',
  roleFilter: 'ALL',
  statusFilter: 'ALL',
  page: 0,
  pageSize: 10,
  banModalTarget: null,
  toast: null,
}

let state: AdminUsersStore = {
  ...initialState,
  setKeyword: (keyword) => {
    state = { ...state, keyword, page: 0 }
    emitChange()
  },
  setRoleFilter: (roleFilter) => {
    state = { ...state, roleFilter, page: 0 }
    emitChange()
  },
  setStatusFilter: (statusFilter) => {
    state = { ...state, statusFilter, page: 0 }
    emitChange()
  },
  setPage: (page) => {
    state = { ...state, page }
    emitChange()
  },
  resetFilters: () => {
    state = {
      ...state,
      keyword: '',
      roleFilter: 'ALL',
      statusFilter: 'ALL',
      page: 0,
    }
    emitChange()
  },
  openBanModal: (user, action) => {
    state = { ...state, banModalTarget: { user, action } }
    emitChange()
  },
  closeBanModal: () => {
    state = { ...state, banModalTarget: null }
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

export function useAdminUsersStore<T = AdminUsersStore>(
  selector: (s: AdminUsersStore) => T = (s) => s as unknown as T,
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

export function getAdminUsersStoreSnapshot(): AdminUsersStore {
  return state
}
