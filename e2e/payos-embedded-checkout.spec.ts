import { expect, test } from '@playwright/test'

import { sdkFixture, checkoutFixture } from './fixtures/payos-checkout'

for (const width of [390, 1440]) {
  for (const final of [false, true]) {
    test(`PayOS embedded ${final ? 'final' : 'deposit'} at ${width}px requires server confirmation`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 })
      const pageErrors: string[] = []
      page.on('pageerror', (error) => pageErrors.push(error.message))
      let paymentRequests = 0
      let syncRequests = 0
      let sdkRequests = 0
      let status = final ? 'AWAITING_FINAL_PAYMENT' : 'PENDING_PAYMENT'
      const booking = () => ({
        id: 51, bookingCode: 'BK-SERVER-51', parkingLotId: 7, merchantId: 2,
        parkingLotName: 'Bãi kiểm thử PayOS', vehicleId: 3, vehiclePlate: '51C-TEST',
        status, advanceDeposit: 20000, totalAmount: 100000, hourlyRate: 25000,
        expectedCheckInTime: new Date(Date.now() + 1800000).toISOString(),
        expectedCheckOutTime: new Date(Date.now() + 9000000).toISOString(),
        expiresAt: new Date(Date.now() + 900000).toISOString(),
      })
      await page.route('**/api/v1/bookings**', async (route) => {
        await route.fulfill({ json: { data: { content: [booking()], totalElements: 1, totalPages: 1, number: 0, size: 100 } } })
      })
      await page.route('**/api/v1/payments', async (route) => {
        paymentRequests++
        expect(route.request().postDataJSON()).toEqual({ bookingId: 51, paymentType: final ? 'FINAL_PAYMENT' : 'DEPOSIT' })
        await route.fulfill({ json: { data: 'https://pay.payos.vn/web/fixture-51' } })
      })
      await page.route('**/api/v1/payments/sync', async (route) => {
        syncRequests++
        expect(route.request().postDataJSON()).toEqual({ bookingId: 51 })
        if (syncRequests > 1) status = final ? 'COMPLETED' : 'PENDING_CHECKIN'
        await route.fulfill({ json: { data: { status: syncRequests > 1 ? 'SUCCESS' : 'PENDING' } } })
      })
      await page.route('https://cdn.payos.vn/**', async (route) => {
        sdkRequests++
        await route.fulfill({ contentType: 'application/javascript', body: sdkFixture })
      })
      await page.route('https://pay.payos.vn/**', async (route) => {
        await route.fulfill({ contentType: 'text/html; charset=utf-8', body: checkoutFixture })
      })
      await page.route('**/src/main.tsx', (route) => route.fulfill({
        contentType: 'application/javascript', body: "import '/e2e/fixtures/payos-booking-harness.tsx'",
      }))
      await page.goto('/')
      await expect(page.getByText('BK-SERVER-51', { exact: true })).toBeVisible()
      expect(sdkRequests).toBe(0)
      await page.getByRole('button', { name: final ? 'Thanh toán phần còn lại qua PayOS' : /Thanh toán cọc.*qua PayOS/ }).click()
      const panel = page.getByRole('region', { name: 'Thanh toán PayOS', exact: true })
      await expect(panel).toBeVisible()
      const frame = page.frameLocator('iframe[title="Mã QR thanh toán PayOS"]')
      await expect(frame.getByRole('img', { name: 'QR kiểm thử' })).toBeVisible()
      await expect(page.getByText('Đang tải khung QR PayOS…')).toHaveCount(0)
      expect(paymentRequests).toBe(1)
      await expect(panel.getByRole('link', { name: 'Mở trang PayOS' })).toHaveAttribute('href', 'https://pay.payos.vn/web/fixture-51')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      expect(await panel.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)
      await testInfo.attach('embedded-checkout', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })

      // A client-side PAID event alone does not grant check-in or mark the booking completed.
      await frame.getByRole('button', { name: 'Thông báo đã quét (fixture)' }).click()
      await expect(panel.getByText(/Chưa ghi nhận thanh toán/)).toBeVisible()
      await expect(page.getByText(final ? 'Chờ thanh toán phần còn lại' : 'Chờ thanh toán cọc', { exact: true })).toBeVisible()
      await expect(page.getByTestId('checkin-qr-container')).toHaveCount(0)

      await panel.getByRole('button', { name: /Kiểm tra trạng thái thanh toán/ }).click()
      await expect(panel).toHaveCount(0)
      if (final) {
        await expect(page.getByText('Đã hoàn tất', { exact: true })).toBeVisible()
      } else {
        await expect(page.getByTestId('checkin-qr-container')).toBeVisible()
      }
      expect(syncRequests).toBe(2)
      expect(pageErrors).toEqual([])
    })
  }
}
