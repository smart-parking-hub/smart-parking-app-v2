import { expect, test, type Page } from '@playwright/test'

const vehicle = { id: 91, licensePlate: '51C-123.45', vehicleType: 'HEAVY_TRUCK', weightTon: 12.5, brandModel: 'Hyundai Xcient', status: 'ACTIVE' }
const pageOf = (content: unknown[]) => ({ content, currentPage: 0, totalPages: 1, totalElements: content.length })

async function initialize(page: Page) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(token => localStorage.setItem('access_token', token),
    `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 12, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`)
  await page.route('**/api/v1/**', async route => {
    expect(route.request().method()).toBe('GET')
    const path = new URL(route.request().url()).pathname
    const data = path === '/api/v1/vehicles' ? pageOf([vehicle])
      : path === '/api/v1/users/me' ? { fullName: 'Tài xế kiểm thử' }
      : path.endsWith('/unread-count') ? 0 : pageOf([])
    await route.fulfill({ json: { data } })
  })
  return errors
}

async function expectActionsReachable(page: Page) {
  const dialog = page.getByRole('dialog')
  const save = dialog.getByRole('button', { name: 'Lưu phương tiện', exact: true })
  const cancel = dialog.getByRole('button', { name: 'Hủy', exact: true })
  // Measure before clicking: Playwright would otherwise scroll an obscured action into view.
  for (const action of [save, cancel]) {
    const metrics = await action.evaluate(button => {
      const box = button.getBoundingClientRect()
      const panel = button.closest('[role="dialog"]')!.firstElementChild!.getBoundingClientRect()
      return {
        visible: box.top >= panel.top && box.bottom <= panel.bottom && box.top >= 0 && box.bottom <= innerHeight,
        receivesPointer: button.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)),
      }
    })
    expect(metrics).toEqual({ visible: true, receivesPointer: true })
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
}

for (const [width, height] of [[320, 568], [390, 844], [1366, 640], [1440, 900]]) {
  for (const mode of ['create', 'edit'] as const) {
    test(`vehicle ${mode} actions remain reachable at ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      const errors = await initialize(page)
      let writes = 0
      let saved = false
      await page.route('**/api/v1/vehicles{,/91}{,?*}', async route => {
        const request = route.request()
        if (request.method() === 'GET') {
          await route.fulfill({ json: { data: pageOf([{ ...vehicle, ...(saved ? { weightTon: 15 } : {}) }]) } })
          return
        }
        expect(request.method()).toBe(mode === 'create' ? 'POST' : 'PUT')
        expect(new URL(request.url()).pathname).toBe(mode === 'create' ? '/api/v1/vehicles' : '/api/v1/vehicles/91')
        expect(request.postDataJSON()).toEqual({ licensePlate: vehicle.licensePlate, vehicleType: vehicle.vehicleType, weightTon: 15, brandModel: vehicle.brandModel })
        writes++
        if (writes === 1) {
          await route.fulfill({ status: 409, json: { code: 'ERR_409', message: 'Không thể lưu phương tiện, vui lòng thử lại.' } })
        } else {
          saved = true
          await route.fulfill({ json: { data: { ...vehicle, weightTon: 15 } } })
        }
      })
      await page.goto('/vehicles')
      await page.getByRole('button', { name: mode === 'create' ? 'Thêm phương tiện' : `Sửa xe ${vehicle.licensePlate}`, exact: true }).click()
      const dialog = page.getByRole('dialog')
      await expectActionsReachable(page)
      await expect(dialog.getByLabel('Loại xe', { exact: true })).toHaveCSS('appearance', 'none')
      if (mode === 'create') {
        await dialog.getByRole('button', { name: 'Lưu phương tiện', exact: true }).click()
        await expect(dialog.getByText('Chọn loại xe.', { exact: true })).toBeVisible()
        expect(writes).toBe(0)
        await expectActionsReachable(page)
        await dialog.getByLabel('Biển số xe', { exact: true }).fill(vehicle.licensePlate)
        await dialog.getByLabel('Loại xe', { exact: true }).selectOption(vehicle.vehicleType)
        await dialog.getByLabel('Nhãn hiệu / Model (không bắt buộc)', { exact: true }).fill(vehicle.brandModel)
      }
      await dialog.getByLabel('Trọng tải (tấn)', { exact: true }).fill('15')
      await dialog.getByRole('button', { name: 'Lưu phương tiện', exact: true }).click()
      await expect(dialog.getByRole('alert')).toContainText('Không thể lưu phương tiện')
      await expect(dialog.getByLabel('Biển số xe', { exact: true })).toHaveValue(vehicle.licensePlate)
      await expect(dialog.getByLabel('Trọng tải (tấn)', { exact: true })).toHaveValue('15')
      await expectActionsReachable(page)
      await page.screenshot({ path: `.artifacts/qa-reevaluation/vehicle-${mode}-${width}x${height}.png` })
      await dialog.getByRole('button', { name: 'Lưu phương tiện', exact: true }).click()
      await expect(dialog).toHaveCount(0)
      await expect(page.getByText('Đã lưu phương tiện.', { exact: true })).toBeVisible()
      expect(writes).toBe(2)
      expect(errors).toEqual([])
    })
  }
}

for (const width of [390, 1440]) {
  test(`parking direct load, reload and account click at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors = await initialize(page)
    for (const load of [() => page.goto('/parking'), () => page.reload()]) {
      const response = await load()
      expect(response?.status()).toBe(200)
      await expect(page.getByTestId('parking-lots-container')).toBeVisible()
      await expect(page.getByText('Đang tải giao diện…', { exact: true })).toHaveCount(0)
      const account = page.getByRole('button', { name: 'Menu tài khoản', exact: true })
      await account.click()
      await expect(account).toHaveAttribute('aria-expanded', 'true')
      await expect(page.getByRole('link', { name: 'Hồ sơ cá nhân', exact: true })).toBeVisible()
      await page.getByRole('button', { name: 'Đóng menu tài khoản', exact: true }).click({ position: { x: 1, y: 1 } })
      await expect(account).toHaveAttribute('aria-expanded', 'false')
    }
    expect(errors).toEqual([])
  })
}
