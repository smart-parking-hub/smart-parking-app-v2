import { Sliders } from 'lucide-react'
import type { DriverNotificationChannelsConfig } from '../types/notificationTypes'

interface NotificationChannelsSidebarCardProps {
  config: DriverNotificationChannelsConfig
  onToggleChannel: (key: keyof DriverNotificationChannelsConfig) => void
}

export function NotificationChannelsSidebarCard({
  config,
  onToggleChannel,
}: NotificationChannelsSidebarCardProps) {
  return (
    <div className="flex flex-col gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-sora font-bold text-slate-900 text-base">
          Kênh Nhận Tin Driver
        </h3>
        <Sliders className="w-5 h-5 text-slate-400" />
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Tùy chỉnh thông báo đẩy qua thiết bị di động để không bỏ lỡ slot bãi trống hoặc tín hiệu barie mở.
      </p>

      <div className="flex flex-col gap-2.5 pt-1">
        {/* Toggle 1: Web Push Sound */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex flex-col pr-2">
            <span className="text-xs font-bold text-slate-800">
              Web Push Âm Thanh
            </span>
            <span className="text-[11px] text-slate-500">
              Còi báo động khi có slot trống
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={config.webPushSound}
            aria-label="Bật tắt Web Push Âm Thanh"
            onClick={() => onToggleChannel('webPushSound')}
            className={`w-12 h-6 relative rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${
              config.webPushSound ? 'bg-[#ffeedd]' : 'bg-slate-200'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full transition-transform ${
                config.webPushSound
                  ? 'translate-x-6 bg-[#d95f00]'
                  : 'translate-x-0 bg-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: SMS Emergency */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex flex-col pr-2">
            <span className="text-xs font-bold text-slate-800">
              SMS Khẩn Cấp 24/7
            </span>
            <span className="text-[11px] text-slate-500">
              Cảnh báo đóng bãi / sự cố tĩnh không
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={config.smsEmergency}
            aria-label="Bật tắt SMS Khẩn Cấp 24/7"
            onClick={() => onToggleChannel('smsEmergency')}
            className={`w-12 h-6 relative rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${
              config.smsEmergency ? 'bg-[#ffeedd]' : 'bg-slate-200'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full transition-transform ${
                config.smsEmergency
                  ? 'translate-x-6 bg-[#d95f00]'
                  : 'translate-x-0 bg-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Toggle 3: Zalo OA */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex flex-col pr-2">
            <span className="text-xs font-bold text-slate-800">
              Zalo OA Điều Phối
            </span>
            <span className="text-[11px] text-slate-500">
              Nhận QR vé đỗ và biên lai PayOS
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={config.zaloOaDispatch}
            aria-label="Bật tắt Zalo OA Điều Phối"
            onClick={() => onToggleChannel('zaloOaDispatch')}
            className={`w-12 h-6 relative rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${
              config.zaloOaDispatch ? 'bg-[#ffeedd]' : 'bg-slate-200'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full transition-transform ${
                config.zaloOaDispatch
                  ? 'translate-x-6 bg-[#d95f00]'
                  : 'translate-x-0 bg-slate-400'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
