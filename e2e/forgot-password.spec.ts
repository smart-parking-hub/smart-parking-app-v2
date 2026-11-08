import { test, expect } from '@playwright/test'
import { execSync, spawn, type ChildProcess } from 'node:child_process'

let spawnedVite: ChildProcess | null = null

async function isViteListening(url: string): Promise<boolean> {
  try {
    const response = await fetch(url)
    return response.ok
  } catch {
    return false
  }
}

test.describe('SCR-012: Khôi phục mật khẩu qua OTP (/forgot-password)', () => {
  test.beforeAll(async () => {
    if (await isViteListening('http://127.0.0.1:5174')) {
      return
    }

    spawnedVite = spawn(
      process.execPath,
      [
        'node_modules/vite/bin/vite.js',
        '--host',
        '127.0.0.1',
        '--port',
        '5174',
        '--strictPort',
      ],
      {
        cwd: process.cwd(),
        stdio: 'ignore',
      },
    )

    for (let i = 0; i < 40; i += 1) {
      if (await isViteListening('http://127.0.0.1:5174')) {
        return
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  })

  test.afterAll(async () => {
    if (spawnedVite?.pid) {
      try {
        if (process.platform === 'win32') {
          execSync(`taskkill /PID ${spawnedVite.pid} /T /F`, { stdio: 'ignore' })
        } else {
          spawnedVite.kill('SIGTERM')
        }
      } catch {
        // Ignore if process already exited
      }
      spawnedVite = null
    }
  })

  test('mobile (390x844) and desktop (1440x900): public access from login, no API on mount, keyboard validation, and zero horizontal overflow or console issues', async ({
    page,
  }) => {
    const pageErrors: string[] = []
    const consoleIssues: string[] = []
    let otpCalls = 0
    let resetCalls = 0

    page.on('pageerror', (error) => pageErrors.push(error.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleIssues.push(`[${msg.type()}] ${msg.text()}`)
      }
    })

    await page.route('**/api/v1/auth/forgot-password/otp', async (route) => {
      otpCalls += 1
      await route.fulfill({
        status: 200,
        json: {
          data: { expiresInSeconds: 300, resendAfterSeconds: 60 },
          message: 'Nếu email tồn tại, mã OTP đã được gửi',
        },
      })
    })
    await page.route('**/api/v1/auth/forgot-password/reset', async (route) => {
      resetCalls += 1
      await route.fulfill({
        status: 200,
        json: { data: null, message: 'Đổi mật khẩu thành công' },
      })
    })

    // 1. Mobile viewport (390x844) & inbound navigation from /login
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/login')
    await page.getByRole('link', { name: 'Quên mật khẩu?' }).waitFor()
    await page.evaluate(() => document.fonts.ready)

    // Verify default AuthLayout on /login is unaffected (still uses Be Vietnam Pro / Source Sans 3)
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('DOM.enable')
    await cdp.send('CSS.enable')
    const loginDoc = await cdp.send('DOM.getDocument')
    const loginHeadingNode = await cdp.send('DOM.querySelector', {
      nodeId: loginDoc.root.nodeId,
      selector: 'h1',
    })
    const loginHeadingFonts = await cdp.send('CSS.getPlatformFontsForNode', {
      nodeId: loginHeadingNode.nodeId,
    })
    expect(
      loginHeadingFonts.fonts.some((f) => f.familyName.includes('Be Vietnam Pro')),
    ).toBe(true)

    await page.getByRole('link', { name: 'Quên mật khẩu?' }).click()
    await expect(page).toHaveURL(/\/forgot-password$/)
    await expect(
      page.getByRole('heading', { name: 'Khôi Phục Mật Khẩu' }),
    ).toBeVisible()

    // No API call on initial mount
    expect(otpCalls).toBe(0)
    expect(resetCalls).toBe(0)

    // No horizontal overflow on mobile
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
    await page.screenshot({
      path: '.artifacts/playwright/scr-012/step1-390.png',
      fullPage: true,
    })

    // Keyboard submission on empty email triggers validation alert without API call
    const emailInput = page.getByLabel(/Email nhận mã xác thực/i)
    await emailInput.focus()
    await page.keyboard.press('Enter')
    await expect(
      page.getByText('Vui lòng nhập địa chỉ email.'),
    ).toBeVisible()
    expect(otpCalls).toBe(0)

    // 2. Desktop viewport (1440x900)
    await page.setViewportSize({ width: 1440, height: 900 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)

    // R3: Verify actual loaded @font-face resources and CDP rendered platform fonts on SCR-012
    await page.evaluate(() => document.fonts.ready)
    const typographyCheck = await page.evaluate(() => {
      const heading = document.querySelector('h1')
      const stepLabel = document.querySelector('#stepper-step-1 p')
      const footerBar = document.querySelector('footer > div')
      const loadedFamilies = Array.from(document.fonts)
        .filter((f) => f.status === 'loaded')
        .map((f) => f.family.replace(/^["']|["']$/g, ''))
      return {
        monoCount: document.querySelectorAll('.font-mono').length,
        headingFont: heading ? getComputedStyle(heading).fontFamily : '',
        stepLabelFont: stepLabel ? getComputedStyle(stepLabel).fontFamily : '',
        footerFont: footerBar ? getComputedStyle(footerBar).fontFamily : '',
        loadedFamilies,
      }
    })
    expect(typographyCheck.monoCount).toBe(0)
    expect(typographyCheck.headingFont).toContain('Sora')
    expect(typographyCheck.stepLabelFont).toContain('Inter')
    expect(typographyCheck.footerFont).toContain('Inter')
    expect(typographyCheck.loadedFamilies).toContain('Inter')
    expect(typographyCheck.loadedFamilies).toContain('Sora')

    const recoveryDoc = await cdp.send('DOM.getDocument')
    const queryPlatformFonts = async (selector: string) => {
      const { nodeId } = await cdp.send('DOM.querySelector', {
        nodeId: recoveryDoc.root.nodeId,
        selector,
      })
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', {
        nodeId,
      })
      return fonts
    }

    const h1Fonts = await queryPlatformFonts('h1')
    expect(
      h1Fonts.some(
        (f) => f.familyName === 'Sora' && f.isCustomFont && f.glyphCount >= 15,
      ),
    ).toBe(true)
    expect(
      h1Fonts.every(
        (f) =>
          (f.familyName === 'Sora' || f.familyName === 'Inter') &&
          f.isCustomFont,
      ),
    ).toBe(true)

    const step1TextFonts = await queryPlatformFonts('#step-1-text')
    expect(step1TextFonts).toEqual([
      expect.objectContaining({
        familyName: 'Inter',
        isCustomFont: true,
        glyphCount: 14,
      }),
    ])

    const footerSpanFonts = await queryPlatformFonts('footer > div span')
    expect(footerSpanFonts).toEqual([
      expect.objectContaining({
        familyName: 'Inter',
        isCustomFont: true,
      }),
    ])

    await page.screenshot({
      path: '.artifacts/playwright/scr-012/step1-1440.png',
      fullPage: true,
    })

    expect(pageErrors).toEqual([])
    expect(consoleIssues).toEqual([])
  })

  test('full 2-step recovery flow: email normalization, generic notice, leading-zero OTP, password toggles, error recovery, and login CTA without auto-login', async ({
    page,
  }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (error) => pageErrors.push(error.message))

    let otpRequestCount = 0
    let resetRequestCount = 0

    await page.route('**/api/v1/auth/forgot-password/otp', async (route) => {
      otpRequestCount += 1
      const body = route.request().postDataJSON()
      expect(body).toEqual({ email: 'driver.recovery@example.com' })

      if (otpRequestCount === 1) {
        await route.fulfill({
          status: 503,
          json: { message: 'Hệ thống gửi thư đang bận, vui lòng thử lại.' },
        })
        return
      }

      await route.fulfill({
        status: 200,
        json: {
          data: { expiresInSeconds: 300, resendAfterSeconds: 60 },
          message: 'Nếu email tồn tại, mã OTP đã được gửi',
        },
      })
    })

    await page.route('**/api/v1/auth/forgot-password/reset', async (route) => {
      resetRequestCount += 1
      const body = route.request().postDataJSON()
      expect(body).not.toHaveProperty('confirmPassword')

      if (resetRequestCount === 1) {
        expect(body).toEqual({
          email: 'driver.recovery@example.com',
          otpCode: '001122',
          newPassword: 'NewPassword123',
        })
        await route.fulfill({
          status: 400,
          json: { message: 'Mã OTP không chính xác hoặc đã hết hạn.' },
        })
        return
      }

      expect(body).toEqual({
        email: 'driver.recovery@example.com',
        otpCode: '012345',
        newPassword: 'NewPassword123',
      })
      await route.fulfill({
        status: 200,
        json: { data: null, message: 'Đổi mật khẩu thành công' },
      })
    })

    await page.setViewportSize({ width: 1280, height: 1024 })
    await page.goto('/forgot-password')

    // Step 1: Enter uppercase/padded email -> first attempt fails -> stays on Step 1
    const emailInput = page.getByLabel(/Email nhận mã xác thực/i)
    await emailInput.fill('  Driver.Recovery@Example.COM  ')
    await page.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }).click()

    await expect(
      page.getByText(/Hệ thống gửi thư đang bận, vui lòng thử lại\./),
    ).toBeVisible()
    await expect(page.getByLabel(/Mã OTP xác thực/i)).toHaveCount(0)
    await page.screenshot({
      path: '.artifacts/playwright/scr-012/step1-error-1280.png',
      fullPage: true,
    })

    // Retry from error banner -> transitions to Step 2
    await page.getByRole('button', { name: /Thử gửi lại/i }).click()
    await expect(
      page.getByText(/Nếu email đã đăng ký, mã OTP 6 chữ số đã được gửi tới:/i),
    ).toBeVisible()
    await expect(
      page.locator('#display-user-email'),
    ).toHaveText('driver.recovery@example.com')
    await expect(page.getByTestId('otp-ttl-timer')).toHaveText(/0[45]:\d{2}/)
    await expect(
      page.getByRole('button', { name: /Gửi lại sau \d+s/i }),
    ).toBeDisabled()
    expect(otpRequestCount).toBe(2)

    // R2: Navigating back to Step 1 and re-submitting the same email during cooldown does NOT send a new request
    await page.getByRole('button', { name: 'Nhập email khác' }).click()
    await page.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }).click()
    await expect(
      page.locator('#display-user-email'),
    ).toHaveText('driver.recovery@example.com')
    expect(otpRequestCount).toBe(2)

    // R3: Timer rendered platform font via CDP uses loaded custom Inter font
    await page.evaluate(() => document.fonts.ready)
    const cdpStep2 = await page.context().newCDPSession(page)
    await cdpStep2.send('DOM.enable')
    await cdpStep2.send('CSS.enable')
    const step2Doc = await cdpStep2.send('DOM.getDocument')
    const timerNode = await cdpStep2.send('DOM.querySelector', {
      nodeId: step2Doc.root.nodeId,
      selector: '#countdown-timer',
    })
    const timerFonts = await cdpStep2.send('CSS.getPlatformFontsForNode', {
      nodeId: timerNode.nodeId,
    })
    expect(timerFonts.fonts).toEqual([
      expect.objectContaining({
        familyName: 'Inter',
        isCustomFont: true,
        glyphCount: 5,
      }),
    ])

    await page.screenshot({
      path: '.artifacts/playwright/scr-012/step2-1280.png',
      fullPage: true,
    })

    // Step 2: Check password visibility toggles & confirmation mismatch validation
    const otpInput = page.getByLabel(/Mã OTP xác thực/i)
    const newPasswordInput = page.getByLabel(/^Mật khẩu mới/i)
    const confirmPasswordInput = page.getByLabel(/^Xác nhận mật khẩu/i)

    await otpInput.fill('001122')
    await newPasswordInput.fill('NewPassword123')
    await confirmPasswordInput.fill('Mismatch123')

    await page.getByRole('button', { name: 'Hiện mật khẩu mới' }).click()
    await expect(newPasswordInput).toHaveAttribute('type', 'text')
    await page.getByRole('button', { name: 'Ẩn mật khẩu mới' }).click()
    await expect(newPasswordInput).toHaveAttribute('type', 'password')

    await page.getByRole('button', { name: /Đặt Lại Mật Khẩu/i }).click()
    await expect(
      page.getByText('Xác nhận mật khẩu mới không trùng khớp.'),
    ).toBeVisible()
    expect(resetRequestCount).toBe(0)

    // Fix confirmation -> submit -> first reset fails with 400 -> inputs preserved, no false success
    await confirmPasswordInput.fill('NewPassword123')
    await page.getByRole('button', { name: /Đặt Lại Mật Khẩu/i }).click()

    await expect(
      page.getByText(/Mã OTP không chính xác hoặc đã hết hạn\./),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Khôi Phục Thành Công!' }),
    ).toHaveCount(0)
    await expect(otpInput).toHaveValue('001122')
    await page.screenshot({
      path: '.artifacts/playwright/scr-012/step2-error-1280.png',
      fullPage: true,
    })

    // Fix OTP with leading zero -> submit -> succeeds -> shows success state & navigates to /login
    await otpInput.fill('012345')
    await page.getByRole('button', { name: /Đặt Lại Mật Khẩu/i }).click()

    await expect(
      page.getByRole('heading', { name: 'Khôi Phục Thành Công!' }),
    ).toBeVisible()
    await page.screenshot({
      path: '.artifacts/playwright/scr-012/success-1280.png',
      fullPage: true,
    })
    expect(
      await page.evaluate(() => localStorage.getItem('access_token')),
    ).toBeNull()

    await page.getByRole('link', { name: /Đăng Nhập Ngay/i }).click()
    await expect(page).toHaveURL(/\/login$/)
    expect(pageErrors).toEqual([])
  })
})
