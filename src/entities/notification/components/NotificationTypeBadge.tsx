import { Badge } from '@/shared/components/Badge'
import { NOTIFICATION_TYPE_META, normalizeNotificationType } from '../lib/notificationMapper'
import type { NotificationTypeEnum } from '../types'

interface NotificationTypeBadgeProps {
  type: NotificationTypeEnum | string
  isUnread?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function NotificationTypeBadge({
  type,
  isUnread = false,
  size = 'sm',
  className,
}: NotificationTypeBadgeProps) {
  const normalized = normalizeNotificationType(type)
  const meta = NOTIFICATION_TYPE_META[normalized]

  return (
    <Badge
      variant={meta.badgeVariant}
      size={size}
      dot={isUnread}
      className={className}
    >
      {meta.shortLabel}
    </Badge>
  )
}
