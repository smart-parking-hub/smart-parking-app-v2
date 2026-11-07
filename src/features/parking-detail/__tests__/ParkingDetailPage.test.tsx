import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
vi.mock('@/shared/api/client',()=>({apiClient:{get:vi.fn(),request:vi.fn()}}))
afterEach(cleanup)
function mount(ui:React.ReactNode,path:string,route:string){return render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter initialEntries={[path]}><Routes><Route path={route} element={ui}/></Routes></MemoryRouter></QueryClientProvider>)}
import { ParkingDetailPage } from '../pages/ParkingDetailPage'
const lot={id:7,name:'Bãi API',address:'Địa chỉ API',status:'APPROVED',slots:[{vehicleType:'HEAVY_TRUCK',availableCapacity:1,totalCapacity:2}],pricingRules:[{vehicleType:'HEAVY_TRUCK',basePricePerHour:25000,surgeMultiplier:1,surgeStartTime:null,surgeEndTime:null,overtimePenaltyMultiplier:2}]}
beforeEach(()=>{vi.clearAllMocks();vi.mocked(apiClient.get).mockImplementation(async url=>({data:{data:String(url).includes('/vehicles')?{content:[]}:lot}}))})
it('shows real capacity, configured multipliers and route back to map',async()=>{mount(<ParkingDetailPage/>,'/parking/7','/parking/:id');expect(await screen.findByRole('heading',{name:'Bãi API'})).toBeInTheDocument();expect(screen.getByText('1/2 chỗ trống')).toBeInTheDocument();expect(screen.getByText(/Quá giờ ×2/)).toBeInTheDocument();expect(screen.getByRole('link',{name:'Về bản đồ'})).toHaveAttribute('href','/parking')})
it('rejects invalid lot IDs without requests',()=>{mount(<ParkingDetailPage/>,'/parking/invalid','/parking/:id');expect(screen.getByRole('alert')).toHaveTextContent('Mã bãi đỗ không hợp lệ');expect(apiClient.get).not.toHaveBeenCalled()})
it('shows API errors without fabricating lot data',async()=>{vi.mocked(apiClient.get).mockRejectedValue(new Error('Bãi không tồn tại'));mount(<ParkingDetailPage/>,'/parking/7','/parking/:id');expect(await screen.findByRole('alert')).toHaveTextContent('Bãi không tồn tại');expect(screen.queryByText('Bãi API')).not.toBeInTheDocument();expect(screen.getByText('Thử lại')).toBeInTheDocument()})
