import { expect, test, type Page } from '@playwright/test'
import { mockEmptyDriverWallet, mockShellReads } from './fixtures/payment-reads'

const profile = { merchantId: 7, userId: 12, fullName: 'Chủ bãi kiểm thử', phone: '0901234567' }
const lot = { id: 12, name: 'Bãi Tân Cảng', address: 'Thủ Đức', status: 'CHANGES_REQUESTED' }
const tooEarly = 'Chưa đến giờ check-in (chỉ được vào bãi trước tối đa 30 phút)!'
const booking = {
  id: 41, bookingCode: 'BK-HIDDEN-UNTIL-DEPOSIT', merchantId: 7, parkingLotId: 12,
  parkingLotName: lot.name, vehicleId: 3, vehiclePlate: '51C-12345',
  status: 'PENDING_PAYMENT', advanceDeposit: 10000, totalAmount: 50000, hourlyRate: 25000,
  expectedCheckInTime: new Date(Date.now() + 3600000).toISOString(),
  expectedCheckOutTime: new Date(Date.now() + 7200000).toISOString(),
  expiresAt: new Date(Date.now() + 900000).toISOString(),
}

async function initialize(page: Page, role: 'MERCHANT' | 'DRIVER') {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(token => localStorage.setItem('access_token', token),
    `test.${Buffer.from(JSON.stringify({ role: `ROLE_${role}`, userId: 12, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`)
  await page.route('**/api/v1/**', async route => {
    const path = new URL(route.request().url()).pathname
    if (path === '/api/v1/merchant/check-in') {
      await route.fulfill({ status: 400, json: { message: tooEarly } })
      return
    }
    const data = path.includes('/profile') ? profile
      : path === '/api/v1/merchant/parking-lots' ? { content: [lot], currentPage: 0, totalPages: 1, totalElements: 1 }
      : path === '/api/v1/bookings' ? { content: [booking], currentPage: 0, totalPages: 1, totalElements: 1 }
      : path.endsWith('/unread-count') ? 0
      : { content: [], currentPage: 0, totalPages: 0, totalElements: 0 }
    await route.fulfill({ json: { data } })
  })
  if (role === 'DRIVER') await mockEmptyDriverWallet(page, booking.id)
  else await mockShellReads(page)
  return errors
}

for (const width of [390, 1440]) {
  test(`merchant notifications and actions stay consistent at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors = await initialize(page, 'MERCHANT')
    await page.goto('/merchant/profile')
    await page.getByLabel('Số giấy phép kinh doanh').fill('GP-12345')
    await page.getByRole('button', { name: 'Gửi giấy tờ', exact: true }).click()
    const uploaded = page.getByRole('dialog', { name: 'Gửi giấy tờ thành công' })
    await expect(uploaded).toBeVisible()
    await expect(uploaded.getByRole('status')).toHaveText('Đã gửi giấy tờ thành công.')
    await expect(uploaded.getByRole('button', { name: 'Đóng', exact: true })).toBeFocused()
    await page.screenshot({ path: `.artifacts/playwright/ui-documents-${width}.png` })
    await page.keyboard.press('Escape')
    await expect(uploaded).toHaveCount(0)
    await expect(page.getByLabel('Tệp đính kèm')).toBeFocused()

    await page.evaluate(() => window.dispatchEvent(new Event('smartparking:login-success')))
    const loggedIn = page.getByRole('alert').filter({ hasText: 'Đăng nhập thành công.' })
    await expect(loggedIn).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    const toastBounds = (await loggedIn.boundingBox())!
    expect(width - toastBounds.x - toastBounds.width).toBeLessThanOrEqual(24)
    expect(toastBounds.y).toBe(80)
    const titleBounds = (await loggedIn.getByRole('heading').boundingBox())!
    const iconBounds = (await loggedIn.locator('svg').first().boundingBox())!
    const closeBounds = (await loggedIn.getByRole('button', { name: 'Đóng thông báo' }).boundingBox())!
    const centerY = toastBounds.y + toastBounds.height / 2
    for (const bounds of [titleBounds, iconBounds, closeBounds]) {
      expect(Math.abs(bounds.y + bounds.height / 2 - centerY)).toBeLessThanOrEqual(1)
    }
    expect(await loggedIn.getByRole('button', { name: 'Đóng thông báo', exact: true }).innerText()).toBe('')
    await page.screenshot({ path: `.artifacts/playwright/ui-login-toast-${width}.png` })
    await loggedIn.getByRole('button', { name: 'Đóng thông báo', exact: true }).click()
    await expect(loggedIn).toHaveCount(0)

    await page.goto('/merchant/parking-lots')
    await expect(page.getByRole('article').getByText('Cần bổ sung hồ sơ', { exact: true })).toBeVisible()
    await expect(page.getByText('CHANGES_REQUESTED', { exact: true })).toHaveCount(0)
    for (const name of ['Chi tiết', 'Chỉnh sửa hồ sơ']) {
      const action = page.getByRole('link', { name, exact: true })
      await expect(action).toBeVisible()
      await expect(action).toHaveCSS('text-decoration-line', 'none')
    }
    await page.getByRole('button', { name: 'Chế độ xem dạng bảng' }).click()
    await expect(page.getByRole('cell', { name: 'Cần bổ sung hồ sơ' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Chỉnh sửa hồ sơ', exact: true })).toHaveCSS('text-decoration-line', 'none')
    await page.screenshot({ path: `.artifacts/playwright/ui-lot-actions-${width}.png`, fullPage: true })
    await page.goto('/merchant/qr-scanner?lot=12')
    await page.getByLabel('Mã đặt chỗ / Nội dung QR').fill('BK-TOO-EARLY')
    const submit = page.getByRole('button', { name: 'Xác nhận xe vào bãi' })
    for (const dismissal of ['Escape', 'close', 'understood']) {
      await submit.click()
      const warning = page.getByRole('dialog', { name: 'Chưa thể cho xe vào bãi' })
      await expect(warning).toBeVisible()
      await expect(warning.getByRole('alert')).toHaveText(tooEarly)
      const bounds = (await warning.boundingBox())!
      expect(Math.abs(bounds.x + bounds.width / 2 - width / 2)).toBeLessThan(2)
      expect(Math.abs(bounds.y + bounds.height / 2 - 450)).toBeLessThan(2)
      expect(bounds.width).toBeLessThan(width)
      await page.screenshot({ path: `.artifacts/playwright/ui-scanner-${width}.png` })
      if (dismissal === 'Escape') await page.keyboard.press('Escape')
      else await warning.getByRole('button', { name: dismissal === 'close' ? 'Đóng' : 'Đã hiểu', exact: true }).click()
      await expect(warning).toHaveCount(0)
      await expect(page.getByLabel('Mã đặt chỗ / Nội dung QR')).toBeFocused()
      await expect(submit).toBeEnabled()
    }
    await page.route('**/api/v1/merchant/check-in', route => route.fulfill({ status: 400, json: { message: 'Mã đặt chỗ này thuộc về bãi đỗ xe khác!' } }))
    await submit.click()
    const wrongLot = page.getByRole('dialog', { name: 'Mã QR không hợp lệ tại bãi đang chọn' })
    await expect(wrongLot).toBeVisible()
    await expect(wrongLot.getByRole('alert')).toContainText('Vui lòng chọn đúng bãi kiểm soát hoặc quét lại mã QR.')
    await page.screenshot({ path: `.artifacts/playwright/ui-scanner-invalid-lot-${width}.png` })
    await wrongLot.getByRole('button', { name: 'Đã hiểu', exact: true }).click()
    await expect(wrongLot).toHaveCount(0)
    await expect(page.getByLabel('Mã đặt chỗ / Nội dung QR')).toBeFocused()
    expect(errors).toEqual([])
  })

  test(`vehicle fields align and unpaid tickets hide check-in codes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors = await initialize(page, 'DRIVER')
    await page.goto('/vehicles')
    await page.getByRole('button', { name: 'Thêm phương tiện', exact: true }).click()
    const type = page.getByLabel('Loại xe', { exact: true })
    const brand = page.getByLabel('Nhãn hiệu / Model (không bắt buộc)')
    await type.selectOption('SEDAN_SUV')
    await brand.fill('Toy')
    await brand.press('ArrowDown')
    await brand.press('Enter')
    await expect(brand).toHaveValue('Toyota')
    const typeBox = (await type.boundingBox())!
    const brandBox = (await brand.boundingBox())!
    expect(typeBox.height).toBe(48)
    expect(brandBox.height).toBe(48)
    if (width > 640) expect(typeBox.x).toBe(brandBox.x)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
    await page.screenshot({ path: `.artifacts/playwright/ui-vehicles-${width}.png`, fullPage: true })

    await page.goto('/bookings')
    await expect(page.getByText('Số đơn', { exact: true })).toBeVisible()
    await expect(page.getByText('#41', { exact: true })).toBeVisible()
    await expect(page.getByRole('img', { name: /Mã QR Check-in/ })).toHaveCount(0)
    expect(await page.locator('body').innerHTML()).not.toContain(booking.bookingCode)
    await page.screenshot({ path: `.artifacts/playwright/ui-payment-${width}.png`, fullPage: true })
    expect(errors).toEqual([])
  })
}
