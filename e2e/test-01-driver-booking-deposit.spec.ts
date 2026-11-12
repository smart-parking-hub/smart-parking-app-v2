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

const mockParkingLot = {
  id: 12,
  status: 'APPROVED',
  slots: [{ vehicleType: 'CONTAINER', availableCapacity: 12, totalCapacity: 50 }],
  pricingRules: [{ vehicleType: 'CONTAINER', basePricePerHour: 30000, surgeMultiplier: 1, surgeStartTime: null, surgeEndTime: null, overtimePenaltyMultiplier: 2 }],
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

test.describe('Flow 1: Tạo booking & Đặt cọc PayOS (SP-S3-INT-01)', () => {
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
          data: new URL(route.request().url()).pathname.endsWith('/12') ? mockParkingLot : {
            content: [mockParkingLot],
            totalElements: 1,
            totalPages: 1,
          },
          content: [mockParkingLot],
        },
      }),
    )

    const mockBookingRecord = {
      id: 501,
      bookingCode: 'BK-2026-0894',
      parkingLotId: 12,
      merchantId: 101,
      parkingLotName: 'Bãi Đỗ Xe Tân Cảng Container',
      parkingLotAddress: 'Cảng Tân Cảng - Phú Hữu, TP. Thủ Đức',
      vehicleId: 3,
      vehiclePlate: '51D-894.12',
      status: 'PENDING_PAYMENT',
      advanceDeposit: 100000,
      totalAmount: 250000,
      hourlyRate: 30000,
      expectedCheckInTime: new Date(Date.now() + 600000).toISOString(),
      expectedCheckOutTime: new Date(Date.now() + 14400000).toISOString(),
      expiresAt: new Date(Date.now() + 900000).toISOString(),
      createdAt: new Date().toISOString(),
    }

    let created = false
    await mockPayOSDeposit(page, mockBookingRecord.id, () => {
      mockBookingRecord.status = 'PENDING_CHECKIN'
    })
    await page.route(/\/api\/v1\/bookings/, (route) => {
      if (route.request().method() === 'POST') {
        expect(route.request().postDataJSON()).toEqual(expect.objectContaining({
          parkingLotId: 12, vehicleId: 3, vehicleType: 'CONTAINER',
          requestId: expect.any(String),
          expectedCheckInTime: expect.any(String), expectedCheckOutTime: expect.any(String),
        }))
        created = true
        return route.fulfill({ json: { data: mockBookingRecord } })
      }
      if (new URL(route.request().url()).pathname.endsWith('/501')) {
        return route.fulfill({ json: { data: mockBookingRecord } })
      }
      return route.fulfill({ json: { data: {
        content: created ? [mockBookingRecord] : [],
        totalElements: created ? 1 : 0, totalPages: created ? 1 : 0,
      } } })
    })
  })

  test('Tài xế tạo booking, thanh toán cọc PayOS và nhận vé QR từ server', async ({ page }) => {
    await page.goto('/parking')
    const lotCard = page.locator('article', { hasText: 'Bãi Đỗ Xe Tân Cảng Container' }).first()
    await expect(lotCard).toBeVisible({ timeout: 10_000 })
    await lotCard.getByRole('button', { name: 'ĐẶT GIỮ CHỖ 10P' }).click()

    const dialog = page.getByRole('dialog', { name: /Panel giữ chỗ nhanh 10 phút/i })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: 'Đặt chỗ tại Bãi Đỗ Xe Tân Cảng Container' })).toBeVisible()
    await expect(dialog.getByRole('combobox', { name: 'Phương tiện của bạn' })).toHaveValue('3')
    await expect(dialog.getByText('15 phút', { exact: true })).toBeVisible()
    await dialog.getByRole('button', { name: 'Tạo booking và xem tiền cọc' }).click()

    await expect(dialog.getByText('BK-2026-0894', { exact: true })).toBeVisible()
    await expect(dialog.getByText('Chờ thanh toán cọc', { exact: true })).toBeVisible()
    await expect(dialog.getByTestId('checkin-qr-container')).toHaveCount(0)
    expect(await page.evaluate(() => localStorage.getItem('smart-truck-parking.active_hold'))).toBeNull()

    await dialog.getByRole('button', { name: /Thanh toán cọc.*qua PayOS/ }).click()
    const checkout = page.frameLocator('iframe[title="Mã QR thanh toán PayOS"]')
    await checkout.getByRole('button', { name: 'Thông báo đã quét (fixture)' }).click()
    await expect(dialog.getByText('Đã cọc · Chờ check-in', { exact: true })).toBeVisible()
    await expect(dialog.getByRole('img', { name: 'Mã QR Check-in BK-2026-0894' })).toBeVisible()

    await dialog.getByRole('link', { name: 'Xem các lượt đặt chỗ' }).click()
    await expect(page).toHaveURL(/\/bookings/)
    await expect(page.getByText('BK-2026-0894', { exact: true })).toBeVisible()
    await expect(page.getByText('Đã cọc · Chờ check-in', { exact: true }).first()).toBeVisible()
  })
})
