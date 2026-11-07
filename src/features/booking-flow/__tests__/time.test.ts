import {expect,it} from 'vitest'
import {bookingTimestamp} from '../time'
it('interprets server wall clock as Vietnam time, independent of browser timezone',()=>{
 expect(bookingTimestamp('2026-11-06T10:00:00')).toBe(Date.parse('2026-11-06T03:00:00Z'))
 expect(bookingTimestamp('2026-11-06T10:00:00+07:00')).toBe(Date.parse('2026-11-06T03:00:00Z'))
})
