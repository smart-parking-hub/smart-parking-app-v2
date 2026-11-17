/** The API uses Vietnam wall-clock timestamps (UTC+7), without a timezone suffix. */
export function bookingTimestamp(value:string):number {
  return Date.parse(/(?:Z|[+-]\d{2}:\d{2})$/.test(value)?value:`${value}+07:00`)
}
export function bookingTimeLabel(value:string|number):string {
  return new Date(typeof value==='number'?value:bookingTimestamp(value)).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})
}
export function vietnamLocalTime(minutes:number):string {
  return vietnamInputTimestamp(Date.now()+minutes*60000)
}
export function vietnamInputTimestamp(timestamp:number):string {
  const date=new Date(timestamp)
  if(!Number.isFinite(date.getTime())||date.getUTCFullYear()<1||date.getUTCFullYear()>9999)return ''
  const parts=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(timestamp))
  const part=(type:Intl.DateTimeFormatPartTypes)=>parts.find(item=>item.type===type)?.value??''
  return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`
}
export function nextBookingStart(now = Date.now()):string {
  return vietnamInputTimestamp((Math.floor(now / 1800000) + 1) * 1800000)
}
export function bookingEnd(start:string, minutes:number):string {
  const time=bookingTimestamp(start)
  return Number.isFinite(time)&&Number.isFinite(minutes) ? vietnamInputTimestamp(time+minutes*60000) : ''
}
export function bookingDayOffset(start:string, value:string):number {
  const from=bookingTimestamp(`${start.slice(0,10)}T00:00`)
  const until=bookingTimestamp(`${value.slice(0,10)}T00:00`)
  return Number.isFinite(from)&&Number.isFinite(until)?Math.round((until-from)/86400000):0
}
export function isBookingBlock(value:string):boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:(00|30)(:00)?$/.test(value)&&Number.isFinite(bookingTimestamp(value))
}
export function bookingDurationLabel(minutes:number):string {
  if(!Number.isSafeInteger(minutes)||minutes<30||minutes%30!==0)return ''
  const days=Math.floor(minutes/1440)
  const hours=Math.floor(minutes%1440/60)
  const remainder=minutes%60
  return [days?`${days} ngày`:'',hours?`${hours} giờ`:'',remainder?`${remainder} phút`:''].filter(Boolean).join(' ')
}
