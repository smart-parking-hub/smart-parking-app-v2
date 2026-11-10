import { test, expect } from '@playwright/test'

test.use({ baseURL: process.env.ACCOUNT_REGISTRATION_BASE_URL ?? 'http://127.0.0.1:3000' })

for (const width of [1440, 390]) {
  test(`account registration ${width}px: delivery failure, OTP rejection and correction`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    let sends = 0
    let registrations = 0
    await page.route('**/api/v1/auth/otp/send', (route) => {
      sends++
      return route.fulfill(sends === 1
        ? { status: 500, json: { message: 'Chưa gửi được email. Vui lòng thử lại sau.' } }
        : { json: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } })
    })
    await page.route('**/api/v1/auth/otp/verify', (route) => route.fulfill(
      route.request().postDataJSON().otpCode === '000001'
        ? { status: 400, json: { message: 'Mã OTP không chính xác!' } }
        : { json: { data: null } },
    ))
    await page.route('**/api/v1/auth/register', (route) => {
      registrations++
      return route.fulfill(registrations === 1
        ? { status: 400, json: { message: 'Mã OTP không tồn tại hoặc đã hết hạn!' } }
        : { status: 201, json: { data: null } })
    })
    await page.goto('/register')
    await page.getByLabel('Họ và tên').fill('Test Driver')
    await page.getByLabel('Số điện thoại').fill('0901234567')
    await page.getByLabel('Số điện thoại').press('Enter')
    await expect(page.getByLabel('Email nhận mã xác thực')).toBeVisible()
    await expect(page.getByLabel('Mật khẩu', { exact: true })).toBeHidden()
    await page.getByLabel('Email nhận mã xác thực').fill('driver@example.test')
    await page.getByRole('button', { name: 'Gửi mã qua email' }).click()
    await expect(page.getByText('Chưa gửi được email. Vui lòng thử lại sau.')).toBeVisible()
    await page.getByLabel('Mã xác thực email (6 số)').fill('123456')
    await page.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }).click()
    await expect(page.getByText(/Vui lòng gửi mã OTP thành công/)).toBeVisible()
    expect(registrations).toBe(0)
    await page.getByRole('button', { name: 'Gửi mã qua email' }).click()
    await expect(page.getByText('Mã xác thực đã được gửi')).toBeVisible()
    await expect(page.getByLabel('Mã xác thực email (6 số)')).toHaveValue('')
    await page.getByLabel('Mã xác thực email (6 số)').fill('000001')
    await page.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }).click()
    await expect(page.getByText('Mã OTP không chính xác!')).toBeVisible()
    await expect(page.getByLabel('Mật khẩu', { exact: true })).toBeHidden()
    await page.getByLabel('Mã xác thực email (6 số)').fill('123456')
    await page.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }).click()
    await page.getByLabel('Mật khẩu', { exact: true }).fill('test-password')
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click()
    await expect(page.getByText('Nhập lại mật khẩu để xác nhận.')).toBeVisible()
    await page.getByLabel('Xác nhận mật khẩu', { exact: true }).fill('test-password')
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click()
    await expect(page.getByText('Mã OTP không tồn tại hoặc đã hết hạn!')).toBeVisible()
    await expect(page.getByLabel('Email nhận mã xác thực')).toBeVisible()
    await expect(page.getByText('Chưa gửi được email. Vui lòng thử lại sau.')).toBeHidden()
    await page.getByLabel('Mã xác thực email (6 số)').fill('654321')
    await page.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }).click()
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click()
    await expect(page.getByText('Đăng ký thành công!')).toBeVisible()
    expect(registrations).toBe(2)
  })
}
