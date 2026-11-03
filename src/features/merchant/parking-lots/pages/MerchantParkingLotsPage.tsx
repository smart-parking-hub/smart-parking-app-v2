import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, RefreshCw, PlusCircle, CheckCircle2, X } from 'lucide-react'
import {
  fetchMerchantLotsMetrics,
  fetchMerchantParkingLots,
  fallbackMerchantLotsMetrics,
} from '../api/merchantParkingLotApi'
import type {
  MerchantLotsMetrics,
  MerchantParkingLotPageResponse,
} from '../types/merchantParkingLotTypes'
import { MerchantParkingLotsHeader } from '../components/MerchantParkingLotsHeader'
import { MerchantParkingLotsMetrics } from '../components/MerchantParkingLotsMetrics'
import {
  MerchantParkingLotsFilterBar,
  type ViewMode,
} from '../components/MerchantParkingLotsFilterBar'
import { MerchantParkingLotCardItem } from '../components/MerchantParkingLotCardItem'
import { MerchantParkingLotsTableView } from '../components/MerchantParkingLotsTableView'
import { MerchantParkingLotsPagination } from '../components/MerchantParkingLotsPagination'
import { MerchantParkingLotsSkeleton } from '../components/MerchantParkingLotsSkeleton'
import { ExportReportModal } from '../components/ExportReportModal'

export function MerchantParkingLotsPage() {
  const navigate = useNavigate()

  // State Management
  const [metrics, setMetrics] = useState<MerchantLotsMetrics>(fallbackMerchantLotsMetrics)
  const [data, setData] = useState<MerchantParkingLotPageResponse>({
    content: [],
    currentPage: 0,
    totalPages: 1,
    totalElements: 0,
  })

  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [status, setStatus] = useState<string>('ALL')
  const [keyword, setKeyword] = useState<string>('')
  const [sort, setSort] = useState<string>('createdAt,desc')
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('merchant_lots_view_mode') as ViewMode) || 'grid'
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Persist View Mode
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem('merchant_lots_view_mode', mode)
  }

  // Load Data
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(undefined)

    try {
      const [metricsRes, lotsRes] = await Promise.all([
        fetchMerchantLotsMetrics(),
        fetchMerchantParkingLots({
          page,
          size,
          status,
          keyword,
          sort,
        }),
      ])

      setMetrics(metricsRes)
      setData(lotsRes)
    } catch {
      setError('Không thể kết nối đến máy chủ kiểm định bến bãi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [keyword, page, size, sort, status])

  useEffect(() => {
    void loadData()
  }, [loadData])

  // Support Toast Trigger
  const handleContactSupport = (lotCode: string) => {
    setToastMessage(
      `Đã gửi yêu cầu ưu tiên thẩm định cho hồ sơ bãi ${lotCode}. Đường dây nóng phòng Nghiệp vụ: 1900 6868 (Nhánh 2).`,
    )
    setTimeout(() => {
      setToastMessage(null)
    }, 6000)
  }

  return (
    <main className="w-full bg-[#f8f9ff] min-h-screen pb-16">
      {/* 1. Industrial Blueprint Banner / Header */}
      <MerchantParkingLotsHeader onOpenExportModal={() => setExportModalOpen(true)} />

      {/* 2. Metric Summary Strip (3 Bento KPI Cards) */}
      <MerchantParkingLotsMetrics metrics={metrics} />

      {/* Error Alert if any */}
      {error && (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span className="text-xs sm:text-sm font-medium">{error}</span>
            </div>
            <button
              type="button"
              onClick={() => void loadData()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 text-xs font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Workbench Filter & Control Panel */}
      <MerchantParkingLotsFilterBar
        keyword={keyword}
        onKeywordChange={(val) => {
          setPage(0)
          setKeyword(val)
        }}
        status={status}
        onStatusChange={(val) => {
          setPage(0)
          setStatus(val)
        }}
        sort={sort}
        onSortChange={(val) => {
          setPage(0)
          setSort(val)
        }}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        totalResults={data.totalElements}
      />

      {/* 4. Master Parking Lots Directory */}
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (
          <MerchantParkingLotsSkeleton />
        ) : data.content.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-2xs flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <PlusCircle className="w-7 h-7" />
            </div>
            <h3 className="font-sora text-base font-bold text-[#0d1c2e]">
              {keyword || status !== 'ALL'
                ? 'Không tìm thấy bãi đỗ nào phù hợp bộ lọc'
                : 'Bạn chưa đăng ký bãi đỗ xe nào'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md">
              {keyword || status !== 'ALL'
                ? 'Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc bấm Đặt lại để xem tất cả các bãi.'
                : 'Đăng ký bãi đỗ mới để bắt đầu tiếp nhận xe container, xe tải nặng và kết nối cổng ALPR tự động.'}
            </p>

            <div className="mt-6 flex items-center gap-3">
              {keyword || status !== 'ALL' ? (
                <button
                  type="button"
                  onClick={() => {
                    setKeyword('')
                    setStatus('ALL')
                    setPage(0)
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Xóa Bộ Lọc
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => navigate('/merchant/parking-lots/new')}
                className="px-5 py-2.5 bg-[#d95f00] hover:bg-[#b84e00] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                + Đăng Ký Bãi Đỗ Mới
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Card / Grid View */
          <section className="flex flex-col gap-5 sm:gap-6" aria-label="Danh sách bãi đỗ dạng lưới">
            {data.content.map((lot) => (
              <MerchantParkingLotCardItem
                key={lot.id}
                lot={lot}
                onContactSupport={handleContactSupport}
              />
            ))}
          </section>
        ) : (
          /* Table View */
          <section aria-label="Danh sách bãi đỗ dạng bảng">
            <MerchantParkingLotsTableView lots={data.content} />
          </section>
        )}

        {/* 5. Pagination & Regulatory Compliance Callout */}
        {!loading && data.content.length > 0 && (
          <MerchantParkingLotsPagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            pageSize={size}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      {/* Floating Support Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md bg-[#131b2e] text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed">{toastMessage}</div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
            aria-label="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        totalLots={data.totalElements}
      />
    </main>
  )
}
