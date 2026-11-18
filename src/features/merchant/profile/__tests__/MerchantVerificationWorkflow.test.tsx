import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { ProfileDocuments, verificationDossierQueryKey } from '../components/ProfileDocuments'
import type { MerchantProfile } from '../types/merchantProfileTypes'
import type { MerchantVerificationDetail } from '../types/merchantVerificationTypes'

const dummyProfile: MerchantProfile = {
  merchantId: 10,
  userId: 4,
  fullName: 'Nguyễn Văn Chủ Bãi',
  phone: '0901234567',
  email: 'chubai@smartparking.vn',
  citizenId: '012345678901',
  maskedCitizenId: '********8901',
  businessLicense: 'GPKD-12345',
  bankName: 'Vietcombank',
  bankAccountNum: '0011001234567',
  maskedBankAccount: '*********4567',
  walletBalance: 1000000,
  accountStatus: 'ACTIVE',
  verificationStatus: 'DRAFT',
  verificationLabel: 'Bản nháp',
  address: 'Hà Nội',
  emergencyContact: '0909999999',
}

const mockDraftDossier: MerchantVerificationDetail = {
  id: 1,
  merchantId: 10,
  status: 'DRAFT',
  draftRevision: 1,
  submissionVersion: null,
  businessRegistrationNumber: '0101234567',
  legalName: 'CÔNG TY TNHH VẬN TẢI SMART',
  resubmissionNote: null,
  documents: [
    {
      id: '5ab4e7b7-0a35-4bae-a9c5-94a63819e1f1',
      type: 'BUSINESS_REGISTRATION',
      originalName: 'gpkd_scan.pdf',
      contentType: 'application/pdf',
      sizeBytes: 150000,
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
    ],
  },
  requestedItems: [],
  requirements: [
    { type: 'BUSINESS_REGISTRATION', required: true, maxFiles: 3 },
    { type: 'AUTHORIZATION_LETTER', required: false, maxFiles: 3 },
    { type: 'SUPPORTING_DOCUMENT', required: false, maxFiles: 3 },
  ],
  editableItems: ['BUSINESS_INFO', 'BUSINESS_REGISTRATION', 'AUTHORIZATION_LETTER', 'SUPPORTING_DOCUMENT'],
  history: [],
  updatedAt: '2026-11-18T10:00:00Z',
}

describe('Merchant KYC Business Verification Workflow (AC1, AC3, AC4, AC5)', () => {
  let queryClient: QueryClient
  const onUpdated = vi.fn()

  beforeEach(() => {
    vi.restoreAllMocks()
    onUpdated.mockClear()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
  })

  function renderComponent() {
    return render(
      <QueryClientProvider client={queryClient}>
        <ProfileDocuments profile={dummyProfile} onUpdated={onUpdated} />
      </QueryClientProvider>,
    )
  }

  it('AC1: displays draft status, pre-fills business info and allows saving draft details', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { data: mockDraftDossier },
    })
    vi.spyOn(apiClient, 'put').mockResolvedValueOnce({
      data: {
        data: {
          ...mockDraftDossier,
          draftRevision: 2,
          legalName: 'CÔNG TY TNHH VẬN TẢI SMART MỚI',
        },
      },
    })

    const user = userEvent.setup()
    renderComponent()

    expect(await screen.findByDisplayValue('0101234567')).toBeInTheDocument()
    expect(await screen.findByDisplayValue('CÔNG TY TNHH VẬN TẢI SMART')).toBeInTheDocument()
    expect(screen.getByText('Bản nháp')).toBeInTheDocument()

    // Edit legal name
    const legalNameInput = screen.getByLabelText('Tên pháp lý công ty / doanh nghiệp')
    await user.clear(legalNameInput)
    await user.type(legalNameInput, 'CÔNG TY TNHH VẬN TẢI SMART MỚI')

    // Click "Lưu nháp thông tin"
    const saveBtn = screen.getByRole('button', { name: /Lưu nháp thông tin/i })
    await user.click(saveBtn)

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledWith(
        '/api/v1/merchant/profile/verification/details',
        expect.objectContaining({
          draftRevision: 1,
          businessRegistrationNumber: '0101234567',
          legalName: 'CÔNG TY TNHH VẬN TẢI SMART MỚI',
        }),
      )
    })
  })

  it('AC1 & AC4: submits verification dossier when required documents and info are present', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { data: mockDraftDossier },
    })
    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      data: {
        data: {
          ...mockDraftDossier,
          status: 'PENDING_REVIEW',
          submissionVersion: 1,
          editableItems: [],
        },
      },
    })

    const user = userEvent.setup()
    renderComponent()

    await screen.findByDisplayValue('0101234567')
    const submitBtn = await screen.findByRole('button', { name: /Gửi duyệt hồ sơ/i })
    await waitFor(() => expect(submitBtn).toBeEnabled())

    await user.click(submitBtn)
    const confirmDialog = screen.getByRole('dialog', { name: 'Xác nhận gửi phiên bản #1' })
    expect(within(confirmDialog).getByRole('button', { name: 'Kiểm tra lại' })).toHaveFocus()
    expect(apiClient.post).not.toHaveBeenCalled()
    await user.click(within(confirmDialog).getByRole('button', { name: 'Kiểm tra lại' }))
    expect(apiClient.post).not.toHaveBeenCalled()

    await user.click(submitBtn)
    await user.click(screen.getByRole('button', { name: 'Xác nhận gửi' }))

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/v1/merchant/profile/verification/submit',
        { draftRevision: 1 },
      )
    })

    expect(await screen.findByText('Gửi hồ sơ thành công')).toBeInTheDocument()
    expect(screen.getByText(/Phiên bản nộp #1 đang chờ/)).toBeVisible()
    expect(screen.getByText('Gửi nhầm giấy tờ?')).toBeVisible()
    expect(screen.getByText(/Hãy liên hệ Quản trị viên/)).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Gửi duyệt hồ sơ' })).not.toBeInTheDocument()
  })

  it('AC3: renders requested items when Admin requested changes and enables resubmission note', async () => {
    const changesRequestedDossier: MerchantVerificationDetail = {
      ...mockDraftDossier,
      status: 'CHANGES_REQUESTED',
      draftRevision: 2,
      submissionVersion: 1,
      editableItems: ['BUSINESS_INFO', 'BUSINESS_REGISTRATION'],
      requestedItems: [
        {
          key: 'BUSINESS_REGISTRATION',
          reason: 'Bản scan bị mờ góc dưới, yêu cầu tải lại bản rõ hơn.',
        },
        {
          key: 'BUSINESS_INFO',
          reason: 'Tên pháp lý chưa đúng với con dấu.',
        },
      ],
      history: [
        {
          submissionVersion: 1,
          action: 'CHANGES_REQUESTED',
          occurredAt: '2026-11-18T11:00:00Z',
          items: [
            { key: 'AUTHORIZATION_LETTER', reason: 'Lý do đã lưu ở bản nộp 1.' },
            { key: 'SUPPORTING_DOCUMENT', reason: 'Vui lòng bổ sung giấy tờ liên quan.' },
          ],
        },
      ],
    }

    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { data: changesRequestedDossier },
    })

    renderComponent()

    expect(await screen.findByText(/Quản trị viên yêu cầu bổ sung\/chỉnh sửa hồ sơ/i)).toBeInTheDocument()
    expect(screen.getByText('Yêu cầu bổ sung')).toBeInTheDocument()
    expect(screen.getByText('Thông tin doanh nghiệp:', { exact: true })).toBeVisible()
    expect(screen.getByText('Giấy chứng nhận đăng ký doanh nghiệp / kinh doanh:', { exact: true })).toBeVisible()
    expect(
      screen.getByText(/Bản scan bị mờ góc dưới, yêu cầu tải lại bản rõ hơn./i),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/Ghi chú giải trình khi cập nhật lại thông tin doanh nghiệp/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Phiên bản 1 · Yêu cầu bổ sung hồ sơ/i)).toBeInTheDocument()
    expect(screen.getByText('Giấy ủy quyền đại diện pháp luật:', { exact: true })).toBeVisible()
    expect(screen.getByText('Tài liệu / Giấy tờ bổ sung:', { exact: true })).toBeVisible()
    expect(screen.getByText(/Lý do đã lưu ở bản nộp 1/)).toBeVisible()
    expect(screen.queryByText(/AUTHORIZATION_LETTER|BUSINESS_REGISTRATION|BUSINESS_INFO|SUPPORTING_DOCUMENT/)).not.toBeInTheDocument()
  })

  it('shows the next submission version after Admin requests a correction', async () => {
    const dossier = {
      ...mockDraftDossier,
      status: 'CHANGES_REQUESTED' as const,
      draftRevision: 5,
      submissionVersion: 1,
      editableItems: ['AUTHORIZATION_LETTER'],
      requestedItems: [{ key: 'AUTHORIZATION_LETTER', reason: 'Tải lại đúng loại giấy tờ.', addressed: false }],
    }
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { data: dossier } })
    const post = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      data: { data: { ...dossier, status: 'PENDING_REVIEW', draftRevision: 7, submissionVersion: 2, editableItems: [] } },
    })

    const user = userEvent.setup()
    renderComponent()
    const submit = await screen.findByRole('button', { name: 'Gửi phiên bản #2' })
    const authorization = screen.getByRole('region', { name: 'Giấy ủy quyền đại diện pháp luật' })
    const registration = screen.getByRole('region', { name: /Giấy chứng nhận đăng ký doanh nghiệp/ })
    expect(authorization.compareDocumentPosition(registration) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(authorization).getByText('Được mở để bổ sung')).toBeVisible()
    expect(within(authorization).getByLabelText(/Tải tệp:/)).toBeEnabled()
    expect(within(registration).getByText('Giữ nguyên tệp từ phiên #1. Chỉ xem và tải về.')).toBeVisible()
    expect(within(registration).getByText('gpkd_scan.pdf')).toBeVisible()
    expect(within(registration).queryByLabelText(/Tải tệp:/)).not.toBeInTheDocument()
    expect(submit).toBeDisabled()
    expect(screen.getByText(/Vui lòng tải lên tài liệu mới cho mục “Giấy ủy quyền đại diện pháp luật”/)).toBeVisible()

    act(() => {
      queryClient.setQueryData(verificationDossierQueryKey, {
        ...dossier,
        draftRevision: 6,
        requestedItems: [{ ...dossier.requestedItems[0], addressed: true }],
      })
    })
    expect(await within(authorization).findByText('Đã cập nhật trong bản chỉnh sửa')).toBeVisible()
    await user.click(submit)
    expect(screen.getByRole('dialog', { name: 'Xác nhận gửi phiên bản #2' })).toBeVisible()
    expect(post).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Xác nhận gửi' }))
    expect(await screen.findByText(/Phiên bản nộp #2 đang chờ/)).toBeVisible()
    expect(post).toHaveBeenCalledWith('/api/v1/merchant/profile/verification/submit', { draftRevision: 6 })
  })

  it('AC5: handles 409 conflict gracefully and refetches fresh data', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: { data: mockDraftDossier },
    })

    const conflictError = Object.assign(new Error('Phiên bản chỉnh sửa không khớp (dữ liệu đã thay đổi ở phiên khác)'), {
      isAxiosError: true,
      response: {
        status: 409,
        data: { message: 'Phiên bản chỉnh sửa không khớp (dữ liệu đã thay đổi ở phiên khác)' },
      },
    })
    vi.spyOn(apiClient, 'post').mockRejectedValueOnce(conflictError)

    const user = userEvent.setup()
    renderComponent()

    await screen.findByDisplayValue('0101234567')
    const submitBtn = await screen.findByRole('button', { name: /Gửi duyệt hồ sơ/i })
    await waitFor(() => expect(submitBtn).toBeEnabled())
    await user.click(submitBtn)
    await user.click(screen.getByRole('button', { name: 'Xác nhận gửi' }))

    expect(
      await screen.findByText(/Dữ liệu mới nhất đã được tải lại/i),
    ).toBeInTheDocument()
  })

  it('keeps unsaved details across uploads and cache refreshes and blocks submission until saved', async () => {
    const user = userEvent.setup()
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { data: mockDraftDossier } })
    vi.spyOn(apiClient, 'put').mockResolvedValueOnce({
      data: { data: { ...mockDraftDossier, draftRevision: 2 } },
    })
    renderComponent()
    const name = await screen.findByLabelText('Tên pháp lý công ty / doanh nghiệp')
    await user.clear(name)
    await user.type(name, 'Tên vẫn đang nhập')
    await user.upload(
      screen.getByLabelText(/Tải tệp: Giấy chứng nhận/),
      new File(['fixture'], 'new.pdf', { type: 'application/pdf' }),
    )
    await screen.findByRole('dialog', { name: 'Đã tải lên tài liệu' })
    expect(name).toHaveValue('Tên vẫn đang nhập')
    expect(screen.getByRole('button', { name: 'Gửi duyệt hồ sơ' })).toBeDisabled()
    act(() => {
      queryClient.setQueryData(verificationDossierQueryKey, { ...mockDraftDossier, draftRevision: 3 })
    })
    expect(name).toHaveValue('Tên vẫn đang nhập')
    expect(screen.getByText(/Vui lòng lưu thông tin đã chỉnh sửa/)).toBeVisible()
  })

  it('shows an initial read failure with retry and does not expose draft actions', async () => {
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('Không đọc được hồ sơ'))
      .mockResolvedValueOnce({ data: { data: mockDraftDossier } })
    const user = userEvent.setup()
    renderComponent()

    expect(await screen.findByText(/Không thể tải hồ sơ xác minh/)).toBeVisible()
    expect(screen.queryByLabelText('Tên pháp lý công ty / doanh nghiệp')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Gửi duyệt hồ sơ' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Thử tải lại' }))
    expect(await screen.findByLabelText('Tên pháp lý công ty / doanh nghiệp')).toHaveValue(mockDraftDossier.legalName)
  })

  it('keeps writes locked after a failed conflict refresh and restores them after retry', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { data: mockDraftDossier } })
      .mockRejectedValueOnce(new Error('Mất kết nối'))
      .mockResolvedValueOnce({ data: { data: { ...mockDraftDossier, draftRevision: 2 } } })
    const conflict = Object.assign(new Error('Phiên bản chỉnh sửa không khớp'), {
      isAxiosError: true,
      response: { status: 409, data: { message: 'Phiên bản chỉnh sửa không khớp' } },
    })
    const post = vi.spyOn(apiClient, 'post').mockRejectedValueOnce(conflict)
    const user = userEvent.setup()
    renderComponent()
    const submit = await screen.findByRole('button', { name: 'Gửi duyệt hồ sơ' })

    await user.click(submit)
    await user.click(screen.getByRole('button', { name: 'Xác nhận gửi' }))
    expect(await screen.findByText(/Hồ sơ đã thay đổi và chưa thể tải lại/)).toBeVisible()
    expect(submit).toBeDisabled()
    expect(post).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Thử tải lại' }))
    await waitFor(() => expect(submit).toBeEnabled())
    expect(screen.queryByText(/Hồ sơ đã thay đổi và chưa thể tải lại/)).not.toBeInTheDocument()
    expect(post).toHaveBeenCalledTimes(1)
  })

  it('reports a failed document download and retains the draft', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { data: mockDraftDossier } })
      .mockRejectedValueOnce(new Error('Network Error'))
    const user = userEvent.setup()
    renderComponent()
    await user.click(await screen.findByRole('button', { name: 'Tải về' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Không thể tải tệp gpkd_scan.pdf')
    expect(screen.getByLabelText('Tên pháp lý công ty / doanh nghiệp')).toBeEnabled()
  })

})
