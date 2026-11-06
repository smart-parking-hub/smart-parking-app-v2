import { useEffect } from 'react'
import { X, ShieldCheck, Printer, CheckCircle2, FileText, Cpu, Truck, Zap, Thermometer } from 'lucide-react'
import type { VehicleItem } from '../types/vehicleTypes'

interface ViewInspectionDossierModalProps {
  vehicle: VehicleItem | null
  isOpen: boolean
  onClose: () => void
}

export function ViewInspectionDossierModal({
  vehicle,
  isOpen,
  onClose,
}: ViewInspectionDossierModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen || !vehicle) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspection-dossier-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="inspection-dossier-modal-title" className="font-sora font-bold text-slate-900 text-lg">
                  Hồ Sơ Kỹ Thuật &amp; Kiểm Định
                </h3>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                  {vehicle.licensePlate}
                </span>
                {vehicle.isDefault && (
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-orange-600 text-white">
                    MẶC ĐỊNH
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                CƠ SỞ DỮ LIỆU CỤC ĐĂNG KIỂM VIỆT NAM • XÁC THỰC CỔNG ALPR
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-6">
          {/* Status summary banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-mono uppercase">Trạng Thái Lưu Hành</p>
                <p className="text-sm font-bold text-white">
                  {vehicle.brandModel} ({vehicle.vehicleClassLabel})
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-md">
                <CheckCircle2 className="w-4 h-4" />
                ALPR 100% ONLINE
              </span>
            </div>
          </div>

          {/* Section 1: Thông tin đăng kiểm & tem */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <FileText className="w-4 h-4 text-orange-600" />
              <h4 className="font-sora font-bold text-xs uppercase tracking-wider text-slate-800">
                1. Giấy Chứng Nhận Kiểm Định &amp; Tem Lưu Hành
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1">Số Sổ Kiểm Định / Tem:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {vehicle.insuranceNumber.replace(/^Tem kiểm định:\s*/, '')}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1">Thời Hạn Hiệu Lực:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{vehicle.inspectionExpiryDate}</span>
                <span className="text-[11px] text-emerald-700 block mt-0.5 font-medium">
                  {vehicle.inspectionRemainingText}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1">Đơn Vị Đăng Kiểm:</span>
                <span className="font-semibold text-slate-800 text-sm">TT ĐK 50-03V (TP.HCM)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Trọng tải & Cấu hình trục */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Cpu className="w-4 h-4 text-orange-600" />
              <h4 className="font-sora font-bold text-xs uppercase tracking-wider text-slate-800">
                2. Thông Số Kỹ Thuật Trọng Tải &amp; Kích Thước
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1">Khối Lượng Bản Thân:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{vehicle.curbWeightTon} Tấn</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1">Khối Lượng Kéo Theo:</span>
                <span className="font-mono font-bold text-orange-600 text-sm">
                  {vehicle.towingWeightTon} Tấn
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1">Cấu Hình Trục:</span>
                <span className="font-mono font-semibold text-slate-900">{vehicle.axleConfig}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1">Quy Cách Kỹ Thuật:</span>
                <span className="font-semibold text-slate-800">{vehicle.specDetails}</span>
              </div>
            </div>

            {/* Chi tiết phụ về điện lạnh & bảo ôn */}
            {(vehicle.needsShorePower || vehicle.temperatureRange) && (
              <div className="flex flex-wrap items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs">
                {vehicle.needsShorePower && (
                  <div className="flex items-center gap-1.5 font-medium text-orange-800">
                    <Zap className="w-4 h-4 text-orange-600" />
                    <span>Yêu cầu cấp nguồn điện 3-Pha bãi (Cắm sạc container lạnh)</span>
                  </div>
                )}
                {vehicle.temperatureRange && (
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Thermometer className="w-4 h-4 text-slate-500" />
                    <span>Dải nhiệt độ bảo quản: {vehicle.temperatureRange}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Định danh số khung / số máy & Bảo hiểm */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <h4 className="font-sora font-bold text-xs uppercase tracking-wider text-slate-800">
                3. Định Danh Phương Tiện &amp; Cổng Nhận Diện ALPR
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1">Nguồn Gốc &amp; Đời Xe:</span>
                <span className="font-medium text-slate-900 block">{vehicle.originDetails}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1">Bảo Hiểm TNDS Bắt Buộc:</span>
                <span className="font-mono font-bold text-slate-900">{vehicle.insuranceNumber}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Bảo Việt Logistics</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block mb-1">Tích Hợp Cổng ALPR:</span>
                <span className="font-semibold text-emerald-700 block">{vehicle.alprSyncText}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">{vehicle.alprSubText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>In Phiếu Kỹ Thuật</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Đóng Hồ Sơ
          </button>
        </div>
      </div>
    </div>
  )
}
