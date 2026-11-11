import { useEffect, useRef } from 'react'
import { Timer, X } from 'lucide-react'
import { ReservationFlow } from '@/features/booking-flow'
import './inline-quick-book.css'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

export interface InlineQuickBookPanelProps {
  open: boolean
  onClose: () => void
  lot?: ParkingLotItem
  onConfirmSuccess?: (reservationCode: string) => void
}

export function InlineQuickBookPanel({
  open,
  onClose,
  lot,
}: InlineQuickBookPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const isOpen = open && Boolean(lot)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Scroll lock cleanup
  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  // Keep keyboard focus inside the dialog and restore it to its trigger
  useEffect(() => {
    if (!isOpen) return
    const previousFocus = document.activeElement
    const panel = panelRef.current

    const getFocusable = () => {
      if (!panel) return []
      return Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0)
    }

    const initialTimer = setTimeout(() => {
      const focusable = getFocusable()
      if (focusable.length > 0) {
        const closeBtn = panel?.querySelector<HTMLElement>('button.quick-hold__close')
        if (closeBtn) {
          closeBtn.focus()
        } else {
          focusable[0].focus()
        }
      }
    }, 50)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !panel) return

      const focusable = getFocusable()
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(initialTimer)
      window.removeEventListener('keydown', handleKeyDown)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [isOpen])

  if (!open || !lot) return null

  return (
    <div
      className="quick-hold-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Panel giữ chỗ nhanh"
        aria-describedby="quick-hold-description"
        className="quick-hold"
      >
        <header className="quick-hold__header">
          <div>
            <div className="quick-hold__eyebrow">
              <Timer size={14} /> GIỮ CHỖ NHANH · SERVER BOOKING
            </div>
            <h2>Đặt giữ chỗ nhanh</h2>
            <p id="quick-hold-description">
              Tạo booking thật với xe đã đăng ký. Hạn thanh toán cọc 15 phút theo quy định server.
            </p>
          </div>
          <button
            type="button"
            className="quick-hold__close"
            onClick={onClose}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </header>

        <div className="quick-hold__flow">
          <ReservationFlow key={lot.id} lotId={lot.id} />
        </div>
      </div>
    </div>
  )
}

export const QuickBookingDrawer = InlineQuickBookPanel

