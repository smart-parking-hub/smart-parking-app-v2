import { getData, sendData, type Page } from '@/shared/api/resources'
import type { AdminUser } from '../types/adminUsersTypes'

export const ADMIN_USERS_QUERY_KEY = ['admin', 'users'] as const

export interface FetchAdminUsersParams {
  page?: number
  size?: number
}

export async function fetchAdminUsers(
  params: FetchAdminUsersParams = {},
  signal?: AbortSignal,
): Promise<Page<AdminUser>> {
  const { page = 0, size = 50 } = params
  return getData<Page<AdminUser>>(
    '/api/v1/admin/users',
    { page, size },
    { signal },
  )
}

export async function banAdminUser(
  userId: number,
  reason?: string,
): Promise<void> {
  return sendData<void>('put', `/api/v1/admin/users/${userId}/ban`, {
    reason,
  })
}

export async function unbanAdminUser(
  userId: number,
  reason?: string,
): Promise<void> {
  return sendData<void>('put', `/api/v1/admin/users/${userId}/unban`, {
    reason,
  })
}
