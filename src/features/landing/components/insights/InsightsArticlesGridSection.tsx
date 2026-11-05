import { useState } from 'react'
import {
  ChevronRight,
  TrendingUp,
  Receipt,
  Zap,
  Code2,
  Gavel,
  Network,
  ChevronDown,
} from 'lucide-react'
import type { InsightCategory } from './InsightsHeroSection'

interface ArticleItem {
  id: string
  category: 'driver' | 'yard' | 'fleet' | 'tech'
  categoryLabel: string
  date: string
  topic: string
  icon: typeof TrendingUp
  title: string
  description: string
  tag: string
  image: string
}

interface InsightsArticlesGridSectionProps {
  selectedCategory: InsightCategory
  searchQuery: string
}

export function InsightsArticlesGridSection({
  selectedCategory,
  searchQuery,
}: InsightsArticlesGridSectionProps) {
  const [visibleCount, setVisibleCount] = useState(6)

  const articles: ArticleItem[] = [
    {
      id: 'bai-01',
      category: 'yard',
      categoryLabel: 'Chủ Bãi Đỗ',
      date: '25/10/2026',
      topic: 'Tăng trưởng doanh thu bãi · 7 phút đọc',
      icon: TrendingUp,
      title: 'Kinh Nghiệm Tăng 32% Doanh Thu Khai Thác Bãi Xe Nhờ Ứng Dụng Barie ALPR Và Định Giá Động',
      description:
        'Mô hình ứng dụng trí tuệ bãi đỗ SmartTruckHub giúp giảm 100% tỷ lệ thất thoát tiền mặt, giải tỏa nút thắt cổng vào trong 8 giây và tự động điều chỉnh biểu phí theo khung giờ cao điểm.',
      tag: '#YARD-OPTIM',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAz91ULasXVA0KO1Faj_jU3nXn9PX6qQI_gk-DT9jPhrZ4x9-gVD_F7k-FsWAX7ecu5ORGYKTqAIUz741Ynkc523ebavE-44qegZCTz1mVT85lHqPGwgivuw3SArZ6gv44YGlk0K5PaTdlAu3rgfUgTtYsKAVmbLS60G862YVvzVxC7P5WGbIpIrPRIcP_sYb_j6LpadCd1Ok_HAtA5aBKrfLt6rJAj7ocjXAgO1QXc',
    },
    {
      id: 'bai-02',
      category: 'fleet',
      categoryLabel: 'Kế Toán & Thuế 3PL',
      date: '22/10/2026',
      topic: 'Thông tư 78/2021/TT-BTC · 5 phút đọc',
      icon: Receipt,
      title: 'Hướng Dẫn Quy Trình Xuất Hóa Đơn Điện Tử Tự Động Theo Thông Tư 78 Cho Doanh Nghiệp Vận Tải Container',
      description:
        'Phương pháp giải quyết triệt để vấn đề mất hóa đơn lẻ của tài xế, tích hợp biên lai QR PayOS đối soát theo mã container vào hệ thống kế toán doanh nghiệp vận tải.',
      tag: '#E-INVOICE',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAFqMmcvXsVN4urPiOyUWlWe5Cx9XTHUqCW6-Ym6SVccLywxHbO9uHgDQObC87h8ov_5sh_z-La8T_-eK3qUTcnE0XSNt8a9v4LHQF8D2J5mGzm9IZX0zDRYWpSSRJiGKE9ynMoSps4ewFig7SUoQ9mtSCgyTp4YYTbs5lcKTg6v8lFzZ5Y7eST9UNF6bBRK4tJE_46NrBnfo_q_QZp_8zJesHAW38P0zPQUltWRcZU',
    },
    {
      id: 'bai-03',
      category: 'driver',
      categoryLabel: 'Hướng Dẫn Tài Xế',
      date: '18/10/2026',
      topic: 'Bản đồ hạ tầng lái xe · 8 phút đọc',
      icon: Zap,
      title: 'Cẩm Nang Bác Tài: Bản Đồ Cầu Yếu, Giới Hạn Tĩnh Không Và Điểm Cắm Sạc Lạnh 380V Tuyến Miền Tây - Cát Lái',
      description:
        'Tổng hợp 24 trạm đỗ đạt chuẩn có sẵn trụ cắm điện 3 pha cho hàng thủy sản lạnh xuất khẩu, cùng dữ liệu tĩnh không các cầu vượt huyết mạch tránh lỗi phạt tải trọng.',
      tag: '#REEFER-GUIDE',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBeba0_uJogKcFRTY5RtoVDwNkoLCF0m5icSRTRQ2sJeNNiHq6C0r5KGQhRUzVHFh7FxoH7adzBjNuA1T2PU3e2wUnR3GB64ILYlNeaT0oBKTZqOsk_AWcJn1hdimyq55n6q6Q9CK0kg5pebLiBGKJdho5Z4BS4xPkYcN4iebs1kCzeKfi5mLEIQePtVRaxxRm4bEi33bZ0VepXC_HqJHmE3yCjVgoKR4ZN5QRnpL4P',
    },
    {
      id: 'bai-04',
      category: 'tech',
      categoryLabel: 'Kỹ Thuật API',
      date: '15/10/2026',
      topic: 'Tích hợp hệ thống ERP · 9 phút đọc',
      icon: Code2,
      title: 'Tích Hợp API Điều Phối SmartTruck Vào Phần Mềm SAP/MISA: Hướng Dẫn Kỹ Thuật Đầy Đủ',
      description:
        'Tài liệu triển khai API Webhook gửi tín hiệu mở barie theo thời gian thực, đồng bộ hóa vị trí bãi đỗ rảnh và đối soát tự động tiền cọc PayOS cho đội xe doanh nghiệp lớn.',
      tag: '#API-INTEGRATION',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC2HzBGMwZo0DMRqR6mo1kseB1awg1D-khACrH0-53oz7bmGpwVZqw-TIVnMl-ibIDwKTxLO2YlXOFZLFu1IW5FCr7lZzVZL4Jrs0wLB06q1SXfvNy9BPZDKOM4DuOoUO7QCsz6vUm9hXKk82roxMXH8GJDfZLXTrMEKWG8xDeEI_C5zJUypEs1bw4R7QWFxTipq7aCHvAeW1BI9rcCnY5c-qnYySaKGPgdF2Dfn_9L',
    },
    {
      id: 'bai-05',
      category: 'fleet',
      categoryLabel: 'Pháp Lý Vận Tải',
      date: '10/10/2026',
      topic: 'Nghị định cập nhật 2026 · 6 phút đọc',
      icon: Gavel,
      title: 'Quy Định Mới Về Phạt Đỗ Xe Quá Giờ Tại Các Khu Kinh Tế Trọng Điểm Năm 2026',
      description:
        'Điểm qua các chế tài xử phạt hành chính đối với hành vi dừng chờ sai quy định quanh vành đai cụm cảng Hải Phòng, Cái Mép - Thị Vải và cách giải quyết qua ứng dụng đặt chỗ trước.',
      tag: '#COMPLIANCE-2026',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCNp7P9h8Li6Mx_-Im0E1e7BWWJcj4DjGmeKzLRLWZi053Rt1NCivi5gF7yCJ64Uw1czut1H9qYWRKxg0yAjMKV35tAowLXq71sYxHwoqyzhU_yZalXN7486tgcq8k3gZSUc2isiOlmaYw01zQQ40UFiLvYHbMDM5NWnxOfTQE-Xz8GujtA-ZOyw73yvv4VFRty2haAbO1E0g0xmIw3WWwnmvsKaIZGIaZLtvPTDu8k',
    },
    {
      id: 'bai-06',
      category: 'yard',
      categoryLabel: 'Nghiên Cứu Điển Hình',
      date: '05/10/2026',
      topic: 'Case Study Vận Hành · 10 phút đọc',
      icon: Network,
      title: 'Bài Học Từ Cụm Cảng Đình Vũ: Cách Giảm Thời Gian Lưu Bãi Từ 4 Tiếng Xuống 45 Phút Bằng Hàng Đợi Ảo',
      description:
        'Chi tiết phương thức áp dụng thuật toán phân luồng và slot time-window đặt trước, giảm tỷ lệ kẹt xe cục bộ ngoài cổng bãi đến 85% trong đợt cao điểm xuất khẩu cuối năm.',
      tag: '#CASE-STUDY-DV',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB3K_W8A6PGXvA_E9Sxuu4FRcaYxEMe3HQ8L6N7yef_Zp76IQJyw-TYHLxOPEzmDgrMuRQYD9BXATn5yPVhnAPttHbGXIULOVXko9Xv-tyCFPDyhlAZ1SERP6th7sl90soDmLeo3GwBNGzblM8kgjDTuz9HKUsHmRAPuIsnzAuh97iBBeeIIK3NGx2p9NJJn0pZamzVpSNO1LdCo2Y311UIYVte-Y_098VSRWx6ZMc3',
    },
  ]

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredArticles = articles.filter((art) => {
    const matchCategory = selectedCategory === 'all' || art.category === selectedCategory
    const matchSearch =
      normalizedQuery === '' ||
      art.title.toLowerCase().includes(normalizedQuery) ||
      art.description.toLowerCase().includes(normalizedQuery) ||
      art.tag.toLowerCase().includes(normalizedQuery) ||
      art.categoryLabel.toLowerCase().includes(normalizedQuery)
    return matchCategory && matchSearch
  })

  const displayedArticles = filteredArticles.slice(0, visibleCount)

  return (
    <section className="w-full bg-[#EEF2F7] py-16" id="danh-sach-bai-viet">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E2E8F0]">
          <div>
            <span className="font-mono text-xs text-[#F97316] uppercase tracking-wider font-semibold">
              CHUYÊN ĐỀ PHÂN TÍCH & HƯỚNG DẪN THỰC THI
            </span>
            <h2 className="font-sora font-bold text-2xl lg:text-3xl text-[#060D1A] tracking-tight mt-1">
              Bài Viết & Cẩm Nang Mới Nhất
            </h2>
          </div>
          <div className="font-mono text-xs text-slate-500 flex items-center gap-2">
            <span>HIỂN THỊ: {displayedArticles.length} / {filteredArticles.length} TÀI LIỆU KHẢO SÁT</span>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7" id="articleCardsGrid">
          {displayedArticles.map((art) => {
            const Icon = art.icon
            return (
              <article
                key={art.id}
                className="article-item flex flex-col bg-white rounded-xl overflow-hidden border border-[#E2E8F0] hover:shadow-lg transition-all group"
                data-category={art.category}
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-[#060D1A] text-white font-mono text-xs rounded shadow-sm font-medium">
                    {art.categoryLabel}
                  </span>
                  <span className="absolute bottom-3.5 right-3.5 px-2 py-0.5 bg-white/95 text-slate-700 font-mono text-xs rounded shadow-sm border border-slate-200">
                    {art.date}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-3">
                      <Icon className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                      <span>{art.topic}</span>
                    </div>

                    <h3 className="font-sora font-semibold text-lg text-[#060D1A] group-hover:text-[#F97316] transition-colors mb-3 leading-snug">
                      {art.title}
                    </h3>

                    <p className="font-inter text-sm text-slate-600 line-clamp-3 mb-6">
                      {art.description}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <a
                      href={`#${art.id}`}
                      className="font-sora text-xs text-[#F97316] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                    >
                      <span>Xem Phân Tích</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                    <span className="font-mono text-xs text-slate-400">{art.tag}</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Empty Search Result Fallback */}
        {displayedArticles.length === 0 && (
          <div role="status" className="py-16 text-center bg-white rounded-xl border border-[#E2E8F0]">
            <p className="text-slate-500 font-inter text-sm">
              Không tìm thấy bài viết nào phù hợp với từ khóa &quot;{searchQuery}&quot;.
            </p>
          </div>
        )}

        {/* Pagination / Load more */}
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            disabled={visibleCount >= filteredArticles.length}
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#060D1A] font-sora text-xs font-bold transition-all shadow-sm"
          >
            <span>{visibleCount >= filteredArticles.length ? 'ĐÃ HIỂN THỊ TẤT CẢ BÀI VIẾT' : 'TẢI THÊM BÀI PHÂN TÍCH TRƯỚC ĐÓ'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
