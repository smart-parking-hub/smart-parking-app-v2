import { expect, test } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`PAY-03: revenue filters and wallet ledger at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const token = `test.${Buffer.from(JSON.stringify({ sub: '7', role: 'ROLE_MERCHANT', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
    await page.addInitScript(value => localStorage.setItem('access_token', value), token)
    const runtimeErrors: string[] = []
    page.on('pageerror', error => runtimeErrors.push(error.message))
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) runtimeErrors.push(message.text()) })
    await page.route('**/api/v1/**', route => route.fulfill({ json: { data: { content: [], totalPages: 0, fullName: 'Merchant kiểm thử' } } }))
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
        totalGrossRevenue: 1000000, totalNetRevenue: 400000, totalPlatformFee: 100000, currentWalletBalance: 400000,
        completedBookings: 3, minWithdrawalAmount: 50000,
        series: [
          { period: '2026-11-01', revenue: 90000, bookingCount: 1 },
          { period: '2026-11-02', revenue: 180000, bookingCount: 2 },
        ],
      } } })
    })
    await page.goto('/merchant/revenue')
    await expect(page.getByRole('heading', { name: 'Sổ cái ví' })).toBeVisible()
    await expect(page.getByText('Giữ tiền rút', { exact: true })).toBeVisible()
    await expect(page.getByText('-50.000 ₫')).toBeVisible()
    const callCount = reads.length
    await page.getByLabel('Từ ngày', { exact: true }).fill('2026-11-14')
    await page.getByLabel('Đến ngày', { exact: true }).fill('2026-11-01')
    await page.getByRole('button', { name: 'Áp dụng', exact: true }).click()
    await expect(page.getByRole('alert')).toContainText('Ngày kết thúc phải từ ngày bắt đầu.')
    expect(reads.length).toBe(callCount)
    await page.getByLabel('Từ ngày', { exact: true }).fill('2026-11-01')
    await page.getByLabel('Đến ngày', { exact: true }).fill('2026-11-30')
    await page.getByLabel('Nhóm thời gian').selectOption('MONTH')
    await page.getByRole('button', { name: 'Áp dụng', exact: true }).click()
    const figure = page.getByRole('figure', { name: 'Biểu đồ doanh thu theo kỳ' })
    await expect(figure.getByText('2026-11', { exact: true }).first()).toBeVisible()
    await expect(figure.getByText('270.000 ₫').first()).toBeVisible()
    expect(reads.filter(url => !url.pathname.endsWith('/ledger')).at(-1)?.searchParams.get('startDate')).toBe('2026-11-01')
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
