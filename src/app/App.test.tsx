import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { App } from './App'

describe('Smart Parking App Baseline', () => {
  it('renders application baseline successfully', () => {
    render(<App />)
    expect(
      screen.getByText(/Smart Parking CRM Hub v2 — Kiến Trúc Nền Tảng/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Server State/i)).toBeInTheDocument()
    expect(screen.getByText(/Global UI State/i)).toBeInTheDocument()
    expect(screen.getByText(/Form State/i)).toBeInTheDocument()
  })
})
