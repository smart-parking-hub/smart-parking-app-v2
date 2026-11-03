import {
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
  onOpenRegister?: () => void
}

export function VehicleMasterTable({
  vehicles,
  onSetDefault,
  onEdit,
  onViewDossier,
  onDelete,
  onOpenRegister,
}: VehicleMasterTableProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Title strip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg md:text-xl font-bold font-sora text-slate-900">
            Danh Mục Phương Tiện Quản Lý
          </h2>
          <span className="bg-slate-200 text-slate-800 text-xs font-mono font-bold px-2 py-0.5 rounded">
            {vehicles.length} XE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider hidden sm:inline">
            TỰ ĐỘNG ĐỒNG BỘ CẢNG BIỂN &amp; TRẠM CÂN ALPR
          </span>
        </div>
      </div>

      {/* Master Table Card - Perfectly fits full width with ZERO horizontal scroll */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden w-full">
        <div className="w-full overflow-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-3.5 font-semibold w-[27%]">
                  Phương Tiện / Biển Số
                </th>
                <th className="py-3 px-3 font-semibold w-[22%]">
                  Cấu Hình Quy Cách
                </th>
                <th className="py-3 px-3 font-semibold w-[15%]">
                  Tải Trọng Kéo Theo
                </th>
                <th className="py-3 px-3 font-semibold w-[14%]">
                  Hạn Kiểm Định
                </th>
                <th className="py-3 px-2 font-semibold w-[9%] text-center">
                  ALPR
                </th>
                <th className="py-3 px-3.5 font-semibold w-[13%] text-right">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <p className="font-semibold text-base text-slate-700">Không tìm thấy phương tiện nào</p>
                    <p className="text-sm text-slate-400 mt-1.5">
                      Thử điều chỉnh từ khóa tìm kiếm hoặc đăng ký phương tiện mới vào danh mục.
                    </p>
                    {onOpenRegister && (
                      <button
                        type="button"
                        onClick={onOpenRegister}
                        className="mt-4 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        + Đăng Ký Phương Tiện Mới
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                    onClick={() => onViewDossier(v)}
                    title="Bấm để xem hồ sơ kỹ thuật chi tiết"
                  >
                    {/* 1. Plate & Brand */}
                    <td className="py-3.5 px-3.5 align-middle">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-base font-bold text-slate-900 tracking-tight">
                            {v.licensePlate}
                          </span>
                          {v.isDefault ? (
                            <span className="bg-orange-100 text-orange-800 border border-orange-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                              MẶC ĐỊNH
                            </span>
                          ) : v.vehicleClass === 'TRAILER' ? (
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                              RƠ-MOÓC
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-500 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                              DỰ PHÒNG
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-slate-700 text-xs truncate max-w-[200px]">
                          {v.brandModel}
                        </div>
                      </div>
                    </td>

                    {/* 2. Specs */}
                    <td className="py-3.5 px-3 align-middle">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900 text-xs md:text-sm truncate">
                          {v.specDetails}
                        </span>
                        {v.needsShorePower && (
                          <span className="text-[10px] font-medium text-orange-700 bg-orange-50 border border-orange-200/80 px-1.5 py-0.2 rounded w-max">
                            Điện 3-Pha bãi
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 3. Axle Tonnage */}
                    <td className="py-3.5 px-3 align-middle font-mono">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-orange-600 text-xs md:text-sm">
                          {v.towingWeightTon} Tấn
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Bản thân: {v.curbWeightTon}T
                        </span>
                      </div>
                    </td>

                    {/* 4. Inspection Expiry */}
                    <td className="py-3.5 px-3 align-middle font-mono">
                      <div className="flex flex-col gap-0.5">
                        <span className="bg-slate-900 text-white text-[11px] font-semibold px-2 py-0.5 rounded w-max">
                          {v.inspectionExpiryDate}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          {v.inspectionRemainingText}
                        </span>
                      </div>
                    </td>

                    {/* 5. Barie ALPR Gateway */}
                    <td className="py-3.5 px-2 align-middle text-center">
                      <div
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full"
                        title="Barie ALPR nhận diện tự động"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span>Online</span>
                      </div>
                    </td>

                    {/* 6. Action buttons */}
                    <td
                      className="py-3.5 px-3.5 align-middle text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {!v.isDefault && (
                          <button
                            type="button"
                            onClick={() => onSetDefault(v.id)}
                            className="px-1.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer"
                            title="Đặt làm phương tiện mặc định"
                          >
                            Chọn mặc định
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onViewDossier(v)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Xem hồ sơ kiểm định"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(v)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Chỉnh sửa xe"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={v.isDefault}
                          onClick={() => onDelete(v)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            v.isDefault
                              ? 'opacity-20 cursor-not-allowed text-slate-300'
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
        <div className="p-3.5 sm:p-4 bg-slate-50/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-orange-600 shrink-0" />
            <span>
              Mẹo: Nhấp vào bất kỳ hàng nào để xem đầy đủ số khung, số máy, tem kiểm định và bảo hiểm TNDS.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-mono font-semibold">
            <span>HIỂN THỊ: {vehicles.length}/{vehicles.length} PHƯƠNG TIỆN</span>
          </div>
        </div>
      </div>
    </div>
  )
}
