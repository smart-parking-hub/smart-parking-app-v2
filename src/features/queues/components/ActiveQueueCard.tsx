import { useState, useEffect } from 'react'
import {
  MapPin,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Navigation,
  Trash2,
  AlertCircle,
  Radio,
  Sparkles,
  Zap,
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
          ? 'border-emerald-300 ring-2 ring-emerald-500/20'
          : 'border-slate-200'
      }`}
    >
      {/* Dynamic Top Banner */}
      {isNotified ? (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 md:p-6">
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
                  Bãi đỗ đã phân bổ slot phù hợp cho đầu kéo container của bạn. Hãy bấm nhận slot để tạo đơn đặt chỗ.
                </p>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="bg-black/25 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[150px]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200 block">
                Cửa sổ giữ slot
              </span>
              <div className="text-2xl md:text-3xl font-mono font-bold tracking-tight text-white my-1">
                {formatTimer(secondsRemaining)}
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-300 h-full rounded-full transition-all duration-1000"
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
              <span className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 shrink-0">
                <Radio className="w-6 h-6 text-orange-400 animate-pulse" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                    Đang Xếp Hàng Chờ
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

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 px-5 text-center">
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

      {/* Main Content Body */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Facility & Location Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                ICD CONTAINER BÃI
              </span>
              {item.priorityLabel && (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {item.priorityLabel}
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

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
              {item.gateName && (
                <span className="font-medium text-slate-700">
                  Làn điều phối: <strong>{item.gateName}</strong>
                </span>
              )}
              {item.berthCode && (
                <span className="font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-mono">
                  {item.berthCode}
                </span>
              )}
            </div>
          </div>

          {/* Vehicle & Telemetry Box */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Phương tiện đăng ký
              </span>
              <Truck className="w-4 h-4 text-slate-400" />
            </div>

            <div>
              <div className="font-mono text-xl font-bold text-slate-900 tracking-wider">
                {item.vehiclePlate}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {item.vehicleSpec}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-600">
                <span>Khoảng cách GPS:</span>
                <strong className="text-slate-900">{item.distanceKm} km (~{item.etaMinutes}p)</strong>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Vùng đệm Geofence:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Hợp lệ (5km)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ALPR Timeline Flow */}
        <QueueTimelineFlow items={item.timelineFlow} status={item.status} />

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          {/* Left CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {isNotified ? (
              <>
                <button
                  type="button"
                  onClick={onAccept}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/25 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Nhận Slot & Tạo Booking Ngay</span>
                </button>

                <button
                  type="button"
                  onClick={onDecline}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
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
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
                >
                  <Navigation className="w-4 h-4 text-orange-400" />
                  <span>Chỉ đường tới cổng bãi (Google Maps)</span>
                </a>

                <button
                  type="button"
                  onClick={onLeave}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Rời hàng đợi</span>
                </button>
              </>
            )}
          </div>

          {/* Right helper info & Demo Simulator Toggle */}
          <div className="flex items-center gap-3">
            {onToggleStatusDemo && (
              <button
                type="button"
                onClick={onToggleStatusDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
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

        {/* Warning or Tip Banner */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Lưu ý điều phối:</strong> Camera AI tại cổng barie sẽ tự động quét biển số{' '}
            <span className="font-mono font-bold">{item.vehiclePlate}</span> khi xe đến gần. Vui lòng giữ khoảng cách an toàn và đi đúng làn được chỉ định.
          </p>
        </div>
      </div>
    </article>
  )
}
