import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), request: vi.fn(), delete: vi.fn() } }))
afterEach(cleanup)
function mount(ui: React.ReactNode) {
 const cache = new QueryClient({defaultOptions:{queries:{retry:false},mutations:{retry:false}}})
 render(<QueryClientProvider client={cache}><MemoryRouter>{ui}</MemoryRouter></QueryClientProvider>)
 return cache
}
const page = (content: unknown[], currentPage=0, totalPages=1, totalElements=content.length) => ({data:{data:{content,currentPage,totalPages,totalElements}}})
import { DriverPaymentsPage } from '../pages/DriverPaymentsPage'
const transaction = {id:71,bookingId:21,parkingLotId:31,gateway:'DEMO',transactionCode:'TX-API-71',orderCode:211,amount:15000,type:'DEPOSIT',status:'SUCCESS',createdAt:'2026-11-07T10:00:00'}
beforeEach(()=>{vi.clearAllMocks();vi.mocked(apiClient.get).mockResolvedValue(page([transaction]))})
it('shows no payments and no invented VAT or refunds for a new account',async()=>{
 vi.mocked(apiClient.get).mockResolvedValue(page([],0,0));mount(<DriverPaymentsPage/>);
 expect(await screen.findByText('Bạn chưa có giao dịch thanh toán nào.')).toBeInTheDocument()
 expect(screen.queryByText(/3.420.000|400.000|18 HĐ|CQT ACTIVE|TXN-2026/)).not.toBeInTheDocument()
 expect(apiClient.get).toHaveBeenCalledWith('/api/v1/payments',{params:{page:0,size:20,sort:'id,desc'}})
})
it('shows actual gateway, amount, booking ID and timestamp without fabricated VAT/bank/vehicle fields',async()=>{
 mount(<DriverPaymentsPage/>);expect(await screen.findByText('TX-API-71')).toBeInTheDocument()
 expect(screen.getByText('Demo (thử nghiệm)')).toBeInTheDocument();expect(screen.getByText('Booking #21')).toBeInTheDocument()
 expect(screen.getByText(/7\/11\/2026/)).toBeInTheDocument()
 expect(screen.queryByText(/PDF VAT|51D-894|ĐỒNG BỘ THỜI GIAN THỰC/)).not.toBeInTheDocument()
})
it('only sums successful non-refund transactions on the current page',async()=>{
 vi.mocked(apiClient.get).mockResolvedValue(page([transaction,{...transaction,id:72,transactionCode:'PENDING',amount:900000,status:'PENDING'},{...transaction,id:73,transactionCode:'REFUND',amount:5000,type:'REFUND'},{...transaction,id:74,transactionCode:'REVIEW',amount:700000,status:'REQUIRES_REVIEW'}]))
 mount(<DriverPaymentsPage/>);await screen.findByText('TX-API-71')
 const label=screen.getByText('Đã thanh toán trên trang này');expect(label.parentElement).toHaveTextContent(/15[.\s]000/)
 expect(label.parentElement).not.toHaveTextContent(/900[.\s]000|700[.\s]000/)
 await userEvent.selectOptions(screen.getByLabelText('Trạng thái trong trang hiện tại'),'REQUIRES_REVIEW')
 expect(screen.getByText('REVIEW')).toBeInTheDocument();expect(screen.queryByText('TX-API-71')).not.toBeInTheDocument()
})
it('shows reconciliation details from the selected server transaction',async()=>{
 vi.mocked(apiClient.get).mockResolvedValue(page([{...transaction,status:'REQUIRES_REVIEW'}]));mount(<DriverPaymentsPage/>);await screen.findByText('TX-API-71')
 await userEvent.click(screen.getByRole('button',{name:'Chi tiết giao dịch TX-API-71'}))
 expect(screen.getByText(/Giao dịch đang cần đối soát/)).toBeInTheDocument();expect(screen.getByText('#31')).toBeInTheDocument()
})
it.each([401,500])('reports HTTP %s instead of showing synthetic transactions',async code=>{
 vi.mocked(apiClient.get).mockRejectedValue(new Error(`API ${code}`));mount(<DriverPaymentsPage/>);
 expect(await screen.findByRole('alert')).toHaveTextContent(`API ${code}`);expect(screen.queryByText('TX-API-71')).not.toBeInTheDocument()
 vi.mocked(apiClient.get).mockResolvedValue(page([]));await userEvent.click(screen.getByText('Thử lại'));expect(await screen.findByText(/Bạn chưa có giao dịch/)).toBeInTheDocument()
})
it('uses server pagination and scopes search and totals to the displayed page',async()=>{
 vi.mocked(apiClient.get).mockImplementation(async(_url,config)=>Number((config?.params as {page?:number} | undefined)?.page)===1?page([{...transaction,id:72,transactionCode:'TX-PAGE2',amount:25000}],1,2,21):page([transaction],0,2,21))
 mount(<DriverPaymentsPage/>);await screen.findByText('TX-API-71');await userEvent.click(screen.getByText('Trang sau'))
 expect(await screen.findByText('TX-PAGE2')).toBeInTheDocument();expect(screen.queryByText('TX-API-71')).not.toBeInTheDocument()
 await userEvent.type(screen.getByLabelText('Tìm trong trang hiện tại'),'absent')
 expect(screen.getByText('Không có giao dịch phù hợp trong trang này.')).toBeInTheDocument()
})
it('displays a pending loader until the API responds',()=>{
 vi.mocked(apiClient.get).mockImplementation(()=>new Promise(()=>{}));mount(<DriverPaymentsPage/>);
 expect(screen.getByRole('status')).toHaveTextContent('Đang tải giao dịch');expect(screen.queryByText('TX-API-71')).not.toBeInTheDocument()
})

it('rejects a malformed amount rather than claiming a zero-value payment',async()=>{
 vi.mocked(apiClient.get).mockResolvedValue(page([{...transaction,amount:null}]))
 mount(<DriverPaymentsPage/>);expect(await screen.findByRole('alert')).toBeInTheDocument()
 expect(screen.queryByText('TX-API-71')).not.toBeInTheDocument()
})
