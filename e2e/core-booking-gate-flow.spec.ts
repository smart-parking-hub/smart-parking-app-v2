import { test, expect } from '@playwright/test'

const driverToken = `test.${Buffer.from(
  JSON.stringify({
    role: 'ROLE_DRIVER',
    sub: '0909128374',
    userId: 88,
    exp: Math.floor(Date.now() / 1000) + 3600,
  }),
).toString('base64url')}.test`

const merchantToken = `test.${Buffer.from(
  JSON.stringify({
    role: 'ROLE_MERCHANT',
    sub: '0901234567',
    userId: 101,
    exp: Math.floor(Date.now() / 1000) + 3600,
  }),
).toString('base64url')}.test`

const mockParkingLot = {
  id: 12,
  name: 'Bãi Đỗ Xe Tân Cảng Container',
  address: 'Cảng Tân Cảng - Phú Hữu, TP. Thủ Đức',
  status: 'APPROVED',
  hourlyRate: 30000,
  depositAmount: 100000,
  etaMinutes: 15,
  slotTypeLabel: 'Còn 12 chỗ Container',
  availableSlots: 12,
  totalSlots: 50,
  isFull: false,
  totalCapacity: 50,
  availableCapacity: 12,
}

const mockVehicle = {
  id: 3,
  licensePlate: '51D-894.12',
  vehicleClass: 'TRAILER',
  model: 'Freightliner Cascadia',
  isDefault: true,
}

test.describe('Core E2E Lifecycle: Giữ chỗ 10m -> Barie Check-in -> Barie Check-out (SP-S3-INT-01)', () => {
  let bookingLifecycleStatus: 'PENDING_CHECKIN' | 'PARKING' | 'COMPLETED' = 'PENDING_CHECKIN'
  const bookingCode = 'BK-CORE-9999'

  test.beforeEach(async ({ page }) => {
    bookingLifecycleStatus = 'PENDING_CHECKIN'

    // Driver Profile & Vehicles Mock
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

    // Merchant Profile Mock
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

    // Lots Mock
    await page.route('**/api/v1/parking-lots*', (route) =>
      route.fulfill({
        json: {
          data: {
            content: [mockParkingLot],
            totalElements: 1,
            totalPages: 1,
          },
        },
      }),
    )

    await page.route('**/api/v1/merchant/parking-lots*', (route) =>
      route.fulfill({
        json: {
          data: {
            content: [mockParkingLot],
            totalElements: 1,
            totalPages: 1,
          },
        },
      }),
    )

    // Driver Bookings API Mock
    await page.route('**/api/v1/bookings*', (route) =>
      route.fulfill({
        json: {
          data: {
            content: [
              {
                id: 9999,
                bookingCode,
                parkingLotId: 12,
                parkingLotName: 'Bãi Đỗ Xe Tân Cảng Container',
                status: bookingLifecycleStatus,
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
      }),
    )

    // Barie Check-in API Mock
    await page.route('**/api/v1/merchant/check-in', async (route) => {
      const payload = route.request().postDataJSON()
      expect(payload.bookingCode).toBe(bookingCode)
      bookingLifecycleStatus = 'PARKING'
      return route.fulfill({
        json: {
          data: {
            bookingCode,
            parkingLotId: 12,
            vehiclePlate: '51D-894.12',
            checkInTime: new Date().toISOString(),
            status: 'PARKING',
          },
          message: 'Xe đã được ghi nhận vào bãi.',
        },
      })
    })

    // Barie Check-out API Mock
    await page.route('**/api/v1/merchant/check-out', async (route) => {
      const payload = route.request().postDataJSON()
      expect(payload.bookingCode).toBe(bookingCode)
      return route.fulfill({
        json: {
          data: {
            bookingCode,
            bookingStatus: 'CHECKED_OUT',
            parkingMinutes: 240,
            totalAmount: 160000,
            advanceDeposit: 100000,
            amountDue: 60000,
          },
        },
      })
    })

    // Cash Settlement API Mock
    await page.route('**/api/v1/merchant/confirm-cash', async (route) => {
      bookingLifecycleStatus = 'COMPLETED'
      return route.fulfill({
        json: {
          data: null,
          message: 'Đã xác nhận thu tiền mặt và trả chỗ thành công.',
        },
      })
    })

    // Merchant Bookings List Mock
    await page.route('**/api/v1/merchant/bookings*', (route) =>
      route.fulfill({
        json: {
          data: {
            content: [
              {
                id: 9999,
                bookingCode,
                parkingLotId: 12,
                parkingLotName: 'Bãi Đỗ Xe Tân Cảng Container',
                customerName: 'Trần Quốc Tuấn',
                customerPhone: '0909 128 374',
                vehiclePlate: '51D-894.12',
                status: bookingLifecycleStatus,
                advanceDeposit: 100000,
                totalAmount: 160000,
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

  test('Vòng đời đơn đỗ: Tài xế giữ chỗ 10m -> Quét check-in xe vào -> Quyết toán lũy tiến xe ra', async ({
    page,
  }) => {
    // -------------------------------------------------------------
    // PHASE 1: TÀI XẾ GIỮ CHỖ 10 PHÚT TRÊN BẢN ĐỒ & XÁC NHẬN VÉ QR
    // -------------------------------------------------------------
    await page.addInitScript((token) => {
      localStorage.setItem('access_token', token)
      localStorage.setItem('token', token)
      localStorage.setItem('smart-truck-parking.driver_name', 'Trần Quốc Tuấn')
    }, driverToken)

    await page.goto('/search')
    const lotCard = page.locator('article', { hasText: 'Bãi Đỗ Xe Tân Cảng Container' }).first()
    await expect(lotCard).toBeVisible({ timeout: 10_000 })

    const quickBookBtn = lotCard.locator('button', { hasText: 'ĐẶT GIỮ CHỖ 10P' })
    await quickBookBtn.click()

    const dialog = page.getByRole('dialog', { name: /Panel giữ chỗ nhanh 10 phút/i })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('timer')).toBeVisible()

    const confirmBtn = dialog.getByRole('button', { name: /Xác nhận giữ chỗ/i })
    await confirmBtn.click()
    await expect(dialog.getByText('Giữ Chỗ Thành Công!')).toBeVisible()

    // -------------------------------------------------------------
    // PHASE 2: CỔNG BARIE CHECK-IN XE VÀO BÃI (ROLE MERCHANT)
    // -------------------------------------------------------------
    await page.addInitScript((token) => {
      localStorage.setItem('access_token', token)
      localStorage.setItem('token', token)
    }, merchantToken)

    await page.goto('/merchant/qr-scanner')
    await expect(page).toHaveURL(/\/merchant\/qr-scanner/)

    await page.getByLabel('Bãi kiểm soát').selectOption({ value: '12' })
    await page.getByLabel('Mã đặt chỗ / Nội dung QR').fill(bookingCode)
    await page.getByRole('button', { name: 'Xác nhận xe vào bãi' }).click()

    await expect(page.getByText('Xe đã được ghi nhận vào bãi.')).toBeVisible()

    // -------------------------------------------------------------
    // PHASE 3: CỔNG BARIE CHECK-OUT XE RA, TÍNH CƯỚC & THU TIỀN MẶT
    // -------------------------------------------------------------
    await page.getByRole('button', { name: 'XE RA', exact: true }).click()
    await page.getByLabel('Bãi kiểm soát').selectOption({ value: '12' })
    await page.getByLabel('Mã đặt chỗ / Nội dung QR').fill(bookingCode)
    await page.getByRole('button', { name: 'Kiểm tra & quyết toán xe ra' }).click()

    const settlementModal = page.getByRole('dialog')
    await expect(settlementModal).toBeVisible()
    await expect(settlementModal.getByText('60.000 ₫')).toBeVisible()

    await settlementModal
      .getByRole('button', { name: /Đã nhận đủ tiền mặt · Hoàn tất lượt đỗ/i })
      .click()

    await expect(
      page.getByText('Đã xác nhận thu tiền mặt và trả chỗ thành công.'),
    ).toBeVisible()

    // Kiểm tra trang quản lý đơn hiển thị hoàn tất
    await page.goto('/merchant/bookings')
    await expect(page.getByText(bookingCode)).toBeVisible()
    await expect(page.getByText('Đã hoàn tất')).toBeVisible()
  })
})

