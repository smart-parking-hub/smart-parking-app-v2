import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ApiTerminalSection } from './ApiTerminalSection'

describe('API payload copy', () => {
  it('reports denied clipboard access without a false success message', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new DOMException('Denied', 'NotAllowedError')) },
    })
    render(<ApiTerminalSection />)
    fireEvent.click(screen.getByRole('button', { name: /Sao chép payload API/i }))
    expect(await screen.findByRole('status')).toHaveTextContent('Không thể sao chép')
    expect(screen.queryByText('Đã sao chép')).not.toBeInTheDocument()
    expect(screen.getByText(/Giữ chỗ thành công trong 10 phút/)).toBeInTheDocument()
  })
})
