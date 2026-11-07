import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  generateCsvContent,
  getFormattedDateForFilename,
  downloadFile,
  exportToCsv,
  type CsvColumn,
} from '../exportToCsvUtil'

describe('exportToCsvUtil (Tiện ích xuất file CSV chuẩn UTF-8 BOM)', () => {
  let originalClick: typeof HTMLAnchorElement.prototype.click

  beforeEach(() => {
    vi.restoreAllMocks()
    originalClick = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = vi.fn()
  })

  afterEach(() => {
    HTMLAnchorElement.prototype.click = originalClick
    vi.restoreAllMocks()
  })

  it('generates CSV string with UTF-8 BOM prefix (\\uFEFF) and escapes Vietnamese diacritics', () => {
    interface TestData {
      id: number
      name: string
      notes: string
      emptyField?: string | null
    }

    const data: TestData[] = [
      {
        id: 1,
        name: 'Bãi Đỗ Xe Tân Cảng - Cát Lái (Cụm 2)',
        notes: 'Tiếp nhận xe "Container 40FT", Reefer 380V',
        emptyField: null,
      },
      {
        id: 2,
        name: 'Depot Sóng Thần 2',
        notes: 'Dây chuyền ALPR 0.2s',
        emptyField: undefined,
      },
    ]

    const columns: CsvColumn<TestData>[] = [
      { header: 'Mã Bãi', accessor: 'id' },
      { header: 'Tên Cơ Sở Bãi', accessor: 'name' },
      { header: 'Ghi Chú Vận Hành', accessor: 'notes' },
      { header: 'Thông Tin Bổ Sung', accessor: (row) => row.emptyField || 'Không có' },
    ]

    const csv = generateCsvContent(data, columns)

    // Verify BOM
    expect(csv.startsWith('\uFEFF')).toBe(true)

    // Verify headers
    expect(csv).toContain('"Mã Bãi","Tên Cơ Sở Bãi","Ghi Chú Vận Hành","Thông Tin Bổ Sung"')

    // Verify row 1 escaped quotes
    expect(csv).toContain(
      '"1","Bãi Đỗ Xe Tân Cảng - Cát Lái (Cụm 2)","Tiếp nhận xe ""Container 40FT"", Reefer 380V","Không có"',
    )

    // Verify row 2
    expect(csv).toContain('"2","Depot Sóng Thần 2","Dây chuyền ALPR 0.2s","Không có"')
  })

  it('formats dates as YYYYMMDD string for reports', () => {
    const fixedDate = new Date(2026, 10, 6) // Month is 0-indexed: 10 = November
    expect(getFormattedDateForFilename(fixedDate)).toBe('20261106')
  })

  it('creates DOM link element, triggers click, and cleans up Blob URL', () => {
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-url-123')
    const mockRevokeObjectURL = vi.fn()
    window.URL.createObjectURL = mockCreateObjectURL
    window.URL.revokeObjectURL = mockRevokeObjectURL

    const appendSpy = vi.spyOn(document.body, 'appendChild')
    const removeSpy = vi.spyOn(document.body, 'removeChild')

    downloadFile('Mock CSV Content', 'report_20261106.csv')

    expect(mockCreateObjectURL).toHaveBeenCalled()
    expect(appendSpy).toHaveBeenCalled()
    expect(removeSpy).toHaveBeenCalled()
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url-123')
  })

  it('exportToCsv integrates content generation and downloadFile smoothly', () => {
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-csv-url')
    const mockRevokeObjectURL = vi.fn()
    window.URL.createObjectURL = mockCreateObjectURL
    window.URL.revokeObjectURL = mockRevokeObjectURL

    exportToCsv(
      [{ id: 101, name: 'Bãi Test' }],
      [
        { header: 'ID', accessor: 'id' },
        { header: 'Tên', accessor: 'name' },
      ],
      'test.csv',
    )

    expect(mockCreateObjectURL).toHaveBeenCalled()
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-csv-url')
  })
})
