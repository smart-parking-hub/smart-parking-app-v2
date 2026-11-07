import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { LoginPage } from '../pages/LoginPage'
import { RequireRole } from '../components/RequireRole'
import authReducer from '../model/authSlice'
import { AuthSession } from '@/app/providers/AuthSession'
import { clearSession, readSession, loginDestination, saveSession, type Role } from '../model/session'
function token(role: string, exp = Math.floor(Date.now() / 1000) + 3600) { return `test.${btoa(JSON.stringify({ role, exp }))}.test` }
function Location() { const location = useLocation(); return <div data-testid="location">{location.pathname}{location.search}</div> }
function setup(path = '/login') {
  const store = configureStore({ reducer: { auth: authReducer } })
  const cache = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(<Provider store={store}><QueryClientProvider client={cache}><AuthSession /><MemoryRouter initialEntries={[path]}><Location /><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<RequireRole role="DRIVER"><h1>Driver dashboard</h1></RequireRole>} />
    <Route path="/merchant/dashboard" element={<RequireRole role="MERCHANT"><h1>Merchant dashboard</h1></RequireRole>} />
    <Route path="/admin/dashboard" element={<RequireRole role="ADMIN"><h1>Admin dashboard</h1></RequireRole>} />
    <Route path="/parking" element={<RequireRole role="DRIVER"><h1>Parking map</h1></RequireRole>} />
    <Route path="/403" element={<h1>Forbidden</h1>} />
  </Routes></MemoryRouter></QueryClientProvider></Provider>)
  return { store, cache }
}
async function fill() {
  fireEvent.change(screen.getByLabelText('Số điện thoại'), { target: { value: '090 912 8374' } })
  fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { value: 'test-only-password' } })
}
beforeEach(() => { localStorage.clear(); vi.restoreAllMocks() })
afterEach(() => { cleanup(); vi.useRealTimers() })
describe('SCR-010 user journey', () => {
  it('validates empty input, supports visibility and auth navigation', async () => {
    const request = vi.spyOn(apiClient, 'request')
    setup(); fireEvent.click(screen.getByRole('button', { name: /^Đăng nhập$/ }))
    expect(await screen.findAllByRole('alert')).toHaveLength(2)
    expect(request).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Hiện mật khẩu' }))
    expect(screen.getByLabelText('Mật khẩu')).toHaveAttribute('type', 'text')
    expect(screen.getByRole('link', { name: 'Tạo tài khoản' })).toHaveAttribute('href', '/register')
    expect(screen.getByRole('link', { name: 'Quên mật khẩu?' })).toHaveAttribute('href', '/forgot-password')
  })
  it.each(['DRIVER', 'MERCHANT', 'ADMIN'] as Role[])('logs in %s, saves JWT, hydrates Redux and shows toast', async (role) => {
    const jwt = token(`ROLE_${role}`)
    const request = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: { token: jwt, role } } })
    const { store } = setup(); await fill()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Ghi nhớ số điện thoại' }))
    fireEvent.click(screen.getByRole('button', { name: /^Đăng nhập$/ }))
    await waitFor(() => expect(store.getState().auth.role).toBe(role))
    expect(request).toHaveBeenCalledWith(expect.objectContaining({ url: '/api/v1/auth/login', data: { phone: '0909128374', password: 'test-only-password' } }))
    expect(localStorage.getItem('access_token')).toBe(jwt)
    expect(localStorage.getItem('remembered_phone')).toBe('0909128374')
    expect(await screen.findByRole('status')).toHaveTextContent('Đăng nhập thành công.')
    expect(screen.getByTestId('location')).toHaveTextContent(role === 'DRIVER' ? '/dashboard' : `/${role.toLowerCase()}/dashboard`)
  })
  it('locks fields and prevents a second submission while pending', async () => {
    vi.spyOn(apiClient, 'request').mockImplementation(() => new Promise(() => {}))
    setup(); await fill(); fireEvent.click(screen.getByRole('button', { name: /^Đăng nhập$/ }))
    expect(await screen.findByRole('button', { name: /Đang đăng nhập/ })).toBeDisabled()
    expect(screen.getByLabelText('Mật khẩu')).toBeDisabled()
  })
  it('shows API error and retries validated input', async () => {
    const request = vi.spyOn(apiClient, 'request').mockRejectedValueOnce(new Error('Tài khoản đã bị khóa.')).mockResolvedValueOnce({ data: { data: { token: token('DRIVER'), role: 'DRIVER' } } })
    setup(); await fill(); fireEvent.click(screen.getByRole('button', { name: /^Đăng nhập$/ }))
    expect(await screen.findByText('Tài khoản đã bị khóa.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Thử lại' }))
    await screen.findByText('Driver dashboard'); expect(request).toHaveBeenCalledTimes(2)
  })
  it('hydrates on reload and guest guard skips the login page', async () => {
    localStorage.setItem('access_token', token('ADMIN'))
    const { store } = setup()
    await screen.findByText('Admin dashboard')
    expect(store.getState().auth.role).toBe('ADMIN')
  })
  it('clears Redux and private cache on same-tab logout', async () => {
    localStorage.setItem('access_token', token('DRIVER'))
    const { store, cache } = setup('/dashboard')
    await screen.findByText('Driver dashboard'); cache.setQueryData(['private'], 'private-data')
    act(() => clearSession())
    await screen.findByLabelText('Số điện thoại')
    expect(store.getState().auth.role).toBeNull(); expect(cache.getQueryData(['private'])).toBeUndefined()
  })
  it('reacts to another tab signing out', async () => {
    localStorage.setItem('access_token', token('MERCHANT')); const { store } = setup('/merchant/dashboard')
    await screen.findByText('Merchant dashboard'); localStorage.removeItem('access_token')
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'access_token' })))
    await screen.findByLabelText('Số điện thoại'); expect(store.getState().auth.role).toBeNull()
  })
  it('removes expired tokens and redirects to login', async () => {
    localStorage.setItem('access_token', token('DRIVER', 1)); const { store } = setup('/dashboard')
    await screen.findByLabelText('Số điện thoại'); expect(store.getState().auth.role).toBeNull(); expect(localStorage.getItem('access_token')).toBeNull()
  })
  it('rejects malformed JWTs and unsafe return URLs', () => {
    expect(readSession('malformed')).toBeNull()
    expect(readSession(token('UNKNOWN'))).toBeNull()
    for (const next of ['https://example.com', '//example.com', '/\\example.com', '/login', '/admin/dashboard']) expect(loginDestination(next, 'DRIVER')).toBe('/dashboard')
    expect(loginDestination('/vehicles?view=list', 'DRIVER')).toBe('/vehicles?view=list')
  })
  it('enforces role guard', async () => {
    localStorage.setItem('access_token', token('MERCHANT')); setup('/admin/dashboard'); await screen.findByText('Forbidden')
  })
  it('synchronizes a newly saved session', async () => {
    const { store } = setup(); act(() => saveSession(token('MERCHANT'))); await screen.findByText('Merchant dashboard'); expect(store.getState().auth.role).toBe('MERCHANT')
  })
  it('rejects inconsistent role/token responses without persisting a session', async () => {
    vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: { token: token('DRIVER'), role: 'ADMIN' } } })
    setup(); await fill(); fireEvent.click(screen.getByRole('button', { name: /^Đăng nhập$/ }))
    await screen.findByText('Phiên đăng nhập không hợp lệ. Vui lòng thử lại.')
    expect(localStorage.getItem('access_token')).toBeNull()
  })
  it('expires an active session and redirects without requiring a reload', async () => {
    localStorage.setItem('access_token', token('DRIVER', (Date.now() + 250) / 1000))
    const { store } = setup('/dashboard')
    await screen.findByText('Driver dashboard')
    await screen.findByLabelText('Số điện thoại')
    expect(store.getState().auth.role).toBeNull()
  })

  it('keeps the requested map destination while the session hydrates after login', async () => {
    vi.spyOn(apiClient,'request').mockResolvedValue({data:{data:{token:token('DRIVER'),role:'DRIVER'}}})
    setup('/login?next=%2Fparking'); await fill()
    fireEvent.click(screen.getByRole('button',{name:/^Đăng nhập$/}))
    expect(await screen.findByText('Parking map')).toBeInTheDocument()
    await waitFor(()=>expect(screen.getByTestId('location')).toHaveTextContent('/parking'))
    expect(screen.queryByText('Driver dashboard')).not.toBeInTheDocument()
  })
  it('honors a safe map destination for an already authenticated driver', async () => {
    localStorage.setItem('access_token',token('DRIVER'))
    setup('/login?next=%2Fparking')
    expect(await screen.findByText('Parking map')).toBeInTheDocument()
  })

})
