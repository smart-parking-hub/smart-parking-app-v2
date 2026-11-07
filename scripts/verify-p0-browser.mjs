import fs from 'node:fs'
import path from 'node:path'
import { chromium, expect } from '@playwright/test'
// Run verify-p0-local.py first. Session secrets remain in a git-ignored file.
const session=JSON.parse(fs.readFileSync('../smart-parking-service-microservice/.env.p0-session.json','utf8'))
const reportDir=path.resolve('../docs/fe-be-integration')
const base='http://localhost:3000'
const checks=[]
let step='start browser'
let browser
let booking
let debugPage
const requests=[]
async function login(page,account,next){
 await page.goto(`${base}/login?next=${encodeURIComponent(next)}`)
 await page.locator('#login-phone').fill(account.phone)
 await page.locator('#login-password').fill(account.password)
 await page.getByRole('button',{name:'Đăng nhập',exact:true}).click()
 await page.waitForURL(url=>url.pathname===next.split('?')[0],{timeout:20000})
}
async function mutation(page,suffix,click){
 const pending=page.waitForResponse(response=>response.url().endsWith(suffix)&&response.request().method()==='POST',{timeout:20000})
 await click()
 const response=await pending
 if(!response.ok())throw new Error('API rejected operation')
 return (await response.json()).data
}
try {
 browser=await chromium.launch({channel:'msedge',headless:true})
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh'})
 const page=await ctx.newPage(); debugPage=page
 page.on('response',response=>{const url=new URL(response.url());if(url.pathname.startsWith('/api/'))requests.push({path:url.pathname,status:response.status()})})
 step='driver login and live map'
 await login(page,session.driver,'/parking')
 const lotResponse=await fetch(`http://localhost:8088/api/v1/parking-lots/${session.lotId}`,{headers:{Authorization:`Bearer ${session.driver.token}`}})
 const lot=(await lotResponse.json()).data
 const card=page.getByRole('button',{name:`Chọn bãi xe ${lot.name}`,exact:true})
 await expect(card).toBeVisible({timeout:20000})
 await card.getByRole('button',{name:/ĐẶT CHỖ/}).click()
 const dialog=page.getByRole('dialog',{name:'Đặt chỗ và thanh toán cọc'})
 await expect(dialog.getByRole('button',{name:'Tạo booking và xem tiền cọc'})).toBeEnabled({timeout:15000})
 await expect(dialog.getByText('30 phút',{exact:true})).toBeVisible()
 await page.screenshot({path:path.join(reportDir,'p0-live-desktop-form.png'),fullPage:false})
 checks.push('Driver login → live lot on map → real vehicle/tariff form')
 step='create booking and explicit local DEMO deposit'
 booking=await mutation(page,'/api/v1/bookings',()=>dialog.getByRole('button',{name:'Tạo booking và xem tiền cọc'}).click())
 await expect(dialog.getByText(booking.bookingCode,{exact:true})).toBeVisible()
 await mutation(page,'/api/v1/payments/demo-confirm',()=>dialog.getByRole('button',{name:'Thanh toán Demo (chỉ local)'}).click())
 await expect(dialog.getByText('Đã cọc · Chờ check-in',{exact:true})).toBeVisible({timeout:15000})
 checks.push('UI creates server booking → DEMO API confirms deposit → PENDING_CHECKIN')
 await page.setViewportSize({width:390,height:844})
 await expect(dialog).toBeVisible()
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2)
 if(overflow)throw new Error('Mobile overflow')
 await page.screenshot({path:path.join(reportDir,'p0-live-mobile-paid.png'),fullPage:false})
 checks.push('390px mobile view without horizontal overflow')
 step='merchant check-in'
 const merchantContext=await browser.newContext({viewport:{width:1440,height:1000},locale:'vi-VN'})
 const merchant=await merchantContext.newPage()
 await login(merchant,session.merchant,`/merchant/qr-scanner?lot=${session.lotId}&code=${encodeURIComponent(booking.bookingCode)}`)
 await mutation(merchant,'/api/v1/merchant/check-in',()=>merchant.getByRole('button',{name:'Xác nhận xe vào bãi'}).click())
 await expect(merchant.getByText('Xe đã được ghi nhận vào bãi.',{exact:true})).toBeVisible()
 checks.push('Merchant UI confirms paid arrival within 30 minute window')
 step='merchant checkout and cash settlement'
 await merchant.getByRole('button',{name:'XE RA',exact:true}).click()
 await mutation(merchant,'/api/v1/merchant/check-out',()=>merchant.getByRole('button',{name:'Kiểm tra & quyết toán xe ra'}).click())
 await expect(merchant.getByRole('dialog',{name:'Quyết toán lượt đỗ'})).toBeVisible()
 await merchant.screenshot({path:path.join(reportDir,'p0-live-merchant-settlement.png'),fullPage:false})
 await mutation(merchant,'/api/v1/merchant/confirm-cash',()=>merchant.getByRole('button',{name:'Đã nhận đủ tiền mặt · Hoàn tất lượt đỗ'}).click())
 await expect(merchant.getByText('Đã xác nhận thu tiền mặt và trả chỗ thành công.',{exact:true})).toBeVisible()
 checks.push('Merchant UI calculates balance → confirms cash received → completes booking')
 step='final server verification'
 const final=await fetch(`http://localhost:8088/api/v1/bookings/${booking.id}`,{headers:{Authorization:`Bearer ${session.driver.token}`}})
 if((await final.json()).data.status!=='COMPLETED')throw new Error('Booking did not complete')
 const slots=await fetch(`http://localhost:8088/api/v1/parking-lots/${session.lotId}/slots`)
 if(!(await slots.json()).data.some(slot=>slot.vehicleType==='HEAVY_TRUCK'&&slot.availableCapacity===2))throw new Error('Capacity not released')
 checks.push('Server confirms COMPLETED and both fixture slots available')
 const report={passed:true,paymentMode:'Explicit localhost DEMO; final cash confirmation',bookingId:booking.id,checks}
 fs.writeFileSync(path.join(reportDir,'p0-live-browser-results.json'),JSON.stringify(report,null,2))
 console.log(JSON.stringify(report,null,2))
} catch(error) {
 let detail=String(error.message)
 for(const account of [session.driver,session.merchant])for(const secret of Object.values(account))if(typeof secret==='string')detail=detail.replaceAll(secret,'[redacted]')
 const report={passed:false,failedStep:step,errorType:error.name,detail:detail.slice(0,700),pageText:(await debugPage?.locator('body').innerText())?.slice(-1800),requests,bookingId:booking?.id,checks}
 fs.writeFileSync(path.join(reportDir,'p0-live-browser-results.json'),JSON.stringify(report,null,2))
 console.log(JSON.stringify(report,null,2))
 process.exitCode=1
} finally {await browser?.close()}
