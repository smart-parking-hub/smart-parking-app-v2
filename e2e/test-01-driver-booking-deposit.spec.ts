import { test, expect } from '@playwright/test'

const driverToken = `test.${Buffer.from(
  JSON.stringify({
    role: 'ROLE_DRIVER',
    sub: '0909128374',
    userId: 88,
    exp: Math.floor(Date.now() / 1000) + 3600,
  }),
).toString('base64url')}.test`

const mockParkingLot = {
  id: 12,
  name: 'Bãi Đỗ Xe Tân Cảng Container',
  address: 'Cảng Tân Cảng - Phú Hữu, TP. Thủ Đức',
  hourlyRate: 30000,
  basePricePerHour: 30000,
  depositAmount: 100000,
  etaMinutes: 15,
  slotTypeLabel: 'Còn 12 chỗ Container',
  availableSlots: 12,
  availableCapacity: 12,
  totalSlots: 50,
  isFull: false,
  latitude: 10.782,
  longitude: 106.785,
}

const mockVehicle = {
  id: 3,
  licensePlate: '51D-894.12',
  vehicleClass: 'TRAILER',
  model: 'Freightliner Cascadia',
  isDefault: true,
}

test.describe('Flow 1: Giữ chỗ 10 phút & Đặt cọc PayOS (SP-S3-INT-01)', () => {
  test.beforeEach(async ({ page }) => {
    // Inject authenticated DRIVER session
    await page.addInitScript(
      ({ token, vehicle }) => {
        localStorage.setItem('access_token', token)
        localStorage.setItem('token', token)
        localStorage.setItem(
          'smart-truck-parking.auth',
          JSON.stringify({ phone: '0909 128 374', role: 'DRIVER' }),
        )
        localStorage.setItem('smart-truck-parking.driver_name', 'Trần Quốc Tuấn')
        localStorage.setItem('smart-truck-parking.default_vehicle', JSON.stringify(vehicle))
      },
      { token: driverToken, vehicle: mockVehicle },
    )

    // Mock Driver Profile
    await page.route('**/api/v1/driver/profile', (route) =>
      route.fulfill({
        json: {
          data: {
            id: 88,
            fullName: 'Trần Quốc Tuấn',
            phone: '0909 128 374',
            role: 'DRIVER',
          },
        },
      }),
    )

    // Mock Vehicles List
    await page.route('**/api/v1/driver/vehicles*', (route) =>
      route.fulfill({ json: { data: [mockVehicle] } }),
    )
    await page.route('**/api/v1/vehicles*', (route) =>
      route.fulfill({
        json: {
          data: {
            content: [
              {
                id: 3,
                licensePlate: '51D-894.12',
                vehicleType: 'CONTAINER',
                status: 'ACTIVE',
              },
            ],
            totalElements: 1,
            totalPages: 1,
          },
          content: [
            {
              id: 3,
              licensePlate: '51D-894.12',
              vehicleType: 'CONTAINER',
              status: 'ACTIVE',
            },
          ],
        },
      }),
    )

    // Mock Search Parking Lots
    await page.route(/\/api\/v1\/parking-lots/, (route) =>
      route.fulfill({
        json: {
          data: {
            content: [mockParkingLot],
            totalElements: 1,
            totalPages: 1,
          },
          content: [mockParkingLot],
        },
      }),
    )

    // Mock PayOS Checkout Intent / Deposit
    await page.route('**/api/v1/payments/**', (route) =>
      route.fulfill({
        json: {
          data: {
            paymentUrl: 'https://payos.vn/sandbox-checkout-demo',
            orderCode: 98214,
            amount: 100000,
            status: 'PAID',
          },
          message: 'Thanh toán cọc thành công',
        },
      }),
    )

    // Mock Driver Bookings
    await page.route(/\/api\/v1\/bookings/, (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          json: {
            data: {
              id: 501,
              bookingCode: 'BK-2026-0894',
              parkingLotId: 12,
              parkingLotName: 'Bãi Đỗ Xe Tân Cảng Container',
              status: 'PENDING_CHECKIN',
              depositPaid: 100000,
              vehiclePlate: '51D-894.12',
              createdAt: new Date().toISOString(),
            },
            message: 'Giữ chỗ và đặt cọc thành công',
          },
        })
      }
      return route.fulfill({
        json: {
          data: {
            content: [
              {
                id: 501,
                bookingCode: 'BK-2026-0894',
                parkingLotId: 12,
                parkingLotName: 'Bãi Đỗ Xe Tân Cảng Container',
                status: 'PENDING_CHECKIN',
                depositPaid: 100000,
                advanceDeposit: 100000,
                totalAmount: 250000,
                vehiclePlate: '51D-894.12',
                createdAt: new Date().toISOString(),
                expectedCheckInTime: new Date(Date.now() + 600000).toISOString(),
              },
            ],
            totalElements: 1,
            totalPages: 1,
          },
        },
      })
    })
  })

  test('Tài xế tìm bãi, mở giữ chỗ 10 phút, kiểm tra timer và nhận QR Terminal Pass', async ({
    page,
  }) => {
    // 1. Điều hướng tới màn hình tìm kiếm bãi xe
    await page.goto('/parking')
    await expect(page).toHaveURL(/\/parking/)

    // 2. Chờ danh sách bãi xe xuất hiện
    const lotCard = page.locator('article', { hasText: 'Bãi Đỗ Xe Tân Cảng Container' }).first()
    await expect(lotCard).toBeVisible({ timeout: 10_000 })

    // 3. Bấm nút "ĐẶT GIỮ CHỖ 10P"
    const quickBookBtn = lotCard.locator('button', { hasText: 'ĐẶT GIỮ CHỖ 10P' })
    await expect(quickBookBtn).toBeVisible()
    await quickBookBtn.click()

    // 4. Panel "Giữ chỗ 10 phút" xuất hiện
    const dialog = page.getByRole('dialog', { name: /Panel giữ chỗ nhanh 10 phút/i })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('Bãi Đỗ Xe Tân Cảng Container')).toBeVisible()

    // 5. Xác minh đồng hồ đếm ngược 10:00 (Hold TTL)
    const timerElement = dialog.getByRole('timer', { name: /Thời gian còn lại/i })
    await expect(timerElement).toBeVisible()
    await expect(timerElement).toHaveText(/10:00|09:59/)

    // 6. Kiểm tra thông tin xe ALPR và số tiền cọc
    await expect(dialog.getByText('51D-894.12')).toBeVisible()
    await expect(dialog.getByText('100.000 ₫')).toBeVisible()

    // 7. Bấm "Xác nhận giữ chỗ"
    const confirmBtn = dialog.getByRole('button', { name: /Xác nhận giữ chỗ/i })
    await confirmBtn.click()

    // 8. Màn hình xác nhận thành công xuất hiện
    await expect(dialog.getByText('Giữ Chỗ Thành Công!')).toBeVisible()
    await expect(dialog.getByText(/BK-HOLD-2026/)).toBeVisible()

    // 9. Bấm "Mở Vé QR" để tới trang danh sách vé của tôi (/bookings)
    const openPassLink = dialog.getByRole('link', { name: /Mở Vé QR/i })
    await expect(openPassLink).toHaveAttribute('href', '/bookings')
    await page.goto('/bookings')

    // 10. Chuyển sang màn hình /bookings và xác minh vé
    await expect(page).toHaveURL(/\/bookings/)
    await expect(page.getByText('Bãi Đỗ Xe Tân Cảng Container').first()).toBeVisible()
    await expect(page.getByText('BK-2026-0894')).toBeVisible()
    await expect(page.getByText(/Đã cọc · Chờ check-in/i)).toBeVisible()
  })
})

