import { test, expect } from '@playwright/test'
import { mockEmptyDriverWallet } from './fixtures/payment-reads'

test.use({ baseURL: process.env.QUICK_HOLD_BASE_URL || 'http://127.0.0.1:5174' })

for (const width of [390, 650, 1440]) {
  test(`quick book real server reservation flow, keyboard and verification at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await mockEmptyDriverWallet(page, 88)
    if (width === 1440) {
      await page.route('**/api/v1/driver/wallet', route => route.fulfill({ json: { data: {
        availableAmount: 1239000, heldAmount: 0, currency: 'VND', enabled: true,
      } } }))
    }
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    let bookingRequestBody: Record<string, unknown> | null = null
    const serverBooking = {
      id: 88,
      bookingCode: 'BK-SERVER-88',
      parkingLotId: 1,
      merchantId: 5,
      parkingLotName: 'Bãi Xe Phía Nam',
      parkingLotAddress: '123 Quốc Lộ 1A, Phường Bình Trị Đông B, Quận Bình Tân, Thành phố Hồ Chí Minh',
      vehicleId: 3,
      vehiclePlate: '51C-12345',
      status: 'PENDING_PAYMENT',
      advanceDeposit: 15000,
      totalAmount: 75000,
      hourlyRate: 25000,
      surgeMultiplier: 1.2,
      surgeStartTime: '17:00:00',
      surgeEndTime: '20:00:00',
      overtimePenaltyMultiplier: 2,
      expectedCheckInTime: new Date(Date.now() + 1800000).toISOString(),
      expectedCheckOutTime: new Date(Date.now() + 9000000).toISOString(),
      expiresAt: new Date(Date.now() + 900000).toISOString(),
    }
    const serverBookingsList: Array<typeof serverBooking> = []

    // Intercept API routes
    await page.route('**/api/v1/vehicles**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            content: [
              {
                id: 3,
                licensePlate: '51C-12345',
                vehicleType: 'HEAVY_TRUCK',
                status: 'ACTIVE',
              },
            ],
            totalElements: 1,
            totalPages: 1,
            size: 100,
            number: 0,
          },
        }),
      })
    })

    await page.route('**/api/v1/parking-lots/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 1,
            name: 'Bãi Xe Phía Nam',
            address: '123 Quốc Lộ 1A',
            status: 'APPROVED',
            merchantId: 5,
            slots: [
              {
                vehicleType: 'HEAVY_TRUCK',
                availableCapacity: 5,
                totalCapacity: 10,
              },
            ],
            pricingRules: [
              {
                vehicleType: 'HEAVY_TRUCK',
                basePricePerHour: 25000,
                surgeMultiplier: 1.2,
                surgeStartTime: '17:00:00',
                surgeEndTime: '20:00:00',
                overtimePenaltyMultiplier: 2,
              },
            ],
          },
        }),
      })
    })

    await page.route(/\/api\/v1\/bookings/, async (route) => {
      const url = new URL(route.request().url())
      if (route.request().method() === 'POST') {
        bookingRequestBody = route.request().postDataJSON()
        serverBookingsList.push(serverBooking)
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: serverBooking }),
        })
      } else if (url.pathname.endsWith('/88')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: serverBooking }),
        })
      } else {
        // Initial GET before POST returns empty list; after POST returns populated list
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              content: [...serverBookingsList],
              totalElements: serverBookingsList.length,
              totalPages: serverBookingsList.length > 0 ? 1 : 0,
              size: 100,
              number: 0,
            },
          }),
        })
      }
    })

    // Exercise the application route with API fixtures, avoiding a second React root.
    await page.addInitScript(token => localStorage.setItem('access_token', token),
      `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 88, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`)
    await page.route('**/api/v1/parking-lots/search**', route => route.fulfill({ json: { data: {
      content: [{ id: 1, name: 'Bãi Xe Phía Nam', address: '123 Quốc Lộ 1A', availableCapacity: 5,
        totalSlots: 10, basePricePerHour: 25000, latitude: 10.7, longitude: 106.6 }],
      totalElements: 1, totalPages: 1,
    } } }))
    await page.route('**/api/v1/driver/profile', route => route.fulfill({ json: { data: { fullName: 'Tài xế kiểm thử' } } }))
    await page.route('**/api/v1/notifications/unread-count', route => route.fulfill({ json: { data: 0 } }))
    await page.route('**/api/v1/disputes/me**', route => route.fulfill({ json: { data: { content: [], totalElements: 0, totalPages: 0 } } }))
    await page.goto('/parking')
    const triggerBtn = page.getByRole('button', { name: 'ĐẶT GIỮ CHỖ', exact: true })
    await triggerBtn.click()

    const dialog = page.getByRole('dialog', { name: 'Đặt giữ chỗ nhanh' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { level: 2, name: 'Đặt giữ chỗ nhanh' })).toBeVisible()
    await expect(dialog.getByText('Bãi Xe Phía Nam')).toBeVisible()

    // R1: Assert no 10-minute hold promise remains in heading, eyebrow or body
    await expect(dialog.getByText(/khẩn cấp \(10 Phút\)/i)).toHaveCount(0)
    await expect(dialog.getByText(/giữ chỗ nhanh 10 phút/i)).toHaveCount(0)

    // Keyboard navigation: Escape key closes modal and restores focus to trigger button
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(triggerBtn).toBeFocused()

    // Re-open dialog via trigger button
    await triggerBtn.click()
    await expect(dialog).toBeVisible()

    // Real vehicle select option is loaded from API and attached
    const vehicleOption = dialog.getByRole('option', { name: /51C-12345/ })
    await expect(vehicleOption).toBeAttached()
    await expect(dialog.getByRole('combobox')).toHaveValue('3')

    // 15-minute deposit rule and 20% deposit notice is shown
    await expect(dialog.getByText(/20%/)).toBeVisible()
    await expect(dialog.getByText(/15 phút/).first()).toBeVisible()

    // No fake ALPR or fake active_hold text
    await expect(dialog.getByText('Đã xác thực ALPR')).toHaveCount(0)

    // Verify dialog width fits without horizontal overflow
    const hasHorizontalOverflow = await dialog.evaluate(
      (el) => el.scrollWidth > el.clientWidth,
    )
    expect(hasHorizontalOverflow).toBe(false)

    // Save screenshot to .artifacts directory
    await page.screenshot({ path: `.artifacts/playwright/quick-hold-${width}.png` })

    // Submit booking
    const submitBtn = dialog.getByRole('button', {
      name: 'Tạo booking và xem tiền cọc',
    })
    const closeBtn = dialog.getByRole('button', { name: 'Đóng', exact: true })
    await expect(submitBtn).toBeEnabled()
    await closeBtn.focus()
    await page.keyboard.press('Shift+Tab')
    await expect(submitBtn).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(closeBtn).toBeFocused()
    await submitBtn.click()

    // Unpaid orders expose their order ID and status, keeping the check-in code hidden.
    await expect(dialog.getByText('#88', { exact: true })).toBeVisible()
    expect(await dialog.innerHTML()).not.toContain('BK-SERVER-88')
    await expect(dialog.getByText('Chờ thanh toán cọc')).toBeVisible()
    await expect(dialog.getByText(serverBooking.parkingLotAddress, { exact: true })).toBeVisible()
    await expect(dialog.getByRole('region', { name: 'Thanh toán bằng ví' })).toBeVisible()
    await expect(dialog.getByRole('button', { name: /Thanh toán cọc.*qua PayOS/ })).toBeEnabled()
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
    if (width === 1440) {
      expect((await dialog.boundingBox())?.width).toBe(680)
      await expect(dialog.getByRole('button', { name: /Trả.*bằng ví/ })).toBeEnabled()
    }
    for (const title of ['Chi tiết giá & phụ phí', 'Tác vụ khác']) {
      await expect(dialog.locator('details').filter({ has: page.getByText(title, { exact: true }) })).not.toHaveAttribute('open', '')
    }
    await dialog.evaluate(el => { el.scrollTop = 0 })
    await dialog.screenshot({ path: `.artifacts/playwright/quick-hold-payment-${width}.png` })

    // Verify POST payload DTO
    expect(bookingRequestBody).toMatchObject({
      parkingLotId: 1,
      vehicleId: 3,
      vehicleType: 'HEAVY_TRUCK',
    })
    expect((bookingRequestBody as Record<string, unknown> | null)?.requestId).toBeTruthy()

    // Verify NO fake hold written to localStorage
    const hold = await page.evaluate(() =>
      localStorage.getItem('smart-truck-parking.active_hold'),
    )
    expect(hold).toBeNull()

    // Navigate to /bookings via the returned link
    await dialog.getByText('Tác vụ khác', { exact: true }).click()
    const bookingsLink = dialog.getByRole('link', {
      name: 'Xem các lượt đặt chỗ',
    })
    await bookingsLink.click()
    await expect(page).toHaveURL(/\/bookings\?bookingId=88$/)

    // Server booking appears in /bookings list
    await expect(page.getByText('#88', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: /Vé vừa xem.*Bãi Xe Phía Nam/ })).toBeVisible()

    expect(errors).toEqual([])
  })
}
