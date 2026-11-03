import { Volume2, MessageSquare, Send } from 'lucide-react'
import type { MerchantNotificationSettings } from '../types/merchantProfileTypes'

interface NotificationChannelsConfigCardProps {
  settings: MerchantNotificationSettings
  onChange: (key: keyof MerchantNotificationSettings, value: boolean) => void
}

export function NotificationChannelsConfigCard({
  settings,
  onChange,
}: NotificationChannelsConfigCardProps) {
  return (
    <section className="bg-white rounded-2xl p-6 lg:p-7 shadow-xs border border-slate-200/80 space-y-5">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-md bg-[#131b2e] text-white flex items-center justify-center font-mono text-[11px] font-bold">
            03
          </span>
          <h2 className="font-sora text-base lg:text-lg font-bold text-[#0d1c2e]">
            Cấu Hình Kênh Nhận Thông Báo Vận Hành
          </h2>
        </div>

        <span className="font-mono text-[11px] text-slate-500 uppercase font-semibold">
          TÙY CHỈNH THỜI GIAN THỰC
        </span>
      </div>

      <div className="space-y-3.5">
        {/* Toggle Option 1: Web Push Audio Horn */}
        <div className="flex items-start justify-between p-4 rounded-xl bg-[#eff4ff] border border-slate-200/60 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#d95f00] shrink-0">
              <Volume2 className="w-4 h-4 text-[#d95f00]" />
            </div>
            <div>
              <span className="font-semibold text-xs lg:text-sm text-[#0d1c2e] block">
                Web Push: Âm thanh còi xe tải khi có khách đặt mới
              </span>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed m-0">
                Tự động phát tín hiệu âm thanh cảnh báo tại trình duyệt máy tính barie khi tài xế
                hoàn tất giữ chỗ.
              </p>
            </div>
          </div>

          {/* Switch toggle */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              id="toggle-web-horn"
              checked={settings.webPushHorn}
              onChange={(e) => onChange('webPushHorn', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d95f00]"></div>
          </label>
        </div>

        {/* Toggle Option 2: SMS Critical Alert */}
        <div className="flex items-start justify-between p-4 rounded-xl bg-[#eff4ff] border border-slate-200/60 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#455f87] shrink-0">
              <MessageSquare className="w-4 h-4 text-[#455f87]" />
            </div>
            <div>
              <span className="font-semibold text-xs lg:text-sm text-[#0d1c2e] block">
                SMS Khẩn cấp 24/7: Cảnh báo bãi đỗ chạm ngưỡng 95%
              </span>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed m-0">
                Gửi tin nhắn tức thời tới hotline quản lý bãi khi còn dưới 5 slot container trống để
                điều phối luồng xe.
              </p>
            </div>
          </div>

          {/* Switch toggle */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              id="toggle-sms-alert"
              checked={settings.smsCriticalAlert}
              onChange={(e) => onChange('smsCriticalAlert', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d95f00]"></div>
          </label>
        </div>

        {/* Toggle Option 3: Zalo OA Daily Statement */}
        <div className="flex items-start justify-between p-4 rounded-xl bg-[#eff4ff] border border-slate-200/60 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0d1c2e] shrink-0">
              <Send className="w-4 h-4 text-[#0d1c2e]" />
            </div>
            <div>
              <span className="font-semibold text-xs lg:text-sm text-[#0d1c2e] block">
                Zalo Official Account: Nhận bảng kê đối soát doanh thu mỗi 23h30
              </span>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed m-0">
                Bản tóm tắt số lượt xe ra vào, tổng doanh thu thu hộ và trạng thái kết chuyển ví mỗi
                ngày qua Zalo OA.
              </p>
            </div>
          </div>

          {/* Switch toggle */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              id="toggle-zalo-oa"
              checked={settings.zaloOaStatement}
              onChange={(e) => onChange('zaloOaStatement', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d95f00]"></div>
          </label>
        </div>
      </div>
    </section>
  )
}
