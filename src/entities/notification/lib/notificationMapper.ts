import type { BadgeProps } from '@/shared/components/Badge'
import type {
  BackendNotificationDto,
  NotificationActionTarget,
  NotificationDateValue,
  NotificationTypeEnum,
  NotificationViewModel,
} from '../types'

export const NOTIFICATION_TYPE_META: Record<
  NotificationTypeEnum,
  {
    label: string
    shortLabel: string
    inboxLabel: string
    badgeVariant: NonNullable<BadgeProps['variant']>
  }
> = {
  BOOKING: {
    label: 'Đặt chỗ & Barie',
    shortLabel: 'ĐẶT CHỖ',
    inboxLabel: 'Đặt chỗ',
    badgeVariant: 'primary',
  },
  PAYMENT: {
    label: 'Thanh toán & Cước',
    shortLabel: 'THANH TOÁN',
    inboxLabel: 'Thanh toán',
    badgeVariant: 'success',
  },
  QUEUE: {
    label: 'Hàng đợi ảo',
    shortLabel: 'HÀNG ĐỢI ẢO',
    inboxLabel: 'Hàng đợi ảo',
    badgeVariant: 'orange',
  },
  SYSTEM: {
    label: 'Hệ thống & Cảnh báo',
    shortLabel: 'HỆ THỐNG',
    inboxLabel: 'Hệ thống',
    badgeVariant: 'warning',
  },
}

const VALID_TYPES = new Set<NotificationTypeEnum>(['BOOKING', 'PAYMENT', 'QUEUE', 'SYSTEM'])

export function normalizeNotificationType(rawType?: string | null): NotificationTypeEnum {
  const normalized = rawType?.trim().toUpperCase()
  if (normalized && VALID_TYPES.has(normalized as NotificationTypeEnum)) {
    return normalized as NotificationTypeEnum
  }
  return 'SYSTEM'
}

export function parseNotificationDate(value?: NotificationDateValue): Date | null {
  if (value === null || value === undefined) return null

  if (Array.isArray(value)) {
    const [year, month = 1, day = 1, hour = 0, minute = 0, second = 0] = value
    if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') {
      return null
    }
    const parsed = new Date(year, month - 1, day, hour, minute, second)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const isoCandidate = trimmed.includes(' ') && !trimmed.includes('T')
      ? trimmed.replace(' ', 'T')
      : trimmed
    const parsed = new Date(isoCandidate)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
    const fallbackParsed = new Date(trimmed)
    return Number.isNaN(fallbackParsed.getTime()) ? null : fallbackParsed
  }

  return null
}

export function toIsoNotificationDate(value?: NotificationDateValue): string | null {
  if (value === null || value === undefined) return null
  const parsed = parseNotificationDate(value)
  if (parsed) {
    return parsed.toISOString()
  }
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }
  return null
}

const notificationTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function formatNotificationTime(value?: NotificationDateValue): string {
  const parsed = parseNotificationDate(value)
  if (!parsed) return '—'
  return notificationTimeFormatter.format(parsed)
}

export function resolveNotificationAction(
  targetType?: string | null,
  targetId?: number | null,
  type?: NotificationTypeEnum | string,
): NotificationActionTarget | null {
  const normalizedTarget = targetType?.trim().toUpperCase() ?? ''
  const normalizedType = normalizeNotificationType(type)
  const validTargetId = typeof targetId === 'number' && targetId > 0 ? targetId : null

  if (!normalizedTarget || !validTargetId) {
    return null
  }

  if (normalizedTarget === 'QUEUE') {
    return {
      label: 'Đến hàng đợi',
      path: '/queues',
      kind: 'queue',
      state: { targetQueueId: validTargetId },
      targetType: 'QUEUE',
      targetId: validTargetId,
    }
  }

  if (normalizedTarget === 'PARKING_LOT') {
    return {
      label: 'Xem bãi đỗ',
      path: `/parking/${validTargetId}`,
      kind: 'parking',
      targetType: 'PARKING_LOT',
      targetId: validTargetId,
    }
  }

  if (normalizedTarget === 'DISPUTE') {
    return {
      label: 'Xem khiếu nại',
      path: `/disputes/${validTargetId}`,
      kind: 'dispute',
      targetType: 'DISPUTE',
      targetId: validTargetId,
    }
  }

  if (
    normalizedTarget === 'PAYMENT' ||
    normalizedTarget === 'WITHDRAWAL' ||
    normalizedTarget === 'WALLET'
  ) {
    return {
      label: 'Xem lịch sử thanh toán',
      path: '/payments',
      kind: 'payment',
      targetType: normalizedTarget,
      targetId: validTargetId,
    }
  }

  if (normalizedTarget === 'BOOKING') {
    if (normalizedType === 'PAYMENT') {
      return {
        label: 'Xem lịch sử thanh toán',
        path: '/payments',
        kind: 'payment',
        targetType: 'BOOKING',
        targetId: validTargetId,
      }
    }
    if (normalizedType === 'BOOKING') {
      return {
        label: 'Xem đặt chỗ',
        path: '/bookings',
        kind: 'booking',
        state: { highlightBookingId: validTargetId },
        targetType: 'BOOKING',
        targetId: validTargetId,
      }
    }
    return null
  }

  return null
}

export function mapNotificationDto(dto: BackendNotificationDto): NotificationViewModel {
  const normalizedType = normalizeNotificationType(dto.type)
  const readAtIso = toIsoNotificationDate(dto.readAt)
  const createdAtIso = toIsoNotificationDate(dto.createdAt)
  const sentAtIso = toIsoNotificationDate(dto.sentAt)
  const meta = NOTIFICATION_TYPE_META[normalizedType]

  return {
    id: dto.id,
    userId: dto.userId,
    title: dto.title?.trim() || 'Thông báo vận hành',
    content: dto.content?.trim() || '',
    channel: dto.channel ?? null,
    type: normalizedType,
    typeLabel: meta.label,
    targetType: dto.targetType ?? null,
    targetId: typeof dto.targetId === 'number' ? dto.targetId : null,
    readAt: readAtIso,
    isUnread: readAtIso === null,
    createdAt: createdAtIso,
    sentAt: sentAtIso,
    status: dto.status ?? null,
    timeLabel: formatNotificationTime(dto.createdAt ?? dto.sentAt),
    action: resolveNotificationAction(dto.targetType, dto.targetId, normalizedType),
  }
}
