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
import { vehicleInputSchema } from '../api/vehicleDataApi'
import { VehiclesPage } from '../pages/VehiclesPage'
const vehicle = {id:91,licensePlate:'51C-REAL91',vehicleType:'HEAVY_TRUCK',weightTon:12.5,brandModel:'Xe API',status:'ACTIVE'}
let rows = [vehicle]
beforeEach(()=>{
 vi.clearAllMocks(); rows=[{...vehicle}]
 vi.mocked(apiClient.get).mockImplementation(async()=>page(rows))
 vi.mocked(apiClient.request).mockImplementation(async config=>{
  const saved={...vehicle,...vehicleInputSchema.parse(config.data)};rows=[saved]; return {data:{data:saved}}
 })
 vi.mocked(apiClient.delete).mockImplementation(async()=>{rows=[{...vehicle,status:'INACTIVE'}];return {data:{data:null}}})
})
it('shows zero vehicles for a new account without sample fleet or ALPR claims',async()=>{
 vi.mocked(apiClient.get).mockResolvedValue(page([],0,0));mount(<VehiclesPage/>);
 expect(await screen.findByText(/Bạn chưa có phương tiện nào/)).toBeInTheDocument()
 expect(screen.queryByText('51D-894.12')).not.toBeInTheDocument();expect(screen.queryByText(/100%/)).not.toBeInTheDocument()
 expect(apiClient.get).toHaveBeenCalledWith('/api/v1/vehicles',{params:{page:0,size:20,sort:'id,desc'}})
})
it('shows only API fields and preserves inactive status',async()=>{
 rows=[{...vehicle,status:'INACTIVE'}];mount(<VehiclesPage/>);
 expect(await screen.findByText(vehicle.licensePlate)).toBeInTheDocument();expect(screen.getByText('12.5 tấn')).toBeInTheDocument()
 expect(screen.getByText('Ngừng sử dụng',{exact:true})).toBeInTheDocument()
 expect(screen.queryByRole('button',{name:/Ngừng sử dụng xe/})).not.toBeInTheDocument()
 expect(screen.queryByText(/18\/11\/2026|đăng kiểm|ĐỒNG BỘ 100%/i)).not.toBeInTheDocument()
})
it.each([401,500])('reports HTTP %s failures and retries instead of sample fallback',async code=>{
 vi.mocked(apiClient.get).mockRejectedValue(new Error(`API ${code}`));mount(<VehiclesPage/>);
 expect(await screen.findByRole('alert')).toHaveTextContent(`API ${code}`)
 expect(screen.queryByText(vehicle.licensePlate)).not.toBeInTheDocument()
 vi.mocked(apiClient.get).mockResolvedValue(page([]));await userEvent.click(screen.getByText('Thử lại'))
 expect(await screen.findByText(/Bạn chưa có phương tiện nào/)).toBeInTheDocument()
})
it('validates required fields without sending a create request',async()=>{
 mount(<VehiclesPage/>);await screen.findByText(vehicle.licensePlate)
 await userEvent.click(screen.getByRole('button',{name:'Thêm phương tiện'}));await userEvent.click(screen.getByText('Lưu phương tiện'))
 expect((await screen.findAllByRole('alert')).length).toBeGreaterThan(0);expect(apiClient.request).not.toHaveBeenCalled()
})
it('creates a vehicle with only supported fields and reloads server data',async()=>{
 vi.mocked(apiClient.get).mockResolvedValueOnce(page([]));mount(<VehiclesPage/>);await screen.findByText(/Bạn chưa có phương tiện nào/)
 await userEvent.click(screen.getByText('Thêm phương tiện'))
 await userEvent.type(screen.getByLabelText('Biển số xe'),'51c-new')
 await userEvent.selectOptions(screen.getByLabelText('Loại xe'),'HEAVY_TRUCK')
 await userEvent.type(screen.getByLabelText('Trọng tải (tấn)'),'14.5')
 await userEvent.type(screen.getByLabelText('Nhãn hiệu / Model (không bắt buộc)'),'Test API')
 await userEvent.click(screen.getByText('Lưu phương tiện'))
 expect(await screen.findByText('Đã lưu phương tiện.')).toBeInTheDocument()
 expect(await screen.findByText('51C-NEW')).toBeInTheDocument()
 expect(apiClient.request).toHaveBeenCalledWith({method:'post',url:'/api/v1/vehicles',data:{licensePlate:'51C-NEW',vehicleType:'HEAVY_TRUCK',weightTon:14.5,brandModel:'Test API'}})
})
it('edits using PUT and retains server values after refetch',async()=>{
 mount(<VehiclesPage/>);await screen.findByText(vehicle.licensePlate)
 await userEvent.click(screen.getByRole('button',{name:`Sửa xe ${vehicle.licensePlate}`}))
 await userEvent.clear(screen.getByLabelText('Trọng tải (tấn)'));await userEvent.type(screen.getByLabelText('Trọng tải (tấn)'),'15')
 await userEvent.click(screen.getByText('Lưu phương tiện'));expect(await screen.findByText('15 tấn')).toBeInTheDocument()
 expect(apiClient.request).toHaveBeenCalledWith(expect.objectContaining({method:'put',url:'/api/v1/vehicles/91',data:expect.objectContaining({weightTon:15})}))
})
it('keeps the editor and existing vehicle when saving is rejected',async()=>{
 vi.mocked(apiClient.request).mockRejectedValue(new Error('Biển số đã tồn tại'));mount(<VehiclesPage/>);await screen.findByText(vehicle.licensePlate)
 await userEvent.click(screen.getByRole('button',{name:`Sửa xe ${vehicle.licensePlate}`}));await userEvent.click(screen.getByText('Lưu phương tiện'))
 expect(await screen.findByRole('alert')).toHaveTextContent('Biển số đã tồn tại');expect(screen.queryByText('Đã lưu phương tiện.')).not.toBeInTheDocument();expect(screen.getByRole('button',{name:'Lưu phương tiện'})).toBeEnabled()
})
it('deactivates only after confirmation and displays the returned inactive record',async()=>{
 mount(<VehiclesPage/>);await screen.findByText(vehicle.licensePlate)
 await userEvent.click(screen.getByRole('button',{name:`Ngừng sử dụng xe ${vehicle.licensePlate}`}));expect(apiClient.delete).not.toHaveBeenCalled()
 await userEvent.click(screen.getByText('Xác nhận ngừng sử dụng'))
 expect(await screen.findByText('Đã ngừng sử dụng phương tiện.')).toBeInTheDocument();expect(apiClient.delete).toHaveBeenCalledWith('/api/v1/vehicles/91')
 expect(screen.getByText('Ngừng sử dụng',{exact:true})).toBeInTheDocument()
})
it('does not pretend a failed deactivation succeeded',async()=>{
 vi.mocked(apiClient.delete).mockRejectedValue(new Error('Không có quyền'));mount(<VehiclesPage/>);await screen.findByText(vehicle.licensePlate)
 await userEvent.click(screen.getByRole('button',{name:`Ngừng sử dụng xe ${vehicle.licensePlate}`}));await userEvent.click(screen.getByText('Xác nhận ngừng sử dụng'))
 expect(await screen.findByRole('alert')).toHaveTextContent('Không có quyền');expect(screen.getByText('Đang sử dụng')).toBeInTheDocument()
})
it('requests the next server page without using a fixed sample count',async()=>{
 vi.mocked(apiClient.get).mockImplementation(async(_url,config)=>Number((config?.params as {page?:number} | undefined)?.page)===1?page([{...vehicle,id:92,licensePlate:'51C-PAGE2'}],1,2,21):page([vehicle],0,2,21))
 mount(<VehiclesPage/>);await screen.findByText(vehicle.licensePlate);await userEvent.click(screen.getByText('Trang sau'))
 expect(await screen.findByText('51C-PAGE2')).toBeInTheDocument();expect(screen.queryByText(vehicle.licensePlate)).not.toBeInTheDocument()
 expect(screen.getByText('Phương tiện đã đăng ký (21)')).toBeInTheDocument()
})

it('does not preselect a vehicle type and requires the user to confirm it',async()=>{
 mount(<VehiclesPage/>);await screen.findByText(vehicle.licensePlate)
 await userEvent.click(screen.getByRole('button',{name:'Thêm phương tiện'}))
 expect(screen.getByLabelText('Loại xe')).toHaveValue('')
 await userEvent.type(screen.getByLabelText('Biển số xe'),'51C-123.45')
 await userEvent.type(screen.getByLabelText('Trọng tải (tấn)'),'12.5')
 await userEvent.click(screen.getByText('Lưu phương tiện'))
 expect(await screen.findByText('Chọn loại xe.')).toBeInTheDocument();expect(apiClient.request).not.toHaveBeenCalled()
})
it('offers optional brand suggestions while permitting a brand/model outside the list',async()=>{
 mount(<VehiclesPage/>);await screen.findByText(vehicle.licensePlate)
 await userEvent.click(screen.getByRole('button',{name:'Thêm phương tiện'}))
 const input=screen.getByLabelText('Nhãn hiệu / Model (không bắt buộc)')
 await userEvent.click(input)
 expect(screen.getByRole('option',{name:'Hyundai'})).toBeInTheDocument()
 await userEvent.type(input,'My own brand Custom Model')
 expect(input).toHaveValue('My own brand Custom Model')
 expect(screen.getByLabelText('Loại xe')).toHaveValue('')
 expect(screen.getByLabelText('Trọng tải (tấn)')).toHaveValue(null)
 expect(screen.getByText(/Lưu phương tiện chưa đồng nghĩa/)).toBeInTheDocument()
})
it('normalizes case and spaces while preserving plate punctuation',()=>{
 const data=vehicleInputSchema.parse({licensePlate:' 51c - 123.45 ',vehicleType:'HEAVY_TRUCK',weightTon:12.5,brandModel:''})
 expect(data.licensePlate).toBe('51C-123.45')
})
it.each(['<img src=x>','ABCDEFGHI','51C/12345','123456789012345678901'])('rejects malformed plate input %s',plate=>{
 expect(vehicleInputSchema.safeParse({licensePlate:plate,vehicleType:'HEAVY_TRUCK',weightTon:12.5,brandModel:''}).success).toBe(false)
})
it.each([0,-1,1000,12.345])('rejects weight outside the backend numeric contract: %s',weight=>{
 expect(vehicleInputSchema.safeParse({licensePlate:'51C-123.45',vehicleType:'HEAVY_TRUCK',weightTon:weight,brandModel:''}).success).toBe(false)
})

it('filters brand suggestions and chooses one with the keyboard without submitting',async()=>{
 mount(<VehiclesPage/>);await screen.findByText(vehicle.licensePlate)
 await userEvent.click(screen.getByRole('button',{name:'Thêm phương tiện'}))
 const input=screen.getByLabelText('Nhãn hiệu / Model (không bắt buộc)')
 await userEvent.type(input,'hyu')
 expect(screen.getByRole('option',{name:'Hyundai'})).toBeInTheDocument()
 expect(screen.queryByRole('option',{name:'Toyota'})).not.toBeInTheDocument()
 await userEvent.keyboard('{ArrowDown}{Enter}')
 expect(input).toHaveValue('Hyundai');expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
 expect(apiClient.request).not.toHaveBeenCalled()
 await userEvent.type(input,' Xcient');expect(input).toHaveValue('Hyundai Xcient')
 expect(screen.getByText(/Không có gợi ý phù hợp/)).toBeInTheDocument()
 await userEvent.keyboard('{Escape}');expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})
it('selects a brand by pointer and closes suggestions when focus leaves',async()=>{
 mount(<VehiclesPage/>);await screen.findByText(vehicle.licensePlate)
 await userEvent.click(screen.getByRole('button',{name:'Thêm phương tiện'}))
 const input=screen.getByLabelText('Nhãn hiệu / Model (không bắt buộc)')
 await userEvent.click(input);await userEvent.click(screen.getByRole('option',{name:'Ford'}))
 expect(input).toHaveValue('Ford');expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
 await userEvent.click(screen.getByRole('button',{name:'Hiện gợi ý'}));expect(screen.getByRole('listbox')).toBeInTheDocument()
 await userEvent.click(screen.getByLabelText('Biển số xe'));expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})
