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

test.describe('Flow 3: Check-out Barie, Tính Giá Lũy Tiến & Thu Tiền Mặt (SP-S3-INT-01)', () => {
  let isSettled = false

  test.beforeEach(async ({ page }) => {
    isSettled = false

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

    // Mock Barie Check-out API (Động cơ tính giá lũy tiến trừ tiền cọc)
    await page.route('**/api/v1/merchant/check-out', async (route) => {
      expect(route.request().method()).toBe('POST')
      const payload = route.request().postDataJSON()
      expect(payload.bookingCode).toBe('BK-2026-0894')
      expect(payload.parkingLotId).toBe(12)

      return route.fulfill({
        json: {
          data: {
            bookingCode: 'BK-2026-0894',
            bookingStatus: 'CHECKED_OUT',
            parkingMinutes: 240,
            totalAmount: 160000,
            advanceDeposit: 100000,
            amountDue: 60000,
          },
        },
      })
    })

    // Mock Cash Settlement Confirmation API
    await page.route('**/api/v1/merchant/confirm-cash', async (route) => {
      expect(route.request().method()).toBe('POST')
      const payload = route.request().postDataJSON()
      expect(payload.bookingCode).toBe('BK-2026-0894')
      expect(payload.parkingLotId).toBe(12)

      isSettled = true
      return route.fulfill({
        json: {
          data: null,
          message: 'Xác nhận thu tiền mặt và trả chỗ thành công.',
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
                status: isSettled ? 'COMPLETED' : 'PARKING',
                advanceDeposit: 100000,
                totalAmount: 160000,
                expectedCheckInTime: new Date(Date.now() - 14400000).toISOString(),
                checkInTime: new Date(Date.now() - 14400000).toISOString(),
                checkOutTime: isSettled ? new Date().toISOString() : null,
                createdAt: new Date(Date.now() - 15000000).toISOString(),
              },
            ],
            totalElements: 1,
            totalPages: 1,
          },
        },
      }),
    )
  })

  test('Chủ bãi quét mã QR tại cổng ra, kiểm tra số tiền lũy tiến và xác nhận thu tiền mặt', async ({
    page,
  }) => {
    // 1. Điều hướng tới màn hình Barie QR Scanner
    await page.goto('/merchant/qr-scanner')
    await expect(page).toHaveURL(/\/merchant\/qr-scanner/)

    // 2. Chuyển sang tab "XE RA" (check-out)
    const checkoutTabBtn = page.getByRole('button', { name: 'XE RA' })
    await expect(checkoutTabBtn).toBeVisible()
    await checkoutTabBtn.click()
    await expect(checkoutTabBtn).toHaveAttribute('aria-pressed', 'true')

    // 3. Chọn bãi đỗ kiểm soát
    const lotSelect = page.getByLabel('Bãi kiểm soát')
    await expect(lotSelect).toBeVisible()
    await lotSelect.selectOption({ value: '12' })

    // 4. Nhập mã vé đặt chỗ
    const bookingInput = page.getByLabel('Mã đặt chỗ / Nội dung QR')
    await expect(bookingInput).toBeVisible()
    await bookingInput.fill('BK-2026-0894')

    // 5. Bấm "Kiểm tra & quyết toán xe ra"
    const submitBtn = page.getByRole('button', { name: 'Kiểm tra & quyết toán xe ra' })
    await expect(submitBtn).toBeEnabled()
    await submitBtn.click()

    // 6. Dialog "Quyết toán lượt đỗ" xuất hiện
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible({ timeout: 5000 })
    await expect(dialog.getByText('Quyết toán lượt đỗ')).toBeVisible()
    await expect(dialog.getByText('BK-2026-0894')).toBeVisible()

    // 7. Xác minh giá lũy tiến: Tổng 160.000 ₫, Cọc 100.000 ₫, Còn phải thu 60.000 ₫
    await expect(dialog.getByText('160.000 ₫')).toBeVisible()
    await expect(dialog.getByText('100.000 ₫')).toBeVisible()
    await expect(dialog.getByText('60.000 ₫')).toBeVisible()

    // 8. Bấm nút "Đã nhận đủ tiền mặt · Hoàn tất lượt đỗ"
    const confirmCashBtn = dialog.getByRole('button', {
      name: /Đã nhận đủ tiền mặt · Hoàn tất lượt đỗ/i,
    })
    await expect(confirmCashBtn).toBeVisible()
    await confirmCashBtn.click()

    // 9. Xác minh thông báo thành công và giải phóng slot xe
    await expect(
      page.getByText('Đã xác nhận thu tiền mặt và trả chỗ thành công.'),
    ).toBeVisible({ timeout: 5000 })

    // 10. Chuyển sang màn hình quản lý đơn (/merchant/bookings) và xác minh trạng thái Đã hoàn tất
    await page.goto('/merchant/bookings')
    await expect(page).toHaveURL(/\/merchant\/bookings/)
    await expect(page.getByText('BK-2026-0894')).toBeVisible()
    await expect(page.getByText('Đã hoàn tất')).toBeVisible()
  })
})

