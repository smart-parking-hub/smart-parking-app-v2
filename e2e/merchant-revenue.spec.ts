import { expect, test } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`PAY-03: revenue filters and wallet ledger at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const token = `test.${Buffer.from(JSON.stringify({ sub: '7', role: 'ROLE_MERCHANT', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
    await page.addInitScript(value => localStorage.setItem('access_token', value), token)
    const runtimeErrors: string[] = []
    page.on('pageerror', error => runtimeErrors.push(error.message))
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) runtimeErrors.push(message.text()) })
    await page.route('**/api/v1/**', route => route.fulfill({ json: { data: { id: 7, content: [], totalElements: 0, totalPages: 0, currentPage: 0, fullName: 'Merchant kiểm thử' } } }))
    await page.route('**/api/v1/merchant/parking-lots**', route => route.fulfill({ json: { data: {
      content: [{ id: 10, name: 'Lot A', status: 'APPROVED' }], totalElements: 1,
    } } }))
    const reads: URL[] = []
    await page.route('**/api/v1/merchant/revenue**', route => {
      const url = new URL(route.request().url())
      reads.push(url)
      expect(route.request().method()).toBe('GET')
      if (url.pathname.endsWith('/ledger')) {
        return route.fulfill({ json: { data: {
          content: [{ id: 81, bookingId: null, entryType: 'WITHDRAWAL_HOLD', grossAmount: 0, feeAmount: 0, feePercent: 0, netAmount: -50000, note: 'Yêu cầu rút #12', createdAt: '2026-11-14T09:30:00' }],
          currentPage: Number(url.searchParams.get('page')), totalElements: 21, totalPages: 2,
        } } })
      }
      return route.fulfill({ json: { data: {
        totalGrossRevenue: 300000, totalNetRevenue: 162000, totalPlatformFee: 18000, currentWalletBalance: 162000,
        periodTotalGrossRevenue: 300000, periodTotalNetRevenue: 162000, periodTotalPlatformFee: 18000,
        onlineTransferGrossRevenue: 80000, onlineTransferNetRevenue: 72000, onlineTransferCount: 1,
        periodOnlineTransferGrossRevenue: 80000, periodOnlineTransferNetRevenue: 72000, periodOnlineTransferCount: 1,
        counterQrGrossRevenue: 0, counterQrNetRevenue: 0, counterQrCount: 0,
        periodCounterQrGrossRevenue: 0, periodCounterQrNetRevenue: 0, periodCounterQrCount: 0,
        unclassifiedTransferGrossRevenue: 100000, unclassifiedTransferNetRevenue: 90000, unclassifiedTransferCount: 1,
        periodUnclassifiedTransferGrossRevenue: 100000, periodUnclassifiedTransferNetRevenue: 90000, periodUnclassifiedTransferCount: 1,
        pendingSettlementGrossRevenue: 120000, periodPendingSettlementGrossRevenue: 120000,
        totalCashRevenue: 20000, totalCashBookings: 1, periodCashRevenue: 20000, periodCashBookings: 1,
        revenueByParkingLot: [{
          parkingLotId: 10, onlineTransferGrossRevenue: 80000, onlineTransferRevenue: 72000, onlineTransferCount: 1,
          counterQrGrossRevenue: 0, counterQrRevenue: 0, counterQrCount: 0,
          unclassifiedTransferGrossRevenue: 100000, unclassifiedTransferRevenue: 90000,
          pendingSettlementGrossRevenue: 120000, cashRevenue: 20000, cashBookingCount: 1,
          periodOnlineTransferGrossRevenue: 80000, periodOnlineTransferRevenue: 72000, periodOnlineTransferCount: 1,
          periodCounterQrGrossRevenue: 0, periodCounterQrRevenue: 0, periodCounterQrCount: 0,
          periodUnclassifiedTransferGrossRevenue: 100000, periodUnclassifiedTransferRevenue: 90000,
          periodPendingSettlementGrossRevenue: 120000, periodCashRevenue: 20000, periodCashBookingCount: 1,
        }],
        completedBookings: 3, minWithdrawalAmount: 50000,
        series: [
          { period: '2026-11-14', revenue: 90000, onlineTransferRevenue: 0, counterQrRevenue: 0, unclassifiedTransferRevenue: 90000, cashRevenue: 20000, bookingCount: 1 },
          { period: '2026-11-15', revenue: 180000, onlineTransferRevenue: 180000, counterQrRevenue: 0, unclassifiedTransferRevenue: 0, cashRevenue: 0, bookingCount: 2 },
        ],
      } } })
    })
    await page.clock.install({ time: new Date('2026-11-19T05:00:00+07:00') })
    await page.goto('/merchant/dashboard')
    await expect(page.getByTestId('merchant-kpi-total-value')).toHaveText(/320\.000/)
    await expect(page.getByTestId('bar-unclassified-2026-11-14')).toBeVisible()
    await expect(page.getByTestId('bar-transfer-2026-11-14')).toHaveCount(0)
    await page.screenshot({ path: `.artifacts/merchant-dashboard-revenue-${width}.png`, fullPage: true })
    await page.getByRole('link', { name: 'Xem báo cáo doanh thu chi tiết' }).click()
    await expect(page.getByRole('heading', { name: 'Hiệu quả kinh doanh' })).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('revenue-kpi-total-value')).toHaveText(/320\.000/)
    await expect(page.getByTestId('lot-revenue-row-10')).toContainText('Chờ quyết toán: 120.000')
    await page.getByTestId('lot-revenue-row-10').getByRole('button').click()
    await expect(page.getByRole('heading', { name: 'Sổ cái ví' })).toBeVisible()
    await expect(page.getByText('Giữ tiền rút', { exact: true })).toBeVisible()
    await expect(page.getByText('-50.000 ₫')).toBeVisible()
    const callCount = reads.length
    const selectDay = async (label: string, day: string) => {
      await page.getByRole('button', { name: `Chọn ${label}` }).click()
      await page.getByRole('dialog', { name: `Lịch chọn ${label}` }).getByRole('button', { name: day, exact: true }).click()
    }
    await selectDay('từ ngày', '15')
    await selectDay('đến ngày', '14')
    await page.getByRole('button', { name: 'Áp dụng', exact: true }).click()
    await expect(page.getByRole('alert')).toContainText('Ngày kết thúc phải từ ngày bắt đầu.')
    expect(reads.length).toBe(callCount)
    await selectDay('từ ngày', '14')
    await selectDay('đến ngày', '15')
    await page.getByRole('combobox', { name: 'Mở bộ lọc nhóm thời gian' }).click()
    await page.getByRole('option', { name: 'Theo tháng' }).click()
    await page.getByRole('button', { name: 'Áp dụng', exact: true }).click()
    const figure = page.getByRole('figure', { name: 'Biểu đồ doanh thu theo kỳ' })
    await expect(figure.getByText('2026-11', { exact: true }).first()).toBeVisible()
    await expect(figure.getByText('290.000 ₫').first()).toBeVisible()
    expect(reads.filter(url => !url.pathname.endsWith('/ledger')).at(-1)?.searchParams.get('startDate')).toBe('2026-11-14')
    await expect(page.getByTestId('revenue-kpi-total-value')).toHaveText(/320\.000/)
    await expect(page.getByTestId('channel-card-transfer')).toContainText('80.000')
    await expect(page.getByTestId('channel-card-unclassified')).toContainText('100.000')
    const summary = page.getByText('Xem bảng số liệu doanh thu', { exact: true })
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(figure.getByRole('table')).toBeVisible()
    await page.getByRole('button', { name: 'Sau', exact: true }).click()
    await expect(page.getByText('Trang 2 / 2')).toBeVisible()
    expect(reads.filter(url => url.pathname.endsWith('/ledger')).at(-1)?.searchParams.get('page')).toBe('1')
    await page.screenshot({ path: `.artifacts/merchant-revenue-${width}.png`, fullPage: true })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(runtimeErrors).toEqual([])
  })
}
