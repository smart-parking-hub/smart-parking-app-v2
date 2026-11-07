import { test, expect } from '@playwright/test'

test.use({ baseURL: process.env.REGISTRATION_BASE_URL ?? 'http://127.0.0.1:5174' })

const token = `test.${Buffer.from(JSON.stringify({ role: 'ROLE_MERCHANT', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`

test.beforeEach(async ({ page }) => {
  await page.addInitScript((value) => localStorage.setItem('access_token', value), token)
  await page.route('**/api/v1/merchant/profile', (route) => route.fulfill({ json: { data: { merchantId: 101, fullName: 'Chủ bãi thử nghiệm' } } }))
})

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`registration ${viewport.width}px: validation, keyboard, photos, map, draft and confirmation`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    const consoleErrors: string[] = []
    page.on('console', (message) => { if (message.type() === 'error' || message.type() === 'warning') consoleErrors.push(message.text()) })
    await page.goto('/merchant/parking-lots/new')
    await expect(page.getByRole('heading', { name: 'Đăng ký bãi đỗ mới' })).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: `docs/09-audit/scr-029-redesign-${viewport.width}.png`, fullPage: true })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.getByRole('button', { name: 'Tiếp tục: Vị trí bãi đỗ' }).click()
    await expect(page.getByText('Tên bãi đỗ không được để trống')).toBeVisible()
    await expect(page.getByLabel(/^Tên bãi đỗ/)).toBeFocused()
    await page.getByLabel(/^Tên bãi đỗ/).fill('Bãi đỗ Tân Cảng')
    await page.getByLabel(/^Địa chỉ bãi đỗ/).fill('12 Gò Cát, Phú Hữu')
    await page.getByLabel('Chọn ảnh bãi đỗ').setInputFiles({ name: 'yard.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') })
    await expect(page.getByText('1/5 ảnh')).toBeVisible()
    await page.getByRole('button', { name: 'Tiếp tục: Vị trí bãi đỗ' }).click()
    await expect(page.getByRole('heading', { name: 'Vị trí bãi đỗ' })).toBeVisible()
    await page.getByLabel(/^Vĩ độ/).fill('10.762622')
    await page.getByLabel(/^Kinh độ/).fill('106.660172')
    await page.getByRole('button', { name: 'Lưu bản nháp' }).click()
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('merchant_lot_registration_draft')!).latitude)).toBe(10.762622)
    await page.getByRole('button', { name: 'Đóng thông báo' }).click()
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.screenshot({ path: `docs/09-audit/scr-029-map-${viewport.width}.png`, fullPage: true })
    await page.getByRole('button', { name: 'Tiếp tục: Kiểm tra hồ sơ' }).click()
    await expect(page.getByRole('heading', { name: 'Kiểm tra thông tin đăng ký' })).toBeVisible()
    await expect(page.getByText('Vĩ độ: 10.7626220')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.screenshot({ path: `docs/09-audit/scr-029-confirm-${viewport.width}.png`, fullPage: true })
    const completedStep = page.getByRole('button', { name: /Thông tin bãi đỗ.*Đã hoàn thành/ })
    await completedStep.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByLabel(/^Tên bãi đỗ/)).toHaveValue('Bãi đỗ Tân Cảng')
    await expect(page.getByText('1/5 ảnh')).toBeVisible()
    expect(errors).toEqual([])
    expect(consoleErrors.filter((error) => !error.includes('tile.openstreetmap.org'))).toEqual([])
  })
}

test('final submission creates one lot and uploads its images; partial failure supports retry', async ({ page }) => {
  let creates = 0
  let uploads = 0
  await page.addInitScript(() => localStorage.setItem('merchant_lot_registration_draft', JSON.stringify({ name: 'Bãi đỗ Tân Cảng', address: '12 Gò Cát, Phú Hữu', latitude: 10.762622, longitude: 106.660172 })))
  await page.route('**/api/v1/merchant/parking-lots', async (route) => {
    creates++
    expect(route.request().postDataJSON()).toEqual({ name: 'Bãi đỗ Tân Cảng', address: '12 Gò Cát, Phú Hữu', latitude: 10.762622, longitude: 106.660172 })
    await route.fulfill({ json: { data: { id: 101, name: 'Bãi đỗ Tân Cảng', status: 'PENDING_APPROVAL' } } })
  })
  await page.route('**/api/v1/merchant/parking-lots/101/images', async (route) => {
    uploads++
    await route.fulfill(uploads === 1 ? { status: 500, json: { message: 'Upload thử nghiệm thất bại' } } : { json: { data: [] } })
  })
  await page.goto('/merchant/parking-lots/new')
  await page.getByLabel('Chọn ảnh bãi đỗ').setInputFiles({ name: 'yard.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') })
  await page.getByRole('button', { name: 'Tiếp tục: Vị trí bãi đỗ' }).click()
  await page.getByRole('button', { name: 'Tiếp tục: Kiểm tra hồ sơ' }).click()
  await page.getByRole('button', { name: 'Gửi hồ sơ đăng ký' }).click()
  await expect(page.getByRole('alert')).toContainText('Ảnh chưa tải lên thành công')
  await page.getByRole('button', { name: 'Thử tải lại ảnh' }).click()
  await expect(page.getByRole('status')).toContainText('thành công')
  expect(creates).toBe(1)
  expect(uploads).toBe(2)
  expect(await page.evaluate(() => localStorage.getItem('merchant_lot_registration_draft'))).toBeNull()
})
