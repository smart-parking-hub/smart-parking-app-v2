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
  totalGrossRevenue: 1000000, totalNetRevenue: 400000, totalPlatformFee: 100000,
  currentWalletBalance: 400000, completedBookings: 3, minWithdrawalAmount: 50000,
  series: [
    { period: '2025-12-31', revenue: 90000, bookingCount: 1 },
    { period: '2026-01-01', revenue: 180000, bookingCount: 2 },
    { period: '2026-01-02', revenue: 0, bookingCount: 0 },
  ],
}
const ledger = { content: [{ id: 81, bookingId: null, entryType: 'WITHDRAWAL_HOLD', grossAmount: 0, feePercent: 0, feeAmount: 0, netAmount: -50000, note: 'Yêu cầu rút #12', createdAt: '2026-11-14T09:30:00' }], currentPage: 0, totalPages: 2, totalElements: 21 }
function show() {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })}><MemoryRouter><MerchantRevenuePage /></MemoryRouter></QueryClientProvider>)
}
beforeEach(() => {
  get.mockReset()
  get.mockImplementation(async url => url.endsWith('/ledger') ? ledger : revenue)
})
afterEach(cleanup)

describe('merchant revenue and wallet ledger', () => {
  it('groups actual daily points across month/year boundaries without inventing revenue', () => {
    expect(groupRevenueSeries(revenue.series, 'MONTH')).toEqual([
      { period: '2025-12', revenue: 90000, bookingCount: 1 },
      { period: '2026-01', revenue: 180000, bookingCount: 2 },
    ])
    expect(groupRevenueSeries(revenue.series, 'YEAR').map(point => point.period)).toEqual(['2025', '2026'])
  })

  it('filters only the series, groups monthly, and keeps the independent ledger paginated', async () => {
    show()
    expect(await screen.findByText('Biến động ví tích lũy')).toBeInTheDocument()
    expect(await screen.findByText('Giữ tiền rút')).toBeInTheDocument()
    expect(screen.getByText('-50.000 ₫')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Từ ngày'), { target: { value: '2026-01-01' } })
    fireEvent.change(screen.getByLabelText('Đến ngày'), { target: { value: '2026-01-31' } })
    fireEvent.change(screen.getByLabelText('Nhóm thời gian'), { target: { value: 'MONTH' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng' }))
    await waitFor(() => expect(get).toHaveBeenCalledWith('/api/v1/merchant/revenue', { startDate: '2026-01-01', endDate: '2026-01-31', granularity: 'DAY' }))
    expect(within(screen.getByRole('figure')).getAllByText('2026-01')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Trước' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Sau' }))
    await waitFor(() => expect(get).toHaveBeenCalledWith('/api/v1/merchant/revenue/ledger', { page: 1, size: 20 }))
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

  it('shows true empty and all-zero revenue, without fabricating chart bars', async () => {
    get.mockImplementation(async url => url.endsWith('/ledger')
      ? { ...ledger, content: [], totalPages: 0, totalElements: 0 }
      : { ...revenue, series: [{ period: '2026-11-14', revenue: 0, bookingCount: 0 }] })
    show()
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
    expect(screen.getByText('Doanh thu gộp')).toBeInTheDocument()
    failed = false
    fireEvent.click(screen.getByRole('button', { name: 'Thử lại' }))
    expect(await screen.findByText('Giữ tiền rút')).toBeInTheDocument()
  })
})
