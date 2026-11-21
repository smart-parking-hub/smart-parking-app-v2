import { expect, test } from '@playwright/test'

test.use({ launchOptions: { args: ['--enable-unsafe-swiftshader'] } })

for (const width of [390, 1440]) {
  test(`native map clusters expand with keyboard and preserve lot selection at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    const styleUrl = 'http://127.0.0.1:5174/qa-map-style.json'
    const config = { defaultBasemap: 'openfreemap', styleUrl, geocoderEnabled: false, routingEnabled: false }
    await page.addInitScript(({ token, config }) => {
      localStorage.setItem('access_token', token)
      Object.assign(window, { __SMART_PARKING_MAP_CONFIG__: config })
    }, {
      token: `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 12, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`,
      config,
    })
    await page.route('**/map-config.json', route => route.fulfill({ json: config }))
    // Real MapLibre worker/source/zoom, independent of public tile and geocoder availability.
    await page.route('**/qa-map-style.json', route => route.fulfill({ json: {
      version: 8, sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#edf2f7' } }],
    } }))
    const lots = [[10.77, 106.7], [10.7708, 106.7008], [10.8, 106.75]].map(([latitude, longitude], index) => ({
      id: index + 1, name: `Bãi kiểm thử ${index + 1}`, address: 'Thủ Đức', latitude, longitude,
      availableCapacity: 5, totalSlots: 10, basePricePerHour: 50000, status: 'APPROVED',
    }))
    await page.route('**/api/v1/**', route => {
      expect(route.request().method()).toBe('GET')
      const path = new URL(route.request().url()).pathname
      const data = path === '/api/v1/parking-lots/search' ? { content: lots, totalPages: 1, totalElements: lots.length }
        : path === '/api/v1/users/me' ? { fullName: 'Tài xế kiểm thử' }
        : path.endsWith('/unread-count') ? 0
        : { content: [], currentPage: 0, totalPages: 0, totalElements: 0 }
      return route.fulfill({ json: { data } })
    })
    await page.goto('/parking')
    const cluster = page.getByRole('button', { name: '2 bãi đỗ gần nhau. Phóng to để chọn bãi', exact: true })
    await expect(cluster).toBeVisible({ timeout: 15000 })
    await expect(page.locator('.parking-map-marker')).toHaveCount(2)
    await page.screenshot({ path: `.artifacts/qa-reevaluation/map-clusters-${width}.png` })
    await cluster.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('.parking-map-cluster')).toHaveCount(0)
    const lotMarker = page.getByRole('button', { name: 'Bãi kiểm thử 1', exact: true })
    await expect(lotMarker).toBeVisible()
    await lotMarker.focus()
    await page.keyboard.press('Space')
    await expect(page.locator('.parking-map-pin[data-selected="true"]')).toBeVisible()
    await expect(page.locator('.parking-map-popup')).toContainText('Bãi kiểm thử 1')
    await expect(page.getByRole('button', { name: 'Chọn bãi xe Bãi kiểm thử 1', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.parking-map-pin[data-selected="true"]')).toContainText('50K / giờ')
    await page.screenshot({ path: `.artifacts/qa-reevaluation/map-selected-${width}.png` })
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
    expect(errors).toEqual([])
  })
}
