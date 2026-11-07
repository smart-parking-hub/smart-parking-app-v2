/**
 * API Adapters — Smart Parking Hub
 * Standardizes Spring Data JPA Page format with Frontend React Client Page format
 * Resolves GAP C-2 (0-indexed Spring Page vs 1-indexed Client Page)
 */

export interface SpringPage<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size?: number
  number?: number
  first?: boolean
  last?: boolean
  empty?: boolean
}

export interface ClientPage<T> {
  content: T[]
  totalPages: number
  totalElements: number
  currentPage: number
  pageSize: number
  number?: number
  size?: number
}

/**
 * Adapts Spring Boot JPA Page (0-indexed number) or Client Page to uniform ClientPage structure.
 */
export function adaptSpringPage<T>(
  raw: SpringPage<T> | ClientPage<T> | { data?: SpringPage<T> } | null | undefined,
  fallbackPageSize = 10,
): ClientPage<T> {
  if (!raw) {
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: 1,
      pageSize: fallbackPageSize,
    }
  }

  // Handle ApiResponse unwrapping if needed
  const pageData: Record<string, unknown> =
    'data' in raw && raw.data && typeof raw.data === 'object' && 'content' in (raw.data as unknown as Record<string, unknown>)
      ? (raw.data as unknown as Record<string, unknown>)
      : (raw as unknown as Record<string, unknown>)

  const content: T[] = Array.isArray(pageData.content) ? (pageData.content as T[]) : []
  const totalElements = typeof pageData.totalElements === 'number' ? pageData.totalElements : content.length
  const totalPages =
    typeof pageData.totalPages === 'number'
      ? pageData.totalPages
      : totalElements > 0
        ? Math.ceil(totalElements / fallbackPageSize)
        : 0

  // Spring JPA provides 0-indexed 'number', UI components expect 1-indexed 'currentPage'
  let currentPage = 1
  if (typeof pageData.currentPage === 'number') {
    currentPage = pageData.currentPage
  } else if (typeof pageData.number === 'number') {
    currentPage = pageData.number + 1
  }

  const pageSize =
    typeof pageData.size === 'number'
      ? pageData.size
      : typeof pageData.pageSize === 'number'
        ? pageData.pageSize
        : fallbackPageSize

  const springNumber = typeof pageData.number === 'number' ? pageData.number : currentPage - 1

  return {
    content,
    totalPages,
    totalElements,
    currentPage,
    pageSize,
    number: springNumber,
    size: pageSize,
  }
}

/**
 * Converts 1-indexed UI page number to Spring Data JPA 0-indexed query parameter.
 */
export function toSpringPageParams(
  page1Indexed: number = 1,
  size: number = 10,
  sort?: string,
): { page: number; size: number; sort?: string } {
  return {
    page: Math.max(0, page1Indexed - 1),
    size,
    ...(sort ? { sort } : {}),
  }
}
