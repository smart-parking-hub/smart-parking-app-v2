import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { HomeTestimonials } from '../components/home/HomeTestimonials'

afterEach(cleanup)

describe('HomeTestimonials Component (ISSUE-INT-01)', () => {
  it('renders heading, testimonial cards, and navigational controls', () => {
    render(<HomeTestimonials />)

    expect(screen.getByRole('heading', { level: 2, name: /Được Tin Dùng Toàn Quốc/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Đánh giá trước đó' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Đánh giá tiếp theo' })).toBeInTheDocument()

    // 3 dot tabs
    const dots = screen.getAllByRole('tab')
    expect(dots).toHaveLength(3)
    expect(dots[0]).toHaveAttribute('aria-selected', 'true')
    expect(dots[1]).toHaveAttribute('aria-selected', 'false')
    expect(dots[2]).toHaveAttribute('aria-selected', 'false')
  })

  it('initially disables the Prev button at boundary (index 0)', () => {
    render(<HomeTestimonials />)

    const prevBtn = screen.getByRole('button', { name: 'Đánh giá trước đó' })
    const nextBtn = screen.getByRole('button', { name: 'Đánh giá tiếp theo' })

    expect(prevBtn).toBeDisabled()
    expect(nextBtn).toBeEnabled()
  })

  it('navigates through slides with Next and Prev buttons, enforcing boundaries', () => {
    render(<HomeTestimonials />)

    const prevBtn = screen.getByRole('button', { name: 'Đánh giá trước đó' })
    const nextBtn = screen.getByRole('button', { name: 'Đánh giá tiếp theo' })
    const dots = screen.getAllByRole('tab')

    // Click Next -> moves to index 1
    fireEvent.click(nextBtn)
    expect(dots[0]).toHaveAttribute('aria-selected', 'false')
    expect(dots[1]).toHaveAttribute('aria-selected', 'true')
    expect(dots[2]).toHaveAttribute('aria-selected', 'false')
    expect(prevBtn).toBeEnabled()
    expect(nextBtn).toBeEnabled()

    // Click Next again -> moves to index 2 (last item)
    fireEvent.click(nextBtn)
    expect(dots[1]).toHaveAttribute('aria-selected', 'false')
    expect(dots[2]).toHaveAttribute('aria-selected', 'true')
    expect(prevBtn).toBeEnabled()
    expect(nextBtn).toBeDisabled()

    // Click Prev -> moves back to index 1
    fireEvent.click(prevBtn)
    expect(dots[1]).toHaveAttribute('aria-selected', 'true')
    expect(nextBtn).toBeEnabled()

    // Click Prev again -> moves back to index 0
    fireEvent.click(prevBtn)
    expect(dots[0]).toHaveAttribute('aria-selected', 'true')
    expect(prevBtn).toBeDisabled()
  })

  it('allows jumping directly to a slide using dot tab buttons', () => {
    render(<HomeTestimonials />)

    const dots = screen.getAllByRole('tab')
    const prevBtn = screen.getByRole('button', { name: 'Đánh giá trước đó' })
    const nextBtn = screen.getByRole('button', { name: 'Đánh giá tiếp theo' })

    // Jump to index 2
    fireEvent.click(dots[2])
    expect(dots[2]).toHaveAttribute('aria-selected', 'true')
    expect(prevBtn).toBeEnabled()
    expect(nextBtn).toBeDisabled()

    // Jump to index 0
    fireEvent.click(dots[0])
    expect(dots[0]).toHaveAttribute('aria-selected', 'true')
    expect(prevBtn).toBeDisabled()
    expect(nextBtn).toBeEnabled()
  })
})
