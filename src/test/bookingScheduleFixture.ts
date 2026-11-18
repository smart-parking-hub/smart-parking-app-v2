import { nextBookingStart, bookingEnd } from '@/features/booking-flow/time'

export function bookingScheduleFixture(remainingCapacity=2, physical=false, day=nextBookingStart().slice(0,10)) {
  return {
    timezone:'Asia/Ho_Chi_Minh',blockMinutes:30,bufferMinutes:30,checkInEarlyMinutes:15,turnaroundMinutes:15,allocationMode:physical?'PHYSICAL':'GROUP',
    updatedAt:nextBookingStart(),remainingCapacity,slots:physical?[{id:'slot-a',code:'A01'}]:[],
    blocks:Array.from({length:48},(_,index)=>{
      const start=`${day}T${String(Math.floor(index/2)).padStart(2,'0')}:${index%2?'30':'00'}`
      return {start:`${start}:00`,end:`${bookingEnd(start,30)}:00`,remainingCapacity,status:remainingCapacity?'AVAILABLE':'FULL'}
    }),
  }
}

/** Match the API's requested day so overnight tests never repeat the first page. */
export function bookingScheduleRequestFixture(config?:{params?:unknown}, remainingCapacity=2, physical=false) {
  const params=config?.params
  const day=params&&typeof params==='object'&&'date' in params&&typeof params.date==='string'?params.date:undefined
  return bookingScheduleFixture(remainingCapacity,physical,day)
}
