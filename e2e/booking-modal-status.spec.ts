import { test, expect } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`open booking details refresh after cancellation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(token => localStorage.setItem('access_token', token),
      `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 88, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    const snapshot = {
      id: 741, bookingCode: 'BK-MODAL-741', merchantId: 5, parkingLotId: 1,
      vehicleId: 3, vehiclePlate: '51C-TEST', parkingLotName: 'Bãi kiểm thử',
      status: 'PENDING_PAYMENT', advanceDeposit: 10000, totalAmount: 50000,
      hourlyRate: 25000, surgeMultiplier: 1, overtimePenaltyMultiplier: 1.5,
      expectedCheckInTime: new Date(Date.now() + 3 * 3600000).toISOString(),
      expectedCheckOutTime: new Date(Date.now() + 5 * 3600000).toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60000).toISOString(),
      refundAmount: 0, refundStatus: 'NONE',
    }
    let current = { ...snapshot }, detailReads = 0, cancellations = 0
    const unexpectedWrites: string[] = []
    await page.route('**/api/v1/**', async route => {
      const request = route.request(), url = new URL(request.url())
      if (request.method() === 'POST' && url.pathname === '/api/v1/bookings/741/cancel') {
        expect(request.postDataJSON()).toEqual({ reason: 'Tài xế chủ động hủy trước check-in', acceptWalletRefund: true })
        cancellations++
        current = { ...current, status: 'CANCELLED' }
        return route.fulfill({ json: { data: current } })
      }
      if (request.method() !== 'GET') {
        unexpectedWrites.push(`${request.method()} ${url.pathname}`)
        return route.fulfill({ status: 409, json: { message: 'Unexpected mutation' } })
      }
      if (url.pathname === '/api/v1/bookings/741') {
        detailReads++
        return route.fulfill({ json: { data: current } })
      }
      // The list may lag behind detail/mutation reads. It must not freeze the modal.
      if (url.pathname === '/api/v1/bookings')
        return route.fulfill({ json: { data: { content: [snapshot], currentPage: 0, totalPages: 1, totalElements: 1 } } })
      if (url.pathname === '/api/v1/driver/profile')
        return route.fulfill({ json: { data: { fullName: 'Tài xế kiểm thử', role: 'DRIVER' } } })
      if (url.pathname === '/api/v1/driver/wallet')
        return route.fulfill({ json: { data: { availableAmount: 0, heldAmount: 0, currency: 'VND', enabled: true } } })
      if (url.pathname === '/api/v1/payments/wallet') return route.fulfill({ json: { data: null } })
      if (url.pathname.endsWith('/unread-count')) return route.fulfill({ json: { data: 0 } })
      return route.fulfill({ json: { data: { content: [], totalElements: 0, totalPages: 0, currentPage: 0 } } })
    })
    await page.goto('/bookings')
    await page.getByRole('button', { name: 'Xem vé & chi tiết', exact: true }).click()
    const detail = page.getByRole('dialog').filter({ hasText: 'Chi tiết lượt đặt chỗ' })
    await detail.getByRole('button', { name: 'Hủy booking', exact: true }).click()
    const confirmation = page.getByRole('dialog', { name: 'Xác nhận hủy đặt chỗ', exact: true })
    await confirmation.getByRole('checkbox').check()
    await confirmation.getByRole('button', { name: 'Xác nhận hủy và hoàn vào ví', exact: true }).click()
    await expect(confirmation).toHaveCount(0)
    await expect(detail).toBeVisible()
    await expect(detail.getByRole('heading', { name: 'Chi tiết lượt đặt chỗ BK-MODAL-741', exact: true })).toBeVisible()
    await expect(detail.getByRole('button', { name: 'Hủy booking', exact: true })).toHaveCount(0)
    await expect(detail.getByRole('button', { name: /Thanh toán cọc .* qua PayOS/ })).toHaveCount(0)
    await expect(detail.getByText(/Khoản được hoàn: 0/)).toBeVisible()
    expect(detailReads).toBeGreaterThanOrEqual(2)
    expect(cancellations).toBe(1)
    expect(unexpectedWrites).toEqual([])
    expect(errors).toEqual([])
    await page.screenshot({ path: `.artifacts/playwright/booking-modal-cancel-${width}.png` })
  })
}
