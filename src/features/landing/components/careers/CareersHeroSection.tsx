export function CareersHeroSection() {
  const perks = [
    {
      value: 'Top 10%',
      label: 'Thu nhập thị trường',
    },
    {
      value: '100% Apple / Dell',
      label: 'Thiết bị Workstation',
    },
    {
      value: 'Bảo Hiểm PVI',
      label: 'Chăm sóc toàn diện 24/7',
    },
    {
      value: 'Môi Trường Hybrid',
      label: 'Tự chủ & Linh hoạt giờ giấc',
    },
  ]

  return (
    <section className="relative w-full bg-[#060D1A] border-b border-slate-800 overflow-hidden py-16 lg:py-24">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-[#F97316]/40 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse"></span>
            <span className="font-sora text-xs uppercase tracking-wider text-slate-300 font-semibold">
              TUYỂN DỤNG NHÂN TÀI · CÙNG ĐỊNH HÌNH LOGISTICS SỐ
            </span>
          </div>

          <h1 className="font-sora text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight mb-6 leading-tight">
            Gia Nhập Đội Ngũ <span className="text-[#F97316]">Kiến Tạo Hạ Tầng</span> Logistics Thông Minh.
          </h1>

          <p className="font-inter text-slate-300 text-base lg:text-lg max-w-3xl leading-relaxed mb-10">
            Chúng tôi đang tìm kiếm những kỹ sư phần mềm, chuyên gia điều phối bến bãi và chiến binh kinh doanh B2B cùng giải quyết bài toán giao thông vận tải quy mô lớn cho hàng triệu chuyến xe container tại các trục hành lang huyết mạch.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
            {perks.map((p, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-sora text-xl lg:text-2xl text-white font-bold">{p.value}</div>
                <div className="font-inter text-xs text-slate-400 uppercase tracking-wider font-medium">
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
