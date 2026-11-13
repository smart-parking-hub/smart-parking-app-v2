import { test, expect, type Page } from '@playwright/test'

const endpoint = '/api/v1/notifications'
function token(role = 'ADMIN', account = 1) {
  return `test.${Buffer.from(JSON.stringify({ sub: String(account), role: `ROLE_${role}`, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
}
function record(id: number, read = false) {
  return {
    id, title: `Cập nhật vận hành ${id}`, content: `Nội dung thông báo ${id}.\nThông tin cần theo dõi trong ca trực.`,
    readAt: read ? '2026-11-12T08:00:00' : null as string | null,
    createdAt: '2026-11-12T07:30:00', type: 'SYSTEM',
  }
}
async function authenticate(page: Page, role = 'ADMIN') {
  await page.addInitScript(value => localStorage.setItem('access_token', value), token(role))
}
async function notificationsApi(page: Page, rows = [record(1), record(2, true)]) {
  const writes: string[] = []
  const reads: number[] = []
  await page.route('**/api/v1/notifications**', async route => {
    const request = route.request()
    const url = new URL(request.url())
    if (request.method() === 'PUT') {
      writes.push(url.pathname)
      const id = url.pathname.match(/\/(\d+)\/read$/)?.[1]
      rows = rows.map(row => !id || row.id === Number(id) ? { ...row, readAt: '2026-11-12T08:00:00' } : row)
      await route.fulfill({ json: { data: null, message: 'Đã đọc' } })
    } else if (url.pathname.endsWith('/unread-count')) {
      await route.fulfill({ json: { data: rows.filter(row => row.readAt === null).length } })
    } else {
      const pageNumber = Number(url.searchParams.get('page'))
      const size = Number(url.searchParams.get('size'))
      expect(size).toBe(20)
      reads.push(pageNumber)
      await route.fulfill({ json: { data: {
        content: rows.slice(pageNumber * size, (pageNumber + 1) * size),
        currentPage: pageNumber, totalElements: rows.length, totalPages: Math.ceil(rows.length / size),
      } } })
    }
  })
  return { writes, reads }
}

for (const width of [390, 1440]) {
  test(`SCR-052: responsive feed, keyboard read and mark-all at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()) })
    await authenticate(page)
    const api = await notificationsApi(page, [record(1), record(2), record(3, true)])
    await page.goto('/admin/notifications')
    await expect(page.getByRole('heading', { name: 'Trung tâm thông báo quản trị' })).toBeVisible()
    await expect(page.getByText('2 thông báo chưa đọc')).toBeVisible()
    await page.screenshot({ path: `.artifacts/admin-notifications-unread-${width}.png`, fullPage: true })
    const row = page.getByRole('article', { name: 'Cập nhật vận hành 1' })
    const read = row.getByRole('button', { name: 'Đánh dấu đã đọc: Cập nhật vận hành 1' })
    await expect(read).toBeVisible()
    expect(await read.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(48)
    await read.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByText('1 thông báo chưa đọc')).toBeVisible()
    await expect(row.getByRole('button')).toHaveCount(0)
    await page.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' }).click()
    await expect(page.getByText('0 thông báo chưa đọc')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })).toBeDisabled()
    expect(api.writes).toEqual([`${endpoint}/1/read`, `${endpoint}/read-all`])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `.artifacts/admin-notifications-${width}.png`, fullPage: true })
    if (width === 390) {
      await page.getByRole('button', { name: 'Mở menu quản trị' }).click()
      await expect(page.getByRole('dialog').getByRole('link', { name: 'Thông báo', exact: true })).toHaveAttribute('aria-current', 'page')
      await page.keyboard.press('Escape')
    } else {
      await expect(page.getByRole('navigation', { name: 'Quản trị' }).getByRole('link', { name: 'Thông báo', exact: true })).toHaveAttribute('aria-current', 'page')
    }
    expect(errors).toEqual([])
  })
}

test('SCR-052: more than 100 records and account-wide unread count across pages', async ({ page }) => {
  await authenticate(page)
  const api = await notificationsApi(page, Array.from({ length: 101 }, (_, index) => record(index + 1, index !== 100)))
  await page.goto('/admin/notifications')
  await expect(page.getByRole('article', { name: 'Cập nhật vận hành 1', exact: true })).toBeVisible()
  await expect(page.getByText('1 thông báo chưa đọc')).toBeVisible()
  await page.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' }).click()
  await expect(page.getByText('0 thông báo chưa đọc')).toBeVisible()
  for (let pageNumber = 1; pageNumber <= 5; pageNumber++) {
    await page.getByRole('button', { name: 'Trang sau' }).click()
    await expect(page.getByRole('article', { name: `Cập nhật vận hành ${pageNumber * 20 + 1}`, exact: true })).toBeVisible()
  }
  await expect(page.getByRole('button', { name: 'Trang sau' })).toBeDisabled()
  await expect(page.getByRole('article', { name: 'Cập nhật vận hành 101' }).getByRole('button')).toHaveCount(0)
  expect(api.reads).toContain(5)
})

test('SCR-052: successful empty state', async ({ page }) => {
  await authenticate(page)
  await notificationsApi(page, [])
  await page.goto('/admin/notifications')
  await expect(page.getByText('Bạn chưa có thông báo')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })).toBeDisabled()
  await page.screenshot({ path: '.artifacts/admin-notifications-empty.png', fullPage: true })
})

test('SCR-052: pending write blocks duplicates and captures the loading state', async ({ page }) => {
  await authenticate(page)
  const api = await notificationsApi(page)
  let release!: () => void
  const pending = new Promise<void>(resolve => { release = resolve })
  let attempts = 0
  await page.route('**/api/v1/notifications/1/read', async route => {
    attempts++
    await pending
    await route.fallback()
  })
  await page.goto('/admin/notifications')
  const read = page.getByRole('button', { name: 'Đánh dấu đã đọc: Cập nhật vận hành 1' })
  await read.click()
  await expect(read).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })).toBeDisabled()
  await page.screenshot({ path: '.artifacts/admin-notifications-pending.png', fullPage: true })
  await read.evaluate(element => (element as HTMLButtonElement).click())
  expect(attempts).toBe(1)
  release()
  await expect(page.getByText('0 thông báo chưa đọc')).toBeVisible()
  expect(api.writes).toHaveLength(1)
})

test('SCR-052: switching Admin accounts clears the previous feed before the new response', async ({ page }) => {
  await authenticate(page)
  await notificationsApi(page)
  await page.goto('/admin/notifications')
  await expect(page.getByRole('article', { name: 'Cập nhật vận hành 1' })).toBeVisible()
  let release!: () => void
  const pending = new Promise<void>(resolve => { release = resolve })
  await page.route('**/api/v1/notifications**', async route => {
    await pending
    const count = route.request().url().includes('unread-count')
    await route.fulfill({ json: { data: count ? 0 : { content: [record(999, true)], currentPage: 0, totalPages: 1, totalElements: 1 } } })
  })
  await page.evaluate(value => {
    localStorage.setItem('access_token', value)
    window.dispatchEvent(new Event('smartparking:session'))
  }, token('ADMIN', 2))
  await expect(page.getByRole('article', { name: 'Cập nhật vận hành 1' })).toHaveCount(0)
  await expect(page.getByRole('status', { name: 'Đang tải thông báo' })).toBeVisible()
  release()
  await expect(page.getByRole('article', { name: 'Cập nhật vận hành 999' })).toBeVisible()
})

test('SCR-052: 401 responses stay visible without automatic retry or fake data', async ({ page }) => {
  await authenticate(page)
  let attempts = 0
  await page.route('**/api/v1/notifications**', route => {
    attempts++
    return route.fulfill({ status: 401, json: { message: 'Phiên đăng nhập không hợp lệ' } })
  })
  await page.goto('/admin/notifications')
  await expect(page.getByText('Không tải được thông báo', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })).toBeDisabled()
  expect(attempts).toBe(2)
})

test('SCR-052: GET failure, count failure and retry without fake empty or zero', async ({ page }) => {
  await authenticate(page)
  const api = await notificationsApi(page)
  let failing = true
  await page.route('**/api/v1/notifications**', async route => {
    if (failing) await route.fulfill({ status: 503, json: { message: 'Dịch vụ tạm gián đoạn' } })
    else await route.fallback()
  })
  await page.goto('/admin/notifications')
  await expect(page.getByText('Không tải được thông báo', { exact: true })).toBeVisible()
  await expect(page.getByText('Không tải được số thông báo chưa đọc', { exact: true })).toBeVisible()
  await expect(page.getByText('Bạn chưa có thông báo')).toHaveCount(0)
  await expect(page.getByText('0 thông báo chưa đọc')).toHaveCount(0)
  await page.screenshot({ path: '.artifacts/admin-notifications-error.png', fullPage: true })
  failing = false
  await page.getByRole('button', { name: 'Thử lại danh sách' }).click()
  await page.getByRole('button', { name: 'Thử lại số chưa đọc' }).click()
  await expect(page.getByRole('article', { name: 'Cập nhật vận hành 1' })).toBeVisible()
  expect(api.writes).toHaveLength(0)
})

test('SCR-052: denied writes preserve unread state and allow retry', async ({ page }) => {
  await authenticate(page)
  await notificationsApi(page)
  let forbidden = true
  await page.route('**/api/v1/notifications/1/read', async route => {
    if (forbidden) await route.fulfill({ status: 403, json: { message: 'Không có quyền cập nhật thông báo' } })
    else await route.fallback()
  })
  await page.goto('/admin/notifications')
  const read = page.getByRole('button', { name: 'Đánh dấu đã đọc: Cập nhật vận hành 1' })
  await read.click()
  await expect(page.getByText(/Không có quyền cập nhật thông báo/)).toBeVisible()
  await expect(page.getByText('1 thông báo chưa đọc')).toBeVisible()
  forbidden = false
  await read.click()
  await expect(page.getByText('0 thông báo chưa đọc')).toBeVisible()
})

test('SCR-052: guest deep link retains login next path', async ({ page }) => {
  await page.goto('/admin/notifications')
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Fnotifications$/)
})

for (const role of ['MERCHANT', 'DRIVER']) {
  test(`SCR-052: ${role} cannot enter Admin notifications`, async ({ page }) => {
    await authenticate(page, role)
    let notificationCalls = 0
    await page.route('**/api/v1/notifications**', route => {
      notificationCalls++
      return route.fulfill({ json: { data: [] } })
    })
    await page.goto('/admin/notifications')
    await expect(page).toHaveURL(/\/403$/)
    expect(notificationCalls).toBe(0)
  })
}

test('SCR-052: Merchant portal retains its existing table and PUT actions', async ({ page }) => {
  await authenticate(page, 'MERCHANT')
  const api = await notificationsApi(page)
  await page.route('**/api/v1/users/me', route => route.fulfill({ json: { data: { id: 2, fullName: 'Tài khoản kiểm thử', role: 'MERCHANT' } } }))
  await page.route('**/api/v1/merchant/profile', route => route.fulfill({ json: { data: { id: 2, fullName: 'Tài khoản kiểm thử' } } }))
  await page.goto('/merchant/notifications')
  await expect(page.getByRole('heading', { name: 'Trung tâm thông báo', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Đánh dấu đã đọc', exact: true }).click()
  await expect.poll(() => api.writes.length).toBe(1)
  expect(api.writes[0]).toBe(`${endpoint}/1/read`)
})
