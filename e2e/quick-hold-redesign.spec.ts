import { test, expect } from '@playwright/test'

test.use({ baseURL: process.env.QUICK_HOLD_BASE_URL || 'http://127.0.0.1:5174' })

for (const width of [390, 1440]) {
  test(`quick book real server reservation flow, keyboard and verification at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    let bookingRequestBody: Record<string, unknown> | null = null
    const serverBooking = {
      id: 88,
      bookingCode: 'BK-SERVER-88',
      parkingLotId: 1,
      merchantId: 5,
      parkingLotName: 'Bãi Xe Phía Nam',
      parkingLotAddress: '123 Quốc Lộ 1A',
      vehicleId: 3,
      vehiclePlate: '51C-12345',
      status: 'PENDING_PAYMENT',
      advanceDeposit: 15000,
      totalAmount: 75000,
      hourlyRate: 25000,
      surgeMultiplier: 1.2,
      surgeStartTime: '17:00:00',
      surgeEndTime: '20:00:00',
      overtimePenaltyMultiplier: 2,
      expectedCheckInTime: new Date(Date.now() + 1800000).toISOString(),
      expectedCheckOutTime: new Date(Date.now() + 9000000).toISOString(),
      expiresAt: new Date(Date.now() + 900000).toISOString(),
    }
    const serverBookingsList: Array<typeof serverBooking> = []

    // Intercept API routes
    await page.route('**/api/v1/vehicles**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            content: [
              {
                id: 3,
                licensePlate: '51C-12345',
                vehicleType: 'HEAVY_TRUCK',
                status: 'ACTIVE',
              },
            ],
            totalElements: 1,
            totalPages: 1,
            size: 100,
            number: 0,
          },
        }),
      })
    })

    await page.route('**/api/v1/parking-lots/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 1,
            name: 'Bãi Xe Phía Nam',
            address: '123 Quốc Lộ 1A',
            status: 'APPROVED',
            merchantId: 5,
            slots: [
              {
                vehicleType: 'HEAVY_TRUCK',
                availableCapacity: 5,
                totalCapacity: 10,
              },
            ],
            pricingRules: [
              {
                vehicleType: 'HEAVY_TRUCK',
                basePricePerHour: 25000,
                surgeMultiplier: 1.2,
                surgeStartTime: '17:00:00',
                surgeEndTime: '20:00:00',
                overtimePenaltyMultiplier: 2,
              },
            ],
          },
        }),
      })
    })

    await page.route(/\/api\/v1\/bookings/, async (route) => {
      const url = new URL(route.request().url())
      if (route.request().method() === 'POST') {
        bookingRequestBody = route.request().postDataJSON()
        serverBookingsList.push(serverBooking)
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: serverBooking }),
        })
      } else if (url.pathname.endsWith('/88')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: serverBooking }),
        })
      } else {
        // Initial GET before POST returns empty list; after POST returns populated list
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              content: [...serverBookingsList],
              totalElements: serverBookingsList.length,
              totalPages: serverBookingsList.length > 0 ? 1 : 0,
              size: 100,
              number: 0,
            },
          }),
        })
      }
    })

    // Isolate component from live map services
    await page.route('**/src/main.tsx', (route) =>
      route.fulfill({ contentType: 'application/javascript', body: '' }),
    )
    await page.goto('/')

    await page.evaluate(async () => {
      try {
        const meta = await (
          await fetch('/node_modules/.vite/deps/_metadata.json')
        ).json()
        const v = meta.browserHash
        const load = (path: string) => import(/* @vite-ignore */ path)
        const loadDep = (file: string) =>
          import(/* @vite-ignore */ `/node_modules/.vite/deps/${file}?v=${v}`)

        const ReactModule = await loadDep('react.js')
        const React = ReactModule.default || ReactModule
        const useState = React.useState
        const ReactDOMModule = await loadDep('react-dom_client.js')
        const ReactDOM = ReactDOMModule.default || ReactDOMModule
        const { MemoryRouter, Routes, Route } = await loadDep(
          'react-router-dom.js',
        )
        const { QueryClient, QueryClientProvider } = await loadDep(
          '@tanstack_react-query.js',
        )
        const { InlineQuickBookPanel } = await load(
          '/src/features/parking-search/components/InlineQuickBookPanel.tsx',
        )
        const { MyBookingsPage } = await load(
          '/src/features/bookings/pages/MyBookingsPage.tsx',
        )
        await load('/src/styles/globals.css')

        const queryClient = new QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        })

        function Harness() {
          const [open, setOpen] = useState(false)
          return React.createElement(
            QueryClientProvider,
            { client: queryClient },
            React.createElement(
              MemoryRouter,
              { initialEntries: ['/parking'] },
              React.createElement(
                'div',
                { id: 'app-container' },
                React.createElement(
                  'button',
                  {
                    id: 'trigger',
                    type: 'button',
                    onClick: () => setOpen(true),
                  },
                  'Mở đặt chỗ',
                ),
                React.createElement(
                  Routes,
                  null,
                  React.createElement(Route, {
                    path: '/parking',
                    element: React.createElement(InlineQuickBookPanel, {
                      open,
                      onClose: () => setOpen(false),
                      lot: {
                        id: 1,
                        name: 'Bãi Xe Phía Nam',
                        address: '123 Quốc Lộ 1A',
                        distanceKm: 2.5,
                        etaMinutes: 10,
                        availableSlots: 5,
                        totalSlots: 10,
                        slotTypeLabel: 'Còn 5 chỗ',
                        hourlyRate: 25000,
                        depositAmount: 15000,
                        amenities: [],
                        latitude: 10.7,
                        longitude: 106.6,
                        ratingAverage: 4.8,
                      },
                    }),
                  }),
                  React.createElement(Route, {
                    path: '/bookings',
                    element: React.createElement(MyBookingsPage, null),
                  }),
                ),
              ),
            ),
          )
        }

        document.body.innerHTML = '<div id="root"></div>'
        const root = ReactDOM.createRoot(document.getElementById('root')!)
        root.render(React.createElement(Harness, null))
      } catch (err) {
        console.error('EVALUATE_ERROR:', err)
        throw err
      }
    })

    const triggerBtn = page.locator('#trigger')
    await triggerBtn.click()

    const dialog = page.getByRole('dialog', { name: 'Panel giữ chỗ nhanh 10 phút' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { level: 2, name: 'Đặt giữ chỗ nhanh' })).toBeVisible()
    await expect(dialog.getByText('Bãi Xe Phía Nam')).toBeVisible()

    // R1: Assert no 10-minute hold promise remains in heading, eyebrow or body
    await expect(dialog.getByText(/khẩn cấp \(10 Phút\)/i)).toHaveCount(0)
    await expect(dialog.getByText(/giữ chỗ nhanh 10 phút/i)).toHaveCount(0)

    // Keyboard navigation: Escape key closes modal and restores focus to trigger button
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(triggerBtn).toBeFocused()

    // Re-open dialog via trigger button
    await triggerBtn.click()
    await expect(dialog).toBeVisible()

    // Real vehicle select option is loaded from API and attached
    const vehicleOption = dialog.getByRole('option', { name: /51C-12345/ })
    await expect(vehicleOption).toBeAttached()
    await expect(dialog.getByRole('combobox')).toHaveValue('3')

    // 15-minute deposit rule and 20% deposit notice is shown
    await expect(dialog.getByText(/20%/)).toBeVisible()
    await expect(dialog.getByText(/15 phút/).first()).toBeVisible()

    // No fake ALPR or fake active_hold text
    await expect(dialog.getByText('Đã xác thực ALPR')).toHaveCount(0)

    // Verify dialog width fits without horizontal overflow
    const hasHorizontalOverflow = await dialog.evaluate(
      (el) => el.scrollWidth > el.clientWidth,
    )
    expect(hasHorizontalOverflow).toBe(false)

    // Save screenshot to .artifacts directory
    await page.screenshot({ path: `.artifacts/playwright/quick-hold-${width}.png` })

    // Submit booking
    const submitBtn = dialog.getByRole('button', {
      name: 'Tạo booking và xem tiền cọc',
    })
    const closeBtn = dialog.getByRole('button', { name: 'Đóng', exact: true })
    await expect(submitBtn).toBeEnabled()
    await closeBtn.focus()
    await page.keyboard.press('Shift+Tab')
    await expect(submitBtn).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(closeBtn).toBeFocused()
    await submitBtn.click()

    // Server booking code and status are displayed
    await expect(dialog.getByText('BK-SERVER-88', { exact: true })).toBeVisible()
    await expect(dialog.getByText('Chờ thanh toán cọc')).toBeVisible()

    // Verify POST payload DTO
    expect(bookingRequestBody).toMatchObject({
      parkingLotId: 1,
      vehicleId: 3,
      vehicleType: 'HEAVY_TRUCK',
    })
    expect((bookingRequestBody as Record<string, unknown> | null)?.requestId).toBeTruthy()

    // Verify NO fake hold written to localStorage
    const hold = await page.evaluate(() =>
      localStorage.getItem('smart-truck-parking.active_hold'),
    )
    expect(hold).toBeNull()

    // Navigate to /bookings via the returned link
    const bookingsLink = dialog.getByRole('link', {
      name: 'Xem các lượt đặt chỗ',
    })
    await bookingsLink.click()

    // Server booking appears in /bookings list
    await expect(page.getByText('BK-SERVER-88', { exact: true })).toBeVisible()
    await expect(page.getByText('Bãi Xe Phía Nam')).toBeVisible()

    expect(errors).toEqual([])
  })
}
