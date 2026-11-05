import { useState, type FormEvent, type ChangeEvent } from 'react'
import {
  PlusCircle,
  Truck,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react'
import type { AddVehicleFormData, VehicleClassType } from '../types/vehicleTypes'

interface RegisterVehicleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddVehicleFormData) => Promise<void> | void
  isSubmitting?: boolean
}

export function RegisterVehicleModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: RegisterVehicleModalProps) {
  const [licensePlate, setLicensePlate] = useState('')
  const [vehicleClass, setVehicleClass] = useState<VehicleClassType>('CONTAINER')
  const [curbWeightTon, setCurbWeightTon] = useState('8.8')
  const [towingWeightTon, setTowingWeightTon] = useState('39.0')
  const [brandModel, setBrandModel] = useState('')
  const [manufactureYear, setManufactureYear] = useState('2022')
  const [isDefault, setIsDefault] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

  if (!isOpen) return null

  const handlePlateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.toUpperCase().replace(/\s+/g, '')
    setLicensePlate(formatted)
    if (formError) setFormError(null)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFileName(file.name)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(false)

    if (!licensePlate.trim()) {
      setFormError('Vui lòng nhập biển số phương tiện.')
      return
    }

    if (licensePlate.length < 7) {
      setFormError('Biển số không hợp lệ. Ví dụ định dạng: 51D-999.88 hoặc 51R-024.89.')
      return
    }

    const curb = parseFloat(curbWeightTon) || 0
    const towing = parseFloat(towingWeightTon) || 0
    const year = parseInt(manufactureYear, 10) || new Date().getFullYear()

    try {
      await onSubmit({
        licensePlate: licensePlate.trim(),
        vehicleClass,
        curbWeightTon: curb,
        towingWeightTon: towing,
        brandModel: brandModel.trim() || 'Xe tải thương mại tiêu chuẩn',
        manufactureYear: year,
        isDefault,
        registrationDocName: selectedFileName ?? undefined,
      })

      setFormSuccess(true)
      setLicensePlate('')
      setBrandModel('')
      setSelectedFileName(null)
      setIsDefault(false)

      setTimeout(() => {
        setFormSuccess(false)
        onClose()
      }, 1000)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi lưu phương tiện.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-[480px] max-h-[92vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header matching Image 2 */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between relative">
          <div className="flex items-start gap-3.5 pr-8">
            <div className="mt-0.5 text-orange-600 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sora font-bold text-slate-900 text-lg leading-tight">
                  Khai Báo Hồ Sơ Vận Hành
                </h3>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 tracking-wider uppercase shrink-0">
                  CHUẨN ĐĂNG KIỂM
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Đăng ký đầu kéo hoặc rơ-moóc mới vào danh mục đội xe. Dữ liệu sẽ tự động đồng bộ sang trạm cân và cổng ALPR.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {formSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Phương tiện đã được đăng ký và đồng bộ thành công vào hệ thống bãi!</span>
            </div>
          )}

          {formError && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. License Plate */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-reg-plate" className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Biển Số Phương Tiện <span className="text-orange-600">*</span>
            </label>
            <input
              id="modal-reg-plate"
              name="licensePlate"
              type="text"
              required
              value={licensePlate}
              onChange={handlePlateChange}
              placeholder="VD: 51D-999.88"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 tracking-wider"
            />
            <span className="text-[11px] text-slate-500">
              Nền vàng hoặc trắng, định dạng biển số xe tải / xe đầu kéo / rơ-moóc.
            </span>
          </div>

          {/* 2. Vehicle Class */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-reg-class" className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Phân Loại Kỹ Thuật <span className="text-orange-600">*</span>
            </label>
            <select
              id="modal-reg-class"
              name="vehicleClass"
              value={vehicleClass}
              onChange={(e) => setVehicleClass(e.target.value as VehicleClassType)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="CONTAINER">Đầu kéo Container (Tractor)</option>
              <option value="TRAILER">Rơ-moóc / Sơ-mi rơ-moóc (Trailer)</option>
              <option value="HEAVY">Xe tải nặng &gt; 15 Tấn</option>
              <option value="MEDIUM">Xe tải trung 5 - 15 Tấn</option>
              <option value="LIGHT">Xe tải nhẹ &lt; 5 Tấn</option>
            </select>
          </div>

          {/* 3. Weights 2 cols */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-reg-curb" className="text-xs font-bold text-slate-700 font-mono">
                Bản thân (Tấn)
              </label>
              <input
                id="modal-reg-curb"
                name="curbWeightTon"
                type="number"
                step="0.1"
                min="0"
                value={curbWeightTon}
                onChange={(e) => setCurbWeightTon(e.target.value)}
                placeholder="8.8"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-reg-towing" className="text-xs font-bold text-slate-700 font-mono">
                Kéo theo (Tấn)
              </label>
              <input
                id="modal-reg-towing"
                name="towingWeightTon"
                type="number"
                step="0.1"
                min="0"
                value={towingWeightTon}
                onChange={(e) => setTowingWeightTon(e.target.value)}
                placeholder="39.0"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* 4. Brand & Year 2 cols */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label htmlFor="modal-reg-brand" className="text-xs font-bold text-slate-700 font-mono">
                Nhãn Hiệu / Model
              </label>
              <input
                id="modal-reg-brand"
                name="brandModel"
                type="text"
                value={brandModel}
                onChange={(e) => setBrandModel(e.target.value)}
                placeholder="VD: Hyundai Xcient P440"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div className="col-span-1 flex flex-col gap-1.5">
              <label htmlFor="modal-reg-year" className="text-xs font-bold text-slate-700 font-mono">
                Năm SX
              </label>
              <input
                id="modal-reg-year"
                name="manufactureYear"
                type="number"
                min="1990"
                max="2030"
                value={manufactureYear}
                onChange={(e) => setManufactureYear(e.target.value)}
                placeholder="2022"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* 5. Document Upload Dropzone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 font-mono">
              Hồ Sơ Đăng Kiểm / Cà Vẹt (AI OCR)
            </label>
            <label
              htmlFor="modal-reg-doc"
              className="border-2 border-dashed border-slate-300 hover:border-orange-400 bg-slate-50/60 hover:bg-orange-50/30 rounded-xl p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1.5"
            >
              <input
                id="modal-reg-doc"
                name="registrationDoc"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
              {selectedFileName ? (
                <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  <span className="truncate max-w-[280px]">{selectedFileName}</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-7 h-7 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">
                    Tải lên tệp sổ kiểm định hoặc cà vẹt
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Hỗ trợ PDF, JPG, PNG (tối đa 10MB)
                  </span>
                </>
              )}
            </label>
          </div>

          {/* 6. Default Vehicle Checkbox */}
          <label htmlFor="modal-reg-default" className="flex items-start gap-3 cursor-pointer pt-1">
            <input
              id="modal-reg-default"
              name="isDefault"
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
            />
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-bold text-slate-900">
                Đặt làm phương tiện mặc định vận hành
              </span>
              <span className="text-xs text-slate-500">
                Tự động điền xe này khi tạo lượt đặt chỗ bãi hoặc nhận hàng tại cảng.
              </span>
            </div>
          </label>

          {/* Action Button - 100% width orange button matching Image 2 */}
          <div className="mt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Đang kết nối cổng ALPR...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Đăng Ký &amp; Đồng Bộ ALPR</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
