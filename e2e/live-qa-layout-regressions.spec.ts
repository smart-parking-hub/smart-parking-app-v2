import { test, expect, type Page, type Route } from '@playwright/test'

async function pauseScripts(page: Page) {
  let releaseGate: () => void = () => undefined
  const gate = new Promise<void>(resolve => { releaseGate = resolve })
  const handler = async (route: Route) => {
    if (route.request().resourceType() === 'script') await gate
    await route.fallback()
  }
  await page.route('**/*', handler)
  return async () => { releaseGate(); await page.unroute('**/*', handler) }
}

async function driverVehicles(page: Page) {
  await page.addInitScript(token => localStorage.setItem('access_token', token),
    `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 12, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`)
  await page.route('**/api/v1/**', async route => {
    const url = new URL(route.request().url())
    expect(route.request().method()).toBe('GET')
    const vehicle = { id: 91, licensePlate: '51C-TEST01', vehicleType: 'CONTAINER', weightTon: 32, brandModel: 'Isuzu Giga', status: 'ACTIVE' }
    const content = url.pathname === '/api/v1/vehicles'
      ? [vehicle, { ...vehicle, id: 92, licensePlate: '51D-TEST02', status: 'INACTIVE' }]
      : []
    const data = url.pathname.endsWith('/unread-count') ? 0
      : url.pathname.endsWith('/driver/profile') ? { fullName: 'Tài xế kiểm thử', role: 'DRIVER' }
        : { content, currentPage: 0, totalPages: 1, totalElements: content.length }
    await route.fulfill({ json: { data } })
  })
}

for (const path of ['/login', '/parking']) {
  test(`bootstrap is visible before scripts and preserves anonymous ${path}`, async ({ page }) => {
    const resume = await pauseScripts(page)
    try {
      await page.goto(path, { waitUntil: 'commit' })
      const boot = page.locator('#app-bootstrap')
      await expect(boot).toBeVisible()
      await expect(boot).toHaveAttribute('role', 'status')
      await expect(boot).toHaveText('Đang tải giao diện…')
      await expect(page.getByTestId('parking-lots-container')).toHaveCount(0)
      await resume()
      await expect(page).toHaveURL(/\/login(?:\?|$)/)
      await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeVisible()
      await expect(boot).toHaveCount(0)
    } finally { await resume() }
  })
}

test('bootstrap hands over to the authenticated vehicle route', async ({ page }) => {
  await driverVehicles(page)
  const resume = await pauseScripts(page)
  try {
    await page.goto('/vehicles', { waitUntil: 'commit' })
    await expect(page.locator('#app-bootstrap')).toBeVisible()
    await expect(page.getByRole('table')).toHaveCount(0)
    await resume()
    await expect(page.getByRole('cell', { name: '51C-TEST01', exact: true })).toBeVisible()
    await expect(page).toHaveURL(/\/vehicles$/)
    await expect(page.locator('#app-bootstrap')).toHaveCount(0)
  } finally { await resume() }
})

test('vehicle table fits desktop widths on both sides of the old 1100px floor', async ({ page }) => {
  await driverVehicles(page)
  await page.goto('/vehicles')
  const region = page.getByRole('region', { name: 'Bảng phương tiện và bãi hiện tại', exact: true })
  await expect(region).toBeVisible()
  await expect(page.getByText('Đang tải bãi…', { exact: true })).toHaveCount(0)
  await page.evaluate(() => document.fonts.ready)
  for (const width of [1440, 1280, 1168, 1166, 1164, 1128, 1024]) {
    await page.setViewportSize({ width, height: 900 })
    await expect.poll(() => region.evaluate(el => el.scrollWidth - el.clientWidth), { message: `No redundant table scroll at ${width}px` }).toBe(0)
    await expect(region.getByRole('columnheader')).toHaveCount(7)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
  }
})

for (const width of [320, 390]) {
  test(`vehicle table keeps seven readable columns and reachable actions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await driverVehicles(page)
    await page.goto('/vehicles')
    const region = page.getByRole('region', { name: 'Bảng phương tiện và bãi hiện tại', exact: true })
    await expect(region).toBeVisible()
    await expect(region.getByRole('columnheader')).toHaveCount(7)
    expect(await region.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
    await region.scrollIntoViewIfNeeded()
    await region.evaluate(el => { el.scrollLeft = el.scrollWidth })
    const button = region.getByRole('button', { name: 'Sửa xe 51C-TEST01', exact: true })
    const visible = await button.evaluate(el => {
      const r = el.getBoundingClientRect(), parent = el.closest('[role=region]')!.getBoundingClientRect()
      return r.left >= parent.left && r.right <= parent.right && r.height >= 36
    })
    expect(visible).toBe(true)
    await page.screenshot({ path: `.artifacts/playwright/live-qa-vehicles-${width}.png` })
  })
}

test('mounted vehicle selector suppresses its native arrow and keeps one Chevron', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await driverVehicles(page)
  await page.goto('/vehicles')
  await page.getByRole('button', { name: 'Thêm phương tiện', exact: true }).click()
  const dialog = page.getByRole('dialog')
  const select = dialog.getByLabel('Loại xe', { exact: true })
  await expect(select).toHaveCSS('appearance', 'none')
  expect(await select.evaluate(el => el.parentElement!.querySelectorAll('svg').length)).toBe(1)
  await expect(page.locator('#modal-reg-class')).toHaveCount(0)
  await select.selectOption('HEAVY_TRUCK')
  await expect(dialog.getByLabel('Trọng tải (tấn)', { exact: true })).toBeEnabled()
  await dialog.getByRole('button', { name: 'Hủy', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Thêm phương tiện', exact: true })).toBeFocused()
})
