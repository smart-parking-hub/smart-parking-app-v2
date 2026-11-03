import { Star } from 'lucide-react'
import type { DriverReviewItem } from '../types/parkingDetailTypes'

interface DriverReviewsSectionProps {
  reviews: DriverReviewItem[]
  totalReviewsCount: number
}

export function DriverReviewsSection({
  reviews,
  totalReviewsCount,
}: DriverReviewsSectionProps) {
  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Đánh Giá Bác Tài Thực Tế</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Chỉ tài xế đã thực hiện giao dịch quét biển qua bến mới có quyền nhận xét
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
          {totalReviewsCount} NHẬN XÉT
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 bg-slate-50 border border-slate-200/60 rounded-lg flex flex-col gap-2.5"
          >
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm font-mono shrink-0 shadow-xs">
                  {rev.authorInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">
                      {rev.authorName}{' '}
                      <span className="font-normal text-slate-500 text-xs">
                        ({rev.route})
                      </span>
                    </span>
                    <span className="text-xs font-mono text-[#455f87] bg-white border border-slate-200 px-2 py-0.5 rounded font-semibold">
                      {rev.vehiclePlate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 ml-1.5">
                      {rev.timeAgo}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed italic pl-1">
              &ldquo;{rev.comment}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
