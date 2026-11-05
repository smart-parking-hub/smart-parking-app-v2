import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InsightsArticlesGridSection } from '../components/insights/InsightsArticlesGridSection'
import { InsightsNewsletterSection } from '../components/insights/InsightsNewsletterSection'

afterEach(cleanup)
it('reports actual category results and exhausted pagination', () => {
  render(<InsightsArticlesGridSection selectedCategory="yard" searchQuery="" />)
  expect(screen.getAllByRole('article')).toHaveLength(2)
  expect(screen.getByText(/2 \/ 2/)).toBeInTheDocument()
  expect(screen.getByRole('button')).toBeDisabled()
})
it('shows empty search results', () => {
  render(<InsightsArticlesGridSection selectedCategory="all" searchQuery="no-match-xyz" />)
  expect(screen.queryAllByRole('article')).toHaveLength(0)
  expect(screen.getByRole('status')).toHaveTextContent('no-match-xyz')
})
it('validates newsletter email and never claims an unsent subscription succeeded', async () => {
  const user = userEvent.setup()
  render(<InsightsNewsletterSection />)
  await user.click(screen.getByRole('button'))
  expect(await screen.findByText('Vui lòng nhập email hợp lệ.')).toBeInTheDocument()
  await user.type(screen.getByRole('textbox'), 'reader@example.com')
  await user.click(screen.getByRole('button'))
  expect(await screen.findByText(/Chưa thể gửi đăng ký/)).toBeInTheDocument()
})
