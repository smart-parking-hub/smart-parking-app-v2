import { test, expect } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`compact tickets expand independently and paginate at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.addInitScript(token => localStorage.setItem('access_token', token),
      `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 88, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`)
    const booking = {
      merchantId: 5, parkingLotId: 1, vehicleId: 3, vehiclePlate: '51C-12345',
      parkingLotName: 'Bãi xe Tân Cảng', parkingLotAddress: '123 Quốc Lộ 1A, Thủ Đức, TP. Hồ Chí Minh',
      status: 'PENDING_CHECKIN', advanceDeposit: 10000, totalAmount: 50000, hourlyRate: 25000,
      surgeMultiplier: 1, overtimePenaltyMultiplier: 1.5,
      expectedCheckInTime: new Date(Date.now() + 30 * 60000).toISOString(),
      expectedCheckOutTime: new Date(Date.now() + 150 * 60000).toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60000).toISOString(),
    }
    await page.route('**/api/v1/**', async route => {
      const url = new URL(route.request().url())
      if (url.pathname === '/api/v1/bookings') {
        expect(url.searchParams.get('size')).toBe('8')
        const current = Number(url.searchParams.get('page') ?? 0)
        await route.fulfill({ json: { data: {
          content: Array.from({ length: 8 }, (_, index) => ({ ...booking,
            id: current * 8 + index + 1, bookingCode: `BK-USABILITY-${current * 8 + index + 1}` })),
          totalElements: 24, totalPages: 3, currentPage: current,
        } } })
      } else if (url.pathname === '/api/v1/driver/profile') {
        await route.fulfill({ json: { data: { fullName: 'Tài xế kiểm thử', role: 'DRIVER' } } })
      } else if (url.pathname.endsWith('/unread-count')) {
        await route.fulfill({ json: { data: 0 } })
      } else {
        await route.fulfill({ json: { data: { content: [], totalElements: 0, totalPages: 0 } } })
      }
    })
    await page.goto('/bookings')
    const toggles = page.getByRole('button', { name: 'Xem vé & chi tiết', exact: true })
    await expect(toggles).toHaveCount(8)
    await expect(page.getByRole('img', { name: /Mã QR Check-in/ })).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
    await page.screenshot({ path: `.artifacts/playwright/compact-bookings-${width}.png`, fullPage: true })
    await toggles.nth(0).click()
    await expect(page.getByRole('img', { name: 'Mã QR Check-in BK-USABILITY-1', exact: true })).toBeVisible()
    await toggles.nth(0).click()
    await expect(page.getByRole('img', { name: 'Mã QR Check-in BK-USABILITY-2', exact: true })).toBeVisible()
    await expect(page.getByRole('img', { name: 'Mã QR Check-in BK-USABILITY-1', exact: true })).toHaveCount(0)
    await page.getByRole('button', { name: 'Trang sau', exact: true }).click()
    await expect(page.getByText('#9 · BK-USABILITY-9', { exact: true })).toBeVisible()
    await expect(toggles).toHaveCount(8)
    expect(errors).toEqual([])
  })
}
