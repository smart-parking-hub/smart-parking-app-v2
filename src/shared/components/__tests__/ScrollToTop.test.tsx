import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { ScrollToTop, useScrollToTop } from '../ScrollToTop'

function DummyPage({ name }: { name: string }) {
  return (
    <div>
      <h1>Trang: {name}</h1>
      <Link to="/page-1">Sang Trang 1</Link>
      <Link to="/page-2">Sang Trang 2</Link>
      <Link to="/page-1#section-b">Sang Mục B Trang 1</Link>
      <Link to="/page-1#not-found-id">Sang Anchor Không Tồn Tại</Link>
      <div id="section-b" style={{ height: 200 }}>Mục B Target</div>
    </div>
  )
}

function HookHarness() {
  useScrollToTop()
  const location = useLocation()
  return <div>Hook Harness Active: {location.pathname}</div>
}

describe('ScrollToTop & useScrollToTop Component and Hook', () => {
  let scrollToSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    scrollToSpy = vi.fn()
    window.scrollTo = scrollToSpy
    document.documentElement.scrollTop = 500
    document.body.scrollTop = 500
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('automatically scrolls window and document to (0, 0) on initial render', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
        <DummyPage name="Home" />
      </MemoryRouter>
    )

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
    expect(document.documentElement.scrollTop).toBe(0)
    expect(document.body.scrollTop).toBe(0)
  })

  it('resets scroll position to (0, 0) whenever route pathname changes', async () => {
    render(
      <MemoryRouter initialEntries={['/page-1']}>
        <ScrollToTop />
        <Routes>
          <Route path="/page-1" element={<DummyPage name="1" />} />
          <Route path="/page-2" element={<DummyPage name="2" />} />
        </Routes>
      </MemoryRouter>
    )

    expect(scrollToSpy).toHaveBeenCalledTimes(1)

    // Simulate user scrolling down
    document.documentElement.scrollTop = 1200
    document.body.scrollTop = 1200

    // Click link to navigate to /page-2
    const toPage2Link = screen.getByRole('link', { name: 'Sang Trang 2' })
    act(() => {
      toPage2Link.click()
    })

    expect(screen.getByText('Trang: 2')).toBeInTheDocument()
    expect(scrollToSpy).toHaveBeenCalledTimes(2)
    expect(scrollToSpy).toHaveBeenLastCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
    expect(document.documentElement.scrollTop).toBe(0)
    expect(document.body.scrollTop).toBe(0)
  })

  it('scrolls to target element when URL has an anchor hash (#section-b)', () => {
    const scrollIntoViewSpy = vi.fn()
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewSpy

    render(
      <MemoryRouter initialEntries={['/page-1#section-b']}>
        <ScrollToTop />
        <DummyPage name="1" />
      </MemoryRouter>
    )

    expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('falls back to window.scrollTo(0, 0) when anchor hash target does not exist in DOM', () => {
    render(
      <MemoryRouter initialEntries={['/page-1#unknown-anchor']}>
        <ScrollToTop />
        <DummyPage name="1" />
      </MemoryRouter>
    )

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  })

  it('resets scroll on custom container selector when provided', () => {
    const containerDiv = document.createElement('div')
    containerDiv.id = 'custom-scroll-container'
    containerDiv.scrollTop = 800
    document.body.appendChild(containerDiv)

    render(
      <MemoryRouter initialEntries={['/page-1']}>
        <ScrollToTop containerSelector="#custom-scroll-container" />
        <DummyPage name="1" />
      </MemoryRouter>
    )

    expect(containerDiv.scrollTop).toBe(0)
    document.body.removeChild(containerDiv)
  })

  it('works seamlessly as a hook (useScrollToTop)', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <HookHarness />
      </MemoryRouter>
    )

    expect(screen.getByText('Hook Harness Active: /dashboard')).toBeInTheDocument()
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  })
})
