import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchAdminMerchantVerifications } from '../api/adminMerchantVerificationApi'
import type { AdminVerificationFilter } from '../types/adminMerchantVerificationTypes'
import type { VerificationStatus, AssessmentStatus } from '@/features/merchant/profile'
import { Pagination } from '@/shared/components/Pagination'
import { Button } from '@/shared/components/Button'
import { errorMessage } from '@/shared/api/resources'
import {
  ShieldCheck,
  RotateCw,
  Eye,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react'

export const adminVerificationsQueryKey = (filter: AdminVerificationFilter) =>
  ['admin-merchant-verifications', filter] as const

const STATUS_TABS: Array<{ label: string; value: VerificationStatus | undefined }> = [
  { label: 'Chờ duyệt', value: 'PENDING_REVIEW' },
  { label: 'Yêu cầu bổ sung', value: 'CHANGES_REQUESTED' },
  { label: 'Đã xác minh', value: 'VERIFIED' },
  { label: 'Tất cả', value: undefined },
]

function renderAssessmentBadge(status: AssessmentStatus) {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Hoàn tất
        </span>
      )
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 animate-pulse">
          <Clock className="h-3 w-3 text-amber-600" /> Đang kiểm tra
        </span>
      )
    case 'UNAVAILABLE':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
          <AlertCircle className="h-3 w-3 text-rose-600" /> Không khả dụng
        </span>
      )
    case 'NOT_STARTED':
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          Chưa chạy
        </span>
      )
  }
}

export function AdminMerchantVerificationsPage() {
  const [status, setStatus] = useState<VerificationStatus | undefined>('PENDING_REVIEW')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filter: AdminVerificationFilter = { page, size: pageSize, status }

  const query = useQuery({
    queryKey: adminVerificationsQueryKey(filter),
    queryFn: () => fetchAdminMerchantVerifications(filter),
    staleTime: 15_000,
    retry: false,
  })

  const { data, isLoading, isError, error, refetch, isFetching } = query

  const handleTabChange = (newStatus: VerificationStatus | undefined) => {
    setStatus(newStatus)
    setPage(1)
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <ShieldCheck className="h-7 w-7 text-[#d95f00]" />
            Kiểm duyệt hồ sơ doanh nghiệp chủ bãi
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Thẩm định hồ sơ định danh pháp lý, đối chiếu OCR tự động và phê duyệt quyền hoạt động doanh nghiệp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
            leftIcon={<RotateCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />}
          >
            Làm mới
          </Button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {STATUS_TABS.map((tab) => {
          const isActive = status === tab.value
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => handleTabChange(tab.value)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-6 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
          <p className="text-sm font-semibold text-rose-900">{errorMessage(error)}</p>
          <Button type="button" variant="secondary" size="sm" onClick={() => void refetch()}>
            Thử lại
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-10 bg-slate-200 rounded-xl" />
          <div className="h-64 bg-slate-100 rounded-xl" />
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !isError && data && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto p-2 sm:p-0">
            <table className="block md:table w-full text-left text-sm border-collapse">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs uppercase font-semibold text-slate-600">
                  <th className="py-3 px-4">Mã hồ sơ</th>
                  <th className="py-3 px-4">Mã chủ bãi</th>
                  <th className="py-3 px-4">Tên pháp lý công ty</th>
                  <th className="py-3 px-4">Mã số thuế / GPKD</th>
                  <th className="py-3 px-4">Bản nộp</th>
                  <th className="py-3 px-4">Đánh giá OCR</th>
                  <th className="py-3 px-4">Thời điểm nộp</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group divide-y divide-slate-100">
                {data.content.length > 0 ? (
                  data.content.map((item) => (
                    <tr
                      key={item.id}
                      className="block md:table-row rounded-xl border border-slate-200 md:border-0 p-4 md:p-0 mb-3 md:mb-0 bg-white shadow-2xs md:shadow-none hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="flex items-center justify-between md:table-cell py-1.5 md:py-3.5 px-0 md:px-4 font-mono font-semibold text-slate-900">
                        <span className="md:hidden text-xs text-slate-400 font-sans">Hồ sơ:</span>
                        <span>#{item.id}</span>
                      </td>
                      <td className="flex items-center justify-between md:table-cell py-1 md:py-3.5 px-0 md:px-4 text-slate-700 font-mono text-xs md:text-sm">
                        <span className="md:hidden text-xs text-slate-400 font-sans">Chủ bãi:</span>
                        <span>Merchant #{item.merchantId}</span>
                      </td>
                      <td className="block md:table-cell py-1.5 md:py-3.5 px-0 md:px-4 font-medium text-slate-900 max-w-xs truncate">
                        <span className="md:hidden text-xs text-slate-400 block font-normal font-sans">Tên công ty:</span>
                        <span>{item.legalName || '—'}</span>
                      </td>
                      <td className="flex items-center justify-between md:table-cell py-1 md:py-3.5 px-0 md:px-4 font-mono text-slate-800 text-xs md:text-sm">
                        <span className="md:hidden text-xs text-slate-400 font-sans">MST/GPKD:</span>
                        <span>{item.businessRegistrationNumber || '—'}</span>
                      </td>
                      <td className="flex items-center justify-between md:table-cell py-1 md:py-3.5 px-0 md:px-4 text-slate-700 font-medium text-xs md:text-sm">
                        <span className="md:hidden text-xs text-slate-400 font-sans">Bản nộp:</span>
                        <span>v{item.submissionVersion}</span>
                      </td>
                      <td className="flex items-center justify-between md:table-cell py-1.5 md:py-3.5 px-0 md:px-4">
                        <span className="md:hidden text-xs text-slate-400 font-sans">OCR:</span>
                        {renderAssessmentBadge(item.assessmentStatus)}
                      </td>
                      <td className="flex items-center justify-between md:table-cell py-1 md:py-3.5 px-0 md:px-4 text-xs text-slate-500 tabular-nums">
                        <span className="md:hidden text-xs text-slate-400 font-sans">Thời điểm:</span>
                        <span>
                          {item.submittedAt
                            ? new Date(item.submittedAt).toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—'}
                        </span>
                      </td>
                      <td className="block md:table-cell py-2 md:py-3.5 px-0 md:px-4 text-right pt-3 md:pt-3.5 border-t border-slate-100 md:border-t-0">
                        <Link
                          to={`/admin/merchant-verifications/${item.id}`}
                          className="inline-flex w-full md:w-auto items-center justify-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 md:py-1.5 text-xs font-semibold transition-colors min-h-10 md:min-h-0"
                        >
                          <Eye className="h-3.5 w-3.5" /> Thẩm định
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <FileCheck2 className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-800">Không có hồ sơ nào</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {status
                          ? `Không có hồ sơ nào ở trạng thái ${status}.`
                          : 'Hiện chưa có hồ sơ xác minh nào trong danh sách.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="border-t border-slate-200 p-4">
              <Pagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
