import { test, expect } from '@playwright/test'

test.use({ baseURL: process.env.DETAIL_BASE_URL ?? 'http://127.0.0.1:5174' })

const EMPTY_STYLE_FIXTURE = {
  version: 8,
  sources: {},
  layers: [],
}

const TRANSPARENT_TILE_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
)

const lot = {
  id: 35,
  name: 'Bến Cảng Quận 1',
  address: '65 Nguyễn Chí, Quận 1, TP. Hồ Chí Minh',
  status: 'APPROVED',
  latitude: 10.7721328,
  longitude: 106.6948199,
  images: [],
  slots: [
    { id: 1, vehicleType: 'SEDAN_SUV', totalCapacity: 10, availableCapacity: 6 },
    { id: 2, vehicleType: 'BUS_COACH', totalCapacity: 5, availableCapacity: 2 },
    { id: 3, vehicleType: 'LIGHT_TRUCK', totalCapacity: 20, availableCapacity: 12 },
    { id: 4, vehicleType: 'HEAVY_TRUCK', totalCapacity: 15, availableCapacity: 4 },
    { id: 5, vehicleType: 'CONTAINER', totalCapacity: 10, availableCapacity: 3 },
  ],
  pricingRules: ['SEDAN_SUV', 'BUS_COACH', 'LIGHT_TRUCK', 'HEAVY_TRUCK', 'CONTAINER'].map(
    (vehicleType, index) => ({
      id: index + 1,
      vehicleType,
      basePricePerHour: [10000, 20000, 15000, 25000, 35000][index],
    }),
  ),
}

async function setupMerchantDetailRoutes(page: import('@playwright/test').Page) {
  const token = `test.${Buffer.from(
    JSON.stringify({ role: 'ROLE_MERCHANT', exp: Math.floor(Date.now() / 1000) + 3600 }),
  ).toString('base64url')}.test`
  await page.addInitScript((value) => localStorage.setItem('access_token', value), token)
  await page.route('**/api/v1/merchant/profile', (route) =>
    route.fulfill({ json: { data: { merchantId: 101, fullName: 'Chủ bãi' } } }),
  )
  await page.route('**/api/v1/merchant/parking-lots/35', (route) =>
    route.fulfill({ json: { data: lot } }),
  )
}

for (const width of [1440, 390]) {
  test(`real lot profile presentation with ready map tiles at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await setupMerchantDetailRoutes(page)
    await page.route('**/*mt*.google.com/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: TRANSPARENT_TILE_PNG,
      }),
    )
    await page.route('**/*tiles.openfreemap.org/**', (route) =>
      route.fulfill({ status: 200, json: EMPTY_STYLE_FIXTURE }),
    )

    await page.goto('/merchant/parking-lots/35')
    await expect(page.getByRole('heading', { name: lot.name })).toBeVisible()
    await expect(page.getByRole('progressbar')).toHaveCount(5)

    const mapRegion = page.getByRole('region', { name: 'Bản đồ vị trí bãi đỗ' })
    await expect(mapRegion).toBeVisible()
    await expect(mapRegion).toHaveAttribute('data-map-state', 'ready', { timeout: 15000 })

    const externalMapLink = page.getByRole('link', { name: 'Mở trên Google Maps' })
    const href = await externalMapLink.getAttribute('href')
    expect(href).toBeTruthy()
    const parsedUrl = new URL(href!)
    expect(parsedUrl.origin + parsedUrl.pathname).toBe('https://www.google.com/maps/search/')
    expect(parsedUrl.searchParams.get('api')).toBe('1')
    expect(parsedUrl.searchParams.get('query')).toBe('10.7721328,106.6948199')

    await expect(page.getByRole('link', { name: 'Cấu hình chỗ đỗ' })).toHaveAttribute(
      'href',
      '/merchant/parking-lots/35/slots',
    )
    await expect(page.getByRole('link', { name: 'Điều chỉnh bảng giá' })).toHaveAttribute(
      'href',
      '/merchant/parking-lots/35/pricing',
    )

    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `docs/09-audit/scr-030-detail-${width}.png`, fullPage: true })
    await externalMapLink.focus()
    await expect(externalMapLink).toBeFocused()
    expect(errors).toEqual([])
  })
}

test('degrades cleanly with error alert and external Google Maps link when map tiles fail', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await setupMerchantDetailRoutes(page)
  await page.route('**/*mt*.google.com/**', (route) => route.abort())
  await page.route('**/*tiles.openfreemap.org/**', (route) => route.abort())

  await page.goto('/merchant/parking-lots/35')
  const mapRegion = page.getByRole('region', { name: 'Bản đồ vị trí bãi đỗ' })
  await expect(mapRegion).toHaveAttribute('data-map-state', 'error', { timeout: 15000 })
  await expect(mapRegion.getByRole('alert')).toContainText('Google Maps')
  await expect(mapRegion.getByRole('button', { name: 'Thử tải lại' })).toBeVisible()
})
