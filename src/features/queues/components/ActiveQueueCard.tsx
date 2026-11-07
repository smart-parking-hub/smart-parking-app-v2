import { useState, useEffect } from 'react'
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Navigation,
  Trash2,
  AlertCircle,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react'
import type { ActiveQueueItem } from '../types/queueTypes'
import { QueueTimelineFlow } from './QueueTimelineFlow'

interface ActiveQueueCardProps {
  item: ActiveQueueItem
  onLeave: () => void
  onAccept: () => void
  onDecline: () => void
  onToggleStatusDemo?: () => void
}

export function ActiveQueueCard({
  item,
  onLeave,
  onAccept,
  onDecline,
  onToggleStatusDemo,
}: ActiveQueueCardProps) {
  // Progressive disclosure state: hide secondary technical info by default
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)

  // 15-minute countdown timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    return item.holdSecondsRemaining ?? (item.status === 'NOTIFIED' ? 540 : 0)
  })

  useEffect(() => {
    if (item.status !== 'NOTIFIED') return

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [item.status])

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isNotified = item.status === 'NOTIFIED'
  const isUrgent = isNotified && secondsRemaining < 180 // under 3 minutes
  const totalDuration = item.totalDurationSeconds ?? 900
  const progressPercent = Math.max(
    0,
    Math.min(100, (secondsRemaining / totalDuration) * 100)
  )

  return (
    <article
      data-testid="active-queue-card"
      className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-sm ${
        isNotified
          ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-emerald-500/5'
          : 'border-slate-200'
      }`}
    >
      {/* ── TOP HERO BANNER ── */}
      {isNotified ? (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 md:p-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 shrink-0">
                <Sparkles className="w-6 h-6 text-emerald-200 animate-pulse" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    Đã Có Slot Trống
                  </span>
                  <span className="text-xs text-emerald-100 font-mono">
                    {item.queueCode}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold font-sora tracking-tight mt-1">
                  Đã Đến Lượt Của Bạn!
                </h3>
                <p className="text-sm text-emerald-100 mt-0.5">
                  Bãi đỗ đã dành một slot phù hợp cho phương tiện của bạn. Vui lòng xác nhận nhận slot trước khi hết hạn giữ chỗ.
                </p>
              </div>
            </div>

            {/* Live Countdown Badge */}
            <div
              className={`backdrop-blur-md border rounded-2xl p-4 text-center min-w-[160px] transition-all ${
                isUrgent
                  ? 'bg-rose-950/40 border-rose-300/60 ring-2 ring-rose-400 animate-pulse'
                  : 'bg-black/25 border-white/20'
              }`}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200 block">
                {isUrgent ? '⚠️ Sắp hết hạn giữ chỗ' : 'Thời gian giữ slot'}
              </span>
              <div
                className={`text-2xl md:text-3xl font-mono font-bold tracking-tight my-1 ${
                  isUrgent ? 'text-rose-200' : 'text-white'
                }`}
              >
                {formatTimer(secondsRemaining)}
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isUrgent ? 'bg-rose-400' : 'bg-emerald-300'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 text-white p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-blue-400 font-sora">
                  #{item.position ?? 1}
                </span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  {/* Status Badge: Đang chờ vào chỗ (Theo đúng yêu cầu người dùng) */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    Đang chờ vào chỗ
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {item.queueCode}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold font-sora tracking-tight mt-1">
                  Vị trí trong hàng đợi: #{item.position ?? 1}
                </h3>
                <p className="text-sm text-slate-300 mt-0.5">
                  Phía trước bạn có {item.peopleAhead ?? 0} xe • Thời gian chờ ước tính ~{item.estimatedWaitMinutes ?? 10} phút
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 px-5 text-center">
              <span className="text-[11px] font-medium text-slate-400 block uppercase">
                Tốc độ giải phóng bãi
              </span>
              <span className="text-base font-bold text-white block mt-0.5">
                {item.checkOutSpeedText ?? '~4.2 phút / 1 xe'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── CARD BODY ── */}
      <div className="p-5 md:p-7 space-y-6">
        {/* Glanceable Metrics (3 chỉ số chính đập vào mắt) */}
        {!isNotified && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="text-center p-2 border-b sm:border-b-0 sm:border-r border-slate-200">
              <span className="text-xs font-medium text-slate-500 block uppercase">Vị trí của bạn</span>
              <span className="text-3xl font-extrabold font-sora text-blue-600 block mt-0.5">
                #{item.position ?? 1}
              </span>
            </div>

            <div className="text-center p-2 border-b sm:border-b-0 sm:border-r border-slate-200">
              <span className="text-xs font-medium text-slate-500 block uppercase">Xe phía trước</span>
              <span className="text-2xl font-bold font-sora text-slate-800 block mt-1">
                {item.peopleAhead ?? 0} xe
              </span>
              <span className="text-[11px] text-slate-500">{item.peopleAhead ?? 0} tài xế phía trước</span>
            </div>

            <div className="text-center p-2">
              <span className="text-xs font-medium text-slate-500 block uppercase">Ước tính có chỗ</span>
              <span className="text-2xl font-bold font-sora text-orange-600 block mt-1">
                ~{item.estimatedWaitMinutes ?? 15} phút
              </span>
              <span className="text-[11px] text-slate-500">Dựa trên tốc độ checkout</span>
            </div>
          </div>
        )}

        {/* Facility & Assigned Location */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
              BÃI ĐỖ XE
            </span>
            {item.vehiclePlate && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {item.vehiclePlate}
              </span>
            )}
            {item.priorityLabel && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {item.priorityLabel}
              </span>
            )}
            {item.berthCode && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                {item.berthCode}
              </span>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-bold font-sora text-slate-900">
            {item.parkingLotName}
          </h2>

          <div className="flex items-start gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{item.parkingLotAddress}</span>
          </div>
        </div>

        {/* Progressive Disclosure Toggle */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer select-none"
          >
            <Layers className="w-4 h-4 text-orange-500" />
            <span>
              {showTechnicalDetails
                ? 'Thu gọn chi tiết phương tiện & làn điều phối'
                : 'Xem chi tiết phương tiện & làn điều phối'}
            </span>
            {showTechnicalDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Collapsible Panel */}
          {showTechnicalDetails && (
            <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-medium block">Biển số đăng ký</span>
                  <strong className="text-sm font-mono text-slate-900 block mt-0.5">
                    {item.vehiclePlate}
                  </strong>
                  <span className="text-slate-500">{item.vehicleSpec}</span>
                </div>

                {item.gateName && (
                  <div>
                    <span className="text-slate-400 uppercase font-medium block">Cổng & Làn barie</span>
                    <strong className="text-sm text-slate-900 block mt-0.5">
                      {item.gateName}
                    </strong>
                    <span className="text-slate-500">Cổng kiểm soát tự động</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 uppercase font-medium block">Khoảng cách & ETA</span>
                  <strong className="text-sm text-slate-900 block mt-0.5">
                    {item.distanceKm} km (~{item.etaMinutes} phút)
                  </strong>
                  <span className="text-emerald-700 font-medium">Hợp lệ trong bán kính bãi</span>
                </div>
              </div>

              {/* ALPR Timeline inside details */}
              <div className="pt-3 border-t border-slate-200">
                <QueueTimelineFlow items={item.timelineFlow} status={item.status} />
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            {isNotified ? (
              <>
                <button
                  type="button"
                  onClick={onAccept}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/25 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Nhận Slot & Tạo Booking Ngay</span>
                </button>

                <button
                  type="button"
                  onClick={onDecline}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-slate-500" />
                  <span>Từ chối nhường lượt</span>
                </button>
              </>
            ) : (
              <>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(item.parkingLotAddress)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-orange-400" />
                  <span>Chỉ đường tới cổng bãi</span>
                </a>

                <button
                  type="button"
                  onClick={onLeave}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-sm transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Rời hàng đợi</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {onToggleStatusDemo && (
              <button
                type="button"
                onClick={onToggleStatusDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
                title="Mô phỏng đổi trạng thái giữa WAITING và NOTIFIED"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Mô phỏng: {isNotified ? 'Chuyển về Đang chờ' : 'Có slot ngay'}</span>
              </button>
            )}

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Đăng ký lúc: {item.registeredAtText}</span>
            </div>
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            Hệ thống sẽ gửi thông báo khẩn ngay khi bãi có xe xuất cổng giải phóng slot. Vui lòng duy trì mạng để không bỏ lỡ thông báo.
          </p>
        </div>
      </div>
    </article>
  )
}
