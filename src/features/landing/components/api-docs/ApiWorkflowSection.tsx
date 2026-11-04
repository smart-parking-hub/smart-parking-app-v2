import { Key, Terminal, Rocket } from 'lucide-react'

export function ApiWorkflowSection() {
  const steps = [
    {
      step: '01',
      icon: Key,
      title: 'Nhận Sandbox Key',
      description:
        'Nhận Sandbox Client ID & Secret trong 60 giây sau khi đăng ký doanh nghiệp. Không yêu cầu liên kết thẻ thanh toán.',
      badge: 'Thời gian hoàn tất: < 1 Phút',
    },
    {
      step: '02',
      icon: Terminal,
      title: 'Thử Nghiệm Luồng Nghiệp Vụ',
      description:
        'Thử nghiệm giả lập luồng Đặt chỗ - Quét QR - Check-out với Mock Data. Theo dõi webhook events trên bảng điều khiển Developer Console.',
      badge: 'Công cụ hỗ trợ: Postman Collection V2.1',
    },
    {
      step: '03',
      icon: Rocket,
      title: 'Ký Kết SLA & Ra Mắt',
      description:
        'Xác thực bảo mật, thẩm định lưu lượng, ký kết SLA uptime 99.98% và nhận chứng thư phát hành Production Access Key trong ngày.',
      badge: 'Tiến độ golive: Trong vòng 24 Giờ',
    },
  ]

  return (
    <section className="w-full bg-white py-20 px-6 lg:px-12 flex justify-center text-brand-navy-light border-b border-api-muted">
      <div className="max-w-[1240px] w-full flex flex-col gap-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-surface pb-8">
          <div>
            <span className="font-mono text-xs text-brand-orange-ink font-semibold tracking-wider uppercase block mb-2">
              ONBOARDING QUY TRÌNH KỸ THUẬT
            </span>
            <h2 className="font-sora font-bold text-2xl sm:text-3xl text-brand-navy-light">
              Quy Trình 3 Bước Tích Hợp Vào Sản Phẩm
            </h2>
          </div>
          <div className="text-api-body text-sm sm:text-base max-w-md font-normal leading-relaxed">
            Môi trường Sandbox hoàn chỉnh cung cấp mock GPS container, hệ thống giả lập barie ALPR và bộ dữ liệu kiểm thử 100% sát thực tế.
          </div>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.step}
                className="flex flex-col bg-brand-surface p-8 rounded border border-api-muted relative hover:border-api-border transition-all shadow-sm"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-sora text-3xl font-bold text-brand-orange-ink">
                    {item.step}
                  </span>
                  <span className="w-10 h-10 rounded bg-white border border-api-muted flex items-center justify-center text-brand-navy-light shadow-xs">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="font-sora font-semibold text-lg text-brand-navy-light mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-api-body mb-6 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-auto pt-4 border-t border-api-muted font-mono text-xs text-brand-navy-light font-semibold">
                  {item.badge}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
