export function OwnerWorkflowSection() {
  const steps = [
    {
      step: '1',
      title: 'Đăng Ký Hồ Sơ Mặt Bằng',
      description:
        'Điền diện tích khu đất, vị trí GPS và sức chứa dự kiến qua biểu mẫu trực tuyến. Thời gian hoàn thành chỉ mất 3 phút.',
      noteLabel: 'Thời gian:',
      noteText: 'Tiếp nhận và xác minh hồ sơ trong 2 giờ.',
    },
    {
      step: '2',
      title: 'Khảo Sát Thực Địa & Lắp Barie',
      description:
        'Đội ngũ kỹ thuật viên đến tận nơi đo đạc luồng xe, khảo sát điện lưới và tiến hành lắp đặt hệ thống Barie ALPR camera AI.',
      noteLabel: 'Tiến độ:',
      noteText: 'Hoàn tất lắp đặt phần cứng trong 24 - 48 giờ.',
    },
    {
      step: '3',
      title: 'Cấu Hình Sơ Đồ & Biểu Phí',
      description:
        'Thiết lập mã số từng vị trí đỗ, gắn quy chuẩn phương tiện và cài đặt giá theo giờ, giá đêm theo đúng chính sách kinh doanh của chủ bãi.',
      noteLabel: 'Tập huấn:',
      noteText: 'Hướng dẫn nhân sự vận hành trong 1 buổi làm việc.',
    },
    {
      step: '4',
      title: 'Mở Bãi & Nhận Tiền Tự Động',
      description:
        'Bãi đỗ xuất hiện trên bản đồ của 45,000+ tài xế. Xe bắt đầu vào bãi, hệ thống tự động ghi nhận và chuyển tiền quyết toán hàng ngày.',
      noteLabel: 'Thanh toán:',
      noteText: 'Tiền về tài khoản ngân hàng T+1 mỗi sáng.',
    },
  ]

  return (
    <section className="w-full bg-white py-16 px-6 text-slate-900 border-b border-slate-200/80" id="quy-trinh">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="font-inter text-xs font-semibold text-slate-500 uppercase tracking-normal mb-2">
              QUY TRÌNH TRIỂN KHAI THỰC ĐỊA
            </div>
            <h2 className="font-sora text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              4 Bước Đưa Mặt Bằng Lên Bản Đồ Vận Tải.
            </h2>
          </div>
          <p className="font-inter text-sm text-slate-600 max-w-md">
            Chỉ mất 72 giờ làm việc từ khi tiếp nhận thông tin khu đất đến khi đón lượt xe đầu tiên.
            SmartTruckHub hỗ trợ lắp đặt thiết bị trọn gói.
          </p>
        </div>

        {/* 4 Columns Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col justify-between gap-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 hover:border-slate-300 transition-colors shadow-xs"
            >
              <div>
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-sora font-bold text-xs mb-3.5">
                  {item.step}
                </div>
                <h3 className="font-sora text-base sm:text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="font-inter text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="bg-white border border-slate-200/80 p-3 rounded-xl text-xs font-inter text-slate-700">
                <span className="font-semibold text-slate-900">{item.noteLabel}</span>{' '}
                {item.noteText}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
