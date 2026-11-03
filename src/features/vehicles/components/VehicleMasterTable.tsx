import {
  Zap,
  Thermometer,
  Edit,
  Eye,
  Trash2,
  Info,
} from 'lucide-react'
import type { VehicleItem } from '../types/vehicleTypes'

interface VehicleMasterTableProps {
  vehicles: VehicleItem[]
  onSetDefault: (id: number) => void
  onEdit: (vehicle: VehicleItem) => void
  onViewDossier: (vehicle: VehicleItem) => void
  onDelete: (vehicle: VehicleItem) => void
}

export function VehicleMasterTable({
  vehicles,
  onSetDefault,
  onEdit,
  onViewDossier,
  onDelete,
}: VehicleMasterTableProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Title strip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base md:text-lg font-bold font-sora text-slate-900">
            Danh Mục Phương Tiện Quản Lý
          </h2>
          <span className="bg-slate-200 text-slate-800 text-xs font-mono font-bold px-2 py-0.5 rounded">
            {vehicles.length} XE
          </span>
        </div>
        <span className="font-mono text-xs text-slate-500 uppercase tracking-wider hidden sm:inline">
          TỰ ĐỘNG ĐỒNG BỘ CẢNG BIỂN
        </span>
      </div>

      {/* Master Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-mono text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4 font-semibold">Phương Tiện / Biển Số</th>
                <th className="py-3.5 px-4 font-semibold">Cấu Hình Quy Cách</th>
                <th className="py-3.5 px-4 font-semibold">Tải Trọng Trục</th>
                <th className="py-3.5 px-4 font-semibold">Hạn Kiểm Định</th>
                <th className="py-3.5 px-4 font-semibold">Barie ALPR</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <p className="font-semibold text-slate-700">Không tìm thấy phương tiện nào</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Thử điều chỉnh từ khóa tìm kiếm hoặc đăng ký phương tiện mới bên cạnh.
                    </p>
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* 1. Plate & Identity */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base md:text-lg font-bold text-slate-900 tracking-tight">
                            {v.licensePlate}
                          </span>
                          {v.isDefault ? (
                            <span className="bg-orange-100 text-orange-800 border border-orange-200 text-[11px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              MẶC ĐỊNH
                            </span>
                          ) : v.vehicleClass === 'TRAILER' ? (
                            <span className="bg-slate-100 text-slate-700 text-[11px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                              RƠ-MOÓC
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-500 text-[11px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                              DỰ PHÒNG
                            </span>
                          )}
                        </div>
                        <div className="font-medium text-slate-800 text-xs md:text-sm">
                          {v.brandModel}
                        </div>
                        <div className="font-mono text-[11px] text-slate-500">
                          {v.originDetails}
                        </div>
                      </div>
                    </td>

                    {/* 2. Specs */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-900 text-xs md:text-sm">
                          {v.specDetails}
                        </span>
                        <span className="text-xs text-slate-600">{v.subSpecText}</span>
                        {v.needsShorePower && (
                          <div className="flex items-center gap-1 text-[11px] font-mono text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded w-max border border-orange-200">
                            <Zap className="w-3.5 h-3.5 text-orange-600" />
                            <span>Cần nguồn điện 3-Pha bãi</span>
                          </div>
                        )}
                        {v.temperatureRange && (
                          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600">
                            <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                            <span>Dải nhiệt: {v.temperatureRange}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 3. Axle Tonnage */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col gap-0.5 font-mono text-xs">
                        <div className="text-slate-800">
                          <span className="text-slate-500">Bản thân:</span> {v.curbWeightTon} Tấn
                        </div>
                        <div className="text-slate-900 font-bold">
                          <span className="text-slate-500 font-normal">Kéo theo:</span> {v.towingWeightTon} Tấn
                        </div>
                        <div className="text-[11px] text-slate-500">{v.axleConfig}</div>
                      </div>
                    </td>

                    {/* 4. Inspection Expiry */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="bg-slate-900 text-white font-mono text-xs font-semibold px-2 py-0.5 rounded w-max">
                          {v.inspectionExpiryDate}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {v.inspectionRemainingText}
                        </span>
                        <span className="text-[11px] font-mono text-slate-700">
                          {v.insuranceNumber}
                        </span>
                      </div>
                    </td>

                    {/* 5. Barie ALPR Gateway */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <span className="w-2 h-2 rounded-full bg-slate-900" />
                          <span>{v.alprSyncText}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {v.alprSubText}
                        </span>
                      </div>
                    </td>

                    {/* 6. Action buttons */}
                    <td className="py-4 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!v.isDefault && (
                          <button
                            type="button"
                            onClick={() => onSetDefault(v.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-colors"
                            title="Đặt làm phương tiện mặc định"
                          >
                            Chọn mặc định
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onEdit(v)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          title="Chỉnh sửa xe"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewDossier(v)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          title="Xem hồ sơ kiểm định"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={v.isDefault}
                          onClick={() => onDelete(v)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            v.isDefault
                              ? 'opacity-30 cursor-not-allowed text-slate-400'
                              : 'hover:bg-rose-50 text-slate-600 hover:text-rose-600'
                          }`}
                          title={v.isDefault ? 'Không thể xóa xe mặc định' : 'Xóa phương tiện'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Meta Bar */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-orange-600 shrink-0" />
            <span>
              Lưu ý: Mọi phương tiện cập nhật tải trọng mới sẽ được đối soát tự động trong 15 phút với cơ sở dữ liệu đăng kiểm quốc gia.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-mono">
            <span>HIỂN THỊ: {vehicles.length}/{vehicles.length} PHƯƠNG TIỆN</span>
          </div>
        </div>
      </div>
    </div>
  )
}
