import fs from 'node:fs'
import {chromium,expect} from '@playwright/test'
const s=JSON.parse(fs.readFileSync('../smart-parking-service-microservice/.env.p0-session.json','utf8'))
const browser=await chromium.launch({channel:'msedge',headless:true})
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:1000}})
 await ctx.addInitScript(token=>localStorage.setItem('access_token',token),s.driver.token)
 const page=await ctx.newPage()
 await page.goto('http://localhost:3000/parking')
 const marker=page.locator('.leaflet-marker-icon').first()
 await expect(marker).toBeAttached({timeout:20000})
 await marker.scrollIntoViewIfNeeded()
 await expect(page.locator('.leaflet-tile-loaded').first()).toBeAttached({timeout:15000}).catch(()=>{})
 const report={markers:await page.locator('.leaflet-marker-icon').count(),loadedTiles:await page.locator('.leaflet-tile-loaded').count(),tileErrorBanner:await page.getByText(/Chưa tải được nền bản đồ/).count()}
 await page.screenshot({path:'../docs/fe-be-integration/p0-live-map.png'})
 fs.writeFileSync('../docs/fe-be-integration/p0-live-map-results.json',JSON.stringify(report,null,2))
 console.log(JSON.stringify(report))
}finally{await browser.close()}
