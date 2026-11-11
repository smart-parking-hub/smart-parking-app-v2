import { NOTIFICATION_TYPE_META } from '@/entities/notification'
import type { NotificationViewModel } from '../types/notificationTypes'

interface NotificationRowItemProps {
  notification: NotificationViewModel
  onSelect: (notification: NotificationViewModel) => void
}

export function NotificationRowItem({
  notification,
  onSelect,
}: NotificationRowItemProps) {
  const { id, title, content, type, isUnread, timeLabel, createdAt } = notification
  const meta = NOTIFICATION_TYPE_META[type]

  return (
    <li
      data-row-id={id}
      data-row-type={type}
      data-row-status={isUnread ? 'unread' : 'read'}
    >
      <button
        type="button"
        onClick={() => onSelect(notification)}
        className={`w-full text-left flex flex-wrap sm:flex-nowrap items-center gap-x-4 sm:gap-x-5 gap-y-1.5 px-4 sm:px-6 py-4 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d95f00] ${
          isUnread
            ? 'bg-white hover:bg-slate-50/90'
            : 'bg-slate-50/70 hover:bg-slate-100/80'
        }`}
      >
        {/* Left: Unread dot + concise category label */}
        <span className="order-1 sm:w-44 md:w-48 shrink-0 inline-flex items-center gap-2.5 min-w-0">
          <span
            className={`h-2.5 w-2.5 rounded-full shrink-0 ${
              isUnread ? 'bg-[#d95f00]' : 'bg-transparent'
            }`}
            aria-hidden="true"
          />
          <span
            className={`truncate text-[15px] sm:text-base ${
              isUnread
                ? 'font-semibold text-slate-950'
                : 'font-medium text-slate-700'
            }`}
          >
            {meta.inboxLabel}
          </span>
          {isUnread && <span className="sr-only">(Chưa đọc)</span>}
        </span>

        {/* Right on mobile line 1 & desktop far-right: Timestamp */}
        <time
          dateTime={createdAt ?? undefined}
          className={`order-2 sm:order-3 ml-auto sm:ml-0 shrink-0 text-sm tabular-nums whitespace-nowrap ${
            isUnread ? 'font-semibold text-slate-900' : 'font-normal text-slate-600'
          }`}
        >
          {timeLabel}
        </time>

        {/* Center: Single-line Title - Content Preview */}
        <span className="order-3 sm:order-2 w-full sm:w-auto sm:flex-1 min-w-0 truncate text-[15px] sm:text-base leading-relaxed">
          <span
            className={
              isUnread ? 'font-semibold text-slate-950' : 'font-medium text-slate-900'
            }
          >
            {title}
          </span>
          {content && (
            <>
              <span className="text-slate-400 font-normal"> – </span>
              <span className="font-normal text-slate-600">{content}</span>
            </>
          )}
        </span>
      </button>
    </li>
  )
}
