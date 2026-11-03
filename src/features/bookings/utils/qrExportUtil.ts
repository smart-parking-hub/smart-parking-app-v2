/**
 * Utility to convert an SVG element or QR SVG data into a crisp PNG blob and trigger direct download.
 */
export function exportSvgToPng(svgElement: SVGElement, fileName: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgElement)
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const URL = window.URL || window.webkitURL || window
      const blobURL = URL.createObjectURL(svgBlob)

      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        // Export high resolution for crisp barcode scanning
        const scale = 2
        canvas.width = (svgElement.clientWidth || 200) * scale
        canvas.height = (svgElement.clientHeight || 200) * scale

        const context = canvas.getContext('2d')
        if (!context) {
          URL.revokeObjectURL(blobURL)
          resolve(false)
          return
        }

        context.fillStyle = '#FFFFFF'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)

        canvas.toBlob((blob) => {
          if (!blob) {
            URL.revokeObjectURL(blobURL)
            resolve(false)
            return
          }

          const pngUrl = URL.createObjectURL(blob)
          const downloadLink = document.createElement('a')
          downloadLink.href = pngUrl
          downloadLink.download = `${fileName}.png`
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)

          URL.revokeObjectURL(pngUrl)
          URL.revokeObjectURL(blobURL)
          resolve(true)
        }, 'image/png')
      }

      image.onerror = () => {
        URL.revokeObjectURL(blobURL)
        resolve(false)
      }

      image.src = blobURL
    } catch {
      resolve(false)
    }
  })
}
