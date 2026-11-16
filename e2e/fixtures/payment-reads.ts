import { expect, type Page } from '@playwright/test'

/** Read-only shell data for tests that intentionally run without a backend. */
export async function mockShellReads(page: Page) {
  await page.route('**/api/v1/users/me', async route => {
    expect(route.request().method()).toBe('GET')
    await route.fulfill({ json: { data: { fullName: 'Tài khoản kiểm thử' } } })
  })
  await page.route('**/api/v1/notifications/unread-count', async route => {
    expect(route.request().method()).toBe('GET')
    await route.fulfill({ json: { data: 0 } })
  })
}

/** PayOS scenarios have no wallet funding or existing wallet attempt. */
export async function mockEmptyDriverWallet(page: Page, bookingId: number) {
  await mockShellReads(page)
  await page.route('**/api/v1/driver/wallet', async route => {
    expect(route.request().method()).toBe('GET')
    await route.fulfill({ json: { data: { availableAmount: 0, heldAmount: 0, currency: 'VND', enabled: true } } })
  })
  await page.route(/\/api\/v1\/payments\/wallet(?:\?.*)?$/, async route => {
    expect(route.request().method()).toBe('GET')
    expect(new URL(route.request().url()).searchParams.get('bookingId')).toBe(String(bookingId))
    // ApiResponse NON_NULL omits data when no attempt exists. This never fabricates SUCCESS.
    await route.fulfill({ json: { success: true } })
  })
}
