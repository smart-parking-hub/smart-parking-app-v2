import { Bell, BellRing, CheckCheck, LoaderCircle } from 'lucide-react'
import { formatNotificationTime } from '@/entities/notification'
import { Button } from '@/shared/components/Button'
import { Skeleton } from '@/shared/components/Skeleton'
import type { AdminNotification } from '../api/adminNotifications'

export function AdminNotificationsSkeleton() {
  return <div role="status" aria-label="Đang tải thông báo" className="space-y-4">
    <span className="sr-only">Đang tải thông báo…</span>
    {[0, 1, 2].map(row => <Skeleton key={row} variant="card" />)}
  </div>
}

export function AdminNotificationFeed({ items, pending, pendingId, disabled, onRead }: {
  items: AdminNotification[]
  pending: boolean
  pendingId: number | undefined
  disabled: boolean
  onRead: (id: number) => void
}) {
  return <ul aria-label="Danh sách thông báo" className="admin-notification-feed">
    {items.map(item => {
      const unread = item.readAt == null
      const saving = pending && (pendingId === undefined || pendingId === item.id)
      return <li key={item.id}>
        <article className={`admin-notification-item${unread ? ' is-unread' : ''}`} aria-label={item.title}>
          <div className="admin-notification-icon" aria-hidden="true">
            {unread ? <BellRing size={20} /> : <Bell size={20} />}
          </div>
          <div className="admin-notification-copy">
            <div className="admin-notification-meta">
              <span className="admin-notification-status">
                {unread && <span className="admin-notification-dot" aria-hidden="true" />}
                {unread ? 'Chưa đọc' : 'Đã đọc'}
              </span>
              <span>{formatNotificationTime(item.createdAt)}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </div>
          <div className="admin-notification-action">
            {unread ? <Button
              variant="ghost"
              className="min-h-12"
              disabled={disabled || pending}
              aria-busy={saving}
              leftIcon={saving ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : <CheckCheck size={17} aria-hidden="true" />}
              aria-label={`Đánh dấu đã đọc: ${item.title}`}
              onClick={() => onRead(item.id)}
            >{saving ? 'Đang xử lý…' : 'Đánh dấu đã đọc'}</Button>
              : <span className="admin-notification-read"><CheckCheck size={17} aria-hidden="true" />Đã đọc</span>}
          </div>
        </article>
      </li>
    })}
  </ul>
}
