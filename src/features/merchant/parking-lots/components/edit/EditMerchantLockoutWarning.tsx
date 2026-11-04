import { Lock, AlertCircle } from 'lucide-react'

interface EditMerchantLockoutWarningProps {
  status: string
}

export function EditMerchantLockoutWarning({ status }: EditMerchantLockoutWarningProps) {
  const isApproved = status === 'APPROVED'

  return (
    <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 shadow-sm animate-in fade-in">
      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 border border-amber-300">
        <Lock className="w-5 h-5" />
      </div>
      <div className="space-y-1 text-xs sm:text-sm">
        <h4 className="font-sora font-bold text-amber-900 flex items-center gap-2">
          <span>Hồ sơ hiện không thể chỉnh sửa</span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 uppercase">
            STATUS: {status}
          </span>
        </h4>
        <p className="text-amber-800 leading-relaxed">
          {isApproved ? (
            <>
              Hồ sơ bãi đỗ đã được <strong>phê duyệt chính thức (APPROVED)</strong> và đang mở bán
              dịch vụ cho các đoàn xe tải. Nhằm ngăn chặn gian lận vị trí và bảo đảm an toàn dữ liệu
              hành trình xe trên đường tới bãi, toàn bộ biểu mẫu đã được khóa. Nếu cần thay đổi thông
              số kỹ thuật lớn, vui lòng liên hệ Ban Quản Trị Hệ Thống.
            </>
          ) : (
            <>
              Hồ sơ bãi đỗ đang trong hàng đợi <strong>chờ thẩm định (PENDING_APPROVAL)</strong>. Vui
              lòng chờ Hội đồng Kỹ thuật Admin hoàn tất phúc tra hiện trường trước khi thực hiện chỉnh
              sửa bổ sung tiếp theo.
            </>
          )}
        </p>
        <div className="flex items-center gap-1.5 pt-1 text-amber-700 font-medium">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>Chỉ chỉnh sửa khi trạng thái là REJECTED hoặc CHANGES_REQUESTED.</span>
        </div>
      </div>
    </div>
  )
}
