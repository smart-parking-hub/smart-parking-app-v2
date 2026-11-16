import { expect, test } from '@playwright/test'
import { mockEmptyDriverWallet } from './fixtures/payment-reads'

// Local-network checkout is hosted; embedded behavior retains component coverage.
for (const width of [390, 1440]) {
  for (const final of [false, true]) {
    test(`PayOS hosted ${final ? 'final' : 'deposit'} at ${width}px requires server confirmation`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 })
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      const token = `test.${Buffer.from(JSON.stringify({role:'ROLE_DRIVER',userId:7,sub:'fixture-driver',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url')}.test`
      await page.addInitScript(value => localStorage.setItem('access_token', value), token)
      await page.route('**/api/v1/**', route => route.fulfill({json:{data:{content:[],totalElements:0,totalPages:1}}}))
      await mockEmptyDriverWallet(page, 51)
      await page.route('**/api/v1/driver/profile', route => route.fulfill({json:{data:{id:7,fullName:'Tài xế kiểm thử',role:'DRIVER'}}}))
      let status = final ? 'AWAITING_FINAL_PAYMENT' : 'PENDING_PAYMENT'
      let synced = false
      let paymentRequests = 0
      const booking = () => ({ id: 51, bookingCode: 'BK-SERVER-51', parkingLotId: 7, merchantId: 2,
        parkingLotName: 'Bãi kiểm thử PayOS', vehicleId: 3, vehiclePlate: '51C-TEST', status,
        advanceDeposit: 20000, totalAmount: 100000, hourlyRate: 25000,
        expectedCheckInTime: new Date(Date.now() + 1800000).toISOString(),
        expectedCheckOutTime: new Date(Date.now() + 9000000).toISOString(), expiresAt: new Date(Date.now() + 900000).toISOString() })
      await page.route('**/api/v1/bookings**', route => route.fulfill({json:{data:route.request().url().includes('/51') ? booking() : {content:[booking()],totalElements:1,totalPages:1,number:0}}}))
      await page.route('**/api/v1/disputes/me**', route => route.fulfill({json:{data:{content:[]}}}))
      await page.route('**/api/v1/payments', route => {
        paymentRequests++
        expect(route.request().postDataJSON()).toEqual({bookingId:51,paymentType:final?'FINAL_PAYMENT':'DEPOSIT'})
        return route.fulfill({json:{data:'https://pay.payos.vn/web/fixture-51'}})
      })
      await page.route('**/api/v1/payments/sync', route => {
        synced=true
        status=final?'COMPLETED':'PENDING_CHECKIN'
        return route.fulfill({json:{data:{status:'SUCCESS'}}})
      })
      const returnUrl = `${testInfo.project.use.baseURL}/payment/return?bookingId=51&status=PAID`
      await page.route('https://pay.payos.vn/**', route => route.fulfill({contentType:'text/html; charset=utf-8',body:`<html><body><h1>PayOS kiểm thử</h1><a href="${returnUrl}">Hoàn tất thanh toán kiểm thử</a></body></html>`}))
      await page.goto('/bookings?bookingId=51')
      await page.getByRole('button',{name:final?'Thanh toán phần còn lại qua PayOS':/Thanh toán cọc.*qua PayOS/}).click()
      expect(synced).toBe(false)
      await expect(page.locator('iframe')).toHaveCount(0)
      await page.getByRole('button',{name:'Mở PayOS để thanh toán'}).click()
      await expect(page).toHaveURL('https://pay.payos.vn/web/fixture-51')
      await page.getByRole('link',{name:'Hoàn tất thanh toán kiểm thử'}).click()
      await expect(page.getByText(final?'Đã hoàn tất':'Đã cọc · Chờ check-in',{exact:true})).toBeVisible()
      expect(synced).toBe(true)
      expect(paymentRequests).toBe(2)
      if(!final) {
        await page.getByRole('link',{name:'Xem vé QR'}).click()
        await expect(page.getByTestId('checkin-qr-container')).toBeVisible()
      }
      expect(errors).toEqual([])
    })
  }
}
