import { useState, useEffect } from 'react'
import { X, Send, Mail, CheckCircle2, Loader2 } from 'lucide-react'
import type { PaymentTransactionItem } from '../types/paymentTypes'
import { sendReceiptEmailApi } from '../api/paymentApi'

interface SendReceiptEmailModalProps {
  isOpen: boolean
  onClose: () => void
  item: PaymentTransactionItem | null
  defaultEmail: string
}

export function SendReceiptEmailModal({
  isOpen,
  onClose,
  item,
  defaultEmail,
}: SendReceiptEmailModalProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  // Sync defaultEmail when modal opens or item changes
  useEffect(() => {
    setEmail(defaultEmail)
  }, [defaultEmail, isOpen])

  // Escape key handler & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSending) {
        onClose()
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isSending, onClose])

  if (!isOpen || !item) return null

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSending) return

    setIsSending(true)
    try {
      await sendReceiptEmailApi(item.transactionCode, email)
      setIsSent(true)
      setTimeout(() => {
        setIsSent(false)
        onClose()
      }, 1000)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="send-email-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200 shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 id="send-email-modal-title" className="text-lg font-bold font-sora text-slate-900">
              Gửi Biên Lai / HĐĐT Qua Email
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {item.transactionCode} • {item.bookingCode}
            </p>
          </div>
        </div>

        <form onSubmit={handleSend} className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Bãi đỗ xe:</span>
              <span className="font-semibold text-slate-900">{item.parkingLotName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Số tiền:</span>
              <span className="font-bold text-slate-900 font-mono">
                {new Intl.NumberFormat('vi-VN').format(item.amount)} ₫
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="send-receipt-email-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Email Kế Toán Nhận Tệp
            </label>
            <input
              id="send-receipt-email-input"
              name="receiptEmail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="text-[11px] text-slate-500">
            Hệ thống sẽ gửi đính kèm file <strong>PDF HĐĐT TT78</strong> và <strong>XML ký số điện tử</strong>.
          </div>

          {isSent && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center border border-emerald-200 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã gửi email thành công!</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSending}
              aria-busy={isSending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{isSending ? 'Đang gửi...' : 'Gửi Ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
