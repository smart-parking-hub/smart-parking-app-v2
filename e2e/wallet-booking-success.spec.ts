import { test, expect } from '@playwright/test'

for (const width of [390, 650, 1440]) {
  test(`wallet deposit displays a readable confirmed ticket at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    const lot = {
      id: 1, name: 'Bãi Xe Phía Nam', address: '123 Quốc Lộ 1A', status: 'APPROVED', merchantId: 5,
      availableCapacity: 5, totalSlots: 10, basePricePerHour: 25000, latitude: 10.7, longitude: 106.6,
      slots: [{ vehicleType: 'LIGHT_TRUCK', availableCapacity: 5, totalCapacity: 10 }],
      pricingRules: [{ vehicleType: 'LIGHT_TRUCK', basePricePerHour: 25000, surgeMultiplier: 1,
        surgeStartTime: null, surgeEndTime: null, overtimePenaltyMultiplier: 2 }],
    }
    const booking = {
      id: 88, bookingCode: 'BK33DA71C2A0C74D79A6C8FBD486F0F67A', parkingLotId: 1, merchantId: 5,
      parkingLotName: lot.name, parkingLotAddress: lot.address, vehicleId: 3, vehiclePlate: '51C-482.91',
      status: 'PENDING_PAYMENT', advanceDeposit: 15000, totalAmount: 75000, hourlyRate: 25000,
      expectedCheckInTime: new Date(Date.now() + 1800000).toISOString(),
      expectedCheckOutTime: new Date(Date.now() + 9000000).toISOString(),
      expiresAt: new Date(Date.now() + 900000).toISOString(),
    }
    let created = false
    let paid = false
    let walletWrites = 0
    await page.addInitScript(token => localStorage.setItem('access_token', token),
      `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 88, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`)
    await page.route('**/api/v1/**', async route => {
      const request = route.request()
      const path = new URL(request.url()).pathname
      let data: unknown = { content: [], totalElements: 0, totalPages: 0 }
      if (path.endsWith('/vehicles')) data = { content: [{ id: 3, licensePlate: booking.vehiclePlate, vehicleType: 'LIGHT_TRUCK', status: 'ACTIVE' }] }
      else if (path.endsWith('/parking-lots/search')) data = { content: [lot], totalElements: 1, totalPages: 1 }
      else if (path.endsWith('/parking-lots/1')) data = lot
      else if (path.endsWith('/payments/wallet')) {
        if (request.method() === 'POST') {
          expect(request.postDataJSON()).toEqual({ bookingId: 88 })
          walletWrites++
          paid = true
          booking.status = 'PENDING_CHECKIN'
          booking.expiresAt = new Date(Date.now() + 5400000).toISOString()
        }
        data = paid ? { id: 71, status: 'SUCCESS' } : null
      } else if (path.endsWith('/driver/wallet')) data = { availableAmount: paid ? 85000 : 100000, heldAmount: 0, currency: 'VND', enabled: true }
      else if (path.endsWith('/bookings/88')) data = booking
      else if (path.endsWith('/bookings')) {
        if (request.method() === 'POST') { created = true; data = booking }
        else data = { content: created ? [booking] : [], totalElements: created ? 1 : 0, totalPages: created ? 1 : 0 }
      } else if (path.endsWith('/profile') || path.endsWith('/users/me')) data = { fullName: 'Tài xế kiểm thử' }
      else if (path.endsWith('/unread-count')) data = 0
      await route.fulfill({ json: { success: true, data } })
    })
    await page.goto('/parking')
    await page.getByRole('button', { name: 'ĐẶT GIỮ CHỖ', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Đặt giữ chỗ nhanh' })
    await dialog.getByRole('button', { name: 'Tạo booking và xem tiền cọc' }).click()
    expect(await dialog.innerHTML()).not.toContain(booking.bookingCode)
    const pay = dialog.getByRole('button', { name: /Trả.*bằng ví/ })
    await expect(pay).toBeEnabled()
    await pay.click()
    const ticket = dialog.getByRole('region', { name: 'Vé check-in đã xác nhận' })
    await expect(ticket).toBeVisible()
    await expect(ticket.getByText(booking.bookingCode, { exact: true })).toHaveCount(1)
    await expect(ticket.getByText('Đã thanh toán cọc')).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Sao chép mã check-in' })).toHaveCount(1)
    await expect(dialog.getByRole('region', { name: 'Thanh toán bằng ví' })).toHaveCount(0)
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
    const qr = await ticket.getByRole('img').boundingBox()
    const card = await ticket.boundingBox()
    expect(qr).not.toBeNull()
    expect(card).not.toBeNull()
    expect(Math.abs(qr!.x + qr!.width / 2 - (card!.x + card!.width / 2))).toBeLessThan(2)
    const download = page.waitForEvent('download')
    await ticket.getByRole('button', { name: 'Tải ảnh vé QR (PNG)' }).click()
    expect((await download).suggestedFilename()).toBe(`QR-CheckIn-${booking.bookingCode}.png`)
    await dialog.evaluate(el => { el.scrollTop = 0 })
    await page.screenshot({ path: `.artifacts/playwright/wallet-booking-success-${width}.png` })
    expect(walletWrites).toBe(1)
    expect(errors).toEqual([])
  })
}
