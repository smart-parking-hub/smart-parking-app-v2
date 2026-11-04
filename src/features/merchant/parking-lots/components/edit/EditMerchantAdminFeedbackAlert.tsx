import { Flag, Clock, ShieldCheck } from 'lucide-react'
import type { AdminReviewPoint } from '../../types/merchantParkingLotTypes'

interface EditMerchantAdminFeedbackAlertProps {
  reviewReason?: string
  reviewDate?: string
  reviewerName?: string
  reviewRound?: string
  reviewPoints?: AdminReviewPoint[]
}

const defaultReviewPoints: AdminReviewPoint[] = [
  {
    index: 1,
    title: 'Tọa độ GPS cổng vào:',
    description:
      'Tọa độ cổng vào khai báo (Kinh độ 106.8041520 E) bị lệch 15 mét so với tim đường Gò Cát, cần kéo lại ghim GPS đúng ngay cổng Barie tiếp nhận làn xe trọng tải lớn.',
  },
  {
    index: 2,
    title: 'Hệ thống chiếu sáng & PCCC:',
    description:
      'Ảnh chụp cổng vào ban đêm chưa thể hiện rõ hệ thống chiếu sáng đèn cao áp và họng trụ cứu hỏa D65 theo tiêu chuẩn an toàn bãi container.',
  },
  {
    index: 3,
    title: 'Tĩnh không hạ tầng:',
    description:
      'Cần tái xác nhận tĩnh không cổng đạt chuẩn tối thiểu 4.8m cho xe Container High Cube lưu thông an toàn.',
  },
]

export function EditMerchantAdminFeedbackAlert({
  reviewReason,
  reviewDate = '18/02/2026 - 15:30 ICT',
  reviewerName = 'Nguyễn Hoàng Nam (Chuyên viên Thẩm định Mặt bằng SmartTruck)',
  reviewRound = 'ĐỢT XÉT DUYỆT #02',
  reviewPoints = defaultReviewPoints,
}: EditMerchantAdminFeedbackAlertProps) {
  return (
    <div className="rounded-2xl bg-[#131b2e] text-white p-5 sm:p-6 space-y-4 shadow-md border border-slate-700/60">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#341100] text-[#d95f00] flex items-center justify-center shrink-0 border border-[#d95f00]/30 shadow-2xs">
            <Flag className="w-5 h-5 text-[#d95f00]" />
          </div>
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#ffdbca] font-bold">
              BIÊN BẢN YÊU CẦU BỔ SUNG TỪ HỘI ĐỒNG THẨM ĐỊNH ADMIN
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300 font-mono text-xs">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d95f00]" />
                {reviewDate}
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d95f00]" />
                Thẩm định viên: {reviewerName}
              </span>
            </div>
          </div>
        </div>

        <span className="self-start px-2.5 py-1 rounded-md bg-white/10 font-mono text-xs text-white border border-white/10 font-semibold">
          {reviewRound}
        </span>
      </div>

      {/* Main Review Reason text if provided directly */}
      {reviewReason && (
        <div className="p-3 bg-white/5 border border-amber-500/30 rounded-xl text-amber-200 text-xs sm:text-sm font-medium">
          <strong>Ý kiến chỉ đạo trực tiếp:</strong> {reviewReason}
        </div>
      )}

      {/* Structured Checklist points */}
      <div className="bg-white/5 rounded-xl p-4 sm:p-5 space-y-3 text-slate-200 text-xs sm:text-sm border border-white/5">
        {reviewPoints.map((point) => (
          <div key={point.index} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#341100] text-[#d95f00] text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#d95f00]/40">
              {point.index}
            </span>
            <p className="leading-relaxed">
              <strong className="text-white font-semibold">{point.title}</strong>{' '}
              <span className="text-slate-300">{point.description}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
