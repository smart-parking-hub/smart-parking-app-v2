import type { Page } from '@playwright/test'

export async function mockBookingSchedule(page: Page, physical=false, busyAfternoon=false) {
  await page.route(/\/api\/v1\/parking-lots\/\d+\/(availability|timeline)(?:\?|$)/, async route=>{
    const url=new URL(route.request().url())
    const policy={timezone:'Asia/Ho_Chi_Minh',blockMinutes:30,bufferMinutes:30,checkInEarlyMinutes:15,turnaroundMinutes:15,allocationMode:physical?'PHYSICAL':'GROUP',updatedAt:'2026-11-17T07:00:00'}
    const remaining=(start:string,end:string)=>{
      const from=Date.parse(`${start}+07:00`),until=Date.parse(`${end}+07:00`)+1800000
      const date=start.slice(0,10)
      return busyAfternoon&&from<Date.parse(`${date}T15:30:00+07:00`)&&Date.parse(`${date}T13:00:00+07:00`)<until?0:1
    }
    if(url.pathname.endsWith('/availability')){
      const count=remaining(url.searchParams.get('start')!,url.searchParams.get('end')!)
      await route.fulfill({json:{data:{...policy,remainingCapacity:count,slots:physical&&count?[{id:'slot-a',code:'A01'}]:[],blocks:[]}}})
    } else {
      const day=url.searchParams.get('date')!
      const blocks=Array.from({length:48},(_,i)=>{
        const start=`${day}T${String(Math.floor(i/2)).padStart(2,'0')}:${i%2?'30':'00'}:00`
        const endTime=new Date(Date.parse(`${start}+07:00`)+1800000+7*3600000).toISOString().slice(0,19)
        const count=remaining(start,endTime)
        return {start,end:endTime,remainingCapacity:count,status:count?'AVAILABLE':i===25||i===30?'BUFFER':'FULL'}
      })
      await route.fulfill({json:{data:{...policy,remainingCapacity:0,slots:[],blocks}}})
    }
  })
}
