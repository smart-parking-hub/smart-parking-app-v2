import { useState, type FormEvent } from 'react'
import { Mail, Inbox, CheckCircle2, Send } from 'lucide-react'

export function CareersFastApplySection() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [cvLink, setCvLink] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const primaryEmail = 'careers@smartparkinghub.vn'
  const fallbackEmail = 'hr@smarttruck.vn'
  const mailSubject = `[Ứng tuyển Nhanh SmartParkingHub] ${fullName.trim() || 'Ứng viên'}`
  const mailBody = `Kính gửi Bộ phận Tuyển dụng SmartParkingHub,

Tôi quan tâm đến các cơ hội việc làm tại SmartParkingHub và xin gửi hồ sơ ứng tuyển nhanh.

Thông tin liên hệ:
- Họ và tên: ${fullName || '(Chưa điền)'}
- Email liên hệ: ${email || '(Chưa điền)'}
- Đường dẫn CV / Hồ sơ năng lực: ${cvLink || '(Đính kèm CV trong email này)'}

Rất mong nhận được phản hồi từ quý công ty.

Trân trọng,
${fullName || 'Ứng viên'}`

  const mailtoUrl = `mailto:${primaryEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFullName('')
      setEmail('')
      setCvLink('')
    }, 5000)
  }

  return (
    <section className="w-full bg-[#060D1A] text-white py-16 sm:py-20 border-b border-slate-800">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-10 lg:p-14 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-xl">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 font-sora text-xs text-[#d95f00]">
              <Inbox className="w-4 h-4" />
              <span>KẾT NỐI TRỰC TIẾP VỚI TALENT TEAM</span>
            </div>

            <h2 className="font-sora text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Không Thấy Vị Trí Phù Hợp Nhưng Vẫn Muốn Đồng Hành?
            </h2>

            <p className="font-inter text-sm lg:text-base text-slate-300 leading-relaxed">
              Chúng tôi luôn chào đón các chuyên gia xuất sắc trong lĩnh vực Logistics, Hệ thống phân tán và IoT. Gửi CV và đề xuất vị trí của bạn trực tiếp tới hòm thư tuyển dụng chính thức:
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Mail className="w-6 h-6 text-[#d95f00] shrink-0" />
              <a
                href={mailtoUrl}
                className="font-sora text-lg sm:text-xl font-bold text-[#d95f00] hover:underline"
              >
                {fallbackEmail}
              </a>
              <span className="text-xs text-slate-400">
                (hoặc{' '}
                <a
                  href={mailtoUrl}
                  className="text-slate-300 underline hover:text-[#d95f00]"
                >
                  {primaryEmail}
                </a>
                )
              </span>
            </div>

            <p className="font-inter text-xs text-slate-400">
              * Hệ thống hỗ trợ mở ứng dụng Email tự động kèm tiêu đề và mẫu thông tin điền sẵn.
            </p>
          </div>

          <div className="w-full lg:w-96 p-6 sm:p-8 rounded-xl bg-white text-slate-800 border border-[#E2E8F0] shadow-xl">
            <h3 className="font-sora text-lg font-bold mb-1 text-[#060D1A]">Gửi CV Nhanh</h3>
            <p className="font-inter text-xs text-slate-500 mb-4">
              Điền thông tin trực tuyến hoặc gửi trực tiếp qua email tuyển dụng.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fast-apply-fullname" className="block font-inter text-xs text-slate-600 font-medium mb-1">
                  Họ và tên của bạn *
                </label>
                <input
                  id="fast-apply-fullname"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 focus:border-[#d95f00] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label htmlFor="fast-apply-email" className="block font-inter text-xs text-slate-600 font-medium mb-1">
                  Email liên hệ *
                </label>
                <input
                  id="fast-apply-email"
                  name="email"
                  type="email"
                  required
                  placeholder="your.name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 focus:border-[#d95f00] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label htmlFor="fast-apply-cvlink" className="block font-inter text-xs text-slate-600 font-medium mb-1">
                  Link LinkedIn hoặc Link CV *
                </label>
                <input
                  id="fast-apply-cvlink"
                  name="cvLink"
                  type="url"
                  required
                  placeholder="https://linkedin.com/in/..."
                  value={cvLink}
                  onChange={(e) => setCvLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 focus:border-[#d95f00] focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#d95f00] hover:bg-[#b84e00] text-white font-sora text-xs tracking-wider transition-colors shadow-sm font-bold flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>GỬI HỒ SƠ ỨNG TUYỂN</span>
                </button>
                <a
                  href={mailtoUrl}
                  className="w-full py-2.5 rounded-lg border border-[#d95f00] text-[#d95f00] hover:bg-orange-50 font-sora text-xs tracking-wider transition-colors text-center font-bold flex items-center justify-center gap-1.5"
                  id="mailto-fast-apply-btn"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>MỞ EMAIL GỬI CV TRỰC TIẾP</span>
                </a>
              </div>
            </form>

            {submitted && (
              <div
                id="quickSubmitSuccess"
                className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-inter text-xs flex items-center justify-center gap-1.5 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đã tiếp nhận hồ sơ! HR sẽ liên hệ qua email trong 24h.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
