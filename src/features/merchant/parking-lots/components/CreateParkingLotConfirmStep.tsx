import { FileText, ShieldCheck, AlertCircle, Sparkles, RefreshCw } from 'lucide-react'
import type { AiContentSegments, ParkingLotImageItem } from '../types/merchantParkingLotTypes'

interface CreateParkingLotConfirmStepProps {
  values: {
    name: string
    address: string
    latitude: number
    longitude: number
  }
  images: ParkingLotImageItem[]
  aiContent: AiContentSegments | null
  uploadError?: string
  createdParkingLotId?: number
  onRetryUpload?: () => void
  submitting: boolean
}

export function CreateParkingLotConfirmStep({
  values,
  images,
  aiContent,
  uploadError,
  createdParkingLotId,
  onRetryUpload,
  submitting,
}: CreateParkingLotConfirmStepProps) {
  return (
    <section className="registration-card" aria-labelledby="registration-confirm-heading">
      <div className="registration-card-heading">
        <span className="registration-section-icon"><FileText size={21} aria-hidden="true" /></span>
        <div><h2 id="registration-confirm-heading">Kiểm tra thông tin đăng ký</h2><p>Hãy chắc chắn các thông tin dưới đây đã chính xác.</p></div>
      </div>
      {uploadError && createdParkingLotId && <div role="alert" className="registration-alert registration-upload-error">
        <AlertCircle size={20} />
        <div><strong>Bãi đỗ #{createdParkingLotId} đã được tạo. Ảnh chưa tải lên thành công.</strong><p>{uploadError}</p>
          {onRetryUpload && <button type="button" onClick={onRetryUpload} disabled={submitting} className="registration-button registration-button-secondary"><RefreshCw size={16} className={submitting ? 'animate-spin' : undefined} />Thử tải lại ảnh</button>}
        </div>
      </div>}
      <dl className="registration-summary">
        <div><dt>Tên bãi đỗ</dt><dd>{values.name || '—'}</dd></div>
        <div><dt>Địa chỉ bãi đỗ</dt><dd>{values.address || '—'}</dd></div>
        <div><dt>Tọa độ WGS-84</dt><dd className="registration-summary-coordinates"><span>Vĩ độ: {Number.isFinite(values.latitude) ? values.latitude.toFixed(7) : '—'}</span><span>Kinh độ: {Number.isFinite(values.longitude) ? values.longitude.toFixed(7) : '—'}</span></dd></div>
        {aiContent && <div><dt className="flex items-center gap-2"><Sparkles size={16} />Nội dung AI đã lưu</dt><dd><p>{aiContent.logisticsCapacity}</p><p>{aiContent.safetyRegulations}</p><p>{aiContent.circulationGuide}</p></dd></div>}
        <div><dt>Hình ảnh thực tế</dt><dd>
          <p>{images.length ? `${images.length} ảnh đã chọn` : 'Chưa có hình ảnh'}</p>
          {images.length > 0 && <div className="registration-summary-photos">{images.map((image, index) => <figure key={image.previewUrl}><img src={image.previewUrl} alt={image.name} />{index === 0 && <figcaption>Ảnh đại diện</figcaption>}</figure>)}</div>}
        </dd></div>
        <div><dt>Trạng thái sau khi gửi</dt><dd><span className="registration-pending-status"><span />Chờ phê duyệt</span></dd></div>
      </dl>
      <div className="registration-review-note"><ShieldCheck size={22} /><p><strong>Hồ sơ sẽ được quản trị viên xem xét</strong><br />Sau khi gửi, bãi đỗ sẽ ở trạng thái chờ phê duyệt. Bạn có thể theo dõi trạng thái trong danh sách bãi đỗ của mình.</p></div>
    </section>
  )
}
