import { useState } from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { BookingTimeSelector } from '../BookingTimeSelector'
import userEvent from '@testing-library/user-event'
import type { ScheduleAvailability } from '../availability'

function mount(start:string, blocks?:ScheduleAvailability['blocks']){
  function Form(){
    const [value,setValue]=useState(start)
    const [minutes,setMinutes]=useState(120)
    return <BookingTimeSelector start={value} minutes={minutes} onStartChange={setValue} onDurationChange={setMinutes} arrivalBlocks={blocks}/>
  }
  return render(<Form/>)
}
beforeEach(()=>{vi.useFakeTimers();vi.setSystemTime(new Date('2026-11-17T13:17:00Z'))})
afterEach(()=>{cleanup();vi.useRealTimers()})
const arrival=()=>screen.getByRole('button',{name:'Giờ vào dự kiến'})
const openTimes=()=>fireEvent.click(arrival())
const timeButtons=()=>screen.getAllByRole('button',{name:/^\d{2}:\d{2}$/})
it('shows only remaining future half-hour starts for today in Vietnam',()=>{
  mount('2026-11-17T20:30')
  openTimes()
  expect(timeButtons().map(option=>option.textContent)).toEqual(['20:30','21:00','21:30','22:00','22:30','23:00','23:30'])
})
it('keeps all 48 choices when a future date is selected',()=>{
  mount('2026-11-18T00:00')
  openTimes()
  expect(timeButtons()).toHaveLength(48)
  expect(arrival()).toHaveTextContent('00:00')
})
it('moves an expired selection to the next future block and recalculates checkout',()=>{
  mount('2026-11-17T20:00')
  expect(arrival()).toHaveTextContent('20:30')
  expect(screen.getByLabelText('Giờ ra dự kiến')).toHaveTextContent('22:30')
})
it('removes a choice that expires while the form remains open',()=>{
  vi.setSystemTime(new Date('2026-11-17T13:29:55Z'))
  mount('2026-11-17T20:30')
  openTimes()
  act(()=>vi.advanceTimersByTime(10000))
  expect(screen.queryByRole('button',{name:'20:30'})).not.toBeInTheDocument()
  expect(arrival()).toHaveTextContent('21:00')
  expect(screen.getByLabelText('Giờ ra dự kiến')).toHaveTextContent('23:00')
})
it('requires another date after the final future block and restores choices on the new day',()=>{
  vi.setSystemTime(new Date('2026-11-17T16:45:00Z'))
  mount('2026-11-17T23:30')
  expect(arrival()).toBeDisabled()
  expect(arrival()).toHaveTextContent('Hôm nay đã hết giờ đặt')
  fireEvent.change(screen.getByLabelText('Ngày đỗ'),{target:{value:'2026-11-18'}})
  expect(arrival()).toBeEnabled()
  openTimes()
  expect(timeButtons()).toHaveLength(48)
})
it('chooses an hour from the grid with arrows and Enter, closes and returns focus',async()=>{
  vi.useRealTimers();vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(new Date('2026-11-17T13:17:00Z'))
  const user=userEvent.setup()
  mount('2026-11-17T20:30')
  await user.click(arrival())
  expect(screen.getByRole('button',{name:'20:30'})).toHaveFocus()
  await user.keyboard('{ArrowRight}')
  expect(screen.getByRole('button',{name:'21:00'})).toHaveFocus()
  expect(arrival()).toHaveTextContent('20:30')
  await user.keyboard('{Enter}')
  expect(screen.queryByRole('dialog',{name:'Chọn giờ vào dự kiến'})).not.toBeInTheDocument()
  expect(arrival()).toHaveFocus()
  expect(arrival()).toHaveTextContent('21:00')
  expect(screen.getByLabelText('Giờ ra dự kiến')).toHaveTextContent('23:00')
})
it('closes the grid with Escape or an outside click without changing the selected hour',async()=>{
  vi.useRealTimers();vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(new Date('2026-11-17T13:17:00Z'))
  const user=userEvent.setup()
  mount('2026-11-17T20:30')
  await user.click(arrival());await user.keyboard('{Escape}')
  expect(screen.queryByRole('dialog',{name:'Chọn giờ vào dự kiến'})).not.toBeInTheDocument()
  expect(arrival()).toHaveFocus();expect(arrival()).toHaveTextContent('20:30')
  await user.click(arrival());await user.click(screen.getByRole('button',{name:'30 phút'}))
  expect(screen.queryByRole('dialog',{name:'Chọn giờ vào dự kiến'})).not.toBeInTheDocument()
  await user.click(arrival());await user.tab()
  expect(screen.getByRole('button',{name:'30 phút'})).toHaveFocus()
  expect(screen.queryByRole('dialog',{name:'Chọn giờ vào dự kiến'})).not.toBeInTheDocument()
})
it('recomputes checkout and clearly identifies the next calendar day after choosing a duration',()=>{
  mount('2026-11-17T23:30')
  fireEvent.click(screen.getByRole('button',{name:'1 giờ'}))
  expect(screen.getByLabelText('Giờ ra dự kiến')).toHaveTextContent('00:30')
  expect(screen.getByLabelText('Giờ ra dự kiến')).toHaveTextContent('18/11/2026 · Ngày hôm sau')
  expect(screen.getByText('Đỗ 1 giờ')).toBeInTheDocument()
  expect(screen.queryByText(/block ·/)).not.toBeInTheDocument()
})
const unavailableBlocks:ScheduleAvailability['blocks']=[
  {start:'2026-11-17T21:00:00',end:'2026-11-17T21:30:00',remainingCapacity:0,status:'FULL'},
  {start:'2026-11-17T21:30:00',end:'2026-11-17T22:00:00',remainingCapacity:0,status:'BUFFER'},
]
it('disables full and buffer times from the timeline while keeping other hours selectable',()=>{
  mount('2026-11-17T20:30',unavailableBlocks);openTimes()
  const full=screen.getByRole('button',{name:'21:00 · Hết chỗ'})
  expect(full).toBeDisabled()
  expect(screen.getByRole('button',{name:'21:30 · Đệm 30p'})).toBeDisabled()
  fireEvent.click(full)
  expect(arrival()).toHaveTextContent('20:30')
  expect(screen.getByRole('dialog',{name:'Chọn giờ vào dự kiến'})).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button',{name:'22:00'}))
  expect(arrival()).toHaveTextContent('22:00')
})
it('skips disabled hours with keyboard navigation and keeps the original selection until Enter',async()=>{
  vi.useRealTimers();vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(new Date('2026-11-17T13:17:00Z'))
  const user=userEvent.setup();mount('2026-11-17T20:30',unavailableBlocks)
  await user.click(arrival());await user.keyboard('{ArrowRight}')
  expect(screen.getByRole('button',{name:'22:00'})).toHaveFocus()
  expect(arrival()).toHaveTextContent('20:30')
  await user.keyboard('{Enter}')
  expect(arrival()).toHaveTextContent('22:00')
})
it('keeps a full day inspectable and explains that another date is needed',()=>{
  const blocks:ScheduleAvailability['blocks']=Array.from({length:48},(_,index)=>({
    start:`2026-11-17T${String(Math.floor(index/2)).padStart(2,'0')}:${index%2?'30':'00'}:00`,
    end:'2026-11-18T00:00:00',remainingCapacity:0,status:'FULL',
  }))
  mount('2026-11-17T20:30',blocks);openTimes()
  expect(screen.getByText('Ngày này không còn giờ trống. Hãy chọn ngày khác.')).toBeInTheDocument()
  for(const button of screen.getAllByRole('button',{name:/Hết chỗ/}))expect(button).toBeDisabled()
  expect(arrival()).toHaveTextContent('20:30')
})
it('disables a selected hour when refreshed capacity becomes full without changing the form intent',()=>{
  const onStartChange=vi.fn()
  const props={start:'2026-11-17T20:30',minutes:120,onStartChange,onDurationChange:vi.fn()}
  const view=render(<BookingTimeSelector {...props} arrivalBlocks={[]}/>);openTimes()
  view.rerender(<BookingTimeSelector {...props} arrivalBlocks={[
    {start:'2026-11-17T20:30:00',end:'2026-11-17T21:00:00',remainingCapacity:0,status:'FULL'},
  ]}/>)
  expect(screen.getByRole('button',{name:'20:30 · Hết chỗ'})).toBeDisabled()
  expect(screen.getByRole('button',{name:'21:00'})).toHaveFocus()
  expect(arrival()).toHaveTextContent('20:30')
  expect(onStartChange).not.toHaveBeenCalled()
})
