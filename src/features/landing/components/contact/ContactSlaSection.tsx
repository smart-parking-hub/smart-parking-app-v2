import { Timer, Zap, Wifi } from 'lucide-react'

export function ContactSlaSection() {
  const slaItems = [
    {
      icon: Timer,
      metricValue: '30',
      metricUnit: 'Phút',
      title: 'Cam Kết Phản Hồi Báo Giá',
      description:
        'Đội ngũ kỹ sư giải pháp liên hệ trực tiếp cho mọi hồ sơ đăng ký mặt bằng bãi và hợp đồng đội xe 3PL.',
    },
    {
      icon: Zap,
      metricValue: '0.2',
      metricUnit: 'Giây',
      title: 'Xử Lý Lỗi Barie Từ Xa',
      description:
        'Giao thức MQTT IoT kích hoạt mở barie cưỡng bức an toàn ngay khi tài xế gặp trục trặc mã QR tại cổng.',
    },
    {
      icon: Wifi,
      metricValue: '99.98%',
      metricUnit: '',
      title: 'Uptime Hệ Thống Điều Phối',
      description:
        'Hạ tầng điện toán đám mây kép dự phòng, đảm bảo luồng giao thông xuất nhập bãi không bao giờ ngưng trệ.',
    },
  ]

  return (
    <section className="w-full bg-white py-16 border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {slaItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-orange-50 text-[#d95f00] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-sora font-bold text-3xl text-[#d95f00] tracking-tight leading-none mb-1.5">
                    {item.metricValue}{' '}
                    {item.metricUnit && (
                      <span className="text-lg font-semibold text-slate-600">
                        {item.metricUnit}
                      </span>
                    )}
                  </div>
                  <div className="font-sora font-semibold text-sm text-[#0F172A]">
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
