import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { getData } from '@/shared/api/resources'
import { MerchantRevenuePage } from './MerchantRevenuePage'
import { groupRevenueSeries } from './merchantFinanceApi'

vi.mock('@/shared/api/resources', async importOriginal => ({
  ...await importOriginal<typeof import('@/shared/api/resources')>(), getData: vi.fn(),
}))
const get = vi.mocked(getData)
const revenue = {
  totalGrossRevenue: 1000000, totalNetRevenue: 900000, totalPlatformFee: 100000,
  periodTotalGrossRevenue: 300000, periodTotalNetRevenue: 270000, periodTotalPlatformFee: 30000,
  currentWalletBalance: 400000, completedBookings: 3, minWithdrawalAmount: 50000,
  onlineTransferGrossRevenue: 700000, onlineTransferNetRevenue: 630000, onlineTransferCount: 2,
  periodOnlineTransferGrossRevenue: 200000, periodOnlineTransferNetRevenue: 180000, periodOnlineTransferCount: 1,
  counterQrGrossRevenue: 300000, counterQrNetRevenue: 270000, counterQrCount: 1,
  periodCounterQrGrossRevenue: 100000, periodCounterQrNetRevenue: 90000, periodCounterQrCount: 1,
  totalCashRevenue: 150000, totalCashBookings: 2,
  periodCashRevenue: 50000, periodCashBookings: 1,
  revenueByParkingLot: [
    {
      parkingLotId: 10,
      onlineTransferGrossRevenue: 700000, onlineTransferRevenue: 630000, onlineTransferCount: 2,
      counterQrGrossRevenue: 300000, counterQrRevenue: 270000, counterQrCount: 1,
      cashRevenue: 150000, cashBookingCount: 2,
      periodOnlineTransferGrossRevenue: 200000, periodOnlineTransferRevenue: 180000, periodOnlineTransferCount: 1,
      periodCounterQrGrossRevenue: 100000, periodCounterQrRevenue: 90000, periodCounterQrCount: 1,
      periodCashRevenue: 50000, periodCashBookingCount: 1,
    },
  ],
  series: [
    { period: '2025-12-31', revenue: 90000, onlineTransferRevenue: 90000, counterQrRevenue: 0, cashRevenue: 50000, bookingCount: 1 },
    { period: '2026-01-01', revenue: 180000, onlineTransferRevenue: 120000, counterQrRevenue: 60000, cashRevenue: 100000, bookingCount: 2 },
    { period: '2026-01-02', revenue: 0, onlineTransferRevenue: 0, counterQrRevenue: 0, cashRevenue: 0, bookingCount: 0 },
  ],
}
const lotsPage = {
  content: [
    { id: 10, name: 'Bãi Quận 4', address: '38 Nguyễn Tất Thành', status: 'APPROVED' },
    { id: 20, name: 'Bãi Thủ Đức', address: 'Xa lộ Hà Nội', status: 'APPROVED' },
  ],
  totalElements: 2,
}
const ledger = { content: [{ id: 81, bookingId: null, entryType: 'WITHDRAWAL_HOLD', grossAmount: 0, feePercent: 0, feeAmount: 0, netAmount: -50000, note: 'Yêu cầu rút #12', createdAt: '2026-11-14T09:30:00' }], currentPage: 0, totalPages: 2, totalElements: 21 }
function show() {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })}><MemoryRouter><MerchantRevenuePage /></MemoryRouter></QueryClientProvider>)
}
beforeEach(() => {
  get.mockReset()
  get.mockImplementation(async url => {
    if (url.endsWith('/ledger')) return ledger
    if (url.endsWith('/parking-lots')) return lotsPage
    return revenue
  })
})
afterEach(cleanup)

describe('merchant revenue and wallet ledger', () => {
  it('groups actual daily points across month/year boundaries without inventing revenue', () => {
    expect(groupRevenueSeries(revenue.series, 'MONTH')).toEqual([
      {
        period: '2025-12', revenue: 90000, bookingCount: 1,
        onlineTransferRevenue: 90000, counterQrRevenue: 0, cashRevenue: 50000,
        onlineTransferCount: 0, counterQrCount: 0, cashBookingCount: 0,
      },
      {
        period: '2026-01', revenue: 180000, bookingCount: 2,
        onlineTransferRevenue: 120000, counterQrRevenue: 60000, cashRevenue: 100000,
        onlineTransferCount: 0, counterQrCount: 0, cashBookingCount: 0,
      },
    ])
    expect(groupRevenueSeries(revenue.series, 'YEAR').map(point => point.period)).toEqual(['2025', '2026'])
  })

  it('toggles per-lot table on All Lots vs channel breakdown + chart on Specific Lot, removes Đối soát, and uses custom Select & DatePicker', async () => {
    show()
    expect(await screen.findByText('Tổng Doanh thu')).toBeInTheDocument()
    expect(screen.getByTestId('revenue-kpi-total-value')).toHaveTextContent(/1\.150\.000/)
    expect(screen.getByTestId('revenue-kpi-cash-value')).toHaveTextContent(/150\.000/)
    expect(screen.queryByText('Đối soát')).not.toBeInTheDocument()

    // All lots selected -> shows per-lot breakdown table, hides channel cards & Nhịp doanh thu
    expect(screen.getByTestId('merchant-revenue-by-lot-table')).toBeInTheDocument()
    expect(screen.getByTestId('lot-revenue-row-10')).toHaveTextContent(/150\.000/)
    expect(screen.getByTestId('lot-revenue-row-20')).toHaveTextContent(/0\s*₫/)
    expect(screen.queryByTestId('merchant-channel-breakdown-cards')).not.toBeInTheDocument()
    expect(screen.queryByText('Nhịp doanh thu')).not.toBeInTheDocument()

    // Custom DatePicker opens styled calendar dialog
    fireEvent.click(screen.getByRole('button', { name: 'Chọn từ ngày' }))
    expect(screen.getByRole('dialog', { name: 'Lịch chọn từ ngày' })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: 'Lịch chọn từ ngày' })).not.toBeInTheDocument()

    // Custom Select renders styled combobox buttons (not native OS select)
    const lotCombobox = screen.getByRole('combobox', { name: 'Mở bộ lọc cơ sở bãi đỗ' })
    expect(lotCombobox.tagName).toBe('BUTTON')
    const granCombobox = screen.getByRole('combobox', { name: 'Mở bộ lọc nhóm thời gian' })
    expect(granCombobox.tagName).toBe('BUTTON')

    // Select a specific lot -> hides per-lot table and shows channel breakdown + Nhịp doanh thu
    fireEvent.click(lotCombobox)
    const listbox = await screen.findByRole('listbox', { name: 'Mở bộ lọc cơ sở bãi đỗ' })
    fireEvent.click(within(listbox).getByRole('option', { name: 'Bãi Quận 4' }))
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng' }))
    await waitFor(() =>
      expect(get).toHaveBeenCalledWith('/api/v1/merchant/revenue', {
        startDate: undefined,
        endDate: undefined,
        granularity: 'DAY',
        parkingLotId: 10,
      }),
    )

    expect(screen.queryByTestId('merchant-revenue-by-lot-table')).not.toBeInTheDocument()
    expect(await screen.findByTestId('channel-card-transfer')).toHaveTextContent(/1\.000\.000/)
    expect(screen.getByTestId('channel-card-cash')).toHaveTextContent(/150\.000/)
    expect(screen.getByText('Nhịp doanh thu')).toBeInTheDocument()
  })

  it('filters consistently by date period and gross/net basis without mixing out-of-period cumulative totals', async () => {
    show()
    expect(await screen.findByText('Thực nhận chuyển khoản')).toBeInTheDocument()
    expect(screen.getByText('Số dư ví khả dụng (Toàn tài khoản)')).toBeInTheDocument()
    expect(await screen.findByText('Giữ tiền rút')).toBeInTheDocument()
    expect(screen.getByText('-50.000 ₫')).toBeInTheDocument()

    // Apply date range filter -> KPIs, table, and channel cards must ALL use period figures (not all-time 1.150.000)
    fireEvent.change(screen.getByLabelText('Từ ngày'), { target: { value: '2026-01-01' } })
    fireEvent.change(screen.getByLabelText('Đến ngày'), { target: { value: '2026-01-31' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng' }))

    await waitFor(() =>
      expect(get).toHaveBeenCalledWith('/api/v1/merchant/revenue', {
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        granularity: 'DAY',
        parkingLotId: undefined,
      }),
    )

    // Period gross transfer (300k) + period cash (50k) = 350k, fee = 30k, net = 270k, wallet balance unchanged (400k)
    expect(screen.getByTestId('revenue-kpi-total-value')).toHaveTextContent(/350\.000/)
    expect(screen.getByTestId('revenue-kpi-cash-value')).toHaveTextContent(/50\.000/)
    expect(screen.getByTestId('revenue-kpi-net-value')).toHaveTextContent(/270\.000/)
    expect(screen.getByTestId('revenue-kpi-fee-value')).toHaveTextContent(/30\.000/)
    expect(screen.getByTestId('revenue-kpi-wallet-value')).toHaveTextContent(/400\.000/)
    // Per-lot table keeps consistent gross basis in date-filtered mode (300k + 50k = 350k)
    expect(screen.getByTestId('lot-revenue-row-10')).toHaveTextContent(/300\.000/)
    expect(screen.getByTestId('lot-revenue-row-10')).toHaveTextContent(/350\.000/)

    // Now also filter to lot 10 + monthly grouping and check channel cards match period gross (300k + 50k = 350k)
    fireEvent.change(screen.getByLabelText('Cơ sở bãi đỗ'), { target: { value: '10' } })
    fireEvent.change(screen.getByLabelText('Nhóm thời gian'), { target: { value: 'MONTH' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng' }))
    await waitFor(() => expect(get).toHaveBeenCalledWith('/api/v1/merchant/revenue', { startDate: '2026-01-01', endDate: '2026-01-31', granularity: 'DAY', parkingLotId: 10 }))
    expect(await screen.findByTestId('channel-card-transfer')).toHaveTextContent(/300\.000/)
    expect(screen.getByTestId('channel-card-cash')).toHaveTextContent(/50\.000/)
    expect(within(await screen.findByRole('figure')).getAllByText('2026-01')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Trước' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Sau' }))
    await waitFor(() => expect(get).toHaveBeenCalledWith('/api/v1/merchant/revenue/ledger', { page: 1, size: 5 }))
    expect(await screen.findByText('Trang 2 / 2')).toBeInTheDocument()
  })

  it('blocks reversed dates and does not send a new request', async () => {
    show()
    await screen.findByText('Giữ tiền rút')
    const calls = get.mock.calls.length
    fireEvent.change(screen.getByLabelText('Từ ngày'), { target: { value: '2026-11-14' } })
    fireEvent.change(screen.getByLabelText('Đến ngày'), { target: { value: '2026-11-01' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Ngày kết thúc phải từ ngày bắt đầu.')
    expect(get).toHaveBeenCalledTimes(calls)
  })

  it('shows true empty and all-zero revenue for a selected lot without fabricating chart bars', async () => {
    get.mockImplementation(async url => {
      if (url.endsWith('/ledger')) return { ...ledger, content: [], totalPages: 0, totalElements: 0 }
      if (url.endsWith('/parking-lots')) return lotsPage
      return { ...revenue, series: [{ period: '2026-11-14', revenue: 0, cashRevenue: 0, bookingCount: 0 }] }
    })
    show()
    await screen.findByTestId('lot-revenue-row-10')
    fireEvent.change(screen.getByLabelText('Cơ sở bãi đỗ'), { target: { value: '10' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng' }))
    expect(await screen.findByText('Chưa có doanh thu trong khoảng thời gian này.')).toBeInTheDocument()
    expect(await screen.findByText('Chưa có biến động ví.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sau' })).toBeDisabled()
    expect(screen.queryByRole('figure')).not.toBeInTheDocument()
  })

  it('allows ledger error recovery without hiding successful revenue', async () => {
    let failed = true
    get.mockImplementation(async url => {
      if (url.endsWith('/ledger')) {
        if (failed) throw new Error('Không thể tải sổ cái')
        return ledger
      }
      return revenue
    })
    show()
    expect(await screen.findByRole('alert')).toHaveTextContent('Không thể tải sổ cái')
    expect(screen.getByText('Tổng Doanh thu')).toBeInTheDocument()
    failed = false
    fireEvent.click(screen.getByRole('button', { name: 'Thử lại' }))
    expect(await screen.findByText('Giữ tiền rút')).toBeInTheDocument()
  })
})
