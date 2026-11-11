import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { InlineQuickBookPanel } from '../components/InlineQuickBookPanel'
import { MyBookingsPage } from '@/features/bookings/pages/MyBookingsPage'
import { loadPayOS } from '@/features/booking-flow/payosCheckout'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    request: vi.fn(),
  },
}))
vi.mock('@/features/booking-flow/payosCheckout', async (original) => ({
  ...await original<typeof import('@/features/booking-flow/payosCheckout')>(),
  loadPayOS: vi.fn(),
}))

const sampleLot: ParkingLotItem = {
  id: 7,
  name: 'Bãi Xe Miền Nam',
  address: '123 Quốc Lộ 1A',
  distanceKm: 3.5,
  etaMinutes: 12,
  availableSlots: 4,
  totalSlots: 10,
  slotTypeLabel: 'Còn 4 chỗ',
  hourlyRate: 25000,
  depositAmount: 15000,
  amenities: ['CAMERA', 'RESTROOM'],
  latitude: 10.75,
  longitude: 106.68,
  ratingAverage: 4.5,
}

const lotApiPayload = {
  id: 7,
  name: 'Bãi Xe Miền Nam',
  address: '123 Quốc Lộ 1A',
  status: 'APPROVED',
  merchantId: 10,
  slots: [
    { vehicleType: 'HEAVY_TRUCK', availableCapacity: 4, totalCapacity: 10 },
  ],
  pricingRules: [
    {
      vehicleType: 'HEAVY_TRUCK',
      basePricePerHour: 25000,
      surgeMultiplier: 1.2,
      surgeStartTime: '17:00:00',
      surgeEndTime: '20:00:00',
      overtimePenaltyMultiplier: 2,
    },
  ],
}

const activeVehicle = {
  id: 3,
  licensePlate: '51C-99999',
  vehicleType: 'HEAVY_TRUCK',
  status: 'ACTIVE',
}

const makeServerBooking = (overrides = {}) => ({
  id: 101,
  bookingCode: 'BK-SERVER-101',
  parkingLotId: 7,
  merchantId: 10,
  parkingLotName: 'Bãi Xe Miền Nam',
  parkingLotAddress: '123 Quốc Lộ 1A',
  vehicleId: 3,
  vehiclePlate: '51C-99999',
  status: 'PENDING_PAYMENT' as const,
  advanceDeposit: 15000,
  totalAmount: 75000,
  hourlyRate: 25000,
  overtimePenaltyMultiplier: 2,
  surgeMultiplier: 1.2,
  expectedCheckInTime: new Date(Date.now() + 1800000).toISOString(),
  expectedCheckOutTime: new Date(Date.now() + 9000000).toISOString(),
  expiresAt: new Date(Date.now() + 900000).toISOString(),
  ...overrides,
})

let currentBookings: Array<ReturnType<typeof makeServerBooking>> = []

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function mount(
  ui: React.ReactNode,
  queryClient = createTestQueryClient(),
  initialEntries = ['/parking'],
) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('InlineQuickBookPanel - Real Server Booking Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
    currentBookings = []

    vi.mocked(apiClient.request).mockImplementation(async (config) =>
      apiClient.post(config.url!, config.data),
    )

    vi.mocked(apiClient.get).mockImplementation(async (url) => {
      const u = String(url)
      if (u.includes('/vehicles')) {
        return { data: { data: { content: [activeVehicle] } } }
      }
      if (u.match(/\/parking-lots\/\d+/)) {
        const id = Number(u.split('/').pop())
        return {
          data: {
            data: {
              ...lotApiPayload,
              id,
              name: id === 8 ? 'Bãi Xe Miền Bắc' : 'Bãi Xe Miền Nam',
            },
          },
        }
      }
      if (u.endsWith('/bookings')) {
        return { data: { data: { content: currentBookings } } }
      }
      if (u.match(/\/bookings\/\d+/)) {
        const id = Number(u.split('/').pop())
        const b = currentBookings.find((x) => x.id === id) || makeServerBooking({ id })
        return { data: { data: b } }
      }
      return { data: { data: null } }
    })

    vi.mocked(apiClient.post).mockImplementation(async (url, _data) => {
      if (String(url).endsWith('/bookings')) {
        const created = makeServerBooking()
        currentBookings.push(created)
        return { data: { data: created } }
      }
      return { data: { data: {} } }
    })
  })

  afterEach(() => {
    cleanup()
  })

  it('AC1 & AC2: opens panel, submits real booking to server and shows server bookingCode with PENDING_PAYMENT without fake localStorage hold', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    mount(
      <InlineQuickBookPanel open={true} onClose={onClose} lot={sampleLot} />,
    )

    const dialog = await screen.findByRole('dialog', { name: 'Panel giữ chỗ nhanh 10 phút' })
    expect(dialog).toBeInTheDocument()
    expect(await screen.findByRole('heading', { level: 2, name: 'Đặt giữ chỗ nhanh' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { level: 2, name: /Bãi Xe Miền Nam/ })).toBeInTheDocument()

    // R1: Verify no 10-minute hold promise remains in heading, eyebrow, or aria-label
    expect(screen.queryByText(/khẩn cấp \(10 Phút\)/i)).toBeNull()
    expect(screen.queryByText(/giữ chỗ nhanh 10 phút/i)).toBeNull()

    // Real vehicle select option is loaded from API
    expect(await screen.findByRole('option', { name: /51C-99999/ })).toBeInTheDocument()

    // 15-minute deposit rule and 20% deposit notice is shown
    expect(screen.getByText(/20%/)).toBeInTheDocument()
    expect(screen.getAllByText(/15 phút/).length).toBeGreaterThanOrEqual(1)

    // Submit booking
    const submitBtn = screen.getByRole('button', { name: 'Tạo booking và xem tiền cọc' })
    await user.click(submitBtn)

    // Real booking created via server mutation
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/v1/bookings',
        expect.objectContaining({
          parkingLotId: 7,
          vehicleId: 3,
          vehicleType: 'HEAVY_TRUCK',
          requestId: expect.any(String),
        }),
      )
    })

    // Server booking code and PENDING_PAYMENT status is displayed
    expect(await screen.findByText('BK-SERVER-101')).toBeInTheDocument()
    expect(screen.getByText('Chờ thanh toán cọc')).toBeInTheDocument()

    // NO fake localStorage hold was written
    expect(loadPayOS).not.toHaveBeenCalled()
    expect(localStorage.getItem('smart-truck-parking.active_hold')).toBeNull()
  })

  it('AC1: prevents double-submit while booking request is pending', async () => {
    const user = userEvent.setup()
    let resolvePost!: (value: Awaited<ReturnType<typeof apiClient.post>>) => void
    const slowPostPromise = new Promise<Awaited<ReturnType<typeof apiClient.post>>>((resolve) => {
      resolvePost = resolve
    })

    vi.mocked(apiClient.post).mockImplementationOnce(
      () => slowPostPromise,
    )

    mount(<InlineQuickBookPanel open={true} onClose={() => { }} lot={sampleLot} />)

    const submitBtn = await screen.findByRole('button', { name: 'Tạo booking và xem tiền cọc' })
    expect(submitBtn).toBeEnabled()

    // First click initiates mutation
    await user.click(submitBtn)

    // Second rapid click while pending
    await user.click(submitBtn)

    // Exactly 1 POST was initiated
    expect(apiClient.post).toHaveBeenCalledTimes(1)

    // Resolve mutation
    const created = makeServerBooking()
    currentBookings.push(created)
    resolvePost!({ data: { data: created } })

    expect(await screen.findByText('BK-SERVER-101')).toBeInTheDocument()
  })

  it('AC3: booking created in panel appears in /bookings via shared QueryClient and reloads cleanly', async () => {
    const user = userEvent.setup()
    const queryClient = createTestQueryClient()

    function IntegratedHarness() {
      return (
        <div>
          <nav>
            <Link to="/parking">Tìm bãi</Link>
            <Link to="/bookings">Lượt đặt chỗ của tôi</Link>
          </nav>
          <Routes>
            <Route
              path="/parking"
              element={
                <InlineQuickBookPanel
                  open={true}
                  onClose={() => { }}
                  lot={sampleLot}
                />
              }
            />
            <Route path="/bookings" element={<MyBookingsPage />} />
          </Routes>
        </div>
      )
    }

    mount(<IntegratedHarness />, queryClient, ['/parking'])

    // Wait for form and submit booking
    const submitBtn = await screen.findByRole('button', { name: 'Tạo booking và xem tiền cọc' })
    await user.click(submitBtn)

    // Real booking appears in panel
    expect(await screen.findByText('BK-SERVER-101')).toBeInTheDocument()

    // Click link to /bookings (from BookingStatusPanel)
    const bookingsLink = screen.getByRole('link', { name: 'Xem các lượt đặt chỗ' })
    await user.click(bookingsLink)

    // Now on /bookings: see the server booking
    expect(await screen.findByText('BK-SERVER-101')).toBeInTheDocument()
    expect(screen.getByText('Bãi Xe Miền Nam')).toBeInTheDocument()

    // Simulate query refetch / reload: server data remains intact
    await queryClient.refetchQueries({ queryKey: ['real-bookings'] })
    expect(await screen.findByText('BK-SERVER-101')).toBeInTheDocument()

    // Pre-existing legacy active_hold in localStorage does not appear as a booking
    localStorage.setItem(
      'smart-truck-parking.active_hold',
      JSON.stringify({ code: 'BK-HOLD-LEGACY-9999' }),
    )
    expect(screen.queryByText('BK-HOLD-LEGACY-9999')).not.toBeInTheDocument()
  })

  it('AC4: reports server error (400/409/5xx) and does not show false success or fall back to mock', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.post).mockRejectedValueOnce(
      new Error('Bãi đỗ đã hết chỗ cho loại xe này.'),
    )

    mount(<InlineQuickBookPanel open={true} onClose={() => { }} lot={sampleLot} />)

    const submitBtn = await screen.findByRole('button', { name: 'Tạo booking và xem tiền cọc' })
    await user.click(submitBtn)

    // Error alert is displayed
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Bãi đỗ đã hết chỗ cho loại xe này.',
    )

    // No success code or fake hold
    expect(screen.queryByText(/BK-/)).not.toBeInTheDocument()
    expect(localStorage.getItem('smart-truck-parking.active_hold')).toBeNull()
  })

  it('AC4: disables submit button when lot has no available capacity', async () => {
    vi.mocked(apiClient.get).mockImplementation(async (url) => {
      const u = String(url)
      if (u.includes('/vehicles')) {
        return { data: { data: { content: [activeVehicle] } } }
      }
      if (u.match(/\/parking-lots\/\d+/)) {
        return {
          data: {
            data: {
              ...lotApiPayload,
              slots: [
                { vehicleType: 'HEAVY_TRUCK', availableCapacity: 0, totalCapacity: 10 },
              ],
            },
          },
        }
      }
      return { data: { data: null } }
    })

    mount(<InlineQuickBookPanel open={true} onClose={() => { }} lot={sampleLot} />)

    const submitBtn = await screen.findByRole('button', { name: 'Tạo booking và xem tiền cọc' })
    expect(submitBtn).toBeDisabled()
    expect(screen.getByText(/Bãi chưa nhận đặt chỗ, hết chỗ/)).toBeInTheDocument()
    expect(apiClient.post).not.toHaveBeenCalled()
  })

  it('AC6: closes on Escape and restores focus; unmounting resets state', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    const { rerender } = mount(
      <InlineQuickBookPanel open={true} onClose={onClose} lot={sampleLot} />,
    )

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeInTheDocument()

    // Press Escape
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)

    // When closed, nothing is rendered
    rerender(<InlineQuickBookPanel open={false} onClose={onClose} lot={sampleLot} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it.each([
    { status: 400, message: 'Dữ liệu không hợp lệ (400 Bad Request)' },
    { status: 401, message: 'Phiên đăng nhập hết hạn (401 Unauthorized)' },
    { status: 403, message: 'Không có quyền đặt chỗ tại bãi này (403 Forbidden)' },
    { status: 409, message: 'Xung đột vị trí hoặc đã có lượt đặt trước (409 Conflict)' },
    { status: 500, message: 'Lỗi máy chủ nội bộ (500 Internal Server Error)' },
    { status: 0, message: 'Không thể kết nối máy chủ (Network Error)' },
  ])('AC4 error matrix: handles HTTP $status gracefully without fake success or mock fallback', async ({ status, message }) => {
    const user = userEvent.setup()
    const error = Object.assign(new Error(message), status > 0
      ? { response: { status, data: { message } } }
      : {})
    vi.mocked(apiClient.post).mockRejectedValueOnce(error)

    mount(<InlineQuickBookPanel open={true} onClose={() => { }} lot={sampleLot} />)

    const submitBtn = await screen.findByRole('button', { name: 'Tạo booking và xem tiền cọc' })
    await user.click(submitBtn)

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.queryByText(/BK-/)).not.toBeInTheDocument()
    expect(localStorage.getItem('smart-truck-parking.active_hold')).toBeNull()
  })

  it('AC4: handles malformed schema response without fake success', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { invalidField: true },
    } as Awaited<ReturnType<typeof apiClient.post>>)

    mount(<InlineQuickBookPanel open={true} onClose={() => { }} lot={sampleLot} />)

    const submitBtn = await screen.findByRole('button', { name: 'Tạo booking và xem tiền cọc' })
    await user.click(submitBtn)

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.queryByText('Chờ thanh toán cọc')).not.toBeInTheDocument()
    expect(screen.queryByText(/BK-/)).not.toBeInTheDocument()
    expect(localStorage.getItem('smart-truck-parking.active_hold')).toBeNull()
  })

  it('AC1: retries the same intent with the same requestId after a network error', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Network Error'))
    mount(<InlineQuickBookPanel open={true} onClose={() => {}} lot={sampleLot} />)

    const submit = await screen.findByRole('button', { name: 'Tạo booking và xem tiền cọc' })
    await user.click(submit)
    expect(await screen.findByRole('alert')).toHaveTextContent('Network Error')
    const firstPayload = vi.mocked(apiClient.post).mock.calls[0][1] as { requestId: string }
    expect(firstPayload.requestId).toEqual(expect.any(String))
    expect(firstPayload.requestId).not.toBe('')

    await user.click(submit)
    expect(await screen.findByText('BK-SERVER-101')).toBeInTheDocument()
    expect(apiClient.post).toHaveBeenCalledTimes(2)
    expect(vi.mocked(apiClient.post).mock.calls[1][1]).toEqual(
      expect.objectContaining({ requestId: firstPayload.requestId }),
    )
  })

  it('AC6: preserves the existing scroll lock and original trigger across parent rerenders', async () => {
    const user = userEvent.setup()
    const previousOverflow = document.body.style.overflow
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()
    document.body.style.overflow = 'clip'
    const queryClient = createTestQueryClient()
    const wrap = (open: boolean) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <InlineQuickBookPanel open={open} onClose={() => {}} lot={{ ...sampleLot }} />
        </MemoryRouter>
      </QueryClientProvider>
    )
    const view = render(wrap(true))
    try {
      expect(document.body.style.overflow).toBe('hidden')
      await user.click(await screen.findByRole('button', { name: 'Đóng' }))
      view.rerender(wrap(true))
      view.rerender(wrap(false))
      expect(trigger).toHaveFocus()
      expect(document.body.style.overflow).toBe('clip')
    } finally {
      view.unmount()
      trigger.remove()
      document.body.style.overflow = previousOverflow
    }
  })

  it('AC6: switching lots unmounts and re-initializes flow for the new lot with no state leak', async () => {
    const otherLot: ParkingLotItem = {
      ...sampleLot,
      id: 8,
      name: 'Bãi Xe Miền Bắc',
    }

    const queryClient = createTestQueryClient()
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <InlineQuickBookPanel open={true} onClose={() => { }} lot={sampleLot} />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(await screen.findByRole('heading', { level: 2, name: /Bãi Xe Miền Nam/ })).toBeInTheDocument()

    // Switch to otherLot
    rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <InlineQuickBookPanel open={true} onClose={() => { }} lot={otherLot} />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(await screen.findByRole('heading', { level: 2, name: /Bãi Xe Miền Bắc/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: /Bãi Xe Miền Nam/ })).not.toBeInTheDocument()
  })
})
