import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock } from 'lucide-react'
import { NotificationTypeBadge } from '@/entities/notification'
import { Badge } from '@/shared/components/Badge'
import { Button } from '@/shared/components/Button'
import { Modal } from '@/shared/components/Modal'
import type { NotificationViewModel } from '../types/notificationTypes'

interface NotificationDetailModalProps {
  notification: NotificationViewModel | null
  isOpen: boolean
  onClose: () => void
  onMarkRead: (id: number) => void
  isMarkingRead?: boolean
}

export function NotificationDetailModal({
  notification,
  isOpen,
  onClose,
  onMarkRead,
  isMarkingRead = false,
}: NotificationDetailModalProps) {
  return (
    <Modal isOpen={isOpen && Boolean(notification)} onClose={onClose} maxWidth="lg">
      {notification && (
        <div className="space-y-5">
          {/* Meta Strip */}
          <div className="flex flex-wrap items-center gap-2 pr-10">
            <NotificationTypeBadge
              type={notification.type}
              isUnread={notification.isUnread}
              size="md"
            />
            {notification.isUnread ? (
              <Badge variant="orange" size="md">
                Chưa đọc
              </Badge>
            ) : (
              <Badge variant="neutral" size="md">
                Đã đọc
              </Badge>
            )}
            {notification.channel && (
              <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs sm:text-sm font-medium text-slate-600">
                {notification.channel}
              </span>
            )}
          </div>

          {/* Title & Timestamp */}
          <div className="space-y-2">
            <h2 className="font-sora text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {notification.title}
            </h2>
            <p className="inline-flex items-center gap-1.5 text-sm text-slate-600 tabular-nums">
              <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
              <time dateTime={notification.createdAt ?? undefined}>
                {notification.timeLabel}
              </time>
            </p>
          </div>

          {/* Full Content */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 text-base leading-relaxed text-slate-800 whitespace-pre-line">
            {notification.content || 'Không có nội dung chi tiết.'}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="text-sm text-slate-500 tabular-nums font-mono">
              {notification.targetId !== null && (
                <span>Mã đối tượng #{notification.targetId}</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 ml-auto">
              {notification.isUnread && (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  isLoading={isMarkingRead}
                  disabled={isMarkingRead}
                  onClick={() => onMarkRead(notification.id)}
                  leftIcon={<Check className="h-4 w-4" aria-hidden="true" />}
                >
                  Đánh dấu đã đọc
                </Button>
              )}

              {notification.action && (
                <Link
                  to={notification.action.path}
                  state={notification.action.state}
                  onClick={onClose}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2"
                >
                  <span>{notification.action.label}</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              )}

              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
