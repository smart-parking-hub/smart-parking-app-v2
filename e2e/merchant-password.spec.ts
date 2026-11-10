import { test, expect } from '@playwright/test'

test.use({ baseURL: process.env.MERCHANT_PASSWORD_BASE_URL ?? 'http://127.0.0.1:3000' })

for (const role of ['merchant', 'driver'] as const) for (const width of [1440, 390]) {
  test(`${role} changes password at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const token = `test.${Buffer.from(JSON.stringify({ role: role === 'merchant' ? 'ROLE_MERCHANT' : 'ROLE_DRIVER', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
    await page.addInitScript(value => localStorage.setItem('access_token', value), token)
    await page.route(role === 'merchant' ? '**/api/v1/merchant/profile' : '**/api/v1/users/me', route => route.fulfill({ json: { data: {
      merchantId: 7, userId: 12, fullName: 'Chủ bãi thử nghiệm', phone: '0901234567',
    } } }))
    let calls = 0
    await page.route('**/api/v1/users/me/password', route => {
      calls++
      expect(route.request().postDataJSON()).toEqual({ currentPassword: calls === 1 ? 'wrong-pass' : 'correct-pass', newPassword: 'new-password-123' })
      if (calls === 2) return route.abort('failed')
      return route.fulfill(calls === 1
        ? { status: 400, json: { message: 'Mật khẩu hiện tại không đúng' } }
        : { json: { data: null } })
    })
    await page.goto(role === 'merchant' ? '/merchant/profile#bao-mat' : '/profile#bao-mat')
    await page.getByRole('link', { name: /Bảo mật tài khoản/ }).click()
    await page.getByLabel('Mật khẩu hiện tại', { exact: true }).fill('wrong-pass')
    await page.getByLabel('Mật khẩu mới', { exact: true }).fill('new-password-123')
    await page.getByLabel('Xác nhận mật khẩu mới', { exact: true }).fill('different')
    await page.getByRole('button', { name: 'Cập nhật mật khẩu' }).click()
    await expect(page.getByText('Mật khẩu xác nhận không khớp.')).toBeVisible()
    expect(calls).toBe(0)
    await page.getByLabel('Xác nhận mật khẩu mới', { exact: true }).fill('new-password-123')
    await page.getByRole('button', { name: 'Cập nhật mật khẩu' }).click()
    await expect(page.getByText('Mật khẩu hiện tại không đúng')).toBeVisible()
    await page.getByLabel('Mật khẩu hiện tại', { exact: true }).fill('correct-pass')
    await page.getByRole('button', { name: 'Cập nhật mật khẩu' }).click()
    await expect(page.getByText('Không kết nối được máy chủ. Vui lòng thử lại.')).toBeVisible()
    await expect(page.getByText('Đã đổi mật khẩu thành công.')).toBeHidden()
    await page.getByRole('button', { name: 'Cập nhật mật khẩu' }).click()
    await expect(page.getByText('Đã đổi mật khẩu thành công.')).toBeVisible()
    await expect(page.getByLabel('Mật khẩu mới', { exact: true })).toHaveValue('')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.locator('#bao-mat').screenshot({ path: `.artifacts/${role}-password-${width}.png` })
    expect(calls).toBe(3)
  })
}
