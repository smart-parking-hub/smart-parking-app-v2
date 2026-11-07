import { useState, useEffect, useRef, type FormEvent } from 'react'
import { X, CheckCircle2, Mail, ExternalLink } from 'lucide-react'

interface CareersApplyModalProps {
  isOpen: boolean
  jobTitle: string
  onClose: () => void
}

export function CareersApplyModal({ isOpen, jobTitle, onClose }: CareersApplyModalProps) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [cvUrl, setCvUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  if (!isOpen) return null

  const targetEmail = 'careers@smartparkinghub.vn'
  const displayTitle = jobTitle || 'Vị Trí Tuyển Dụng'
  const mailSubject = `[Ứng tuyển SmartParkingHub] ${displayTitle} - ${fullName.trim() || 'Ứng viên'}`
  const mailBody = `Kính gửi Bộ phận Tuyển dụng SmartParkingHub,

Tôi quan tâm và có nguyện vọng ứng tuyển vào vị trí: ${displayTitle}

Thông tin ứng viên:
- Họ và tên: ${fullName || '(Chưa điền)'}
- Số điện thoại: ${phone || '(Chưa điền)'}
- Email liên hệ: ${email || '(Chưa điền)'}
- Đường dẫn CV / Hồ sơ năng lực: ${cvUrl || '(Đính kèm CV trong email này)'}

Ghi chú giới thiệu bản thân:
${notes || 'Rất mong có cơ hội trao đổi trực tiếp cùng quý công ty.'}

Trân trọng,
${fullName || 'Ứng viên'}`

  const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
    timerRef.current = setTimeout(() => {
      setIsSuccess(false)
      setFullName('')
      setPhone('')
      setEmail('')
      setCvUrl('')
      setNotes('')
      onClose()
    }, 2500)
  }

  return (
    <div
      id="applyModal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalJobTitle"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 lg:p-8 shadow-2xl relative border border-[#E2E8F0] my-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <span className="font-sora text-xs text-[#d95f00] font-bold uppercase tracking-wider">
              ĐƠN ỨNG TUYỂN
            </span>
            <h3 className="font-sora text-lg text-[#060D1A] font-bold mt-0.5" id="modalJobTitle">
              {displayTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#060D1A] hover:bg-slate-100 transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Direct Application Notice (AC2) */}
        <div className="mt-4 p-3.5 rounded-xl bg-orange-50/80 border border-orange-200 text-xs text-slate-700 space-y-2">
          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-[#d95f00] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">
                Hướng dẫn gửi CV trực tiếp qua email tuyển dụng:
              </p>
              <p className="text-slate-600 leading-relaxed">
                Ứng viên có thể gửi hồ sơ trực tiếp đến{' '}
                <a
                  href={`mailto:${targetEmail}`}
                  className="font-bold text-[#d95f00] underline hover:text-[#b84e00]"
                >
                  {targetEmail}
                </a>{' '}
                hoặc nhấn nút bên dưới để mở ứng dụng Email với tiêu đề đã được chuẩn hóa.
              </p>
            </div>
          </div>
          <div className="pt-1 flex justify-end">
            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#d95f00] text-[#d95f00] hover:bg-[#d95f00] hover:text-white font-sora text-[11px] font-bold transition-colors shadow-xs"
              id="careers-modal-mailto-btn"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Mở Email Gửi CV Trực Tiếp</span>
            </a>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-sora text-lg font-bold text-[#060D1A]">
              Ứng Tuyển Thành Công!
            </h4>
            <p className="font-inter text-sm text-slate-600 max-w-sm mx-auto">
              Bộ phận Nhân sự SmartParkingHub đã tiếp nhận thông tin. Bạn cũng có thể gửi bản sao CV
              trực tiếp đến{' '}
              <a href={mailtoUrl} className="text-[#d95f00] font-bold underline">
                {targetEmail}
              </a>{' '}
              để được ưu tiên xử lý.
            </p>
          </div>
        ) : (
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-inter text-xs text-slate-700 mb-1 font-semibold">
                Họ và tên *
              </label>
              <input
                type="text"
                required
                placeholder="Trần Minh Tuấn"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 outline-none focus:border-[#d95f00] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-inter text-xs text-slate-700 mb-1 font-semibold">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 outline-none focus:border-[#d95f00] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-inter text-xs text-slate-700 mb-1 font-semibold">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="tuan.tran@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 outline-none focus:border-[#d95f00] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-inter text-xs text-slate-700 mb-1 font-semibold">
                Đường dẫn CV (Google Drive / GitHub / Portfolio) *
              </label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/..."
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 outline-none focus:border-[#d95f00] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-inter text-xs text-slate-700 mb-1 font-semibold">
                Giới thiệu ngắn gọn hoặc ghi chú cho nhà tuyển dụng
              </label>
              <textarea
                rows={3}
                placeholder="Chia sẻ kinh nghiệm nổi bật hoặc các dự án kỹ thuật liên quan..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 outline-none focus:border-[#d95f00] focus:bg-white resize-none"
              />
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-end gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 sm:px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-sora text-xs font-bold transition-colors"
              >
                Hủy Bỏ
              </button>
              <a
                href={mailtoUrl}
                className="px-4 py-2.5 rounded-lg border border-[#d95f00] text-[#d95f00] hover:bg-orange-50 font-sora text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Gửi qua Email</span>
              </a>
              <button
                type="submit"
                className="px-5 sm:px-6 py-2.5 rounded-lg bg-[#d95f00] hover:bg-[#b84e00] text-white font-sora text-xs font-bold shadow-sm transition-colors"
              >
                XÁC NHẬN NỘP HỒ SƠ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
