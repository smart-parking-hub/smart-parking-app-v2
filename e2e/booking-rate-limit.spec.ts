import { test, expect } from '@playwright/test'
import { mockBookingSchedule } from './fixtures/booking-schedule'

for (const width of [390, 1440]) test(`legacy booking rate error allows immediate explicit retry at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.clock.install({ time: new Date('2026-11-17T00:00:00Z') })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => localStorage.setItem('access_token', `test.${btoa(JSON.stringify({ role: 'ROLE_DRIVER', userId: 88, exp: 2000000000 }))}.test`))
  const lot = { id: 7, name: 'Bãi kiểm thử chống spam', address: 'Thủ Đức, TP. Hồ Chí Minh', status: 'APPROVED', merchantId: 9,
    slots: [{ vehicleType: 'HEAVY_TRUCK', availableCapacity: 1, totalCapacity: 1 }],
    pricingRules: [{ vehicleType: 'HEAVY_TRUCK', basePricePerHour: 20000, surgeMultiplier: 1, surgeStartTime: null, surgeEndTime: null, overtimePenaltyMultiplier: 1.5 }] }
  const booking = { id: 941, bookingCode: 'BK-SPAM-941', parkingLotId: 7, merchantId: 9, vehicleId: 3, vehiclePlate: '51C-12345',
    parkingLotName: lot.name, parkingLotAddress: lot.address, status: 'PENDING_PAYMENT', advanceDeposit: 10000, totalAmount: 50000, hourlyRate: 20000,
    expectedCheckInTime: '2026-11-17T07:30:00', expectedCheckOutTime: '2026-11-17T09:00:00', expiresAt: '2026-11-17T07:16:00' }
  const attempts: Record<string, unknown>[] = []
  await page.route('**/api/v1/**', async route => {
    const url = new URL(route.request().url())
    let data: unknown = { content: [] }
    if (url.pathname === '/api/v1/bookings' && route.request().method() === 'POST') {
      attempts.push(route.request().postDataJSON())
      if (attempts.length === 1) {
        await route.fulfill({ status: 429, headers: { 'Retry-After': '43200' }, json: {
          success: false, code: 'BOOKING_HOLD_RATE_LIMIT', message: 'Bạn đang tạo giữ chỗ quá nhanh. Vui lòng chờ rồi thử lại.',
          data: { reason: 'RATE_LIMIT', retryAt: '2026-11-17T19:00:00' },
        } })
        return
      }
      data = booking
    } else if (url.pathname === '/api/v1/parking-lots/7') data = lot
    else if (url.pathname === '/api/v1/vehicles') data = { content: [{ id: 3, licensePlate: '51C-12345', vehicleType: 'HEAVY_TRUCK', status: 'ACTIVE' }] }
    else if (url.pathname === '/api/v1/bookings/941') data = booking
    else if (url.pathname.endsWith('/unread-count')) data = 0
    else if (url.pathname.endsWith('/driver/profile') || url.pathname.endsWith('/users/me')) data = { id: 88, fullName: 'Tài xế kiểm thử', role: 'DRIVER' }
    else if (url.pathname === '/api/v1/driver/wallet') data = { availableAmount: 0, heldAmount: 0, currency: 'VND', enabled: true }
    else if (url.pathname === '/api/v1/payments/wallet') data = null
    await route.fulfill({ json: { data } })
  })
  await mockBookingSchedule(page)
  await page.goto('/parking/7')
  await page.getByRole('button', { name: 'Thời lượng khác' }).click()
  const duration = page.getByLabel('Số giờ đỗ')
  await duration.fill('1')
  await page.getByLabel('Thêm phút').selectOption('30')
  const start = page.getByRole('button', { name: 'Giờ vào dự kiến' })
  const startLabel = await start.textContent()
  const submit = page.getByRole('button', { name: 'Tạo booking và xem tiền cọc' })
  await expect(submit).toBeEnabled()
  await submit.click()
  const alert = page.getByRole('alert')
  await expect(alert).toContainText('Chưa tạo được booking. Vui lòng thử lại.')
  await expect(alert).not.toContainText(/quá nhanh|thử lại sau|Có thể thử lại từ/)
  await expect(submit).toBeEnabled()
  await expect(duration).toHaveValue('1')
  await expect(page.getByLabel('Thêm phút')).toHaveValue('30')
  await expect(start).toHaveText(startLabel!)
  await page.getByRole('combobox', { name: 'Phương tiện của bạn' }).selectOption('3')
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
  await page.screenshot({ path: `.artifacts/playwright/booking-rate-limit-${width}.png`, fullPage: true })
  expect(attempts).toHaveLength(1)
  await expect(duration).toHaveValue('1')
  await expect(page.getByLabel('Thêm phút')).toHaveValue('30')
  await expect(start).toHaveText(startLabel!)
  await submit.click()
  await expect(page.getByText('#941', { exact: true })).toBeVisible()
  expect(attempts).toHaveLength(2)
  expect(attempts[1]).toEqual(attempts[0])
  expect(errors).toEqual([])
})
