import { test, expect } from '@playwright/test'

test.use({ baseURL: process.env.QUICK_HOLD_BASE_URL || 'http://127.0.0.1:5174' })

for (const width of [390, 1440]) {
  test(`quick hold information, keyboard and confirmation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    // Isolate the actual component from authentication and live map services.
    await page.route('**/src/main.tsx', route => route.fulfill({ contentType: 'application/javascript', body: '' }))
    await page.goto('/')
    await page.evaluate(async () => {
      const load = (path: string) => import(/* @vite-ignore */ path)
      const { default: React } = await load('/node_modules/.vite/deps/react.js')
      const { default: ReactDOM } = await load('/node_modules/.vite/deps/react-dom_client.js')
      const { MemoryRouter } = await load('/node_modules/.vite/deps/react-router-dom.js')
      const { InlineQuickBookPanel } = await load('/src/features/parking-search/components/InlineQuickBookPanel.tsx')
      await load('/src/styles/globals.css')
      document.body.innerHTML = '<button id="trigger">Mở giữ chỗ</button><div id="preview"></div>'
      document.querySelector<HTMLElement>('#trigger')?.focus()
      const root = ReactDOM.createRoot(document.querySelector('#preview'))
      const close = () => root.render(null)
      root.render(React.createElement(MemoryRouter, null, React.createElement(InlineQuickBookPanel, {
        open: true, onClose: close,
        lot: { id: 1, name: 'Demo Hu HU', hourlyRate: 10000, depositAmount: 0, etaMinutes: 0, slotTypeLabel: 'Còn 5 chỗ' },
      })))
    })
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('Demo Hu HU')).toBeVisible()
    await expect(dialog.getByText('51D-894.12')).toBeVisible()
    await expect(dialog.getByText('Đã xác thực ALPR')).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Đóng', exact: true })).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(dialog.getByRole('button', { name: 'Xác nhận giữ chỗ' })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(dialog.getByRole('button', { name: 'Đóng', exact: true })).toBeFocused()
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
    await page.screenshot({ path: `docs/09-audit/quick-hold-${width}.png` })
    await dialog.getByRole('button', { name: 'Xác nhận giữ chỗ' }).click()
    await expect(dialog.getByText('Giữ Chỗ Thành Công!')).toBeVisible()
    await expect(dialog.getByRole('link', { name: /Mở Vé QR/ })).toHaveAttribute('href', '/bookings')
    const hold = await page.evaluate(() => JSON.parse(localStorage.getItem('smart-truck-parking.active_hold') || '{}'))
    expect(hold.parkingLotId).toBe(1)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Mở giữ chỗ' })).toBeFocused()
    expect(errors).toEqual([])
  })
}
