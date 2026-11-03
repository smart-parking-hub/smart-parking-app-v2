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
          <span className="bg-slate-200 text-slate-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded">
            {vehicles.length} XE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider hidden sm:inline">
            TỰ ĐỘNG ĐỒNG BỘ CẢNG BIỂN &amp; TRẠM CÂN ALPR
          </span>
        </div>
      </div>

      {/* Master Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-mono text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-5 font-semibold w-[24%] min-w-[240px] whitespace-nowrap">
                  Phương Tiện / Biển Số
                </th>
                <th className="py-4 px-5 font-semibold w-[24%] min-w-[240px] whitespace-nowrap">
                  Cấu Hình Quy Cách
                </th>
                <th className="py-4 px-5 font-semibold w-[18%] min-w-[180px] whitespace-nowrap">
                  Tải Trọng Trục
                </th>
                <th className="py-4 px-5 font-semibold w-[14%] min-w-[150px] whitespace-nowrap">
                  Hạn Kiểm Định
                </th>
                <th className="py-4 px-5 font-semibold w-[10%] min-w-[130px] whitespace-nowrap">
                  Barie ALPR
                </th>
                <th className="py-4 px-5 font-semibold w-[10%] min-w-[140px] text-right whitespace-nowrap">
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
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* 1. Plate & Identity */}
                    <td className="py-5 px-5 align-middle">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2.5 whitespace-nowrap">
                          <span className="font-mono text-lg md:text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap">
                            {v.licensePlate}
                          </span>
                          {v.isDefault ? (
                            <span className="bg-orange-100 text-orange-800 border border-orange-200 text-xs font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">
                              MẶC ĐỊNH
                            </span>
                          ) : v.vehicleClass === 'TRAILER' ? (
                            <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-2 py-0.5 rounded uppercase whitespace-nowrap">
                              RƠ-MOÓC
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-500 text-xs font-mono font-bold px-2 py-0.5 rounded uppercase whitespace-nowrap">
                              DỰ PHÒNG
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-slate-800 text-sm md:text-base whitespace-nowrap">
                          {v.brandModel}
                        </div>
                        <div className="font-mono text-xs text-slate-500 whitespace-nowrap">
                          {v.originDetails}
                        </div>
                      </div>
                    </td>

                    {/* 2. Specs */}
                    <td className="py-5 px-5 align-middle">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-slate-900 text-sm md:text-base whitespace-nowrap">
                          {v.specDetails}
                        </span>
                        <span className="text-sm text-slate-600 whitespace-nowrap">{v.subSpecText}</span>
                        {v.needsShorePower && (
                          <div className="flex items-center gap-1.5 text-xs font-mono text-orange-700 bg-orange-50 px-2 py-0.5 rounded w-max border border-orange-200 whitespace-nowrap">
                            <Zap className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <span>Cần nguồn điện 3-Pha bãi</span>
                          </div>
                        )}
                        {v.temperatureRange && (
                          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 whitespace-nowrap">
                            <Thermometer className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Dải nhiệt: {v.temperatureRange}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 3. Axle Tonnage */}
                    <td className="py-5 px-5 align-middle">
                      <div className="flex flex-col gap-1 font-mono text-sm">
                        <div className="text-slate-800 whitespace-nowrap">
                          <span className="text-slate-500 font-normal">Bản thân:</span>{' '}
                          <span className="font-semibold">{v.curbWeightTon} Tấn</span>
                        </div>
                        <div className="text-slate-900 font-bold whitespace-nowrap">
                          <span className="text-slate-500 font-normal">Kéo theo:</span>{' '}
                          <span className="text-orange-600 font-bold">{v.towingWeightTon} Tấn</span>
                        </div>
                        <div className="text-xs text-slate-500 whitespace-nowrap">{v.axleConfig}</div>
                      </div>
                    </td>

                    {/* 4. Inspection Expiry */}
                    <td className="py-5 px-5 align-middle">
                      <div className="flex flex-col gap-1.5 whitespace-nowrap">
                        <span className="bg-slate-900 text-white font-mono text-xs font-semibold px-2.5 py-1 rounded w-max whitespace-nowrap">
                          {v.inspectionExpiryDate}
                        </span>
                        <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
                          {v.inspectionRemainingText}
                        </span>
                        <span className="text-xs font-mono text-slate-700 whitespace-nowrap">
                          {v.insuranceNumber}
                        </span>
                      </div>
                    </td>

                    {/* 5. Barie ALPR Gateway */}
                    <td className="py-5 px-5 align-middle">
                      <div className="flex flex-col gap-1 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 whitespace-nowrap">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="whitespace-nowrap">{v.alprSyncText}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
                          {v.alprSubText}
                        </span>
                      </div>
                    </td>

                    {/* 6. Action buttons */}
                    <td className="py-5 px-5 align-middle text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                        {!v.isDefault && (
                          <button
                            type="button"
                            onClick={() => onSetDefault(v.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
                            title="Đặt làm phương tiện mặc định"
                          >
                            Chọn mặc định
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onEdit(v)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Chỉnh sửa xe"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewDossier(v)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Xem hồ sơ kiểm định"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={v.isDefault}
                          onClick={() => onDelete(v)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
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
        <div className="p-4 bg-slate-50/90 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm text-slate-500">
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
