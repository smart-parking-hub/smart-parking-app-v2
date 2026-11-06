/**
 * Utility for exporting data to CSV format with UTF-8 BOM for Microsoft Excel compatibility.
 * Resolves TSK-P1-01, APP-07, ISS-10: Vietnamese diacritics and accounting data integrity.
 */

export interface CsvColumn<T> {
  header: string
  accessor: keyof T | ((row: T) => string | number | boolean | null | undefined)
}

/**
 * Generates a CSV string with a UTF-8 Byte Order Mark (\uFEFF)
 * so Excel on Windows & macOS opens Vietnamese accents without mojibake.
 */
export function generateCsvContent<T>(data: T[], columns: CsvColumn<T>[]): string {
  const bom = '\uFEFF'
  const headerRow = columns
    .map((col) => `"${col.header.replace(/"/g, '""')}"`)
    .join(',')

  const rows = data.map((row) => {
    return columns
      .map((col) => {
        let val: unknown
        if (typeof col.accessor === 'function') {
          val = col.accessor(row)
        } else {
          val = row[col.accessor]
        }

        if (val === null || val === undefined) {
          return '""'
        }

        const strVal = String(val).replace(/"/g, '""')
        return `"${strVal}"`
      })
      .join(',')
  })

  return bom + [headerRow, ...rows].join('\r\n')
}

/**
 * Returns formatted YYYYMMDD date string for report filenames.
 */
export function getFormattedDateForFilename(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

/**
 * Triggers a native browser file download using a Blob.
 */
export function downloadFile(content: string, filename: string, mimeType = 'text/csv;charset=utf-8;'): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Convenience method: formats data and downloads CSV directly.
 */
export function exportToCsv<T>(data: T[], columns: CsvColumn<T>[], filename: string): void {
  const content = generateCsvContent(data, columns)
  downloadFile(content, filename)
}
