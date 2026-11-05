import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LandingNavbar } from '../components/common/LandingNavbar'

afterEach(cleanup)
it('exposes the blog entry from home on desktop and mobile', async () => {
  const user = userEvent.setup()
  render(<MemoryRouter initialEntries={['/']}><LandingNavbar /></MemoryRouter>)
  for (const link of screen.getAllByRole('link', { name: /Tin tức & Báo cáo/ })) {
    expect(link).toHaveAttribute('href', '/company/blog')
  }
  await user.click(screen.getByRole('button', { name: 'Mở menu điều hướng' }))
  expect(within(screen.getByRole('navigation', { name: 'Điều hướng di động' })).getByRole('link', { name: 'Tin tức & Báo cáo' })).toHaveAttribute('href', '/company/blog')
})
it('points the blog newsletter action to its section', () => {
  render(<MemoryRouter initialEntries={['/company/blog']}><LandingNavbar /></MemoryRouter>)
  expect(screen.getByRole('link', { name: 'Đăng ký bản tin' })).toHaveAttribute('href', '#ban-tin')
})
