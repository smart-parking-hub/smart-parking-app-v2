export function CareersProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Nộp Hồ Sơ & Sàng Lọc',
      description:
        'Nhận CV trực tiếp từ cổng tuyển dụng. Đội ngũ Talent Acquisition phản hồi tình trạng hồ sơ trong vòng 24 giờ làm việc.',
      duration: 'Thời gian: 24 Giờ',
    },
    {
      num: '02',
      title: 'Phỏng Vấn Trực Tiếp',
      description:
        'Một vòng phỏng vấn duy nhất (Online hoặc Trực tiếp) cùng Engineering Lead hoặc Department Head về chuyên môn và văn hóa.',
      duration: 'Thời gian: 60 - 90 Phút',
    },
    {
      num: '03',
      title: 'Thử Nghiệm Thực Tế',
      description:
        'Giải quyết một bài toán ngắn sát với sản phẩm thực địa (Paid Challenge hoặc Case Study) để đánh giá khả năng giải quyết vấn đề.',
      duration: 'Thời gian: 2 - 3 Ngày',
    },
    {
      num: '04',
      title: 'Offer & Onboarding',
      description:
        'Thư mời nhận việc với chế độ đãi ngộ minh bạch, cấp phát thiết bị công nghệ Apple/Dell và chào đón bạn gia nhập đại gia đình.',
      duration: 'Thời gian: Trong 48 Giờ',
    },
  ]

  return (
    <section className="w-full bg-slate-100 py-20 border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="mb-14">
          <span className="font-sora text-xs uppercase tracking-wider text-[#F97316] font-bold">
            MINH BẠCH & TỐC ĐỘ
          </span>
          <h2 className="font-sora text-2xl lg:text-3xl text-[#060D1A] font-bold mt-2 tracking-tight">
            Quy Trình Tuyển Dụng 4 Bước Đơn Giản
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:border-[#F97316] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-sora text-3xl font-extrabold text-[#060D1A]">
                    {step.num}
                  </span>
                  <span className="w-8 h-1 rounded-full bg-[#F97316]"></span>
                </div>
                <h4 className="font-sora text-base text-[#060D1A] mb-2 font-bold">
                  {step.title}
                </h4>
                <p className="font-inter text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[#F97316] font-inter text-xs font-bold">
                {step.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
