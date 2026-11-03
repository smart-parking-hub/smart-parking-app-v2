import { useState } from 'react'
import { X, Star, Loader2 } from 'lucide-react'
import type { BookingItemDto } from '../types/bookingTypes'

interface ReviewBookingModalProps {
  isOpen: boolean
  onClose: () => void
  booking: BookingItemDto | null
  onSubmitReview: (rating: number, comment: string) => Promise<void>
}

export function ReviewBookingModal({
  isOpen,
  onClose,
  booking,
  onSubmitReview,
}: ReviewBookingModalProps) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !booking) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmitReview(rating, comment)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 relative border border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-[#d95f00] font-bold">
              ĐÁNH GIÁ CHUYẾN ĐI
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {booking.parkingLotName}
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          {/* Star selector */}
          <div className="flex flex-col items-center gap-1.5 py-2">
            <span className="font-semibold text-slate-700">Mức độ hài lòng:</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating !== null ? hoverRating : rating) >= star
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        active
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-100 text-slate-300'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-600">
              {rating === 5
                ? 'Tuyệt vời (5/5 sao)'
                : rating === 4
                  ? 'Rất tốt (4/5 sao)'
                  : rating === 3
                    ? 'Bình thường (3/5 sao)'
                    : rating === 2
                      ? 'Chưa hài lòng (2/5 sao)'
                      : 'Kém (1/5 sao)'}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700">
              Nhận xét chi tiết (Camera ALPR, an ninh bình dầu, phòng tắm, quán cơm...):
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm thực tế để hỗ trợ cộng đồng bác tài container..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#d95f00]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Để sau
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 bg-[#d95f00] hover:bg-[#b84e00] disabled:bg-slate-400 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <span>Gửi đánh giá</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
