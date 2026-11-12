import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { store } from '@/app/store'
import type { Booking } from '@/entities/operations'
import { RequireRole } from '@/features/auth'
import { apiClient } from '@/shared/api/client'
import { getData } from '@/shared/api/resources'
import { getMerchantBookingsStoreSnapshot } from '../store/merchantBookingsStore'
import { MerchantBookingsPage } from '../pages/MerchantBookingsPage'

vi.mock('@/shared/api/resources', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/api/resources')>()),
  getData: vi.fn(),
}))

const mockGetData = vi.mocked(getData)

function renderBookingsApp(ui: ReactNode, initialEntries = ['/merchant/bookings']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </Provider>
    </QueryClientProvider>,
  )
}

function createMerchantJwt(role = 'ROLE_MERCHANT') {
  const payload = {
    role,
    sub: '0901234567',
    exp: Math.floor(Date.now() / 1000) + 3600,
  }
  return `test.${btoa(JSON.stringify(payload))}.sig`
}

const sampleBookings: Booking[] = [
  {
    id: 801,
    bookingCode: 'BK-2026-801',
    driverId: 501,
    vehicleId: 301,
    parkingLotId: 12,
    merchantId: 2,
    vehiclePlate: '51D-894.12',
    vehicleLicensePlate: '51D-894.12',
    vehicleType: 'CONTAINER',
    parkingLotName: 'Bãi Cát Lái Gate 2',
    parkingLotAddress: 'Số 10 Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức',
    driverName: 'Nguyễn Văn Tài',
    driverPhone: '0909123456',
    status: 'PENDING_CHECKIN',
    hourlyRate: 35000,
    surgeMultiplier: 1.5,
    surgeStartTime: '18:00',
    surgeEndTime: '22:00',
    overtimePenaltyMultiplier: 1.75,
    advanceDeposit: 50000,
    totalAmount: 245000,
    expiresAt: '2026-11-12T08:15:00Z',
    expectedCheckInTime: '2026-11-12T10:00:00Z',
    expectedCheckOutTime: '2026-11-12T17:00:00Z',
    checkInTime: null,
    checkOutTime: null,
    createdAt: '2026-11-12T07:45:00Z',
  },
  {
    id: 802,
    bookingCode: 'BK-2026-802',
    driverId: 502,
    vehicleId: 302,
    parkingLotId: 15,
    merchantId: 2,
    vehiclePlate: '60C-912.44',
    vehicleLicensePlate: '60C-912.44',
    vehicleType: 'HEAVY_TRUCK',
    parkingLotName: 'Depot Bình Dương 1',
    parkingLotAddress: 'QL13, Thuận An, Bình Dương',
    status: 'OVERTIME',
    hourlyRate: 28000,
    surgeMultiplier: 1.2,
    surgeStartTime: '17:00',
    surgeEndTime: '20:00',
    overtimePenaltyMultiplier: 2,
    advanceDeposit: 80000,
    totalAmount: 320000,
    expectedCheckInTime: '2026-11-12T06:00:00Z',
    expectedCheckOutTime: '2026-11-12T11:00:00Z',
    checkInTime: '2026-11-12T06:05:00Z',
    createdAt: '2026-11-12T05:30:00Z',
  },
  {
    id: 803,
    bookingCode: 'BK-2026-803',
    driverId: 503,
    vehicleId: 303,
    parkingLotId: 12,
    merchantId: 2,
    vehiclePlate: '72A-345.67',
    vehicleLicensePlate: '72A-345.67',
    vehicleType: 'LIGHT_TRUCK',
    parkingLotName: 'Bãi Cát Lái Gate 2',
    status: 'CANCELLED',
    hourlyRate: 20000,
    advanceDeposit: 50000,
    totalAmount: 100000,
    expectedCheckInTime: '2026-11-11T14:00:00Z',
    expectedCheckOutTime: '2026-11-11T18:00:00Z',
    cancelledAt: '2026-11-11T09:00:00Z',
    cancellationReason: 'Tài xế đổi lịch trình giao hàng',
    refundAmount: 50000,
    refundPercentage: 100,
    refundPolicy: 'Hoàn 100% trước 24h',
    refundStatus: 'REFUNDED',
    refundReference: 'RF-9981',
    createdAt: '2026-11-10T08:00:00Z',
  },
]

describe('SCR-034: MerchantBookingsPage (Table + Full Detail Modal + Filters + States)', () => {
  let apiClientGetSpy: { mockRestore: () => void } | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    getMerchantBookingsStoreSnapshot().resetStore()
    apiClientGetSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: {
        data: {
          content: [
            { id: 12, name: 'Bãi Cát Lái Gate 2' },
            { id: 15, name: 'Depot Bình Dương 1' },
          ],
        },
      },
    } as never)
  })

  afterEach(() => {
    cleanup()
    apiClientGetSpy?.mockRestore()
  })

  it('renders a compact table with ONLY key columns and excludes detail-only fields until Modal opens', async () => {
    mockGetData.mockImplementation(async (url: string) => {
      if (url === '/api/v1/merchant/bookings') {
        return {
          content: sampleBookings,
          currentPage: 0,
          totalPages: 1,
          totalElements: 3,
        }
      }
      if (url === '/api/v1/merchant/bookings/801') {
        return sampleBookings[0]
      }
      if (url === '/api/v1/merchant/bookings/803') {
        return sampleBookings[2]
      }
      return null
    })

    renderBookingsApp(<MerchantBookingsPage />)

    // Verify 7 clean table headers
    const table = await screen.findByRole('table', {
      name: 'Bảng danh sách đơn đặt chỗ',
    })
    expect(within(table).getByRole('columnheader', { name: 'Mã đặt chỗ' })).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'Phương tiện' })).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'Bãi đỗ' })).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'Giờ đến dự kiến' })).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'Tiền cọc' })).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'Trạng thái' })).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'Thao tác' })).toBeInTheDocument()

    // Key info rendered cleanly in rows
    expect(within(table).getByText('BK-2026-801')).toBeInTheDocument()
    expect(within(table).getByText('51D-894.12')).toBeInTheDocument()
    expect(within(table).getAllByRole('button', { name: /Xem chi tiết đơn/i })).toHaveLength(3)

    // Detail-only info must NOT clutter table rows before clicking "Chi tiết"
    expect(
      screen.queryByText('Số 10 Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức'),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Tài xế đổi lịch trình giao hàng')).not.toBeInTheDocument()
    expect(screen.queryByText('Hoàn 100% trước 24h')).not.toBeInTheDocument()
    expect(screen.queryByText('RF-9981')).not.toBeInTheDocument()
    expect(screen.queryByText('Nguyễn Văn Tài')).not.toBeInTheDocument()

    // Click "Chi tiết" on row BK-2026-801 -> opens Full Detail Modal
    const detailBtn = screen.getByRole('button', { name: 'Xem chi tiết đơn BK-2026-801' })
    fireEvent.click(detailBtn)

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('Hồ sơ đơn đặt chỗ #801')).toBeInTheDocument()
    expect(within(dialog).getByText('BK-2026-801')).toBeInTheDocument()
    expect(within(dialog).getByText('Số 10 Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức')).toBeInTheDocument()
    expect(within(dialog).getByText('Nguyễn Văn Tài')).toBeInTheDocument()
    expect(within(dialog).getByText('0909123456')).toBeInTheDocument()
    expect(within(dialog).getByText('x1.5')).toBeInTheDocument()
    expect(within(dialog).getByText('18:00 – 22:00')).toBeInTheDocument()
    expect(within(dialog).getByText('x1.75')).toBeInTheDocument()
    expect(
      within(dialog).getByRole('link', { name: /Xử lý tại trạm QR/i }),
    ).toHaveAttribute('href', '/merchant/qr-scanner?code=BK-2026-801&lot=12')
    expect(
      within(dialog).getByRole('link', { name: /Mở trang hồ sơ rời/i }),
    ).toHaveAttribute('href', '/merchant/bookings/801')

    // Copy booking code triggers Toast
    fireEvent.click(within(dialog).getByRole('button', { name: /Sao chép mã/i }))
    expect(await screen.findByText('Đã sao chép mã đặt chỗ')).toBeInTheDocument()

    // Close Modal
    fireEvent.click(within(dialog).getByRole('button', { name: 'Đóng' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    // Open Cancelled row BK-2026-803 -> verify Cancellation & Refund fields render
    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết đơn BK-2026-803' }))
    const cancelDialog = await screen.findByRole('dialog')
    expect(within(cancelDialog).getByText('Tài xế đổi lịch trình giao hàng')).toBeInTheDocument()
    expect(within(cancelDialog).getByText('Hoàn 100% trước 24h')).toBeInTheDocument()
    expect(within(cancelDialog).getByText('100%')).toBeInTheDocument()
    expect(within(cancelDialog).getByText('REFUNDED')).toBeInTheDocument()
    expect(within(cancelDialog).getByText('RF-9981')).toBeInTheDocument()

    // Escape key closes Modal
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('validates search input with Zod (max 100 chars) and filters by search, detailed status, and server-side parkingLotId', async () => {
    mockGetData.mockImplementation(async (_url, params?: { parkingLotId?: number }) => {
      if (params?.parkingLotId === 15) {
        return {
          content: [sampleBookings[1]],
          currentPage: 0,
          totalPages: 1,
          totalElements: 1,
        }
      }
      return {
        content: sampleBookings,
        currentPage: 0,
        totalPages: 1,
        totalElements: 3,
      }
    })

    renderBookingsApp(<MerchantBookingsPage />)
    await screen.findByText('BK-2026-801')

    // Search validation error (> 100 chars)
    const searchInput = screen.getByLabelText('Tìm kiếm đơn đặt chỗ')
    fireEvent.change(searchInput, { target: { value: 'A'.repeat(105) } })
    expect(
      await screen.findByText('Từ khóa tìm kiếm tối đa 100 ký tự'),
    ).toBeInTheDocument()

    // Clear invalid search
    fireEvent.change(searchInput, { target: { value: '60C-912' } })
    await waitFor(() => {
      expect(screen.queryByText('Từ khóa tìm kiếm tối đa 100 ký tự')).not.toBeInTheDocument()
    })
    expect(screen.getByText('BK-2026-802')).toBeInTheDocument()
    expect(screen.queryByText('BK-2026-801')).not.toBeInTheDocument()

    // Reset filters restores rows
    fireEvent.click(screen.getByRole('button', { name: 'Xóa bộ lọc' }))
    expect(await screen.findByText('BK-2026-801')).toBeInTheDocument()

    // Filter by extended backend status via select (OVERTIME)
    const statusSelect = screen.getByLabelText('Lọc theo trạng thái chi tiết')
    fireEvent.change(statusSelect, { target: { value: 'OVERTIME' } })
    expect(screen.getByText('BK-2026-802')).toBeInTheDocument()
    expect(screen.queryByText('BK-2026-801')).not.toBeInTheDocument()

    // Reset to ALL, then filter by server-side parkingLotId = 15
    fireEvent.change(statusSelect, { target: { value: 'ALL' } })
    const lotSelect = screen.getByLabelText('Lọc theo bãi đỗ')
    fireEvent.change(lotSelect, { target: { value: '15' } })

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith('/api/v1/merchant/bookings', {
        page: 0,
        size: 5,
        parkingLotId: 15,
      })
    })
    expect(await screen.findByText('BK-2026-802')).toBeInTheDocument()
    expect(screen.queryByText('BK-2026-801')).not.toBeInTheDocument()
  })

  it('initializes server-side parkingLotId from URL query string and handles pagination with size 5', async () => {
    mockGetData.mockImplementation(async (_url, params?: { page?: number; parkingLotId?: number }) => {
      if (params?.page === 1) {
        return {
          content: [sampleBookings[1]],
          currentPage: 1,
          totalPages: 2,
          totalElements: 7,
        }
      }
      return {
        content: [sampleBookings[0]],
        currentPage: 0,
        totalPages: 2,
        totalElements: 7,
      }
    })

    renderBookingsApp(<MerchantBookingsPage />, ['/merchant/bookings?parkingLotId=12'])

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith('/api/v1/merchant/bookings', {
        page: 0,
        size: 5,
        parkingLotId: 12,
      })
    })
    expect(await screen.findByText('Trang 1 / 2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Trang sau' }))
    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith('/api/v1/merchant/bookings', {
        page: 1,
        size: 5,
        parkingLotId: 12,
      })
    })
    expect(await screen.findByText('BK-2026-802')).toBeInTheDocument()
  })

  it('consolidates filters, table and pagination into one div container, caps rows at 5 per page, and matches dashboard KPI style', async () => {
    const sevenBookings: Booking[] = Array.from({ length: 7 }, (_, idx) => ({
      ...sampleBookings[0],
      id: 900 + idx,
      bookingCode: `BK-CAP-${900 + idx}`,
      vehiclePlate: `51D-900.0${idx}`,
      vehicleLicensePlate: `51D-900.0${idx}`,
    }))

    mockGetData.mockResolvedValue({
      content: sevenBookings,
      currentPage: 0,
      totalPages: 2,
      totalElements: 7,
    })

    renderBookingsApp(<MerchantBookingsPage />)
    expect(await screen.findByText('BK-CAP-900')).toBeInTheDocument()

    // Max 5 bookings rendered per page
    expect(screen.getAllByRole('button', { name: /Xem chi tiết đơn/i })).toHaveLength(5)
    expect(screen.queryByText('BK-CAP-905')).not.toBeInTheDocument()
    expect(screen.queryByText('BK-CAP-906')).not.toBeInTheDocument()

    // Unified single container & unified panel holding filters, table and pagination together
    const outerContainer = screen.getByTestId('merchant-bookings-container')
    const unifiedPanel = screen.getByTestId('merchant-bookings-panel')
    expect(outerContainer).toContainElement(unifiedPanel)
    expect(unifiedPanel).toContainElement(screen.getByRole('tablist', { name: 'Bộ lọc trạng thái' }))
    expect(unifiedPanel).toContainElement(screen.getByLabelText('Tìm kiếm đơn đặt chỗ'))
    expect(unifiedPanel).toContainElement(screen.getByLabelText('Lọc theo bãi đỗ'))
    expect(unifiedPanel).toContainElement(screen.getByLabelText('Lọc theo trạng thái chi tiết'))
    expect(unifiedPanel).toContainElement(screen.getByRole('table', { name: 'Bảng danh sách đơn đặt chỗ' }))
    expect(unifiedPanel).toContainElement(screen.getByText('Trang 1 / 2'))

    // Dashboard-matched KPI strip (4 clean white cards, uppercase labels, no dark highlight)
    const metricsStrip = screen.getByTestId('merchant-bookings-metrics')
    expect(metricsStrip.children).toHaveLength(4)
    expect(metricsStrip.querySelector('.bg-brand-navy')).toBeNull()
    expect(within(metricsStrip).getByText('Tổng lượt đặt chỗ')).toHaveClass('font-mono', 'uppercase')
    expect(within(metricsStrip).getByText('Chờ vào · trang này')).toHaveClass('font-mono', 'uppercase')
    expect(within(metricsStrip).getByText('Đang đỗ · trang này')).toHaveClass('font-mono', 'uppercase')
    expect(within(metricsStrip).getByText('Hoàn tất · trang này')).toHaveClass('font-mono', 'uppercase')

    // All-status tab displays full totalElements (7), not truncated to page-size 5
    expect(screen.getByRole('tab', { name: /Tất cả trạng thái/i })).toHaveTextContent('7')
  })

  it('uses styled custom Select components and counts all matching bookings across lots instead of per-page limit 5', async () => {
    const allTwelveBookings: Booking[] = Array.from({ length: 12 }, (_, idx) => ({
      ...sampleBookings[0],
      id: 1000 + idx,
      bookingCode: `BK-ALL-${1000 + idx}`,
      parkingLotId: idx < 4 ? 15 : 12,
      parkingLotName: idx < 4 ? 'Depot Bình Dương 1' : 'Bãi Cát Lái Gate 2',
      vehiclePlate: `51D-777.${String(idx).padStart(2, '0')}`,
      vehicleLicensePlate: `51D-777.${String(idx).padStart(2, '0')}`,
      status: idx < 6 ? 'COMPLETED' : idx === 6 ? 'PARKING' : 'PENDING_CHECKIN',
    }))

    apiClientGetSpy?.mockRestore()
    apiClientGetSpy = vi.spyOn(apiClient, 'get').mockImplementation((async (
      url: string,
      config?: { params?: { parkingLotId?: number; size?: number } },
    ) => {
      if (url === '/api/v1/merchant/parking-lots') {
        return {
          data: {
            data: {
              content: [
                { id: 12, name: 'Bãi Cát Lái Gate 2' },
                { id: 15, name: 'Depot Bình Dương 1' },
              ],
            },
          },
        }
      }
      if (url === '/api/v1/merchant/bookings') {
        const lotId = config?.params?.parkingLotId
        const matching = lotId
          ? allTwelveBookings.filter((b) => b.parkingLotId === lotId)
          : allTwelveBookings
        return {
          data: {
            data: {
              content: matching,
              totalElements: matching.length,
            },
          },
        }
      }
      return { data: { data: null } }
    }) as never)

    mockGetData.mockImplementation(async (_url, params?: { page?: number; parkingLotId?: number }) => {
      const lotId = params?.parkingLotId
      const currentPage = params?.page ?? 0
      const matching = lotId
        ? allTwelveBookings.filter((b) => b.parkingLotId === lotId)
        : allTwelveBookings
      return {
        content: matching.slice(currentPage * 5, (currentPage + 1) * 5),
        currentPage,
        totalPages: Math.max(1, Math.ceil(matching.length / 5)),
        totalElements: matching.length,
      }
    })

    renderBookingsApp(<MerchantBookingsPage />)

    // Tab counts reflect ALL 12 bookings across both lots, while table shows 5 max per page
    const allTab = await screen.findByRole('tab', { name: /Tất cả trạng thái/i })
    await waitFor(() => {
      expect(allTab).toHaveTextContent('12')
    })
    expect(screen.getByRole('tab', { name: /Đã hoàn tất/i })).toHaveTextContent('6')
    expect(screen.getByRole('tab', { name: /Đang đỗ xe/i })).toHaveTextContent('1')
    expect(screen.getByRole('tab', { name: /Chờ vào bãi/i })).toHaveTextContent('5')
    expect(screen.getAllByRole('button', { name: /Xem chi tiết đơn/i })).toHaveLength(5)

    // Custom Select renders combobox button & opens styled listbox (not native OS dropdown)
    const lotCombobox = screen.getByRole('combobox', { name: 'Mở bộ lọc bãi đỗ' })
    expect(lotCombobox.tagName).toBe('BUTTON')
    fireEvent.click(lotCombobox)

    const lotListbox = await screen.findByRole('listbox', { name: 'Mở bộ lọc bãi đỗ' })
    fireEvent.click(within(lotListbox).getByRole('option', { name: 'Depot Bình Dương 1' }))

    // Counts immediately update to match Depot Bình Dương 1 (4 bookings)
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Tất cả trạng thái/i })).toHaveTextContent('4')
    })
    expect(screen.getByRole('tab', { name: /Đã hoàn tất/i })).toHaveTextContent('4')

    // Reset back to All lots via custom Select and click "Đã hoàn tất" tab -> paginates 6 rows at 5/page
    fireEvent.click(lotCombobox)
    const reopenedLotListbox = await screen.findByRole('listbox', { name: 'Mở bộ lọc bãi đỗ' })
    fireEvent.click(within(reopenedLotListbox).getByRole('option', { name: /Tất cả bãi đỗ/i }))
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Tất cả trạng thái/i })).toHaveTextContent('12')
    })

    fireEvent.click(screen.getByRole('tab', { name: /Đã hoàn tất/i }))
    expect(await screen.findByText('Trang 1 / 2')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Xem chi tiết đơn/i })).toHaveLength(5)

    fireEvent.click(screen.getByRole('button', { name: 'Trang sau' }))
    expect(await screen.findByText('Trang 2 / 2')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Xem chi tiết đơn/i })).toHaveLength(1)
  })

  it('handles loading skeleton, initial/filtered empty states, initial error retry, background refresh alert, and refresh success toast', async () => {
    let resolvePending!: (val: unknown) => void
    mockGetData.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePending = resolve
      }),
    )

    renderBookingsApp(<MerchantBookingsPage />)
    expect(screen.getByTestId('merchant-bookings-skeleton')).toBeInTheDocument()

    // Resolve empty initial page -> Initial Empty State
    resolvePending({
      content: [],
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
    })
    expect(await screen.findByText('Chưa có đơn đặt chỗ nào')).toBeInTheDocument()

    // Error on refresh -> Warning/Error handling
    cleanup()
    getMerchantBookingsStoreSnapshot().resetStore()
    mockGetData
      .mockRejectedValueOnce(new Error('Không thể kết nối máy chủ bãi đỗ'))
      .mockResolvedValueOnce({
        content: sampleBookings,
        currentPage: 0,
        totalPages: 1,
        totalElements: 3,
      })
      .mockRejectedValueOnce(new Error('Mất kết nối tạm thời'))
      .mockResolvedValueOnce({
        content: sampleBookings,
        currentPage: 0,
        totalPages: 1,
        totalElements: 3,
      })

    renderBookingsApp(<MerchantBookingsPage />)
    expect(await screen.findByText('Không thể tải danh sách đặt chỗ')).toBeInTheDocument()
    expect(screen.getByText('Không thể kết nối máy chủ bãi đỗ')).toBeInTheDocument()

    // Retry recovers list
    fireEvent.click(screen.getByRole('button', { name: /Thử lại/i }))
    expect(await screen.findByText('BK-2026-801')).toBeInTheDocument()

    // Background refetch error keeps existing table visible + Alert banner (clears prior toast)
    const refreshBtn = screen.getByRole('button', { name: 'Làm mới danh sách đặt chỗ' })
    fireEvent.click(refreshBtn)
    expect(
      await screen.findByText('Không thể làm mới danh sách đặt chỗ'),
    ).toBeInTheDocument()
    expect(screen.getByText('BK-2026-801')).toBeInTheDocument()
    expect(screen.queryByText('Đã cập nhật danh sách đặt chỗ')).not.toBeInTheDocument()

    // Successful refresh shows Toast
    fireEvent.click(refreshBtn)
    expect(await screen.findByText('Đã cập nhật danh sách đặt chỗ')).toBeInTheDocument()

    // Filtered empty state + reset filters button
    fireEvent.change(screen.getByLabelText('Tìm kiếm đơn đặt chỗ'), {
      target: { value: 'KHONG_TON_TAI_XYZ' },
    })
    expect(await screen.findByText('Không tìm thấy đơn đặt chỗ phù hợp')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Xóa toàn bộ bộ lọc' }))
    expect(await screen.findByText('BK-2026-801')).toBeInTheDocument()
  })

  it('enforces MERCHANT RBAC guard on /merchant/bookings', async () => {
    // Driver denied -> /403
    localStorage.setItem('access_token', createMerchantJwt('ROLE_DRIVER'))
    renderBookingsApp(
      <Routes>
        <Route
          path="/merchant/bookings"
          element={
            <RequireRole role="MERCHANT">
              <MerchantBookingsPage />
            </RequireRole>
          }
        />
        <Route path="/403" element={<p>Không có quyền truy cập</p>} />
      </Routes>,
    )

    expect(await screen.findByText('Không có quyền truy cập')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Điều phối đặt chỗ' })).not.toBeInTheDocument()
  })
})
