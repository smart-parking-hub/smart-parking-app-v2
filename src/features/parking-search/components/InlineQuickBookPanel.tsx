import { useState, useEffect, useRef } from 'react'
import {
  Timer,
  X,
  Truck,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './inline-quick-book.css'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

interface InlineQuickBookPanelProps {
  open: boolean
  onClose: () => void
  lot?: ParkingLotItem
  onConfirmSuccess?: (reservationCode: string) => void
}

export function InlineQuickBookPanel({
  open,
  onClose,
  lot,
  onConfirmSuccess,
}: InlineQuickBookPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [reservationCode, setReservationCode] = useState('')
  const [secondsRemaining, setSecondsRemaining] = useState(600) // 10 minutes

  // Retrieve authenticated driver identity
  const [identity] = useState(() => {
    let phone = ''
    try {
      phone =
        (
          JSON.parse(
            localStorage.getItem('smart-truck-parking.auth') || '{}',
          ) as { phone?: string }
        ).phone || '0909 128 374'
    } catch {
      phone = '0909 128 374'
    }
    const name = localStorage.getItem('smart-truck-parking.driver_name') || 'Trần Quốc Tuấn'
    return { name, phone }
  })

  // Reset state on open and start countdown timer
  useEffect(() => {
    if (open) {
      setConfirmed(false)
      setSecondsRemaining(600)
      setReservationCode('')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // Countdown timer effect
  useEffect(() => {
    if (!open || confirmed) return
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [open, confirmed])

  // Keep keyboard focus inside the dialog and restore it to its trigger.
  useEffect(() => {
    if (!open || !lot) return
    const previousFocus = document.activeElement
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>('button')?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !panel) return
      const controls = panel.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]')
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [open, lot, onClose])

  if (!open || !lot) return null

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
  }

  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const progressPercent = (secondsRemaining / 600) * 100

  const handleConfirm = () => {
    const code = `BK-HOLD-2026-${Math.floor(1000 + Math.random() * 9000)}`
    try {
      localStorage.setItem(
        'smart-truck-parking.active_hold',
        JSON.stringify({
          code,
          parkingLotId: lot?.id,
          parkingLotName: lot?.name,
          heldAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        }),
      )
    } catch {
      // ignore storage errors
    }
    setReservationCode(code)
    setConfirmed(true)
    onConfirmSuccess?.(code)
  }

  return (
    <div className="quick-hold-backdrop" onClick={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Panel giữ chỗ nhanh 10 phút" aria-describedby="quick-hold-description" className="quick-hold">
        <header className="quick-hold__header">
          <div>
            <div className="quick-hold__eyebrow"><Timer size={14} /> GIỮ CHỖ NHANH · 10 PHÚT</div>
            <h2>Đặt giữ chỗ khẩn cấp (10 Phút)</h2>
            <p id="quick-hold-description">Bãi sẽ khóa chỗ ngay sau khi bạn xác nhận.</p>
          </div>
          <button type="button" className="quick-hold__close" onClick={onClose} aria-label="Đóng"><X size={20} /></button>
        </header>

        {confirmed ? (
          <section className="quick-hold__success" aria-live="polite">
            <CheckCircle2 size={42} />
            <h3>Giữ Chỗ Thành Công!</h3>
            <p>Mã giữ chỗ</p><strong className="quick-hold__code">{reservationCode}</strong>
            <dl className="quick-hold__receipt">
              <div><dt>Bãi đỗ</dt><dd>{lot.name}</dd></div>
              <div><dt>Biển số ALPR</dt><dd>51D-894.12 / 51R-024.89</dd></div>
              <div><dt>Thời hạn vào bãi</dt><dd>10 phút (Trước 14:45)</dd></div>
            </dl>
            <div className="quick-hold__actions">
              <button type="button" className="quick-hold__cancel" onClick={onClose}>Đóng</button>
              <Link to="/bookings" className="quick-hold__confirm"><QrCode size={18} /> Mở Vé QR &amp; Đặt Chỗ</Link>
            </div>
          </section>
        ) : (
          <>
            <section className="quick-hold__timer" aria-label="Thời gian giữ chỗ">
              <div className="quick-hold__timer-row"><div><span>THỜI GIAN CÒN LẠI</span><p>Giữ chỗ trong 10 phút</p></div><strong role="timer" aria-label="Thời gian còn lại">{formattedTime}</strong></div>
              <div className="quick-hold__track" aria-hidden="true"><div style={{ width: `${progressPercent}%` }} /></div>
              <p className="quick-hold__note">Quét mã tại barie trước khi hết giờ. Quá hạn, chỗ sẽ tự động được trả lại cho tài xế khác.</p>
            </section>

            <section className="quick-hold__lot" aria-label="Thông tin bãi đỗ">
              <div className="quick-hold__section-label"><MapPin size={15} /> BÃI XE ĐƯỢC CHỈ ĐỊNH</div>
              <h3>{lot.name}</h3>
              <dl className="quick-hold__lot-details">
                <div><dt>Đơn giá áp dụng</dt><dd>{formatCurrency(lot.hourlyRate)}<small> / giờ</small></dd></div>
                <div><dt>Tình trạng chỗ</dt><dd className="quick-hold__availability">{lot.slotTypeLabel}</dd></div>
              </dl>
            </section>

            <section className="quick-hold__vehicle" aria-label="Xe nhận chỗ và quét barie">
              <div className="quick-hold__vehicle-heading"><span className="quick-hold__section-label"><Truck size={16} /> PHƯƠNG TIỆN</span><span className="quick-hold__verified"><ShieldCheck size={14} /> Đã xác thực ALPR</span></div>
              <strong className="quick-hold__plate">51D-894.12 <span>Rơ-moóc 40FT</span></strong>
              <p>Tài xế: <span>{identity.name}</span></p>
            </section>

            <dl className="quick-hold__summary">
              <div><dt>Dự kiến đến (ETA)</dt><dd>{lot.etaMinutes} phút nữa <small>(14:35)</small></dd></div>
              <div><dt>Cọc giữ chỗ</dt><dd>{formatCurrency(lot.depositAmount)} <small>· Ví Ops</small></dd></div>
            </dl>
            <footer className="quick-hold__actions">
              <button type="button" className="quick-hold__cancel" onClick={onClose}>Hủy bỏ</button>
              <button type="button" className="quick-hold__confirm" onClick={handleConfirm}>Xác nhận giữ chỗ <ArrowRight size={17} /></button>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}

export const QuickBookingDrawer = InlineQuickBookPanel
