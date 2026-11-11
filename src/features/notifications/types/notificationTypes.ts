export type {
  NotificationTypeEnum,
  NotificationChannel,
  NotificationDateValue,
  BackendNotificationDto,
  NotificationActionTarget,
  NotificationViewModel,
  NotificationPage,
} from '@/entities/notification'

export type {
  NotificationStatusFilter,
  NotificationTypeFilter,
  NotificationFilterFormData,
} from '../schemas/notificationSchemas'

export type NotificationEmptyVariant = 'no-notifications' | 'all-read' | 'filtered'

export interface NotificationToastState {
  id: number
  title: string
  message?: string
  variant: 'success' | 'error' | 'warning' | 'info'
}
