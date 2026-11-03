export type PaymentCategoryFilter =
  | 'ALL'
  | 'DEPOSIT'
  | 'FINAL_PAYMENT'
  | 'REFUND'
  | 'PENALTY'

export type PaymentStatusFilter = 'ALL' | 'SUCCESS' | 'REFUNDED' | 'PENDING' | 'FAILED'

export interface CostBreakdownItem {
  id: string
  name: string
  amount: number
}

export interface PaymentTransactionItem {
  id: number
  transactionCode: string
  bookingCode: string
  bookingId?: number
  createdAtText: string
  paymentMethod: 'VIETQR_PAYOS' | 'CASH_AT_GATE' | 'BANK_REFUND'
  paymentMethodLabel: string
  parkingLotName: string
  vehiclePlate: string
  vehicleSpec: string
  category: 'DEPOSIT' | 'FINAL_PAYMENT' | 'REFUND' | 'PENALTY'
  categoryLabel: string
  amount: number
  vatAmount: number
  status: 'SUCCESS' | 'REFUNDED' | 'PENDING' | 'FAILED'
  statusLabel: string
  vatInvoiceType: 'PDF_VAT' | 'RECEIPT' | 'NA'
  vatLookupCode?: string
  taxAuthorityCode?: string
  beneficiaryName?: string
  beneficiaryTaxId?: string
  assignedBerth?: string
  trailerPlate?: string
  breakdownItems?: CostBreakdownItem[]
}

export interface FinancialMetricsData {
  totalSpentMonth: number
  containerTripsCount: number
  quarterLabel: string
  refundAmount: number
  onTimeCheckInCount: number
  penaltyAmount: number
  overtimeViolationsCount: number
  syncedVatCount: number
  totalVatCount: number
}

export interface CompanyInvoiceConfig {
  companyName: string
  taxId: string
  accountingEmail: string
  companyAddress: string
  autoSendXml: boolean
  integrationSoftware: string
}
