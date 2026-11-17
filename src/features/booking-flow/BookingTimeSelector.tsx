import { useEffect, useState } from 'react'
import { Field, control } from '@/shared/components/Workspace'
import { bookingDayOffset, bookingDurationLabel, bookingEnd, bookingTimestamp, vietnamInputTimestamp } from './time'
import { BookingArrivalPicker } from './BookingArrivalPicker'
import { BookingDurationPicker } from './BookingDurationPicker'
import type { ScheduleAvailability } from './availability'

interface Props {
  start: string
  minutes: number
  onStartChange: (start: string) => void
  onDurationChange: (minutes: number) => void
  arrivalBlocks?: ScheduleAvailability['blocks']
}
const timeOptions=Array.from({length:48},(_,index)=>`${String(Math.floor(index/2)).padStart(2,'0')}:${index%2?'30':'00'}`)
export function BookingTimeSelector({ start, minutes, onStartChange, onDurationChange, arrivalBlocks }: Props) {
  const [now,setNow]=useState(Date.now)
  useEffect(()=>{
    const refresh=()=>setNow(Date.now())
    const timer=window.setInterval(refresh,10000)
    window.addEventListener('focus',refresh)
    document.addEventListener('visibilitychange',refresh)
    return ()=>{window.clearInterval(timer);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',refresh)}
  },[])
  const day=start.slice(0,10)
  const today=vietnamInputTimestamp(now).slice(0,10)
  const availableTimes=timeOptions.filter(time=>bookingTimestamp(`${day}T${time}`)>now)
  const firstTime=availableTimes[0]
  const unavailableTimes:Record<string,string>={}
  for(const block of arrivalBlocks??[]){
    if(block.start.slice(0,10)!==day)continue
    if(block.status==='BUFFER')unavailableTimes[block.start.slice(11,16)]='Đệm 30p'
    else if(block.status==='PAST')unavailableTimes[block.start.slice(11,16)]='Đã qua'
    else if(block.status==='FULL'||block.remainingCapacity===0)unavailableTimes[block.start.slice(11,16)]='Hết chỗ'
  }
  useEffect(()=>{
    if(/^\d{4}-\d{2}-\d{2}$/.test(day)&&start.slice(11,16)&&bookingTimestamp(start)<=now){
      onStartChange(`${day}T${firstTime??''}`)
    }
  },[day,start,firstTime,now,onStartChange])
  const duration=bookingDurationLabel(minutes)
  const end=duration?bookingEnd(start,minutes):''
  const extraDays=bookingDayOffset(start,end)
  const exitDay=extraDays===0?'Cùng ngày':extraDays===1?'Ngày hôm sau':`Sau ${extraDays} ngày`
  return <>
    <Field label="Ngày đỗ"><input type="date" className={control} min={today}
      value={start.slice(0,10)} onChange={event=>onStartChange(`${event.target.value}T${start.slice(11,16)||'00:00'}`)}/></Field>
    <BookingArrivalPicker day={day} value={start.slice(11,16)} times={availableTimes} unavailableTimes={unavailableTimes}
      emptyLabel={day===today?'Hôm nay đã hết giờ đặt':day?'Ngày này không còn giờ đặt':'Chọn ngày đỗ trước'}
      onRefresh={()=>setNow(Date.now())} onChange={time=>onStartChange(`${day}T${time}`)}/>
    <BookingDurationPicker minutes={minutes} onChange={onDurationChange}/>
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-border bg-brand-surface p-3.5 sm:col-span-2">
      <div><p className="text-xs text-brand-muted">Giờ ra dự kiến</p><p className="mt-1 text-xs text-brand-muted">{duration?`Đỗ ${duration}`:'Chọn thời lượng hợp lệ'}</p></div>
      <output aria-label="Giờ ra dự kiến" className="min-w-0 text-right">
        {end?<><span className="block text-xl font-semibold tabular-nums">{end.slice(11,16)}</span><span className="mt-1 block text-xs text-brand-muted">{end.slice(0,10).split('-').reverse().join('/')} · <span className={extraDays>0?'font-semibold text-brand-primary':''}>{exitDay}</span></span></>:<span className="text-xs text-brand-muted">—</span>}
      </output>
    </div>
  </>
}
