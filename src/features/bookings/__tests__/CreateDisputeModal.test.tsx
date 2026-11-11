import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { getData, sendData } from '@/shared/api/resources'
import { CreateDisputeModal } from '../components/CreateDisputeModal'
import type { DisputeBookingSummary } from '../schemas/disputeSchemas'

vi.mock('@/shared/api/resources', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/api/resources')>()),
  getData: vi.fn(),
  sendData: vi.fn(),
}))

const mockGetData = vi.mocked(getData)
const mockSendData = vi.mocked(sendData)

function renderModal(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

const samplePendingCheckinBooking: DisputeBookingSummary = {
  id: 501,
  bookingCode: 'BK-2026-0501',
  parkingLotId: 14,
  parkingLotName: 'Bãi Container Tân Cảng Gate 2',
  parkingLotAddress: 'Nguyễn Thị Định, TP. Thủ Đức',
  merchantId: 88,
  vehiclePlate: '51C-889.21',
  status: 'PENDING_CHECKIN',
  advanceDeposit: 100000,
  totalAmount: 240000,
}

describe('SCR-MOD-10: CreateDisputeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.URL.createObjectURL = vi.fn(() => 'blob:receipt-preview')
    window.URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    cleanup()
  })

  it('pre-fills PENDING_CHECKIN booking context, shows closed-lot hint, attaches receipt photo, and submits with merchantId', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onSuccess = vi.fn()
    mockSendData.mockResolvedValue({
      id: 77,
      bookingId: 501,
      merchantId: 88,
      driverId: 12,
      reason: 'Thu thêm tiền mặt / phụ phí sai quy định tại cổng',
      description: 'Bảo vệ thu thêm 50k',
      status: 'PENDING',
      resolution: '',
      createdAt: '2026-11-10T10:00:00Z',
      updatedAt: '2026-11-10T10:00:00Z',
    })

    renderModal(
      <CreateDisputeModal
        isOpen={true}
        initialBooking={samplePendingCheckinBooking}
        onClose={onClose}
        onSuccess={onSuccess}
      />,
    )

    expect(screen.getByText('Bãi Container Tân Cảng Gate 2')).toBeInTheDocument()
    expect(screen.getByText(/BK-2026-0501 · #501/)).toBeInTheDocument()
    expect(
      screen.getByText(/Đơn này đã thanh toán giữ chỗ nhưng chưa check-in/i),
    ).toBeInTheDocument()

    // Select quick preset reason
    await user.click(
      screen.getByRole('button', {
        name: 'Thu thêm tiền mặt / phụ phí sai quy định tại cổng',
      }),
    )

    const descInput = screen.getByLabelText(/Mô tả chi tiết sự việc/i)
    await user.type(descInput, 'Bảo vệ cổng B thu thêm 50.000đ tiền mặt sai quy định.')

    // Attach receipt image
    const fileInput = screen.getByLabelText(/Đính kèm hình ảnh bằng chứng/i)
    const receiptFile = new File(['receipt-bytes'], 'bien-lai-thu-tien.png', {
      type: 'image/png',
    })
    fireEvent.change(fileInput, { target: { files: [receiptFile] } })

    expect(await screen.findByText('bien-lai-thu-tien.png')).toBeInTheDocument()
    expect(
      screen.getByText(/hiện API tạo khiếu nại phía máy chủ chỉ lưu nội dung văn bản/i),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Gửi khiếu nại' }))

    await waitFor(() => {
      expect(mockSendData).toHaveBeenCalledWith(
        'post',
        '/api/v1/disputes',
        expect.objectContaining({
          bookingId: 501,
          merchantId: 88,
          reason: 'Thu thêm tiền mặt / phụ phí sai quy định tại cổng',
          description: expect.stringContaining(
            '[Chứng từ đính kèm trên thiết bị: bien-lai-thu-tien.png',
          ),
        }),
      )
    })

    expect(onSuccess).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('validates invalid file types and rejects oversized attachments cleanly', async () => {
    renderModal(
      <CreateDisputeModal
        isOpen={true}
        initialBooking={samplePendingCheckinBooking}
        onClose={vi.fn()}
      />,
    )

    const fileInput = screen.getByLabelText(/Đính kèm hình ảnh bằng chứng/i)
    const badFile = new File(['pdf'], 'invoice.pdf', { type: 'application/pdf' })
    fireEvent.change(fileInput, { target: { files: [badFile] } })

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /không đúng định dạng/i,
    )

    const bigBuffer = new Uint8Array(5 * 1024 * 1024 + 10)
    const hugeImage = new File([bigBuffer], 'huge.jpg', { type: 'image/jpeg' })
    fireEvent.change(fileInput, { target: { files: [hugeImage] } })

    expect(await screen.findByRole('alert')).toHaveTextContent(/vượt quá giới hạn 5 MB/i)
  })

  it('uses custom Select component for eligible bookings (excluding PENDING_PAYMENT) and renders interactive hover upload dropzone', async () => {
    const user = userEvent.setup()
    mockGetData.mockResolvedValue({
      content: [
        samplePendingCheckinBooking,
        {
          id: 502,
          bookingCode: 'BK-2026-0502',
          parkingLotId: 15,
          parkingLotName: 'Bãi Chưa Cọc',
          merchantId: 90,
          vehiclePlate: '51D-111.22',
          status: 'PENDING_PAYMENT',
        },
      ],
      totalElements: 2,
      totalPages: 1,
    })

    renderModal(<CreateDisputeModal isOpen={true} onClose={vi.fn()} />)

    const select = await screen.findByLabelText(/Chọn lượt đỗ xe/i)
    expect(select).toHaveClass('sr-only')
    expect(select).toHaveTextContent('BK-2026-0501')
    expect(select).not.toHaveTextContent('BK-2026-0502')

    // Upload dropzone button includes pointer & hover affordances
    const uploadBtn = screen.getByRole('button', { name: /Chọn ảnh biên lai \/ hiện trường/i })
    expect(uploadBtn).toHaveClass('cursor-pointer')
    expect(uploadBtn.parentElement).toHaveClass('cursor-pointer')

    // Submit without selecting booking or reason -> Zod validation errors
    await user.click(screen.getByRole('button', { name: 'Gửi khiếu nại' }))

    expect(
      await screen.findByText(/Vui lòng chọn hoặc nhập ID Booking hợp lệ/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Vui lòng chọn hoặc nhập lý do khiếu nại/i),
    ).toBeInTheDocument()
    expect(mockSendData).not.toHaveBeenCalled()

    // Open custom Select combobox trigger button and choose #501 inside opened listbox
    const combobox = screen.getByRole('combobox', { name: /Mở danh sách đơn đỗ xe/i })
    await user.click(combobox)
    const listbox = await screen.findByRole('listbox', { name: /Mở danh sách đơn đỗ xe/i })
    const option = within(listbox).getByRole('option', { name: /BK-2026-0501/i })
    await user.click(option)

    expect(combobox).toHaveTextContent('BK-2026-0501')
    expect(screen.getByText(/Chủ bãi liên kết:/i)).toBeInTheDocument()
  })

  it('displays conflict guidance with link to /disputes when server returns 409 CONFLICT', async () => {
    const user = userEvent.setup()
    mockSendData.mockRejectedValue(new Error('Booking này đã có khiếu nại đang được xử lý'))

    renderModal(
      <CreateDisputeModal
        isOpen={true}
        initialBooking={samplePendingCheckinBooking}
        onClose={vi.fn()}
      />,
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Bãi xe đóng cửa / hết chỗ dù đã thanh toán giữ chỗ',
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Gửi khiếu nại' }))

    expect(
      await screen.findByText('Booking này đã có khiếu nại đang được xử lý'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Đi tới Trung tâm khiếu nại/i }),
    ).toHaveAttribute('href', '/disputes')
  })
})

