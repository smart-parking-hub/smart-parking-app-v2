import { expect, test } from '@playwright/test'

const publicRoutes = [
  '/',
  '/api-docs',
  '/contact',
  '/pricing',
  '/about',
  '/careers',
  '/insights',
  '/solutions/drivers',
  '/solutions/owners',
]

for (const width of [320, 375, 390]) {
  test(`public pages fit a ${width}px viewport`, async ({ page }) => {
    test.setTimeout(60_000)
    await page.setViewportSize({ width, height: 844 })

    for (const route of publicRoutes) {
      await page.goto(route)
      await expect(page.locator('h1').first()).toBeVisible()
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      expect(scrollWidth, `${route} overflows at ${width}px`).toBeLessThanOrEqual(width)
    }
  })
}

test('narrow API docs keeps its primary action reachable from the mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto('/api-docs')

  const menuButton = page.locator('header button[aria-expanded]').last()
  await expect(menuButton).toBeVisible()
  await menuButton.click()

  const mobileNavigation = page.getByRole('navigation', { name: 'Điều hướng di động' })
  await expect(mobileNavigation).toBeVisible()
  const primaryAction = mobileNavigation.locator('a[href="#sandbox-register"]')
  await expect(primaryAction).toBeVisible()
  await primaryAction.click()
  await expect(page).toHaveURL(/#sandbox-register$/)
  await expect(mobileNavigation).toHaveCount(0)
})

for (const { name, viewport, file } of [
  { name: 'portrait', viewport: { width: 390, height: 844 }, file: 'auth-parking-lot-bg.webp' },
  { name: 'small landscape', viewport: { width: 640, height: 320 }, file: 'auth-parking-lot-bg-720.webp' },
]) {
test(`auth page selects a sharp WebP background for ${name} and a smaller logo`, async ({ page }) => {
  await page.setViewportSize(viewport)
  await page.route('**/api/v1/auth/ping', route => route.fulfill({ status: 200, json: {} }))
  await page.goto('/login')

  const background = page.locator('picture img[alt="SmartTruck Hub Commercial Logistics Parking Depot"]')
  await expect.poll(() => background.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  await expect.poll(() => background.evaluate((image: HTMLImageElement) => image.currentSrc)).toContain(file)
  await expect(page.locator('img[src="/image-smart-parking-hub-168.png"]')).toBeVisible()
  const smallBackground = await page.request.get(new URL(`/images/${file}`, page.url()).toString())
  const smallLogo = await page.request.get(new URL('/image-smart-parking-hub-168.png', page.url()).toString())
  expect((await smallBackground.body()).byteLength).toBeLessThan((name === 'portrait' ? 140 : 45) * 1024)
  expect((await smallLogo.body()).byteLength).toBeLessThan(35 * 1024)
})
}

test('empty login submission reports field errors without sending credentials', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('**/api/v1/auth/ping', route => route.fulfill({ status: 200, json: {} }))
  let loginRequests = 0
  page.on('request', request => {
    if (new URL(request.url()).pathname.endsWith('/auth/login')) loginRequests += 1
  })

  await page.goto('/login')
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await expect(page.getByRole('alert').filter({ hasText: 'Số điện thoại Việt Nam chưa hợp lệ.' })).toBeVisible()
  await expect(page.getByRole('alert').filter({ hasText: 'Mật khẩu phải từ 6 đến 50 ký tự.' })).toBeVisible()
  expect(loginRequests).toBe(0)
})
