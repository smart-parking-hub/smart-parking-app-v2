import { test, expect } from '@playwright/test'

const records = [
  { id: 301, bookingId: 243, gateway: 'PAYOS', transactionCode: '1709290032', orderCode: 1709290032, amount: 22000, type: 'DEPOSIT', status: 'PENDING' },
  { id: 302, bookingId: 242, gateway: 'PAYOS', transactionCode: '1709290031', orderCode: 1709290031, amount: 5876200, type: 'DEPOSIT', status: 'FAILED' },
  { id: 303, bookingId: 241, gateway: 'PAYOS', transactionCode: '1709290030', orderCode: 1709290030, amount: 258240, type: 'DEPOSIT', status: 'SUCCESS' },
  { id: 304, bookingId: 240, gateway: 'PAYOS', transactionCode: 'TX-REVIEW-2026-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', orderCode: 1709290029, amount: 96000, type: 'DEPOSIT', status: 'REQUIRES_REVIEW' },
  { id: 305, bookingId: 239, gateway: 'PAYOS', transactionCode: '1709290028', orderCode: 1709290028, amount: 120000, type: 'REFUND', status: 'REFUNDED' },
  { id: 306, bookingId: 238, gateway: 'CASH', transactionCode: '1709290027', orderCode: 1709290027, amount: 3997760, type: 'FINAL_PAYMENT', status: 'SUCCESS' },
].map(item => ({ ...item, parkingLotId: 12, createdAt: '2026-11-15T13:43:15' }))

for (const width of [390, 768, 1440]) {
  test(`payment history layout and interactions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()) })
    const token = `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 88, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
    await page.addInitScript(token => localStorage.setItem('access_token', token), token)
    const loadedPages: string[] = []
    let paymentWrites = 0
    await page.route('**/api/v1/**', route => {
      const url = new URL(route.request().url())
      let data: unknown = { content: [], totalElements: 0, totalPages: 0 }
      if (url.pathname === '/api/v1/payments') {
        if (route.request().method() !== 'GET') paymentWrites++
        const next = url.searchParams.get('page') || '0'; loadedPages.push(next)
        data = { content: next === '0' ? records : [{ ...records[0], id: 307, transactionCode: 'TX-PAGE-2' }], currentPage: Number(next), totalElements: 21, totalPages: 2 }
      } else if (url.pathname.endsWith('/driver/profile')) data = { fullName: 'Tài xế kiểm thử' }
      else if (url.pathname.endsWith('/unread-count')) data = 0
      return route.fulfill({ json: { data } })
    })
    await page.goto('/payments')
    await expect(page.getByRole('heading', { name: 'Lịch sử thanh toán' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Chi tiết giao dịch 1709290032', exact: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
    await page.screenshot({ path: `.artifacts/payment-history/page-${width}.png`, fullPage: true })

    const search = page.getByRole('searchbox', { name: 'Tìm trong trang hiện tại' })
    await search.fill('not-found')
    await expect(page.getByText('Không có giao dịch phù hợp trong trang này.')).toBeVisible()
    await page.getByRole('button', { name: 'Xóa bộ lọc' }).click()
    const filter = page.getByRole('combobox', { name: 'Trạng thái trong trang hiện tại' })
    await filter.selectOption('REQUIRES_REVIEW')
    await expect(page.getByRole('button', { name: /^Chi tiết giao dịch/ })).toHaveCount(1)
    const trigger = page.getByRole('button', { name: `Chi tiết giao dịch ${records[3].transactionCode}`, exact: true })
    await trigger.click()
    const dialog = page.getByRole('dialog', { name: 'Chi tiết giao dịch' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText(records[3].transactionCode, { exact: true })).toBeVisible()
    await expect(dialog.getByText(/Giao dịch đang cần đối soát/)).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Xem đặt chỗ' })).toHaveAttribute('href', '/bookings')
    expect(await dialog.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(false)
    await page.screenshot({ path: `.artifacts/payment-history/detail-${width}.png` })
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()

    await page.getByRole('button', { name: 'Trang sau' }).click()
    await expect(page.getByText('TX-PAGE-2', { exact: true })).toBeVisible()
    await expect(filter).toHaveValue('')
    await expect(page.getByRole('button', { name: 'Trang sau' })).toBeDisabled()
    await page.getByRole('button', { name: 'Trang trước' }).click()
    await expect(page.getByRole('button', { name: 'Chi tiết giao dịch 1709290032', exact: true })).toBeVisible()
    expect(loadedPages).toContain('1'); expect(paymentWrites).toBe(0); expect(errors).toEqual([])
  })
}

test('large amounts and long codes remain readable on a narrow phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  const token = `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 88, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
  await page.addInitScript(token => localStorage.setItem('access_token', token), token)
  await page.route('**/api/v1/**', route => {
    const path = new URL(route.request().url()).pathname
    const data = path === '/api/v1/payments'
      ? { content: [{ ...records[3], amount: 1234567890123456 }], currentPage: 0, totalElements: 1, totalPages: 1 }
      : path.endsWith('/unread-count') ? 0 : {}
    return route.fulfill({ json: { data } })
  })
  await page.goto('/payments')
  const table = page.getByRole('table')
  await expect(table).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
  expect(await table.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(false)
  await page.getByRole('button', { name: /^Chi tiết giao dịch/ }).click()
  const dialog = page.getByRole('dialog', { name: 'Chi tiết giao dịch' })
  await expect(dialog.getByText(records[3].transactionCode, { exact: true })).toBeVisible()
  expect(await dialog.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(false)
})
