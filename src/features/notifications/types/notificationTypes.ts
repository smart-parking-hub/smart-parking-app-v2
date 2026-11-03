export type NotificationType = 'BOOKING' | 'PAYMENT' | 'QUEUE' | 'SYSTEM'

export type NotificationStatusFilter = 'all' | 'unread' | 'urgent'

export type NotificationCategoryFilter =
  | 'all'
  | 'queue'
  | 'gate'
  | 'payment'
  | 'route'

export interface NotificationItemDto {
  id: number
  userId?: number
  title: string
  content: string
  channel?: string
  type: NotificationType
  category: 'queue' | 'gate' | 'payment' | 'route'
  targetType?: string
  targetId?: number
  readAt: string | null
  createdAt: string
  isUrgent?: boolean
  priorityBadgeText?: string
  timeLabel: string
  expiresInSeconds?: number
  expiresInText?: string
  actionLabel?: string
  actionPath?: string
  actionIcon?: 'arrow_forward' | 'qr_code_2' | 'download'
  secondaryActionLabel?: string
  secondaryActionPath?: string
  secondaryActionIcon?: 'navigation'
  metaInfo?: string
  statusBadgeText?: string
}

export interface DriverNotificationStats {
  totalCount: number
  unreadCount: number
  urgentCount: number
  barieCheckinsToday: number
  queueSavedMinutes: number
  onTimeRatePercent: number
}

export interface DriverNotificationChannelsConfig {
  webPushSound: boolean
  smsEmergency: boolean
  zaloOaDispatch: boolean
}
