import { expect, test, type Page } from '@playwright/test'

const parked = {
  id: 7, bookingCode: 'BK-REAL-PARKED-7', status: 'PARKING', vehiclePlate: '51C-77777',
  parkingLotName: 'Bãi thực tế của chuyến 7', parkingLotAddress: 'Địa chỉ bãi thực tế', physicalSlotCode: 'A-07',
  expectedCheckInTime: '2026-11-17T09:00:00', expectedCheckOutTime: '2026-11-17T12:00:00',
  checkInTime: '2026-11-17T09:05:00', advanceDeposit: 20000, totalAmount: 100000, hourlyRate: 50000,
}
const pending = { ...parked, id: 9, bookingCode: 'BK-UNPAID-MUST-STAY-HIDDEN', status: 'PENDING_PAYMENT', physicalSlotCode: null, checkInTime: null, advanceDeposit: 0, totalAmount: 0 }

async function prepare(page: Page, unpaidOnly = false) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(token => localStorage.setItem('access_token', token),
    `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 12, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`)
  await page.route('**/api/v1/**', async route => {
    const url = new URL(route.request().url())
    const data = url.pathname === '/api/v1/bookings'
      ? { content: unpaidOnly || url.searchParams.get('page') === '0' ? [pending] : [parked], currentPage: Number(url.searchParams.get('page')), totalPages: unpaidOnly ? 1 : 2, totalElements: unpaidOnly ? 1 : 2 }
      : url.pathname === '/api/v1/vehicles' ? { content: [], totalElements: 3, totalPages: 1, currentPage: 0 }
      : url.pathname === '/api/v1/users/me' ? { fullName: 'Tài xế dữ liệu thật', phone: '0901234567' }
      : url.pathname === '/api/v1/queues/me' ? null
      : url.pathname.endsWith('/unread-count') ? 0
      : { content: [], totalPages: 0, totalElements: 0 }
    await route.fulfill({ json: { data } })
  })
  return errors
}

for (const width of [390, 1440]) {
  test(`dashboard selects the real parked trip and its scannable QR at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const errors = await prepare(page)
    await page.goto('/dashboard')
    const trip = page.getByRole('region', { name: 'Chuyến đỗ đang chọn' })
    await expect(trip.getByRole('heading', { name: parked.parkingLotName })).toBeVisible()
    await expect(trip.getByText(`Mã vé: ${parked.bookingCode}`)).toBeVisible()
    await expect(trip.getByText('A-07', { exact: true })).toBeVisible()
    await expect(page.getByText('01 Chuyến Đang Đỗ')).toBeVisible()
    expect(await page.locator('body').innerHTML()).not.toContain(pending.bookingCode)
    await page.screenshot({ path: `.artifacts/playwright/dashboard-real-trip-${width}.png`, fullPage: true })
    await trip.getByRole('button', { name: 'Mã QR xuất bãi', exact: true }).click()
    const modal = page.getByRole('dialog', { name: 'Mã QR xuất bãi' })
    await expect(modal).toBeVisible()
    await page.addScriptTag({ url: '/node_modules/html5-qrcode/third_party/zxing-js.umd.js' })
    const qrImage = await modal.locator('svg[role="img"]').screenshot()
    const decoded = await page.evaluate(async imageUrl => {
      const zxing = (window as unknown as { ZXing: {
        HTMLCanvasElementLuminanceSource: new (canvas: HTMLCanvasElement) => unknown
        HybridBinarizer: new (source: unknown) => unknown
        BinaryBitmap: new (binarizer: unknown) => unknown
        QRCodeReader: new () => { decode(bitmap: unknown): { getText(): string } }
      } }).ZXing
      const image = new Image()
      image.src = imageUrl
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      canvas.getContext('2d')!.drawImage(image, 0, 0)
      const bitmap = new zxing.BinaryBitmap(new zxing.HybridBinarizer(new zxing.HTMLCanvasElementLuminanceSource(canvas)))
      return new zxing.QRCodeReader().decode(bitmap).getText()
    }, `data:image/png;base64,${qrImage.toString('base64')}`)
    expect(decoded).toBe(parked.bookingCode)
    await page.screenshot({ path: `.artifacts/playwright/dashboard-real-qr-${width}.png` })
    await page.keyboard.press('Escape')
    await expect(modal).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
    expect(errors).toEqual([])
  })

  test(`unpaid dashboard uses the order ID and has no checkout QR at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const errors = await prepare(page, true)
    await page.goto('/dashboard')
    const trip = page.getByRole('region', { name: 'Chuyến đỗ đang chọn' })
    await expect(trip.getByText('Số đơn: #9')).toBeVisible()
    await expect(trip.getByText('Chưa check-in', { exact: true })).toBeVisible()
    await expect(trip.getByRole('link', { name: 'Thanh toán cọc' })).toHaveAttribute('href', '/bookings?bookingId=9')
    await expect(page.getByText('00 Chuyến Đang Đỗ')).toBeVisible()
    await expect(page.getByRole('button', { name: /QR/ })).toHaveCount(0)
    expect(await page.locator('body').innerHTML()).not.toContain(pending.bookingCode)
    for (const text of ['BERTH C-12', '51R-024.89', '03h 45m', 'Khớp biển số ALPR', '380V']) await expect(page.getByText(text, { exact: true })).toHaveCount(0)
    await page.screenshot({ path: `.artifacts/playwright/dashboard-pending-${width}.png`, fullPage: true })
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
    expect(errors).toEqual([])
  })
}
