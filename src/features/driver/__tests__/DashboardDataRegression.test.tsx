import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { apiClient } from '@/shared/api/client'
import { fetchDriverDashboardData } from '../api/driverApi'
import { QrCheckoutModal } from '../components/QrCheckoutModal'
import { ActiveTripCard } from '../components/ActiveTripCard'
import { MemoryRouter } from 'react-router-dom'
import type { BookingDto } from '../types/driverTypes'

vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn() } }))
const parked: BookingDto = {
  id: 7, bookingCode: 'BK-REAL-PARKED-7', status: 'PARKING', vehicleLicensePlate: '51C-77777',
  parkingLotName: 'Bãi thật', parkingLotAddress: 'Địa chỉ thật', expectedCheckInTime: '2026-11-17T10:00:00',
  expectedCheckOutTime: '2026-11-17T12:00:00', checkInTime: '2026-11-17T10:05:00', hourlyRate: 50000,
}
const pending: BookingDto = { ...parked, id: 9, bookingCode: 'BK-UNPAID-9', status: 'PENDING_PAYMENT', checkInTime: undefined }
beforeEach(() => vi.resetAllMocks())
afterEach(cleanup)

describe('dashboard uses server trips and codes', () => {
  it('finds the actual parked trip on later pages instead of selecting the latest unpaid booking', async () => {
    vi.mocked(apiClient.get).mockImplementation(async (url, config) => {
      const page = config?.params && typeof config.params === 'object' && 'page' in config.params ? config.params.page : undefined
      const data = url === '/api/v1/vehicles' ? { totalElements: 3 }
        : url === '/api/v1/users/me' ? { fullName: 'Tên thật', phone: '0901234567' }
        : url === '/api/v1/queues/me' ? null
        : { content: page === 0 ? [pending] : [parked, { ...parked, id: 5, status: 'COMPLETED' }], totalElements: 3, totalPages: 2 }
      return { data: { data } }
    })
    const result = await fetchDriverDashboardData()
    expect(result.activeBooking?.bookingCode).toBe(parked.bookingCode)
    expect(result.activeCount).toBe(1)
    expect(result.bookingTotal).toBe(3)
    expect(result.driverName).toBe('Tên thật')
    expect(result.queueCount).toBe(0)
    expect(apiClient.get).toHaveBeenCalledWith('/api/v1/bookings', expect.objectContaining({ params: { page: 1, size: 100 } }))
  })

  it('preserves zero amounts and does not count unpaid bookings as parked', async () => {
    vi.mocked(apiClient.get).mockImplementation(async url => ({ data: { data: url.includes('vehicles') ? { totalElements: 1 }
      : url.includes('bookings') ? { content: [{ ...pending, advanceDeposit: 0, totalAmount: 0 }], totalElements: 1, totalPages: 1 }
      : null } }))
    const result = await fetchDriverDashboardData()
    expect(result.activeCount).toBe(0)
    expect(result.activeBooking).toMatchObject({ id: 9, depositAmount: 0, totalPrice: 0, remainingAmount: 0 })
  })

  it('does not use terminal bookings as an active trip or fabricate queue counts on failure', async () => {
    vi.mocked(apiClient.get).mockImplementation(async url => {
      if (url === '/api/v1/queues/me') throw new Error('Offline')
      return { data: { data: url.includes('vehicles') ? { totalElements: 1 }
        : url.includes('bookings') ? { content: [{ ...parked, status: 'EXPIRED' }], totalElements: 1, totalPages: 1 } : null } }
    })
    const result = await fetchDriverDashboardData()
    expect(result.activeBooking).toBeUndefined()
    expect(result.queueCount).toBeNull()
  })

  it('does not supply sample trips when the booking API fails', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Không tải được dữ liệu'))
    await expect(fetchDriverDashboardData()).rejects.toThrow('Không tải được dữ liệu')
  })

  it('shows an unpaid order without check-out actions or fabricated parking details', () => {
    render(<MemoryRouter><ActiveTripCard booking={{ ...pending, depositAmount: 0, totalPrice: 0 }} onOpenQr={vi.fn()} /></MemoryRouter>)
    expect(screen.getByText('Số đơn: #9')).toBeInTheDocument()
    expect(document.body.innerHTML).not.toContain(pending.bookingCode)
    expect(screen.queryByRole('button', { name: /QR/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Thanh toán cọc' })).toHaveAttribute('href', '/bookings?bookingId=9')
    for (const fake of ['BERTH C-12', '51R-024.89', '03h 45m', 'Khớp biển số ALPR', '380V']) expect(screen.queryByText(fake)).not.toBeInTheDocument()
    expect(screen.getByText('Chưa check-in')).toBeInTheDocument()
  })

  it.each(['PENDING_PAYMENT', 'PENDING_CHECKIN', 'AWAITING_FINAL_PAYMENT', 'COMPLETED'] as const)('does not issue a checkout QR for %s', status => {
    render(<QrCheckoutModal open booking={{ ...parked, status }} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders and copies the exact server code without adding an OUT suffix', async () => {
    const user = userEvent.setup()
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(<QrCheckoutModal open booking={parked} onClose={vi.fn()} />)
    expect(screen.getByRole('img', { name: `QR xuất bãi ${parked.bookingCode}` })).toBeInTheDocument()
    expect(screen.queryByText(`${parked.bookingCode}-OUT`)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Sao chép mã vé' }))
    expect(write).toHaveBeenCalledExactlyOnceWith(parked.bookingCode)
    expect(await screen.findByText('Đã sao chép mã vé')).toBeInTheDocument()
  })
})
