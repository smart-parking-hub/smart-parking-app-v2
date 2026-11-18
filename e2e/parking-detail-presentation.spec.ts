import { test, expect } from '@playwright/test'
import path from 'node:path'

for (const storage of ['local', 'cdn']) for (const width of [390, 1440]) test(`parking detail ${storage} images and Vietnamese rates at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.addInitScript(() => localStorage.setItem('access_token', `test.${btoa(JSON.stringify({ role: 'ROLE_DRIVER', userId: 88, exp: 2000000000 }))}.test`))
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text()) })
  const images = [
    { id: 18, contentUrl: '/api/v1/parking-lots/37/images/18/content', originalFileName: 'Lối vào.jpg', cover: false },
    { id: 17, contentUrl: '/api/v1/parking-lots/37/images/17/content', originalFileName: 'Toàn cảnh.jpg', cover: true },
    { id: 19, contentUrl: '/api/v1/parking-lots/37/images/19/content', originalFileName: 'Khu đỗ xe.jpg', cover: false },
  ]
  if (storage === 'cdn') for (const image of images) image.contentUrl = `https://res.cloudinary.com/parking/image/upload/${image.id}.jpg`
  const types = ['LIGHT_TRUCK', 'HEAVY_TRUCK', 'CONTAINER']
  const lot = { id: 37, name: 'Bãi xe An Phú', address: 'Thủ Đức, TP. Hồ Chí Minh', status: 'APPROVED', merchantId: 9, images,
    slots: types.map((vehicleType, i) => ({ vehicleType, availableCapacity: i === 2 ? 0 : 4, totalCapacity: 15 })),
    pricingRules: types.map(vehicleType => ({ vehicleType, basePricePerHour: 20000, surgeMultiplier: 1.2, surgeStartTime: '17:00:00', surgeEndTime: '20:00:00', overtimePenaltyMultiplier: 1.5 })),
  }
  const mediaRequests: boolean[] = []
  await page.route('https://res.cloudinary.com/**', async route => {
    const headers = route.request().headers()
    mediaRequests.push(Boolean(headers['x-app-key'] || headers['authorization']))
    await route.fulfill({ path: path.resolve('public/images/hero-container-terminal.jpg'), contentType: 'image/jpeg' })
  })
  await page.route('**/api/v1/**', async route => {
    const url = new URL(route.request().url())
    if (/\/images\/\d+\/content$/.test(url.pathname)) {
      mediaRequests.push(Boolean(route.request().headers()['x-app-key']))
      await route.fulfill({ path: path.resolve('public/images/hero-container-terminal.jpg'), contentType: 'image/jpeg' })
      return
    }
    const data = url.pathname === '/api/v1/parking-lots/37' ? lot : url.pathname.endsWith('/vehicles') ? { content: [] } :
      url.pathname.endsWith('/unread-count') ? 0 : url.pathname.endsWith('/users/me') || url.pathname.endsWith('/driver/profile') ? { id: 88, fullName: 'Tài xế kiểm thử', role: 'DRIVER' } : { content: [] }
    await route.fulfill({ json: { data } })
  })
  await page.goto('/parking/37')
  const cover = page.getByRole('img', { name: 'Ảnh bãi đỗ Bãi xe An Phú – Toàn cảnh.jpg' })
  await expect(cover).toBeVisible()
  await expect.poll(() => cover.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  for (const name of ['Xe tải nhẹ', 'Xe tải nặng', 'Đầu kéo / Container']) await expect(page.getByRole('article', { name })).toBeVisible()
  await expect(page.getByText('HEAVY_TRUCK', { exact: true })).toHaveCount(0)
  await expect(page.getByText('CONTAINER', { exact: true })).toHaveCount(0)
  await expect(page.getByText('17:00 – 20:00')).toHaveCount(3)
  await expect(page.getByText('Hiện đã hết chỗ', { exact: true })).toBeVisible()
  const next = page.getByRole('button', { name: 'Xem ảnh 2 của Bãi xe An Phú' })
  await next.focus(); await next.press('Enter')
  await expect(next).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('img', { name: 'Ảnh bãi đỗ Bãi xe An Phú – Lối vào.jpg' })).toBeVisible()
  expect(mediaRequests.length).toBeGreaterThan(0)
  expect(mediaRequests.every(hasApplicationHeaders => hasApplicationHeaders === (storage === 'local'))).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await expect(page.getByRole('link', { name: 'Về bản đồ' })).toHaveAttribute('href', '/parking')
  await expect(page.getByRole('link', { name: 'Đăng ký phương tiện' })).toBeVisible()
  await page.screenshot({ path: `.artifacts/playwright/parking-detail-presentation-${storage}-${width}.png`, fullPage: true })
  expect(errors).toEqual([])
})
