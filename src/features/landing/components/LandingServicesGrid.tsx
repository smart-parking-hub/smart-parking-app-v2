export function LandingServicesGrid() {
  const services = [
    {
      id: 'container',
      tag: 'Cảng Biển & ICD',
      title: 'Bãi Container & Depot Cảng',
      desc: 'Vị trí chiến lược bán kính 3km quanh Cát Lái, Cái Mép và Đình Vũ. Hỗ trợ cắm điện lạnh reefer container 380V.',
      specs: ['Chiều dài xe: Đầu kéo 40ft - 53ft', 'Biểu phí: Từ 35.000đ/giờ'],
      slots: 'Xem chỗ trống (14)',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqcVMFv7ug-vgteSCPY3VqQ5p75QegHJXegeKT4hYMHeQ7MvxFBpocxpwbsnuDXH-kFKDIzOEd8yCy_zOqZoZt7XL17K0y8hwcDtl67uDfOSixAEg1T4tODyzhXua9aQLuRukOKjRu3gKFoyZACf_wXmp_vaXhQ4Lb3UXOQvSV72f6N4Fp665ADd_HNHw8Iy4B-MWZDav9uGItNmbgXquOpyO7etd5OUA9IwzN3UN6',
    },
    {
      id: 'heavy',
      tag: 'Siêu Trường Siêu Trọng',
      title: 'Bãi Xe Tải Nặng & Quá Khổ',
      desc: 'Mặt bằng gia cố bê tông mác cao chịu tải 100 tấn, tích hợp trạm cân điện tử tự động kết nối dữ liệu hành trình.',
      specs: ['Tải trọng sàn: Không giới hạn', 'Trạm cân: Cân điện tử 80T - 120T'],
      slots: 'Xem chỗ trống (8)',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJNQpkZ5OX4EPwOGaI4VUThiwvZPBp-1GssdgO0KSBkvPo7-6349BfgkkMDRfpF2a20h_DfYpO4wJX2drr_NhtVpdAgkUp43F2v8QpqcTVq-RfKKXuZh-TZXXIlMhR6ZCI525GPz9yZ2DLK0r2sWPhhVcDbR-s33TpJ37iQLG7XWiJxH0bbH37jJxrRsFcCDYOqoltwI-DQVbunEv8WzoomOZrY9xRJ64AjPSk7VIy',
    },
    {
      id: 'highway',
      tag: 'Trạm Nghỉ Cao Tốc',
      title: 'Trạm Dừng Nghỉ Liên Tỉnh',
      desc: 'Chuỗi trạm dừng tiện ích cao cấp dọc tuyến QL1A và Cao tốc Bắc Nam. Phòng tắm nóng lạnh, giường nghỉ và suất ăn nóng 24/7.',
      specs: ['Tiện ích: Phòng nghỉ máy lạnh, Căng-tin', 'An ninh: Bảo vệ vòng ngoài 2 lớp'],
      slots: 'Xem chỗ trống (26)',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3cuM34PML3AnXJ0N_o346tXniSAQ-jjOEuxbZ0gbIKPs8LK9SygkgpLy0CujwyOYHmFP5J3jXvgEFZvC3XkJl_z1IHFfM2IWdx8BfwFb8TeuTQFjtjlWhkbbbZtiv48bGyO8yIjmrBGYeJ-96FwIEwl1BsKWyTrrKdIuHxh7U_iJE6C5zJMXwh364hQXk7TKZXkz4lGXseIBg8QPErJMye0PBEMvWtAdSyDS7YqIu',
    },
    {
      id: 'ai-gate',
      tag: 'Công Nghệ AI',
      title: 'Hàng Đợi Ảo & Barie Tự Động',
      desc: 'Giải pháp xếp hàng ảo (Virtual Queue) tránh tắc nghẽn giờ cấm tải đô thị. Barie thông minh mở tự động trong 0.2 giây.',
      specs: ['Nhận diện ALPR: Chính xác 99.8%', 'Quét mã: Mã QR động trên điện thoại'],
      slots: 'Khám phá giải pháp',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvrAE_tYeBrSLHoQr7DQ9691NR8Lj7jCj1IibbQi8_XB6q0YVU-NrtIrHg64Jrk9g-mLiFyBewfNJqMMvhN6LP11FSdRrZ7E9LaW11Kstu6FU_ybR1BlDWZgdrn3q6VjapDWcSrPEmHZdg1vg3IIj8cO2XWeEAtxRBEHIY9rWqRf4PkULlxGITZ6K-RLs1kmkZ8DMOR_gn_B2KdCP6e9-aExiFxyNnldmbM4L-rNRB',
    },
  ]

  return (
    <section className="bg-brand-surface py-20 sm:py-28" id="tim-bai">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white border border-brand-border text-brand-orange text-xs font-semibold uppercase tracking-wider mb-3">
            DANH MỤC DỊCH VỤ CHUYÊN DỤNG
          </div>
          <h2 className="font-sora font-extrabold text-3xl sm:text-4xl text-brand-navy tracking-tight">
            Mọi Phương Thức. Mọi Tuyến Đường. <br />
            <span className="text-brand-orange">Một Nền Tảng Hợp Nhất.</span>
          </h2>
          <p className="font-inter text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
            Cho dù bạn điều hành đoàn xe container 45ft, xe đầu kéo quá khổ hay xe tải thùng 15 tấn, SmartTruckHub luôn cung cấp vị trí đỗ an toàn và dịch vụ kỹ thuật tiêu chuẩn.
          </p>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden border border-brand-border hover:border-brand-orange transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={item.title}
                    src={item.img}
                  />
                  <span className="absolute top-3 left-3 bg-brand-navy/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                    {item.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-sora font-bold text-lg text-brand-navy mb-2 group-hover:text-brand-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-inter text-xs text-slate-600 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <div className="font-inter text-xs text-slate-500 space-y-1">
                    {item.specs.map((spec, i) => (
                      <div key={i}>• {spec}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-inter text-xs font-semibold text-brand-orange">{item.slots}</span>
                <span className="material-symbols-outlined text-[18px] text-brand-orange group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button Centered */}
        <div className="text-center mt-12">
          <a
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-sora font-semibold text-sm px-8 py-3.5 rounded-xl shadow-md transition-all"
            href="#bang-gia"
          >
            <span>XEM TẤT CẢ 320+ ĐIỂM BÃI ĐỖ XE</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </a>
        </div>
      </div>
    </section>
  )
}
