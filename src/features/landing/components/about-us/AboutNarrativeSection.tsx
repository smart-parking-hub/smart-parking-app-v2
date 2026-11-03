import { Quote, BadgeCheck } from 'lucide-react'

export function AboutNarrativeSection() {
  return (
    <section className="w-full bg-[#EEF2F7] py-24 px-6 lg:px-12 flex justify-center border-y border-[#E2E8F0]">
      <div className="max-w-[1240px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Ground Reality Narrative */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-6 bg-[#F97316] rounded-xs" />
            <span className="font-mono text-xs text-[#64748B] uppercase tracking-widest font-semibold">
              BỐI CẢNH THỰC ĐỊA &amp; KHỞI NGUYÊN
            </span>
          </div>

          <h2 className="font-sora font-bold text-2xl sm:text-3xl lg:text-4xl text-[#060D1A] mb-6 tracking-tight leading-tight">
            Nghịch Lý Bến Bãi Tại Các Cụm Cảng Huyết Mạch Việt Nam
          </h2>

          <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            <p>
              Tại các cụm yết hầu như Cát Lái (TP.HCM), Cái Mép - Thị Vải (Bà Rịa) và Đình Vũ (Hải Phòng), hàng ngàn tài xế xe đầu kéo container mất từ 3 đến 4 giờ đồng hồ chỉ để tìm nơi hạ bãi, chờ giờ hạ tải hoặc đậu tạm qua đêm chờ lệnh điều độ cảng.
            </p>
            <p>
              Hậu quả là những hàng xe dài xếp hàng tràn ra lòng đường quốc lộ, rủi ro tai nạn giao thông rình rập, tài xế không dám chợp mắt vì sợ hút trộm dầu diesel, còn doanh nghiệp vận tải chịu phí phạt lưu ca bãi tăng vọt theo từng giờ.
            </p>
            <p>
              Hạ tầng bến bãi truyền thống tồn tại độc lập, quản lý bằng sổ ghi tay, thiếu minh bạch về giá và không có cơ chế cảnh báo sức chứa từ xa. SmartTruck Hub không chỉ là một ứng dụng di động; chúng tôi chuẩn hóa giao thức vận hành điểm đỗ trở thành mắt xích thông minh trong chuỗi cung ứng quốc gia.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#E2E8F0]">
            <div>
              <div className="font-sora font-bold text-[#060D1A] text-lg sm:text-xl">
                3-4 Giờ
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium">
                Thời gian tìm bãi trước đây
              </div>
            </div>
            <div>
              <div className="font-sora font-bold text-[#060D1A] text-lg sm:text-xl">
                0.2 Giây
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium">
                Mở barie qua quét ALPR
              </div>
            </div>
            <div>
              <div className="font-sora font-bold text-[#060D1A] text-lg sm:text-xl">
                100%
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium">
                Xuất hóa đơn VAT tự động
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Container & Founder Quote */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="relative rounded-lg overflow-hidden bg-[#060D1A] border border-slate-700 shadow-xl">
            {/* Terminal Image */}
            <div
              className="w-full h-80 bg-cover bg-center"
              role="img"
              aria-label="Bãi đỗ xe container hiện đại tại cụm cảng Cát Lái về đêm, dàn đèn cao áp chiếu sáng các vạch đỗ tiêu chuẩn rộng rãi, xe đầu kéo xếp thẳng hàng dưới sự điều phối của hệ thống camera giám sát thông minh và barie tự động, tông màu xanh navy thẫm và ánh cam công nghiệp"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCuKVa-E2rp1M9hj0PP-6kqRRJjxiTqKlxWC4dwwsbqQgIOrW8pn1ef0siZ8KhXXp7pvBwghdNBL3pgGpMzNEYIXj3qt1Vbo3Ux4_ceWieR5e-Ia0CceRZ6-Stk1nYRPR4DZhHQxr5xpkJ1ugIJDshFiafnj9JaOPQ_QGJfa8CNVFD8A40IGSFGpT8wa3FHH8IW_Giq8UkYj7l1S9Ao_PA8ziN6XVhoFSgAIWZUO4yB')",
              }}
            />

            {/* Philosophy Overlay Quote */}
            <div className="p-8 bg-[#060D1A] text-white">
              <Quote className="w-8 h-8 text-[#F97316] mb-4" aria-hidden="true" />
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-6 italic">
                &ldquo;Công nghệ logistics không nằm ở những khẩu hiệu xa vời, mà nằm ở 0.2 giây barie mở tự động và giấc ngủ an tâm của người tài xế trong cabin.&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <div>
                  <div className="font-sora font-semibold text-white text-base">
                    Nguyễn Hoàng Nam
                  </div>
                  <div className="font-mono text-xs text-[#F97316] font-medium">
                    Sáng lập viên &amp; Giám đốc Điều hành (CEO)
                  </div>
                </div>
                <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <BadgeCheck className="w-5 h-5 text-[#F97316]" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
