import { test, expect, type Page } from '@playwright/test'

const endpoint = '/api/v1/admin/transactions'
const transaction = {
  id: 51, transactionCode: 'TX-51', bookingId: 12, bookingCode: 'BK-12',
  payerUserId: 3, payerPhone: 'USER#3', merchantId: 4, merchantName: 'Merchant #4',
  gateway: 'PAYOS', amount: 120000, type: 'DEPOSIT', status: 'PENDING',
  createdAt: '2026-11-14T08:00:00', updatedAt: null,
}

async function authenticate(page: Page, role = 'ADMIN') {
  const token = `test.${Buffer.from(JSON.stringify({ sub: '1', role: `ROLE_${role}`, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
  await page.addInitScript(value => localStorage.setItem('access_token', value), token)
}

async function shellApi(page: Page) {
  await page.route('**/api/v1/**', route => route.fulfill({ json: { data: {
    id: 1, fullName: 'Quản trị viên kiểm thử', content: [], totalPages: 0, totalElements: 0,
  } } }))
}

for (const width of [390, 1440]) {
  test(`PAY-05: server paging/sorting, fresh detail and keyboard at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    const reads: URL[] = []
    const writes: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()) })
    await authenticate(page)
    await shellApi(page)
    await page.route(`**${endpoint}**`, async route => {
      const url = new URL(route.request().url())
      reads.push(url)
      if (route.request().method() !== 'GET') writes.push(route.request().method())
      if (url.pathname.endsWith('/51')) {
        await route.fulfill({ json: { data: { ...transaction, status: 'SUCCESS', amount: 125000 } } })
      } else {
        expect(url.searchParams.get('size')).toBe('20')
        expect(url.searchParams.getAll('sort')).toHaveLength(2)
        expect(url.searchParams.getAll('sort')[1]).toBe('id,desc')
        await route.fulfill({ json: { data: {
          content: [transaction], currentPage: Number(url.searchParams.get('page')), totalPages: 2, totalElements: 21,
        } } })
      }
    })
    await page.goto('/admin/transactions')
    await expect(page.getByRole('heading', { name: 'Giám sát giao dịch', exact: true })).toBeVisible()
    await expect(page.getByText('Trang 1 / 2')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Trước', exact: true })).toBeDisabled()
    expect(reads[0].searchParams.getAll('sort')).toEqual(['createdAt,desc', 'id,desc'])
    await page.getByRole('button', { name: 'Sau', exact: true }).click()
    await expect(page.getByText('Trang 2 / 2')).toBeVisible()
    expect(reads.at(-1)?.searchParams.get('page')).toBe('1')
    await page.getByLabel('Sắp xếp giao dịch').selectOption('amount,asc')
    await expect(page.getByText('Trang 1 / 2')).toBeVisible()
    expect(reads.at(-1)?.searchParams.get('page')).toBe('0')
    expect(reads.at(-1)?.searchParams.getAll('sort')).toEqual(['amount,asc', 'id,desc'])
    const count = reads.length
    await page.getByRole('button', { name: 'Làm mới danh sách' }).click()
    await expect.poll(() => reads.length).toBeGreaterThan(count)
    await expect(page.getByRole('button', { name: 'Làm mới danh sách' })).toBeEnabled()
    const action = page.getByRole('button', { name: 'Xem chi tiết giao dịch TX-51', exact: true })
    await action.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: 'Chi tiết giao dịch', exact: true })
    await expect(dialog.getByText('125.000 ₫')).toBeVisible()
    await expect(dialog.getByText('Thành công')).toBeVisible()
    await expect(dialog.getByText('#3', { exact: true })).toBeVisible()
    await expect(dialog.getByText('USER#3')).toHaveCount(0)
    await page.screenshot({ path: `.artifacts/admin-transactions-detail-${width}.png`, fullPage: true })
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(action).toBeFocused()
    await page.screenshot({ path: `.artifacts/admin-transactions-${width}.png`, fullPage: true })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(writes).toEqual([])
    expect(errors).toEqual([])
  })
}

test('PAY-05: empty list and recoverable detail 404', async ({ page }) => {
  await authenticate(page)
  await shellApi(page)
  let empty = true
  let missing = true
  await page.route(`**${endpoint}**`, route => {
    if (new URL(route.request().url()).pathname.endsWith('/51')) {
      return missing
        ? route.fulfill({ status: 404, json: { message: 'Giao dịch không tồn tại' } })
        : route.fulfill({ json: { data: transaction } })
    }
    return route.fulfill({ json: { data: {
      content: empty ? [] : [transaction], currentPage: 0, totalPages: empty ? 0 : 1, totalElements: empty ? 0 : 1,
    } } })
  })
  await page.goto('/admin/transactions')
  await expect(page.getByText('Chưa có giao dịch thanh toán.')).toBeVisible()
  empty = false
  await page.getByRole('button', { name: 'Làm mới danh sách' }).click()
  await page.getByRole('button', { name: 'Xem chi tiết giao dịch TX-51' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('Giao dịch không tồn tại', { exact: true })).toBeVisible()
  missing = false
  await dialog.getByRole('button', { name: 'Thử lại' }).click()
  await expect(dialog.getByText('120.000 ₫')).toBeVisible()
})

for (const role of ['DRIVER', 'MERCHANT']) {
  test(`PAY-05: ${role} is denied before loading transactions`, async ({ page }) => {
    await authenticate(page, role)
    await shellApi(page)
    let reads = 0
    await page.route(`**${endpoint}**`, route => { reads++; return route.fulfill({ json: { data: null } }) })
    await page.goto('/admin/transactions')
    await expect(page).toHaveURL(/\/403$/)
    expect(reads).toBe(0)
  })
}
