import { useState } from 'react'
import { MapPin, Navigation, RefreshCw, Info } from 'lucide-react'
import type { UseFormSetValue, FieldErrors } from 'react-hook-form'
import { CreateParkingLotMapPicker } from './CreateParkingLotMapPicker'

interface CreateParkingLotGeoCardProps {
  latitude: number
  longitude: number
  setValue: UseFormSetValue<{
    name: string
    address: string
    latitude: number
    longitude: number
  }>
  errors: FieldErrors<{
    name: string
    address: string
    latitude: number
    longitude: number
  }>
}

export function CreateParkingLotGeoCard({
  latitude,
  longitude,
  setValue,
  errors,
}: CreateParkingLotGeoCardProps) {
  const [locating, setLocating] = useState(false)
  const [accuracy, setAccuracy] = useState<number>()
  const [geoFeedback, setGeoFeedback] = useState<string | null>(null)

  const handleAcquireDeviceGps = () => {
    if (!navigator.geolocation) {
      setGeoFeedback('Trình duyệt của bạn không hỗ trợ Geolocation API.')
      return
    }

    setLocating(true)
    setGeoFeedback(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(7))
        const lng = Number(pos.coords.longitude.toFixed(7))
        setValue('latitude', lat, { shouldValidate: true })
        setValue('longitude', lng, { shouldValidate: true })
        setAccuracy(pos.coords.accuracy)
        setGeoFeedback(`Đã đồng bộ GPS thành công (Sai số: ±${Math.round(pos.coords.accuracy)}m)`)
        setLocating(false)
      },
      () => {
        setGeoFeedback('Không lấy được vị trí. Hãy cấp quyền định vị, nhập tọa độ hoặc chọn trên bản đồ.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setValue('latitude', lat, { shouldValidate: true })
    setValue('longitude', lng, { shouldValidate: true })
  }

  return (
    <section className="registration-card" aria-labelledby="registration-geo-heading">
      <div className="registration-card-heading">
        <span className="registration-section-icon"><MapPin size={21} aria-hidden="true" /></span>
        <div><h2 id="registration-geo-heading">Vị trí bãi đỗ</h2><p>Đặt ghim tại cổng vào để tài xế tìm đúng lối.</p></div>
      </div>
      <div className="registration-gps-banner">
        <div><Navigation size={19} /><span>Đang có mặt tại bãi đỗ?</span></div>
        <button type="button" className="registration-button registration-button-secondary" onClick={handleAcquireDeviceGps} disabled={locating} aria-busy={locating}>
          <RefreshCw size={16} className={locating ? 'animate-spin' : undefined} />{locating ? 'Đang lấy vị trí…' : 'Dùng vị trí hiện tại'}
        </button>
      </div>
      {geoFeedback && <p role="status" className="registration-geo-feedback"><Info size={16} />{geoFeedback}</p>}
      <div className="registration-coordinate-grid">
        {(['latitude', 'longitude'] as const).map((field) => {
          const value = field === 'latitude' ? latitude : longitude
          const label = field === 'latitude' ? 'Vĩ độ (Latitude)' : 'Kinh độ (Longitude)'
          return <div className="registration-field" key={field}>
            <label htmlFor={`lot-${field}-input`}>{label} <span aria-hidden="true">*</span></label>
            <div className="registration-input-wrap" data-invalid={Boolean(errors[field])}>
              <input id={`lot-${field}-input`} type="number" step="0.0000001"
                placeholder={field === 'latitude' ? 'Ví dụ: 10.762622' : 'Ví dụ: 106.660172'}
                value={Number.isFinite(value) ? value : ''}
                aria-required="true" aria-invalid={Boolean(errors[field])}
                aria-describedby={errors[field] ? `lot-${field}-error` : `lot-${field}-hint`}
                onChange={(event) => {
                  const next = parseFloat(event.target.value)
                  setValue(field, Number.isFinite(next) ? Number(next.toFixed(7)) : Number.NaN, { shouldValidate: true, shouldDirty: true })
                }} />
            </div>
            {errors[field] ? <p role="alert" id={`lot-${field}-error`} className="registration-field-error">{errors[field]?.message}</p>
              : <p id={`lot-${field}-hint`} className="registration-field-hint">{field === 'latitude' ? 'Từ -90 đến 90' : 'Từ -180 đến 180'} · Tọa độ WGS-84</p>}
          </div>
        })}
      </div>
      <CreateParkingLotMapPicker latitude={latitude} longitude={longitude} accuracy={accuracy} onCoordinatesChange={handleCoordinatesChange} />
    </section>
  )
}
