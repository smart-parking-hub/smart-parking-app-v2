import { useState, useRef, useEffect, useCallback } from 'react'
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

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const prevImage = useCallback(() => {
    setLightboxIndex((curr) => (curr === null ? null : (curr - 1 + images.length) % images.length))
  }, [images.length])

  const nextImage = useCallback(() => {
    setLightboxIndex((curr) => (curr === null ? null : (curr + 1) % images.length))
  }, [images.length])

  // A11y: Escape Key, Arrow Navigation & Body Scroll Lock
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox()
      } else if (e.key === 'ArrowLeft') {
        prevImage()
      } else if (e.key === 'ArrowRight') {
        nextImage()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [lightboxIndex, closeLightbox, prevImage, nextImage])

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
              Hình ảnh bãi đỗ
            </h2>
            <p className="text-xs text-slate-500">
              Ảnh mặt bằng và lối vào do chủ bãi cung cấp
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              role="button"
              tabIndex={0}
              aria-label={`Xem ảnh ${img.title}`}
              onClick={() => openLightbox(idx)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(idx) }
              }}
              className="group relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer shadow-2xs hover:shadow-md transition-all"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Cover Badge */}
              {img.isCover ? (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#d95f00] text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  Ảnh đại diện bìa
                </div>
              ) : (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0d1c2e]/85 backdrop-blur-xs text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  HẠ TẦNG
                </div>
              )}

              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-[#0d1c2e]/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-white text-center">
                <ZoomIn className="w-6 h-6 mb-1 text-white" />
                <span className="text-xs font-bold leading-tight line-clamp-1">{img.title}</span>
                <span className="text-[10px] opacity-80 mt-0.5 line-clamp-1">{img.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal (A11y: Escape Key, Arrow Nav, Scroll Lock) */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={images[lightboxIndex].title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        >
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
