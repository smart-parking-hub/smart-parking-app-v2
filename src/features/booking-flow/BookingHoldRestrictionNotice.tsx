import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Notice, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { bookingTimeLabel, bookingTimestamp } from './time'

const detailsSchema = z.object({
  reason: z.enum(['VEHICLE_LIMIT', 'ACCOUNT_LIMIT', 'COOLDOWN', 'RATE_LIMIT', 'PAYMENT_CHECK_PENDING']),
  retryAt: z.string().nullish(), existingBookingId: z.number().int().positive().nullish(),
})
export function readHoldRestriction(error: unknown) {
  if (!isAxiosError<{code?: unknown; data?: unknown}>(error)) return null
  const response = error.response?.data
  if (!response || typeof response !== 'object' || typeof response.code !== 'string' || !response.code.startsWith('BOOKING_HOLD_')) return null
  const result = detailsSchema.safeParse(response.data)
  return result.success ? result.data : null
}
export function useBookingHoldRestriction(error: unknown) {
  const details = readHoldRestriction(error)
  const deadline = details?.retryAt ? bookingTimestamp(details.retryAt) : NaN
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!Number.isFinite(deadline)) return
    const tick = () => setTick(value => value + 1)
    const timer = window.setInterval(() => { tick(); if (Date.now() >= deadline) window.clearInterval(timer) }, 1000)
    window.addEventListener('focus', tick)
    return () => { window.clearInterval(timer); window.removeEventListener('focus', tick) }
  }, [deadline])
  const seconds = Number.isFinite(deadline) ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) : 0
  return { details, blocked: seconds > 0, remaining: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` }
}
export function BookingHoldRestrictionNotice({ error }: { error: unknown }) {
  const details = readHoldRestriction(error)
  return <Notice error><div className="min-w-0 space-y-2">
    <p>{errorMessage(error)}</p>
    {details?.retryAt && Number.isFinite(bookingTimestamp(details.retryAt)) && <p className="text-xs leading-relaxed">Có thể thử lại từ <strong>{bookingTimeLabel(details.retryAt)}</strong> (giờ Việt Nam). Khi đến giờ, bấm tạo booking để kiểm tra lại.</p>}
    {details?.existingBookingId && <Link className={`${secondary} !px-3 !py-2 !text-xs`} to={`/bookings?bookingId=${details.existingBookingId}`}>Xem vé đang giữ</Link>}
    {details?.reason === 'ACCOUNT_LIMIT' && <Link className={`${secondary} !px-3 !py-2 !text-xs`} to="/bookings">Xem các vé chờ cọc</Link>}
  </div></Notice>
}
