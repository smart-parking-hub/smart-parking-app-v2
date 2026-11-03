import { useState } from 'react'
import { Check, MapPin, Scale, Shield, ShowerHead, Wrench, Zap } from 'lucide-react'

export function LandingAmenityFilterSection() {
  const [activeAmenityId, setActiveAmenityId] = useState('scale')

  const amenities = [
    {
      id: 'scale',
      label: 'Trạm Cân Điện Tử 80T - 120T',
      Icon: Scale,
    },
    {
      id: 'reefer',
      label: 'Cắm Sạc Điện Reefer 380V',
      Icon: Zap,
    },
    {
      id: 'shower',
      label: 'Phòng Tắm Nóng Lạnh & Giặt Là',
      Icon: ShowerHead,
    },
    {
      id: 'security',
      label: 'Bảo Vệ Có Thẻ Vũ Trang 24/7',
      Icon: Shield,
    },
    {
      id: 'rescue',
      label: 'Cứu Hộ Lốp & Bình Ắc Quy',
      Icon: Wrench,
    },
  ]

  const facilities = [
    {
      title: 'Trạm cân 120T',
      subtitle: 'Kiểm định đo lường QCVN',
      amenityId: 'scale',
    },
    {
      title: '12 Trụ Cắm Reefer 380V',
      subtitle: 'Dành riêng container lạnh',
      amenityId: 'reefer',
    },
    {
      title: 'Khu Nhà Tắm Nóng Lạnh',
      subtitle: 'Dọn dẹp liên tục mỗi giờ',
      amenityId: 'shower',
    },
    {
      title: 'Bảo Vệ Vũ Trang 24/7',
      subtitle: 'Kiểm soát vé vào - ra nghiêm ngặt',
      amenityId: 'security',
    },
    {
      title: 'Đội Cứu Hộ Lốp Cơ Động',
      subtitle: 'Vá ép, thay lốp lưu động 24h',
      amenityId: 'rescue',
    },
    {
      title: 'Quán Cơm Bác Tài',
      subtitle: 'Bình dân, sạch sẽ, phục vụ thâu đêm',
      amenityId: 'food',
    },
  ]

  return (
    <section className="w-full bg-[#060D1A] py-24 px-6 text-white" id="bo-loc-tien-ich">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="font-inter text-xs font-bold tracking-widest text-[#F97316] uppercase bg-[#0F172A] border border-[#1E3A5F] px-3 py-1 rounded inline-block mb-3">
            BỘ LỌC THỰC TẾ THEO NHU CẦU XE NẶNG
          </span>
          <h2 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Tìm Bãi Có Đúng Tiện Ích Xe Bạn Cần.
          </h2>
          <p className="font-inter text-sm sm:text-base text-slate-300 mt-3">
            Không phải bãi xe nào cũng có điện lạnh 380V hay trạm cân đạt chuẩn. Chọn đúng tiện ích trên màn hình để tiết kiệm hàng giờ di chuyển vô ích.
          </p>
        </div>

        {/* Amenity Toggle Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10" id="amenitySelectors">
          {amenities.map((item) => {
            const Icon = item.Icon
            const isActive = activeAmenityId === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveAmenityId(item.id)}
                className={`amenity-btn px-4 py-2.5 rounded text-xs sm:text-sm font-inter font-semibold flex items-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] ${
                  isActive
                    ? 'bg-[#F97316] text-white border border-[#F97316]'
                    : 'bg-[#0F172A] text-slate-300 hover:text-white border border-[#1E3A5F]'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Live Inspection Card */}
        <div className="bg-[#0F172A] border border-[#1E3A5F] rounded-lg p-6 lg:p-8 max-w-4xl mx-auto shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#1E3A5F]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-[#060D1A] border border-[#1E3A5F] text-[11px] font-inter font-semibold text-[#F97316] uppercase">
                  XÁC THỰC BỞI SMARTTRUCKHUB
                </span>
                <span className="text-xs text-slate-400 font-inter">Cập nhật 3 phút trước</span>
              </div>
              <h3 className="font-sora text-xl sm:text-2xl font-bold text-white">
                Bãi Depot ICD Cát Lái - Gate 2
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-inter mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#F97316] shrink-0" aria-hidden="true" />
                <span>Đường Vành Đai 2, Phường Cát Lái, TP. Thủ Đức · Cách Cổng Cảng Cát Lái 1.8km</span>
              </p>
            </div>
            <div className="flex flex-col sm:items-end">
              <div className="text-xs text-slate-400 font-inter uppercase">Giá niêm yết theo khối giờ</div>
              <div className="font-sora text-2xl font-bold text-[#F97316]">
                50.000 đ <span className="text-xs font-normal text-slate-300 font-inter">/ block 4 giờ</span>
              </div>
              <span className="text-[11px] text-slate-400 font-inter">Đã bao gồm VAT &amp; Phí bảo vệ</span>
            </div>
          </div>

          {/* Facility Checklist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-6 border-b border-[#1E3A5F]">
            {facilities.map((fac) => {
              const isHighlighted = activeAmenityId === fac.amenityId
              return (
                <div
                  key={fac.title}
                  className={`flex items-center gap-3 p-2 rounded transition-colors ${
                    isHighlighted ? 'bg-[#1E293B]/70 ring-1 ring-[#F97316]' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded bg-[#060D1A] border border-[#1E3A5F] flex items-center justify-center text-[#F97316] shrink-0">
                    <Check className="h-[18px] w-[18px]" aria-hidden="true" />
                  </div>
                  <div className="text-xs font-inter text-slate-200">
                    <span className="font-semibold block text-white">{fac.title}</span>
                    {fac.subtitle}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer Action of Card */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs font-inter text-slate-300">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F97316]"></span>
              </span>
              <span>
                Còn trống <strong className="text-white">8 ô đỗ container 40ft</strong> trong 45 phút tới
              </span>
            </div>
            <button
              type="button"
              className="w-full sm:w-auto bg-[#F97316] hover:bg-[#EA580C] text-white font-inter font-semibold text-xs sm:text-sm px-6 py-3 rounded transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              ĐẶT GIỮ CHỖ NGAY TẠI BÃI NÀY
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
