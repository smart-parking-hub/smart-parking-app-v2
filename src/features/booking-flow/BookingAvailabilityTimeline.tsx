import { useEffect, useRef } from 'react'
import { Notice, secondary } from '@/shared/components/Workspace'
import type { ScheduleAvailability } from './availability'
import { bookingDayOffset, bookingTimestamp } from './time'

interface Props {
  data?: ScheduleAvailability
  loading: boolean
  error?: string
  start: string
  end: string
  onSelect: (start: string) => void
  onRetry: () => void
  disabled?: boolean
  hasMore?: boolean
  loadingMore?: boolean
  onLoadNext?: () => void
}
export function BookingAvailabilityTimeline({ data, loading, error, start, end, onSelect, onRetry, disabled=false, hasMore=false, loadingMore=false, onLoadNext }: Props) {
  const track=useRef<HTMLDivElement>(null)
  const firstBlockStart=data?.blocks[0]?.start
  useEffect(()=>{
    track.current?.querySelector('[data-selection-start="true"]')?.scrollIntoView?.({block:'nearest',inline:'center'})
  },[start,firstBlockStart])
  if(error)return <Notice error><p>{error}</p><button type="button" className={secondary} onClick={onRetry}>Tải lại lịch trống</button></Notice>
  if(loading||!data)return <p role="status">Đang tải lịch trống…</p>
  const lastBlock=data.blocks.at(-1)
  const startDate=start.slice(0,10).split('-').reverse().join('/')
  const lastDate=lastBlock?.start.slice(0,10).split('-').reverse().join('/')
  return <section aria-label="Lịch đặt theo block 30 phút" className="min-w-0 space-y-2 rounded-xl border border-brand-border p-3">
    <p className="font-semibold">{data.allocationMode==='PHYSICAL'?'Lịch chỗ đỗ':'Lịch sức chứa'} · Mỗi block 30 phút</p>
    <p className="text-xs text-brand-muted">{startDate}{lastDate&&lastDate!==startDate?` – ${lastDate}`:''}</p>
    <p className="text-xs leading-5 text-brand-muted">Xanh: có thể đặt · Đỏ: không đủ chỗ · Vàng: khoảng đệm · Xám: đã qua. Số chỗ đã tính khoảng đệm 30 phút.</p>
    <div ref={track} className="overflow-x-auto pb-2" tabIndex={0} role="region" aria-label="Cuộn để xem lịch theo ngày">
      <div className="flex w-max gap-1.5">
        {data.blocks.map(block=>{
          const selected=bookingTimestamp(block.start)>=bookingTimestamp(start)&&bookingTimestamp(block.start)<bookingTimestamp(end)
          const past=block.status==='PAST'||bookingTimestamp(block.start)<=Date.now()
          const unavailable=block.remainingCapacity===0
          const label=past?'Đã qua':block.status==='BUFFER'?'Đệm 30p':unavailable?'Hết chỗ':`${block.remainingCapacity} chỗ`
          const color=past?'bg-slate-100 text-slate-500':block.status==='BUFFER'?'bg-amber-50 text-amber-900':unavailable?'bg-red-50 text-red-800':'bg-emerald-50 text-emerald-900'
          const extraDays=bookingDayOffset(start,block.start)
          const dateLabel=block.start.slice(0,10).split('-').reverse().join('/')
          const dayLabel=extraDays>0?` (+${extraDays} ngày, ${dateLabel})`:''
          return <button key={block.start} type="button" disabled={disabled||past||unavailable} aria-pressed={selected}
            data-selection-start={bookingTimestamp(block.start)===bookingTimestamp(start)}
            aria-label={`${block.start.slice(11,16)} đến ${block.end.slice(11,16)}${dayLabel}: ${label}`}
            onClick={()=>onSelect(block.start.slice(0,16))}
            className={`flex min-h-16 w-20 shrink-0 flex-col items-center justify-center rounded-lg border px-1 py-2 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${color} ${selected?'border-brand-primary ring-2 ring-inset ring-brand-primary':'border-transparent'}`}>
            <span className="font-semibold tabular-nums">{block.start.slice(11,16)}</span>{extraDays>0&&<span className="text-[10px] tabular-nums">{dateLabel}</span>}<span className="mt-1">{label}</span>
          </button>
        })}
      </div>
    </div>
    {hasMore&&onLoadNext&&<button type="button" className={secondary} disabled={disabled||loadingMore} onClick={onLoadNext}>{loadingMore?'Đang tải ngày tiếp theo…':'Xem ngày tiếp theo'}</button>}
    <p className="text-xs text-brand-muted">Khả dụng cho toàn bộ thời lượng được kiểm tra riêng trước khi giữ chỗ.</p>
  </section>
}
