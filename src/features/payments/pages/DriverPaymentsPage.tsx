import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type {
  PaymentCategoryFilter,
  PaymentStatusFilter,
  PaymentTransactionItem,
  CompanyInvoiceConfig,
} from '../types/paymentTypes'
import {
  fetchMyPayments,
  fetchFinancialMetrics,
  fetchCompanyInvoiceConfig,
  saveCompanyInvoiceConfig,
  fallbackTransactions,
  fallbackMetrics,
  fallbackCompanyConfig,
} from '../api/paymentApi'
import { PaymentsCommandHeader } from '../components/PaymentsCommandHeader'
import { FinancialMetricsBento } from '../components/FinancialMetricsBento'
import { TransactionFilterToolbar } from '../components/TransactionFilterToolbar'
import { MasterTransactionTable } from '../components/MasterTransactionTable'
import { ReceiptInspectorPanel } from '../components/ReceiptInspectorPanel'
import { EnterpriseAccountingPanel } from '../components/EnterpriseAccountingPanel'
import { CompanyInvoiceConfigModal } from '../components/CompanyInvoiceConfigModal'
import { ExportReportModal } from '../components/ExportReportModal'
import { SendReceiptEmailModal } from '../components/SendReceiptEmailModal'
import { PaymentsSkeleton } from '../components/PaymentsSkeleton'

export function DriverPaymentsPage() {
  // Query data
  const {
    data: transactions = fallbackTransactions,
    isLoading: isLoadingPayments,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: ['my-driver-payments'],
    queryFn: fetchMyPayments,
    initialData: fallbackTransactions,
    staleTime: 30000,
  })

  const { data: metrics = fallbackMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['driver-payment-metrics'],
    queryFn: fetchFinancialMetrics,
    initialData: fallbackMetrics,
    staleTime: 60000,
  })

  const { data: serverConfig = fallbackCompanyConfig } = useQuery({
    queryKey: ['company-invoice-config'],
    queryFn: fetchCompanyInvoiceConfig,
    initialData: fallbackCompanyConfig,
    staleTime: 120000,
  })

  // State
  const [companyConfig, setCompanyConfig] = useState<CompanyInvoiceConfig>(serverConfig)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<PaymentCategoryFilter>('ALL')
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('ALL')
  const [selectedItem, setSelectedItem] = useState<PaymentTransactionItem>(
    () => transactions[0] || fallbackTransactions[0]
  )

  // Modals state
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false)
  const [emailTargetItem, setEmailTargetItem] = useState<PaymentTransactionItem | null>(null)

  // Filtering transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      // Category match
      const matchCategory =
        categoryFilter === 'ALL' || item.category === categoryFilter

      // Status match
      const matchStatus =
        statusFilter === 'ALL' || item.status === statusFilter

      // Search match
      const q = search.trim().toLowerCase()
      const matchSearch =
        !q ||
        item.transactionCode.toLowerCase().includes(q) ||
        item.bookingCode.toLowerCase().includes(q) ||
        item.parkingLotName.toLowerCase().includes(q) ||
        item.vehiclePlate.toLowerCase().includes(q)

      return matchCategory && matchStatus && matchSearch
    })
  }, [transactions, categoryFilter, statusFilter, search])

  // Count tags
  const counts = useMemo(() => {
    let deposit = 0
    let finalPayment = 0
    let refund = 0
    let penalty = 0
    let paid = 0
    let refunded = 0

    transactions.forEach((t) => {
      if (t.category === 'DEPOSIT') deposit++
      if (t.category === 'FINAL_PAYMENT') finalPayment++
      if (t.category === 'REFUND') refund++
      if (t.category === 'PENALTY') penalty++
      if (t.status === 'SUCCESS') paid++
      if (t.status === 'REFUNDED') refunded++
    })

    return {
      all: transactions.length,
      deposit,
      finalPayment,
      refund,
      penalty,
      paid,
      refunded,
    }
  }, [transactions])

  // Handlers
  const handleSaveConfig = async (newConfig: CompanyInvoiceConfig) => {
    setCompanyConfig(newConfig)
    await saveCompanyInvoiceConfig(newConfig)
  }

  const handleDownloadPdf = (item: PaymentTransactionItem) => {
    // Generate synthetic file download for audit preview
    const content = `BIEN LAI DIEN TU TT78\nMa GD: ${item.transactionCode}\nBooking: ${item.bookingCode}\nBai xe: ${item.parkingLotName}\nBien so: ${item.vehiclePlate}\nSo tien: ${item.amount} VND\nMa CQT: ${item.taxAuthorityCode ?? 'TT78-STH-2026'}`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `BienLai_${item.transactionCode}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleOpenSendEmail = (item: PaymentTransactionItem) => {
    setEmailTargetItem(item)
    setIsSendEmailModalOpen(true)
  }

  if (isLoadingPayments && isLoadingMetrics) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-8 font-inter">
        <PaymentsSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-8 font-inter">
      {/* 1. Header & Scrim Ticker */}
      <PaymentsCommandHeader
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        companyTaxId={companyConfig.taxId}
      />

      {/* 2. 4 Bento Financial Metrics */}
      <FinancialMetricsBento metrics={metrics} />

      {/* 3. Advanced Toolbar / Search & Filter Matrix */}
      <TransactionFilterToolbar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        counts={counts}
      />

      {/* 4. Master Transaction Table */}
      <MasterTransactionTable
        items={filteredTransactions}
        selectedId={selectedItem?.id ?? null}
        onSelect={(item) => setSelectedItem(item)}
        onRefresh={() => void refetchPayments()}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* 5. Split Informative Panels: Detail Receipt Inspector & Enterprise Accounting */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Detailed Receipt Inspector */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <ReceiptInspectorPanel
              item={selectedItem}
              onDownloadPdf={handleDownloadPdf}
              onOpenSendEmail={handleOpenSendEmail}
            />
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
              Chọn một giao dịch trong bảng phía trên để xem chi tiết biên lai.
            </div>
          )}
        </div>

        {/* Right 5 cols: Enterprise VAT Direct Dispatch & Deposit Guarantee */}
        <div className="lg:col-span-5">
          <EnterpriseAccountingPanel
            config={companyConfig}
            onEditConfig={() => setIsConfigModalOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <CompanyInvoiceConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        initialConfig={companyConfig}
        onSave={handleSaveConfig}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        totalRecords={filteredTransactions.length}
        totalAmountText={`${new Intl.NumberFormat('vi-VN').format(metrics.totalSpentMonth)} ₫`}
      />

      <SendReceiptEmailModal
        isOpen={isSendEmailModalOpen}
        onClose={() => setIsSendEmailModalOpen(false)}
        item={emailTargetItem}
        defaultEmail={companyConfig.accountingEmail}
      />
    </div>
  )
}
