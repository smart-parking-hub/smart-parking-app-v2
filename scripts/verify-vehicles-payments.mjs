import fs from 'node:fs'
import { readLocalEmailCode } from './local-email-inbox.mjs'
import { randomInt, randomBytes, randomUUID } from 'node:crypto'
import { chromium, expect } from '@playwright/test'
const sessions={}
const base='http://localhost:3000'
const reportDir='../docs/fe-be-integration'
const checks=[]
let browser,page,step='start'
let vehicleId
const plate=`51C-${String(Date.now()).slice(-7)}`
async function newDriver(){
 const phone='09'+String(randomInt(100000000)).padStart(8,'0')
 const password=randomBytes(18).toString('base64url')
 async function post(path,body){
  const response=await fetch(`http://localhost:8088/api/v1${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
  if(!response.ok)throw new Error(`Fixture API ${path}: HTTP ${response.status}`)
  return (await response.json()).data
 }
 const email=`real-data-${randomUUID()}@example.test`
 await post('/auth/otp/send',{email})
 const otpCode=await readLocalEmailCode(email)
 await post('/auth/register',{phone,password,otpCode,email,fullName:'Local vehicle data test',role:'DRIVER'})
 const auth=await post('/auth/login',{phone,password})
 return {phone,password,token:auth.token}
}
async function login(account,next){
 await page.goto(`${base}/login?next=${encodeURIComponent(next)}`)
 await page.locator('#login-phone').fill(account.phone)
 await page.locator('#login-password').fill(account.password)
 await page.getByRole('button',{name:'Đăng nhập',exact:true}).click()
 await page.waitForURL(url=>url.pathname===next,{timeout:20000})
}
async function logout(){
 await page.getByRole('button',{name:'Menu tài khoản',exact:true}).click()
 await page.getByRole('button',{name:'Đăng xuất',exact:true}).click()
 await page.waitForURL('**/login')
}
async function mutation(method,path,action){
 const pending=page.waitForResponse(r=>r.url().endsWith(path)&&r.request().method()===method)
 await action();const response=await pending
 if(!response.ok())throw new Error(`Unexpected ${response.status()} for ${method} ${path}`)
 const body=await response.json();return body.data
}
try {
 step='prepare fresh local accounts'
 sessions.a=await newDriver();sessions.b=await newDriver()
 browser=await chromium.launch({channel:'msedge',headless:true})
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh'})
 page=await ctx.newPage()
 step='fresh account empty vehicles'
 await login(sessions.a,'/vehicles')
 await expect(page.getByText('Bạn chưa có phương tiện nào. Thêm xe để bắt đầu đặt chỗ.')).toBeVisible()
 await expect(page.getByText('51D-894.12',{exact:true})).toHaveCount(0)
 await page.screenshot({path:`${reportDir}/real-data-vehicles-empty.png`})
 checks.push('New account A: API and UI show 0 vehicles; no sample fleet')
 step='fresh account empty payments'
 await page.goto(`${base}/payments`)
 await expect(page.getByText('Bạn chưa có giao dịch thanh toán nào.')).toBeVisible()
 await expect(page.getByText('3.420.000',{exact:true})).toHaveCount(0)
 await page.screenshot({path:`${reportDir}/real-data-payments-empty.png`})
 checks.push('New account A: payments empty; no fake VAT, refunds or totals')
 step='create vehicle in UI'
 await page.goto(`${base}/vehicles`)
 await page.getByRole('button',{name:'Thêm phương tiện',exact:true}).click()
 await page.getByLabel('Biển số xe',{exact:true}).fill(plate)
 await page.getByLabel('Loại xe',{exact:true}).selectOption('HEAVY_TRUCK')
 await page.getByLabel('Trọng tải (tấn)',{exact:true}).fill('12.5')
 await page.getByLabel('Nhãn hiệu / Model (không bắt buộc)',{exact:true}).fill('Local integration vehicle')
 const vehicle=await mutation('POST','/api/v1/vehicles',()=>page.getByRole('button',{name:'Lưu phương tiện',exact:true}).click())
 vehicleId=vehicle.id
 await expect(page.getByText(plate,{exact:true})).toBeVisible()
 await page.reload();await expect(page.getByText(plate,{exact:true})).toBeVisible()
 checks.push('Create via UI persists to Backend and survives reload')
 step='edit vehicle'
 await page.getByRole('button',{name:`Sửa xe ${plate}`,exact:true}).click()
 await page.getByLabel('Trọng tải (tấn)',{exact:true}).fill('14.5')
 await mutation('PUT',`/api/v1/vehicles/${vehicleId}`,()=>page.getByRole('button',{name:'Lưu phương tiện',exact:true}).click())
 await page.reload();await expect(page.getByText('14.5 tấn',{exact:true})).toBeVisible()
 await page.screenshot({path:`${reportDir}/real-data-vehicles-saved.png`})
 checks.push('Edit via UI is persisted by PUT and visible after reload')
 step='account isolation'
 await logout();await login(sessions.b,'/vehicles')
 await expect(page.getByText('Bạn chưa có phương tiện nào. Thêm xe để bắt đầu đặt chỗ.')).toBeVisible()
 await expect(page.getByText(plate,{exact:true})).toHaveCount(0)
 const forbidden=await fetch(`http://localhost:8088/api/v1/vehicles/${vehicleId}`,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${sessions.b.token}`},body:JSON.stringify({licensePlate:plate,vehicleType:'HEAVY_TRUCK',weightTon:99,brandModel:'Unauthorized test'})})
 if(forbidden.status!==403)throw new Error('Cross-account vehicle update was not forbidden')
 await page.goto(`${base}/payments`);await expect(page.getByText('Bạn chưa có giao dịch thanh toán nào.')).toBeVisible()
 checks.push('Same-browser logout/login to account B does not show A records; Backend rejects cross-owner update with 403')
 step='deactivate vehicle'
 await logout();await login(sessions.a,'/vehicles')
 await expect(page.getByText('14.5 tấn',{exact:true})).toBeVisible()
 await page.getByRole('button',{name:`Ngừng sử dụng xe ${plate}`,exact:true}).click()
 await mutation('DELETE',`/api/v1/vehicles/${vehicleId}`,()=>page.getByRole('button',{name:'Xác nhận ngừng sử dụng',exact:true}).click())
 await page.reload();await expect(page.getByText('Ngừng sử dụng',{exact:true})).toBeVisible()
 const active=await fetch('http://localhost:8088/api/v1/vehicles?size=100',{headers:{Authorization:`Bearer ${sessions.a.token}`}})
 const body=await active.json()
 if(!body.data.content.some(v=>v.id===vehicleId&&v.status==='INACTIVE'))throw new Error('Vehicle deactivation did not persist')
 checks.push('Deactivation is soft delete; server returns INACTIVE after reload')
 step='mobile layout'
 await page.setViewportSize({width:390,height:844})
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))throw new Error('Mobile horizontal overflow')
 await page.screenshot({path:`${reportDir}/real-data-vehicles-mobile.png`})
 checks.push('390px mobile has no page overflow')
 step='existing actual payment history'
 if(fs.existsSync('../smart-parking-service-microservice/.env.p0-session.json')){
  const prior=JSON.parse(fs.readFileSync('../smart-parking-service-microservice/.env.p0-session.json','utf8')).driver
  const freshAuth=await fetch('http://localhost:8088/api/v1/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:prior.phone,password:prior.password})})
  if(!freshAuth.ok)throw new Error('Existing payment fixture login unavailable')
  prior.token=(await freshAuth.json()).data.token
  const response=await fetch('http://localhost:8088/api/v1/payments?size=20&sort=id,desc',{headers:{Authorization:`Bearer ${prior.token}`}})
  const priorPage=await response.json()
  if(response.ok&&priorPage.data?.content?.length){
   await logout();await login(prior,'/payments')
   const actual=priorPage.data.content[0]
   await expect(page.getByText(actual.transactionCode,{exact:true})).toBeVisible()
   if(actual.gateway==='DEMO')await expect(page.getByText('Demo (thử nghiệm)',{exact:true}).first()).toBeVisible()
   await page.screenshot({path:`${reportDir}/real-data-payments-existing.png`})
   checks.push('Existing account: payment transaction code matches live API, DEMO labeled honestly')
  } else throw new Error('Existing fixture has no payments; positive-history check needs data')
 }
 const report={passed:true,checks,vehicleId,mode:'Real localhost APIs; new DRIVER test accounts; no money movement'}
 fs.writeFileSync(`${reportDir}/vehicles-payments-browser-results.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2))
} catch(error){
 let detail=String(error.message)
 for(const account of Object.values(sessions))for(const secret of Object.values(account))if(typeof secret==='string')detail=detail.replaceAll(secret,'[redacted]')
 const report={passed:false,failedStep:step,detail:detail.slice(0,1000),pageText:(await page?.locator('main').innerText())?.slice(-2000),checks,vehicleId}
 fs.writeFileSync(`${reportDir}/vehicles-payments-browser-results.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));process.exitCode=1
} finally {await browser?.close()}
