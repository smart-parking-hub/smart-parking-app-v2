import { test, expect } from '@playwright/test'

test.use({ baseURL: process.env.ACCOUNT_REGISTRATION_BASE_URL ?? 'http://127.0.0.1:5174' })

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/auth/ping', (route) => route.fulfill({ json: { data: null } }))
})

test.describe('SP-AUTH-REG-RESET-01: Browser Register Lifecycle & Role Switch Matrix', () => {
  for (const width of [1440, 390]) {
    test(`AC1 & AC2 ${width}px: F5 reload at any step reverts to clean DRIVER info, and legacy draft is deleted`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })

      // Seed legacy draft
      await page.addInitScript(() => {
        sessionStorage.setItem(
          'sp_register_draft',
          JSON.stringify({ fullName: 'Old User', phone: '0901234567', role: 'MERCHANT' }),
        )
      })

      await page.goto('/register')

      // Must be fresh DRIVER and empty fields
      await expect(page.getByLabel('Bạn tham gia với vai trò')).toHaveValue('DRIVER')
      await expect(page.getByLabel('Họ và tên')).toHaveValue('')
      await expect(page.getByLabel('Số điện thoại')).toHaveValue('')

      // Legacy draft must have been removed from storage
      const draftInStorage = await page.evaluate(() => sessionStorage.getItem('sp_register_draft'))
      expect(draftInStorage).toBeNull()

      // Switch to MERCHANT and advance to Bank step
      await page.getByLabel('Bạn tham gia với vai trò').selectOption('MERCHANT')
      await page.getByLabel('Họ và tên').fill('Merchant Owner')
      await page.getByLabel('Số điện thoại').fill('0909888777')
      await page.getByLabel('CCCD / CMND').fill('079123456789')
      await page.getByRole('button', { name: 'Tiếp tục: Kết nối ngân hàng' }).click()

      await expect(page.getByLabel('Số tài khoản ngân hàng')).toBeVisible()

      // F5 Reload from Bank step
      await page.reload()

      // Reverts to DRIVER at step 1 info, all fields blank
      await expect(page.getByLabel('Bạn tham gia với vai trò')).toHaveValue('DRIVER')
      await expect(page.getByLabel('Họ và tên')).toHaveValue('')
      await expect(page.getByLabel('Số điện thoại')).toHaveValue('')
      await expect(page.getByLabel('CCCD / CMND')).toHaveValue('')
      await expect(page.getByLabel('Số tài khoản ngân hàng')).toBeHidden()
    })

    test(`AC4, AC5 & AC12 ${width}px: Role change prompts confirmation when data entered, cancel preserves, confirm wipes`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/register')

      await page.getByLabel('Họ và tên').fill('Nguyen Van Driver')
      await page.getByLabel('Số điện thoại').fill('0912345678')

      // Select MERCHANT role -> Dialog must open
      await page.getByLabel('Bạn tham gia với vai trò').selectOption('MERCHANT')

      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      await expect(dialog.getByText('Đổi sang vai trò Chủ bãi?')).toBeVisible()
      await expect(
        dialog.getByText(
          'Thông tin đã nhập cho vai trò hiện tại sẽ bị xóa, bao gồm thông tin cá nhân, ngân hàng và xác thực email. Bạn cần nhập lại từ đầu.',
        ),
      ).toBeVisible()

      // Verify no horizontal overflow in dialog
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

      // Test Cancel via "Giữ vai trò hiện tại"
      await dialog.getByRole('button', { name: 'Giữ vai trò hiện tại' }).click()
      await expect(dialog).toBeHidden()
      await expect(page.getByLabel('Bạn tham gia với vai trò')).toHaveValue('DRIVER')
      await expect(page.getByLabel('Họ và tên')).toHaveValue('Nguyen Van Driver')
      await expect(page.getByLabel('Số điện thoại')).toHaveValue('0912345678')

      // Open dialog again and test Confirm
      await page.getByLabel('Bạn tham gia với vai trò').selectOption('MERCHANT')
      await expect(dialog).toBeVisible()
      await dialog.getByRole('button', { name: 'Đổi vai trò và nhập lại' }).click()

      await expect(dialog).toBeHidden()
      await expect(page.getByLabel('Bạn tham gia với vai trò')).toHaveValue('MERCHANT')
      await expect(page.getByLabel('Họ và tên')).toHaveValue('')
      await expect(page.getByLabel('Số điện thoại')).toHaveValue('')

      // Status announcement was polite and present
      await expect(page.getByText('Đã chuyển sang Chủ bãi. Vui lòng nhập thông tin đăng ký mới.')).toBeAttached()
      await page.screenshot({ path: `.artifacts/register-lifecycle-${width}.png`, fullPage: true })
    })

    test(`AC6 & AC8 ${width}px: Back/Next preserves data in memory; Magic Link single intake consumes params and guards info step`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })

      let verifyCalls = 0
      await page.route('**/api/v1/auth/otp/verify', (route) => {
        verifyCalls++
        return route.fulfill({ json: { data: null } })
      })

      // Magic link navigation
      await page.goto('/register?email=coldlink%40example.test&otpCode=654321&autoVerify=true')

      // URL search params must be stripped immediately
      await page.waitForURL((url) => !url.searchParams.has('email') && !url.searchParams.has('otpCode'))
      expect(page.url()).not.toContain('email=')
      expect(page.url()).not.toContain('otpCode=')

      // Form stays on info step because personal info is missing, with special notice
      await expect(
        page.getByText('Email đã được xác thực qua liên kết. Vui lòng hoàn tất thông tin đăng ký.'),
      ).toBeVisible()

      // Server verify was invoked once
      expect(verifyCalls).toBe(1)
      await expect(page.getByLabel('Họ và tên')).toBeVisible()
      await expect(page.getByLabel('Họ và tên')).toHaveValue('')

      // Fill info and proceed
      await page.getByLabel('Họ và tên').fill('Magic Link User')
      await page.getByLabel('Số điện thoại').fill('0911223344')
      await page.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }).click()

      // At Email step, verify that clicking continue directly advances to password without re-verify
      await expect(page.getByLabel('Email nhận mã xác thực')).toHaveValue('coldlink@example.test')
      await page.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }).click()

      await expect(page.getByLabel('Mật khẩu', { exact: true })).toBeVisible()

      // Step Back to Email -> then Step Back to Info (AC6: Back/Next keeps memory)
      await page.getByRole('button', { name: 'Quay lại' }).click()
      await expect(page.getByLabel('Email nhận mã xác thực')).toBeVisible()
      await page.getByRole('button', { name: 'Quay lại' }).click()
      await expect(page.getByLabel('Họ và tên')).toHaveValue('Magic Link User')
      await expect(page.getByLabel('Số điện thoại')).toHaveValue('0911223344')

      // Now Reload (F5) -> must be clean session with NO magic link notice and clean fields
      await page.reload()
      await expect(page.getByLabel('Họ và tên')).toHaveValue('')
      await expect(
        page.getByText('Email đã được xác thực qua liên kết. Vui lòng hoàn tất thông tin đăng ký.'),
      ).toBeHidden()
    })
  }

  test('AC1 browser: direct reload while on password step reverts to clean DRIVER info', async ({ page }) => {
    await page.route('**/api/v1/auth/otp/send', (route) =>
      route.fulfill({ json: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } }),
    )
    await page.route('**/api/v1/auth/otp/verify', (route) => route.fulfill({ json: { data: null } }))
    await page.goto('/register')

    await page.getByLabel('Họ và tên').fill('Password Reload User')
    await page.getByLabel('Số điện thoại').fill('0901234567')
    await page.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }).click()

    await page.getByLabel('Email nhận mã xác thực').fill('pwd-reload@example.test')
    await page.getByRole('button', { name: 'Gửi mã qua email' }).click()
    await page.getByLabel('Mã xác thực email (6 số)').fill('123456')
    await page.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }).click()

    await expect(page.getByLabel('Mật khẩu', { exact: true })).toBeVisible()

    // Directly reload while password step is visibly showing
    await page.reload()

    // Must revert to clean DRIVER at step 1 info
    await expect(page.getByLabel('Bạn tham gia với vai trò')).toHaveValue('DRIVER')
    await expect(page.getByLabel('Họ và tên')).toHaveValue('')
    await expect(page.getByLabel('Số điện thoại')).toHaveValue('')
    await expect(page.getByLabel('Mật khẩu', { exact: true })).toBeHidden()
  })

  test('AC1 browser: direct reload after registration success reverts to clean DRIVER info', async ({ page }) => {
    await page.route('**/api/v1/auth/otp/send', (route) =>
      route.fulfill({ json: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } }),
    )
    await page.route('**/api/v1/auth/otp/verify', (route) => route.fulfill({ json: { data: null } }))
    await page.route('**/api/v1/auth/register', (route) => route.fulfill({ json: { data: null } }))
    await page.goto('/register')

    await page.getByLabel('Họ và tên').fill('Success User')
    await page.getByLabel('Số điện thoại').fill('0901234567')
    await page.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }).click()

    await page.getByLabel('Email nhận mã xác thực').fill('success@example.test')
    await page.getByRole('button', { name: 'Gửi mã qua email' }).click()
    await page.getByLabel('Mã xác thực email (6 số)').fill('123456')
    await page.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }).click()

    await expect(page.getByLabel('Mật khẩu', { exact: true })).toBeVisible()
    await page.locator('#auth-password').fill('secret123')
    await page.locator('#auth-confirmPassword').fill('secret123')
    await page.getByRole('button', { name: 'Tạo tài khoản' }).click()

    await expect(page.getByRole('heading', { name: /Đăng ký thành công/i })).toBeVisible()

    // Directly reload while success is displayed
    await page.reload()

    // Must revert to clean DRIVER registration at info step
    await expect(page.getByLabel('Bạn tham gia với vai trò')).toHaveValue('DRIVER')
    await expect(page.getByLabel('Họ và tên')).toHaveValue('')
    await expect(page.getByRole('heading', { name: /Đăng ký thành công/i })).toBeHidden()
  })

  test('AC4, AC12 browser: interactive role trigger and keyboard navigation flow', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel('Họ và tên').fill('Keyboard Flow Driver')

    const roleTrigger = page.locator('#auth-role-trigger')
    await expect(roleTrigger).toBeVisible()

    // Focus and open via keyboard Enter
    await roleTrigger.focus()
    await page.keyboard.press('Enter')

    // Dropdown listbox appears
    const merchantOption = page.locator('button[role="option"]', { hasText: 'Chủ bãi' })
    await expect(merchantOption).toBeVisible()

    // Tab through the actual dropdown options and choose with Enter.
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await expect(merchantOption).toBeFocused()
    await page.keyboard.press('Enter')

    // Dialog opens with autofocus on "Giữ vai trò hiện tại"
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAccessibleName('Đổi sang vai trò Chủ bãi?')
    await expect(dialog).toHaveAccessibleDescription(/Thông tin đã nhập cho vai trò hiện tại sẽ bị xóa/)
    const keepButton = dialog.getByRole('button', { name: 'Giữ vai trò hiện tại' })
    await expect(keepButton).toBeFocused()

    // Test Escape cancels and restores focus to trigger
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(roleTrigger).toBeFocused()
    await expect(page.getByLabel('Họ và tên')).toHaveValue('Keyboard Flow Driver')

    // Open dialog again and test confirm focuses 'Họ và tên'
    await roleTrigger.click()
    await page.locator('button[role="option"]', { hasText: 'Chủ bãi' }).click()
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Đổi vai trò và nhập lại' }).click()
    await expect(dialog).toBeHidden()
    await expect(page.getByLabel('Họ và tên')).toBeFocused()
    await expect(page.getByLabel('Họ và tên')).toHaveValue('')
  })

  test('AC11 browser: navigating away to login and returning via browser back/forward', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel('Họ và tên').fill('Navigation Tester')

    // Click login link
    await page.getByRole('link', { name: 'Đăng nhập' }).click()
    await expect(page).toHaveURL(/\/login/)

    // Return to /register via browser back
    await page.goBack()
    await expect(page).toHaveURL(/\/register/)

    // Evaluate navigation evidence
    const navEvidence = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation')
      const navEntry = entries[0] as PerformanceNavigationTiming | undefined
      return {
        type: navEntry ? navEntry.type : 'unknown',
      }
    })
    console.log(`[AC11 Browser Navigation Evidence] navigation type: ${navEvidence.type}`)

    // Register form must start fresh
    await expect(page.getByLabel('Bạn tham gia với vai trò')).toHaveValue('DRIVER')
    await expect(page.getByLabel('Họ và tên')).toHaveValue('')

    await page.getByLabel('Họ và tên').fill('Second register visit')
    await page.goForward()
    await expect(page).toHaveURL(/\/login/)
    await page.goBack()
    await expect(page).toHaveURL(/\/register/)
    await expect(page.getByLabel('Họ và tên')).toHaveValue('')
    await expect(page.getByLabel('Bạn tham gia với vai trò')).toHaveValue('DRIVER')
  })

  test('AC1 browser: reload at email step clears code, send state and personal fields', async ({ page }) => {
    await page.route('**/api/v1/auth/otp/send', route => route.fulfill({
      json: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
    }))
    await page.goto('/register')
    await page.getByLabel('Họ và tên').fill('Email Reload User')
    await page.getByLabel('Số điện thoại').fill('0901234567')
    await page.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }).click()
    await page.getByLabel('Email nhận mã xác thực').fill('reload@example.test')
    await page.getByRole('button', { name: 'Gửi mã qua email' }).click()
    await expect(page.getByText('Mã xác thực đã được gửi')).toBeVisible()
    await page.getByLabel('Mã xác thực email (6 số)').fill('012345')
    await page.reload()
    await expect(page.getByLabel('Họ và tên')).toBeVisible()
    await expect(page.getByLabel('Bạn tham gia với vai trò')).toHaveValue('DRIVER')
    for (const label of ['Họ và tên', 'Số điện thoại', 'Email nhận mã xác thực', 'Mã xác thực email (6 số)']) {
      await expect(page.getByLabel(label, { exact: true })).toHaveValue('')
    }
    await expect(page.getByText('Mã xác thực đã được gửi')).toBeHidden()
  })

  test('AC12: Dialog responsiveness and no overflow on 320px narrow screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 600 })
    await page.goto('/register')

    await page.getByLabel('Họ và tên').fill('Small Device User')
    await page.getByLabel('Bạn tham gia với vai trò').selectOption('MERCHANT')

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Verify dialog width fits within viewport and buttons are accessible
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(320)

    const keepButton = dialog.getByRole('button', { name: 'Giữ vai trò hiện tại' })
    const confirmButton = dialog.getByRole('button', { name: 'Đổi vai trò và nhập lại' })

    await expect(keepButton).toBeVisible()
    await expect(confirmButton).toBeVisible()

    const keepBox = await keepButton.boundingBox()
    const confirmBox = await confirmButton.boundingBox()
    expect(keepBox?.height).toBeGreaterThanOrEqual(44)
    expect(confirmBox?.height).toBeGreaterThanOrEqual(44)

    await page.screenshot({ path: '.artifacts/register-lifecycle-320.png', fullPage: true })
    await keepButton.click()
    await expect(dialog).toBeHidden()
  })
})
