import { useNavigate } from 'react-router-dom'
import { AlertCircle, Clock, XCircle, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react'
import type { MerchantParkingLotDetailData } from '../../types/merchantParkingLotTypes'

interface MerchantLotStatusBannersProps {
  lot: MerchantParkingLotDetailData
  ownershipVerified?: boolean
}

export function MerchantLotStatusBanners({
  lot,
  ownershipVerified = true,
}: MerchantLotStatusBannersProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-3">
      {/* 1. Ownership Warning */}
      {!ownershipVerified && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 shadow-2xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs lg:text-sm">
            <h4 className="font-bold">Chưa xác minh được quyền sở hữu bãi đỗ</h4>
            <p className="mt-0.5 text-amber-800">
              Bạn đang ở chế độ xem thông tin chỉ đọc (Read-only). Các thao tác cấu hình, chỉnh sửa hồ
              sơ và doanh thu bị khóa để bảo đảm an toàn dữ liệu.
            </p>
          </div>
        </div>
      )}

      {/* 2. Pending Approval */}
      {lot.status === 'PENDING_APPROVAL' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 shadow-2xs">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs lg:text-sm">
              <h4 className="font-bold text-blue-900">
                Hồ sơ bãi đỗ đang trong quá trình thẩm định của Ban Quản Trị Hệ Thống (Operations
                Admin)
              </h4>
              <p className="mt-0.5 text-blue-800">
                {lot.complianceNotice ||
                  'Sau khi Admin phê duyệt tiêu chuẩn PCCC và toạ độ thực địa, các tính năng Cấu hình Slot (SCR-032) và Bảng giá (SCR-033) sẽ tự động mở khóa để bãi bắt đầu đón tiếp xe tải.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/merchant/disputes')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-xs font-semibold shrink-0 cursor-pointer"
          >
            <span>Liên hệ điều phối viên</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Changes Requested */}
      {lot.status === 'CHANGES_REQUESTED' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl text-purple-950 shadow-2xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div className="text-xs lg:text-sm">
              <h4 className="font-bold text-purple-900">Admin yêu cầu bổ sung hồ sơ kỹ thuật</h4>
              <p className="mt-0.5 text-purple-800">
                Vui lòng cập nhật hình ảnh mặt bằng, kiểm định trạm cân hoặc giấy tờ an toàn PCCC để
                hoàn tất quá trình phê duyệt.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/merchant/parking-lots/${lot.id}/edit`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-xs font-semibold shrink-0 cursor-pointer"
          >
            <span>Bổ sung hồ sơ ngay (SCR-031)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. Rejected */}
      {lot.status === 'REJECTED' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-950 shadow-2xs">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs lg:text-sm">
              <h4 className="font-bold text-red-900">Hồ sơ bãi đỗ bị từ chối phê duyệt</h4>
              <p className="mt-0.5 text-red-800">
                Lý do: Hồ sơ thiếu giấy phép bến bãi theo quy chuẩn giao thông đường bộ hoặc toạ độ
                không khả dụng. Vui lòng rà soát lại thông tin.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/merchant/parking-lots/${lot.id}/edit`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-xs font-semibold shrink-0 cursor-pointer"
          >
            <span>Chỉnh sửa và nộp lại hồ sơ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 5. Suspended */}
      {lot.status === 'SUSPENDED' && (
        <div className="flex items-start gap-3 p-4 bg-slate-100 border border-slate-300 rounded-xl text-slate-800 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
          <div className="text-xs lg:text-sm">
            <h4 className="font-bold">Bãi đỗ đang tạm ngưng tiếp nhận đặt chỗ</h4>
            <p className="mt-0.5 text-slate-600">
              Cơ sở đang trong đợt bảo trì nâng cấp hạ tầng hoặc theo yêu cầu của đơn vị quản lý cảng
              biển.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
