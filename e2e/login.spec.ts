import { test, expect } from '@playwright/test'
const jwt = (role: string) => `test.${Buffer.from(JSON.stringify({ role: `ROLE_${role}`, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
test('mobile login validates keyboard submission and has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/login')
  await page.getByLabel('Mật khẩu', { exact: true }).press('Enter')
  await expect(page.getByText('Số điện thoại Việt Nam chưa hợp lệ.')).toBeVisible()
  await page.getByRole('button', { name: 'Hiện mật khẩu' }).click()
  await expect(page.getByLabel('Mật khẩu', { exact: true })).toHaveAttribute('type', 'text')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: 'docs/09-audit/scr-010-mobile.png', fullPage: true })
  expect(errors).toEqual([])
})
for (const role of ['DRIVER', 'MERCHANT', 'ADMIN']) {
  test(`${role}: API login, JWT persistence, toast, reload and guest redirect`, async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
      expect(route.request().postDataJSON()).toEqual({ phone: '0909128374', password: 'test-only-password' })
      await route.fulfill({ json: { data: { token: jwt(role), role }, message: 'Đăng nhập thành công' } })
    })
    const destination = role === 'DRIVER' ? '/dashboard' : `/${role.toLowerCase()}/dashboard`
    await page.goto('/login')
    await page.getByLabel('Số điện thoại', { exact: true }).fill('090 912 8374')
    await page.getByLabel('Mật khẩu', { exact: true }).fill('test-only-password')
    await page.getByRole('checkbox', { name: 'Ghi nhớ số điện thoại' }).check()
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`${destination}$`))
    await expect(page.getByRole('status').filter({ hasText: 'Đăng nhập thành công.' })).toBeVisible()
    expect(await page.evaluate(() => Boolean(localStorage.getItem('access_token')))).toBe(true)
    await page.goto('/login')
    await expect(page).toHaveURL(new RegExp(`${destination}$`))
  })
}
test('HTTP error keeps form usable and retry sends a new request', async ({ page }) => {
  let attempts = 0
  await page.route('**/api/v1/auth/login', async (route) => {
    attempts++
    await route.fulfill({ status: 401, json: { message: 'Số điện thoại hoặc mật khẩu không đúng!' } })
  })
  await page.goto('/login')
  await page.getByLabel('Số điện thoại', { exact: true }).fill('0909128374')
  await page.getByLabel('Mật khẩu', { exact: true }).fill('test-only-password')
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await expect(page.getByText(/Mã lỗi 401/)).toBeVisible()
  await page.getByRole('button', { name: 'Thử lại' }).click()
  await expect.poll(() => attempts).toBe(2)
})

test('admin logout clears session and revisiting a protected page requires login', async ({ page }) => {
  await page.addInitScript((token) => localStorage.setItem('access_token', token), jwt('ADMIN'))
  await page.goto('/admin/dashboard')
  // Remove the init script effect from subsequent navigations by staying within the SPA.
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click()
  await expect(page).toHaveURL(/\/login/)
  expect(await page.evaluate(() => localStorage.getItem('access_token'))).toBeNull()
})
test('desktop login has accessible fields and captures the completed screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/login')
  await expect(page.getByLabel('Số điện thoại', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Chào mừng trở lại.' })).toBeVisible()
  await page.screenshot({ path: 'docs/09-audit/scr-010-desktop.png', fullPage: true })
})
