import fs from 'node:fs'
import {chromium,expect} from '@playwright/test'
const browser=await chromium.launch({channel:'msedge',headless:true})
let page
const calls=[]
try{
 const context=await browser.newContext({viewport:{width:1440,height:1050},locale:'vi-VN'})
 page=await context.newPage()
 page.on('request',request=>{if(request.url()==='https://api.vietqr.io/v2/banks')calls.push({hasAuthorization:Boolean(request.headers().authorization),hasCookie:Boolean(request.headers().cookie)})})
 await page.goto('http://localhost:3000/register')
 if(calls.length)throw new Error('Bank list unnecessarily fetched for driver')
 await page.getByLabel(/Bạn tham gia với vai trò/).selectOption('MERCHANT')
 const input=page.getByRole('combobox',{name:'Tên ngân hàng',exact:true})
 await expect(input).toBeEnabled({timeout:15000})
 await input.fill('VCB')
 const option=page.getByRole('option',{name:/Vietcombank/})
 await expect(option).toBeVisible()
 await expect(option.locator('img')).toBeVisible()
 await expect.poll(()=>option.locator('img').evaluate(image=>image.complete&&image.naturalWidth>0)).toBe(true)
 await input.scrollIntoViewIfNeeded()
 await page.screenshot({path:'../docs/fe-be-integration/vietqr-bank-picker-desktop.png'})
 await input.press('ArrowDown');await input.press('Enter')
 await expect(input).toHaveValue('Vietcombank')
 await expect(page.getByRole('listbox')).toHaveCount(0)
 await expect(input.locator('..').locator('img')).toBeVisible()
 await page.screenshot({path:'../docs/fe-be-integration/vietqr-bank-selected-logo.png'})
 if(calls.some(call=>call.hasAuthorization||call.hasCookie))throw new Error('Private auth sent to public provider')
 await page.setViewportSize({width:390,height:844})
 await input.fill('quân đội')
 await expect(page.getByRole('option',{name:/MBBank/})).toBeVisible()
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))throw new Error('Mobile page overflow')
 await page.screenshot({path:'../docs/fe-be-integration/vietqr-bank-picker-mobile.png'})
 const report={passed:true,source:'https://api.vietqr.io/v2/banks',bankListRequests:calls.length,checks:['No provider request for DRIVER','Real public bank list loaded in Edge','Search by short code VCB and accented full name','Keyboard selection stores Vietcombank','No authorization or cookies sent to bank list provider','390px mobile without page overflow'],writes:0}
 fs.writeFileSync('../docs/fe-be-integration/vietqr-bank-picker-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report))
}catch(error){
 const report={passed:false,error:String(error.message).slice(0,1000),bankListRequests:calls.length}
 fs.writeFileSync('../docs/fe-be-integration/vietqr-bank-picker-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));process.exitCode=1
}finally{await browser.close()}
