import { useState } from 'react'
import { CheckCheck, BellRing, Check } from 'lucide-react'

interface NotificationsHeaderProps {
  unreadCount: number
  onMarkAllAsRead: () => void
  isMarkingAll: boolean
}

export function NotificationsHeader({
  unreadCount,
  onMarkAllAsRead,
  isMarkingAll,
}: NotificationsHeaderProps) {
  const [webPushActive, setWebPushActive] = useState(false)

  const handleToggleWebPush = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          setWebPushActive(true)
          return
        }
      } catch {
        // ignore
      }
    }
    setWebPushActive(true)
  }

  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex flex-col gap-2 max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
          <span className="font-mono text-xs text-[#d95f00] uppercase tracking-wider font-bold">
            LUỒNG SỰ KIỆN THỜI GIAN THỰC · THÔNG BÁO VẬN HÀNH DRIVER OPS
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-sora text-slate-900 tracking-tight">
          Trung Tâm Thông Báo
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Cập nhật biến động vị trí hàng đợi ảo, trạng thái mở barie ALPR, kết quả thanh toán cọc PayOS và cảnh báo tĩnh không - cầu yếu trên tuyến đường.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <button
          type="button"
          id="mark-all-read-btn"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0 || isMarkingAll}
          className={`h-11 px-4 rounded-xl font-semibold text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            unreadCount === 0
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
          }`}
          title={unreadCount === 0 ? 'Tất cả thông báo đã được đọc' : 'Đánh dấu tất cả thông báo là đã đọc'}
        >
          <CheckCheck className="w-4 h-4 text-slate-600" />
          <span>{isMarkingAll ? 'ĐANG CẬP NHẬT...' : 'ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC'}</span>
        </button>

        <button
          type="button"
          id="web-push-btn"
          onClick={handleToggleWebPush}
          className={`h-11 px-4 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            webPushActive
              ? 'bg-[#131b2e] text-white shadow-xs'
              : 'bg-[#ffeedd] text-[#d95f00] hover:bg-[#ffe2c4] border border-[#d95f00]/30'
          }`}
          title="Bật cảnh báo âm thanh & thông báo đẩy trình duyệt"
        >
          {webPushActive ? (
            <>
              <Check className="w-4 h-4 text-orange-400" />
              <span>ĐÃ KÍCH HOẠT PUSH 24/7</span>
            </>
          ) : (
            <>
              <BellRing className="w-4 h-4 text-[#d95f00]" />
              <span>BẬT THÔNG BÁO ĐẨY WEB PUSH 24/7</span>
            </>
          )}
        </button>
      </div>
    </section>
  )
}
