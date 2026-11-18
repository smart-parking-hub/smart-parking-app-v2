import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { store } from '@/app/store'
import { apiClient } from '@/shared/api/client'
import * as resources from '@/shared/api/resources'
import { MerchantDashboardPage } from '../dashboard/pages/MerchantDashboardPage'
import { getMerchantDashboardStoreSnapshot } from '../dashboard/store/merchantDashboardStore'
import { MerchantRevenuePage } from '../operations/MerchantRevenuePage'
import { GateSettlementDialog } from '../operations/GateSettlementDialog'
import { MerchantBookingsPage } from '../bookings/pages/MerchantBookingsPage'
import { getMerchantBookingsStoreSnapshot } from '../bookings/store/merchantBookingsStore'
import { MerchantRevenueByLotTable } from '../components/MerchantRevenueByLotTable'

describe('PR #103 Review Regression Suite (F-02, F-03, F-04)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    getMerchantDashboardStoreSnapshot().resetStore()
    getMerchantBookingsStoreSnapshot().resetStore()
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '')
    }
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open')
    }
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('F-02: displays identical Tổng Doanh thu and Chuyển khoản (trước phí) on Dashboard and Revenue Page for the exact same payload', async () => {
    // Reviewer scenario: transferGross=100,000, fee=10,000, transferNet=90,000, cash=20,000 -> total gross=120,000
    const sharedPayload = {
      totalGrossRevenue: 100000,
      totalPlatformFee: 10000,
      totalNetRevenue: 90000,
      periodTotalGrossRevenue: 100000,
      periodTotalPlatformFee: 10000,
      periodTotalNetRevenue: 90000,
      currentWalletBalance: 90000,
      completedBookings: 2,
      minWithdrawalAmount: 50000,
      onlineTransferGrossRevenue: 100000,
      onlineTransferNetRevenue: 90000,
      onlineTransferCount: 1,
      periodOnlineTransferGrossRevenue: 100000,
      periodOnlineTransferNetRevenue: 90000,
      periodOnlineTransferCount: 1,
      counterQrGrossRevenue: 0,
      counterQrNetRevenue: 0,
      counterQrCount: 0,
      periodCounterQrGrossRevenue: 0,
      periodCounterQrNetRevenue: 0,
      periodCounterQrCount: 0,
      totalCashRevenue: 20000,
      totalCashBookings: 1,
      periodCashRevenue: 20000,
      periodCashBookings: 1,
      revenueByParkingLot: [
        {
          parkingLotId: 10,
          onlineTransferGrossRevenue: 100000,
          onlineTransferRevenue: 90000,
          onlineTransferCount: 1,
          counterQrGrossRevenue: 0,
          counterQrRevenue: 0,
          counterQrCount: 0,
          cashRevenue: 20000,
          cashBookingCount: 1,
          periodOnlineTransferGrossRevenue: 100000,
          periodOnlineTransferRevenue: 90000,
          periodOnlineTransferCount: 1,
          periodCounterQrGrossRevenue: 0,
          periodCounterQrRevenue: 0,
          periodCounterQrCount: 0,
          periodCashRevenue: 20000,
          periodCashBookingCount: 1,
        },
      ],
      series: [
        {
          period: '2026-11-18',
          revenue: 90000,
          onlineTransferRevenue: 90000,
          counterQrRevenue: 0,
          cashRevenue: 20000,
          bookingCount: 2,
        },
      ],
    }

    const lotsPayload = {
      content: [{ id: 10, name: 'Bãi Kiểm Chứng', address: 'Quận 1', status: 'APPROVED' }],
      totalElements: 1,
    }

    vi.spyOn(apiClient, 'get').mockImplementation((async (url: string) => {
      if (url === '/api/v1/merchant/revenue') return { data: { data: sharedPayload } }
      if (url === '/api/v1/merchant/parking-lots') return { data: { data: lotsPayload } }
      if (url === '/api/v1/merchant/bookings') return { data: { data: { content: [], totalElements: 0 } } }
      if (url === '/api/v1/merchant/revenue/ledger') {
        return { data: { data: { content: [], currentPage: 0, totalPages: 0, totalElements: 0 } } }
      }
      return { data: { data: {} } }
    }) as never)

    // 1. Render MerchantDashboardPage
    const dashboardQc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={dashboardQc}>
        <MemoryRouter>
          <MerchantDashboardPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByTestId('merchant-kpi-total-value')).toHaveTextContent(/120\.000/)
    expect(screen.getByTestId('merchant-kpi-cash-value')).toHaveTextContent(/20\.000/)
    expect(screen.getByTestId('channel-card-transfer')).toHaveTextContent(/100\.000/)
    expect(screen.getByTestId('channel-card-cash')).toHaveTextContent(/20\.000/)
    expect(screen.getByTestId('lot-revenue-row-10')).toHaveTextContent(/100\.000/)
    expect(screen.getByTestId('lot-revenue-row-10')).toHaveTextContent(/120\.000/)
    expect(screen.getByText('Chuyển khoản (sau phí)')).toBeInTheDocument()

    cleanup()

    // 2. Render MerchantRevenuePage with the EXACT same payload
    const revenueQc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={revenueQc}>
        <MemoryRouter>
          <MerchantRevenuePage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByTestId('revenue-kpi-total-value')).toHaveTextContent(/120\.000/)
    expect(screen.getByTestId('revenue-kpi-cash-value')).toHaveTextContent(/20\.000/)
    expect(screen.getByTestId('revenue-kpi-net-value')).toHaveTextContent(/90\.000/)
    expect(screen.getByTestId('revenue-kpi-fee-value')).toHaveTextContent(/10\.000/)
    expect(screen.getByTestId('lot-revenue-row-10')).toHaveTextContent(/100\.000/)
    expect(screen.getByTestId('lot-revenue-row-10')).toHaveTextContent(/120\.000/)

    // 3. Also verify filtered lot (lot 10) + date period with DIFFERENT all-time vs period numbers -> both screens match!
    const periodDiffPayload = {
      ...sharedPayload,
      totalGrossRevenue: 500000,
      totalPlatformFee: 50000,
      totalNetRevenue: 450000,
      onlineTransferGrossRevenue: 500000,
      onlineTransferNetRevenue: 450000,
      onlineTransferCount: 5,
      totalCashRevenue: 80000,
      totalCashBookings: 4,
      // Period figures match reviewer example (100k gross, 10k fee, 90k net, 20k cash -> 120k total gross)
      periodTotalGrossRevenue: 100000,
      periodTotalPlatformFee: 10000,
      periodTotalNetRevenue: 90000,
      periodOnlineTransferGrossRevenue: 100000,
      periodOnlineTransferNetRevenue: 90000,
      periodOnlineTransferCount: 1,
      periodCashRevenue: 20000,
      periodCashBookings: 1,
    }

    vi.spyOn(apiClient, 'get').mockImplementation((async (url: string) => {
      if (url === '/api/v1/merchant/revenue') return { data: { data: periodDiffPayload } }
      if (url === '/api/v1/merchant/parking-lots') return { data: { data: lotsPayload } }
      if (url === '/api/v1/merchant/bookings') return { data: { data: { content: [], totalElements: 0 } } }
      if (url === '/api/v1/merchant/revenue/ledger') {
        return { data: { data: { content: [], currentPage: 0, totalPages: 0, totalElements: 0 } } }
      }
      return { data: { data: {} } }
    }) as never)

    cleanup()
    getMerchantDashboardStoreSnapshot().resetStore()
    getMerchantDashboardStoreSnapshot().setSelectedLotId(10)
    getMerchantDashboardStoreSnapshot().setTimeRange('WEEK')

    const filteredDashQc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={filteredDashQc}>
        <MemoryRouter>
          <MerchantDashboardPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByTestId('merchant-kpi-total-value')).toHaveTextContent(/120\.000/)
    expect(screen.getByTestId('channel-card-transfer')).toHaveTextContent(/100\.000/)
    expect(screen.getByTestId('channel-card-cash')).toHaveTextContent(/20\.000/)

    cleanup()
    const filteredRevQc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={filteredRevQc}>
        <MemoryRouter>
          <MerchantRevenuePage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('Tổng Doanh thu (trước phí)')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Cơ sở bãi đỗ'), { target: { value: '10' } })
    fireEvent.change(screen.getByLabelText('Từ ngày'), { target: { value: '2026-11-12' } })
    fireEvent.change(screen.getByLabelText('Đến ngày'), { target: { value: '2026-11-18' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng' }))

    await waitFor(() => {
      expect(screen.getByTestId('revenue-kpi-total-value')).toHaveTextContent(/120\.000/)
    })
    expect(screen.getByTestId('channel-card-transfer')).toHaveTextContent(/100\.000/)
    expect(screen.getByTestId('channel-card-cash')).toHaveTextContent(/20\.000/)
    expect(screen.getByTestId('revenue-kpi-net-value')).toHaveTextContent(/90\.000/)
    expect(screen.getByTestId('revenue-kpi-fee-value')).toHaveTextContent(/10\.000/)
  })

  it('F-03: invalidates booking status-summary KPI cache after gate cash checkout so Hoàn tất refreshes immediately', async () => {
    let completedCount = 10

    vi.spyOn(apiClient, 'get').mockImplementation((async (url: string) => {
      if (url === '/api/v1/merchant/bookings/summary') {
        return {
          data: {
            data: {
              total: 12,
              pendingCheckIn: 1,
              parking: completedCount === 10 ? 1 : 0,
              completed: completedCount,
            },
          },
        }
      }
      if (url === '/api/v1/merchant/bookings') {
        return {
          data: {
            data: {
              content: [],
              currentPage: 0,
              totalPages: 1,
              totalElements: 12,
            },
          },
        }
      }
      if (url === '/api/v1/merchant/parking-lots') {
        return { data: { data: { content: [] } } }
      }
      if (url === '/api/v1/merchant/bookings/555') {
        return {
          data: {
            data: {
              id: 555,
              bookingCode: 'BK-555',
              parkingLotId: 10,
              status: 'AWAITING_FINAL_PAYMENT',
            },
          },
        }
      }
      return { data: { data: {} } }
    }) as never)

    vi.spyOn(resources, 'sendData').mockImplementation(async (_method, url) => {
      if (url === '/api/v1/merchant/confirm-cash') {
        completedCount = 11
        return null
      }
      return null
    })

    const sharedQc = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
    })

    // Step 1: Open MerchantBookingsPage -> caches status-summary with completed = 10
    const view = render(
      <QueryClientProvider client={sharedQc}>
        <Provider store={store}>
          <MemoryRouter initialEntries={['/merchant/bookings']}>
            <MerchantBookingsPage />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('booking-metric-completed')).toHaveTextContent('10')
    })

    // Step 2: Perform cash checkout in GateSettlementDialog on the same QueryClient
    const onComplete = vi.fn()
    view.rerender(
      <QueryClientProvider client={sharedQc}>
        <Provider store={store}>
          <MemoryRouter>
            <GateSettlementDialog
              settlement={{
                bookingId: 555,
                bookingCode: 'BK-555',
                totalAmount: 100000,
                advanceDeposit: 50000,
                amountDue: 50000,
                parkingMinutes: 120,
                bookingStatus: 'AWAITING_FINAL_PAYMENT',
              }}
              parkingLotId={10}
              onClose={vi.fn()}
              onComplete={onComplete}
            />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /Đã nhận đủ tiền mặt/i }))
    await waitFor(() => expect(onComplete).toHaveBeenCalled())

    // Step 3: Return immediately to MerchantBookingsPage -> invalidated status-summary refetches & shows 11!
    view.rerender(
      <QueryClientProvider client={sharedQc}>
        <Provider store={store}>
          <MemoryRouter initialEntries={['/merchant/bookings']}>
            <MerchantBookingsPage />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('booking-metric-completed')).toHaveTextContent('11')
    })
  })

  it('F-04: renders unknown status badge instead of fabricating APPROVED for orphan parkingLotId in breakdown', () => {
    render(
      <MerchantRevenueByLotTable
        lots={[{ id: 10, name: 'Bãi Đã Biết', address: 'Quận 4', status: 'APPROVED' }]}
        breakdowns={[
          {
            parkingLotId: 10,
            onlineTransferGrossRevenue: 100000,
            onlineTransferRevenue: 90000,
            onlineTransferCount: 1,
            counterQrGrossRevenue: 0,
            counterQrRevenue: 0,
            counterQrCount: 0,
            cashRevenue: 0,
            cashBookingCount: 0,
            periodOnlineTransferGrossRevenue: 100000,
            periodOnlineTransferRevenue: 90000,
            periodOnlineTransferCount: 1,
            periodCounterQrGrossRevenue: 0,
            periodCounterQrRevenue: 0,
            periodCounterQrCount: 0,
            periodCashRevenue: 0,
            periodCashBookingCount: 0,
          },
          {
            parkingLotId: 999,
            onlineTransferGrossRevenue: 50000,
            onlineTransferRevenue: 45000,
            onlineTransferCount: 1,
            counterQrGrossRevenue: 0,
            counterQrRevenue: 0,
            counterQrCount: 0,
            cashRevenue: 25000,
            cashBookingCount: 1,
            periodOnlineTransferGrossRevenue: 50000,
            periodOnlineTransferRevenue: 45000,
            periodOnlineTransferCount: 1,
            periodCounterQrGrossRevenue: 0,
            periodCounterQrRevenue: 0,
            periodCounterQrCount: 0,
            periodCashRevenue: 25000,
            periodCashBookingCount: 1,
          },
        ]}
        selectedLotId={null}
        onSelectLot={vi.fn()}
        usePeriodValues={false}
        useGrossTransfer={true}
        periodLabel="Toàn thời gian"
      />,
    )

    const knownRow = screen.getByTestId('lot-revenue-row-10')
    expect(within(knownRow).getByText('Đã duyệt')).toBeInTheDocument()

    const orphanRow = screen.getByTestId('lot-revenue-row-999')
    expect(within(orphanRow).getByText('Bãi đỗ #999')).toBeInTheDocument()
    expect(within(orphanRow).getByTestId('lot-status-unknown-999')).toHaveTextContent('Chưa xác định')
    expect(within(orphanRow).queryByText('Đã duyệt')).not.toBeInTheDocument()
    expect(within(orphanRow).queryByText('APPROVED')).not.toBeInTheDocument()
  })
})
