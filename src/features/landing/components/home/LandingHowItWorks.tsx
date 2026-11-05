import { Clock, Gauge, Receipt, Video } from 'lucide-react'

export function LandingHowItWorks() {
  const steps = [
    {
      step: 'Bước 1',
      title: 'Tìm & Khóa Ô Đỗ',
      desc: 'Tra cứu bãi đỗ dọc tuyến đường vận tải, kiểm tra loại bãi phù hợp kích thước xe (xe tải nhỏ, container 40ft hoặc fooc lùn).',
      Icon: Clock,
      badgeText: 'Chỉ mất 30 giây',
    },
    {
      step: 'Bước 2',
      title: 'Quét QR Tại Barie',
      desc: 'Đến cổng bãi, hệ thống camera ALPR quét biển số tự động hoặc tài xế đưa mã QR trên app vào đầu đọc quang học.',
      Icon: Gauge,
      badgeText: 'Mở barie trong 0.2s',
    },
    {
      step: 'Bước 3',
      title: 'Lưu Bãi & Tiện Ích',
      desc: 'Đỗ xe đúng ô chỉ định. Sử dụng các dịch vụ phụ trợ như cắm sạc điện lạnh, phòng tắm tài xế và kiểm tra tải trọng trạm cân.',
      Icon: Video,
      badgeText: 'Camera 24/7 bảo vệ',
    },
    {
      step: 'Bước 4',
      title: 'Xuất Bãi Tự Động',
      desc: 'Barie tự động nhấc cần khi nhận diện xe đã hoàn tất thanh toán. Hóa đơn điện tử VAT gửi thẳng vào email công ty vận tải.',
      Icon: Receipt,
      badgeText: 'Hóa đơn điện tử tức thì',
    },
  ]

  return (
    <section className="bg-white py-20 sm:py-28" id="quy-trinh">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy tracking-tight">
            Quy Trình 4 Bước Tự Động Hóa
          </h2>
          <p className="font-inter text-base sm:text-lg text-slate-600 mt-3">
            Từ lúc tìm kiếm trên điện thoại đến khi barie mở chỉ mất chưa đầy 60 giây.
          </p>
        </div>

        {/* 4 Process Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item) => {
            const StepIcon = item.Icon
            return (
              <div
                key={item.step}
                className="bg-slate-50 rounded-2xl p-7 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-sora font-bold text-lg text-brand-navy mb-2.5">{item.step}: {item.title}</h3>
                  <p className="font-inter text-sm sm:text-base text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-6 pt-4 text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <StepIcon className="h-4.5 w-4.5 text-brand-orange shrink-0" aria-hidden="true" />
                  <span>{item.badgeText}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
