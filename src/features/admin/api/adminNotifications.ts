import type { BackendNotificationDto } from '@/entities/notification'
import { getData, sendData, type Page } from '@/shared/api/resources'

export type AdminNotification = Pick<
  BackendNotificationDto,
  'id' | 'title' | 'content' | 'readAt' | 'createdAt'
>

export const ADMIN_NOTIFICATION_PAGE_SIZE = 20
const endpoint = '/api/v1/notifications'

export function getAdminNotifications(page: number, signal: AbortSignal, sort = 'createdAt,desc') {
  return getData<Page<AdminNotification>>(
    endpoint,
    { page, size: ADMIN_NOTIFICATION_PAGE_SIZE, sort },
    { signal },
  )
}

export async function getAdminUnreadCount(signal: AbortSignal): Promise<number> {
  const count = await getData<unknown>(`${endpoint}/unread-count`, undefined, { signal })
  if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0) {
    throw new Error('Số thông báo chưa đọc không hợp lệ. Vui lòng thử lại.')
  }
  return count
}

export function readAdminNotification(id: number | undefined) {
  return sendData('put', `${endpoint}/${id === undefined ? 'read-all' : `${id}/read`}`)
}
