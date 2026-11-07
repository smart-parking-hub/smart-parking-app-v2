import fs from 'node:fs'
import { randomInt, randomBytes, randomUUID } from 'node:crypto'
import { chromium, expect } from '@playwright/test'
import { readLocalEmailCode } from './local-email-inbox.mjs'

const email = `email-acceptance-${randomUUID()}@example.test`
const phone = '09' + String(randomInt(100000000)).padStart(8, '0')
const password = randomBytes(18).toString('base64url')
const newPassword = randomBytes(18).toString('base64url')
const reportDir = '../docs/fe-be-integration'
const checks = []
let browser, page
async function post(path, data) {
  const response = await fetch(`http://localhost:8088/api/v1/auth/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  return { status: response.status, body: await response.json() }
}
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true })
  page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, locale: 'vi-VN' })
  await page.goto('http://localhost:3000/register')
  await page.getByLabel('Số điện thoại', { exact: true }).fill(phone)
  await page.getByLabel('Email nhận mã xác thực').fill(email)
  await page.getByLabel('Họ và tên').fill('Email OTP Acceptance')
  await page.getByLabel('Mật khẩu', { exact: true }).fill(password)
  const pending = page.waitForResponse(r => r.url().endsWith('/api/v1/auth/otp/send') && r.request().method() === 'POST')
  await page.getByRole('button', { name: 'Gửi mã qua email' }).click()
  const response = await pending
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.data).toEqual({ expiresInSeconds: 300, resendAfterSeconds: 60 })
  expect(response.request().postDataJSON()).toEqual({ email })
  await expect(page.getByText('Mã xác thực đã được gửi')).toBeVisible()
  await page.screenshot({ path: `${reportDir}/email-otp-register.png`, fullPage: true })
  checks.push('Registration form requests email OTP; response never exposes code; 60-second cooldown')
  const code = await readLocalEmailCode(email)
  checks.push('Identity -> authenticated notification endpoint -> SMTP -> local email received')
  expect((await post('otp/send', { email })).status).toBe(409)
  expect((await post('otp/send', { phone })).status).toBe(400)
  checks.push('Server enforces resend cooldown and rejects legacy phone-only requests')
  await page.getByLabel('Mã xác thực email (6 số)').fill(code)
  await page.getByRole('button', { name: 'Tạo tài khoản' }).click()
  await expect(page.getByRole('heading', { name: 'Đăng ký thành công' })).toBeVisible()
  await page.screenshot({ path: `${reportDir}/email-otp-success.png` })
  expect((await post('login', { phone, password })).status).toBe(200)
  checks.push('Code from email creates account; existing phone/password login works')
  await page.goto('http://localhost:3000/forgot-password')
  await page.getByLabel('Email nhận mã xác thực').fill(email)
  await page.getByRole('button', { name: 'Gửi mã qua email' }).click()
  await expect(page.getByText('Kiểm tra hộp thư của bạn')).toBeVisible()
  const resetCode = await readLocalEmailCode(email, 'reset')
  expect((await post('forgot-password/reset', { email, otpCode: code, newPassword })).status).toBe(400)
  await page.getByLabel('Mã xác thực email (6 số)').fill(resetCode)
  await page.getByLabel('Mật khẩu mới').fill(newPassword)
  await page.getByRole('button', { name: /Đặt lại mật khẩu|Cập nhật mật khẩu/ }).click()
  await expect(page.getByRole('heading', { name: 'Đặt lại mật khẩu thành công' })).toBeVisible()
  expect((await post('login', { phone, password: newPassword })).status).toBe(200)
  expect((await post('login', { phone, password })).status).toBe(401)
  expect((await post('forgot-password/reset', { email, otpCode: resetCode, newPassword })).status).toBe(400)
  checks.push('Reset-purpose email works; registration code cannot reset; old password and reused code rejected')
  await page.goto('http://localhost:3000/register')
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(true)
  await page.screenshot({ path: `${reportDir}/email-otp-mobile.png`, fullPage: true })
  checks.push('390px mobile registration fits without horizontal page overflow')
  const report = { passed: true, emailDelivery: 'Local SMTP inbox only; external SMTP not configured', checks }
  fs.writeFileSync(`${reportDir}/email-otp-results.json`, JSON.stringify(report, null, 2)); console.log(JSON.stringify(report))
} catch (error) {
  fs.writeFileSync(`${reportDir}/email-otp-results.json`, JSON.stringify({ passed: false, error: String(error.message).slice(0, 800), checks }, null, 2))
  console.error('Email OTP acceptance failed; see sanitized report'); process.exitCode = 1
} finally { await browser?.close() }
