import { useState, type ChangeEvent } from 'react'
import { Camera, X, UploadCloud, CheckCircle2 } from 'lucide-react'

interface AvatarUploadModalProps {
  currentAvatar: string
  fullName: string
  isOpen: boolean
  onClose: () => void
  onSaveAvatar: (newUrl: string) => void
}

export function AvatarUploadModal({
  currentAvatar,
  fullName,
  isOpen,
  onClose,
  onSaveAvatar,
}: AvatarUploadModalProps) {
  const [preview, setPreview] = useState<string>(currentAvatar)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const tempUrl = URL.createObjectURL(file)
      setPreview(tempUrl)
    }
  }

  const handleSave = () => {
    onSaveAvatar(preview)
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-slate-900 text-base">
                Ảnh Định Danh eKYC
              </h3>
              <p className="text-xs text-slate-500 font-mono">CHÂN DUNG TÀI XẾ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col items-center gap-4 text-xs">
          {success && (
            <div className="w-full flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cập nhật ảnh đại diện thành công!</span>
            </div>
          )}

          {/* Avatar Preview */}
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-orange-500/50 shadow-md">
            <img
              src={preview}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          </div>

          <label
            htmlFor="avatar-file"
            className="w-full py-3 px-4 border-2 border-dashed border-slate-300 hover:border-orange-400 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50/70 hover:bg-orange-50/20 transition-colors"
          >
            <input
              id="avatar-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <UploadCloud className="w-6 h-6 text-slate-400" />
            <span className="font-semibold text-slate-700">Tải ảnh chụp chân dung mới</span>
            <span className="text-[11px] text-slate-400">JPG, PNG tối đa 5MB</span>
          </label>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            Khuyến nghị ảnh chụp rõ mặt, mang đồng phục bảo hộ phản quang, không đeo kính râm để phục vụ quét camera nhận diện AI tại trạm cân.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Cập Nhật Ảnh
          </button>
        </div>
      </div>
    </div>
  )
}
