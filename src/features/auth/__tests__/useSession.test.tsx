import { act, cleanup, render, screen, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import {
  clearSession,
  getToken,
  isSessionRemembered,
  readSession,
  saveSession,
  useSession,
} from '@/features/auth'
import { LandingNavbar } from '@/features/landing/components/common/LandingNavbar'

function createToken(role: string, exp = Math.floor(Date.now() / 1000) + 3600) {
  return `test.${btoa(JSON.stringify({ role, exp }))}.test`
}

describe('useSession & Remember-Me Storage Architecture', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    clearSession()
  })

  afterEach(() => {
    cleanup()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('initializes with unauthenticated state when storage is empty', () => {
    const { result } = renderHook(() => useSession())
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.role).toBeNull()
    expect(result.current.dashboardUrl).toBe('/dashboard')
    expect(getToken()).toBeNull()
  })

  it('saveSession with remember = true writes to localStorage and wipes sessionStorage', () => {
    const jwt = createToken('DRIVER')
    sessionStorage.setItem('access_token', 'stale-token')

    act(() => {
      saveSession(jwt, true)
    })

    expect(localStorage.getItem('access_token')).toBe(jwt)
    expect(sessionStorage.getItem('access_token')).toBeNull()
    expect(getToken()).toBe(jwt)
    expect(isSessionRemembered()).toBe(true)

    const session = readSession()
    expect(session?.role).toBe('DRIVER')
  })

  it('saveSession with remember = false writes to sessionStorage and wipes localStorage', () => {
    const jwt = createToken('MERCHANT')
    localStorage.setItem('access_token', 'stale-local-token')

    act(() => {
      saveSession(jwt, false)
    })

    expect(sessionStorage.getItem('access_token')).toBe(jwt)
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(getToken()).toBe(jwt)
    expect(isSessionRemembered()).toBe(false)

    const session = readSession()
    expect(session?.role).toBe('MERCHANT')
  })

  it('useSession hook updates reactively on saveSession and clearSession', () => {
    const { result } = renderHook(() => useSession())
    expect(result.current.isAuthenticated).toBe(false)

    const jwt = createToken('ADMIN')
    act(() => {
      saveSession(jwt, true)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.role).toBe('ADMIN')
    expect(result.current.dashboardUrl).toBe('/admin/dashboard')

    act(() => {
      clearSession()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.role).toBeNull()
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(sessionStorage.getItem('access_token')).toBeNull()
  })

  it('useSession hook synchronizes across browser tabs via storage event', () => {
    const { result } = renderHook(() => useSession())
    expect(result.current.isAuthenticated).toBe(false)

    // Simulate another browser tab saving a session into localStorage
    const jwt = createToken('DRIVER')
    localStorage.setItem('access_token', jwt)

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'access_token' }))
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.role).toBe('DRIVER')
    expect(result.current.dashboardUrl).toBe('/dashboard')

    // Simulate another tab logging out
    localStorage.removeItem('access_token')
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'access_token' }))
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.role).toBeNull()
  })

  it('LandingNavbar displays "Đăng nhập" when guest, and "Vào Dashboard" + "Đăng xuất" when authenticated', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/']}>
        <LandingNavbar />
      </MemoryRouter>
    )

    // Initially guest
    expect(screen.getAllByText('Đăng nhập')[0]).toBeInTheDocument()
    expect(screen.queryByText('Vào Dashboard')).not.toBeInTheDocument()

    unmount()

    // Now log in as MERCHANT
    saveSession(createToken('MERCHANT'), true)

    render(
      <MemoryRouter initialEntries={['/']}>
        <LandingNavbar />
      </MemoryRouter>
    )

    // Should display Vào Dashboard on both desktop and mobile
    const dashboardLinks = screen.getAllByText('Vào Dashboard')
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1)
    expect(dashboardLinks[0].closest('a')).toHaveAttribute('href', '/merchant/dashboard')

    const logoutButtons = screen.getAllByText(/Đăng xuất/)
    expect(logoutButtons.length).toBeGreaterThanOrEqual(1)
  })
})
