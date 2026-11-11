import type { ClientPage } from '@/shared/api/adapters'

export type NotificationTypeEnum = 'BOOKING' | 'PAYMENT' | 'QUEUE' | 'SYSTEM'

export type NotificationChannel = 'IN_APP' | 'PUSH' | 'EMAIL' | 'SMS' | string

export type NotificationDateValue = string | number[] | null | undefined

export interface BackendNotificationDto {
  id: number
  userId?: number
  title: string
  content: string
  channel?: NotificationChannel | null
  type: NotificationTypeEnum | string
  targetType?: string | null
  targetId?: number | null
  readAt?: NotificationDateValue
  createdAt?: NotificationDateValue
  sentAt?: NotificationDateValue
  status?: string | null
}

export interface NotificationActionTarget {
  label: string
  path: string
  kind: 'booking' | 'queue' | 'payment' | 'parking' | 'dispute'
  state?: Record<string, unknown>
  targetType?: string | null
  targetId?: number | null
}

export interface NotificationViewModel {
  id: number
  userId?: number
  title: string
  content: string
  channel: string | null
  type: NotificationTypeEnum
  typeLabel: string
  targetType: string | null
  targetId: number | null
  readAt: string | null
  isUnread: boolean
  createdAt: string | null
  sentAt: string | null
  status: string | null
  timeLabel: string
  action: NotificationActionTarget | null
}

export type NotificationPage = ClientPage<NotificationViewModel>
