import { bookingScheduleFixture, bookingScheduleRequestFixture } from '@/test/bookingScheduleFixture'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { ReservationFlow } from '../ReservationFlow'
import { PaymentResultPage } from '../PaymentResultPage'
import { AxiosError } from 'axios'
import { bookingEnd, nextBookingStart } from '../time'
vi.mock('@/shared/api/client',()=>({apiClient:{get:vi.fn(),post:vi.fn(),request:vi.fn()}}))
const vehicle={id:3,licensePlate:'51C-12345',vehicleType:'HEAVY_TRUCK',status:'ACTIVE'}
const lot={id:7,name:'Bãi thử nghiệm',address:'Địa chỉ thử nghiệm',status:'APPROVED',slots:[{vehicleType:'HEAVY_TRUCK',availableCapacity:1,totalCapacity:2}],pricingRules:[{vehicleType:'HEAVY_TRUCK',basePricePerHour:25000,surgeMultiplier:1.2,surgeStartTime:'17:00:00',surgeEndTime:'20:00:00',overtimePenaltyMultiplier:2}]}
const makeBooking=()=>({id:41,bookingCode:'BK-SERVER-41',parkingLotId:7,merchantId:9,vehicleId:3,vehiclePlate:vehicle.licensePlate,status:'PENDING_PAYMENT',advanceDeposit:10000,totalAmount:50000,hourlyRate:25000,overtimePenaltyMultiplier:2,surgeMultiplier:1.2,expectedCheckInTime:new Date(Date.now()+1800000).toISOString(),expectedCheckOutTime:new Date(Date.now()+9000000).toISOString(),expiresAt:new Date(Date.now()+900000).toISOString()})
let current=makeBooking()
function mount(ui=<ReservationFlow lotId={7}/>,path='/parking'){
 return render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false},mutations:{retry:false}}})}><MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter></QueryClientProvider>)
}
async function readySubmit(){
 const button=await screen.findByRole('button',{name:'Tạo booking và xem tiền cọc'})
 await waitFor(()=>expect(button).toBeEnabled())
 return button
}
afterEach(cleanup)
beforeEach(()=>{vi.clearAllMocks();vi.mocked(apiClient.request).mockImplementation(async config=>apiClient.post(config.url!,config.data));sessionStorage.clear();current=makeBooking();vi.mocked(apiClient.get).mockImplementation(async (url,config)=>({data:{data:/\/(availability|timeline)(?:\?|$)/.test(String(url))?bookingScheduleRequestFixture(config):String(url).endsWith('/payments/wallet')?null:String(url).endsWith('/driver/wallet')?{availableAmount:0,heldAmount:0,currency:'VND',enabled:true}:String(url).includes('/vehicles')?{content:[vehicle]}:String(url).includes('/parking-lots')?lot:current}}));vi.mocked(apiClient.post).mockImplementation(async url=>{if(String(url).includes('demo-confirm'))current={...current,status:'PENDING_CHECKIN'};return {data:{data:current}}})})
it('shows real tariff and explains blocks, buffer, billing and arrival policy',async()=>{
 mount();expect(await screen.findByText(/Bãi thử nghiệm/)).toBeInTheDocument();expect(screen.getByRole('option',{name:/51C-12345/})).toBeInTheDocument();expect(screen.getByText(/20%/)).toBeInTheDocument();expect(await screen.findByText(/Có thể vào sớm tối đa 15 phút nếu chỗ đã sẵn sàng/)).toBeInTheDocument();expect(screen.getByText(/Thanh toán cọc trong/)).toHaveTextContent("15 phút");expect(screen.getByText(/Sau giờ ra dự kiến: ×2/)).toBeInTheDocument()
})
it('creates a server booking before offering payment and never invents a check-in status',async()=>{
 const user=userEvent.setup();mount();await user.click(await readySubmit());
 expect(await screen.findByText('#41')).toBeInTheDocument();expect(screen.getByText('Chờ thanh toán cọc')).toBeInTheDocument();expect(apiClient.post).toHaveBeenCalledWith('/api/v1/bookings',expect.objectContaining({vehicleId:3,parkingLotId:7,vehicleType:'HEAVY_TRUCK',requestId:expect.any(String)}));expect(vi.mocked(apiClient.post).mock.calls[0][1]).not.toHaveProperty('amount');expect(vi.mocked(apiClient.post).mock.calls[0][1]).not.toHaveProperty('merchantId');
 await waitFor(()=>expect(screen.getByRole('button',{name:'Thanh toán Demo (chỉ local)'})).toBeEnabled());await user.click(screen.getByRole('button',{name:'Thanh toán Demo (chỉ local)'}));expect(await screen.findByText('Đã cọc · Chờ check-in')).toBeInTheDocument();expect(screen.queryByText('Đang đỗ tại bãi')).not.toBeInTheDocument()
})
it('requires a registered active vehicle',async()=>{
 vi.mocked(apiClient.get).mockImplementation(async url=>({data:{data:String(url).includes('/vehicles')?{content:[]}:lot}}));mount();expect(await screen.findByRole('link',{name:'Đăng ký phương tiện'})).toHaveAttribute('href','/vehicles');expect(apiClient.post).not.toHaveBeenCalled()
})
it('blocks an unavailable time window without posting a booking',async()=>{
 vi.mocked(apiClient.get).mockImplementation(async (url,config)=>({data:{data:/\/(availability|timeline)(?:\?|$)/.test(String(url))?bookingScheduleRequestFixture(config,0):String(url).includes('/vehicles')?{content:[vehicle]}:{...lot,slots:[{vehicleType:'HEAVY_TRUCK',availableCapacity:0,totalCapacity:2}]}}}));mount();expect(await screen.findByRole('button',{name:'Tạo booking và xem tiền cọc'})).toBeDisabled()
 await userEvent.click(screen.getByRole('button',{name:'Giờ vào dự kiến'}))
 const fullChoices=await screen.findAllByRole('button',{name:/Hết chỗ/})
 for(const choice of fullChoices)expect(choice).toBeDisabled()
 expect(apiClient.post).not.toHaveBeenCalled()
})
it('reports booking failure and never offers success on a rejected request',async()=>{
 vi.mocked(apiClient.post).mockRejectedValue(new Error('Bãi vừa hết chỗ'));mount();await userEvent.click(await readySubmit());expect(await screen.findByRole('alert')).toHaveTextContent('Bãi vừa hết chỗ');expect(screen.queryByText('BK-SERVER-41')).not.toBeInTheDocument()
})
it('keeps the vehicle and times editable when the server rejects an overlapping vehicle booking',async()=>{
 vi.mocked(apiClient.post).mockRejectedValue(Object.assign(new AxiosError('Conflict'),{response:{status:409,data:{code:'CONFLICT',message:'Xe này đã có booking trùng thời gian. Vui lòng chọn thời gian khác hoặc hoàn tất lượt đỗ hiện tại.'}}}))
 mount();await userEvent.click(await readySubmit())
 expect(await screen.findByRole('alert')).toHaveTextContent('Xe này đã có booking trùng thời gian')
 expect(screen.getByRole('combobox',{name:'Phương tiện của bạn'})).toHaveValue('3')
 await waitFor(()=>expect(screen.getByRole('button',{name:'Tạo booking và xem tiền cọc'})).toBeEnabled())
 expect(screen.queryByRole('region',{name:'Thanh toán bằng ví'})).not.toBeInTheDocument()
})
it('switches to one compact confirmed ticket after successful wallet deposit',async()=>{
 let paid=false
 vi.mocked(apiClient.get).mockImplementation(async (url,config)=>({data:{data:
   /\/(availability|timeline)(?:\?|$)/.test(String(url))?bookingScheduleRequestFixture(config):String(url).endsWith('/payments/wallet')?(paid?{id:71,status:'SUCCESS'}:null):
   String(url).endsWith('/driver/wallet')?{availableAmount:100000,heldAmount:0,currency:'VND',enabled:true}:
   String(url).includes('/vehicles')?{content:[vehicle]}:String(url).includes('/parking-lots')?lot:current}}))
 vi.mocked(apiClient.request).mockImplementation(async config=>{
   if(config.url==='/api/v1/payments/wallet'){paid=true;current={...current,status:'PENDING_CHECKIN'};return {data:{data:{id:71,status:'SUCCESS'}}}}
   return apiClient.post(config.url!,config.data)
 })
 const user=userEvent.setup();mount();await user.click(await readySubmit())
 const pay=await screen.findByRole('button',{name:/Trả.*bằng ví/});await waitFor(()=>expect(pay).toBeEnabled());await user.click(pay)
 expect(await screen.findByRole('heading',{name:'Vé check-in của bạn'})).toBeInTheDocument()
 expect(screen.getAllByText('BK-SERVER-41')).toHaveLength(1)
 expect(screen.getAllByRole('button',{name:'Sao chép mã check-in'})).toHaveLength(1)
 expect(screen.queryByRole('region',{name:'Thanh toán bằng ví'})).not.toBeInTheDocument()
 expect(screen.queryByRole('button',{name:/Thanh toán cọc.*qua PayOS/})).not.toBeInTheDocument()
 expect(apiClient.request).toHaveBeenCalledWith(expect.objectContaining({url:'/api/v1/payments/wallet',data:{bookingId:41}}))
})
it('keeps a cooldown submit disabled and preserves the form without opening payment',async()=>{
 const retryAt=new Date(Date.now()+1800000).toISOString()
 vi.mocked(apiClient.post).mockRejectedValue(Object.assign(new AxiosError('Too many requests'),{response:{data:{code:'BOOKING_HOLD_COOLDOWN',message:'Bạn đã bỏ hai lượt giữ chỗ tại bãi này.',data:{reason:'COOLDOWN',retryAt}}}}))
 mount();await userEvent.click(await readySubmit())
 expect(await screen.findByRole('alert')).toHaveTextContent('Bạn đã bỏ hai lượt giữ chỗ tại bãi này.')
 const retry=screen.getByRole('button',{name:/Có thể thử lại sau/});expect(retry).toBeDisabled()
 await userEvent.click(retry);expect(apiClient.post).toHaveBeenCalledTimes(1)
 expect(screen.getByRole('combobox',{name:'Phương tiện của bạn'})).toHaveValue('3');expect(screen.queryByText(/Mở PayOS/)).not.toBeInTheDocument()
})
it('does not treat simulated=true or return navigation as payment confirmation',async()=>{
 mount(<PaymentResultPage/>,'/payment/return?bookingId=41&simulated=true');await screen.findByText('#41');await waitFor(()=>expect(apiClient.post).toHaveBeenCalledWith('/api/v1/payments/sync',{bookingId:41}));expect(vi.mocked(apiClient.post).mock.calls.some(([url])=>String(url).includes('demo-confirm'))).toBe(false);expect(screen.getByText('Chờ thanh toán cọc')).toBeInTheDocument()
})

it('allows a future window even when the lot currently has zero free places',async()=>{
 vi.mocked(apiClient.get).mockImplementation(async (url,config)=>({data:{data:/\/(availability|timeline)(?:\?|$)/.test(String(url))?bookingScheduleRequestFixture(config):String(url).includes('/vehicles')?{content:[vehicle]}:{...lot,slots:[{vehicleType:'HEAVY_TRUCK',availableCapacity:0,totalCapacity:2}]}}}))
 mount();expect(await readySubmit()).toBeEnabled()
})
it('requires successful availability reads rather than assuming a failed read means empty',async()=>{
 vi.mocked(apiClient.get).mockImplementation(async (url,config)=>{
  if(String(url).endsWith('/availability'))throw new Error('Không tải được lịch')
  return {data:{data:String(url).endsWith('/timeline')?bookingScheduleRequestFixture(config):String(url).includes('/vehicles')?{content:[vehicle]}:lot}}
 })
 mount();expect(await screen.findByText('Không tải được lịch')).toBeInTheDocument()
 expect(screen.getByRole('button',{name:'Tạo booking và xem tiền cọc'})).toBeDisabled();expect(apiClient.post).not.toHaveBeenCalled()
})
it('submits the selected physical slot and half-hour-aligned timestamps',async()=>{
 vi.mocked(apiClient.get).mockImplementation(async (url,config)=>({data:{data:/\/(availability|timeline)(?:\?|$)/.test(String(url))?bookingScheduleRequestFixture(config,1,true):String(url).includes('/vehicles')?{content:[vehicle]}:String(url).includes('/parking-lots')?lot:current}}))
 mount();await readySubmit();await userEvent.selectOptions(screen.getByRole('combobox',{name:'Ô đỗ'}),'slot-a')
 await userEvent.click(await readySubmit())
 await waitFor(()=>expect(apiClient.post).toHaveBeenCalledWith('/api/v1/bookings',expect.objectContaining({physicalSlotId:'slot-a',expectedCheckInTime:expect.stringMatching(/:(00|30):00$/),expectedCheckOutTime:expect.stringMatching(/:(00|30):00$/)})))
})
it('keeps the chosen physical slot when clicking the active duration and resets it only when duration changes',async()=>{
 vi.mocked(apiClient.get).mockImplementation(async (url,config)=>({data:{data:/\/(availability|timeline)(?:\?|$)/.test(String(url))?bookingScheduleRequestFixture(config,1,true):String(url).includes('/vehicles')?{content:[vehicle]}:String(url).includes('/parking-lots')?lot:current}}))
 const user=userEvent.setup();mount();await readySubmit()
 const physical=screen.getByRole('combobox',{name:'Ô đỗ'})
 await user.selectOptions(physical,'slot-a')
 await user.click(screen.getByRole('button',{name:'2 giờ'}))
 expect(physical).toHaveValue('slot-a')
 await user.click(screen.getByRole('button',{name:'4 giờ'}))
 expect(physical).toHaveValue('')
})
it('loads the correct next-day fixture without duplicate timeline keys when the default stay crosses midnight',async()=>{
 vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(new Date('2026-11-17T16:10:00Z'))
 const errors=vi.spyOn(console,'error').mockImplementation(()=>{})
 try {
  mount();await readySubmit()
  await waitFor(()=>expect(apiClient.get).toHaveBeenCalledWith('/api/v1/parking-lots/7/timeline',expect.objectContaining({params:expect.objectContaining({date:'2026-11-18'})})))
  expect(await screen.findByRole('button',{name:/^00:00 đến 00:30.*\+1 ngày/})).toBeInTheDocument()
  expect(errors.mock.calls.some(args=>args.some(value=>typeof value==='string'&&value.includes('same key')))).toBe(false)
 } finally { errors.mockRestore();vi.useRealTimers() }
})

it('shows Vietnamese validation for empty duration and recovers when a valid value is entered',async()=>{
 const user=userEvent.setup();mount();await readySubmit()
 await user.click(screen.getByRole('button',{name:'Thời lượng khác'}))
 const duration=screen.getByLabelText('Số giờ đỗ')
 await user.clear(duration)
 expect(await screen.findByText('Vui lòng nhập thời lượng đỗ.')).toBeInTheDocument()
 expect(screen.queryByText(/Expected number|received nan/i)).not.toBeInTheDocument()
 expect(screen.getByRole('button',{name:'Tạo booking và xem tiền cọc'})).toBeDisabled()
 expect(apiClient.post).not.toHaveBeenCalled()
 await user.type(duration,'2')
 await readySubmit()
 expect(screen.queryByText('Vui lòng nhập thời lượng đỗ.')).not.toBeInTheDocument()
})

it('continues the timeline after midnight with date offsets and can load later days without changing the reservation',async()=>{
 vi.mocked(apiClient.get).mockImplementation(async(url,config)=>{
  const params=config?.params
  const day=params&&typeof params==='object'&&'date' in params&&typeof params.date==='string'?params.date:undefined
  return {data:{data:String(url).endsWith('/timeline')?bookingScheduleFixture(2,false,day):
   String(url).endsWith('/availability')?bookingScheduleRequestFixture(config):String(url).includes('/vehicles')?{content:[vehicle]}:lot}}
 })
 const user=userEvent.setup();mount();await readySubmit()
 const startDay=nextBookingStart().slice(0,10)
 await user.click(screen.getByRole('button',{name:'Giờ vào dự kiến'}));await user.click(screen.getByRole('button',{name:'23:30'}))
 expect(screen.getByLabelText('Giờ ra dự kiến')).toHaveTextContent('Ngày hôm sau')
 const followingDay=bookingEnd(`${startDay}T23:30`,120).slice(0,10)
 await waitFor(()=>expect(apiClient.get).toHaveBeenCalledWith('/api/v1/parking-lots/7/timeline',expect.objectContaining({params:expect.objectContaining({date:followingDay})})))
 const midnight=await screen.findByRole('button',{name:/^00:00 đến 00:30.*\+1 ngày/})
 expect(midnight).toHaveAttribute('aria-pressed','true')
 expect(midnight).toHaveTextContent(followingDay.split('-').reverse().join('/'))
 expect(midnight).not.toHaveTextContent('+1 ngày')
 expect(screen.queryByRole('button',{name:/^01:30 đến 02:00.*\+1 ngày/})).not.toBeInTheDocument()
 // The starting day keeps its other hours available for changing entry time.
 expect(screen.getByRole('button',{name:/^22:30 đến 23:00:/})).toBeInTheDocument()
 await user.click(screen.getByRole('button',{name:'Thời lượng khác'}))
 const duration=screen.getByLabelText('Số giờ đỗ')
 await user.clear(duration);await user.type(duration,'25');await user.selectOptions(screen.getByLabelText('Thêm phút'),'30')
 expect(screen.getByLabelText('Giờ ra dự kiến')).toHaveTextContent('Sau 2 ngày')
 const more=await screen.findByRole('button',{name:'Xem ngày tiếp theo'})
 await waitFor(()=>expect(more).toBeEnabled());await user.click(more)
 expect(await screen.findByRole('button',{name:/^00:00 đến 00:30.*\+2 ngày/})).toHaveAttribute('aria-pressed','true')
 expect(screen.getByRole('button',{name:'Giờ vào dự kiến'})).toHaveTextContent('23:30')
 expect(duration).toHaveValue(25)
 await user.click(screen.getByRole('button',{name:'30 phút'}))
 await readySubmit()
 expect(screen.getByLabelText('Giờ ra dự kiến')).toHaveTextContent('Ngày hôm sau')
 expect(screen.queryByRole('button',{name:/\+1 ngày/})).not.toBeInTheDocument()
})
