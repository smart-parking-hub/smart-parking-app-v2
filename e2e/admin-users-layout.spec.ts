import { test, expect } from '@playwright/test'

for (const width of [390, 768, 1440]) {
  test(`admin users layout and navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    const token = `test.${Buffer.from(JSON.stringify({ role: 'ROLE_ADMIN', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
    await page.addInitScript(value => localStorage.setItem('access_token', value), token)
    await page.route('**/api/v1/admin/users?*', route => route.fulfill({ json: { data: {
      content: [{ id: 12, fullName: 'Nguyễn Minh Anh', phone: '0901234567', email: 'minhanh@example.com', role: 'DRIVER', status: 'ACTIVE', createdAt: '2026-11-01T08:00:00Z' }],
      totalPages: 2, totalElements: 21,
    } } }))
    await page.goto('/admin/users')
    await expect(page.getByRole('heading', { name: 'Quản lý người dùng' })).toBeVisible()
    await expect(width < 768
      ? page.getByRole('link', { name: 'Quản trị tài khoản #12' })
      : page.getByRole('cell', { name: /Nguyễn Minh Anh/ })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    if (width < 1024) {
      const trigger = page.getByRole('button', { name: 'Mở menu quản trị' })
      await trigger.click()
      const drawer = page.getByRole('dialog', { name: 'Điều hướng quản trị' })
      await expect(drawer).toBeVisible()
      expect(await drawer.evaluate(el => el.matches(':modal'))).toBe(true)
      await expect(drawer.getByRole('link', { name: 'Người dùng', exact: true })).toHaveAttribute('aria-current', 'page')
      if (width === 390) await page.screenshot({ path: '.artifacts/admin-menu-390.png' })
      await page.keyboard.press('Escape')
      await expect(drawer).toHaveCount(0)
      await expect(trigger).toBeFocused()
      await trigger.click()
      await page.getByRole('dialog').getByRole('link', { name: 'Người dùng', exact: true }).click()
      await expect(page.getByRole('dialog')).toHaveCount(0)
    } else {
      await expect(page.getByRole('navigation', { name: 'Quản trị' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Mở menu quản trị' })).toBeHidden()
    }
    await page.screenshot({ path: `.artifacts/admin-users-${width}.png`, fullPage: true })
    if (width === 390) {
      await page.getByRole('link', { name: 'Quản trị tài khoản #12' }).click()
      await expect(page).toHaveURL(/\/admin\/users\/12$/)
    }
    expect(errors).toEqual([])
  })
}
