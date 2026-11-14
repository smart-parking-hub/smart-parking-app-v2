import { expect, test } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`admin transfer summary shows full account and bank at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const token = `test.${Buffer.from(JSON.stringify({ sub: '1', role: 'ROLE_ADMIN', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
    await page.addInitScript(value => localStorage.setItem('access_token', value), token)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()) })
    const submissions: unknown[] = []
    await page.route('**/api/v1/**', async route => {
      const path = new URL(route.request().url()).pathname
      if (route.request().method() === 'PUT') {
        submissions.push({ path, body: route.request().postDataJSON() })
        return route.fulfill({ json: { data: {} } })
      }
      const data = path === '/api/v1/admin/withdrawals'
        ? { content: [{ id: 30, amount: 100000, merchantName: 'Lê Văn Test', bankName: 'Vietcombank', bankAccountNumber: '00001234567', maskedBankAccount: '****4567', accountHolderName: 'LE VAN TEST', status: 'PENDING', requestedAt: '2026-11-15T08:00:00' }], totalPages: 1, totalElements: 1 }
        : path.endsWith('/unread-count') ? 0 : { content: [], totalPages: 0, fullName: 'Admin kiểm thử' }
      await route.fulfill({ json: { data } })
    })
    await page.route('https://api.vietqr.io/v2/banks', route => route.fulfill({ json: { code: '00', data: [{ name: 'Ngân hàng TMCP Ngoại thương Việt Nam', shortName: 'Vietcombank', code: 'VCB', bin: '970436', logo: 'https://api.vietqr.io/img/VCB.png' }] } }))
    await page.goto('/admin/withdrawals')
    await page.getByRole('button', { name: 'Duyệt chi', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Duyệt chi', exact: true })
    await expect(dialog.getByText('00001234567', { exact: true })).toBeVisible()
    await expect(dialog.getByText('Vietcombank', { exact: true })).toBeVisible()
    await expect(dialog.getByText('LE VAN TEST', { exact: true })).toBeVisible()
    await expect(dialog.getByText('100.000 ₫', { exact: true })).toBeVisible()
    await expect(dialog.locator('img')).toHaveAttribute('src', 'https://api.vietqr.io/img/VCB.png')
    await expect.poll(() => dialog.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
    await page.screenshot({ path: `.artifacts/admin-withdrawal-summary-${width}.png`, fullPage: true })
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Duyệt chi', exact: true })).toBeFocused()

    await page.getByRole('button', { name: 'Từ chối', exact: true }).click()
    const rejection = page.getByRole('dialog', { name: 'Từ chối', exact: true })
    await rejection.getByRole('button', { name: 'Xác nhận quyết định' }).click()
    await expect(rejection.getByText('Nhập lý do quyết định.')).toBeVisible()
    expect(submissions).toHaveLength(0)
    await rejection.getByRole('textbox').fill('Thông tin thụ hưởng cần đối soát')
    await rejection.getByRole('button', { name: 'Xác nhận quyết định' }).click()
    await expect(rejection).not.toBeVisible()
    expect(submissions).toEqual([{ path: '/api/v1/admin/withdrawals/30/reject', body: { reason: 'Thông tin thụ hưởng cần đối soát' } }])
    expect(errors).toEqual([])
  })
}
