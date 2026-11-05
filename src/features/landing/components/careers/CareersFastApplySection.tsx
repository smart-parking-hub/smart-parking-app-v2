import { useState, type FormEvent } from 'react'
import { Mail, Inbox, CheckCircle2 } from 'lucide-react'

export function CareersFastApplySection() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [cvLink, setCvLink] = useState('')
  const [submitted, setSubmitted] = useState(false)

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
    <section className="w-full bg-[#060D1A] text-white py-20 border-b border-slate-800">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="p-10 lg:p-14 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-xl">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 font-sora text-xs text-[#F97316]">
              <Inbox className="w-4 h-4" />
              <span>KẾT NỐI TRỰC TIẾP VỚI TALENT TEAM</span>
            </div>

            <h2 className="font-sora text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Không Thấy Vị Trí Phù Hợp Nhưng Vẫn Muốn Đồng Hành?
            </h2>

            <p className="font-inter text-sm lg:text-base text-slate-300 leading-relaxed">
              Chúng tôi luôn chào đón các chuyên gia xuất sắc trong lĩnh vực Logistics, Hệ thống phân tán và IoT. Gửi CV và đề xuất vị trí của bạn trực tiếp tới hòm thư tuyển dụng:
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Mail className="w-6 h-6 text-[#F97316]" />
              <a
                href="mailto:hr@smarttruck.vn"
                className="font-sora text-xl font-bold text-[#F97316] hover:underline"
              >
                hr@smarttruck.vn
              </a>
            </div>
          </div>

          <div className="w-full lg:w-96 p-8 rounded-xl bg-white text-slate-800 border border-[#E2E8F0] shadow-xl">
            <h3 className="font-sora text-lg font-bold mb-4 text-[#060D1A]">Gửi CV Nhanh</h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fast-apply-fullname" className="block font-inter text-xs text-slate-600 font-medium mb-1">
                  Họ và tên của bạn
                </label>
                <input
                  id="fast-apply-fullname"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 focus:border-[#F97316] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label htmlFor="fast-apply-email" className="block font-inter text-xs text-slate-600 font-medium mb-1">
                  Email liên hệ
                </label>
                <input
                  id="fast-apply-email"
                  name="email"
                  type="email"
                  required
                  placeholder="your.name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 focus:border-[#F97316] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label htmlFor="fast-apply-cvlink" className="block font-inter text-xs text-slate-600 font-medium mb-1">
                  Link LinkedIn hoặc Link CV
                </label>
                <input
                  id="fast-apply-cvlink"
                  name="cvLink"
                  type="url"
                  required
                  placeholder="https://linkedin.com/in/..."
                  value={cvLink}
                  onChange={(e) => setCvLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 focus:border-[#F97316] focus:bg-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-sora text-xs tracking-wider transition-colors shadow-sm font-bold"
              >
                GỬI HỒ SƠ ỨNG TUYỂN
              </button>
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
