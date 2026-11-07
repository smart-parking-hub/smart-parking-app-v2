import fs from 'node:fs'
import { chromium, expect } from '@playwright/test'

const resources = '../smart-parking-service-microservice/notification-service/src/main/resources/mail'
const destination = '../docs/fe-be-integration'
const logo = fs.readFileSync(`${resources}/smart-parking-logo.png`).toString('base64')
const html = fs.readFileSync(`${resources}/otp.html`, 'utf8')
  .replaceAll('{{title}}', 'Xác thực email của bạn')
  .replaceAll('{{description}}', 'Chào bạn, cảm ơn bạn đã chọn Smart Parking Hub. Nhập mã bên dưới để xác thực email và hoàn tất đăng ký.')
  .replaceAll('{{code}}', '482619') // Display sample only; never request or persist a real OTP.
  .replace('cid:smart-parking-logo', `data:image/png;base64,${logo}`)
fs.writeFileSync(`${destination}/otp-email-preview.html`, html)
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 760, height: 1050 } })
  await page.setContent(html)
  await expect(page.getByRole('heading', { name: 'Xác thực email của bạn' })).toBeVisible()
  await expect(page.getByAltText('Smart Parking Hub')).toBeVisible()
  await expect(page.getByText('482619', { exact: true })).toBeVisible()
  await page.screenshot({ path: `${destination}/otp-email-desktop.png`, fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: `${destination}/otp-email-mobile.png`, fullPage: true })
  console.log('Email desktop/mobile previews passed; sample code only, no emails sent')
} finally { await browser.close() }
