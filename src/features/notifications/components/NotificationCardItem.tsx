import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BellRing,
  Video,
  Receipt,
  AlertTriangle,
  Timer,
  ArrowRight,
  QrCode,
  Download,
  Navigation,
} from 'lucide-react'
import type { NotificationItemDto } from '../types/notificationTypes'

interface NotificationCardItemProps {
  notification: NotificationItemDto
  onMarkRead: (id: number) => void
  onClaimSlot?: (notification: NotificationItemDto) => void
}

export function NotificationCardItem({
  notification,
  onMarkRead,
  onClaimSlot,
}: NotificationCardItemProps) {
  const isUnread = notification.readAt === null
  const [remainingSeconds, setRemainingSeconds] = useState(
    notification.expiresInSeconds ?? 0
  )

  useEffect(() => {
    if (!notification.expiresInSeconds || notification.expiresInSeconds <= 0) return
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [notification.expiresInSeconds])

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const s = secs % 60
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const renderIcon = () => {
    switch (notification.category) {
      case 'queue':
        return <BellRing className="w-5 h-5 text-[#d95f00]" />
      case 'gate':
        return <Video className="w-5 h-5 text-slate-700" />
      case 'payment':
        return <Receipt className="w-5 h-5 text-slate-700" />
      case 'route':
        return <AlertTriangle className="w-5 h-5 text-[#d95f00]" />
      default:
        return <BellRing className="w-5 h-5 text-slate-700" />
    }
  }

  const handleCardClick = () => {
    if (isUnread) {
      onMarkRead(notification.id)
    }
  }

  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isUnread) onMarkRead(notification.id)
    // Create dummy text blob simulation
    const blob = new Blob([`HOA DON VAT - ${notification.title}\n${notification.content}`], {
      type: 'text/plain;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `HOA-DON-VAT-${notification.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <article
      onClick={handleCardClick}
      className={`relative flex flex-col gap-4 p-5 md:p-6 rounded-2xl border transition-all cursor-pointer shadow-xs ${
        notification.isUrgent
          ? 'bg-white border-[#d95f00]/40 overflow-hidden'
          : isUnread
          ? 'bg-white border-slate-200/90'
          : 'bg-slate-50/80 border-slate-200/60 opacity-90 hover:opacity-100'
      }`}
      data-row-category={notification.category}
      data-row-status={isUnread ? 'unread' : 'read'}
      data-urgent={notification.isUrgent ? 'true' : 'false'}
    >
      {/* Urgent vertical accent bar */}
      {notification.isUrgent && (
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#d95f00]" />
      )}

      {/* Top Header: Badge, category icon, pulse dot & Timestamp */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          {notification.isUrgent && (
            <span className="w-2.5 h-2.5 bg-[#d95f00] rounded-full animate-ping" />
          )}

          <div
            className={`p-2 rounded-xl flex items-center justify-center ${
              notification.isUrgent
                ? 'bg-[#ffeedd]'
                : 'bg-slate-100'
            }`}
          >
            {renderIcon()}
          </div>

          <span
            className={`font-mono text-xs uppercase px-2.5 py-1 rounded font-bold ${
              notification.isUrgent
                ? 'bg-[#ffeedd] text-[#d95f00]'
                : 'bg-slate-100 text-slate-800'
            }`}
          >
            {notification.priorityBadgeText}
          </span>

          {isUnread && (
            <span
              className="w-2 h-2 rounded-full bg-[#d95f00] shrink-0"
              title="Thông báo chưa đọc"
            />
          )}
        </div>

        <span
          className={`font-mono text-xs px-2.5 py-1 rounded font-bold shrink-0 ${
            notification.isUrgent
              ? 'bg-[#ffeedd] text-[#d95f00]'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {notification.timeLabel}
        </span>
      </div>

      {/* Content Body */}
      <div className="flex flex-col gap-1.5 pl-0.5">
        <h2 className="text-base md:text-lg font-bold font-sora text-slate-900 tracking-tight">
          {notification.title}
        </h2>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          {notification.content}
        </p>
      </div>

      {/* Bottom Bar: Timers, Action Buttons or Meta Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
        {/* Left side: Countdown timer or Meta tags */}
        {remainingSeconds > 0 ? (
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#d95f00]" />
            <span
              data-testid="countdown-timer"
              className="font-mono text-xs text-[#d95f00] font-bold"
            >
              HẾT HẠN TRONG: {formatCountdown(remainingSeconds)}
            </span>
          </div>
        ) : notification.metaInfo ? (
          <span className="font-mono text-xs text-slate-500 font-semibold">
            {notification.metaInfo}
          </span>
        ) : (
          <div />
        )}

        {/* Right side: Actions or status */}
        <div className="flex flex-wrap items-center gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
          {notification.actionLabel && (
            notification.actionPath === '#download-vat' ? (
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="h-9 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>{notification.actionLabel}</span>
              </button>
            ) : notification.isUrgent && notification.category === 'queue' ? (
              <button
                type="button"
                onClick={() => {
                  if (isUnread) onMarkRead(notification.id)
                  if (onClaimSlot) onClaimSlot(notification)
                }}
                className="h-9 px-4 rounded-xl bg-[#d95f00] hover:bg-[#ea580c] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>{notification.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                to={notification.actionPath || '/bookings'}
                onClick={() => {
                  if (isUnread) onMarkRead(notification.id)
                }}
                className="h-9 px-3.5 rounded-xl bg-[#131b2e] hover:bg-[#233144] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {notification.actionIcon === 'qr_code_2' ? (
                  <QrCode className="w-3.5 h-3.5 text-slate-300" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                )}
                <span>{notification.actionLabel}</span>
              </Link>
            )
          )}

          {notification.secondaryActionLabel && (
            <Link
              to={notification.secondaryActionPath || '/parking'}
              onClick={() => {
                if (isUnread) onMarkRead(notification.id)
              }}
              className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer"
            >
              {notification.secondaryActionIcon === 'navigation' && (
                <Navigation className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>{notification.secondaryActionLabel}</span>
            </Link>
          )}

          {notification.statusBadgeText && !notification.actionLabel && (
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold">
              {notification.statusBadgeText}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
