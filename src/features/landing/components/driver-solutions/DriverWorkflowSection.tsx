export function DriverWorkflowSection() {
  const steps = [
    {
      num: '1',
      title: 'Bước 1: Tìm & Khóa Chỗ (60s)',
      desc: 'Mở ứng dụng hoặc trang tra cứu. Lọc theo đầu kéo 20ft/40ft/45ft hoặc xe tải trọng tải lớn. Hệ thống giữ chỗ chắc chắn trong 10 phút.',
      tagLabel: 'Tính năng:',
      tagText: 'Giữ slot tức thời, không lo bãi báo hết chỗ khi xe tới cổng.',
    },
    {
      num: '2',
      title: 'Bước 2: Dẫn Đường Xe Tải',
      desc: 'Bản đồ tích hợp cảnh báo đường cấm giờ, cầu yếu, giới hạn chiều cao tĩnh không và hướng dẫn rẽ bán kính rộng cho xe container.',
      tagLabel: 'An toàn:',
      tagText: 'Loại bỏ 100% rủi ro lạc vào ngõ hẹp hoặc cầu cấm tải trọng.',
    },
    {
      num: '3',
      title: 'Bước 3: Quét QR Vào Bãi (0.2s)',
      desc: 'Tới cổng bãi, camera ALPR tự nhận diện biển kiểm soát hoặc tài xế đưa mã QR trước mắt đọc. Barie tự động nâng, không cần xuống xe.',
      tagLabel: 'Tốc độ:',
      tagText: 'Không ùn tắc cửa ngõ, vào bãi ngay cả lúc nửa đêm.',
    },
    {
      num: '4',
      title: 'Bước 4: Nghỉ Ngơi & Xuất Bãi',
      desc: 'Sử dụng các tiện ích tại trạm. Khi hoàn thành chuyến đi, thanh toán tự động qua PayOS và nhận ngay hóa đơn điện tử về điện thoại.',
      tagLabel: 'Hóa đơn VAT:',
      tagText: 'Gửi thẳng tới kế toán công ty vận tải, quyết toán gọn gàng.',
    },
  ]

  return (
    <section className="w-full bg-white py-24 px-6 text-[#0F172A]" id="quy-trinh-tai-xe">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="font-sora text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
              Vào Bãi Nhanh Gọn, Không Chờ Soát Vé
            </h2>
            <p className="font-inter text-base sm:text-lg text-slate-600 mt-3 max-w-xl">
              Quy trình 4 bước tinh gọn từ lúc còn lăn bánh trên đường cao tốc đến khi hạ chốt an toàn tại bãi đỗ.
            </p>
          </div>
        </div>

        {/* 4 Columns Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="relative flex flex-col justify-between bg-slate-50/60 rounded-2xl p-7 border border-slate-100">
              <div>
                <h3 className="font-sora text-lg font-bold text-[#0F172A] mb-3">
                  {step.title}
                </h3>
                <p className="font-inter text-base text-slate-600 leading-relaxed mb-6">
                  {step.desc}
                </p>
              </div>
              <div className="bg-white rounded-xl p-3.5 text-sm font-inter text-[#0F172A] border border-slate-200/60">
                <span className="font-semibold text-brand-navy">{step.tagLabel}</span>{' '}
                <span className="text-slate-600">{step.tagText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
