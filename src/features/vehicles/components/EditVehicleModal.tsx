import { useState, useEffect, type FormEvent } from 'react'
import { X, Edit3, Save, AlertCircle } from 'lucide-react'
import type { VehicleItem, VehicleClassType, VehicleStatusType } from '../types/vehicleTypes'

interface EditVehicleModalProps {
  vehicle: VehicleItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: number, data: Partial<VehicleItem>) => Promise<void> | void
  isSaving?: boolean
}

export function EditVehicleModal({
  vehicle,
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}: EditVehicleModalProps) {
  const [licensePlate, setLicensePlate] = useState('')
  const [vehicleClass, setVehicleClass] = useState<VehicleClassType>('CONTAINER')
  const [brandModel, setBrandModel] = useState('')
  const [curbWeightTon, setCurbWeightTon] = useState('8.8')
  const [towingWeightTon, setTowingWeightTon] = useState('39.0')
  const [status, setStatus] = useState<VehicleStatusType>('ACTIVE')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (vehicle) {
      setLicensePlate(vehicle.licensePlate)
      setVehicleClass(vehicle.vehicleClass)
      setBrandModel(vehicle.brandModel)
      setCurbWeightTon(vehicle.curbWeightTon.toString())
      setTowingWeightTon(vehicle.towingWeightTon.toString())
      setStatus(vehicle.status)
      setError(null)
    }
  }, [vehicle])

  if (!isOpen || !vehicle) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!licensePlate.trim()) {
      setError('Biển số không được để trống.')
      return
    }

    try {
      await onSave(vehicle.id, {
        licensePlate: licensePlate.trim().toUpperCase(),
        vehicleClass,
        brandModel: brandModel.trim(),
        curbWeightTon: parseFloat(curbWeightTon) || 0,
        towingWeightTon: parseFloat(towingWeightTon) || 0,
        status,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi khi cập nhật thông tin phương tiện.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-slate-900 text-base sm:text-lg">
                Cập Nhật Phương Tiện
              </h3>
              <p className="text-xs font-mono text-slate-500">MÃ HỒ SƠ: #VEH-{vehicle.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-plate" className="text-xs font-bold font-mono text-slate-700">
                Biển Số Xe *
              </label>
              <input
                id="edit-plate"
                name="licensePlate"
                type="text"
                required
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs md:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-class" className="text-xs font-bold font-mono text-slate-700">
                Phân Loại Xe *
              </label>
              <select
                id="edit-class"
                name="vehicleClass"
                value={vehicleClass}
                onChange={(e) => setVehicleClass(e.target.value as VehicleClassType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs md:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="CONTAINER">Đầu kéo Container</option>
                <option value="TRAILER">Rơ-moóc / Sơ-mi</option>
                <option value="HEAVY">Xe tải nặng (&gt;15T)</option>
                <option value="MEDIUM">Xe tải trung (5-15T)</option>
                <option value="LIGHT">Xe tải nhẹ (&lt;5T)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-brand" className="text-xs font-bold font-mono text-slate-700">
              Nhãn Hiệu / Tên Thương Mại
            </label>
            <input
              id="edit-brand"
              name="brandModel"
              type="text"
              value={brandModel}
              onChange={(e) => setBrandModel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs md:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-curb" className="text-xs font-bold font-mono text-slate-700">
                Tự trọng (Tấn)
              </label>
              <input
                id="edit-curb"
                name="curbWeightTon"
                type="number"
                step="0.1"
                value={curbWeightTon}
                onChange={(e) => setCurbWeightTon(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-towing" className="text-xs font-bold font-mono text-slate-700">
                Kéo theo (Tấn)
              </label>
              <input
                id="edit-towing"
                name="towingWeightTon"
                type="number"
                step="0.1"
                value={towingWeightTon}
                onChange={(e) => setTowingWeightTon(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-status" className="text-xs font-bold font-mono text-slate-700">
              Trạng Thái Vận Hành
            </label>
            <select
              id="edit-status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as VehicleStatusType)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs md:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="ACTIVE">Hoạt động bình thường (ACTIVE)</option>
              <option value="PENDING">Chờ kiểm duyệt ALPR (PENDING)</option>
              <option value="LOCKED">Khóa tạm thời bảo dưỡng (LOCKED)</option>
            </select>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs">
            Lưu ý: Thay đổi trọng tải sẽ yêu cầu hệ thống đồng bộ lại với cổng cân điện tử trước lượt vào bến kế tiếp.
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
