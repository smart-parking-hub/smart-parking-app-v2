import { afterEach, expect, it, vi } from 'vitest'
import { AxiosError } from 'axios'
import { act, cleanup, render, renderHook, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BookingHoldRestrictionNotice, readHoldRestriction, useBookingHoldRestriction } from '../BookingHoldRestrictionNotice'

function restriction(reason: string, data: object = {}) {
  return Object.assign(new AxiosError('Request failed'), { response: { data: {
    success: false, code: `BOOKING_HOLD_${reason}`, message: 'Vui lòng xử lý lượt giữ chỗ trước.',
    data: { reason, ...data },
  } } })
}
afterEach(() => { cleanup(); vi.useRealTimers() })

it('offers the existing ticket returned by the server for a vehicle restriction', () => {
  render(<MemoryRouter><BookingHoldRestrictionNotice error={restriction('VEHICLE_LIMIT', { existingBookingId: 41 })}/></MemoryRouter>)
  expect(screen.getByRole('alert')).toHaveTextContent('Vui lòng xử lý lượt giữ chỗ trước.')
  expect(screen.getByRole('link', { name: 'Xem vé đang giữ' })).toHaveAttribute('href', '/bookings?bookingId=41')
})
it('offers the bookings list for the account quota without inventing another driver ticket', () => {
  render(<MemoryRouter><BookingHoldRestrictionNotice error={restriction('ACCOUNT_LIMIT')}/></MemoryRouter>)
  expect(screen.getByRole('link', { name: 'Xem các vé chờ cọc' })).toHaveAttribute('href', '/bookings')
  expect(screen.queryByRole('link', { name: 'Xem vé đang giữ' })).not.toBeInTheDocument()
})
it('uses the server Vietnam deadline and unblocks at that deadline without sending a request', () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-15T06:00:00Z'))
  const error = restriction('COOLDOWN', { retryAt: '2026-11-15T13:00:03' })
  const { result } = renderHook(() => useBookingHoldRestriction(error))
  expect(result.current.blocked).toBe(true); expect(result.current.remaining).toBe('0:03')
  act(() => { vi.advanceTimersByTime(3000) })
  expect(result.current.blocked).toBe(false); expect(result.current.remaining).toBe('0:00')
})
it('refreshes a payment-check countdown on focus after a suspended browser tab', () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-15T06:00:00Z'))
  const { result } = renderHook(() => useBookingHoldRestriction(restriction('PAYMENT_CHECK_PENDING', { retryAt: '2026-11-15T13:01:00' })))
  act(() => { vi.setSystemTime(new Date('2026-11-15T06:02:00Z')); window.dispatchEvent(new Event('focus')) })
  expect(result.current.blocked).toBe(false)
})
it('does not show a spam warning or countdown for a legacy rate-limit response', () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-15T06:00:00Z'))
  const error = restriction('RATE_LIMIT', { retryAt: '2026-11-16T13:00:00' })
  render(<MemoryRouter><BookingHoldRestrictionNotice error={error}/></MemoryRouter>)
  expect(screen.getByRole('alert')).toHaveTextContent('Chưa tạo được booking. Vui lòng thử lại.')
  expect(screen.getByRole('alert')).not.toHaveTextContent(/quá nhanh|thử lại sau|Có thể thử lại từ/)
})
it('never locks submission for a legacy rate-limit response even with a twelve-hour deadline', () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-15T06:00:00Z'))
  const { result } = renderHook(() => useBookingHoldRestriction(restriction('RATE_LIMIT', { retryAt: '2026-11-15T18:00:00Z' })))
  expect(result.current.blocked).toBe(false)
  expect(result.current.seconds).toBe(0)
})
it('renders the server retry time for an unconfirmed payment without labelling it a violation', () => {
  render(<MemoryRouter><BookingHoldRestrictionNotice error={restriction('PAYMENT_CHECK_PENDING', { retryAt: '2026-11-15T13:01:00' })}/></MemoryRouter>)
  expect(screen.getByRole('alert')).toHaveTextContent('Có thể thử lại từ')
  expect(screen.getByRole('alert')).toHaveTextContent('giờ Việt Nam')
  expect(screen.getByRole('alert')).not.toHaveTextContent('vi phạm')
})
it('handles unknown, malformed and generic errors without locking the form', () => {
  for (const error of [new Error('Bãi vừa hết chỗ'), restriction('OTHER'), restriction('COOLDOWN', { existingBookingId: -1 })]) {
    expect(readHoldRestriction(error)).toBeNull()
    const { result, unmount } = renderHook(() => useBookingHoldRestriction(error))
    expect(result.current.blocked).toBe(false); unmount()
  }
  const { result } = renderHook(() => useBookingHoldRestriction(restriction('COOLDOWN', { retryAt: 'invalid' })))
  expect(result.current.blocked).toBe(false)
})
