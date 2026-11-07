import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
vi.mock('@/shared/api/client',()=>({apiClient:{get:vi.fn(),request:vi.fn()}}))
afterEach(cleanup)
function mount(ui:React.ReactNode,path:string,route:string){return render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter initialEntries={[path]}><Routes><Route path={route} element={ui}/></Routes></MemoryRouter></QueryClientProvider>)}
const booking={id:41,bookingCode:'BK-API-41',parkingLotId:7,merchantId:9,vehicleId:3,vehiclePlate:'51C-TEST',status:'PENDING_CHECKIN',advanceDeposit:10000,totalAmount:50000,hourlyRate:25000,overtimePenaltyMultiplier:2,surgeMultiplier:1,expectedCheckInTime:new Date(Date.now()+1800000).toISOString(),expectedCheckOutTime:new Date(Date.now()+9000000).toISOString(),expiresAt:new Date(Date.now()+5400000).toISOString()}
import { PaymentReturnPage } from '../pages/PaymentReturnPage'
beforeEach(()=>{vi.clearAllMocks();vi.mocked(apiClient.get).mockResolvedValue({data:{data:booking}});vi.mocked(apiClient.request).mockResolvedValue({data:{data:{status:'PENDING'}}})})
it('requires a valid booking ID',()=>{mount(<PaymentReturnPage/>,'/payment/return','/payment/return');expect(screen.getByRole('alert')).toHaveTextContent('Thiếu mã booking hợp lệ');expect(apiClient.request).not.toHaveBeenCalled()})
it('reads booking status from the server without trusting return URL flags',async()=>{mount(<PaymentReturnPage/>,'/payment/return?bookingId=41&simulated=true','/payment/return');expect(await screen.findByText('BK-API-41')).toBeInTheDocument();expect(screen.getByText('Đã cọc · Chờ check-in')).toBeInTheDocument();expect(vi.mocked(apiClient.request).mock.calls.some(([config])=>config.url?.includes('demo-confirm'))).toBe(false)})
