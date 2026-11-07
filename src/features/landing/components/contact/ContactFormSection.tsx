import { useState, type FormEvent } from 'react'
import {
  FileEdit,
  User,
  Phone,
  Mail,
  SlidersHorizontal,
  Building2,
  ArrowRight,
  Clock,
  Lock,
  CheckCircle2,
  Headset,
  Terminal,
  Handshake,
  MapPin,
  ChevronDown,
} from 'lucide-react'

export function ContactFormSection() {
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [workEmail, setWorkEmail] = useState('')
  const [inquiryType, setInquiryType] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [inquiryDetails, setInquiryDetails] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!fullName || !phoneNumber) return
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setFullName('')
      setPhoneNumber('')
      setWorkEmail('')
      setInquiryType('')
      setCompanyName('')
      setInquiryDetails('')
    }, 6000)
  }

  return (
    <section className="w-full bg-white py-16 md:py-24" id="lien-he-truc-tiep">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: High-Conversion Business Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-xs text-[#d95f00] uppercase tracking-wider font-semibold">
                  TƯ VẤN DOANH NGHIỆP & KỸ THUẬT
                </span>
                <h2 className="font-sora font-bold text-2xl text-[#0F172A] mt-1">
                  Gửi Yêu Cầu Khảo Sát / Tích Hợp
                </h2>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#d95f00]">
                <FileEdit className="w-5 h-5" />
              </div>
            </div>

            <p className="font-inter text-sm text-slate-600 mb-6 leading-relaxed">
              Điền thông tin bên dưới để kỹ sư hệ thống liên hệ trực tiếp, tư vấn cấu hình phần cứng trạm và chính sách chiết khấu vận hành bãi.
            </p>

            <form
              className="space-y-4"
              id="enterpriseContactForm"
              onSubmit={handleSubmit}
            >
              {/* Full Name */}
              <div>
                <label className="block font-inter text-xs font-semibold text-slate-700 mb-1.5" htmlFor="fullName">
                  Họ và tên người liên hệ <span className="text-[#d95f00]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Ví dụ: Trần Quốc Tuấn"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white text-[#0F172A] border border-slate-200 text-sm pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 shadow-sm placeholder:text-slate-400 transition-colors"
                  />
                </div>
              </div>

              {/* Split Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-inter text-xs font-semibold text-slate-700 mb-1.5" htmlFor="phoneNumber">
                    Số điện thoại di động <span className="text-[#d95f00]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="phoneNumber"
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="09xx xxx xxx (10 số)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-white text-[#0F172A] border border-slate-200 text-sm pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 shadow-sm placeholder:text-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-inter text-xs font-semibold text-slate-700 mb-1.5" htmlFor="workEmail">
                    Địa chỉ Email công việc <span className="text-[#d95f00]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="workEmail"
                      type="email"
                      required
                      placeholder="tuan.tran@logistics.vn"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      className="w-full bg-white text-[#0F172A] border border-slate-200 text-sm pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 shadow-sm placeholder:text-slate-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block font-inter text-xs font-semibold text-slate-700 mb-1.5" htmlFor="inquiryType">
                  Nhóm đối tượng & nhu cầu hợp tác <span className="text-[#d95f00]">*</span>
                </label>
                <div className="relative">
                  <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    id="inquiryType"
                    required
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full bg-white text-[#0F172A] border border-slate-200 text-sm pl-11 pr-10 py-3 rounded-lg focus:outline-none focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 shadow-sm appearance-none transition-colors"
                  >
                    <option value="" disabled>Chọn đối tượng phù hợp với bạn...</option>
                    <option value="lot-owner">Chủ bãi đỗ cần khảo sát lắp đặt Barie & Camera ALPR</option>
                    <option value="fleet-enterprise">Doanh nghiệp vận tải cần báo giá gói Đội xe 3PL</option>
                    <option value="developer-api">Lập trình viên / Đơn vị TMS xin cấp API Sandbox Key</option>
                    <option value="driver-support">Bác tài cần hỗ trợ vé / hoàn tiền / sự cố barie bãi</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Organization / Lot Name */}
              <div>
                <label className="block font-inter text-xs font-semibold text-slate-700 mb-1.5" htmlFor="companyName">
                  Tên đơn vị / Tên bãi đỗ xe <span className="font-mono text-xs text-slate-400">(Tùy chọn)</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="companyName"
                    type="text"
                    placeholder="Ví dụ: Bãi xe Container Sóng Thần 2, Đội xe Vận Tải Bắc Nam"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-white text-[#0F172A] border border-slate-200 text-sm pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 shadow-sm placeholder:text-slate-400 transition-colors"
                  />
                </div>
              </div>

              {/* Detailed Message */}
              <div>
                <label className="block font-inter text-xs font-semibold text-slate-700 mb-1.5" htmlFor="inquiryDetails">
                  Nội dung yêu cầu chi tiết <span className="text-[#d95f00]">*</span>
                </label>
                <textarea
                  id="inquiryDetails"
                  rows={4}
                  required
                  placeholder="Mô tả cụ thể: Diện tích mặt bằng bãi (m²), số lượng xe container dự kiến lưu đỗ mỗi ngày, địa bàn cần kết nối hoặc mã lỗi giao dịch cần hỗ trợ..."
                  value={inquiryDetails}
                  onChange={(e) => setInquiryDetails(e.target.value)}
                  className="w-full bg-white text-[#0F172A] border border-slate-200 text-sm p-3.5 rounded-lg focus:outline-none focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 shadow-sm placeholder:text-slate-400 resize-none transition-colors"
                />
              </div>

              {/* Submit Action Strip */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSuccess}
                  className="w-full bg-[#d95f00] hover:bg-[#b84e00] text-white font-sora font-semibold text-sm py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>GỬI YÊU CẦU CHO CHÚNG TÔI</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <div className="flex flex-wrap items-center justify-between mt-3 text-slate-500 font-inter text-xs px-1 gap-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#d95f00]" />
                    Cam kết phản hồi kỹ thuật trong vòng 30 phút
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Bảo mật thông tin dự án
                  </span>
                </div>
              </div>

              {isSuccess && (
                <div
                  id="formSuccessAlert"
                  className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 mt-4 animate-in fade-in duration-200"
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Yêu cầu đã được tiếp nhận thành công!</span>
                  </div>
                  <p className="font-inter text-xs text-emerald-700 mt-1">
                    Kỹ sư trực ban SmartTruckHub sẽ liên hệ với bạn trong vòng 30 phút theo số điện thoại đã cung cấp.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT COLUMN: Direct Dispatch Channels & Field HQ (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0F172A] text-white rounded-xl p-6 md:p-8 shadow-xl border border-slate-800 flex flex-col justify-between">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div>
                  <span className="font-mono text-xs text-[#d95f00] uppercase tracking-wider font-semibold">
                    TRẠM ĐIỀU PHỐI KHẨN CẤP
                  </span>
                  <h2 className="font-sora font-bold text-xl text-white mt-1">
                    Kênh Trực Ban 24/7
                  </h2>
                </div>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d95f00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d95f00]"></span>
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-4">
                {/* Card 01: National Hotline */}
                <div className="p-4 rounded-lg bg-slate-900/60 hover:bg-slate-900 transition-colors border border-slate-800/80">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#d95f00]/20 text-[#d95f00] flex items-center justify-center shrink-0">
                      <Headset className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                        Tổng Đài Điều Phối 24/7 (Hotline Toàn Quốc)
                      </div>
                      <a
                        href="tel:19006868"
                        className="font-sora font-bold text-3xl md:text-4xl text-[#d95f00] hover:text-[#b84e00] transition-colors block my-1 tracking-tight"
                      >
                        1900 6868
                      </a>
                      <p className="font-inter text-xs text-slate-300 leading-snug">
                        Ưu tiên hỗ trợ: Cứu hộ bãi đỗ đầy xe, barie không mở mã QR, hỗ trợ tài xế đêm trạm BOT & cao tốc.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 02: API & Tech Support */}
                <div className="p-4 rounded-lg bg-slate-900/60 hover:bg-slate-900 transition-colors border border-slate-800/80">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#d95f00]/20 text-[#d95f00] flex items-center justify-center shrink-0">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                        Hỗ Trợ Kỹ Thuật & Tích Hợp API
                      </div>
                      <a
                        href="mailto:api-support@smarttruckhub.vn"
                        className="font-sora font-semibold text-sm text-white hover:text-[#d95f00] transition-colors block my-0.5"
                      >
                        api-support@smarttruckhub.vn
                      </a>
                      <p className="font-inter text-xs text-slate-300 leading-snug">
                        Kỹ sư trực tiếp cấu hình Webhook, ALPR Camera SDK, kênh kỹ thuật chuyên dụng Telegram/Slack.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 03: Lot Partnership & B2B */}
                <div className="p-4 rounded-lg bg-slate-900/60 hover:bg-slate-900 transition-colors border border-slate-800/80">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#d95f00]/20 text-[#d95f00] flex items-center justify-center shrink-0">
                      <Handshake className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                        Hợp Tác Mặt Bằng Bãi & Ký Kết B2B
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 my-0.5">
                        <a
                          href="mailto:dispatch@smartparkinghub.vn"
                          className="font-inter text-xs text-white hover:text-[#d95f00] transition-colors"
                        >
                          dispatch@smartparkinghub.vn
                        </a>
                        <span className="text-slate-500">·</span>
                        <a
                          href="tel:0908123456"
                          className="font-sora font-semibold text-xs text-white hover:text-[#d95f00] transition-colors"
                        >
                          0908 123 456
                        </a>
                      </div>
                      <p className="font-inter text-xs text-slate-300 leading-snug">
                        Đo đạc mặt bằng thực địa, ký quỹ doanh thu bãi đỗ, giải ngân thiết bị Barie trả chậm.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 04: Field Headquarters Network */}
                <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d95f00]" />
                    <span>Mạng Lưới Văn Phòng Thực Địa</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="pb-2 border-b border-slate-800">
                      <div className="text-white font-semibold">Trụ sở chính TP.HCM:</div>
                      <div className="text-slate-400">Tòa nhà Logistics Hub, 123 Nguyễn Hữu Cảnh, P. 22, Q. Bình Thạnh, TP.HCM</div>
                    </div>
                    <div className="pb-2 border-b border-slate-800">
                      <div className="text-white font-semibold">Trạm đại diện Hải Phòng:</div>
                      <div className="text-slate-400">Khu Công Nghiệp & Cụm Cảng Đình Vũ, Q. Hải An, TP. Hải Phòng</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Trạm đại diện Đà Nẵng:</div>
                      <div className="text-slate-400">45 Nguyễn Tri Phương, Q. Thanh Khê, TP. Đà Nẵng</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between text-slate-400 font-mono text-xs">
              <span>MÃ ĐÀI ĐIỀU PHỐI: STH-VN-DISPATCH</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                TRỰC TUYẾN 100%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
