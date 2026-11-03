export function DriverWorkflowSection() {
  const steps = [
    {
      num: '01',
      barColor: 'bg-[#F97316]',
      title: 'Tìm & Khóa Chỗ (60s)',
      desc: 'Mở ứng dụng hoặc trang tra cứu. Lọc theo đầu kéo 20ft/40ft/45ft hoặc xe tải trọng tải lớn. Hệ thống giữ chỗ chắc chắn trong 10 phút.',
      tagLabel: 'Tính năng:',
      tagText: 'Giữ slot tức thời, không lo bãi báo hết chỗ khi xe tới cổng.',
    },
    {
      num: '02',
      barColor: 'bg-[#0F172A]',
      title: 'Dẫn Đường Xe Tải',
      desc: 'Bản đồ tích hợp cảnh báo đường cấm giờ, cầu yếu, giới hạn chiều cao tĩnh không và hướng dẫn rẽ bán kính rộng cho xe container.',
      tagLabel: 'An toàn:',
      tagText: 'Loại bỏ 100% rủi ro lạc vào ngõ hẹp hoặc cầu cấm tải trọng.',
    },
    {
      num: '03',
      barColor: 'bg-[#F97316]',
      title: 'Quét QR Vào Bãi (0.2s)',
      desc: 'Tới cổng bãi, camera ALPR tự nhận diện biển kiểm soát hoặc tài xế đưa mã QR trước mắt đọc. Barie tự động nâng, không cần xuống xe.',
      tagLabel: 'Tốc độ:',
      tagText: 'Không ùn tắc cửa ngõ, vào bãi ngay cả lúc nửa đêm.',
    },
    {
      num: '04',
      barColor: 'bg-[#0F172A]',
      title: 'Nghỉ Ngơi & Xuất Bãi',
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
            <span className="font-inter text-xs font-bold tracking-widest text-[#F97316] uppercase">
              QUY TRÌNH VẬN HÀNH THỰC TẾ
            </span>
            <h2 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] mt-2">
              Vào Bãi Nhanh Gọn. Không Cần Chờ Nhân Viên Soát Vé.
            </h2>
          </div>
          <p className="font-inter text-sm text-[#475569] max-w-md">
            Chỉ 4 bước tinh gọn từ lúc còn lăn bánh trên đường cao tốc đến khi hạ chốt an toàn tại bãi đỗ.
          </p>
        </div>

        {/* 4 Columns Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="relative flex flex-col">
              <div className="font-sora text-4xl sm:text-5xl font-extrabold text-[#D7DFE9] mb-4">
                {step.num}
              </div>
              <div className={`h-1 w-12 ${step.barColor} mb-5`}></div>
              <h3 className="font-sora text-lg font-bold text-[#0F172A] mb-2">
                {step.title}
              </h3>
              <p className="font-inter text-sm text-[#475569] leading-relaxed mb-4">
                {step.desc}
              </p>
              <div className="mt-auto bg-[#EEF2F7] border border-[#D7DFE9] p-3 rounded text-xs font-inter text-[#0F172A]">
                <span className="font-semibold text-[#0F172A]">{step.tagLabel}</span>{' '}
                {step.tagText}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
