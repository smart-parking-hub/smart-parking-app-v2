export function ContactStationsSection() {
  const stations = [
    {
      num: '01',
      name: 'Trạm Cứu Hộ Bãi Cảng Cát Lái',
      address: 'Đường Nguyễn Thị Định, TP. Thủ Đức, TP.HCM',
      trucks: '03 Xe trực',
    },
    {
      num: '02',
      name: 'Trạm Cứu Hộ Cụm Cảng Cái Mép - Thị Vải',
      address: 'Thị xã Phú Mỹ, Bà Rịa - Vũng Tàu',
      trucks: '02 Xe trực',
    },
    {
      num: '03',
      name: 'Trạm Điều Phối Ga ICD Sóng Thần',
      address: 'Đại lộ Độc Lập, KCN Sóng Thần, Dĩ An, Bình Dương',
      trucks: '04 Xe trực',
    },
    {
      num: '04',
      name: 'Trạm Cứu Hộ KCN Cụm Cảng Đình Vũ',
      address: 'Bán đảo Đình Vũ, Q. Hải An, TP. Hải Phòng',
      trucks: '03 Xe trực',
    },
    {
      num: '05',
      name: 'Trạm Tiếp Ứng KCN Tiên Sơn & Quế Võ',
      address: 'QL1A, Tiên Du, Tỉnh Bắc Ninh',
      trucks: '02 Xe trực',
    },
    {
      num: '06',
      name: 'Trạm Trung Chuyển Cao Tốc Bến Lức - Long Thành',
      address: 'Nút giao QL1A, Bến Lức, Long An',
      trucks: '02 Xe trực',
    },
  ]

  return (
    <section className="w-full bg-[#EEF2F7] py-16 md:py-24 border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-mono text-xs text-[#F97316] uppercase tracking-wider font-semibold">
              TỌA ĐỘ VẬN HÀNH THỰC ĐỊA
            </span>
            <h2 className="font-sora font-bold text-2xl lg:text-3xl text-[#0F172A] mt-1">
              Trung Tâm Điều Phối & 6 Cụm Cứu Hộ Bãi Đỗ Thường Trực
            </h2>
          </div>
          <p className="font-inter text-sm text-slate-600 max-w-md leading-relaxed">
            Hạ tầng kỹ thuật tại chỗ trực chiến 24/7 gần các cảng biển huyết mạch, cửa khẩu và nút giao cao tốc Bắc Nam.
          </p>
        </div>

        {/* Map & Hubs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Interactive Map Visual Canvas (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl overflow-hidden shadow-sm flex flex-col border border-slate-200">
            <div
              className="w-full h-80 md:h-96 bg-cover bg-center relative"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUyytv_LZd6mZcRmOPSluJPy5OfkSUvFOVl6IkMaTz-x7B4T136X-6o2Brbjh7HXQ3JugovUjXreHR767a5bh1Jju2PDnLK5Lhzt0TyRPsk_8Vbv4fjaxKORwjjNoKhemPirf2gZ3Uv6zIBiAdUP7KmOh5918GT9D4VXj1JeCK96vulCVpDp6eBtqCvnK9SpfIY-TOG7vT-x_SOR3VWBrM6BfDIiMNNg_Aey811PjG')",
              }}
            >
              {/* Overlay Dispatch Status */}
              <div className="absolute top-4 left-4 bg-[#060D1A]/90 backdrop-blur-md p-3.5 rounded-lg text-white shadow-md border border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-ping"></span>
                  <span className="font-mono text-xs uppercase font-bold text-[#F97316]">
                    HỆ THỐNG GIÁM SÁT REALTIME
                  </span>
                </div>
                <div className="font-inter text-xs text-slate-300">
                  Đang giám sát: 142 Bãi xe · 8,420 Vị trí Container
                </div>
              </div>

              {/* Map Pointer Overlay Badges */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg text-slate-800 shadow-md flex items-center gap-3 border border-slate-200">
                <span className="flex items-center gap-1.5 font-mono text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded bg-[#F97316]"></span> Cảng Cát Lái (98% Slot)
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded bg-slate-400"></span> Đình Vũ (82% Slot)
                </span>
              </div>
            </div>

            {/* Bottom Coordinates Bar */}
            <div className="p-4 bg-white flex flex-wrap items-center justify-between gap-2 text-slate-500 font-mono text-xs border-t border-slate-100">
              <span>GPS VĂN PHÒNG ĐIỀU HÀNH TRUNG TÂM: 10.7932° N, 106.7218° E</span>
              <span className="text-[#F97316] font-semibold">TẦN SỐ VẬN HÀNH KÊNH KHẨN: CH-16 LOGISTICS</span>
            </div>
          </div>

          {/* 6 Permanent Dispatch Stations List (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            {stations.map((st) => (
              <div
                key={st.num}
                className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-between hover:border-[#F97316] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-[#0F172A] text-white flex items-center justify-center font-sora text-xs font-bold shrink-0">
                    {st.num}
                  </div>
                  <div>
                    <div className="font-sora font-semibold text-sm text-[#0F172A]">
                      {st.name}
                    </div>
                    <div className="text-xs text-slate-500 leading-tight">
                      {st.address}
                    </div>
                  </div>
                </div>
                <span className="font-sora text-xs bg-orange-50 text-[#F97316] border border-orange-200 px-2.5 py-1 rounded font-bold shrink-0 ml-2">
                  {st.trucks}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
