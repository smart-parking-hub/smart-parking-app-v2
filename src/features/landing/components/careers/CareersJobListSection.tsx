import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

interface CareersJobListSectionProps {
  onApply: (jobTitle: string) => void
}

type Department = 'all' | 'engineering' | 'sales' | 'operations'

export function CareersJobListSection({ onApply }: CareersJobListSectionProps) {
  const [activeDept, setActiveDept] = useState<Department>('all')

  const filterTabs = [
    { id: 'all' as Department, label: 'Tất Cả (4)' },
    { id: 'engineering' as Department, label: 'Kỹ Thuật & Hệ Thống (2)' },
    { id: 'sales' as Department, label: 'Kinh Doanh B2B (1)' },
    { id: 'operations' as Department, label: 'Vận Hành Thực Địa (1)' },
  ]

  const jobs = [
    {
      id: 'job-be',
      category: 'engineering' as Department,
      badge: 'ENGINEERING',
      type: 'Full-time',
      location: 'TP. Hồ Chí Minh',
      title: 'Senior Backend Java Engineer (Spring Boot / Microservices)',
      description:
        'Thiết kế kiến trúc hệ thống backend xử lý điều phối hàng đợi và luồng giao dịch thanh toán PayOS. Chịu tải cao, độ trễ thấp phục vụ mạng lưới xe tải container liên tỉnh.',
      tags: ['Java 17+', 'Spring Cloud', 'MySQL Cluster', 'Redis', 'RabbitMQ / Kafka'],
      salary: '35 - 50 Triệu VNĐ',
      salaryExtra: '',
    },
    {
      id: 'job-fe',
      category: 'engineering' as Department,
      badge: 'ENGINEERING',
      type: 'Full-time',
      location: 'TP. Hồ Chí Minh',
      title: 'Senior Frontend Engineer (React / TypeScript / Tailwind)',
      description:
        'Phát triển hệ thống Dashboard điều phối bến bãi theo bản đồ số tương tác cao. Xây dựng portal quản trị chủ bãi đỗ với trải nghiệm mượt mà, tối ưu hiệu năng render bản đồ.',
      tags: ['React 19', 'TypeScript', 'Tailwind CSS', 'Leaflet OpenStreetMap', 'Web Performance'],
      salary: '30 - 45 Triệu VNĐ',
      salaryExtra: '',
    },
    {
      id: 'job-sales',
      category: 'sales' as Department,
      badge: 'SALES & PARTNERSHIPS',
      type: 'Full-time',
      location: 'Hà Nội / Hải Phòng',
      title: 'Chuyên Viên Phát Triển Thị Trường B2B (Fleet Sales Lead)',
      description:
        'Chịu trách nhiệm mở rộng mạng lưới doanh nghiệp vận tải 3PL, các chủ đội xe container và ký kết hợp tác tích hợp với các chủ cụm bãi đỗ thương mại tại Hải Phòng và Hà Nội.',
      tags: ['B2B Logistics Sales', 'Quan hệ Cảng & 3PL', 'Đàm Phán Hợp Đồng'],
      salary: '25 - 40 Triệu VNĐ',
      salaryExtra: '+ HH',
    },
    {
      id: 'job-ops',
      category: 'operations' as Department,
      badge: 'FIELD OPERATIONS',
      type: 'Full-time',
      location: 'Hải Phòng / Cát Lái',
      title: 'Kỹ Sư Triển Khai IoT & Camera Barie ALPR',
      description:
        'Trực tiếp lắp đặt, cấu hình và hiệu chuẩn hệ thống camera nhận diện biển số thời gian thực (0.2s) và bo mạch điều khiển barie tự động tại cổng vào/ra của các bãi đỗ đối tác.',
      tags: ['ALPR Optical', 'Phần Cứng Barie', 'TCP/IP Protocol', 'Bảo Trì Thực Địa'],
      salary: '20 - 30 Triệu VNĐ',
      salaryExtra: '',
    },
  ]

  const filteredJobs =
    activeDept === 'all' ? jobs : jobs.filter((job) => job.category === activeDept)

  return (
    <section className="w-full bg-white py-20 border-b border-[#E2E8F0]" id="vi-tri-tuyen-dung">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <span className="font-sora text-xs uppercase tracking-wider text-[#F97316] font-bold">
              CƠ HỘI NGHỀ NGHIỆP MỞ
            </span>
            <h2 className="font-sora text-2xl lg:text-3xl text-[#060D1A] font-bold mt-2 tracking-tight">
              Các Vị Trí Trọng Yếu Đang Tuyển Dụng
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-lg border border-slate-200" id="jobFilterContainer">
            {filterTabs.map((tab) => {
              const isActive = activeDept === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDept(tab.id)}
                  className={`filter-btn px-4 py-2 rounded text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#060D1A] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#060D1A]'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6" id="jobPositionsList">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="job-card p-6 lg:p-8 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#F97316] hover:shadow-md transition-all"
              data-category={job.category}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-[#060D1A] font-sora text-xs font-bold border border-slate-200">
                      {job.badge}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-inter text-xs">
                      {job.type}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-inter text-xs">
                      {job.location}
                    </span>
                  </div>

                  <h3 className="font-sora text-xl text-[#060D1A] font-bold tracking-tight">
                    {job.title}
                  </h3>

                  <p className="font-inter text-sm text-slate-600 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {job.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col lg:items-end justify-between shrink-0 gap-4">
                  <div className="lg:text-right">
                    <span className="font-inter text-xs uppercase text-slate-500 font-semibold">
                      Mức Lương Đề Xuất
                    </span>
                    <div className="font-sora text-xl text-[#060D1A] font-bold mt-0.5">
                      {job.salary}{' '}
                      {job.salaryExtra && (
                        <span className="font-inter text-xs font-normal text-slate-500">
                          {job.salaryExtra}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onApply(job.title)}
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border-2 border-[#F97316] bg-white hover:bg-[#F97316] text-[#F97316] hover:text-white font-sora text-xs font-bold transition-all shadow-sm group"
                  >
                    <span>ỨNG TUYỂN NGAY</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
