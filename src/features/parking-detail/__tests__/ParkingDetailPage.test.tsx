import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import userEvent from '@testing-library/user-event'
vi.mock('@/shared/api/client',()=>({apiClient:{get:vi.fn(),request:vi.fn()}}))
vi.mock('@/shared/components/ApiImage',()=>({ApiImage:({path,alt}:{path:string;alt:string})=><img src={path} alt={alt}/>}))
afterEach(cleanup)
function mount(ui:React.ReactNode,path:string,route:string){return render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter initialEntries={[path]}><Routes><Route path={route} element={ui}/></Routes></MemoryRouter></QueryClientProvider>)}
import { ParkingDetailPage } from '../pages/ParkingDetailPage'
const lot={id:7,name:'Bãi API',address:'Địa chỉ API',status:'APPROVED',slots:[{vehicleType:'HEAVY_TRUCK',availableCapacity:1,totalCapacity:2}],pricingRules:[{vehicleType:'HEAVY_TRUCK',basePricePerHour:25000,surgeMultiplier:1,surgeStartTime:null,surgeEndTime:null,overtimePenaltyMultiplier:2}]}
beforeEach(()=>{vi.clearAllMocks();vi.mocked(apiClient.get).mockImplementation(async url=>({data:{data:String(url).includes('/vehicles')?{content:[]}:lot}}))})
it('shows real capacity, configured multipliers and route back to map',async()=>{mount(<ParkingDetailPage/>,'/parking/7','/parking/:id');expect(await screen.findByRole('heading',{name:'Bãi API'})).toBeInTheDocument();expect(screen.getByText('1/2 chỗ trống hiện tại')).toBeInTheDocument();expect(screen.getByText(/Quá giờ ×2/)).toBeInTheDocument();expect(screen.getByRole('link',{name:'Về bản đồ'})).toHaveAttribute('href','/parking')})
it('rejects invalid lot IDs without requests',()=>{mount(<ParkingDetailPage/>,'/parking/invalid','/parking/:id');expect(screen.getByRole('alert')).toHaveTextContent('Mã bãi đỗ không hợp lệ');expect(apiClient.get).not.toHaveBeenCalled()})
it('shows API errors without fabricating lot data',async()=>{vi.mocked(apiClient.get).mockRejectedValue(new Error('Bãi không tồn tại'));mount(<ParkingDetailPage/>,'/parking/7','/parking/:id');expect(await screen.findByRole('alert')).toHaveTextContent('Bãi không tồn tại');expect(screen.queryByText('Bãi API')).not.toBeInTheDocument();expect(screen.getByText('Thử lại')).toBeInTheDocument()})
it('uses Vietnamese vehicle labels and readable time ranges without changing capacity or tariffs',async()=>{
 const types=['SEDAN_SUV','BUS_COACH','LIGHT_TRUCK','HEAVY_TRUCK','CONTAINER']
 vi.mocked(apiClient.get).mockImplementation(async url=>({data:{data:String(url).includes('/vehicles')?{content:[]}:{...lot,
  slots:types.map(vehicleType=>({vehicleType,availableCapacity:0,totalCapacity:5})),
  pricingRules:types.map(vehicleType=>({...lot.pricingRules[0],vehicleType,surgeMultiplier:1.25,surgeStartTime:'17:00:00',surgeEndTime:'20:00:00'}))}}}))
 mount(<ParkingDetailPage/>,'/parking/7','/parking/:id')
 for(const name of ['Ô tô 4–7 chỗ','Xe khách','Xe tải nhẹ','Xe tải nặng','Đầu kéo / Container'])expect(await screen.findByRole('article',{name})).toBeInTheDocument()
 expect(screen.queryByText('HEAVY_TRUCK')).not.toBeInTheDocument();expect(screen.queryByText('CONTAINER')).not.toBeInTheDocument()
 expect(screen.getAllByText('17:00 – 20:00')).toHaveLength(5)
 expect(screen.getAllByText('0/5 chỗ trống hiện tại')).toHaveLength(5)
 expect(screen.getAllByText('Hiện đã hết chỗ')).toHaveLength(5)
 expect(screen.queryByRole('region',{name:'Hình ảnh bãi đỗ'})).not.toBeInTheDocument()
})
it('prioritizes the real cover image and switches photos with keyboard-operable thumbnails',async()=>{
 const images=[{id:18,contentUrl:'/api/v1/parking-lots/7/images/18/content',originalFileName:'Lối vào.jpg',cover:false},
  {id:17,contentUrl:'/api/v1/parking-lots/7/images/17/content',originalFileName:'Toàn cảnh.jpg',cover:true}]
 vi.mocked(apiClient.get).mockImplementation(async url=>({data:{data:String(url).includes('/vehicles')?{content:[]}:{...lot,images}}}))
 mount(<ParkingDetailPage/>,'/parking/7','/parking/:id')
 expect(await screen.findByRole('img',{name:'Ảnh bãi đỗ Bãi API – Toàn cảnh.jpg'})).toHaveAttribute('src',images[1].contentUrl)
 const next=screen.getByRole('button',{name:'Xem ảnh 2 của Bãi API'});next.focus();await userEvent.keyboard('{Enter}')
 expect(await screen.findByRole('img',{name:'Ảnh bãi đỗ Bãi API – Lối vào.jpg'})).toHaveAttribute('src',images[0].contentUrl)
 expect(next).toHaveAttribute('aria-pressed','true')
 expect(screen.getByRole('link',{name:'Đăng ký phương tiện'})).toBeInTheDocument()
})
it('keeps incomplete lot configuration readable and does not substitute demo photos',async()=>{
 vi.mocked(apiClient.get).mockImplementation(async url=>({data:{data:String(url).includes('/vehicles')?{content:[]}:{...lot,images:null,pricingRules:[]}}}))
 mount(<ParkingDetailPage/>,'/parking/7','/parking/:id')
 expect(await screen.findByText('Chưa có bảng giá.')).toBeInTheDocument()
 expect(screen.queryByRole('img')).not.toBeInTheDocument()
})
it('renders operating profile and circulation guidelines when description is provided', async () => {
 vi.mocked(apiClient.get).mockImplementation(async (url) => ({
  data: {
   data: String(url).includes('/vehicles')
    ? { content: [] }
    : {
       ...lot,
       description:
        '### Khả năng tiếp vận & Quy mô\nBãi đỗ xe container 60T.\n\n### Nội quy PCCC\nGiữ chỗ tối đa 10 phút.',
      },
  },
 }))
 mount(<ParkingDetailPage />, '/parking/7', '/parking/:id')
 expect(await screen.findByRole('heading', { name: 'Thông tin vận hành & Hướng dẫn lưu thông' })).toBeInTheDocument()
 expect(screen.getByText(/Bãi đỗ xe container 60T/)).toBeInTheDocument()
 expect(screen.getByText(/Giữ chỗ tối đa 10 phút/)).toBeInTheDocument()
})
