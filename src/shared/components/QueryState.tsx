import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { errorMessage } from '@/shared/api/resources'
import { Notice, secondary } from './Workspace'
export function QueryState<T>({
  query,
  children,
}: {
  query: UseQueryResult<T>
  children: (data: T) => ReactNode
}) {
  if (query.isPending)
    return (
      <div role="status" className="animate-pulse space-y-4 p-6">
        <p>Đang tải dữ liệu…</p>
        <div className="h-32 rounded-2xl bg-brand-border" />
        <div className="h-64 rounded-2xl bg-brand-border" />
      </div>
    )
  if (query.isError)
    return (
      <Notice error>
        <div>
          <p>{errorMessage(query.error)}</p>
          <button
            className={`${secondary} mt-3`}
            onClick={() => void query.refetch()}
          >
            Thử lại
          </button>
        </div>
      </Notice>
    )
  return <>{children(query.data)}</>
}
