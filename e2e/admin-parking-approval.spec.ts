import { test, expect } from '@playwright/test'

test('admin can reopen the approval modal, confirm and see the updated lot', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const token = `test.${Buffer.from(JSON.stringify({
    role: 'ROLE_ADMIN',
    exp: Math.floor(Date.now() / 1000) + 3600,
  })).toString('base64url')}.test`
  await page.addInitScript((value) => localStorage.setItem('access_token', value), token)

  let approved = false
  let attempts = 0
  await page.route('**/api/v1/admin/parking-lots/35', (route) => route.fulfill({
    json: { data: {
      id: 35,
      name: 'Bãi kiểm thử phê duyệt',
      address: 'Địa chỉ kiểm thử',
      merchantId: 77,
      status: approved ? 'APPROVED' : 'PENDING_APPROVAL',
      totalSlots: 80,
      availableSlots: 80,
      hourlyRate: 30000,
      overnightRate: 140000,
      slots: [],
      images: [],
    } },
  }))
  await page.route('**/api/v1/admin/parking-lots/35/approve', async (route) => {
    expect(route.request().method()).toBe('PUT')
    expect(route.request().postDataJSON()).toEqual({ reason: '' })
    attempts++
    if (attempts === 1) {
      await route.fulfill({ status: 500, json: { message: 'Không thể duyệt, hãy thử lại.' } })
    } else {
      approved = true
      await route.fulfill({ json: { data: null } })
    }
  })

  await page.goto('/admin/parking-lots/35')
  const trigger = page.getByRole('button', { name: 'Duyệt & công bố' })
  const dialog = page.getByRole('dialog')
  await trigger.click()
  await expect(dialog).toBeVisible()
  expect(await dialog.evaluate((element) => element.matches(':modal'))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()

  await trigger.click()
  await dialog.getByRole('button', { name: 'Đóng', exact: true }).click()
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()

  await trigger.click()
  await dialog.getByRole('button', { name: 'Xác nhận quyết định' }).click()
  await expect(dialog.getByRole('alert')).toContainText('Không thể duyệt, hãy thử lại.')
  await expect(page.getByRole('dialog', { name: 'Duyệt bãi thành công' })).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Xác nhận quyết định' }).click()
  const successDialog = page.getByRole('dialog', { name: 'Duyệt bãi thành công' })
  await expect(successDialog).toBeVisible()
  expect(await successDialog.evaluate((element) => element.matches(':modal'))).toBe(true)
  await successDialog.getByRole('button', { name: 'Đã hiểu' }).click()
  await expect(dialog).toHaveCount(0)
  await expect(page.getByText('Đã duyệt', { exact: true })).toBeVisible()
  expect(attempts).toBe(2)
  expect(errors).toEqual([])
})
