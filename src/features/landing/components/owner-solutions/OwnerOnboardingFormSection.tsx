import { useState, useId } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

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
      className="w-full bg-brand-navy text-white py-24 px-6 relative overflow-hidden border-t border-slate-800"
      id="onboarding-form"
    >
      {/* Ambient glow */}
      <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Copy & Perks (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy-light border border-[#1E3A5F]">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="font-inter text-xs font-semibold tracking-wider text-brand-orange uppercase">
                TIẾP NHẬN ĐỐI TÁC MẶT BẰNG
              </span>
            </div>

            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              Sẵn Sàng Biến Khu Đất Của Bạn Thành <br />
              <span className="text-brand-orange">Trạm Dừng Xe Tự Động Sinh Lời?</span>
            </h2>

            <p className="font-inter text-base text-slate-300 leading-relaxed">
              Điền thông tin mặt bằng ngay hôm nay. Đội ngũ chuyên gia hạ tầng của SmartTruckHub sẽ
              liên hệ trong vòng 2 giờ để tư vấn phương án triển khai tối ưu nhất.
            </p>

            <div className="space-y-3 pt-2 font-inter text-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <span className="text-slate-200">Khảo sát đo đạc thực địa miễn phí 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <span className="text-slate-200">
                  Tặng kèm gói cài đặt cổng thanh toán PayOS VietQR tự động
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <span className="text-slate-200">
                  Cam kết kết nối tối thiểu 200 lượt xe/tháng từ sàn SmartTruck
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4 text-slate-400 text-xs font-inter border-t border-slate-800">
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
          <div className="lg:col-span-6 bg-brand-navy-light border border-[#1E3A5F] p-8 rounded-2xl shadow-2xl">
            <div className="mb-6">
              <h3 className="font-sora font-bold text-xl text-white">
                Đăng Ký Khảo Sát &amp; Mở Bãi Hợp Tác
              </h3>
              <p className="text-xs text-slate-400 font-inter mt-1">
                Vui lòng điền thông tin người phụ trách quản lý mặt bằng.
              </p>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-brand-orange" aria-hidden="true" />
                </div>
                <h4 className="font-sora text-xl font-bold text-white">
                  Đăng Ký Thành Công!
                </h4>
                <p className="text-sm font-inter text-slate-300 max-w-md mx-auto leading-relaxed">
                  Cảm ơn Quý đối tác! Chuyên viên phụ trách khu vực của SmartTruckHub sẽ liên hệ qua số điện thoại <strong className="text-white">{formData.phone}</strong> trong vòng 2 giờ làm việc để xếp lịch khảo sát thực địa.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-brand-orange hover:underline pt-2"
                >
                  Gửi thông tin mặt bằng khác
                </button>
              </div>
            ) : (
              <form
                className="space-y-4 font-inter text-sm"
                id="merchant-reg-form"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-300 uppercase mb-1.5"
                      htmlFor={nameId}
                    >
                      Họ và tên chủ bãi / Quản lý *
                    </label>
                    <input
                      className="w-full bg-brand-navy border border-slate-700 text-white px-3.5 py-3 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
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
                      className="w-full bg-brand-navy border border-slate-700 text-white px-3.5 py-3 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
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
                    className="w-full bg-brand-navy border border-slate-700 text-white px-3.5 py-3 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
                    id={locationId}
                    placeholder="VD: Cạnh KCN Sóng Thần, Dĩ An, Bình Dương"
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-300 uppercase mb-1.5"
                      htmlFor={areaId}
                    >
                      Diện tích ước tính (m²)
                    </label>
                    <select
                      className="w-full bg-brand-navy border border-slate-700 text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-brand-orange"
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
                      className="w-full bg-brand-navy border border-slate-700 text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-brand-orange"
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

                <div className="pt-3">
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-sora font-semibold text-sm py-4 rounded-xl transition-all shadow-lg shadow-brand-orange/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                    type="submit"
                  >
                    <span>XÁC NHẬN ĐĂNG KÝ KHẢO SÁT MIỄN PHÍ</span>
                    <ArrowRight className="h-5 w-5 text-white" aria-hidden="true" />
                  </button>
                </div>

                <p className="text-center text-[11px] text-slate-400 pt-1">
                  Thông tin của bạn được cam kết bảo mật theo tiêu chuẩn ISO 27001. Tuyệt đối không
                  spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
