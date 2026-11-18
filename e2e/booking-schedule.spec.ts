import { test, expect } from '@playwright/test'
import { mockBookingSchedule } from './fixtures/booking-schedule'

for(const width of [390,1440])test(`30 minute blocks and buffer with one shared slot at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:1000})
  await page.clock.install({time:new Date('2026-11-17T00:00:00Z')})
  const errors:string[]=[]
  page.on('pageerror',error=>errors.push(error.message))
  await page.addInitScript(()=>localStorage.setItem('access_token',`test.${btoa(JSON.stringify({role:'ROLE_DRIVER',userId:88,exp:2000000000}))}.test`))
  const lot={id:7,name:'Bãi xe thử lịch 30 phút',address:'Thủ Đức, TP. Hồ Chí Minh',status:'APPROVED',merchantId:9,
    slots:[{vehicleType:'HEAVY_TRUCK',availableCapacity:0,totalCapacity:1}],
    pricingRules:[{vehicleType:'HEAVY_TRUCK',basePricePerHour:20000,surgeMultiplier:1,surgeStartTime:null,surgeEndTime:null,overtimePenaltyMultiplier:1.5}]}
  let input:Record<string,unknown>|undefined
  const booking={id:941,bookingCode:'BK-SCHEDULE-941',parkingLotId:7,merchantId:9,vehicleId:3,vehiclePlate:'51C-12345',
    parkingLotName:lot.name,parkingLotAddress:lot.address,status:'PENDING_PAYMENT',advanceDeposit:16000,totalAmount:80000,hourlyRate:20000,
    expectedCheckInTime:'2026-11-17T08:00:00',expectedCheckOutTime:'2026-11-17T12:00:00',expiresAt:'2026-11-17T07:15:00',
    schedulePolicyVersion:1,checkInEarlyMinutes:0,turnaroundMinutes:30,physicalSlotId:'slot-a',physicalSlotCode:'A01'}
  await page.route('**/api/v1/**',async route=>{
    const url=new URL(route.request().url())
    let data:unknown={content:[]}
    if(url.pathname==='/api/v1/parking-lots/7')data=lot
    else if(url.pathname==='/api/v1/vehicles')data={content:[{id:3,licensePlate:'51C-12345',vehicleType:'HEAVY_TRUCK',status:'ACTIVE'}]}
    else if(url.pathname==='/api/v1/bookings'&&route.request().method()==='POST'){input=route.request().postDataJSON();data=booking}
    else if(url.pathname==='/api/v1/bookings/941')data=booking
    else if(url.pathname.endsWith('/unread-count'))data=0
    else if(url.pathname.endsWith('/driver/profile')||url.pathname.endsWith('/users/me'))data={id:88,fullName:'Tài xế kiểm thử',role:'DRIVER'}
    else if(url.pathname==='/api/v1/driver/wallet')data={availableAmount:0,heldAmount:0,currency:'VND',enabled:true}
    else if(url.pathname==='/api/v1/payments/wallet')data=null
    await route.fulfill({json:{data}})
  })
  await mockBookingSchedule(page,true,true)
  await page.goto('/parking/7')
  const start=page.getByRole('button',{name:'Giờ vào dự kiến'})
  const picker=page.getByRole('dialog',{name:'Chọn giờ vào dự kiến'})
  const chooseTime=async(time:string)=>{await start.click();await picker.getByRole('button',{name:time,exact:true}).click()}
  await start.click()
  const choices=picker.locator('[data-time]')
  await expect(choices).toHaveCount(33)
  await expect(choices.first()).toHaveText('07:30')
  await expect(choices.last()).toHaveText('23:30')
  const bounds=await picker.boundingBox()
  expect(bounds).not.toBeNull();expect(bounds!.x).toBeGreaterThanOrEqual(0);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(width)
  await page.screenshot({path:`.artifacts/playwright/booking-time-grid-${width}.png`,fullPage:true})
  await picker.getByRole('button',{name:'08:00',exact:true}).click()
  await expect(start).toBeFocused()
  await expect(page.getByRole('button',{name:'2 giờ',exact:true})).toHaveAttribute('aria-pressed','true')
  await page.getByRole('button',{name:'Thời lượng khác'}).click()
  await page.getByLabel('Số giờ đỗ').fill('1')
  await page.getByLabel('Thêm phút').selectOption('30')
  await expect(page.getByLabel('Giờ ra dự kiến')).toContainText('09:30')
  await page.getByRole('button',{name:'4 giờ',exact:true}).click()
  await expect(page.getByRole('button',{name:'4 giờ',exact:true})).toHaveAttribute('aria-pressed','true')
  await expect(page.getByLabel('Số giờ đỗ')).toHaveCount(0)
  await page.getByRole('group',{name:'Phương tiện và giờ đỗ (giờ Việt Nam UTC+7)',exact:true}).screenshot({path:`.artifacts/playwright/booking-duration-${width}.png`})
  const submit=page.getByRole('button',{name:'Tạo booking và xem tiền cọc'})
  await expect(submit).toBeEnabled()
  await page.getByRole('combobox',{name:'Ô đỗ'}).selectOption('slot-a')
  const timeline = page.getByRole('region', { name: 'Lịch đặt theo block 30 phút' })
  const gridView = timeline.getByRole('button', { name: 'Lưới', exact: true })
  const rowView = timeline.getByRole('button', { name: 'Hàng ngang', exact: true })
  const selectedBlock = timeline.getByRole('button', { name: '08:00 đến 08:30: 1 chỗ' })
  const bufferBlock = timeline.getByRole('button', { name: '15:00 đến 15:30: Đệm 30p' })
  await expect(gridView).toHaveAttribute('aria-pressed', 'true')
  const grid = timeline.getByRole('region', { name: 'Lịch dạng lưới' })
  await expect(grid).toBeVisible()
  expect(await grid.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true)
  await expect(selectedBlock).toHaveAttribute('aria-pressed', 'true')
  await expect(bufferBlock).toBeDisabled()

  await rowView.focus()
  await rowView.press('Enter')
  await expect(rowView).toBeFocused()
  await expect(rowView).toHaveAttribute('aria-pressed', 'true')
  const row = timeline.getByRole('region', { name: 'Cuộn ngang để xem lịch' })
  expect(await row.evaluate(node => node.scrollWidth > node.clientWidth && node.scrollLeft > 0)).toBe(true)
  await row.scrollIntoViewIfNeeded()
  await expect(selectedBlock).toBeInViewport()
  await expect(selectedBlock).toHaveAttribute('aria-pressed', 'true')
  await expect(bufferBlock).toBeDisabled()
  await expect(page.getByRole('combobox', { name: 'Ô đỗ' })).toHaveValue('slot-a')
  await timeline.screenshot({path:`.artifacts/playwright/booking-schedule-row-${width}.png`})
  await gridView.click()
  await expect(gridView).toHaveAttribute('aria-pressed', 'true')
  await expect(selectedBlock).toHaveAttribute('aria-pressed', 'true')
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false)
  await timeline.screenshot({path:`.artifacts/playwright/booking-schedule-grid-${width}.png`})
  await page.screenshot({path:`.artifacts/playwright/booking-schedule-${width}.png`,fullPage:true})
  await start.click()
  await expect(picker.getByRole('button',{name:'13:00 · Hết chỗ',exact:true})).toBeDisabled()
  await expect(picker.getByRole('button',{name:'15:00 · Đệm 30p',exact:true})).toBeDisabled()
  await expect(picker.getByRole('button',{name:'15:30',exact:true})).toBeEnabled()
  await picker.getByRole('button',{name:'13:00 · Hết chỗ',exact:true}).scrollIntoViewIfNeeded()
  await picker.screenshot({path:`.artifacts/playwright/booking-arrival-full-${width}.png`})
  await page.keyboard.press('Escape')
  // A free arrival block alone does not guarantee capacity for the full duration.
  await chooseTime('12:00');await expect(submit).toBeDisabled()
  await expect(page.getByText(/Không có chỗ trống suốt khung giờ/)).toBeVisible()
  await timeline.getByRole('button', { name: '15:30 đến 16:00: 1 chỗ' }).click()
  await expect(start).toContainText('15:30')
  await expect(submit).toBeEnabled()
  await page.getByRole('button',{name:'Thời lượng khác'}).click()
  await page.getByLabel('Số giờ đỗ').fill('0');await expect(submit).toBeDisabled()
  await page.getByLabel('Số giờ đỗ').fill('')
  await expect(page.getByText('Vui lòng nhập thời lượng đỗ.')).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(1)
  await expect(page.locator('body')).not.toContainText(/Expected number|received nan/i)
  await expect(submit).toBeDisabled()
  await chooseTime('23:30');await page.getByRole('button',{name:'2 giờ',exact:true}).click()
  await expect(page.getByLabel('Giờ ra dự kiến')).toContainText('Ngày hôm sau')
  const midnight=page.getByRole('button',{name:/^00:00 đến 00:30.*\+1 ngày/})
  await expect(midnight).toContainText('18/11/2026')
  await expect(midnight).toHaveAttribute('aria-pressed','true')
  await expect(page.getByRole('button',{name:/^01:30 đến 02:00.*\+1 ngày/})).toHaveCount(0)
  await midnight.scrollIntoViewIfNeeded()
  await page.screenshot({path:`.artifacts/playwright/booking-schedule-overnight-${width}.png`,fullPage:true})
  await chooseTime('08:00');await page.getByRole('button',{name:'4 giờ',exact:true}).click()
  await expect(submit).toBeEnabled();await page.getByRole('combobox',{name:'Ô đỗ'}).selectOption('slot-a')
  await submit.click();await expect(page.getByText('#941',{exact:true})).toBeVisible()
  expect(input).toMatchObject({expectedCheckInTime:'2026-11-17T08:00:00',expectedCheckOutTime:'2026-11-17T12:00:00',physicalSlotId:'slot-a',vehicleId:3})
  expect(errors).toEqual([])
})
