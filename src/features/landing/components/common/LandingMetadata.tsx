import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pages = [
  {
    paths: ['/'],
    title: 'Bãi đỗ xe tải & điều phối thông minh',
    description: 'SmartTruckHub kết nối tài xế và chủ bãi: tìm bãi đỗ xe tải, đặt chỗ, quản lý vận hành và tích hợp API điều phối vận tải.',
  },
  {
    paths: ['/api-docs', '/solutions/api', '/ket-noi-api'],
    title: 'Tích hợp API điều phối bãi đỗ vào TMS / ERP',
    description: 'Khám phá API SmartTruckHub: tích hợp đặt chỗ bãi đỗ, vé QR, webhook trạng thái và điều phối đội xe vào hệ thống TMS / ERP.',
  },
  {
    paths: ['/driver-solutions', '/solutions/drivers', '/giai-phap-tai-xe'],
    title: 'Giải pháp tìm bãi đỗ cho tài xế',
    description: 'Tìm hiểu cách tìm bãi đỗ xe tải theo lộ trình, đặt chỗ trước, sử dụng vé QR và chọn tiện ích phù hợp cùng SmartTruckHub.',
  },
  {
    paths: ['/owner-solutions', '/solutions/owners', '/giai-phap-chu-bai'],
    title: 'Giải pháp quản lý dành cho chủ bãi',
    description: 'Khám phá giải pháp SmartTruckHub dành cho chủ bãi: quản lý ô đỗ, check-in, thanh toán và theo dõi hoạt động bãi đỗ xe tải.',
  },
  {
    paths: ['/pricing', '/bang-gia'],
    title: 'Bảng giá dịch vụ bãi đỗ & quản lý',
    description: 'So sánh các gói dịch vụ SmartTruckHub theo lượt và theo tháng, xem tiện ích đi kèm và giải đáp thắc mắc về chi phí.',
  },
  {
    paths: ['/about', '/company/about', '/ve-chung-toi'],
    title: 'Về SmartTruckHub',
    description: 'Tìm hiểu SmartTruckHub, định hướng phát triển hạ tầng bãi đỗ thông minh và đội ngũ kết nối công nghệ với ngành logistics Việt Nam.',
  },
  {
    paths: ['/contact', '/company/contact'],
    title: 'Liên hệ & hỗ trợ',
    description: 'Liên hệ đội ngũ SmartTruckHub để được tư vấn bãi đỗ, giải pháp quản lý và tích hợp API dành cho doanh nghiệp vận tải.',
  },
  {
    paths: ['/careers', '/company/careers', '/tuyen-dung'],
    title: 'Tuyển dụng & cơ hội nghề nghiệp',
    description: 'Khám phá vị trí tuyển dụng, văn hóa làm việc và quy trình ứng tuyển tại SmartTruckHub trong lĩnh vực công nghệ logistics.',
  },
  {
    paths: ['/insights', '/company/blog', '/tin-tuc'],
    title: 'Bản tin & kiến thức logistics',
    description: 'Theo dõi bản tin SmartTruckHub về vận tải, quản lý bãi đỗ, chuyển đổi số và những xu hướng của ngành logistics.',
  },
]

export function LandingMetadata() {
  const { pathname } = useLocation()
  const page =
    pages.find((item) => item.paths.includes(pathname.replace(/\/$/, '') || '/')) ?? pages[0]

  useEffect(() => {
    const previousTitle = document.title
    const cleanups: Array<() => void> = []
    document.title = `${page.title} | SmartTruckHub`

    const setMeta = (key: string, value: string, property = false) => {
      const attribute = property ? 'property' : 'name'
      const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
      const element = existing ?? document.createElement('meta')
      const previous = element.content
      element.setAttribute(attribute, key)
      element.content = value
      if (!existing) document.head.append(element)
      cleanups.push(() => {
        if (existing) element.content = previous
        else element.remove()
      })
    }
    const url = new URL(page.paths[0], window.location.origin).href
    setMeta('description', page.description)
    setMeta('og:title', document.title, true)
    setMeta('og:description', page.description, true)
    setMeta('og:type', 'website', true)
    setMeta('og:locale', 'vi_VN', true)
    setMeta('og:url', url, true)
    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = url
    document.head.append(canonical)
    return () => {
      document.title = previousTitle
      cleanups.forEach((cleanup) => cleanup())
      canonical.remove()
    }
  }, [page])

  return null
}
