import { test, expect } from '@playwright/test'

const merchantToken = `test.${Buffer.from(
  JSON.stringify({
    role: 'ROLE_MERCHANT',
    sub: '0901234567',
    userId: 101,
    exp: Math.floor(Date.now() / 1000) + 3600,
  }),
).toString('base64url')}.test`

const mockMerchantLot = {
  id: 12,
  name: 'Bãi Đỗ Xe Tân Cảng Container',
  address: 'Cảng Tân Cảng - Phú Hữu, TP. Thủ Đức',
  status: 'APPROVED',
  totalCapacity: 50,
  availableCapacity: 12,
}

test.describe('Flow 2: Check-in Barie Cổng Vào (SP-S3-INT-01)', () => {
  let isCheckedIn = false

  test.beforeEach(async ({ page }) => {
    isCheckedIn = false

    // Inject authenticated MERCHANT session
    await page.addInitScript((token) => {
      localStorage.setItem('access_token', token)
      localStorage.setItem('token', token)
      localStorage.setItem(
        'smart-truck-parking.auth',
        JSON.stringify({ phone: '0901 234 567', role: 'MERCHANT' }),
      )
    }, merchantToken)

    // Mock Merchant Profile
    await page.route('**/api/v1/merchant/profile', (route) =>
      route.fulfill({
        json: {
          data: {
            id: 101,
            merchantId: 101,
            fullName: 'Ban Điều Hành Tân Cảng',
            phone: '0901 234 567',
            role: 'MERCHANT',
          },
        },
      }),
    )

    // Mock Merchant Parking Lots for Scanner dropdown
    await page.route('**/api/v1/merchant/parking-lots*', (route) =>
      route.fulfill({
        json: {
          data: {
            content: [mockMerchantLot],
            totalElements: 1,
            totalPages: 1,
          },
        },
      }),
    )

    // Mock Barie Check-in API
    await page.route('**/api/v1/merchant/check-in', async (route) => {
      expect(route.request().method()).toBe('POST')
      const payload = route.request().postDataJSON()
      expect(payload.bookingCode).toBe('BK-2026-0894')
      expect(payload.parkingLotId).toBe(12)

      isCheckedIn = true
      return route.fulfill({
        json: {
          data: {
            bookingCode: 'BK-2026-0894',
            parkingLotId: 12,
            vehiclePlate: '51D-894.12',
            checkInTime: new Date().toISOString(),
            status: 'PARKING',
          },
          message: 'Xe đã được ghi nhận vào bãi thành công.',
        },
      })
    })

    // Mock Merchant Bookings List
    await page.route('**/api/v1/merchant/bookings*', (route) =>
      route.fulfill({
        json: {
          data: {
            content: [
              {
                id: 501,
                bookingCode: 'BK-2026-0894',
                parkingLotId: 12,
                parkingLotName: 'Bãi Đỗ Xe Tân Cảng Container',
                customerName: 'Trần Quốc Tuấn',
                customerPhone: '0909 128 374',
                vehiclePlate: '51D-894.12',
                status: isCheckedIn ? 'PARKING' : 'PENDING_CHECKIN',
                advanceDeposit: 100000,
                totalAmount: 250000,
                expectedCheckInTime: new Date().toISOString(),
                checkInTime: isCheckedIn ? new Date().toISOString() : null,
                createdAt: new Date().toISOString(),
              },
            ],
            totalElements: 1,
            totalPages: 1,
          },
        },
      }),
    )
  })

  test('Chủ bãi quét mã QR tại cổng vào, đối soát thông tin và ghi nhận xe vào bãi', async ({
    page,
  }) => {
    // 1. Điều hướng tới màn hình Barie QR Scanner
    await page.goto('/merchant/qr-scanner')
    await expect(page).toHaveURL(/\/merchant\/qr-scanner/)

    // 2. Xác minh đang ở chế độ XE VÀO (check-in)
    const checkinTabBtn = page.getByRole('button', { name: 'XE VÀO', exact: true })
    await expect(checkinTabBtn).toBeVisible()
    await expect(checkinTabBtn).toHaveAttribute('aria-pressed', 'true')

    // 3. Chọn bãi đỗ kiểm soát
    const lotSelect = page.getByLabel('Bãi kiểm soát')
    await expect(lotSelect).toBeVisible()
    await lotSelect.selectOption({ value: '12' })

    // 4. Nhập mã đặt chỗ từ QR Terminal Pass của tài xế
    const bookingInput = page.getByLabel('Mã đặt chỗ / Nội dung QR')
    await expect(bookingInput).toBeVisible()
    await bookingInput.fill('BK-2026-0894')

    // 5. Bấm "Xác nhận xe vào bãi"
    const submitBtn = page.getByRole('button', { name: 'Xác nhận xe vào bãi' })
    await expect(submitBtn).toBeEnabled()
    await submitBtn.click()

    // 6. Kiểm tra modal thành công và đóng trước khi tiếp tục
    const confirmation = page.getByRole('dialog', { name: 'Xác nhận xe vào thành công' })
    await expect(confirmation).toBeVisible()
    await expect(confirmation.getByText('BK-2026-0894', { exact: true })).toBeVisible()
    await expect(
      confirmation.getByText('Xe đã được ghi nhận vào bãi.'),
    ).toBeVisible({ timeout: 5000 })
    await confirmation.getByRole('button', { name: 'Đã hiểu' }).click()
    await expect(confirmation).not.toBeVisible()

    // 7. Chuyển sang màn hình quản lý đơn đỗ xe (/merchant/bookings)
    await page.goto('/merchant/bookings')
    await expect(page).toHaveURL(/\/merchant\/bookings/)

    // 8. Xác minh đơn hàng hiển thị với mã BK-2026-0894 và trạng thái Đang đỗ xe
    await expect(page.getByText('BK-2026-0894')).toBeVisible()
    await expect(page.getByText('51D-894.12')).toBeVisible()
    await expect(page.getByText('Đang đỗ xe')).toBeVisible()
  })
})

