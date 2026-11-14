import { expect, test } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`withdrawal amount formatting and receiving accounts at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    const token = `test.${Buffer.from(JSON.stringify({ sub: '7', role: 'ROLE_MERCHANT', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
    await page.addInitScript(value => localStorage.setItem('access_token', value), token)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()) })
    let profileAvailable = true
    let bankReads = 0
    const submissions: unknown[] = []
    await page.route('https://api.vietqr.io/v2/banks', async route => {
      bankReads++
      expect(route.request().headers()).not.toHaveProperty('authorization')
      await route.fulfill({ json: { code: '00', data: [
        { name: 'Ngân hàng TMCP Ngoại thương Việt Nam', shortName: 'Vietcombank', code: 'VCB', bin: '970436' },
        { name: 'Ngân hàng TMCP Kỹ thương Việt Nam', shortName: 'Techcombank', code: 'TCB', bin: '970407' },
      ] } })
    })
    await page.route('**/api/v1/**', async route => {
      const path = new URL(route.request().url()).pathname
      if (path === '/api/v1/withdrawals' && route.request().method() === 'POST') {
        submissions.push(route.request().postDataJSON())
        return route.fulfill({ json: { data: { id: 1 } } })
      }
      const data = path === '/api/v1/merchant/revenue'
        ? { currentWalletBalance: 34903600, minWithdrawalAmount: 50000, totalNetRevenue: 34903600 }
        : path === '/api/v1/merchant/profile'
          ? profileAvailable ? { bankName: 'Vietcombank', bankAccountNum: '0123456789', fullName: 'NGUYEN VAN TEST' } : {}
          : { content: [], totalPages: 0, fullName: 'Merchant kiểm thử' }
      await route.fulfill({ json: { data } })
    })
    await page.goto('/merchant/withdrawals')
    await page.getByRole('button', { name: '+ Yêu cầu rút tiền' }).click()
    const dialog = page.getByRole('dialog', { name: 'Tạo yêu cầu rút tiền' })
    await expect(dialog.getByRole('radio', { name: 'Tài khoản mặc định' })).toBeChecked()
    const amount = dialog.getByLabel('Số tiền rút (VND)')
    await amount.fill('1000000')
    await expect(amount).toHaveValue('1.000.000')
    await amount.fill('1,200,000')
    await expect(amount).toHaveValue('1.200.000')
    await amount.fill('')
    await dialog.getByRole('button', { name: 'Gửi yêu cầu phê duyệt' }).click()
    await expect(dialog.getByRole('alert')).toBeVisible()
    expect(submissions).toHaveLength(0)
    await amount.fill('34903601')
    await dialog.getByRole('button', { name: 'Gửi yêu cầu phê duyệt' }).click()
    await expect(dialog.getByRole('alert')).toBeVisible()
    expect(submissions).toHaveLength(0)
    await dialog.getByRole('button', { name: /Toàn bộ/ }).click()
    await expect(amount).toHaveValue('34.903.600')
    await dialog.getByRole('button', { name: /Tối thiểu/ }).click()
    await expect(amount).toHaveValue('50.000')
    await dialog.getByRole('button', { name: 'Gửi yêu cầu phê duyệt' }).click()
    await expect(dialog).not.toBeVisible()
    expect(submissions[0]).toEqual({ amount: 50000, bankName: 'Vietcombank', bankAccountNumber: '0123456789', accountHolderName: 'NGUYEN VAN TEST' })

    await page.getByRole('button', { name: '+ Yêu cầu rút tiền' }).click()
    await dialog.getByRole('radio', { name: 'Tài khoản khác' }).check()
    await amount.fill('1000000')
    await dialog.getByRole('button', { name: 'Gửi yêu cầu phê duyệt' }).click()
    await expect(dialog.getByRole('alert').first()).toBeVisible()
    expect(submissions).toHaveLength(1)
    const bank = dialog.getByRole('combobox', { name: 'Ngân hàng nhận' })
    await expect(bank).toBeEnabled()
    await bank.fill('Không tồn tại')
    await expect(dialog.getByText(/Không tìm thấy ngân hàng/)).toBeVisible()
    await dialog.getByLabel('Số tài khoản thụ hưởng').fill('000987654321')
    await dialog.getByLabel('Tên chủ tài khoản').fill('TRAN VAN TEST')
    await dialog.getByRole('button', { name: 'Gửi yêu cầu phê duyệt' }).click()
    await expect(dialog.getByRole('alert').filter({ hasText: 'Chọn ngân hàng từ danh sách.' })).toBeVisible()
    expect(submissions).toHaveLength(1)
    await bank.fill('ky thuong')
    await expect(dialog.getByRole('option', { name: /Techcombank/ })).toBeVisible()
    await page.screenshot({ path: `.artifacts/merchant-withdrawal-bank-options-${width}.png`, fullPage: true })
    await bank.press('ArrowDown')
    await bank.press('Enter')
    await expect(bank).toHaveValue('Techcombank')
    const loadedBankReads = bankReads
    await dialog.getByLabel('Số tài khoản thụ hưởng').fill('000987654321')
    await dialog.getByLabel('Tên chủ tài khoản').fill('TRAN VAN TEST')
    await dialog.getByRole('radio', { name: 'Tài khoản mặc định' }).check()
    await expect(dialog.getByText('0123456789')).toBeVisible()
    await dialog.getByRole('radio', { name: 'Tài khoản khác' }).check()
    await expect(dialog.getByLabel('Số tài khoản thụ hưởng')).toHaveValue('000987654321')
    await expect(bank).toHaveValue('Techcombank')
    expect(bankReads).toBe(loadedBankReads)
    await page.screenshot({ path: `.artifacts/merchant-withdrawals-${width}.png`, fullPage: true })
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
    await dialog.getByRole('button', { name: 'Gửi yêu cầu phê duyệt' }).click()
    await expect(dialog).not.toBeVisible()
    expect(submissions[1]).toEqual({ amount: 1000000, bankName: 'Techcombank', bankAccountNumber: '000987654321', accountHolderName: 'TRAN VAN TEST' })

    profileAvailable = false
    await page.reload()
    await page.getByRole('button', { name: '+ Yêu cầu rút tiền' }).click()
    await expect(dialog.getByRole('radio', { name: 'Tài khoản mặc định' })).toBeDisabled()
    await expect(dialog.getByRole('radio', { name: 'Tài khoản khác' })).toBeChecked()
    await expect(dialog.getByLabel('Ngân hàng nhận')).toBeVisible()
    expect(errors).toEqual([])
  })
}
