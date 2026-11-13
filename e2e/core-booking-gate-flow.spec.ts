import { test, expect } from '@playwright/test'
import { mockPayOSDeposit } from './fixtures/payos-checkout'

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
  slots: [{ vehicleType: 'CONTAINER', availableCapacity: 12, totalCapacity: 50 }],
  pricingRules: [{ vehicleType: 'CONTAINER', basePricePerHour: 30000, surgeMultiplier: 1, surgeStartTime: null, surgeEndTime: null, overtimePenaltyMultiplier: 2 }],
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

test.describe('Core E2E Lifecycle: Booking & cọc PayOS -> Barie Check-in -> Barie Check-out (SP-S3-INT-01)', () => {
  let bookingLifecycleStatus: 'PENDING_PAYMENT' | 'PENDING_CHECKIN' | 'PARKING' | 'COMPLETED' = 'PENDING_PAYMENT'
  let recordedCheckInTime: string | null = null
  let recordedCheckOutTime: string | null = null
  const bookingCode = 'BK-CORE-9999'

  test.beforeEach(async ({ page }) => {
    bookingLifecycleStatus = 'PENDING_PAYMENT'
    recordedCheckInTime = null
    recordedCheckOutTime = null

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
    await page.route(/\/api\/v1\/parking-lots/, (route) =>
      route.fulfill({
        json: {
          data: new URL(route.request().url()).pathname.endsWith('/12') ? mockParkingLot : {
            content: [mockParkingLot],
            totalElements: 1,
            totalPages: 1,
          },
          content: [mockParkingLot],
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

    // Use the same contract for booking creation, polling and the driver list.
    const booking = () => ({
      id: 9999, bookingCode, parkingLotId: 12, merchantId: 101,
      parkingLotName: mockParkingLot.name, parkingLotAddress: mockParkingLot.address,
      vehicleId: 3, vehiclePlate: '51D-894.12', status: bookingLifecycleStatus,
      advanceDeposit: 100000, totalAmount: 500000, hourlyRate: 30000,
      expectedCheckInTime: new Date(Date.now() + 1800000).toISOString(),
      expectedCheckOutTime: new Date(Date.now() + 9000000).toISOString(),
      expiresAt: new Date(Date.now() + 900000).toISOString(),
    })
    let created = false
    await mockPayOSDeposit(page, 9999, () => { bookingLifecycleStatus = 'PENDING_CHECKIN' })
    await page.route(/\/api\/v1\/bookings/, (route) => {
      if (route.request().method() === 'POST') {
        expect(route.request().postDataJSON()).toEqual(expect.objectContaining({
          parkingLotId: 12, vehicleId: 3, vehicleType: 'CONTAINER', requestId: expect.any(String),
        }))
        created = true
        return route.fulfill({ json: { data: booking() } })
      }
      if (new URL(route.request().url()).pathname.endsWith('/9999')) {
        return route.fulfill({ json: { data: booking() } })
      }
      return route.fulfill({ json: { data: {
        content: created ? [booking()] : [], totalElements: created ? 1 : 0, totalPages: created ? 1 : 0,
      } } })
    })

    // Barie Check-in API Mock
    await page.route('**/api/v1/merchant/check-in', async (route) => {
      const payload = route.request().postDataJSON()
      expect(payload.bookingCode).toBe(bookingCode)
      bookingLifecycleStatus = 'PARKING'
      recordedCheckInTime = new Date(Date.now() - 45 * 60_000).toISOString()
      return route.fulfill({
        json: {
          data: {
            bookingCode,
            parkingLotId: 12,
            vehiclePlate: '51D-894.12',
            checkInTime: recordedCheckInTime,
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
      recordedCheckOutTime = new Date().toISOString()
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

    // Merchant Bookings List & Detail Mock
    await page.route(/\/api\/v1\/merchant\/bookings/, (route) => {
      const merchantBooking = {
        id: 9999,
        bookingCode,
        parkingLotId: 12,
        merchantId: 101,
        parkingLotName: 'Bãi Đỗ Xe Tân Cảng Container',
        parkingLotAddress: mockParkingLot.address,
        customerName: 'Trần Quốc Tuấn',
        customerPhone: '0909 128 374',
        vehiclePlate: '51D-894.12',
        vehicleLicensePlate: '51D-894.12',
        vehicleType: 'CONTAINER',
        status: bookingLifecycleStatus,
        hourlyRate: 30000,
        advanceDeposit: 100000,
        totalAmount: 160000,
        createdAt: new Date(Date.now() - 3 * 3_600_000).toISOString(),
        expiresAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
        expectedCheckInTime: new Date(Date.now() - 2 * 3_600_000).toISOString(),
        expectedCheckOutTime: new Date(Date.now() + 2 * 3_600_000).toISOString(),
        checkInTime: recordedCheckInTime,
        checkOutTime: recordedCheckOutTime,
      }
      if (new URL(route.request().url()).pathname === '/api/v1/merchant/bookings/9999') {
        return route.fulfill({ json: { data: merchantBooking } })
      }
      return route.fulfill({
        json: {
          data: {
            content: [merchantBooking],
            totalElements: 1,
            totalPages: 1,
          },
        },
      })
    })
  })

  test('Vòng đời đơn đỗ: Tạo booking & cọc PayOS -> Check-in -> Quyết toán xe ra', async ({
    page,
  }) => {
    // -------------------------------------------------------------
    // PHASE 1: TẠO BOOKING, XÁC NHẬN CỌC QUA SERVER & NHẬN VÉ QR
    // -------------------------------------------------------------
    await page.addInitScript((token) => {
      if (!localStorage.getItem('access_token')) {
        localStorage.setItem('access_token', token)
        localStorage.setItem('token', token)
      }
      localStorage.setItem('smart-truck-parking.driver_name', 'Trần Quốc Tuấn')
    }, driverToken)

    await page.goto('/parking')
    const lotCard = page.locator('article', { hasText: 'Bãi Đỗ Xe Tân Cảng Container' }).first()
    await expect(lotCard).toBeVisible({ timeout: 10_000 })

    const quickBookBtn = lotCard.locator('button', { hasText: 'ĐẶT GIỮ CHỖ 10P' })
    await quickBookBtn.click()

    const dialog = page.getByRole('dialog', { name: /Panel giữ chỗ nhanh 10 phút/i })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('combobox', { name: 'Phương tiện của bạn' })).toHaveValue('3')
    await dialog.getByRole('button', { name: 'Tạo booking và xem tiền cọc' }).click()
    await expect(dialog.getByText(bookingCode, { exact: true })).toBeVisible()
    await expect(dialog.getByText('Chờ thanh toán cọc', { exact: true })).toBeVisible()
    await expect(dialog.getByTestId('checkin-qr-container')).toHaveCount(0)
    await dialog.getByRole('button', { name: /Thanh toán cọc.*qua PayOS/ }).click()
    await page.frameLocator('iframe[title="Mã QR thanh toán PayOS"]')
      .getByRole('button', { name: 'Thông báo đã quét (fixture)' }).click()
    await expect(dialog.getByRole('img', { name: `Mã QR Check-in ${bookingCode}` })).toBeVisible()
    await expect(dialog.getByText('Đã cọc · Chờ check-in', { exact: true })).toBeVisible()

    // -------------------------------------------------------------
    // PHASE 2: CỔNG BARIE CHECK-IN XE VÀO BÃI (ROLE MERCHANT)
    // -------------------------------------------------------------
    await page.evaluate((token) => {
      localStorage.setItem('access_token', token)
      localStorage.setItem('token', token)
    }, merchantToken)

    await page.goto('/merchant/qr-scanner')
    await expect(page).toHaveURL(/\/merchant\/qr-scanner/)

    await page.getByLabel('Bãi kiểm soát').selectOption({ value: '12' })
    await page.getByLabel('Mã đặt chỗ / Nội dung QR').fill(bookingCode)
    await page.getByRole('button', { name: 'Xác nhận xe vào bãi' }).click()

    await expect(page.getByText('Xe đã được ghi nhận vào bãi.')).toBeVisible()
    await page.getByRole('dialog', { name: 'Xác nhận xe vào thành công' })
      .getByRole('button', { name: 'Đã hiểu' }).click()

    // -------------------------------------------------------------
    // PHASE 3: CỔNG BARIE CHECK-OUT XE RA, TÍNH CƯỚC & THU TIỀN MẶT
    // -------------------------------------------------------------
    await page.getByRole('button', { name: 'XE RA', exact: true }).click()
    await page.getByLabel('Bãi kiểm soát').selectOption({ value: '12' })
    await page.getByLabel('Mã đặt chỗ / Nội dung QR').fill(bookingCode)
    await page.getByRole('button', { name: 'Kiểm tra & quyết toán xe ra' }).click()

    const settlementModal = page.getByRole('dialog')
    await expect(settlementModal).toBeVisible()
    await expect(settlementModal.getByText('60.000 ₫', { exact: true })).toBeVisible()

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

    // Bấm "Chi tiết" trên bảng SCR-034 -> chuyển thẳng sang trang hồ sơ chi tiết & Nhật ký Barie (SCR-035)
    await page.getByRole('link', { name: `Xem chi tiết đơn ${bookingCode}` }).click()

    await expect(page).toHaveURL(/\/merchant\/bookings\/9999$/)
    await expect(page.getByRole('heading', { level: 1, name: /Hồ sơ đặt chỗ #9999/i })).toBeVisible()
    await expect(page.getByText('Nhật ký Barie & Tiến trình Vận hành')).toBeVisible()
    await expect(page.getByText('Barie xác nhận xe vào bãi (Check-in)')).toBeVisible()
    await expect(page.getByText('Barie xác nhận xe ra bãi (Check-out)')).toBeVisible()
    await expect(page.getByText('Hoàn tất quyết toán & giải phóng chỗ đỗ')).toBeVisible()
  })
})

