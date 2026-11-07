import { useState, useEffect } from 'react'
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Navigation,
  Trash2,
  AlertCircle,
  Zap,
} from 'lucide-react'
import type { ActiveQueueItem } from '../types/queueTypes'

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
  const isUrgent = isNotified && secondsRemaining < 180 // under 3 minutes
  const totalDuration = item.totalDurationSeconds ?? 900
  const progressPercent = Math.max(
    0,
    Math.min(100, (secondsRemaining / totalDuration) * 100)
  )

  return (
    <article
      data-testid="active-queue-card"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm transition-all overflow-hidden"
    >
      {/* ── TOP HERO BANNER (Cam nhạt & Xám cho trạng thái nhận slot) ── */}
      {isNotified ? (
        <div className="bg-gradient-to-r from-orange-50 via-amber-50/60 to-slate-50 border-b border-slate-100 text-slate-900 p-5 md:p-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {/* Bỏ chấm tròn theo yêu cầu Hình 5 */}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                  Đã Có Slot Trống
                </span>
                <span className="text-xs text-slate-500 font-mono font-semibold">
                  {item.queueCode}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-sora text-slate-900 tracking-tight mt-1">
                Đã Đến Lượt Của Bạn!
              </h3>
              <p className="text-sm text-slate-600 mt-0.5">
                Bãi đỗ đã dành một slot phù hợp cho phương tiện của bạn. Vui lòng xác nhận nhận slot trước khi hết hạn giữ chỗ.
              </p>
            </div>

            {/* Live Countdown Badge (Bỏ viền vàng, viền mỏng và số vừa phải khi hết hạn) */}
            <div
              className={`border rounded-2xl p-4 text-center min-w-[160px] transition-all ${
                isUrgent
                  ? 'bg-rose-50/60 border-rose-200'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                {isUrgent ? '⚠️ Sắp hết hạn giữ chỗ' : 'Thời gian giữ slot'}
              </span>
              <div
                className={`font-mono tracking-tight my-1 ${
                  isUrgent
                    ? 'text-xl md:text-2xl font-semibold text-rose-600'
                    : 'text-2xl md:text-3xl font-bold text-orange-600'
                }`}
              >
                {formatTimer(secondsRemaining)}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isUrgent ? 'bg-rose-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-700 text-white p-4 md:p-5 border-b border-slate-600">
          {/* Nền xám cho header theo yêu cầu Hình 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-xl bg-slate-800/80 border border-slate-600 shrink-0">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-white font-sora text-lg">
                  #{item.position ?? 1}
                </span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  {/* Bỏ chấm tròn theo yêu cầu Hình 5 */}
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-white border border-white/25">
                    Đang chờ vào chỗ
                  </span>
                  <span className="text-xs text-white/80 font-mono">
                    {item.queueCode}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold font-sora text-white tracking-tight mt-1">
                  Vị trí trong hàng đợi: #{item.position ?? 1}
                </h3>
                <p className="text-xs md:text-sm text-white/90 mt-0.5">
                  Tự động thông báo và cấp slot khi bãi đỗ giải phóng chỗ trống phù hợp.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-600 rounded-xl p-2.5 px-4 text-center">
              <span className="text-[11px] font-semibold text-white/80 block uppercase tracking-wider">
                Tốc độ giải phóng bãi
              </span>
              <span className="text-sm md:text-base font-bold text-white block mt-0.5">
                {/* Bỏ .0 để số tự nhiên theo yêu cầu Hình 3 */}
                {(item.checkOutSpeedText ?? '~4 phút / 1 xe').replace(/\.0\b/g, '')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── CARD BODY ── */}
      <div className="p-4 md:p-5 space-y-4">
        {/* Glanceable Metrics (Thu nhỏ khoảng trống, độ tương phản cao, bỏ chữ thừa) */}
        {!isNotified && (
          <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 sm:p-3">
            <div className="text-center py-1 sm:py-1.5 border-r border-slate-200/80">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Vị trí của bạn
              </span>
              <span className="text-xl sm:text-2xl font-extrabold font-sora text-brand-primary block mt-0.5">
                #{item.position ?? 1}
              </span>
            </div>

            <div className="text-center py-1 sm:py-1.5 border-r border-slate-200/80">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Xe phía trước
              </span>
              <span className="text-xl sm:text-2xl font-bold font-sora text-slate-800 block mt-0.5">
                {item.peopleAhead ?? 0} xe
              </span>
            </div>

            <div className="text-center py-1 sm:py-1.5">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Ước tính có chỗ
              </span>
              <span className="text-xl sm:text-2xl font-bold font-sora text-brand-primary block mt-0.5">
                ~{item.estimatedWaitMinutes ?? 15} phút
              </span>
            </div>
          </div>
        )}

        {/* Facility & Assigned Location */}
        <div className="space-y-1.5">
          <h2 className="text-xl md:text-2xl font-bold font-sora text-slate-900">
            {item.parkingLotName}
          </h2>

          <div className="flex items-start gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{item.parkingLotAddress}</span>
          </div>
        </div>

        {/* Chi tiết phương tiện & làn điều phối (Chữ to, rõ ràng, toàn bộ màu đen theo yêu cầu Hình 4) */}
        <div className="p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-700 block">
                Biển số đăng ký
              </span>
              <strong className="text-base sm:text-lg font-bold font-mono text-slate-900 block mt-1">
                {item.vehiclePlate}
              </strong>
              <span className="text-sm text-slate-900 block mt-0.5">
                {item.vehicleSpec}
              </span>
            </div>

            {item.gateName && (
              <div>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-700 block">
                  Cổng & Làn barie
                </span>
                <strong className="text-base sm:text-lg font-bold text-slate-900 block mt-1">
                  {item.gateName}
                </strong>
                <span className="text-sm text-slate-900 block mt-0.5">
                  Cổng kiểm soát tự động
                </span>
              </div>
            )}

            <div>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-700 block">
                Khoảng cách & ETA
              </span>
              <strong className="text-base sm:text-lg font-bold text-slate-900 block mt-1">
                {item.distanceKm} km (~{item.etaMinutes} phút)
              </strong>
              <span className="text-sm text-slate-900 font-medium block mt-0.5">
                Hợp lệ trong bán kính bãi
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            {isNotified ? (
              <>
                <button
                  type="button"
                  onClick={onAccept}
                  className="h-11 px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold transition-colors shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Nhận Slot & Tạo Booking Ngay</span>
                </button>

                <button
                  type="button"
                  onClick={onDecline}
                  className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
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
                  className="h-11 px-5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold transition-colors shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-white" />
                  <span>Chỉ đường tới cổng bãi</span>
                </a>

                <button
                  type="button"
                  onClick={onLeave}
                  className="h-11 px-4 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
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
