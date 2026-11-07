import { test, expect } from '@playwright/test'

test.use({ baseURL: process.env.LOT_NAV_BASE_URL ?? 'http://127.0.0.1:5183' })
for (const width of [1440, 390]) {
  test(`switch lot sections through one navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    const token = `test.${Buffer.from(JSON.stringify({ role: 'ROLE_MERCHANT', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
    await page.addInitScript(value => localStorage.setItem('access_token', value), token)
    const slots = [{ id: 1, vehicleType: 'CONTAINER', totalCapacity: 20, availableCapacity: 8 }]
    await page.route('**/api/v1/merchant/profile', route => route.fulfill({ json: { data: { merchantId: 1, fullName: 'Chủ bãi' } } }))
    await page.route('**/api/v1/merchant/parking-lots/35', route => route.fulfill({ json: { data: {
      id: 35, name: 'Bến Cảng Quận 1', address: '65 Nguyễn Chí Thanh, Quận 1', status: 'APPROVED',
      latitude: null, longitude: null, images: [], slots,
      pricingRules: [{ id: 1, vehicleType: 'CONTAINER', basePricePerHour: 25000 }],
    } } }))
    await page.route('**/api/v1/parking-lots/35/slots', route => route.fulfill({ json: { data: slots } }))
    await page.goto('/merchant/parking-lots/35')
    const nav = page.getByRole('navigation', { name: 'Điều hướng hồ sơ bãi' })
    await expect(nav.getByRole('link', { name: 'Tổng quan' })).toHaveAttribute('aria-current', 'page')
    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `docs/09-audit/lot-navigation-${width}.png`, fullPage: true })
    await nav.getByRole('link', { name: 'Cấu hình chỗ đỗ' }).click()
    await expect(nav.getByRole('link', { name: 'Cấu hình chỗ đỗ' })).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('spinbutton')).toHaveCount(1)
    await expect(page.getByRole('heading', { name: 'Vị trí bãi đỗ' })).toHaveCount(0)
    await nav.getByRole('link', { name: 'Bảng giá' }).click()
    await expect(nav.getByRole('link', { name: 'Bảng giá' })).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('button', { name: 'Lưu thay đổi' })).toBeVisible()
    await page.reload()
    await expect(nav.getByRole('link', { name: 'Bảng giá' })).toHaveAttribute('aria-current', 'page')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `docs/09-audit/lot-navigation-pricing-${width}.png`, fullPage: true })
    await nav.getByRole('link', { name: 'Tổng quan' }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Vị trí bãi đỗ' })).toBeVisible()
    expect(errors).toEqual([])
  })
}

