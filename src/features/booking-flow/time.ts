/** The API uses Vietnam wall-clock timestamps (UTC+7), without a timezone suffix. */
export function bookingTimestamp(value:string):number {
  return Date.parse(/(?:Z|[+-]\d{2}:\d{2})$/.test(value)?value:`${value}+07:00`)
}
export function bookingTimeLabel(value:string|number):string {
  return new Date(typeof value==='number'?value:bookingTimestamp(value)).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})
}
export function vietnamLocalTime(minutes:number):string {
  const parts=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(Date.now()+minutes*60000))
  const part=(type:Intl.DateTimeFormatPartTypes)=>parts.find(item=>item.type===type)?.value??''
  return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`
}
