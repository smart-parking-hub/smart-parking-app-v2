import { test, expect } from '@playwright/test'
test.use({ baseURL: process.env.DETAIL_BASE_URL ?? 'http://127.0.0.1:5174' })
const lot = {
  id: 35, name: 'Bến Cảng Quận 1', address: '65 Nguyễn Chí, Quận 1, TP. Hồ Chí Minh', status: 'APPROVED', latitude: 10.7721328, longitude: 106.6948199,
  images: [],
  slots: [
    { id: 1, vehicleType: 'SEDAN_SUV', totalCapacity: 10, availableCapacity: 6 },
    { id: 2, vehicleType: 'BUS_COACH', totalCapacity: 5, availableCapacity: 2 },
    { id: 3, vehicleType: 'LIGHT_TRUCK', totalCapacity: 20, availableCapacity: 12 },
    { id: 4, vehicleType: 'HEAVY_TRUCK', totalCapacity: 15, availableCapacity: 4 },
    { id: 5, vehicleType: 'CONTAINER', totalCapacity: 10, availableCapacity: 3 },
  ],
  pricingRules: ['SEDAN_SUV', 'BUS_COACH', 'LIGHT_TRUCK', 'HEAVY_TRUCK', 'CONTAINER'].map((vehicleType, index) => ({ id: index + 1, vehicleType, basePricePerHour: [10000, 20000, 15000, 25000, 35000][index] })),
}
for (const width of [1440, 390]) {
  test(`real lot profile presentation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    const token = `test.${Buffer.from(JSON.stringify({ role: 'ROLE_MERCHANT', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
    await page.addInitScript(value => localStorage.setItem('access_token', value), token)
    await page.route('**/api/v1/merchant/profile', (route) => route.fulfill({ json: { data: { merchantId: 101, fullName: 'Chủ bãi' } } }))
    await page.route('**/api/v1/merchant/parking-lots/35', (route) => route.fulfill({ json: { data: lot } }))
    await page.goto('/merchant/parking-lots/35')
    await expect(page.getByRole('heading', { name: lot.name })).toBeVisible()
    await expect(page.getByRole('progressbar')).toHaveCount(5)
    await expect(page.getByRole('region', { name: 'Bản đồ vị trí bãi đỗ' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Mở trên Google Maps' })).toHaveAttribute('href', 'https://www.google.com/maps/search/?api=1&query=10.7721328,106.6948199')
    await expect(page.getByRole('link', { name: 'Cấu hình chỗ đỗ' })).toHaveAttribute('href', '/merchant/parking-lots/35/slots')
    await expect(page.getByRole('link', { name: 'Điều chỉnh bảng giá' })).toHaveAttribute('href', '/merchant/parking-lots/35/pricing')
    await page.evaluate(() => document.fonts.ready)
    await page.locator('.leaflet-tile-loaded').first().waitFor({ timeout: 15000 }).catch(() => {})
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `docs/09-audit/scr-030-detail-${width}.png`, fullPage: true })
    await page.getByRole('link', { name: 'Mở trên Google Maps' }).focus()
    await expect(page.getByRole('link', { name: 'Mở trên Google Maps' })).toBeFocused()
    expect(errors).toEqual([])
  })
}
