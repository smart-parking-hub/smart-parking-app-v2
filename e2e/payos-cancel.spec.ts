import { expect, test, type Page } from '@playwright/test'

// Uses the production bootstrap/router. Only remote HTTP boundaries are mocked.
const token = `test.${Buffer.from(JSON.stringify({role: 'ROLE_DRIVER', userId: 7, sub: 'driver-test', exp: Math.floor(Date.now()/1000)+3600})).toString('base64url')}.test`
const initialBooking = {
  id: 239, bookingCode: 'BK-REAL-239-LONG-CODE-TEST', parkingLotId: 3, merchantId: 9,
  parkingLotName: 'Bãi kiểm thử luồng PayOS', parkingLotAddress: '123 Đường kiểm thử',
  vehicleId: 1, vehiclePlate: '71C-1234', status: 'PENDING_PAYMENT',
  advanceDeposit: 4000, totalAmount: 20000, hourlyRate: 10000,
  expectedCheckInTime: new Date(Date.now()+1800000).toISOString(),
  expectedCheckOutTime: new Date(Date.now()+9000000).toISOString(),
  expiresAt: new Date(Date.now()+600000).toISOString(),
}
async function prepare(page: Page) {
  await page.addInitScript(token => localStorage.setItem('access_token', token), token)
  await page.route('**/api/v1/**', route => route.fulfill({json: {data: {content: [], totalPages: 1, totalElements: 0}}}))
  await page.route('**/api/v1/driver/profile', route => route.fulfill({json: {data: {id: 7, fullName: 'Tài xế kiểm thử', role: 'DRIVER', phone: '0900000000'}}}))
}

for (const width of [390, 768, 1440]) {
  for (const final of [false, true]) {
    test(`actual router: cancel and retry ${final ? 'final' : 'deposit'} at ${width}px`, async ({page}, testInfo) => {
      await page.setViewportSize({width, height: 900})
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      await prepare(page)
      const booking = {...initialBooking, status: final ? 'AWAITING_FINAL_PAYMENT' : 'PENDING_PAYMENT', ...(final ? {expiresAt: '2020-01-01T00:00:00'} : {})}
      let creates = 0
      let cancels = 0
      const origin = testInfo.project.use.baseURL!
      await page.route('**/api/v1/bookings**', route => {
        if (route.request().method() !== 'GET') cancels++
        return route.fulfill({json: {data: route.request().url().includes('/239') ? booking : {content: [booking], totalPages: 1, totalElements: 1, number: 0}}})
      })
      await page.route('**/api/v1/payments', route => {
        creates++
        expect(route.request().postDataJSON()).toEqual({bookingId: 239, paymentType: final ? 'FINAL_PAYMENT' : 'DEPOSIT'})
        return route.fulfill({json: {data: `https://pay.payos.vn/web/real-attempt-${creates}`}})
      })
      await page.route('**/api/v1/payments/sync', route => route.fulfill({json: {data: {bookingId: 239, orderCode: 2391, type: final ? 'FINAL_PAYMENT' : 'DEPOSIT', status: 'FAILED', canRetry: true, canResume: false}}}))
      await page.route('https://pay.payos.vn/**', route => route.fulfill({contentType: 'text/html; charset=utf-8', body: `<html lang="vi"><body><h1>PayOS kiểm thử</h1><a href="${origin}/payment/cancel?bookingId=239&orderCode=2391&cancel=true&status=CANCELLED">Hủy thanh toán</a></body></html>`}))
      await page.goto('/bookings?bookingId=239')
      await page.getByRole('button', {name: final ? 'Thanh toán phần còn lại qua PayOS' : /Thanh toán cọc.*qua PayOS/}).click()
      await page.getByRole('button', {name: 'Mở PayOS để thanh toán'}).click()
      await expect(page).toHaveURL('https://pay.payos.vn/web/real-attempt-2')
      await page.getByRole('link', {name: 'Hủy thanh toán', exact: true}).click()
      const result = page.getByRole('region', {name: 'Kết quả thanh toán', exact: true})
      await expect(result.getByRole('heading', {name: final ? 'Chưa hoàn tất thanh toán phần còn lại' : 'Thanh toán chưa hoàn tất'})).toBeVisible()
      await expect(result.getByText(booking.bookingCode, {exact: true})).toBeVisible()
      await expect(page.locator('iframe')).toHaveCount(0)
      await expect(result.getByText(/C-114|PAYOS-CAN|chưa bị trừ tiền|SANDBOX/)).toHaveCount(0)
      await expect(result.getByText('Hạn thanh toán cọc:', {exact: false})).toHaveCount(final ? 0 : 1)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.screenshot({fullPage: true, path: testInfo.outputPath(`cancel-${final ? 'final' : 'deposit'}-${width}.png`)})
      await page.reload()
      await result.getByRole('button', {name: /Thanh toán lại/}).click()
      await expect(page).toHaveURL('https://pay.payos.vn/web/real-attempt-3')
      expect(creates).toBe(3)
      await page.getByRole('link', {name: 'Hủy thanh toán', exact: true}).click()
      await result.getByRole('link', {name: 'Về vé của tôi'}).click()
      await expect(page).toHaveURL(/bookings\?bookingId=239/)
      await expect(page.getByRole('heading', {name: /Vé vừa xem/})).toBeVisible()
      await expect(page.getByText(booking.bookingCode, {exact: true})).toBeVisible()
      expect(cancels).toBe(0)
      expect(errors).toEqual([])
    })
  }
}

test('browser Back from PayOS refreshes the ticket without automatically reopening the old checkout', async ({page}) => {
  await prepare(page)
  let status = 'PENDING_PAYMENT'
  let creates = 0
  await page.route('**/api/v1/bookings**', route => route.fulfill({json: {data: route.request().url().includes('/239')
    ? {...initialBooking, status} : {content: [{...initialBooking, status}], totalPages: 1, totalElements: 1}}}))
  await page.route('**/api/v1/payments', route => { creates++; return route.fulfill({json: {data: 'https://pay.payos.vn/web/back-test'}}) })
  await page.route('**/api/v1/payments/sync', route => route.fulfill({json: {data: {status: 'SUCCESS'}}}))
  await page.route('https://pay.payos.vn/**', route => route.fulfill({contentType: 'text/html', body: '<h1>PayOS kiểm thử</h1>'}))
  await page.goto('/bookings?bookingId=239')
  await page.getByRole('button', {name: /Thanh toán cọc.*qua PayOS/}).click()
  await page.getByRole('button', {name: 'Mở PayOS để thanh toán'}).click()
  await expect(page).toHaveURL('https://pay.payos.vn/web/back-test')
  status = 'PENDING_CHECKIN'
  await page.goBack()
  await expect(page).toHaveURL(/bookings\?bookingId=239/)
  await expect(page.getByTestId('checkin-qr-container')).toBeVisible()
  await expect(page.getByRole('button', {name: 'Mở PayOS để thanh toán'})).toHaveCount(0)
  expect(creates).toBe(2)
})

test('expired session preserves the payment return destination for login', async ({page}) => {
  await prepare(page)
  await page.addInitScript(() => localStorage.removeItem('access_token'))
  let syncs = 0
  await page.route('**/api/v1/payments/sync', route => { syncs++; return route.fulfill({json: {data: {status: 'PENDING'}}}) })
  await page.goto('/payment/cancel?bookingId=239&orderCode=2391')
  await expect(page).toHaveURL(/\/login\?next=/)
  expect(new URL(page.url()).searchParams.get('next')).toBe('/payment/cancel?bookingId=239&orderCode=2391')
  expect(syncs).toBe(0)
})

for (const path of ['/payment/cancel', '/payment/return', '/payment/success', '/driver/payment/cancel', '/dashboard/payment/cancel']) {
  test(`actual route alias ${path} resolves server success even with cancel flags`, async ({page}) => {
    await prepare(page)
    await page.route('**/api/v1/bookings/239', route => route.fulfill({json: {data: {...initialBooking, status: 'PENDING_CHECKIN'}}}))
    await page.route('**/api/v1/payments/sync', route => route.fulfill({json: {data: {status: 'SUCCESS', type: 'DEPOSIT'}}}))
    await page.goto(`${path}?bookingId=239&status=CANCELLED&cancel=true`)
    await expect(page.getByRole('heading', {name: 'Đã thanh toán cọc', exact: true})).toBeVisible()
    await expect(page.getByRole('link', {name: 'Xem vé QR'})).toHaveAttribute('href', '/bookings?bookingId=239')
    await expect(page.getByRole('button', {name: /Thanh toán lại/})).toHaveCount(0)
  })
}
for (const scenario of ['pending', 'expired', 'review', 'forbidden', 'sync-error', 'missing'] as const) {
  test(`actual result route handles ${scenario} without fake data or unsafe retry`, async ({page}) => {
    await prepare(page)
    await page.route('**/api/v1/bookings/239', route => scenario === 'forbidden'
      ? route.fulfill({status: 403, json: {message: 'Bạn không có quyền xem vé này'}})
      : route.fulfill({json: {data: {...initialBooking, status: scenario === 'expired' ? 'EXPIRED' : 'PENDING_PAYMENT'}}}))
    await page.route('**/api/v1/payments/sync', route => scenario === 'sync-error'
      ? route.fulfill({status: 503, json: {message: 'Chưa kết nối được PayOS'}})
      : route.fulfill({json: {data: {status: scenario === 'review' ? 'REQUIRES_REVIEW' : 'PENDING'}}}))
    await page.goto(`/payment/cancel${scenario === 'missing' ? '' : '?bookingId=239&status=PAID'}`)
    const titles = {pending: 'Bạn đã dừng thanh toán', expired: 'Vé đã hết hạn', review: 'Khoản thanh toán cần kiểm tra', forbidden: 'Không thể xem kết quả thanh toán', 'sync-error': 'Bạn đã dừng thanh toán', missing: 'Không tìm thấy vé'}
    await expect(page.getByRole('heading', {name: titles[scenario], exact: true})).toBeVisible()
    await expect(page.getByRole('button', {name: /Thanh toán lại/})).toHaveCount(0)
    if (scenario === 'forbidden' || scenario === 'missing') await expect(page.getByText(initialBooking.bookingCode, {exact: true})).toHaveCount(0)
    await expect(page.getByText(/C-114|PAYOS-CAN|chưa bị trừ tiền/)).toHaveCount(0)
  })
}
