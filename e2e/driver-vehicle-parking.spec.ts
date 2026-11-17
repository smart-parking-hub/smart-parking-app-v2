import { expect, test } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`vehicle current parking and status at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
      if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text())
    })
    await page.addInitScript(token => localStorage.setItem('access_token', token),
      `test.${Buffer.from(JSON.stringify({ role: 'ROLE_DRIVER', userId: 12, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`)
    await page.route('**/api/v1/**', async route => {
      const url = new URL(route.request().url())
      const vehicle = { id: 91, licensePlate: '51C-123.45', vehicleType: 'HEAVY_TRUCK', weightTon: 12.5, brandModel: 'Hyundai Xcient', status: 'ACTIVE' }
      const booking = { id: 700, vehicleId: 91, parkingLotId: 12, parkingLotName: 'Bãi Sóng Thần', parkingLotAddress: 'Dĩ An, Bình Dương', physicalSlotCode: 'A-07', status: 'OVERTIME', checkOutTime: null }
      const content = url.pathname === '/api/v1/vehicles'
        ? [vehicle, { ...vehicle, id: 92, licensePlate: '51D-678.90', status: 'INACTIVE' }]
        : url.pathname === '/api/v1/bookings' && url.searchParams.get('status') === 'OVERTIME' ? [booking] : []
      const data = url.pathname.endsWith('/unread-count') ? 0 : { content, currentPage: 0, totalPages: 1, totalElements: content.length }
      await route.fulfill({ json: { data } })
    })
    await page.goto('/vehicles')
    await expect(page.getByRole('columnheader', { name: 'Bãi hiện tại' })).toBeAttached()
    const parkedRow = page.getByRole('row').filter({ hasText: '51C-123.45' })
    await expect(parkedRow.getByText('Bãi Sóng Thần', { exact: true })).toBeAttached()
    await expect(parkedRow.getByText('Đỗ quá giờ', { exact: true })).toBeAttached()
    await expect(parkedRow.getByText('Vị trí: A-07')).toBeAttached()
    await expect(page.getByRole('row').filter({ hasText: '51D-678.90' }).getByText('Không đỗ tại bãi')).toBeAttached()
    await page.screenshot({ path: `.artifacts/playwright/vehicle-current-parking-${width}.png`, fullPage: true })
    const tableScroll = page.getByRole('table').locator('..')
    if (width === 390) {
      await tableScroll.evaluate(element => { element.scrollLeft = 500 })
      await expect(parkedRow.getByText('Bãi Sóng Thần', { exact: true })).toBeVisible()
      await page.screenshot({ path: `.artifacts/playwright/vehicle-current-parking-mobile-scrolled.png`, fullPage: true })
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
    await page.getByLabel('Tìm trong trang hiện tại').fill('678.90')
    await expect(parkedRow).toHaveCount(0)
    await expect(page.getByText('Không đỗ tại bãi')).toBeAttached()
    expect(errors).toEqual([])
  })
}
