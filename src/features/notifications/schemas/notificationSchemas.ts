import { z } from 'zod'

export const notificationStatusFilterValues = ['ALL', 'UNREAD'] as const
export const notificationTypeFilterValues = [
  'ALL',
  'BOOKING',
  'PAYMENT',
  'QUEUE',
  'SYSTEM',
] as const

export const notificationFilterSchema = z.object({
  statusFilter: z.enum(notificationStatusFilterValues),
  typeFilter: z.enum(notificationTypeFilterValues),
  searchKeyword: z
    .string()
    .trim()
    .max(100, 'Từ khóa tìm kiếm tối đa 100 ký tự'),
})

export type NotificationFilterFormData = z.infer<typeof notificationFilterSchema>
export type NotificationStatusFilter = NotificationFilterFormData['statusFilter']
export type NotificationTypeFilter = NotificationFilterFormData['typeFilter']
