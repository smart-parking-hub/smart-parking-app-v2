import { apiClient } from '@/shared/api/client'
import {
  adaptSpringPage,
  toSpringPageParams,
  type SpringPage,
} from '@/shared/api/adapters'
import {
  mapNotificationDto,
  type BackendNotificationDto,
  type NotificationPage,
} from '@/entities/notification'

const API_BASE = '/api/v1/notifications'

export const DEFAULT_NOTIFICATION_PAGE_SIZE = 20

export async function fetchNotificationsPageApi(params?: {
  page?: number
  size?: number
}): Promise<NotificationPage> {
  const safePage = Math.max(1, params?.page ?? 1)
  const safeSize = Math.max(1, params?.size ?? DEFAULT_NOTIFICATION_PAGE_SIZE)

  const res = await apiClient.get(API_BASE, {
    params: toSpringPageParams(safePage, safeSize),
  })

  const payload = (res.data?.data ?? res.data) as
    | SpringPage<BackendNotificationDto>
    | BackendNotificationDto[]
    | { data?: SpringPage<BackendNotificationDto>; number?: number }
    | null
    | undefined

  const adapted = adaptSpringPage<BackendNotificationDto>(payload, safeSize)
  const rawRecord =
    payload && typeof payload === 'object' && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : null
  const resolvedPage =
    rawRecord && typeof rawRecord.number === 'number'
      ? Math.max(1, rawRecord.number + 1)
      : safePage

  return {
    ...adapted,
    currentPage: resolvedPage,
    pageSize: safeSize,
    content: adapted.content.map(mapNotificationDto),
  }
}

export async function fetchUnreadCountApi(): Promise<number> {
  const res = await apiClient.get(`${API_BASE}/unread-count`)
  const raw = res.data?.data ?? res.data
  const parsed = typeof raw === 'number' ? raw : Number(raw ?? 0)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export async function markAsReadApi(id: number): Promise<void> {
  await apiClient.post(`${API_BASE}/${id}/read`)
}

export async function markAllAsReadApi(): Promise<void> {
  await apiClient.post(`${API_BASE}/read-all`)
}
