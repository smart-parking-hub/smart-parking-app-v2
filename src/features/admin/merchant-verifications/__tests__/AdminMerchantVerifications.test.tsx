import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { AdminMerchantVerificationsPage } from '../pages/AdminMerchantVerificationsPage'
import { AdminMerchantVerificationDetailPage, adminVerificationDetailQueryKey } from '../pages/AdminMerchantVerificationDetailPage'
import type {
  AdminMerchantVerificationDetail,
  AdminTaxLookupResult,
  AdminVerificationSummary,
} from '../types/adminMerchantVerificationTypes'

const mockSummaryList: AdminVerificationSummary[] = [
  {
    id: 1,
    merchantId: 10,
    legalName: 'CÔNG TY TNHH VẬN TẢI SMART',
    businessRegistrationNumber: '0101234567',
    status: 'PENDING_REVIEW',
    assessmentStatus: 'COMPLETED',
    submissionVersion: 1,
    submittedAt: '2026-11-18T10:00:00Z',
  },
  {
    id: 2,
    merchantId: 20,
    legalName: 'CÔNG TY CP LOGISTICS ĐÔNG SÀI GÒN',
    businessRegistrationNumber: '0309998888',
    status: 'CHANGES_REQUESTED',
    assessmentStatus: 'UNAVAILABLE',
    submissionVersion: 2,
    submittedAt: '2026-11-18T11:00:00Z',
  },
]

const mockDetail: AdminMerchantVerificationDetail = {
  id: 1,
  merchantId: 10,
  status: 'PENDING_REVIEW',
  draftRevision: 2,
  submissionVersion: 1,
  businessRegistrationNumber: '0101234567',
  legalName: 'CÔNG TY TNHH VẬN TẢI SMART',
  resubmissionNote: 'Đã bổ sung con dấu theo yêu cầu',
  documents: [
    {
      id: '5ab4e7b7-0a35-4bae-a9c5-94a63819e1f1',
      type: 'BUSINESS_REGISTRATION',
      originalName: 'gpkd_scan.png',
      contentType: 'image/png',
      sizeBytes: 250000,
      uploadedAt: '2026-11-18T10:00:00Z',
    },
    {
      id: '5ab4e7b7-0a35-4bae-a9c5-94a63819e1f2',
      type: 'AUTHORIZATION_LETTER',
      originalName: 'giay_uy_quyen.pdf',
      contentType: 'application/pdf',
      sizeBytes: 500000,
      uploadedAt: '2026-11-18T10:00:00Z',
    },
  ],
  assessment: {
    status: 'COMPLETED',
    checkedAt: '2026-11-18T10:05:00Z',
    checks: [
      {
        code: 'REQUIRED_DOCUMENT',
        result: 'PASS',
        documentType: 'BUSINESS_REGISTRATION',
        field: null,
        declaredValue: null,
        extractedValue: null,
        message: 'Đã tải lên đủ giấy phép đăng ký kinh doanh bắt buộc',
      },
      {
        code: 'REGISTRATION_NUMBER_MATCH',
        result: 'PASS',
        documentType: 'BUSINESS_REGISTRATION',
        field: 'businessRegistrationNumber',
        declaredValue: '0101234567',
        extractedValue: '0101234567',
        message: 'Mã số doanh nghiệp trùng khớp với giấy tờ',
      },
      {
        code: 'LEGAL_NAME_MATCH',
        result: 'WARN',
        documentType: 'BUSINESS_REGISTRATION',
        field: 'legalName',
        declaredValue: 'CÔNG TY TNHH VẬN TẢI SMART',
        extractedValue: 'CONG TY TNHH VAN TAI SMART',
        message: 'Tên pháp lý có thể lệch ký tự có dấu',
      },
    ],
  },
  requestedItems: [],
  requirements: [
    { type: 'BUSINESS_REGISTRATION', required: true, maxFiles: 3 },
    { type: 'AUTHORIZATION_LETTER', required: false, maxFiles: 3 },
  ],
  editableItems: [],
  history: [
    {
      submissionVersion: 1,
      action: 'SUBMITTED',
      occurredAt: '2026-11-18T10:00:00Z',
    },
  ],
  updatedAt: '2026-11-18T10:00:00Z',
}

const taxLookupPath = '/api/v1/admin/merchant-verifications/1/submissions/1/tax-lookup'
const taxLookupMetadata = { dossierId: 1, submissionVersion: 1, checkedAt: '2026-11-18T10:06:00Z', retryAt: null }
const foundTaxLookup: AdminTaxLookupResult = {
  ...taxLookupMetadata,
  outcome: 'FOUND',
  business: {
    taxCode: '0101234567',
    name: 'CÔNG TY TNHH VẬN TẢI KHÁC',
    status: 'NNT đang hoạt động',
    source: 'https://www.gdt.gov.vn',
    trial: false,
  },
}

describe('Admin Merchant Verifications Feature (AC2, AC3, AC4, AC5)', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.restoreAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
  })

  function renderDetail(detail = mockDetail) {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: { data: detail } })
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/merchant-verifications/1']}>
          <Routes>
            <Route path="/admin/merchant-verifications/:id" element={<AdminMerchantVerificationDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )
    return get
  }

  async function confirmTaxLookup() {
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: 'Tra cứu mã số thuế' }))
    await user.click(screen.getByRole('button', { name: 'Xác nhận và tra cứu' }))
    return user
  }

  it('requires the Admin to confirm the submitted code and displays registry and OCR fields', async () => {
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { data: foundTaxLookup } })
    renderDetail()

    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: 'Tra cứu mã số thuế' }))
    expect(post).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Xác nhận và tra cứu' }))
    expect(post).toHaveBeenCalledWith(taxLookupPath, { confirmedBusinessTaxCode: true }, { signal: expect.any(AbortSignal) })

    const lookup = within(screen.getByRole('region', { name: 'Tra cứu mã số thuế' }))
    expect(await lookup.findByText('CÔNG TY TNHH VẬN TẢI KHÁC')).toBeVisible()
    expect(lookup.getByText('CONG TY TNHH VAN TAI SMART')).toBeVisible()
    expect(lookup.getByText('NNT đang hoạt động')).toBeVisible()
    expect(lookup.getByText('https://www.gdt.gov.vn')).toBeVisible()
    expect(lookup.getByText('Thời điểm tra cứu')).toBeVisible()
    expect(lookup.getByText(/Tên đăng ký khác tên đã khai/)).toBeVisible()
  })

  it('offers a retry for provider failure and reports confirmed absence separately', async () => {
    vi.spyOn(apiClient, 'post')
      .mockResolvedValueOnce({ data: { data: { ...taxLookupMetadata, outcome: 'UNAVAILABLE', business: null } } })
      .mockResolvedValueOnce({ data: { data: { ...taxLookupMetadata, outcome: 'NOT_FOUND', business: null } } })
    renderDetail()

    const user = await confirmTaxLookup()
    expect(await screen.findByText(/Chưa tra cứu được/)).toBeVisible()
    expect(screen.queryByText(/Không tìm thấy MST/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Duyệt hồ sơ' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Thử lại' }))
    expect(await screen.findByText(/Không tìm thấy MST/)).toBeVisible()
  })

  it('offers manual review for a 12-digit registration while OCR is pending', async () => {
    const taxCode = '012345678901'
    const post = vi.spyOn(apiClient, 'post')
    renderDetail({ ...mockDetail, businessRegistrationNumber: taxCode, assessment: { ...mockDetail.assessment, status: 'PENDING' } })

    expect(await screen.findByText('Đối chiếu mã 12 số trực tiếp trên giấy tờ.')).toBeVisible()
    expect(screen.getByText(taxCode)).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Tra cứu mã số thuế' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Duyệt hồ sơ' })).toBeDisabled()
    expect(post).not.toHaveBeenCalled()
  })

  it('labels trial results without suggesting a name mismatch', async () => {
    const trialLookup = { ...foundTaxLookup, business: { ...foundTaxLookup.business, trial: true } }
    vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { data: trialLookup } })
    renderDetail()
    await confirmTaxLookup()

    expect(await screen.findByText(/Dữ liệu Casso dùng thử/)).toBeVisible()
    expect(screen.queryByText(/Tên đăng ký khác tên đã khai/)).not.toBeInTheDocument()
  })

  it('waits for the retry time when the provider is rate limited', async () => {
    const retryAt = new Date(Date.now() + 60_000).toISOString()
    vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: { data: { ...taxLookupMetadata, outcome: 'UNAVAILABLE', retryAt, business: null } },
    })
    renderDetail()
    await confirmTaxLookup()
    expect(await screen.findByText(/Có thể thử lại sau/)).toBeVisible()
    expect(screen.getByRole('button', { name: 'Thử lại' })).toBeDisabled()
  })

  it('aborts a lookup and drops its result when the submission changes', async () => {
    let resolveLookup = (_value: { data: { data: AdminTaxLookupResult } }) => {}
    const response = new Promise<{ data: { data: AdminTaxLookupResult } }>((resolve) => { resolveLookup = resolve })
    const post = vi.spyOn(apiClient, 'post').mockReturnValue(response)
    renderDetail()

    await confirmTaxLookup()
    expect(screen.getByRole('button', { name: 'Đang tra cứu…' })).toBeDisabled()
    const signal = post.mock.calls[0][2]?.signal
    expect(signal?.aborted).toBe(false)
    act(() => {
      queryClient.setQueryData(adminVerificationDetailQueryKey(1), { ...mockDetail, submissionVersion: 2 })
    })
    expect(await screen.findByRole('button', { name: 'Tra cứu mã số thuế' })).toBeEnabled()
    expect(signal?.aborted).toBe(true)
    await act(async () => { resolveLookup({ data: { data: foundTaxLookup } }) })
    expect(screen.queryByText('CÔNG TY TNHH VẬN TẢI KHÁC')).not.toBeInTheDocument()
  })

  it('reloads on lookup conflict and requires confirmation for the new version', async () => {
    const post = vi.spyOn(apiClient, 'post').mockRejectedValueOnce({ isAxiosError: true, response: { status: 409 } })
    const get = renderDetail()
    await screen.findByRole('button', { name: 'Tra cứu mã số thuế' })
    get.mockResolvedValue({ data: { data: { ...mockDetail, submissionVersion: 2 } } })

    const user = await confirmTaxLookup()
    expect(await screen.findByText(/Dữ liệu mới nhất đã được tải lại/)).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Tra cứu mã số thuế' }))
    expect(screen.getByRole('button', { name: 'Xác nhận và tra cứu' })).toBeVisible()
    expect(post).toHaveBeenCalledTimes(1)
  })

  it.each(['000000', 'GPKD-123'])('shows manual review for unsupported code %s', async (code) => {
    renderDetail({ ...mockDetail, businessRegistrationNumber: code })
    expect(await screen.findByText('Đối chiếu mã này trực tiếp trên giấy tờ.')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Tra cứu mã số thuế' })).not.toBeInTheDocument()
  })

  it('AC2: renders list of pending dossiers with search filter and pagination', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: {
        data: {
          content: mockSummaryList,
          totalPages: 1,
          totalElements: 2,
          size: 10,
          number: 0,
        },
      },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/merchant-verifications']}>
          <Routes>
            <Route path="/admin/merchant-verifications" element={<AdminMerchantVerificationsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('CÔNG TY TNHH VẬN TẢI SMART')).toBeInTheDocument()
    expect(screen.getByText('Kiểm duyệt hồ sơ doanh nghiệp chủ bãi')).toBeInTheDocument()
    expect(screen.getByText('0101234567')).toBeInTheDocument()
    expect(screen.getByText('Merchant #10')).toBeInTheDocument()
    expect(screen.getByText('Hoàn tất')).toBeInTheDocument()
    expect(screen.getByText('CÔNG TY CP LOGISTICS ĐÔNG SÀI GÒN')).toBeInTheDocument()
    expect(screen.getByText('Không khả dụng')).toBeInTheDocument()
  })

  it('AC2: renders detail view with declared info, documents list and assessment checklist', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { data: mockDetail },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/merchant-verifications/1']}>
          <Routes>
            <Route
              path="/admin/merchant-verifications/:id"
              element={<AdminMerchantVerificationDetailPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByText(/Hồ sơ #1 · CÔNG TY TNHH VẬN TẢI SMART/i)).toBeInTheDocument()
    const registrationGroup = screen.getByRole('region', { name: /Giấy chứng nhận đăng ký doanh nghiệp/ })
    const authorizationGroup = screen.getByRole('region', { name: /Giấy ủy quyền đại diện pháp luật/ })
    expect(within(registrationGroup).getByText('gpkd_scan.png')).toBeVisible()
    expect(within(authorizationGroup).getByText('giay_uy_quyen.pdf')).toBeVisible()
    expect(within(authorizationGroup).queryByText('gpkd_scan.png')).not.toBeInTheDocument()
    expect(screen.queryByText(/AUTHORIZATION_LETTER|BUSINESS_REGISTRATION/)).not.toBeInTheDocument()
    expect(screen.getByText('Kiểm tra sơ bộ & Đối chiếu OCR tự động')).toBeInTheDocument()
    expect(screen.getAllByText('Đạt (PASS)').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Cần kiểm tra (WARN)')).toBeInTheDocument()
    expect(screen.getByText('Chưa lưu nguồn đối chiếu')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mở tệp đã đối chiếu' })).not.toBeInTheDocument()
    expect(screen.getByText('Duyệt hồ sơ')).toBeInTheDocument()
    expect(screen.getByText('Yêu cầu bổ sung')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Làm mới' })).not.toBeInTheDocument()
  })

  it('AC3: allows Admin to request changes with required reasons per item', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { data: mockDetail },
    })
    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      data: {
        data: {
          ...mockDetail,
          status: 'CHANGES_REQUESTED',
        },
      },
    })

    const user = userEvent.setup()
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/merchant-verifications/1']}>
          <Routes>
            <Route
              path="/admin/merchant-verifications/:id"
              element={<AdminMerchantVerificationDetailPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await screen.findByText(/Hồ sơ #1 · CÔNG TY TNHH VẬN TẢI SMART/i)
    await user.click(screen.getByRole('button', { name: /Yêu cầu bổ sung/i }))

    expect(await screen.findByText('Yêu cầu bổ sung / chỉnh sửa hồ sơ')).toBeInTheDocument()

    // Type reason for BUSINESS_REGISTRATION
    const reasonInput = screen.getByPlaceholderText(
      /Mô tả rõ lý do cần bổ sung \(ví dụ: ảnh mờ góc, thiếu con dấu, sai mã số thuế\)…/i,
    )
    await user.type(reasonInput, 'Bản scan giấy phép kinh doanh mờ góc dưới.')

    // Submit change request
    const submitBtn = screen.getByRole('button', { name: /Gửi yêu cầu bổ sung/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/v1/admin/merchant-verifications/1/request-changes',
        {
          submissionVersion: 1,
          items: [
            {
              key: 'BUSINESS_REGISTRATION',
              reason: 'Bản scan giấy phép kinh doanh mờ góc dưới.',
            },
          ],
        },
      )
    })
  })

  it.each(['document list', 'viewer'])('prefills a correction for the selected document from the %s', async (entry) => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { data: mockDetail } })
    const post = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      data: { data: { ...mockDetail, status: 'CHANGES_REQUESTED' } },
    })
    const user = userEvent.setup()

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/merchant-verifications/1']}>
          <Routes>
            <Route path="/admin/merchant-verifications/:id" element={<AdminMerchantVerificationDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    const documentRow = (await screen.findByText('giay_uy_quyen.pdf')).closest('li')!
    if (entry === 'viewer') {
      await user.click(within(documentRow).getByRole('button', { name: 'Xem' }))
      const viewer = await screen.findByRole('dialog', { name: /giay_uy_quyen\.pdf/ })
      await user.click(within(viewer).getByRole('button', { name: 'Không đúng yêu cầu' }))
      expect(viewer).not.toBeInTheDocument()
    } else {
      await user.click(within(documentRow).getByRole('button', { name: /Không đúng yêu cầu/ }))
    }

    const dialog = within(await screen.findByRole('dialog', { name: 'Yêu cầu bổ sung / chỉnh sửa hồ sơ' }))
    expect(dialog.getByRole('checkbox', { name: 'Giấy ủy quyền người đại diện' })).toBeChecked()
    expect(dialog.getByRole('checkbox', { name: /Giấy chứng nhận đăng ký/ })).not.toBeChecked()
    const reason = dialog.getByRole('textbox')
    expect(reason).toHaveValue(
      'Tệp “giay_uy_quyen.pdf” không đúng yêu cầu. Vui lòng tải lại bộ tệp đúng loại cho mục này.',
    )
    expect(post).not.toHaveBeenCalled()

    const editedReason = 'Vui lòng tải lại giấy ủy quyền.'
    await user.clear(reason)
    await user.type(reason, editedReason)
    await user.click(dialog.getByRole('button', { name: /Gửi yêu cầu bổ sung/ }))
    await waitFor(() => {
      expect(post).toHaveBeenCalledWith('/api/v1/admin/merchant-verifications/1/request-changes', {
        submissionVersion: 1,
        items: [{ key: 'AUTHORIZATION_LETTER', reason: editedReason }],
      })
    })
  })

  it('AC4: requires review note when checklist has WARN before approving', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { data: mockDetail },
    })
    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      data: {
        data: {
          ...mockDetail,
          status: 'VERIFIED',
        },
      },
    })

    const user = userEvent.setup()
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/merchant-verifications/1']}>
          <Routes>
            <Route
              path="/admin/merchant-verifications/:id"
              element={<AdminMerchantVerificationDetailPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await screen.findByText(/Hồ sơ #1 · CÔNG TY TNHH VẬN TẢI SMART/i)
    await user.click(screen.getByRole('button', { name: /Duyệt hồ sơ/i }))

    expect(await screen.findByText('Phê duyệt hồ sơ doanh nghiệp chủ bãi')).toBeInTheDocument()
    expect(
      screen.getByText(/Lưu ý: Hồ sơ có cảnh báo kiểm tra sơ bộ hoặc OCR không khả dụng/i),
    ).toBeInTheDocument()

    // Check confirmation checkbox
    const checkbox = screen.getByLabelText(/Tôi xác nhận đã xem xét trực tiếp đầy đủ/i)
    await user.click(checkbox)

    // Note is required because check has WARN
    const noteInput = screen.getByPlaceholderText(
      /Nhập giải trình kiểm tra thủ công đối chiếu tài liệu gốc…/i,
    )
    await user.type(noteInput, 'Đã đối chiếu con dấu và chữ ký trên bản gốc, tên chuẩn xác.')

    // Submit approval
    const confirmBtn = screen.getByRole('button', { name: 'Phê duyệt hồ sơ' })
    await waitFor(() => expect(confirmBtn).toBeEnabled())
    await user.click(confirmBtn)

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/v1/admin/merchant-verifications/1/approve',
        {
          submissionVersion: 1,
          documentsReviewed: true,
          note: 'Đã đối chiếu con dấu và chữ ký trên bản gốc, tên chuẩn xác.',
        },
      )
    })
  })

  it('AC5: handles 409 conflict during Admin action and prompts reload', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: { data: mockDetail },
    })

    const conflictError = Object.assign(new Error('Phiên bản nộp không khớp với phiên bản đang chờ duyệt hiện tại!'), {
      isAxiosError: true,
      response: {
        status: 409,
        data: { message: 'Phiên bản nộp không khớp với phiên bản đang chờ duyệt hiện tại!' },
      },
    })
    vi.spyOn(apiClient, 'post').mockRejectedValueOnce(conflictError)

    const user = userEvent.setup()
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/merchant-verifications/1']}>
          <Routes>
            <Route
              path="/admin/merchant-verifications/:id"
              element={<AdminMerchantVerificationDetailPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await screen.findByText(/Hồ sơ #1 · CÔNG TY TNHH VẬN TẢI SMART/i)
    await user.click(screen.getByRole('button', { name: /Duyệt hồ sơ/i }))

    const checkbox = screen.getByLabelText(/Tôi xác nhận đã xem xét trực tiếp đầy đủ/i)
    await user.click(checkbox)
    const noteInput = screen.getByPlaceholderText(
      /Nhập giải trình kiểm tra thủ công đối chiếu tài liệu gốc…/i,
    )
    await user.type(noteInput, 'Đã kiểm tra thủ công bản gốc.')

    const confirmBtn = screen.getByRole('button', { name: 'Phê duyệt hồ sơ' })
    await user.click(confirmBtn)

    expect(
      await screen.findByText(/Dữ liệu mới nhất đã được tải lại/i),
    ).toBeInTheDocument()
  })

  it('closes a reviewed v1 action when v2 becomes current and requires a new confirmation', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { data: mockDetail } })
    const post = vi.spyOn(apiClient, 'post')
    const user = userEvent.setup()
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/merchant-verifications/1']}>
          <Routes>
            <Route path="/admin/merchant-verifications/:id" element={<AdminMerchantVerificationDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await user.click(await screen.findByRole('button', { name: 'Duyệt hồ sơ' }))
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toBeChecked()
    act(() => {
      queryClient.setQueryData(adminVerificationDetailQueryKey(1), { ...mockDetail, submissionVersion: 2 })
    })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(post).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Duyệt hồ sơ' }))
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Phê duyệt hồ sơ' })).toBeDisabled()
  })

})
