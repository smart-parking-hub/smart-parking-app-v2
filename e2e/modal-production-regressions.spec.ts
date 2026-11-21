import { expect, test, type Locator, type Page } from '@playwright/test'

const vehicle = { id: 91, licensePlate: '51C-123.45', vehicleType: 'HEAVY_TRUCK', weightTon: 12.5, brandModel: 'Hyundai', status: 'ACTIVE' }

async function initialize(page: Page, role: 'DRIVER' | 'MERCHANT') {
  const submissions: unknown[] = []
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(token => localStorage.setItem('access_token', token),
    `test.${Buffer.from(JSON.stringify({ role: `ROLE_${role}`, userId: 12, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`)
  await page.route('**/api/v1/**', async route => {
    const request = route.request(), path = new URL(request.url()).pathname
    if (path === '/api/v1/withdrawals' && request.method() === 'POST') {
      submissions.push(request.postDataJSON())
      return route.fulfill({ json: { data: { id: 1 } } })
    }
    expect(request.method()).toBe('GET')
    const content = path === '/api/v1/vehicles' ? [vehicle] : []
    const data = path === '/api/v1/merchant/revenue'
      ? { currentWalletBalance: 34903600, minWithdrawalAmount: 50000, totalNetRevenue: 34903600 }
      : path === '/api/v1/merchant/profile'
        ? { bankName: 'Vietcombank', bankAccountNum: '0123456789', fullName: 'MERCHANT TEST' }
        : path === '/api/v1/users/me' ? { fullName: 'Tài xế kiểm thử' }
        : path.endsWith('/unread-count') ? 0 : { content, currentPage: 0, totalPages: 1, totalElements: content.length }
    return route.fulfill({ json: { data } })
  })
  return { submissions, errors }
}

async function expectReachable(action: Locator) {
  // toBeVisible/click alone can pass after Playwright scrolls a clipped control.
  const visible = await action.evaluate(element => {
    const rect = element.getBoundingClientRect()
    let top = 0, bottom = innerHeight
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      if (/(auto|hidden|scroll|clip)/.test(getComputedStyle(parent).overflowY)) {
        const bounds = parent.getBoundingClientRect()
        top = Math.max(top, bounds.top)
        bottom = Math.min(bottom, bounds.bottom)
      }
    }
    return rect.top >= top - 1 && rect.bottom <= bottom + 1
      && element.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2))
  })
  expect(visible).toBe(true)
}

for (const [width, height] of [[320, 568], [1440, 900]]) {
  test(`vehicle modal keeps keyboard focus and restores its trigger at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    const { errors } = await initialize(page, 'DRIVER')
    await page.goto('/vehicles')
    const trigger = page.getByRole('button', { name: 'Thêm phương tiện', exact: true })
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'Hủy', exact: true }).focus()
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true)
    await expect(dialog).toHaveAccessibleName('Thêm phương tiện')
    await page.keyboard.press('Shift+Tab')
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true)
    const brand = dialog.getByLabel('Nhãn hiệu / Model (không bắt buộc)', { exact: true })
    await brand.fill('Hy')
    await expect(dialog.getByRole('listbox')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog.getByRole('listbox')).toHaveCount(0)
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await trigger.click()
    await dialog.getByRole('button', { name: 'Hủy', exact: true }).click()
    await expect(trigger).toBeFocused()
    const edit = page.getByRole('button', { name: `Sửa xe ${vehicle.licensePlate}`, exact: true })
    await edit.click()
    await expect(dialog).toHaveAccessibleName('Cập nhật phương tiện')
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(edit).toBeFocused()
    expect(errors).toEqual([])
  })
}

for (const [width, height] of [[320, 568], [390, 844], [960, 600], [720, 450]]) {
  test(`withdrawal action remains reachable before and after validation at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    const { submissions, errors } = await initialize(page, 'MERCHANT')
    await page.goto('/merchant/withdrawals')
    await page.getByRole('button', { name: '+ Yêu cầu rút tiền', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Tạo yêu cầu rút tiền', exact: true })
    const submit = dialog.getByRole('button', { name: 'Gửi yêu cầu phê duyệt', exact: true })
    await expect(submit).toBeEnabled()
    await expectReachable(submit)
    await submit.click()
    await expect(dialog.getByRole('alert')).toBeVisible()
    expect(submissions).toHaveLength(0)
    await expectReachable(submit)
    await expectReachable(dialog.getByLabel('Số tiền rút (VND)', { exact: true }))
    await page.screenshot({ path: `.artifacts/qa-retest-deep-20261121/withdrawal-validation-${width}x${height}.png` })
    await dialog.getByLabel('Số tiền rút (VND)', { exact: true }).fill('50000')
    await submit.click()
    await expect(dialog).toHaveCount(0)
    expect(submissions).toEqual([{ amount: 50000, bankName: 'Vietcombank', bankAccountNumber: '0123456789', accountHolderName: 'MERCHANT TEST' }])
    expect(errors).toEqual([])
  })
}
