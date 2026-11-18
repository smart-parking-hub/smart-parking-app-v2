import { test, expect } from '@playwright/test'

test.use({ baseURL: process.env.ACCOUNT_REGISTRATION_BASE_URL ?? 'http://127.0.0.1:3000' })

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/auth/ping', route => route.fulfill({ json: { data: null } }))
})

for (const width of [1440, 390]) {
  test(`registration personal validation ${width}px: blur, correction and optional citizen ID`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    let requests = 0
    await page.route(/\/api\/v1\/auth\/(?:otp\/(?:send|verify)|register)$/, route => { requests++; return route.abort() })
    await page.goto('/register')
    const name = page.getByLabel('Họ và tên')
    const phone = page.getByLabel('Số điện thoại')
    const citizenId = page.getByLabel('CCCD / CMND')
    await name.fill('A')
    await phone.click()
    await expect(page.getByText('Họ và tên phải có ít nhất 2 ký tự.')).toBeVisible()
    await name.fill('Test Driver')
    await phone.fill('0212345678')
    await citizenId.click()
    await expect(phone).toHaveAttribute('aria-invalid', 'true')
    await phone.fill('+84 901 234 567')
    await citizenId.fill('123')
    await page.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }).click()
    await expect(citizenId).toBeFocused()
    await expect(page.getByText('CCCD / CMND phải gồm 9 hoặc 12 chữ số.')).toBeVisible()
    await page.screenshot({ path: `.artifacts/register-validation-${width}.png`, fullPage: true })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await citizenId.clear()
    await page.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }).click()
    await expect(page.getByLabel('Email nhận mã xác thực')).toBeVisible()
    expect(requests).toBe(0)
  })

  test(`registration duplicates ${width}px: server phone and email conflicts reveal the field`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.route('**/api/v1/auth/otp/send', route => route.fulfill({ json: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } }))
    await page.route('**/api/v1/auth/otp/verify', route => route.fulfill({ json: { data: null } }))
    let registrations = 0
    await page.route('**/api/v1/auth/register', route => {
      registrations++
      return route.fulfill({ status: 409, json: { message: registrations === 1
        ? 'Số điện thoại đã tồn tại trong hệ thống!' : 'Email đã tồn tại trong hệ thống!' } })
    })
    await page.goto('/register')
    await page.getByLabel('Họ và tên').fill('Test Driver')
    await page.getByLabel('Số điện thoại').fill('0901234567')
    await page.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }).click()
    await page.getByLabel('Email nhận mã xác thực').fill('driver@example.test')
    await page.getByRole('button', { name: 'Gửi mã qua email' }).click()
    await page.getByLabel('Mã xác thực email (6 số)').fill('012345')
    await page.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }).click()
    await page.getByLabel('Mật khẩu', { exact: true }).fill('test-password')
    await page.getByLabel('Xác nhận mật khẩu', { exact: true }).fill('test-password')
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click()
    const phone = page.getByLabel('Số điện thoại')
    await expect(phone).toBeVisible()
    await expect(phone).toBeFocused()
    await expect(phone).toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator('#auth-phone-error')).toHaveText('Số điện thoại đã tồn tại trong hệ thống!')
    await phone.fill('0901234568')
    await page.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }).click()
    await page.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }).click()
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click()
    const email = page.getByLabel('Email nhận mã xác thực')
    await expect(email).toBeVisible()
    await expect(email).toBeFocused()
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator('#auth-email-error')).toHaveText('Email đã tồn tại trong hệ thống!')
    expect(registrations).toBe(2)
  })

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
