import {expect,it} from 'vitest'
import {bookingTimestamp,nextBookingStart,bookingEnd,isBookingBlock,bookingDayOffset,bookingDurationLabel} from '../time'
it('describes durations using days, hours and minutes without block arithmetic',()=>{
 expect(bookingDurationLabel(30)).toBe('30 phút')
 expect(bookingDurationLabel(120)).toBe('2 giờ')
 expect(bookingDurationLabel(1440)).toBe('1 ngày')
 expect(bookingDurationLabel(1530)).toBe('1 ngày 1 giờ 30 phút')
 for(const value of [NaN,Infinity,0,-30,45,1.5])expect(bookingDurationLabel(value)).toBe('')
})
it('interprets server wall clock as Vietnam time, independent of browser timezone',()=>{
 expect(bookingTimestamp('2026-11-06T10:00:00')).toBe(Date.parse('2026-11-06T03:00:00Z'))
 expect(bookingTimestamp('2026-11-06T10:00:00+07:00')).toBe(Date.parse('2026-11-06T03:00:00Z'))
})
it('counts calendar day changes in Vietnam across midnight, month and year boundaries',()=>{
 expect(bookingDayOffset('2026-11-17T22:30','2026-11-18T00:30')).toBe(1)
 expect(bookingDayOffset('2026-12-31T23:30','2027-01-02T00:30')).toBe(2)
 expect(bookingDayOffset('2028-02-28T23:30','2028-03-01T00:30')).toBe(2)
 expect(bookingDayOffset('2026-11-17T08:00','2026-11-17T23:30')).toBe(0)
})
it('rounds to the next future half hour in Vietnam and carries across midnight',()=>{
 expect(nextBookingStart(Date.parse('2026-11-17T00:10:00Z'))).toBe('2026-11-17T07:30')
 expect(nextBookingStart(Date.parse('2026-11-17T01:00:00Z'))).toBe('2026-11-17T08:30')
 expect(bookingEnd('2026-11-17T23:30',90)).toBe('2026-11-18T01:00')
 expect(isBookingBlock('2026-11-17T08:15')).toBe(false)
 expect(isBookingBlock('2026-11-17T08:30:01')).toBe(false)
 expect(isBookingBlock('2026-11-17T08:30:00')).toBe(true)
})
