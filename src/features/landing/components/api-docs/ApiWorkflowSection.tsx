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
    <section className="w-full bg-white py-20 px-6 lg:px-12 flex justify-center text-[#0F172A] border-b border-[#D7DFE9]">
      <div className="max-w-[1240px] w-full flex flex-col gap-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EEF2F7] pb-8">
          <div>
            <span className="font-mono text-xs text-[#F97316] font-semibold tracking-wider uppercase block mb-2">
              ONBOARDING QUY TRÌNH KỸ THUẬT
            </span>
            <h2 className="font-sora font-bold text-2xl sm:text-3xl text-[#0F172A]">
              Quy Trình 3 Bước Tích Hợp Vào Sản Phẩm
            </h2>
          </div>
          <div className="text-[#475569] text-sm sm:text-base max-w-md font-normal leading-relaxed">
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
                className="flex flex-col bg-[#EEF2F7] p-8 rounded border border-[#D7DFE9] relative hover:border-[#1E3A5F] transition-all shadow-sm"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-sora text-3xl font-bold text-[#F97316]">
                    {item.step}
                  </span>
                  <span className="w-10 h-10 rounded bg-white border border-[#D7DFE9] flex items-center justify-center text-[#0F172A] shadow-xs">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="font-sora font-semibold text-lg text-[#0F172A] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#475569] mb-6 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-auto pt-4 border-t border-[#D7DFE9] font-mono text-xs text-[#0F172A] font-semibold">
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
