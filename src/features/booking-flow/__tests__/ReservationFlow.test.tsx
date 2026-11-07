import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { ReservationFlow } from '../ReservationFlow'
import { PaymentResultPage } from '../PaymentResultPage'
vi.mock('@/shared/api/client',()=>({apiClient:{get:vi.fn(),post:vi.fn(),request:vi.fn()}}))
const vehicle={id:3,licensePlate:'51C-12345',vehicleType:'HEAVY_TRUCK',status:'ACTIVE'}
const lot={id:7,name:'Bãi thử nghiệm',address:'Địa chỉ thử nghiệm',status:'APPROVED',slots:[{vehicleType:'HEAVY_TRUCK',availableCapacity:1,totalCapacity:2}],pricingRules:[{vehicleType:'HEAVY_TRUCK',basePricePerHour:25000,surgeMultiplier:1.2,surgeStartTime:'17:00:00',surgeEndTime:'20:00:00',overtimePenaltyMultiplier:2}]}
const makeBooking=()=>({id:41,bookingCode:'BK-SERVER-41',parkingLotId:7,merchantId:9,vehicleId:3,vehiclePlate:vehicle.licensePlate,status:'PENDING_PAYMENT',advanceDeposit:10000,totalAmount:50000,hourlyRate:25000,overtimePenaltyMultiplier:2,surgeMultiplier:1.2,expectedCheckInTime:new Date(Date.now()+1800000).toISOString(),expectedCheckOutTime:new Date(Date.now()+9000000).toISOString(),expiresAt:new Date(Date.now()+900000).toISOString()})
let current=makeBooking()
function mount(ui=<ReservationFlow lotId={7}/>,path='/parking'){
 return render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false},mutations:{retry:false}}})}><MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter></QueryClientProvider>)
}
afterEach(cleanup)
beforeEach(()=>{vi.clearAllMocks();vi.mocked(apiClient.request).mockImplementation(async config=>apiClient.post(config.url!,config.data));sessionStorage.clear();current=makeBooking();vi.mocked(apiClient.get).mockImplementation(async url=>({data:{data:String(url).includes('/vehicles')?{content:[vehicle]}:String(url).includes('/parking-lots')?lot:current}}));vi.mocked(apiClient.post).mockImplementation(async url=>{if(String(url).includes('demo-confirm'))current={...current,status:'PENDING_CHECKIN'};return {data:{data:current}}})})
it('shows real vehicle and configured tariff, 20% deposit, 15 minute hold and 30 minute arrival rule',async()=>{
 mount();expect(await screen.findByText(/Bãi thử nghiệm/)).toBeInTheDocument();expect(screen.getByRole('option',{name:/51C-12345/})).toBeInTheDocument();expect(screen.getByText(/20%/)).toBeInTheDocument();expect(screen.getByText(/30 phút/)).toBeInTheDocument();expect(screen.getByText(/15 phút/)).toBeInTheDocument();expect(screen.getByText('×2')).toBeInTheDocument()
})
it('creates a server booking before offering payment and never invents a check-in status',async()=>{
 const user=userEvent.setup();mount();await screen.findByRole('button',{name:'Tạo booking và xem tiền cọc'});await user.click(screen.getByRole('button',{name:'Tạo booking và xem tiền cọc'}));
 expect(await screen.findByText('BK-SERVER-41')).toBeInTheDocument();expect(screen.getByText('Chờ thanh toán cọc')).toBeInTheDocument();expect(apiClient.post).toHaveBeenCalledWith('/api/v1/bookings',expect.objectContaining({vehicleId:3,parkingLotId:7,vehicleType:'HEAVY_TRUCK',requestId:expect.any(String)}));expect(vi.mocked(apiClient.post).mock.calls[0][1]).not.toHaveProperty('amount');expect(vi.mocked(apiClient.post).mock.calls[0][1]).not.toHaveProperty('merchantId');
 await user.click(screen.getByRole('button',{name:'Thanh toán Demo (chỉ local)'}));expect(await screen.findByText('Đã cọc · Chờ check-in')).toBeInTheDocument();expect(screen.queryByText('Đang đỗ tại bãi')).not.toBeInTheDocument()
})
it('requires a registered active vehicle',async()=>{
 vi.mocked(apiClient.get).mockImplementation(async url=>({data:{data:String(url).includes('/vehicles')?{content:[]}:lot}}));mount();expect(await screen.findByRole('link',{name:'Đăng ký phương tiện'})).toHaveAttribute('href','/vehicles');expect(apiClient.post).not.toHaveBeenCalled()
})
it('blocks a full lot without posting a booking',async()=>{
 vi.mocked(apiClient.get).mockImplementation(async url=>({data:{data:String(url).includes('/vehicles')?{content:[vehicle]}:{...lot,slots:[{vehicleType:'HEAVY_TRUCK',availableCapacity:0,totalCapacity:2}]}}}));mount();expect(await screen.findByRole('button',{name:'Tạo booking và xem tiền cọc'})).toBeDisabled();expect(apiClient.post).not.toHaveBeenCalled()
})
it('reports booking failure and never offers success on a rejected request',async()=>{
 vi.mocked(apiClient.post).mockRejectedValue(new Error('Bãi vừa hết chỗ'));mount();await userEvent.click(await screen.findByRole('button',{name:'Tạo booking và xem tiền cọc'}));expect(await screen.findByRole('alert')).toHaveTextContent('Bãi vừa hết chỗ');expect(screen.queryByText('BK-SERVER-41')).not.toBeInTheDocument()
})
it('does not treat simulated=true or return navigation as payment confirmation',async()=>{
 mount(<PaymentResultPage/>,'/payment/return?bookingId=41&simulated=true');await screen.findByText('BK-SERVER-41');await waitFor(()=>expect(apiClient.post).toHaveBeenCalledWith('/api/v1/payments/sync',{bookingId:41}));expect(vi.mocked(apiClient.post).mock.calls.some(([url])=>String(url).includes('demo-confirm'))).toBe(false);expect(screen.getByText('Chờ thanh toán cọc')).toBeInTheDocument()
})
