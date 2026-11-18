import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  initialQuality?: number
  fileType?: string
  useWebWorker?: boolean
}

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  savedPercent: number
  previewUrl: string
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 0.6, // Tối đa ~600 KB
  maxWidthOrHeight: 1920, // Chuẩn Full HD
  initialQuality: 0.85,
  useWebWorker: true,
}

// Bỏ qua nén nếu file nhỏ hơn 300 KB và đã là định dạng nén chuẩn
const SKIP_THRESHOLD_BYTES = 300 * 1024

export function safeCreateObjectURL(file: Blob | File): string {
  return typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
    ? URL.createObjectURL(file)
    : ''
}

export function safeRevokeObjectURL(url: string): void {
  if (url && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(url)
  }
}

/**
 * Định dạng dung lượng byte sang KB hoặc MB dễ đọc
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Kiểm tra xem tệp có phải là ảnh được hỗ trợ không (JPG, PNG, WebP, HEIC)
 */
export function isSupportedImageFile(file: File): boolean {
  if (!file) return false
  const validMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ]
  if (validMimeTypes.includes(file.type.toLowerCase())) {
    return true
  }
  // Dự phòng kiểm tra theo phần mở rộng tên file nếu mimeType trên OS rỗng
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].includes(ext || '')
}

/**
 * Nén 1 tệp ảnh với Web Worker và tự động xoay EXIF
 */
export async function compressImageFile(
  file: File,
  customOptions?: CompressionOptions,
  onProgress?: (percent: number) => void,
): Promise<CompressionResult> {
  const originalSize = file.size

  // Nếu file đã nhỏ hơn ngưỡng và không phải file HEIC thì giữ nguyên
  const isHeic =
    file.type.toLowerCase().includes('heic') ||
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif')

  if (originalSize <= SKIP_THRESHOLD_BYTES && !isHeic) {
    onProgress?.(100)
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercent: 0,
      previewUrl: safeCreateObjectURL(file),
    }
  }

  // Tùy chọn định dạng đầu ra: Nếu PNG giữ nguyên để bảo toàn alpha channel, ngược lại đổi sang WebP
  const targetFileType =
    customOptions?.fileType ||
    (file.type === 'image/png' ? 'image/png' : 'image/webp')

  const options = {
    ...DEFAULT_OPTIONS,
    ...customOptions,
    fileType: targetFileType,
    onProgress: (p: number) => {
      onProgress?.(p)
    },
  }

  try {
    const compressedBlob = await imageCompression(file, options)

    // Tạo lại File với tên chuẩn và định dạng mở rộng tương ứng
    const ext = targetFileType === 'image/webp' ? '.webp' : targetFileType === 'image/png' ? '.png' : '.jpg'
    const newName = file.name.replace(/\.[^/.]+$/, '') + ext
    const compressedFile = new File([compressedBlob], newName, {
      type: targetFileType,
      lastModified: Date.now(),
    })

    const compressedSize = compressedFile.size
    const savedPercent =
      originalSize > 0
        ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
        : 0

    return {
      file: compressedFile,
      originalSize,
      compressedSize,
      savedPercent,
      previewUrl: safeCreateObjectURL(compressedFile),
    }
  } catch (error) {
    console.warn('Lỗi khi nén ảnh với Web Worker, sử dụng file gốc:', error)
    // Nếu nén thất bại do môi trường (ví dụ môi trường test jsdom không có Web Worker Canvas),
    // fallback trả về file gốc để không làm gián đoạn trải nghiệm người dùng
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercent: 0,
      previewUrl: safeCreateObjectURL(file),
    }
  }
}

/**
 * Nén danh sách nhiều ảnh tuần tự hoặc song song với callback tiến độ
 */
export async function compressMultipleImages(
  files: File[],
  onBatchProgress?: (current: number, total: number, percent: number) => void,
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = []
  const total = files.length

  for (let i = 0; i < total; i++) {
    const file = files[i]
    const res = await compressImageFile(file, undefined, (percent) => {
      onBatchProgress?.(i + 1, total, percent)
    })
    results.push(res)
  }

  return results
}
