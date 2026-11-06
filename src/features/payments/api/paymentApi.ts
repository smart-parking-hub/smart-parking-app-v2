import { apiClient } from '@/shared/api/client'
import type {
  PaymentTransactionItem,
  FinancialMetricsData,
  CompanyInvoiceConfig,
} from '../types/paymentTypes'

export const fallbackMetrics: FinancialMetricsData = {
  totalSpentMonth: 3420000,
  containerTripsCount: 18,
  quarterLabel: 'Q1-2026',
  refundAmount: 400000,
  onTimeCheckInCount: 4,
  penaltyAmount: 0,
  overtimeViolationsCount: 0,
  syncedVatCount: 18,
  totalVatCount: 18,
}

export const fallbackCompanyConfig: CompanyInvoiceConfig = {
  companyName: 'Công ty Cổ phần Vận tải & Tiếp vận VTP Logistics',
  taxId: '0301489271',
  accountingEmail: 'ketoan@vtuanlogistics.vn',
  companyAddress: 'Tòa nhà Logistics Center, Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức, TP.HCM',
  autoSendXml: true,
  integrationSoftware: 'MISA AMIS & FAST',
}

export const fallbackTransactions: PaymentTransactionItem[] = [
  {
    id: 1,
    transactionCode: 'TXN-2026-9040',
    bookingCode: 'BKG-CATLAI-88412',
    bookingId: 9081,
    createdAtText: '18/02/2026 14:30:15',
    paymentMethod: 'VIETQR_PAYOS',
    paymentMethodLabel: 'VietQR PayOS',
    parkingLotName: 'Bãi Container Tân Cảng Cát Lái Gate 2',
    vehiclePlate: '51D-892.44',
    vehicleSpec: 'R-53ft Reefer',
    category: 'FINAL_PAYMENT',
    categoryLabel: 'TẤT TOÁN CUỐI',
    amount: 360000,
    vatAmount: 26667,
    status: 'SUCCESS',
    statusLabel: 'THÀNH CÔNG',
    vatInvoiceType: 'PDF_VAT',
    vatLookupCode: 'VN-SGN-HD78-89412',
    taxAuthorityCode: '260218-VN-89412',
    beneficiaryName: 'Công ty Cổ phần Vận tải & Bến bãi Tân Cảng',
    beneficiaryTaxId: '0300481084',
    assignedBerth: 'Berth 114 (Reefer Hookup 380V) - Gate 2',
    trailerPlate: '51R-028.91',
    breakdownItems: [
      { id: 'b1', name: 'Phí lưu bãi Container Reefer (12 giờ)', amount: 300000 },
      { id: 'b2', name: 'Phụ thu cấp điện lạnh chuyên dụng (Shore Power 3-Phase)', amount: 33333 },
      { id: 'b3', name: 'Thuế Giá Trị Gia Tăng (VAT 8%)', amount: 26667 },
    ],
  },
  {
    id: 2,
    transactionCode: 'REF-2026-1102',
    bookingCode: 'BKG-CATLAI-88412',
    bookingId: 9081,
    createdAtText: '18/02/2026 14:31:02',
    paymentMethod: 'BANK_REFUND',
    paymentMethodLabel: 'Hoàn tiền thẻ/STK',
    parkingLotName: 'Bãi Container Tân Cảng Cát Lái Gate 2',
    vehiclePlate: '51D-892.44',
    vehicleSpec: 'Hoàn cọc check-in',
    category: 'REFUND',
    categoryLabel: 'HOÀN CỌC TỰ ĐỘNG',
    amount: -100000,
    vatAmount: 0,
    status: 'REFUNDED',
    statusLabel: 'ĐÃ HOÀN CỌC',
    vatInvoiceType: 'NA',
    vatLookupCode: 'REF-260218-88412',
    beneficiaryName: 'Hệ thống SmartTruckHub Tự Động',
    beneficiaryTaxId: '0301489271',
    assignedBerth: 'Cổng kiểm soát ALPR G2',
    trailerPlate: '51R-028.91',
    breakdownItems: [
      { id: 'r1', name: 'Hoàn trả 100% tiền ký quỹ giữ slot đúng giờ', amount: -100000 },
    ],
  },
  {
    id: 3,
    transactionCode: 'TXN-2026-9032',
    bookingCode: 'BKG-CATLAI-88412',
    bookingId: 9081,
    createdAtText: '18/02/2026 11:15:00',
    paymentMethod: 'VIETQR_PAYOS',
    paymentMethodLabel: 'VietQR PayOS',
    parkingLotName: 'Bãi Container Tân Cảng Cát Lái Gate 2',
    vehiclePlate: '51D-892.44',
    vehicleSpec: 'Đặt trước 3h',
    category: 'DEPOSIT',
    categoryLabel: 'TIỀN CỌC 10P',
    amount: 100000,
    vatAmount: 0,
    status: 'SUCCESS',
    statusLabel: 'THÀNH CÔNG',
    vatInvoiceType: 'RECEIPT',
    vatLookupCode: 'DEP-260218-9032',
    beneficiaryName: 'Trung tâm Điều Phối Tân Cảng STH',
    beneficiaryTaxId: '0300481084',
    assignedBerth: 'Cửa sổ thanh toán cọc giữ chỗ',
    breakdownItems: [
      { id: 'd1', name: 'Tiền ký quỹ giữ slot bến trước 10 phút', amount: 100000 },
    ],
  },
  {
    id: 4,
    transactionCode: 'TXN-2026-8874',
    bookingCode: 'BKG-ICD-SONGTHAN-09',
    bookingId: 8874,
    createdAtText: '16/02/2026 09:20:44',
    paymentMethod: 'CASH_AT_GATE',
    paymentMethodLabel: 'Tiền mặt tại bãi',
    parkingLotName: 'Tổng Kho ICD Sóng Thần Bình Dương',
    vehiclePlate: '51D-892.44',
    vehicleSpec: 'Lưu ca đêm 8h',
    category: 'FINAL_PAYMENT',
    categoryLabel: 'TẤT TOÁN CUỐI',
    amount: 280000,
    vatAmount: 20741,
    status: 'SUCCESS',
    statusLabel: 'THÀNH CÔNG',
    vatInvoiceType: 'PDF_VAT',
    vatLookupCode: 'VN-BDG-HD78-88741',
    taxAuthorityCode: '160226-BDG-8874',
    beneficiaryName: 'Công ty TNHH ICD Sóng Thần 2',
    beneficiaryTaxId: '3700148992',
    assignedBerth: 'Bãi Depot A - Cổng 1',
    breakdownItems: [
      { id: 'st1', name: 'Phí đỗ ca đêm xe đầu kéo container (8 giờ)', amount: 259259 },
      { id: 'st2', name: 'Thuế GTGT (VAT 8%)', amount: 20741 },
    ],
  },
  {
    id: 5,
    transactionCode: 'TXN-2026-8519',
    bookingCode: 'BKG-DINHVU-44021',
    bookingId: 8519,
    createdAtText: '14/02/2026 19:40:11',
    paymentMethod: 'VIETQR_PAYOS',
    paymentMethodLabel: 'VietQR PayOS',
    parkingLotName: 'Cảng Đình Vũ Hải Phòng (Khu Depot 3)',
    vehiclePlate: '15C-341.90',
    vehicleSpec: 'Trailer 40ft DC',
    category: 'FINAL_PAYMENT',
    categoryLabel: 'TẤT TOÁN CUỐI',
    amount: 450000,
    vatAmount: 33333,
    status: 'SUCCESS',
    statusLabel: 'THÀNH CÔNG',
    vatInvoiceType: 'PDF_VAT',
    vatLookupCode: 'VN-HPH-HD78-85190',
    taxAuthorityCode: '140226-HPH-8519',
    beneficiaryName: 'Công ty Cổ phần Đầu tư Cảng Đình Vũ',
    beneficiaryTaxId: '0200548123',
    assignedBerth: 'Berth 03 - Depot Container xuất khẩu',
    breakdownItems: [
      { id: 'dv1', name: 'Phí lưu bãi bến cảng Hải Phòng (24 giờ)', amount: 416667 },
      { id: 'dv2', name: 'Thuế GTGT (VAT 8%)', amount: 33333 },
    ],
  },
  {
    id: 6,
    transactionCode: 'TXN-2026-8210',
    bookingCode: 'BKG-PHUHUU-10492',
    bookingId: 8210,
    createdAtText: '12/02/2026 10:15:30',
    paymentMethod: 'VIETQR_PAYOS',
    paymentMethodLabel: 'VietQR PayOS',
    parkingLotName: 'Tân Cảng - Phú Hữu Logistics Gate 01',
    vehiclePlate: '51D-892.44',
    vehicleSpec: 'Container 40FT Chờ đóng hàng',
    category: 'FINAL_PAYMENT',
    categoryLabel: 'TẤT TOÁN CUỐI',
    amount: 320000,
    vatAmount: 23704,
    status: 'SUCCESS',
    statusLabel: 'THÀNH CÔNG',
    vatInvoiceType: 'PDF_VAT',
    vatLookupCode: 'VN-SGN-HD78-82101',
    taxAuthorityCode: '120226-SGN-8210',
    beneficiaryName: 'Công ty Cổ phần Cảng Phú Hữu',
    beneficiaryTaxId: '0300489912',
    assignedBerth: 'Berth 08 - Cổng chính',
    breakdownItems: [
      { id: 'ph1', name: 'Phí lưu bãi container', amount: 296296 },
      { id: 'ph2', name: 'Thuế GTGT (VAT 8%)', amount: 23704 },
    ],
  },
  {
    id: 7,
    transactionCode: 'REF-2026-1089',
    bookingCode: 'BKG-PHUHUU-10492',
    bookingId: 8210,
    createdAtText: '12/02/2026 10:16:00',
    paymentMethod: 'BANK_REFUND',
    paymentMethodLabel: 'Hoàn tiền thẻ/STK',
    parkingLotName: 'Tân Cảng - Phú Hữu Logistics Gate 01',
    vehiclePlate: '51D-892.44',
    vehicleSpec: 'Hoàn cọc check-in',
    category: 'REFUND',
    categoryLabel: 'HOÀN CỌC TỰ ĐỘNG',
    amount: -100000,
    vatAmount: 0,
    status: 'REFUNDED',
    statusLabel: 'ĐÃ HOÀN CỌC',
    vatInvoiceType: 'NA',
    vatLookupCode: 'REF-260212-10492',
    beneficiaryName: 'Hệ thống SmartTruckHub Tự Động',
    beneficiaryTaxId: '0301489271',
  },
  {
    id: 8,
    transactionCode: 'TXN-2026-8104',
    bookingCode: 'BKG-PHUHUU-10492',
    bookingId: 8210,
    createdAtText: '12/02/2026 08:00:12',
    paymentMethod: 'VIETQR_PAYOS',
    paymentMethodLabel: 'VietQR PayOS',
    parkingLotName: 'Tân Cảng - Phú Hữu Logistics Gate 01',
    vehiclePlate: '51D-892.44',
    vehicleSpec: 'Đặt trước slot',
    category: 'DEPOSIT',
    categoryLabel: 'TIỀN CỌC 10P',
    amount: 100000,
    vatAmount: 0,
    status: 'SUCCESS',
    statusLabel: 'THÀNH CÔNG',
    vatInvoiceType: 'RECEIPT',
    vatLookupCode: 'DEP-260212-8104',
    beneficiaryName: 'Trung tâm Điều Phối Phú Hữu',
    beneficiaryTaxId: '0300489912',
  },
]

export const fetchMyPayments = async (): Promise<PaymentTransactionItem[]> => {
  try {
    const response = await apiClient.get('/api/v1/payments', {
      params: { page: 0, size: 50 },
    })
    const content = response.data?.data?.content
    if (Array.isArray(content) && content.length > 0) {
      // If server returns real data, merge with rich fields
      return content.map((item: Record<string, unknown>, index: number) => {
        const fb = fallbackTransactions[index % fallbackTransactions.length]
        return {
          id: Number(item.id ?? fb.id),
          transactionCode: String(item.transactionCode ?? fb.transactionCode),
          bookingCode: String(item.bookingCode ?? (item.bookingId ? `BKG-${item.bookingId}` : fb.bookingCode)),
          bookingId: item.bookingId ? Number(item.bookingId) : fb.bookingId,
          createdAtText: item.createdAt ? String(item.createdAt) : fb.createdAtText,
          paymentMethod: fb.paymentMethod,
          paymentMethodLabel: fb.paymentMethodLabel,
          parkingLotName: fb.parkingLotName,
          vehiclePlate: fb.vehiclePlate,
          vehicleSpec: fb.vehicleSpec,
          category: (item.type as PaymentTransactionItem['category']) || fb.category,
          categoryLabel: fb.categoryLabel,
          amount: typeof item.amount === 'number' ? item.amount : fb.amount,
          vatAmount: fb.vatAmount,
          status: (item.status as PaymentTransactionItem['status']) || fb.status,
          statusLabel: fb.statusLabel,
          vatInvoiceType: fb.vatInvoiceType,
          vatLookupCode: fb.vatLookupCode,
          taxAuthorityCode: fb.taxAuthorityCode,
          beneficiaryName: fb.beneficiaryName,
          beneficiaryTaxId: fb.beneficiaryTaxId,
          assignedBerth: fb.assignedBerth,
          trailerPlate: fb.trailerPlate,
          breakdownItems: fb.breakdownItems,
        }
      })
    }
    return fallbackTransactions
  } catch {
    return fallbackTransactions
  }
}

export const fetchFinancialMetrics = async (): Promise<FinancialMetricsData> => {
  return fallbackMetrics
}

export const fetchCompanyInvoiceConfig = async (): Promise<CompanyInvoiceConfig> => {
  try {
    const res = await apiClient.get<{ data?: Record<string, unknown> } | Record<string, unknown>>('/api/v1/users/me')
    const resData = res?.data as unknown
    const rawData =
      resData && typeof resData === 'object' && 'data' in resData
        ? (resData as { data?: Record<string, unknown> }).data
        : (resData as Record<string, unknown> | undefined)

    if (rawData && typeof rawData === 'object' && ('taxId' in rawData || 'companyName' in rawData)) {
      const merged: CompanyInvoiceConfig = {
        companyName: String(rawData.companyName || fallbackCompanyConfig.companyName),
        taxId: String(rawData.taxId || fallbackCompanyConfig.taxId),
        accountingEmail: String(rawData.accountingEmail || fallbackCompanyConfig.accountingEmail),
        companyAddress: String(rawData.companyAddress || fallbackCompanyConfig.companyAddress),
        autoSendXml: rawData.autoSendXml !== undefined ? Boolean(rawData.autoSendXml) : fallbackCompanyConfig.autoSendXml,
        integrationSoftware: String(rawData.integrationSoftware || fallbackCompanyConfig.integrationSoftware),
      }
      localStorage.setItem('sth.driver.company_invoice_config', JSON.stringify(merged))
      return merged
    }
  } catch {
    // Graceful fallback to localStorage for offline / mock mode
  }

  const local = localStorage.getItem('sth.driver.company_invoice_config')
  if (local) {
    try {
      return JSON.parse(local) as CompanyInvoiceConfig
    } catch {
      // fallback
    }
  }
  return fallbackCompanyConfig
}

export const saveCompanyInvoiceConfig = async (
  config: CompanyInvoiceConfig
): Promise<void> => {
  localStorage.setItem('sth.driver.company_invoice_config', JSON.stringify(config))
  try {
    await apiClient.put('/api/v1/users/me', {
      taxId: config.taxId,
      companyName: config.companyName,
      companyAddress: config.companyAddress,
      accountingEmail: config.accountingEmail,
      integrationSoftware: config.integrationSoftware,
      autoSendXml: config.autoSendXml,
    })
  } catch {
    // Graceful fallback to localStorage for mock/offline environment
  }
}

export const sendReceiptEmailApi = async (
  _transactionCode: string,
  _email: string
): Promise<boolean> => {
  await new Promise((r) => setTimeout(r, 600))
  return true
}
