import { test, expect } from '@playwright/test'

test.use({ baseURL: 'http://127.0.0.1:5190' })

test.beforeEach(async ({ page }) => {
  const token = `test.${Buffer.from(JSON.stringify({ role: 'ROLE_MERCHANT', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
  await page.addInitScript(value => localStorage.setItem('access_token', value), token)
  await page.route('**/api/v1/**', route => route.fulfill({ json: { data: null } }))
})

for (const path of ['/merchant/dashboard', '/merchant/profile']) {
  test(`collapse and expand sidebar at ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(path)
    const sidebar = page.locator('#merchant-sidebar')
    await expect(sidebar.getByText('Smart Parking')).toBeVisible()
    await expect(page).toHaveTitle(/Smart Parking Hub/)
    await page.getByRole('button', { name: 'Thu gọn menu', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Mở rộng menu', exact: true })).toHaveAttribute('aria-expanded', 'false')
    await expect(sidebar).toHaveCSS('width', '76px')
    await expect(sidebar.getByText('Smart Parking')).toBeHidden()
    await expect(sidebar.getByRole('link', { name: 'Thông báo', exact: true })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Thông báo', exact: true })).toHaveAttribute('title', 'Thông báo')
    await expect(page.locator('body > #root header').first()).toHaveCSS('left', '76px')
    await page.screenshot({ path: `docs/09-audit/merchant-sidebar-${path.endsWith('profile') ? 'profile' : 'dashboard'}-collapsed.png` })
    await page.getByRole('button', { name: 'Mở rộng menu', exact: true }).focus()
    await page.keyboard.press('Enter')
    await expect(sidebar).toHaveCSS('width', '260px')
    await expect(sidebar.getByText('Smart Parking')).toBeVisible()
  })
}

test('mobile menu remains full width after desktop collapse', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/merchant/dashboard')
  await page.getByRole('button', { name: 'Thu gọn menu', exact: true }).click()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Mở menu', exact: true }).click()
  const sidebar = page.locator('#merchant-sidebar')
  await expect(sidebar).toHaveCSS('width', '260px')
  await expect(sidebar.getByText('Smart Parking')).toBeVisible()
  await expect(sidebar.getByText('Bãi đỗ của tôi')).toBeVisible()
  await page.getByRole('button', { name: 'Đóng menu', exact: true }).click()
  await expect(sidebar).not.toBeInViewport()
})
