import { test, expect } from '@playwright/test'

const lot = {
  id: 35, name: 'Bến Cảng Quận 1', address: '65 Nguyễn Chí, Quận 1',
  latitude: 21.0278, longitude: 105.8342, status: 'CHANGES_REQUESTED',
  reviewReason: 'Cập nhật địa chỉ cổng vào.', images: [], slots: [], pricingRules: [],
}
test.beforeEach(async ({ page }) => {
  const token = `test.${Buffer.from(JSON.stringify({ role: 'ROLE_MERCHANT', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
  await page.addInitScript(value => localStorage.setItem('access_token', value), token)
})

for (const width of [1440, 390]) {
  test(`edit uses this lot's data, preserves errors and confirms resubmission at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    let saved = false
    let attempts = 0
    await page.route('**/api/v1/merchant/parking-lots/35', async route => {
      if (route.request().method() === 'PUT') {
        expect(route.request().postDataJSON()).toEqual({ name: lot.name, address: 'Cổng mới, Quận 1', latitude: lot.latitude, longitude: lot.longitude })
        attempts++
        if (attempts === 1) {
          await route.fulfill({ status: 500, json: { message: 'Không lưu được hồ sơ, hãy thử lại.' } })
          return
        }
        saved = true
      }
      await route.fulfill({ json: { data: { ...lot, ...(saved ? { address: 'Cổng mới, Quận 1', status: 'PENDING_APPROVAL', reviewReason: null } : {}) } } })
    })
    await page.goto('/merchant/parking-lots/35/edit')
    await expect(page.getByLabel('Tên bãi đỗ', { exact: true })).toHaveValue(lot.name)
    await expect(page.getByLabel('Vĩ độ', { exact: true })).toHaveValue(String(lot.latitude))
    await expect(page.getByLabel('Kinh độ', { exact: true })).toHaveValue(String(lot.longitude))
    await expect(page.getByText(lot.reviewReason)).toBeVisible()
    await expect(page.getByText(/Nguyễn Hoàng Nam|Rev 2\.1|RTK|OTP Verified|Gò Cát/)).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Xem vị trí trên Google Maps' })).toHaveAttribute('href', `https://www.google.com/maps/search/?api=1&query=${lot.latitude},${lot.longitude}`)
    await expect(page.getByText('Bãi chưa có ảnh.')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await page.screenshot({ path: `docs/09-audit/scr-031-real-data-${width}.png`, fullPage: true })
    await page.getByLabel('Địa chỉ', { exact: true }).fill('Cổng mới, Quận 1')
    await page.getByRole('button', { name: 'Gửi lại hồ sơ', exact: true }).click()
    await expect(page.getByRole('alert').filter({ hasText: 'Không lưu được hồ sơ' })).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await page.getByRole('button', { name: 'Gửi lại hồ sơ', exact: true }).click()
    const success = page.getByRole('dialog', { name: 'Đã lưu hồ sơ bãi' })
    await expect(success).toContainText('Chờ duyệt')
    await success.getByRole('button', { name: 'Xem chi tiết bãi' }).click()
    await expect(page).toHaveURL(/\/merchant\/parking-lots\/35$/)
    await expect(page.getByText(/Mã bãi: #35 · Đang chờ duyệt/)).toBeVisible()
    await expect(page.getByRole('link', { name: 'Chỉnh sửa hồ sơ' })).toHaveCount(0)
    expect(attempts).toBe(2)
    expect(errors).toEqual([])
  })
}

test('changing yards loads separate coordinates and approved yards redirect to detail', async ({ page }) => {
  await page.route('**/api/v1/merchant/parking-lots/*', route => {
    const id = Number(route.request().url().split('/').pop())
    return route.fulfill({ json: { data: { ...lot, id, name: `Bãi ${id}`, latitude: id === 35 ? 0 : 10.2, longitude: id === 35 ? 0 : 106.3, status: id === 37 ? 'APPROVED' : 'REJECTED' } } })
  })
  await page.goto('/merchant/parking-lots/35/edit')
  await expect(page.getByLabel('Vĩ độ', { exact: true })).toHaveValue('0')
  await page.goto('/merchant/parking-lots/36/edit')
  await expect(page.getByLabel('Tên bãi đỗ', { exact: true })).toHaveValue('Bãi 36')
  await expect(page.getByLabel('Vĩ độ', { exact: true })).toHaveValue('10.2')
  await expect(page.getByLabel('Kinh độ', { exact: true })).toHaveValue('106.3')
  await page.goto('/merchant/parking-lots/37/edit')
  await expect(page).toHaveURL(/\/merchant\/parking-lots\/37$/)
  await expect(page.getByRole('heading', { name: 'Bãi 37', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Chỉnh sửa hồ sơ' })).toHaveCount(0)
})
