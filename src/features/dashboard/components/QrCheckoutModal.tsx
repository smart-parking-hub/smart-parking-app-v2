import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { BookingDto } from '../types/dashboardTypes'

interface QrCheckoutModalProps {
  open: boolean
  onClose: () => void
  booking?: BookingDto
}

export function QrCheckoutModal({
  open,
  onClose,
  booking,
}: QrCheckoutModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (!open) return null

  const bookingCode = booking?.bookingCode || 'BK-2026-9081'
  const licensePlate = booking?.vehicleLicensePlate || '51D-894.12'
  const gateName = booking?.gateName || 'Cổng B1'
  const yardName = booking?.parkingLotName || 'Bãi Sóng Thần 2'

  return (
    <div
      className="fixed inset-0 z-50 bg-[#131b2e]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 lg:p-8 flex flex-col items-center text-center relative border border-slate-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng cửa sổ"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Chip */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#ffdbca] text-[#341100] text-xs font-semibold mb-3 border border-[#ffb690]/40">
          <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
          ALPR FAST-CHECKOUT PASS
        </span>

        {/* Modal Title */}
        <h3 className="font-sora text-xl text-[#0d1c2e] font-bold">
          Mã QR Barie Xuất Bãi
        </h3>
        <p className="text-xs text-[#45464d] mt-1 mb-5 max-w-xs">
          Đưa mã này vào camera quét tự động tại Barie {gateName} ({yardName}).
        </p>

        {/* High-Fidelity Vector SVG QR Code */}
        <div className="p-4 bg-[#eff4ff] rounded-2xl mb-5 border border-blue-100 shadow-inner">
          <svg
            className="w-52 h-52 text-[#131b2e]"
            fill="currentColor"
            viewBox="0 0 160 160"
            role="img"
            aria-label="QR Code Checkout"
          >
            {/* Position Detection Squares Top-Left */}
            <rect height="40" rx="4" width="40" x="10" y="10" />
            <rect fill="#ffffff" height="24" width="24" x="18" y="18" />
            <rect height="12" width="12" x="24" y="24" />

            {/* Position Detection Squares Top-Right */}
            <rect height="40" rx="4" width="40" x="110" y="10" />
            <rect fill="#ffffff" height="24" width="24" x="118" y="18" />
            <rect height="12" width="12" x="124" y="24" />

            {/* Position Detection Squares Bottom-Left */}
            <rect height="40" rx="4" width="40" x="10" y="110" />
            <rect fill="#ffffff" height="24" width="24" x="18" y="118" />
            <rect height="12" width="12" x="24" y="124" />

            {/* Data blocks */}
            <rect height="10" width="10" x="60" y="20" />
            <rect height="10" width="15" x="80" y="15" />
            <rect height="10" width="30" x="65" y="40" />
            <rect height="15" width="15" x="20" y="65" />
            <rect height="10" width="20" x="45" y="70" />
            <rect height="25" width="15" x="75" y="65" />
            <rect height="15" width="15" x="100" y="60" />
            <rect height="20" width="20" x="125" y="70" />
            <rect height="10" width="30" x="20" y="90" />
            <rect height="20" width="20" x="65" y="100" />
            <rect height="10" width="15" x="95" y="95" />
            <rect height="15" width="25" x="120" y="105" />
            <rect height="15" width="35" x="65" y="130" />
            <rect height="15" width="15" x="110" y="130" />
            <rect height="10" width="15" x="135" y="135" />
          </svg>
        </div>

        {/* Ticket details strip */}
        <div className="w-full bg-[#e6eeff] p-3 rounded-xl font-mono text-xs text-[#0d1c2e] mb-5 border border-blue-200/60">
          MÃ VÉ: <strong className="text-[#d95f00]">{bookingCode}-OUT</strong> · BIỂN SỐ:{' '}
          <strong className="text-[#0d1c2e]">{licensePlate}</strong>
        </div>

        {/* Confirm & Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-11 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold transition-colors shadow-md cursor-pointer"
        >
          HOÀN TẤT &amp; ĐÓNG MÃ QR
        </button>
      </div>
    </div>
  )
}
