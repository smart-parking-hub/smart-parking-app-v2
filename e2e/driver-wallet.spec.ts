import { test, expect } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`wallet refund and deposit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 })
    const token = `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 88, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
    await page.addInitScript(value => localStorage.setItem('access_token', value), token)
    let paid = false
    let available = 8000
    const booking = { id: 41, bookingCode: 'BK-WALLET-41', parkingLotId: 7, merchantId: 9, parkingLotName: 'Bãi kiểm thử', vehicleId: 3, vehiclePlate: '51C-TEST',
      advanceDeposit: 6000, totalAmount: 30000, hourlyRate: 10000, expectedCheckInTime: new Date(Date.now() + 4 * 3600000).toISOString(), expectedCheckOutTime: new Date(Date.now() + 7 * 3600000).toISOString(), expiresAt: new Date(Date.now() + 900000).toISOString() }
    await page.route('**/api/v1/**', async route => {
      const path = new URL(route.request().url()).pathname
      let data: unknown = { content: [], currentPage: 0, totalPages: 0, totalElements: 0 }
      if (path === '/api/v1/driver/wallet') data = { availableAmount: available, heldAmount: 0, currency: 'VND', enabled: true }
      else if (path.endsWith('/wallet/transactions')) data = { content: [{ id: 1, bookingId: 40, paymentId: 70, entryType: 'REFUND', amount: 8000, heldDelta: 0, createdAt: '2026-11-17T15:00:00' }], currentPage: 0, totalPages: 1, totalElements: 1 }
      else if (path === '/api/v1/payments/wallet') { expect(route.request().postDataJSON()).toEqual({ bookingId: 41 }); paid = true; available = 2000; data = { id: 71, status: 'SUCCESS' } }
      else if (path === '/api/v1/bookings') data = { content: [{ ...booking, status: paid ? 'PENDING_CHECKIN' : 'PENDING_PAYMENT' }], currentPage: 0, totalPages: 1, totalElements: 1 }
      else if (path === '/api/v1/bookings/41') data = { ...booking, status: paid ? 'PENDING_CHECKIN' : 'PENDING_PAYMENT' }
      else if (path.endsWith('/unread-count')) data = 0
      else if (path.endsWith('/driver/profile')) data = { fullName: 'Tài xế ví' }
      return route.fulfill({ json: { data } })
    })
    await page.goto('/wallet')
    await expect(page.getByRole('heading', { name: 'Ví của tôi', exact: true })).toBeVisible()
    await expect(page.getByText('Hoàn cọc vào ví', { exact: true }).filter({ visible: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
    await page.screenshot({ path: `.artifacts/driver-wallet/wallet-${width}.png`, fullPage: true })
    await page.goto('/bookings?bookingId=41')
    const pay = page.getByRole('button', { name: /Trả.*bằng ví/ }).first()
    await expect(pay).toBeEnabled()
    await pay.click()
    await expect.poll(() => paid).toBe(true)
    await page.goto('/wallet')
    await expect(page.getByText(/2\.000/).first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
  })
}

test('paid booking cancellation requires wallet consent and exposes the confirmed refund', async ({ page }) => {
  const token = `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 88, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
  await page.addInitScript(value => localStorage.setItem('access_token', value), token)
  let cancelled = false
  let cancellationWrites = 0
  const booking = { id: 42, bookingCode: 'BK-REFUND-42', parkingLotId: 7, merchantId: 9, vehicleId: 3, vehiclePlate: '51C-TEST',
    advanceDeposit: 16000, totalAmount: 80000, hourlyRate: 10000, expectedCheckInTime: new Date(Date.now() + 3600000).toISOString(), expectedCheckOutTime: new Date(Date.now() + 4 * 3600000).toISOString(), expiresAt: new Date(Date.now() + 2 * 3600000).toISOString() }
  await page.route('**/api/v1/**', route => {
    const path = new URL(route.request().url()).pathname
    let data: unknown = { content: [], currentPage: 0, totalElements: 0, totalPages: 0 }
    const current = () => ({ ...booking, status: cancelled ? 'CANCELLED' : 'PENDING_CHECKIN', refundAmount: cancelled ? 8000 : 0,
      refundStatus: cancelled ? 'COMPLETED' : 'NONE', refundChannel: 'WALLET', refundReference: cancelled ? 'WALLET-REFUND-72' : null })
    if (path === '/api/v1/bookings/42/cancel') {
      expect(route.request().postDataJSON()).toMatchObject({ acceptWalletRefund: true })
      cancelled = true; cancellationWrites++; data = current()
    } else if (path === '/api/v1/bookings') data = { content: [current()], currentPage: 0, totalElements: 1, totalPages: 1 }
    else if (path === '/api/v1/bookings/42') data = current()
    else if (path.endsWith('/unread-count')) data = 0
    else if (path.endsWith('/driver/profile')) data = { fullName: 'Tài xế hoàn cọc' }
    return route.fulfill({ json: { data } })
  })
  await page.goto('/bookings?bookingId=42')
  await page.getByRole('button', { name: 'Hủy booking', exact: true }).first().click()
  const dialog = page.getByRole('dialog', { name: 'Xác nhận hủy đặt chỗ' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Xác nhận hủy và hoàn vào ví' })).toBeDisabled()
  expect(cancellationWrites).toBe(0)
  await dialog.getByRole('checkbox').check()
  await dialog.getByRole('button', { name: 'Xác nhận hủy và hoàn vào ví' }).click()
  await expect(page.getByText(/Đã cộng vào ví tài xế/).first()).toBeVisible()
  await expect(page.getByText('Mã hoàn: WALLET-REFUND-72').first()).toBeVisible()
  expect(cancellationWrites).toBe(1)
})
