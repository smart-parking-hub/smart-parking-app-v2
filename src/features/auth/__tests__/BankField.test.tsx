import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { AuthPage } from '../index'
import { BankField } from '../components/BankField'
import { fetchBanks, BANKS_URL } from '../api/banks'
import type { AuthFields } from '../model/authFields'
const banks=[{name:'Ngân hàng TMCP Ngoại thương Việt Nam',shortName:'Vietcombank',bin:'970436',code:'VCB',logo:'https://cdn.vietqr.io/img/VCB.png'},{name:'Ngân hàng TMCP Quân đội',shortName:'MBBank',bin:'970422',code:'MB',logo:'https://api.vietqr.io/img/MB.png'},{name:'Ngân hàng Đại chúng',shortName:'PVcomBank',bin:'970412',code:'PVCB'}]
const fetchMock=vi.fn()
const submit=vi.fn()
function Form(){
 const form=useForm<AuthFields>({defaultValues:{bankName:''}})
 return <form onSubmit={form.handleSubmit(submit)}><BankField control={form.control}/><button>Lưu</button></form>
}
function mount(){const cache=new QueryClient({defaultOptions:{queries:{retry:false}}});render(<QueryClientProvider client={cache}><Form/></QueryClientProvider>);return cache}
const ok=()=>({ok:true,json:async()=>({code:'00',data:banks})})
beforeEach(()=>{vi.clearAllMocks();vi.stubGlobal('fetch',fetchMock);fetchMock.mockResolvedValue(ok())})
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.restoreAllMocks()})
it('loads the public provider without cookies or bearer headers',async()=>{
 const result=await fetchBanks();expect(result).toHaveLength(3)
 expect(fetchMock).toHaveBeenCalledWith(BANKS_URL,expect.objectContaining({credentials:'omit',referrerPolicy:'no-referrer',signal:expect.any(AbortSignal)}))
 expect(fetchMock.mock.calls[0][1]).not.toHaveProperty('headers')
})
it('shows loading and keeps input disabled until the real list arrives',async()=>{
 fetchMock.mockImplementation(()=>new Promise(()=>{}));mount()
 expect(screen.getByRole('status')).toHaveTextContent('Đang tải danh sách từ VietQR')
 expect(screen.getByRole('combobox',{name:'Tên ngân hàng'})).toBeDisabled()
})
it('searches accent-insensitively using full bank name, short code and BIN',async()=>{
 mount();const input=await screen.findByRole('combobox',{name:'Tên ngân hàng'});await waitFor(()=>expect(input).toBeEnabled())
 await userEvent.type(input,'ngoai thuong')
 expect(screen.getByRole('option',{name:/Vietcombank/})).toBeInTheDocument();expect(screen.queryByRole('option',{name:/MBBank/})).not.toBeInTheDocument()
 expect(screen.getByRole('option',{name:/Vietcombank/}).querySelector('img')).toHaveAttribute('src','https://cdn.vietqr.io/img/VCB.png')
 await userEvent.clear(input);await userEvent.type(input,'970422');expect(screen.getByRole('option',{name:/MBBank/})).toBeInTheDocument()
 await userEvent.clear(input);await userEvent.type(input,'VCB');expect(screen.getByRole('option',{name:/Vietcombank/})).toBeInTheDocument()
})
it('selects the canonical bank name by keyboard and submits existing bankName contract only',async()=>{
 mount();const input=screen.getByRole('combobox',{name:'Tên ngân hàng'});await waitFor(()=>expect(input).toBeEnabled())
 await userEvent.type(input,'VCB');await userEvent.keyboard('{ArrowDown}{Enter}')
 expect(input).toHaveValue('Vietcombank');expect(submit).not.toHaveBeenCalled()
 expect(input.parentElement?.querySelector('img')).toHaveAttribute('src','https://cdn.vietqr.io/img/VCB.png')
 expect(screen.queryByText('Chọn ngân hàng nhận tiền. Danh sách VietQR không xác minh chủ tài khoản.')).not.toBeInTheDocument()
 await userEvent.click(screen.getByText('Lưu'));await waitFor(()=>expect(submit).toHaveBeenCalled())
 expect(submit.mock.calls[0][0]).toEqual({bankName:'Vietcombank'})
})
it('rejects a typed name that is not a bank returned by the provider',async()=>{
 mount();const input=screen.getByRole('combobox',{name:'Tên ngân hàng'});await waitFor(()=>expect(input).toBeEnabled())
 await userEvent.type(input,'Invented bank')
 expect(screen.getByText(/Không tìm thấy ngân hàng/)).toBeInTheDocument()
 expect(screen.queryByText(/Có thể nhập tên khác/)).not.toBeInTheDocument()
 await userEvent.click(screen.getByText('Lưu'));expect(await screen.findByRole('alert')).toHaveTextContent('Chọn ngân hàng từ danh sách');expect(submit).not.toHaveBeenCalled()
})
it.each(['network','http','empty','bad-code'])('shows retry without mock bank fallback on %s failure',async failure=>{
 if(failure==='network')fetchMock.mockRejectedValue(new TypeError('Network error'))
 else fetchMock.mockResolvedValue(failure==='http'?{ok:false}:{ok:true,json:async()=>({code:failure==='bad-code'?'99':'00',data:[]})})
 mount();expect(await screen.findByRole('alert')).toBeInTheDocument();expect(screen.getByRole('combobox')).toBeDisabled()
 fetchMock.mockResolvedValue(ok());await userEvent.click(screen.getByRole('button',{name:'Tải lại ngân hàng'}))
 await waitFor(()=>expect(screen.getByRole('combobox')).toBeEnabled());await userEvent.click(screen.getByRole('combobox'))
 expect(screen.getByRole('option',{name:/Vietcombank/})).toBeInTheDocument()
})
it('reuses the list across remounts for the configured day-long cache',async()=>{
 const cache=mount();await waitFor(()=>expect(screen.getByRole('combobox')).toBeEnabled());cleanup()
 render(<QueryClientProvider client={cache}><Form/></QueryClientProvider>)
 await waitFor(()=>expect(screen.getByRole('combobox')).toBeEnabled());expect(fetchMock).toHaveBeenCalledTimes(1)
})

it('sends the selected bankName through the actual merchant registration form',async()=>{
 const request=vi.spyOn(apiClient,'request').mockResolvedValue({data:{data:{expiresInSeconds:300,resendAfterSeconds:60}}})
 const cache=new QueryClient({defaultOptions:{queries:{retry:false}}})
 render(<QueryClientProvider client={cache}><MemoryRouter><AuthPage mode="register"/></MemoryRouter></QueryClientProvider>)
 expect(fetchMock).not.toHaveBeenCalled()
 await userEvent.selectOptions(screen.getByLabelText(/Bạn tham gia với vai trò/),'MERCHANT')
 await userEvent.type(screen.getByLabelText('Số điện thoại'),'0901234567')
 await userEvent.type(screen.getByLabelText('Họ và tên'),'Local Merchant Test')
 await userEvent.type(screen.getByLabelText('CCCD / CMND'),'123456789012')
 await userEvent.click(screen.getByRole('button',{name:'Tiếp tục: Kết nối ngân hàng'}))
 const input=screen.getByRole('combobox',{name:'Tên ngân hàng'});await waitFor(()=>expect(input).toBeEnabled())
 await userEvent.type(input,'VCB');await userEvent.keyboard('{ArrowDown}{Enter}')
 await userEvent.type(screen.getByLabelText('Số tài khoản ngân hàng'),'123456789')
 await userEvent.click(screen.getByRole('button',{name:'Tiếp tục: Xác thực Email'}))
 await userEvent.type(screen.getByLabelText('Email nhận mã xác thực'),'local-test@example.test')
 await userEvent.click(screen.getByRole('button',{name:'Gửi mã qua email'}))
 await screen.findByText('Mã xác thực đã được gửi')
 await userEvent.type(screen.getByLabelText('Mã xác thực email (6 số)'),'123456')
 await userEvent.click(screen.getByRole('button',{name:'Tiếp tục: Thiết lập mật khẩu'}))
 await waitFor(()=>expect(screen.getByLabelText('Mật khẩu')).toBeVisible())
 await userEvent.type(screen.getByLabelText('Mật khẩu'),'local-test-only')
 await userEvent.type(screen.getByLabelText('Xác nhận mật khẩu'),'local-test-only')
 await userEvent.click(screen.getByRole('button',{name:'Tạo tài khoản'}))
 await waitFor(()=>expect(request).toHaveBeenCalledWith(expect.objectContaining({method:'post',url:'/api/v1/auth/register',data:expect.objectContaining({role:'MERCHANT',bankName:'Vietcombank',bankAccountNum:'123456789'})})))
 expect(await screen.findByRole('heading',{name:/Đăng ký thành công/i})).toBeInTheDocument()
})
