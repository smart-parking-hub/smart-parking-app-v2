import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
vi.mock('@/shared/api/client',()=>({apiClient:{get:vi.fn(),request:vi.fn()}}))
afterEach(cleanup)
function mount(ui:React.ReactNode,path:string,route:string){return render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter initialEntries={[path]}><Routes><Route path={route} element={ui}/></Routes></MemoryRouter></QueryClientProvider>)}
const booking={id:41,bookingCode:'BK-API-41',parkingLotId:7,merchantId:9,vehicleId:3,vehiclePlate:'51C-TEST',status:'PENDING_CHECKIN',advanceDeposit:10000,totalAmount:50000,hourlyRate:25000,overtimePenaltyMultiplier:2,surgeMultiplier:1,expectedCheckInTime:new Date(Date.now()+1800000).toISOString(),expectedCheckOutTime:new Date(Date.now()+9000000).toISOString(),expiresAt:new Date(Date.now()+5400000).toISOString()}
import { MyBookingsPage } from '../pages/MyBookingsPage'
beforeEach(()=>{vi.clearAllMocks();vi.mocked(apiClient.get).mockImplementation(async url=>({data:{data:String(url).endsWith('/bookings')?{content:[booking]}:booking}}))})
it('renders the server booking and check-in state without inventing a parking state',async()=>{mount(<MyBookingsPage/>,'/bookings','/bookings');expect(await screen.findByText('BK-API-41')).toBeInTheDocument();expect(screen.getByText('Đã cọc · Chờ check-in')).toBeInTheDocument();expect(screen.queryByText('Đang đỗ tại bãi')).not.toBeInTheDocument()})
it('shows an empty list when the API returns no bookings',async()=>{vi.mocked(apiClient.get).mockResolvedValue({data:{data:{content:[]}}});mount(<MyBookingsPage/>,'/bookings','/bookings');expect(await screen.findByText('Bạn chưa có lượt đặt chỗ nào.')).toBeInTheDocument()})
it('reports request errors and retries without sample bookings',async()=>{vi.mocked(apiClient.get).mockRejectedValue(new Error('Không tải được booking'));mount(<MyBookingsPage/>,'/bookings','/bookings');expect(await screen.findByRole('alert')).toHaveTextContent('Không tải được booking');expect(screen.queryByText('BK-API-41')).not.toBeInTheDocument();fireEvent.click(screen.getByText('Thử lại'));expect(apiClient.get).toHaveBeenCalledTimes(2)})
