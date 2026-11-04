import { useState, useRef } from 'react'
import { Image as ImageIcon, Camera, Info, CheckCircle2 } from 'lucide-react'

interface EditMerchantPhotosCardProps {
  disabled?: boolean
  onAddPhoto?: (file: File) => void
}

interface PhotoItem {
  id: string
  label: string
  filename: string
  url: string
  isMandatoryNew?: boolean
}

const initialPhotos: PhotoItem[] = [
  {
    id: 'p1',
    label: 'CỔNG 01 (BAN NGÀY)',
    filename: 'gate-daylight-hq.jpg',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p2',
    label: 'BÃI ĐỖ XE TẢI NẶNG',
    filename: 'yard-overview-lane-a.jpg',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p3',
    label: 'TRẠM CÂN ĐIỆN TỬ',
    filename: 'weighbridge-station.jpg',
    url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
  },
]

export function EditMerchantPhotosCard({
  disabled = false,
  onAddPhoto,
}: EditMerchantPhotosCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newPhoto, setNewPhoto] = useState<PhotoItem | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setNewPhoto({
        id: 'p-new',
        label: 'ĐÈN ĐÊM & TRỤ PCCC (ĐÃ NỘP)',
        filename: file.name,
        url: previewUrl,
        isMandatoryNew: true,
      })
      onAddPhoto?.(file)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xs border border-slate-200/80">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#eff4ff] text-[#455f87] flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5 text-[#455f87]" />
          </div>
          <h2 className="font-sora text-base sm:text-lg text-[#131b2e] font-bold">
            Hình Ảnh Hiện Trường &amp; Thẩm Định PCCC Bổ Sung
          </h2>
        </div>
        <span className="font-mono text-xs text-[#d95f00] font-bold bg-[#ffdbca]/40 px-2.5 py-1 rounded-md border border-[#d95f00]/20">
          TỐI THIỂU 4 ẢNH CHUẨN
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Existing Approved Photos */}
        {initialPhotos.map((photo) => (
          <div key={photo.id} className="space-y-1.5">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
              <img
                src={photo.url}
                alt={photo.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#131b2e]/80 text-white font-mono text-[10px] font-bold backdrop-blur-2xs">
                {photo.label}
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-500 truncate">{photo.filename}</p>
          </div>
        ))}

        {/* Mandatory Additional Photo (Slot 4) */}
        <div className="space-y-1.5">
          <input
            type="file"
            ref={fileInputRef}
            disabled={disabled}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
          />

          {newPhoto ? (
            <div
              onClick={() => !disabled && fileInputRef.current?.click()}
              className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border-2 border-emerald-500 cursor-pointer group"
            >
              <img
                src={newPhoto.url}
                alt={newPhoto.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                ĐÃ BỔ SUNG
              </span>
            </div>
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video rounded-xl bg-[#ffdbca]/30 border-2 border-dashed border-[#d95f00]/40 flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-[#ffdbca]/50 hover:border-[#d95f00] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Camera className="w-6 h-6 text-[#d95f00] group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[11px] font-bold text-[#d95f00] mt-1">
                Đèn Đêm &amp; Trụ PCCC
              </span>
              <span className="font-mono text-[9px] text-slate-500 font-medium">
                (Bắt buộc tải bổ sung)
              </span>
            </button>
          )}

          <p className="font-mono text-[11px] text-[#d95f00] truncate font-semibold">
            {newPhoto ? newPhoto.filename : 'Bổ sung theo BB-04'}
          </p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-[#eff4ff] text-slate-700 text-xs sm:text-sm flex items-start gap-2.5 border border-slate-200">
        <Info className="w-4 h-4 text-[#455f87] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Tệp hỗ trợ: JPG, PNG độ phân giải tối thiểu 1920x1080px. Đã đính kèm chứng chỉ kiểm định
          PCCC định kỳ số <strong>448/PC07</strong> cấp ngày 15/01/2026.
        </p>
      </div>
    </div>
  )
}
