import { useState, useRef } from 'react'
import {
  Images,
  UploadCloud,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { YardGalleryImage } from '../../types/merchantParkingLotTypes'

interface MerchantLotGalleryProps {
  images: YardGalleryImage[]
  onUploadImages?: (files: File[]) => Promise<void>
  uploading?: boolean
  disabled?: boolean
}

export function MerchantLotGallery({
  images,
  onUploadImages,
  uploading = false,
  disabled = false,
}: MerchantLotGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const fileList = Array.from(e.target.files)
    if (onUploadImages) {
      await onUploadImages(fileList)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const prevImage = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
  }

  const nextImage = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % images.length)
  }

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col gap-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-slate-800">
            <Images className="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold">
              Thư Viện Thực Tế Hạ Tầng Bãi Đỗ
            </h2>
            <p className="text-xs text-slate-500">
              Hình ảnh xác thực mặt bằng, hệ thống barie ALPR và trạm cấp nguồn
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#d5e3fc] text-[#0d1c2e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-xs lg:text-sm cursor-pointer border border-slate-200/70"
        >
          <UploadCloud className="w-4 h-4 text-slate-600" />
          <span>{uploading ? 'Đang tải ảnh...' : 'Tải thêm ảnh mới'}</span>
        </button>
      </div>

      {/* Grid 4 Images */}
      {images.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center flex flex-col items-center justify-center">
          <Images className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-xs text-slate-500">Chưa có ảnh thực tế bến bãi. Hãy tải ảnh lên.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="relative group rounded-xl overflow-hidden bg-[#131b2e] h-52 cursor-pointer shadow-xs border border-slate-200/40"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Cover Badge */}
              {img.isCover && (
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#d95f00] text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  Ảnh đại diện bìa
                </div>
              )}

              {/* Bottom Info & Zoom Icon */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between items-end text-white">
                <div>
                  <div className="text-xs sm:text-sm font-bold leading-snug drop-shadow-xs">
                    {img.title}
                  </div>
                  <div className="font-mono text-[11px] text-slate-200/80 drop-shadow-xs">
                    {img.subtitle}
                  </div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-xs flex items-center justify-center text-[#ffdbca] group-hover:bg-[#d95f00] group-hover:text-white transition-colors">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            {/* Close Button */}
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Đóng xem ảnh"
              className="absolute -top-12 right-0 p-2 text-white hover:text-[#d95f00] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Image Container */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center max-h-[75vh]">
              <img
                src={images[lightboxIndex].url}
                alt={images[lightboxIndex].title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />

              {/* Prev / Next controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    aria-label="Ảnh trước"
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-[#d95f00] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    aria-label="Ảnh tiếp theo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-[#d95f00] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Captions */}
            <div className="mt-3 text-center text-white">
              <h3 className="font-sora text-sm sm:text-base font-bold">
                {images[lightboxIndex].title}
              </h3>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {images[lightboxIndex].subtitle} ({lightboxIndex + 1} / {images.length})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
