import { test, expect } from '@playwright/test'

const createToken = (role: 'ROLE_MERCHANT' | 'ROLE_ADMIN', userId = 10) => {
  const payload = {
    sub: String(userId),
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + 3600,
  }
  return `test.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.test`
}

test.describe('SP-MERCHANT-KYC-01-FE End-to-End Verification Flow', () => {
  test('AC1 & AC4: Merchant selects the PNG from a mixed registration group and submits', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    const token = createToken('ROLE_MERCHANT', 10)
    await page.addInitScript((val) => localStorage.setItem('access_token', val), token)

    const pngId = '5ab4e7b7-0a35-4bae-a9c5-94a63819e1f3'
    const draftDossier = {
      id: 1,
      merchantId: 10,
      status: 'DRAFT',
      draftRevision: 1,
      submissionVersion: 1,
      businessRegistrationNumber: '0101234567',
      legalName: 'CÔNG TY TNHH VẬN TẢI SMART',
      resubmissionNote: null,
      documents: [
        {
          id: '5ab4e7b7-0a35-4bae-a9c5-94a63819e1f2',
          type: 'BUSINESS_REGISTRATION',
          originalName: 'gpkd_scan.pdf',
          contentType: 'application/pdf',
          sizeBytes: 150000,
          uploadedAt: '2026-11-18T10:00:00Z',
        },
        {
          id: pngId,
          type: 'BUSINESS_REGISTRATION',
          originalName: 'gpkd_scan.png',
          contentType: 'image/png',
          sizeBytes: 120000,
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
        ],
      },
      requestedItems: [],
      requirements: [
        { type: 'BUSINESS_REGISTRATION', required: true, maxFiles: 3 },
        { type: 'AUTHORIZATION_LETTER', required: false, maxFiles: 3 },
      ],
      editableItems: ['BUSINESS_INFO', 'BUSINESS_REGISTRATION', 'AUTHORIZATION_LETTER'],
      history: [],
      updatedAt: '2026-11-18T10:00:00Z',
    }

    await page.route('**/api/v1/merchant/profile', (route) =>
      route.fulfill({
        json: {
          data: {
            merchantId: 10,
            userId: 10,
            fullName: 'Chủ Bãi Thông Minh',
            phone: '0901234567',
            email: 'merchant@smartparking.vn',
            citizenId: '012345678901',
            maskedCitizenId: '********8901',
            businessLicense: '0101234567',
            verificationStatus: 'DRAFT',
            verificationLabel: 'Bản nháp',
            walletBalance: 5000000,
            accountStatus: 'ACTIVE',
          },
        },
      }),
    )

    await page.route('**/api/v1/merchant/profile/verification', (route) =>
      route.fulfill({ json: { data: draftDossier } }),
    )

    await page.route('**/api/v1/merchant/profile/verification/details', (route) => {
      expect(route.request().method()).toBe('PUT')
      return route.fulfill({
        json: {
          data: {
            ...draftDossier,
            draftRevision: 2,
            legalName: 'CÔNG TY TNHH VẬN TẢI SMART MỚI',
          },
        },
      })
    })

    await page.route('**/api/v1/merchant/profile/verification/submit', (route) => {
      expect(route.request().method()).toBe('POST')
      expect(route.request().postDataJSON()).toEqual({ draftRevision: 2, ocrDocumentId: pngId })
      return route.fulfill({
        json: {
          data: {
            ...draftDossier,
            status: 'PENDING_REVIEW',
            submissionVersion: 1,
          },
        },
      })
    })

    await page.goto('/merchant/profile#giay-to')

    // Verify header and badge
    await expect(page.getByText('Bản nháp').first()).toBeVisible()
    await expect(page.locator('#profile-license')).toHaveValue('0101234567')

    // Edit legal name and save draft
    await page.locator('#profile-legal-name').fill('CÔNG TY TNHH VẬN TẢI SMART MỚI')
    await page.getByRole('button', { name: /Lưu nháp thông tin/i }).click()
    await expect(page.getByText('Đã lưu thông tin doanh nghiệp')).toBeVisible()
    await page.getByRole('button', { name: 'Đóng' }).click()

    // Test submit button
    const submitBtn = page.getByRole('button', { name: /Gửi duyệt hồ sơ/i })
    await expect(submitBtn).toBeDisabled()
    await page.getByRole('combobox', { name: 'Tệp dùng để đối chiếu' }).selectOption({ label: 'gpkd_scan.png' })
    await expect(submitBtn).toBeEnabled()
    await submitBtn.click()
    await page.getByRole('button', { name: 'Kiểm tra lại' }).click()
    await expect(submitBtn).toBeEnabled()
    await submitBtn.click()
    await page.getByRole('button', { name: 'Xác nhận gửi' }).click()

    await expect(page.getByText('Gửi hồ sơ thành công')).toBeVisible()
    await expect(page.getByText('Gửi nhầm giấy tờ?')).toBeVisible()
    expect(errors).toHaveLength(0)
  })

  test('AC5: Merchant shows editable and carried-over files at 390px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    const token = createToken('ROLE_MERCHANT', 10)
    await page.addInitScript((val) => localStorage.setItem('access_token', val), token)

    await page.route('**/api/v1/merchant/profile', (route) =>
      route.fulfill({
        json: {
          data: {
            merchantId: 10,
            userId: 10,
            fullName: 'Chủ Bãi Thông Minh',
            phone: '0901234567',
            email: 'merchant@smartparking.vn',
            citizenId: '012345678901',
            maskedCitizenId: '********8901',
            businessLicense: '0101234567',
            verificationStatus: 'CHANGES_REQUESTED',
            verificationLabel: 'Yêu cầu bổ sung',
            walletBalance: 5000000,
            accountStatus: 'ACTIVE',
          },
        },
      }),
    )

    await page.route('**/api/v1/merchant/profile/verification', (route) =>
      route.fulfill({
        json: {
          data: {
            id: 1,
            merchantId: 10,
            status: 'CHANGES_REQUESTED',
            draftRevision: 6,
            submissionVersion: 1,
            businessRegistrationNumber: '0101234567',
            legalName: 'CÔNG TY TNHH VẬN TẢI SMART',
            resubmissionNote: null,
            documents: [{
              id: 'e2e-registration-v1',
              type: 'BUSINESS_REGISTRATION',
              originalName: 'giay-dang-ky-v1.pdf',
              sizeBytes: 1000,
              contentType: 'application/pdf',
              uploadedAt: '2026-11-18T10:00:00Z',
            }],
            assessment: { status: 'NOT_STARTED', checkedAt: null, checks: [] },
            requestedItems: [{ key: 'AUTHORIZATION_LETTER', reason: 'Tải lại giấy ủy quyền.', addressed: false }],
            requirements: [{ type: 'BUSINESS_REGISTRATION', required: true, maxFiles: 3 }],
            editableItems: ['AUTHORIZATION_LETTER'],
            history: [],
            updatedAt: '2026-11-18T10:00:00Z',
          },
        },
      }),
    )

    await page.goto('/merchant/profile#giay-to')
    await expect(page.locator('#profile-license')).toHaveValue('0101234567')

    const authorization = page.getByRole('region', { name: 'Giấy ủy quyền đại diện pháp luật' })
    const registration = page.getByRole('region', { name: /Giấy chứng nhận đăng ký doanh nghiệp/ })
    await expect(authorization.getByLabel('Tải tệp: Giấy ủy quyền đại diện pháp luật')).toBeEnabled()
    await expect(registration.getByText('Giữ nguyên tệp từ phiên #1. Chỉ xem và tải về.')).toBeVisible()
    await expect(registration.getByText('giay-dang-ky-v1.pdf')).toBeVisible()
    await expect(registration.getByLabel(/Tải tệp:/)).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Gửi phiên bản #2' })).toBeDisabled()

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(hasHorizontalOverflow).toBe(false)
    expect(errors).toHaveLength(0)
  })

  test('AC2 & AC4: Admin manually reviews a 12-digit registration and approves with a note', async ({
    page,
  }) => {
    const token = createToken('ROLE_ADMIN', 1)
    await page.addInitScript((val) => localStorage.setItem('access_token', val), token)

    const householdTaxCode = '012345678901'

    const pendingSummary = {
      content: [
        {
          id: 101,
          merchantId: 10,
          legalName: 'CÔNG TY TNHH VẬN TẢI SMART',
          businessRegistrationNumber: householdTaxCode,
          status: 'PENDING_REVIEW',
          assessmentStatus: 'COMPLETED',
          submissionVersion: 1,
          submittedAt: '2026-11-18T10:00:00Z',
        },
      ],
      totalPages: 1,
      totalElements: 1,
      size: 10,
      number: 0,
    }

    const detailDossier = {
      id: 101,
      merchantId: 10,
      status: 'PENDING_REVIEW',
      draftRevision: 2,
      submissionVersion: 1,
      businessRegistrationNumber: householdTaxCode,
      legalName: 'CÔNG TY TNHH VẬN TẢI SMART',
      resubmissionNote: null,
      documents: [
        {
          id: '5ab4e7b7-0a35-4bae-a9c5-94a63819e1f1',
          type: 'BUSINESS_REGISTRATION',
          originalName: 'gpkd_scan.png',
          contentType: 'image/png',
          sizeBytes: 250000,
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
            code: 'LEGAL_NAME_MATCH',
            result: 'WARN',
            documentType: 'BUSINESS_REGISTRATION',
            field: 'legalName',
            declaredValue: 'CÔNG TY TNHH VẬN TẢI SMART',
            extractedValue: 'CONG TY TNHH VAN TAI SMART',
            message: 'Tên pháp lý trích xuất thiếu dấu tiếng Việt',
          },
        ],
      },
      requestedItems: [],
      requirements: [{ type: 'BUSINESS_REGISTRATION', required: true, maxFiles: 3 }],
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

    await page.route('**/api/v1/admin/merchant-verifications?*', (route) =>
      route.fulfill({ json: { data: pendingSummary } }),
    )

    await page.route('**/api/v1/admin/merchant-verifications/101', (route) =>
      route.fulfill({ json: { data: detailDossier } }),
    )

    let taxLookupRequests = 0
    await page.route('**/api/v1/admin/merchant-verifications/101/submissions/1/tax-lookup', (route) => {
      taxLookupRequests += 1
      return route.abort()
    })

    await page.route('**/api/v1/admin/merchant-verifications/101/approve', (route) => {
      expect(route.request().method()).toBe('POST')
      const payload = route.request().postDataJSON()
      expect(payload.documentsReviewed).toBe(true)
      expect(payload.note).toBe('Đã kiểm tra đối chiếu con dấu tài liệu gốc.')
      return route.fulfill({
        json: {
          data: {
            ...detailDossier,
            status: 'VERIFIED',
          },
        },
      })
    })

    // Navigate to Admin Verifications
    await page.goto('/admin/merchant-verifications')
    await expect(page.getByText('Kiểm duyệt hồ sơ doanh nghiệp chủ bãi')).toBeVisible()
    await expect(page.getByText('CÔNG TY TNHH VẬN TẢI SMART')).toBeVisible()

    // Click "Thẩm định"
    await page.getByRole('link', { name: /Thẩm định/i }).click()

    // Detail page checks
    await expect(page.getByText(/Hồ sơ #101 · CÔNG TY TNHH VẬN TẢI SMART/i)).toBeVisible()
    await expect(page.getByText('Cần kiểm tra (WARN)')).toBeVisible()

    await expect(page.getByText('Đối chiếu mã 12 số trực tiếp trên giấy tờ.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Tra cứu mã số thuế' })).toHaveCount(0)

    // Click "Duyệt hồ sơ"
    await page.getByRole('button', { name: /Duyệt hồ sơ/i }).click()
    await expect(page.getByText('Phê duyệt hồ sơ doanh nghiệp chủ bãi')).toBeVisible()

    // Confirm documents reviewed checkbox
    await page.getByLabel(/Tôi xác nhận đã xem xét trực tiếp đầy đủ/i).check()

    // Fill note because WARN check exists
    await page.getByPlaceholder(/Nhập giải trình kiểm tra thủ công/i).fill('Đã kiểm tra đối chiếu con dấu tài liệu gốc.')

    // Submit approval
    await page.getByRole('button', { name: 'Phê duyệt hồ sơ' }).click()
    await expect(
      page.getByText('Đã phê duyệt hồ sơ doanh nghiệp chủ bãi thành công!'),
    ).toBeVisible()
    expect(taxLookupRequests).toBe(0)
  })

  test('Admin opens the selected PNG and confirms a legal-name correction', async ({ page }) => {
    await page.addInitScript((token) => localStorage.setItem('access_token', token), createToken('ROLE_ADMIN'))
    const pngId = '5ab4e7b7-0a35-4bae-a9c5-94a63819e1f1'
    const detail = {
      id: 101,
      merchantId: 10,
      status: 'PENDING_REVIEW',
      submissionVersion: 1,
      businessRegistrationNumber: '0101234567',
      legalName: 'CÔNG TY VẬN TẢI CŨ',
      documents: [
        { id: 'pdf', type: 'BUSINESS_REGISTRATION', originalName: 'first.pdf', contentType: 'application/pdf', sizeBytes: 250 },
        { id: pngId, type: 'BUSINESS_REGISTRATION', originalName: 'selected.png', contentType: 'image/png', sizeBytes: 120 },
      ],
      assessment: {
        status: 'COMPLETED',
        source: { documentId: pngId, originalName: 'selected.png', method: 'IMAGE_OCR', submissionVersion: 1 },
        checks: [{
          code: 'LEGAL_NAME_MATCH', result: 'WARN', field: 'legalName',
          declaredValue: 'CÔNG TY VẬN TẢI CŨ', extractedValue: 'CÔNG TY VẬN TẢI MỚI',
        }],
      },
      requestedItems: [], requirements: [], editableItems: [], history: [],
      updatedAt: '2026-11-18T10:00:00Z',
    }
    await page.route('**/api/v1/admin/merchant-verifications/101', (route) =>
      route.fulfill({ json: { data: detail } }),
    )
    await page.route('**/api/v1/admin/merchant-verifications/101/submissions/1/documents/*/content', (route) => {
      expect(route.request().url()).toContain('/documents/' + pngId + '/content')
      return route.fulfill({
        contentType: 'image/png',
        body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aK7sAAAAASUVORK5CYII=', 'base64'),
      })
    })
    await page.route('**/api/v1/admin/merchant-verifications/101/request-changes', (route) => {
      expect(route.request().postDataJSON()).toEqual({
        submissionVersion: 1,
        resetLegalName: true,
        items: [{ key: 'BUSINESS_INFO', reason: 'Vui lòng kiểm tra lại tên trên giấy đăng ký.' }],
      })
      return route.fulfill({ json: { data: { ...detail, status: 'CHANGES_REQUESTED' } } })
    })

    await page.goto('/admin/merchant-verifications/101')
    await expect(page.getByText('selected.png · OCR hình ảnh · v1')).toBeVisible()
    const previewRequest = page.waitForResponse((response) => response.url().endsWith('/documents/' + pngId + '/content'))
    await page.getByRole('button', { name: 'Mở tệp đã đối chiếu' }).click()
    await previewRequest
    const viewer = page.getByRole('dialog', { name: /selected\.png/ })
    await expect(viewer).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(viewer).toBeHidden()

    const mismatch = page.getByRole('row').filter({ hasText: 'Đối chiếu tên pháp lý doanh nghiệp' })
    await mismatch.getByRole('button', { name: 'Yêu cầu sửa tên pháp lý' }).click()
    const dialog = page.getByRole('dialog', { name: 'Yêu cầu sửa tên pháp lý' })
    await expect(dialog.getByRole('checkbox', { name: /Thông tin doanh nghiệp/ })).toBeChecked()
    await expect(dialog.getByRole('textbox')).toHaveValue(/CÔNG TY VẬN TẢI CŨ.*CÔNG TY VẬN TẢI MỚI/)
    await dialog.getByRole('textbox').fill('Vui lòng kiểm tra lại tên trên giấy đăng ký.')
    await dialog.getByRole('button', { name: 'Gửi yêu cầu bổ sung' }).click()
    await expect(dialog).toBeHidden()
  })

  test('AC3: Admin requests changes with reasons and handles 409 conflict', async ({ page }) => {
    const token = createToken('ROLE_ADMIN', 1)
    await page.addInitScript((val) => localStorage.setItem('access_token', val), token)

    const detailDossier = {
      id: 101,
      merchantId: 10,
      status: 'PENDING_REVIEW',
      draftRevision: 2,
      submissionVersion: 1,
      businessRegistrationNumber: '0101234567',
      legalName: 'CÔNG TY TNHH VẬN TẢI SMART',
      resubmissionNote: null,
      documents: [
        {
          id: '5ab4e7b7-0a35-4bae-a9c5-94a63819e1f1',
          type: 'BUSINESS_REGISTRATION',
          originalName: 'gpkd_scan.png',
          contentType: 'image/png',
          sizeBytes: 250000,
          uploadedAt: '2026-11-18T10:00:00Z',
        },
      ],
      assessment: {
        status: 'COMPLETED',
        checkedAt: '2026-11-18T10:05:00Z',
        checks: [],
      },
      requestedItems: [],
      requirements: [],
      editableItems: [],
      history: [],
      updatedAt: '2026-11-18T10:00:00Z',
    }

    await page.route('**/api/v1/admin/merchant-verifications/101', (route) =>
      route.fulfill({ json: { data: detailDossier } }),
    )

    await page.route('**/api/v1/admin/merchant-verifications/101/request-changes', (route) => {
      // Simulate 409 Conflict
      return route.fulfill({
        status: 409,
        json: { message: 'Phiên bản nộp không khớp với phiên bản đang chờ duyệt hiện tại!' },
      })
    })

    await page.route('**/api/v1/admin/merchant-verifications/101/submissions/1/tax-lookup', (route) =>
      route.fulfill({ json: { data: {
        dossierId: 101, submissionVersion: 1, checkedAt: '2026-11-18T10:06:00Z', retryAt: null,
        outcome: 'UNAVAILABLE', business: null,
      } } }),
    )

    await page.goto('/admin/merchant-verifications/101')
    await page.getByRole('button', { name: 'Tra cứu mã số thuế' }).click()
    await page.getByRole('button', { name: 'Xác nhận và tra cứu' }).click()
    await expect(page.getByText(/Chưa tra cứu được/)).toBeVisible()
    await page.getByRole('button', { name: /Yêu cầu bổ sung/i }).click()

    await expect(page.getByText('Yêu cầu bổ sung / chỉnh sửa hồ sơ')).toBeVisible()
    await page
      .getByPlaceholder(/Mô tả rõ lý do cần bổ sung/i)
      .fill('Ảnh mờ không đọc được mã số thuế.')
    await page.getByRole('button', { name: /Gửi yêu cầu bổ sung/i }).click()

    // 409 notice is displayed
    await expect(
      page.getByText(/Dữ liệu mới nhất đã được tải lại/i),
    ).toBeVisible()
  })
})
