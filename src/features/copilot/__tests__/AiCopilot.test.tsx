import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AiCopilot } from '../index'
import { sendData } from '@/shared/api/resources'

vi.mock('@/shared/api/resources', () => ({
  sendData: vi.fn(),
  errorMessage: vi.fn((err: any) => err?.message || 'Lỗi kết nối'),
}))

function renderAiCopilot(initialEntries = ['/']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <AiCopilot />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('AiCopilot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders trigger button and opens chat panel upon click', async () => {
    const user = userEvent.setup()
    renderAiCopilot(['/'])

    const triggerBtn = screen.getByRole('button', { name: /Mở trợ lý AI/i })
    expect(triggerBtn).toBeInTheDocument()

    await user.click(triggerBtn)

    expect(screen.getByRole('heading', { name: /SmartParking AI Copilot/i })).toBeInTheDocument()
    expect(screen.getByText(/Chào bạn! Tôi là SmartParking AI Copilot./i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tìm bãi đỗ xe gần tôi còn chỗ/i })).toBeInTheDocument()
  })

  it('detects parking lot ID from URL and shows context banner', async () => {
    const user = userEvent.setup()
    renderAiCopilot(['/merchant/parking-lots/42'])

    // Open chat
    await user.click(screen.getByRole('button', { name: /Mở trợ lý AI/i }))

    expect(screen.getByText(/Hỗ trợ riêng cho Bãi xe #42/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Biểu phí bãi này tính thế nào\?/i })).toBeInTheDocument()

    // Test clearing context
    const clearBtn = screen.getByRole('button', { name: /Hỏi chung ✕/i })
    await user.click(clearBtn)

    expect(screen.queryByText(/Hỗ trợ riêng cho Bãi xe #42/i)).not.toBeInTheDocument()
  })

  it('submits query with parkingLotId and renders reply with source badges and suggested lots', async () => {
    const user = userEvent.setup()
    vi.mocked(sendData).mockResolvedValueOnce({
      reply: 'Bãi xe #15 có giá 25.000đ/giờ và mở cửa 24/7.',
      source: 'DYNAMIC_LOT_RAG',
      suggestedLots: [
        {
          lotId: 15,
          lotName: 'Depot Container Cát Lái 1',
          address: 'Đường Nguyễn Thị Định, TP Thủ Đức',
          availableSlots: 12,
          pricePerHour: 25000,
        },
      ],
    })

    renderAiCopilot(['/parking/15'])

    // Open chat
    await user.click(screen.getByRole('button', { name: /Mở trợ lý AI/i }))

    // Type query
    const input = screen.getByPlaceholderText(/Hỏi về Bãi xe #15/i)
    await user.type(input, 'Giá đỗ xe thế nào?')

    // Send
    const sendBtn = screen.getByRole('button', { name: /Gửi câu hỏi/i })
    await user.click(sendBtn)

    await waitFor(() => {
      expect(sendData).toHaveBeenCalledWith(
        'post',
        '/api/v1/ai/chat',
        {
          message: 'Giá đỗ xe thế nào?',
          parkingLotId: 15,
        },
      )
    })

    // Verify response rendered
    await waitFor(() => {
      expect(screen.getByText(/Bãi xe #15 có giá 25.000đ\/giờ và mở cửa 24\/7./i)).toBeInTheDocument()
      expect(screen.getByText(/Depot Container Cát Lái 1/i)).toBeInTheDocument()
      expect(screen.getByText(/Còn 12 chỗ trống/i)).toBeInTheDocument()
    })
  })
})
