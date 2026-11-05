import { useState, useId } from 'react'
import { ArrowRight, CheckCircle2, Check } from 'lucide-react'

export function OwnerOnboardingFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    area: '7000-15000',
    status: 'operating',
  })
  const [submitted, setSubmitted] = useState(false)

  const nameId = useId()
  const phoneId = useId()
  const locationId = useId()
  const areaId = useId()
  const statusId = useId()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      className="w-full bg-brand-navy text-white py-16 px-6 relative overflow-hidden"
      id="onboarding-form"
    >
      {/* Ambient glow */}
      <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Copy & Perks (6 Cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-brand-orange" />
              <span>TIẾP NHẬN ĐỐI TÁC MẶT BẰNG</span>
            </div>

            <h2 className="font-sora font-extrabold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight leading-snug">
              Biến Khu Đất Của Bạn Thành <br className="hidden sm:inline" />
              <span className="text-brand-orange">Trạm Dừng Xe Tự Động Sinh Lời.</span>
            </h2>

            <p className="font-inter text-base text-slate-300 leading-relaxed">
              Điền thông tin mặt bằng ngay hôm nay. Đội ngũ chuyên gia hạ tầng của SmartTruckHub sẽ
              liên hệ trong vòng 2 giờ để tư vấn phương án triển khai tối ưu nhất.
            </p>

            <div className="space-y-3 pt-1 font-inter text-sm">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />
                </div>
                <span className="text-slate-200">Khảo sát đo đạc thực địa miễn phí 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />
                </div>
                <span className="text-slate-200">
                  Tặng kèm gói cài đặt cổng thanh toán PayOS VietQR tự động
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />
                </div>
                <span className="text-slate-200">
                  Cam kết kết nối tối thiểu 200 lượt xe/tháng từ sàn SmartTruck
                </span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4 text-slate-400 text-xs font-inter border-t border-slate-800">
              <span>
                HOTLINE ĐỐI TÁC:{' '}
                <a
                  href="tel:19006868"
                  className="text-white hover:text-brand-orange font-bold transition-colors"
                >
                  1900 6868
                </a>
              </span>
              <span>•</span>
              <span>
                EMAIL:{' '}
                <a
                  href="mailto:merchant@smarttruckhub.vn"
                  className="text-white hover:text-brand-orange font-bold transition-colors"
                >
                  merchant@smarttruckhub.vn
                </a>
              </span>
            </div>
          </div>

          {/* Right: Registration Form Card (6 Cols) */}
          <div className="lg:col-span-6 bg-[#0B1528] border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xs">
            <div className="mb-5">
              <h3 className="font-sora font-bold text-lg sm:text-xl text-white">
                Đăng Ký Khảo Sát &amp; Mở Bãi Hợp Tác
              </h3>
              <p className="text-xs text-slate-400 font-inter mt-1">
                Vui lòng điền thông tin người phụ trách quản lý mặt bằng.
              </p>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3.5">
                <div className="w-12 h-12 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7 text-brand-orange" aria-hidden="true" />
                </div>
                <h4 className="font-sora text-lg sm:text-xl font-bold text-white">
                  Đăng Ký Thành Công!
                </h4>
                <p className="text-sm font-inter text-slate-300 max-w-md mx-auto leading-relaxed">
                  Cảm ơn Quý đối tác! Chuyên viên phụ trách khu vực của SmartTruckHub sẽ liên hệ qua số điện thoại <strong className="text-white">{formData.phone}</strong> trong vòng 2 giờ làm việc để xếp lịch khảo sát thực địa.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-brand-orange hover:underline pt-1 cursor-pointer"
                >
                  Gửi thông tin mặt bằng khác
                </button>
              </div>
            ) : (
              <form
                className="space-y-3.5 font-inter text-sm"
                id="merchant-reg-form"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-300 uppercase mb-1.5"
                      htmlFor={nameId}
                    >
                      Họ và tên chủ bãi / Quản lý *
                    </label>
                    <input
                      className="w-full bg-[#060D1A] border border-slate-700 text-white px-3.5 py-2.5 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                      id={nameId}
                      placeholder="Nguyễn Văn A"
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-300 uppercase mb-1.5"
                      htmlFor={phoneId}
                    >
                      Số điện thoại liên hệ *
                    </label>
                    <input
                      className="w-full bg-[#060D1A] border border-slate-700 text-white px-3.5 py-2.5 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                      id={phoneId}
                      placeholder="0912 345 678"
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold text-slate-300 uppercase mb-1.5"
                    htmlFor={locationId}
                  >
                    Vị trí mặt bằng bãi xe (Tỉnh/Thành &amp; Tuyến đường) *
                  </label>
                  <input
                    className="w-full bg-[#060D1A] border border-slate-700 text-white px-3.5 py-2.5 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                    id={locationId}
                    placeholder="VD: Cạnh KCN Sóng Thần, Dĩ An, Bình Dương"
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-300 uppercase mb-1.5"
                      htmlFor={areaId}
                    >
                      Diện tích ước tính (m²)
                    </label>
                    <select
                      className="w-full bg-[#060D1A] border border-slate-700 text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                      id={areaId}
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    >
                      <option value="under-3000">Dưới 3.000 m² (20 - 40 xe)</option>
                      <option value="3000-7000">3.000 - 7.000 m² (50 - 100 xe)</option>
                      <option value="7000-15000">7.000 - 15.000 m² (100 - 200 xe)</option>
                      <option value="over-15000">Trên 15.000 m² (ICD quy mô lớn)</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-300 uppercase mb-1.5"
                      htmlFor={statusId}
                    >
                      Hiện trạng mặt bằng
                    </label>
                    <select
                      className="w-full bg-[#060D1A] border border-slate-700 text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                      id={statusId}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="operating">Đang hoạt động giữ xe thủ công</option>
                      <option value="empty-land">Đất trống chưa khai thác</option>
                      <option value="warehouse">Kho bãi kết hợp trạm dừng</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] font-sora font-bold text-sm sm:text-base py-3.5 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange cursor-pointer"
                    type="submit"
                  >
                    <span>XÁC NHẬN ĐĂNG KÝ KHẢO SÁT MIỄN PHÍ</span>
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <p className="text-center text-xs text-slate-400 pt-1">
                  Thông tin của bạn được cam kết bảo mật theo tiêu chuẩn ISO 27001. Tuyệt đối không spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
