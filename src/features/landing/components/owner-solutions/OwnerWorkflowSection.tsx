export function OwnerWorkflowSection() {
  const steps = [
    {
      step: '01',
      barColor: 'bg-brand-orange',
      title: 'Đăng Ký Hồ Sơ Mặt Bằng',
      description:
        'Điền diện tích khu đất, vị trí GPS và sức chứa dự kiến qua biểu mẫu trực tuyến. Thời gian hoàn thành chỉ mất 3 phút.',
      noteLabel: 'Thời gian:',
      noteText: 'Tiếp nhận và xác minh hồ sơ trong 2 giờ.',
    },
    {
      step: '02',
      barColor: 'bg-[#0F172A]',
      title: 'Khảo Sát Thực Địa & Lắp Barie',
      description:
        'Đội ngũ kỹ thuật viên đến tận nơi đo đạc luồng xe, khảo sát điện lưới và tiến hành lắp đặt hệ thống Barie ALPR camera AI.',
      noteLabel: 'Tiến độ:',
      noteText: 'Hoàn tất lắp đặt phần cứng trong 24 - 48 giờ.',
    },
    {
      step: '03',
      barColor: 'bg-brand-orange',
      title: 'Cấu Hình Sơ Đồ & Biểu Phí',
      description:
        'Thiết lập mã số từng vị trí đỗ, gắn quy chuẩn phương tiện và cài đặt giá theo giờ, giá đêm theo đúng chính sách kinh doanh của chủ bãi.',
      noteLabel: 'Tập huấn:',
      noteText: 'Hướng dẫn nhân sự vận hành trong 1 buổi làm việc.',
    },
    {
      step: '04',
      barColor: 'bg-[#0F172A]',
      title: 'Mở Bãi & Nhận Tiền Tự Động',
      description:
        'Bãi đỗ xuất hiện trên bản đồ của 45,000+ tài xế. Xe bắt đầu vào bãi, hệ thống tự động ghi nhận và chuyển tiền quyết toán hàng ngày.',
      noteLabel: 'Thanh toán:',
      noteText: 'Tiền về tài khoản ngân hàng T+1 mỗi sáng.',
    },
  ]

  return (
    <section className="w-full bg-white py-24 px-6 text-[#0F172A]" id="quy-trinh">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-inter text-xs font-bold tracking-widest text-brand-orange uppercase">
              QUY TRÌNH TRIỂN KHAI THỰC ĐỊA
            </span>
            <h2 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] mt-2">
              4 Bước Đưa Mặt Bằng Lên Bản Đồ Vận Tải Toàn Quốc.
            </h2>
          </div>
          <p className="font-inter text-sm text-slate-600 max-w-md">
            Chỉ mất 72 giờ làm việc từ khi tiếp nhận thông tin khu đất đến khi đón lượt xe đầu tiên.
            SmartTruckHub hỗ trợ lắp đặt thiết bị trọn gói.
          </p>
        </div>

        {/* 4 Columns Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="relative flex flex-col">
              <div className="font-sora text-4xl sm:text-5xl font-extrabold text-[#D7DFE9] mb-4">
                {item.step}
              </div>
              <div className={`h-1 w-12 ${item.barColor} mb-5`} />
              <h3 className="font-sora text-lg font-bold text-[#0F172A] mb-2">{item.title}</h3>
              <p className="font-inter text-sm text-slate-600 leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="mt-auto bg-[#EEF2F7] border border-[#D7DFE9] p-3 rounded-lg text-xs font-inter text-[#0F172A]">
                <span className="font-semibold text-[#0F172A]">{item.noteLabel}</span>{' '}
                {item.noteText}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
