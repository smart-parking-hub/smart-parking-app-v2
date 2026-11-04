import { fireEvent, render, screen } from '@testing-library/react'
import { Link, MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { LandingMetadata } from './LandingMetadata'

describe('Landing metadata', () => {
  it('updates metadata on navigation and restores the document on unmount', () => {
    const originalTitle = document.title
    const description = document.createElement('meta')
    description.name = 'description'
    description.content = 'Default description'
    document.head.append(description)
    const { unmount } = render(
      <MemoryRouter initialEntries={['/api-docs']}>
        <LandingMetadata />
        <Link to="/pricing">Bảng giá</Link>
      </MemoryRouter>,
    )
    expect(document.title).toContain('TMS / ERP')
    expect(description.content).toContain('webhook')
    fireEvent.click(screen.getByRole('link', { name: 'Bảng giá' }))
    expect(document.title).toContain('Bảng giá')
    expect(description.content).toContain('theo tháng')
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    unmount()
    expect(document.title).toBe(originalTitle)
    expect(description.content).toBe('Default description')
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull()
    description.remove()
  })

  it.each(['/solutions/api', '/ket-noi-api', '/api-docs/'])(
    'uses the primary canonical URL for %s',
    (path) => {
      render(<MemoryRouter initialEntries={[path]}><LandingMetadata /></MemoryRouter>)
      expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
        'href', new URL('/api-docs', window.location.origin).href,
      )
      expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute(
        'content', new URL('/api-docs', window.location.origin).href,
      )
    },
  )
})
