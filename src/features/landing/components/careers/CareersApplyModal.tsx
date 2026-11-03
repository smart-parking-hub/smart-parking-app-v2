import { useState, type FormEvent } from 'react'
import { X, CheckCircle2 } from 'lucide-react'

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

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setFullName('')
      setPhone('')
      setEmail('')
      setCvUrl('')
      setNotes('')
      onClose()
    }, 2000)
  }

  return (
    <div
      id="applyModal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalJobTitle"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 lg:p-8 shadow-2xl relative border border-[#E2E8F0]">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <span className="font-sora text-xs text-[#F97316] font-bold uppercase tracking-wider">
              ĐƠN ỨNG TUYỂN
            </span>
            <h3 className="font-sora text-lg text-[#060D1A] font-bold mt-0.5" id="modalJobTitle">
              {jobTitle || 'Vị Trí Tuyển Dụng'}
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

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-sora text-lg font-bold text-[#060D1A]">
              Ứng Tuyển Thành Công!
            </h4>
            <p className="font-inter text-sm text-slate-600 max-w-sm mx-auto">
              Bộ phận Nhân sự SmartTruckHub sẽ phản hồi hồ sơ của bạn trong vòng 24 giờ làm việc.
            </p>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 outline-none focus:border-[#F97316] focus:bg-white"
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
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 outline-none focus:border-[#F97316] focus:bg-white"
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
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 outline-none focus:border-[#F97316] focus:bg-white"
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
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 outline-none focus:border-[#F97316] focus:bg-white"
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
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 font-inter text-sm text-slate-800 outline-none focus:border-[#F97316] focus:bg-white resize-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-sora text-xs font-bold transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-sora text-xs font-bold shadow-sm transition-colors"
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
