import { useRef, useState } from 'react'
import { ImagePlus, Images, Trash2, Upload, AlertCircle, Info } from 'lucide-react'
import type { ParkingLotImageItem } from '../types/merchantParkingLotTypes'

interface CreateParkingLotPhotosCardProps {
  images: ParkingLotImageItem[]
  onImagesChange: (images: ParkingLotImageItem[]) => void
}

export function CreateParkingLotPhotosCard({ images, onImagesChange }: CreateParkingLotPhotosCardProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const acceptFiles = (files: File[]) => {
    setErrorMessage(null)
    const newItems: ParkingLotImageItem[] = []
    for (const file of files) {
      if (images.length + newItems.length >= 5) {
        setErrorMessage('Bạn có thể tải tối đa 5 ảnh. Hãy xóa một ảnh trước khi thêm ảnh mới.')
        break
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrorMessage(`Tệp "${file.name}" không hợp lệ. Vui lòng chọn ảnh JPG, PNG hoặc WebP.`)
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`Ảnh "${file.name}" vượt quá 5 MB. Vui lòng chọn ảnh nhỏ hơn.`)
        continue
      }
      newItems.push({ name: file.name, file, previewUrl: URL.createObjectURL(file), sizeBytes: file.size, isCover: images.length + newItems.length === 0 })
    }
    if (newItems.length) onImagesChange([...images, ...newItems])
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].previewUrl)
    onImagesChange(images.filter((_, i) => i !== index).map((image, i) => ({ ...image, isCover: i === 0 })))
    setErrorMessage(null)
  }

  return (
    <section className="registration-card" aria-labelledby="registration-photos-heading">
      <div className="registration-card-heading">
        <span className="registration-section-icon"><Images size={21} aria-hidden="true" /></span>
        <div>
          <h2 id="registration-photos-heading">Hình ảnh thực tế</h2>
          <p>Thêm ảnh để hồ sơ bãi đỗ rõ ràng và đầy đủ hơn.</p>
        </div>
        <span className="registration-photo-count" aria-live="polite">{images.length}/5 ảnh</span>
      </div>
      {errorMessage && <p role="alert" className="registration-alert"><AlertCircle size={18} />{errorMessage}</p>}
      {images.length > 0 && <div className="registration-photo-grid">
        {images.map((image, index) => <div className="registration-photo" key={image.previewUrl}>
          <div className="registration-photo-preview">
            <img src={image.previewUrl} alt={image.name} />
            {index === 0 && <span className="registration-cover-badge">Ảnh đại diện</span>}
            <button type="button" onClick={() => removeImage(index)} aria-label={`Xóa ảnh ${image.name}`}><Trash2 size={17} /></button>
          </div>
          <div className="registration-photo-caption"><strong title={image.name}>{image.name}</strong><span>{(image.sizeBytes / (1024 * 1024)).toFixed(2)} MB</span></div>
        </div>)}
      </div>}
      {images.length < 5 && <div className="registration-dropzone" data-dragging={dragging}
        onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false) }}
        onDrop={(event) => { event.preventDefault(); setDragging(false); acceptFiles(Array.from(event.dataTransfer.files)) }}>
        <span className="registration-upload-icon"><ImagePlus size={27} aria-hidden="true" /></span>
        <strong>Kéo thả ảnh bãi đỗ vào đây</strong>
        <p>Ảnh toàn cảnh, cổng ra vào hoặc khu vực đỗ xe</p>
        <input ref={fileInput} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only"
          aria-label="Chọn ảnh bãi đỗ" tabIndex={-1}
          onChange={(event) => { acceptFiles(Array.from(event.target.files ?? [])); event.target.value = '' }} />
        <button type="button" className="registration-button registration-button-secondary" onClick={() => fileInput.current?.click()}><Upload size={17} />Chọn ảnh từ thiết bị</button>
        <span className="registration-upload-limit">JPG, PNG, WebP · Tối đa 5 MB/ảnh · Tối đa 5 ảnh</span>
      </div>}
      <p className="registration-photo-note"><Info size={17} aria-hidden="true" /><span>Ảnh đầu tiên sẽ là ảnh đại diện bãi đỗ. Nên chọn ảnh toàn cảnh, rõ nét.</span></p>
    </section>
  )
}
