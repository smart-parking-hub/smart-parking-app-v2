import { test, expect } from '@playwright/test'

for (const width of [390, 1440]) {
  for (const reason of ['VEHICLE_LIMIT', 'COOLDOWN'] as const) {
    test(`hold restriction ${reason} on the actual parking route at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.clock.install({ time: new Date('2026-11-15T06:00:00Z') })
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      let creates = 0
      let paymentCalls = 0
      const token = `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 88, exp: 2000000000 })).toString('base64url')}.test`
      await page.addInitScript(token => localStorage.setItem('access_token', token), token)
      const lot = { id: 1, name: 'Bãi kiểm thử giữ chỗ', address: '123 Quốc Lộ 1A', status: 'APPROVED',
        availableCapacity: 5, totalSlots: 10, basePricePerHour: 20000, latitude: 10.7, longitude: 106.6,
        slots: [{ vehicleType: 'LIGHT_TRUCK', availableCapacity: 5, totalCapacity: 10 }],
        pricingRules: [{ vehicleType: 'LIGHT_TRUCK', basePricePerHour: 20000, surgeMultiplier: 1, overtimePenaltyMultiplier: 1 }] }
      await page.route('**/api/v1/**', async route => {
        const path = new URL(route.request().url()).pathname
        if (path.startsWith('/api/v1/payments')) { paymentCalls++; return route.fulfill({ status: 500, json: {} }) }
        if (path === '/api/v1/bookings' && route.request().method() === 'POST') {
          creates++
          return route.fulfill({ status: reason === 'COOLDOWN' ? 429 : 409, json: {
            success: false, code: `BOOKING_HOLD_${reason}`,
            message: reason === 'COOLDOWN' ? 'Bạn đã bỏ hai lượt giữ chỗ tại bãi này. Vui lòng chờ.' : 'Xe này đang có một vé chờ thanh toán cọc.',
            data: { reason, existingBookingId: reason === 'VEHICLE_LIMIT' ? 41 : null,
              retryAt: reason === 'COOLDOWN' ? '2026-11-15T13:01:00' : null },
          } })
        }
        let data: unknown = { content: [], totalElements: 0, totalPages: 0 }
        if (path.includes('parking-lots')) data = path.endsWith('/1') ? lot : { content: [lot], totalElements: 1, totalPages: 1 }
        else if (path === '/api/v1/vehicles') data = { content: [{ id: 3, licensePlate: '51C-TEST', vehicleType: 'LIGHT_TRUCK', status: 'ACTIVE' }], totalElements: 1, totalPages: 1 }
        else if (path.endsWith('/driver/profile')) data = { fullName: 'Tài xế kiểm thử' }
        else if (path.endsWith('/unread-count')) data = 0
        return route.fulfill({ json: { data } })
      })
      await page.route('**/*tile.openstreetmap.org/**', route => route.abort())
      await page.goto('/parking')
      await page.getByRole('button', { name: 'ĐẶT GIỮ CHỖ', exact: true }).click()
      const dialog = page.getByRole('dialog', { name: 'Đặt giữ chỗ nhanh' })
      await dialog.getByRole('button', { name: 'Tạo booking và xem tiền cọc' }).click()
      const alert = dialog.getByRole('alert')
      await expect(alert).toBeVisible()
      if (reason === 'VEHICLE_LIMIT') {
        await expect(alert.getByRole('link', { name: 'Xem vé đang giữ' })).toHaveAttribute('href', '/bookings?bookingId=41')
      } else {
        await expect(dialog.getByRole('button', { name: /Có thể thử lại sau/ })).toBeDisabled()
        await expect(alert).toContainText('giờ Việt Nam')
        expect(creates).toBe(1)
        await page.clock.fastForward(61000)
        const retry = dialog.getByRole('button', { name: 'Tạo booking và xem tiền cọc' })
        await expect(retry).toBeEnabled()
        expect(creates).toBe(1) // Reaching the deadline never auto-posts a new hold.
        await retry.click()
        await expect.poll(() => creates).toBe(2)
      }
      expect(paymentCalls).toBe(0)
      expect(await dialog.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(false)
      await page.screenshot({ path: `.artifacts/hold-policy/${reason}-${width}.png` })
      expect(errors).toEqual([])
    })
  }
}
