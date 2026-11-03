export function LandingHowItWorks() {
  const steps = [
    {
      num: '01.',
      title: 'Tìm & Khóa Ô Đỗ',
      desc: 'Tra cứu bãi đỗ dọc tuyến đường vận tải, kiểm tra loại bãi phù hợp kích thước xe (xe tải nhỏ, container 40ft hoặc fooc lùn).',
      badgeIcon: 'schedule',
      badgeText: 'Chỉ mất 30 giây',
    },
    {
      num: '02.',
      title: 'Quét QR Tại Barie',
      desc: 'Đến cổng bãi, hệ thống camera ALPR quét biển số tự động hoặc tài xế đưa mã QR trên app vào đầu đọc quang học.',
      badgeIcon: 'speed',
      badgeText: 'Mở barie trong 0.2s',
    },
    {
      num: '03.',
      title: 'Lưu Bãi An Toàn',
      desc: 'Đỗ xe đúng ô chỉ định. Sử dụng các dịch vụ phụ trợ như cắm sạc điện lạnh, phòng tắm tài xế và kiểm tra tải trọng trạm cân.',
      badgeIcon: 'videocam',
      badgeText: 'Camera 24/7 bảo vệ',
    },
    {
      num: '04.',
      title: 'Xuất Bãi Tự Động',
      desc: 'Barie tự động nhấc cần khi nhận diện xe đã hoàn tất thanh toán. Hóa đơn điện tử VAT gửi thẳng vào email công ty vận tải.',
      badgeIcon: 'receipt',
      badgeText: 'Hóa đơn điện tử tức thì',
    },
  ]

  return (
    <section className="bg-white py-20 sm:py-28" id="quy-trinh">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-3">
            QUY TRÌNH 4 BƯỚC ĐƠN GIẢN
          </div>
          <h2 className="font-sora font-extrabold text-3xl sm:text-4xl text-brand-navy tracking-tight">
            Quy Trình Lưu Bãi Nhanh Gọn
          </h2>
          <p className="font-inter text-sm sm:text-base text-slate-600 mt-3">
            Từ lúc tìm kiếm trên điện thoại đến khi barie mở chỉ mất chưa đầy 60 giây.
          </p>
        </div>

        {/* 4 Process Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-brand-surface rounded-2xl p-7 border border-brand-border flex flex-col justify-between"
            >
              <div>
                <div className="font-sora font-extrabold text-3xl text-brand-orange mb-4">{step.num}</div>
                <h3 className="font-sora font-bold text-base text-brand-navy mb-2">{step.title}</h3>
                <p className="font-inter text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-brand-orange">{step.badgeIcon}</span>
                <span>{step.badgeText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
