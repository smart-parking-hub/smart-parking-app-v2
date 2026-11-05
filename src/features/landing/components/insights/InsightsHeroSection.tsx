import { Search } from 'lucide-react'

export type InsightCategory = 'all' | 'driver' | 'yard' | 'fleet' | 'tech'

interface InsightsHeroSectionProps {
  selectedCategory: InsightCategory
  onSelectCategory: (cat: InsightCategory) => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function InsightsHeroSection({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: InsightsHeroSectionProps) {
  const categories: { id: InsightCategory; label: string }[] = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'driver', label: 'Dành Cho Tài Xế' },
    { id: 'yard', label: 'Chủ Bãi & Bến Bãi' },
    { id: 'fleet', label: 'Quản Trị Đội Xe 3PL' },
    { id: 'tech', label: 'Công Nghệ & API' },
  ]

  return (
    <section className="w-full bg-[#EEF2F7] border-b border-[#E2E8F0] pt-14 pb-12">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Eyebrow Tag */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] font-mono text-xs uppercase tracking-widest text-slate-800 shadow-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse"></span>
            BẢN TIN CHUYÊN NGÀNH · TRÍ TUỆ LOGISTICS 4.0
          </span>
          <span className="hidden md:inline-block font-mono text-xs text-slate-500 uppercase">
            FRETRIX INTELLIGENCE DESK · PHÁT HÀNH ĐỊNH KỲ
          </span>
        </div>

        {/* Main Headline & Subtitle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-8">
            <h1 className="font-sora font-bold text-3xl md:text-4xl text-[#060D1A] tracking-tight leading-tight">
              Phân Tích Bến Bãi, <span className="text-[#F97316]">Dữ Liệu Tải Trọng</span> & Dòng Chảy Vận Tải.
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="font-inter text-sm md:text-base text-slate-600 leading-relaxed">
              Báo cáo độc quyền từ thực địa cảng biển, kinh nghiệm tối ưu hóa chi phí đội xe và cẩm nang số hóa bến bãi dành cho các nhà vận hành logistics chuyên nghiệp.
            </p>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-3 md:p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Tab Categories pill-style */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none"
            id="categoryFilterBar"
            role="tablist"
            aria-label="Bộ lọc chuyên mục bài viết"
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-pressed={isActive}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`category-btn px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#060D1A] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:text-[#060D1A] hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              id="articleSearch"
              aria-label="Tìm kiếm bài viết"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm bài viết, mã bến, chỉ số..."
              className="w-full bg-slate-50 border border-[#E2E8F0] text-[#060D1A] text-sm pl-10 pr-4 py-2.5 rounded-full outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
