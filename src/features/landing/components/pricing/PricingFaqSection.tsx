import { ChevronDown } from 'lucide-react'

export function PricingFaqSection() {
  const faqs = [
    {
      id: 'faq-1',
      question: 'Tài xế sử dụng app SmartTruckHub có bị thu bất kỳ loại phí nào không?',
      answer:
        'Hoàn toàn không. Tài xế được tra cứu bãi đỗ, đặt chỗ, sử dụng cổng quét mã QR barie tự động và nhận chỉ dẫn đường đi hoàn toàn miễn phí trọn đời. Bác tài chỉ trả đúng số tiền đỗ xe theo niêm yết của bãi mà không có bất kỳ phụ phí dịch vụ nào.',
    },
    {
      id: 'faq-2',
      question: 'Chính sách hoàn tiền cọc khi hủy chuyến như thế nào?',
      answer:
        'Hệ thống áp dụng chính sách bảo vệ tài xế tối đa: Hủy đặt chỗ trước 60 phút so với giờ hẹn sẽ được hoàn cọc 100% tự động về ví hoặc tài khoản ngân hàng trong vòng 60 giây. Trường hợp bất khả kháng do kẹt cảng có xác thực sẽ được xét duyệt miễn phí 100%.',
    },
    {
      id: 'faq-3',
      question: 'Doanh nghiệp vận tải thanh toán công nợ và lấy hóa đơn VAT thế nào?',
      answer:
        'Doanh nghiệp có thể thiết lập hạn mức tín dụng theo tháng. Hóa đơn điện tử VAT hợp lệ (chuẩn Tổng cục Thuế) được tự động xuất gộp vào ngày 28 hàng tháng kèm bảng kê chi tiết từng biển số xe, thời gian ra vào và địa điểm đỗ, sẵn sàng tích hợp thẳng vào phần mềm kế toán.',
    },
    {
      id: 'faq-4',
      question: 'Chủ bãi có phải trả phí lắp đặt thiết bị ban đầu không?',
      answer:
        'Đội ngũ kỹ sư của SmartTruckHub tiến hành khảo sát thực địa miễn phí. Đối với các mặt bằng đạt chuẩn quy mô trên 30 chỗ, chúng tôi hỗ trợ phương án đồng tài trợ hoặc cho thuê trọn gói phần cứng camera ALPR và barie tốc độ cao với chi phí khấu hao 0 đồng trong năm đầu tiên.',
    },
    {
      id: 'faq-5',
      question: 'Thời gian rút tiền từ ví Merchant về tài khoản ngân hàng mất bao lâu?',
      answer:
        'Tiền phí gửi xe thu qua cổng PayOS sẽ tự động được quyết toán về tài khoản ngân hàng của chủ bãi theo chu kỳ T+1 hoặc chủ bãi có thể chủ động tạo lệnh rút tức thì (Realtime 24/7) trong vòng 60 giây vào bất kỳ lúc nào trên Merchant Portal.',
    },
  ]

  return (
    <section className="w-full bg-[#EEF2F7] py-20 lg:py-24">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="font-inter text-xs text-[#d95f00] font-bold uppercase tracking-wider">
            HỖ TRỢ &amp; GIẢI ĐÁP
          </span>
          <h2 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] mt-2 mb-4 tracking-tight">
            Câu Hỏi Thường Gặp Về Biểu Phí
          </h2>
          <p className="font-inter text-sm sm:text-base text-[#475569]">
            Chính sách thanh toán, hoàn cọc và đối soát minh bạch chuẩn quốc tế.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group bg-white border border-[#D7DFE9] rounded-xl overflow-hidden transition-all shadow-xs"
            >
              <summary className="w-full text-left px-6 py-5 flex items-center justify-between font-sora text-base sm:text-lg font-bold text-[#0F172A] hover:text-[#d95f00] transition-colors cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange">
                <span>{faq.question}</span>
                <ChevronDown
                  className="h-5 w-5 text-[#475569] group-open:rotate-180 transition-transform shrink-0 ml-4"
                  aria-hidden="true"
                />
              </summary>
              <div className="px-6 pb-5 pt-1 text-[#475569] font-inter text-sm leading-relaxed border-t border-[#EEF2F7]">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
