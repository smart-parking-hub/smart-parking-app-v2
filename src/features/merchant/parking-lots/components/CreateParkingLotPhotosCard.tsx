import { useRef, useState } from 'react'
import { ImagePlus, Images, Trash2, Upload, AlertCircle, Info, Loader2, Star } from 'lucide-react'
import type { ParkingLotImageItem } from '../types/merchantParkingLotTypes'
import {
  compressImageFile,
  formatBytes,
  isSupportedImageFile,
} from '@/shared/utils/imageCompressionUtil'

interface CreateParkingLotPhotosCardProps {
  images: ParkingLotImageItem[]
  onImagesChange: (images: ParkingLotImageItem[]) => void
}

export function CreateParkingLotPhotosCard({ images, onImagesChange }: CreateParkingLotPhotosCardProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const acceptFiles = async (files: File[]) => {
    setErrorMessage(null)
    const validFiles: File[] = []

    for (const file of files) {
      if (images.length + validFiles.length >= 5) {
        setErrorMessage('Bạn có thể tải tối đa 5 ảnh. Hãy xóa một ảnh trước khi thêm ảnh mới.')
        break
      }
      if (!isSupportedImageFile(file)) {
        setErrorMessage(`Tệp "${file.name}" không hợp lệ. Vui lòng chọn ảnh JPG, PNG, WebP hoặc HEIC.`)
        continue
      }
      // Giới hạn ảnh gốc tối đa 10 MB trước khi nén để bảo vệ bộ nhớ thiết bị
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`Ảnh "${file.name}" vượt quá 10 MB. Vui lòng chọn ảnh nhỏ hơn.`)
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    // 1. Phản hồi tức thì: Đưa ngay ảnh vào danh sách hiển thị với previewUrl (0ms)
    const initialItems: ParkingLotImageItem[] = validFiles.map((file, idx) => ({
      name: file.name,
      file,
      previewUrl: URL.createObjectURL(file),
      sizeBytes: file.size,
      isCover: images.length === 0 && idx === 0,
    }))

    const combinedImages = [...images, ...initialItems]
    onImagesChange(combinedImages)

    // 2. Nén tối ưu ngầm qua Web Worker
    setCompressing(true)
    try {
      const updatedImages = [...combinedImages]
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        const targetIndex = images.length + i
        const result = await compressImageFile(file)

        if (updatedImages[targetIndex]) {
          updatedImages[targetIndex] = {
            ...updatedImages[targetIndex],
            name: result.file.name,
            file: result.file,
            sizeBytes: result.compressedSize,
          }
        }
      }
      onImagesChange(updatedImages)
    } catch (err) {
      console.warn('Lỗi khi nén ảnh ngầm, sử dụng ảnh gốc:', err)
    } finally {
      setCompressing(false)
    }
  }

  const removeImage = (index: number) => {
    const target = images[index]
    if (target?.previewUrl) {
      URL.revokeObjectURL(target.previewUrl)
    }
    const filtered = images.filter((_, i) => i !== index)
    const reindexed = filtered.map((image, i) => ({
      ...image,
      isCover: target?.isCover ? i === 0 : image.isCover,
    }))
    onImagesChange(reindexed)
    setErrorMessage(null)
  }

  const setCoverImage = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isCover: i === index,
    }))
    onImagesChange(updated)
  }

  return (
    <section className="registration-card" aria-labelledby="registration-photos-heading">
      <div className="registration-card-heading">
        <span className="registration-section-icon"><Images size={21} aria-hidden="true" /></span>
        <div>
          <h2 id="registration-photos-heading">Hình ảnh thực tế</h2>
          <p>Thêm ảnh để hồ sơ bãi đỗ rõ ràng và đầy đủ hơn (tự động nén siêu tốc).</p>
        </div>
        <span className="registration-photo-count" aria-live="polite">{images.length}/5 ảnh</span>
      </div>

      {errorMessage && (
        <p role="alert" className="registration-alert">
          <AlertCircle size={18} />
          {errorMessage}
        </p>
      )}

      {compressing && (
        <div className="flex items-center gap-2 p-2.5 mb-3 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
          <Loader2 size={16} className="animate-spin text-blue-600" />
          <span>Đang tối ưu dung lượng ảnh nền qua Web Worker...</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="registration-photo-grid">
          {images.map((image, index) => (
            <div className="registration-photo group" key={image.previewUrl}>
              <div className="registration-photo-preview relative">
                <img src={image.previewUrl} alt={image.name} className="w-full h-full object-cover" />
                
                {image.isCover ? (
                  <span className="registration-cover-badge flex items-center gap-1 bg-[#d95f00] text-white">
                    <Star size={12} fill="currentColor" /> Ảnh đại diện
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCoverImage(index)}
                    className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 hover:bg-[#d95f00] text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                    title="Đặt làm ảnh đại diện bìa"
                  >
                    Đặt làm ảnh bìa
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label={`Xóa ảnh ${image.name}`}
                  className="hover:scale-110 transition-transform cursor-pointer"
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <div className="registration-photo-caption">
                <strong title={image.name}>{image.name}</strong>
                <span className="text-slate-500 font-mono text-[11px]">
                  {formatBytes(image.sizeBytes)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length < 5 && (
        <div
          className="registration-dropzone"
          data-dragging={dragging}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            void acceptFiles(Array.from(event.dataTransfer.files))
          }}
        >
          <span className="registration-upload-icon"><ImagePlus size={27} aria-hidden="true" /></span>
          <strong>Kéo thả ảnh bãi đỗ vào đây</strong>
          <p>Ảnh toàn cảnh, cổng ra vào hoặc khu vực đỗ xe</p>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
            className="sr-only"
            aria-label="Chọn ảnh bãi đỗ"
            tabIndex={-1}
            onChange={(event) => {
              const selected = Array.from(event.target.files ?? [])
              if (selected.length > 0) {
                void acceptFiles(selected)
              }
              event.target.value = ''
            }}
          />
          <button
            type="button"
            className="registration-button registration-button-secondary cursor-pointer"
            onClick={() => fileInput.current?.click()}
          >
            <Upload size={17} /> Chọn ảnh từ thiết bị
          </button>
          <span className="registration-upload-limit">
            JPG, PNG, WebP, HEIC · Tối đa 10 MB/ảnh · Tối đa 5 ảnh
          </span>
        </div>
      )}

      <p className="registration-photo-note">
        <Info size={17} aria-hidden="true" />
        <span>Ảnh có nhãn &quot;Ảnh đại diện&quot; sẽ xuất hiện đầu tiên trên kết quả tìm kiếm và bản đồ.</span>
      </p>
    </section>
  )
}
