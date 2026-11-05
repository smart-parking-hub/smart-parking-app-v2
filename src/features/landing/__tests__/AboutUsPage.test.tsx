import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AboutUsPage } from '../pages/AboutUsPage'

afterEach(cleanup)

it('provides a single landing main and working about-page destinations for guests', () => {
  render(<MemoryRouter initialEntries={['/company/about']}><AboutUsPage /></MemoryRouter>)
  expect(screen.getAllByRole('main')).toHaveLength(1)
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  for (const name of [/GIA NHẬP MẠNG LƯỚI/, /LIÊN HỆ ĐỐI TÁC/]) {
    expect(screen.getByRole('link', { name })).toHaveAttribute('href', '/company/contact')
  }
  const report = screen.getByRole('link', { name: /Xem báo cáo tác động/i })
  expect(document.getElementById(report.getAttribute('href')!.slice(1))).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Trang chủ' })).toHaveAttribute('href', '/')
})
