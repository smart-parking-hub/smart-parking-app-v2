import { useState } from 'react'
import { ImagePlus, Trash2, Upload, AlertCircle, ShieldAlert } from 'lucide-react'
import type { ParkingLotImageItem } from '../types/merchantParkingLotTypes'

interface CreateParkingLotPhotosCardProps {
  images: ParkingLotImageItem[]
  onImagesChange: (images: ParkingLotImageItem[]) => void
}

export function CreateParkingLotPhotosCard({
  images,
  onImagesChange,
}: CreateParkingLotPhotosCardProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null)
    const files = e.target.files
    if (!files || files.length === 0) return

    const selectedFiles = Array.from(files)
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSizeBytes = 5 * 1024 * 1024 // 5 MB

    const validNewItems: ParkingLotImageItem[] = []

    for (const file of selectedFiles) {
      if (images.length + validNewItems.length >= 5) {
        setErrorMessage('Chỉ được tải lên tối đa 05 bức ảnh hiện trường kiểm định.')
        break
      }

      if (!acceptedTypes.includes(file.type)) {
        setErrorMessage(`Tệp "${file.name}" không hợp lệ. Chỉ chấp nhận định dạng JPG, PNG hoặc WebP.`)
        continue
      }

      if (file.size > maxSizeBytes) {
        setErrorMessage(`Tệp "${file.name}" vượt quá 5.0 MB cho phép.`)
        continue
      }

      validNewItems.push({
        name: file.name,
        file,
        previewUrl: URL.createObjectURL(file),
        sizeBytes: file.size,
        isCover: images.length === 0 && validNewItems.length === 0,
      })
    }

    if (validNewItems.length > 0) {
      const updated = [...images, ...validNewItems].slice(0, 5)
      // Ensure first image is always marked as cover
      updated.forEach((img, idx) => {
        img.isCover = idx === 0
      })
      onImagesChange(updated)
    }

    // Reset input
    e.target.value = ''
  }

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove)
    // Re-assign cover tag to the new first item if any
    updated.forEach((img, idx) => {
      img.isCover = idx === 0
    })
    onImagesChange(updated)
    setErrorMessage(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl shadow-2xs border border-slate-200/80 flex flex-col gap-6">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="font-sora text-lg sm:text-xl text-[#0d1c2e] font-bold">
            Album Ảnh Hiện Trường Kiểm Định
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tải lên tối đa 05 tư liệu hình ảnh chất lượng cao để Ban Kiểm Chuẩn đối soát mặt bằng và cấp phép.
          </p>
        </div>
        <span className="font-mono text-xs text-[#0d1c2e] font-bold bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          {images.length}/5 TỆP ĐÃ TẢI LÊN
        </span>
      </div>

      {/* Error message banner */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div
            key={img.previewUrl + index}
            className="flex flex-col bg-[#eff4ff] rounded-xl overflow-hidden shadow-2xs border border-slate-200/80 group"
          >
            <div className="relative h-40 w-full overflow-hidden bg-slate-900">
              <img
                src={img.previewUrl}
                alt={img.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Cover Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-[#d95f00] text-white font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                  Ảnh Đại Diện Bìa
                </div>
              )}

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 w-7 h-7 bg-[#0d1c2e]/80 text-white rounded-md flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                title="Xóa bức ảnh này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 flex flex-col gap-0.5">
              <span className="text-xs font-bold text-[#0d1c2e] truncate">
                0{index + 1}. {img.name}
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                {formatFileSize(img.sizeBytes)}
              </span>
            </div>
          </div>
        ))}

        {/* Upload Action Card (Visible when < 5 images) */}
        {images.length < 5 && (
          <label className="sm:col-span-2 md:col-span-3 p-5 rounded-xl bg-[#eff4ff] hover:bg-[#d5e3fc]/40 border-2 border-dashed border-slate-300 hover:border-[#d95f00] transition-colors flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#d95f00] shrink-0 shadow-2xs border border-slate-200">
                <ImagePlus className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-xs sm:text-sm font-bold text-[#0d1c2e]">
                  Tải Lên Bổ Sung Góc Chụp Ranh Giới Hoặc Trụ Cứu Hỏa PCCC
                </span>
                <span className="font-mono text-[11px] text-slate-500 mt-0.5">
                  Định dạng hỗ trợ: JPG, PNG, WebP · Dung lượng &le; 5.0 MB mỗi tệp (Còn nhận thêm {5 - images.length} ảnh)
                </span>
              </div>
            </div>

            <div className="px-4 py-2 bg-white text-[#0d1c2e] hover:bg-slate-50 font-semibold text-xs rounded-lg shadow-2xs border border-slate-200 flex items-center gap-2 shrink-0">
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Chọn File Từ Máy</span>
            </div>
          </label>
        )}
      </div>

      {/* Note Ribbon */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 text-slate-600 text-xs border border-slate-200">
        <ShieldAlert className="w-4 h-4 text-[#d95f00] shrink-0 mt-0.5" />
        <span>
          <strong>Lưu ý nghiệp vụ:</strong> Tệp ảnh được mã hóa và lưu trữ an toàn sau khi tạo bãi. Bức ảnh đầu tiên tải lên sẽ tự động được đặt làm ảnh đại diện trên bản đồ tìm kiếm của tài xế.
        </span>
      </div>
    </div>
  )
}
