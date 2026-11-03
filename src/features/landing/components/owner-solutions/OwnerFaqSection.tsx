import { ChevronDown } from 'lucide-react'

export function OwnerFaqSection() {
  const faqs = [
    {
      id: 'faq-1',
      question: 'SmartTruckHub thu phí dịch vụ vận hành bao nhiêu % trên doanh thu?',
      defaultOpen: true,
      answer: (
        <p>
          SmartTruckHub áp dụng chính sách chiết khấu đối tác cực kỳ minh bạch và cạnh tranh: chỉ{' '}
          <strong>5% trên tổng doanh thu lượt xe phát sinh thực tế</strong> qua hệ thống. Chúng tôi{' '}
          <strong>không thu phí duy trì hàng tháng</strong>, không phí phần mềm thường niên. Nếu bãi
          của bạn không có lượt xe, bạn hoàn toàn không mất chi phí.
        </p>
      ),
    },
    {
      id: 'faq-2',
      question:
        'Hệ thống Barie và Camera ALPR có hoạt động được khi bãi mất mạng Internet không?',
      defaultOpen: false,
      answer: (
        <p>
          Hoàn toàn hoạt động bình thường. Bộ điều khiển trạm cổng SmartTruck Gate Edge chạy mô hình{' '}
          <strong>Offline-First với bộ nhớ cache cục bộ</strong>. Khi mất mạng Internet, camera AI
          vẫn nhận diện biển số, lưu ảnh ngoại tuyến và barie vẫn nâng hạ theo danh sách whitelist
          đăng ký trước. Ngay khi có mạng trở lại, toàn bộ dữ liệu đối soát sẽ tự động đồng bộ hóa
          lên Cloud trong vòng 30 giây.
        </p>
      ),
    },
    {
      id: 'faq-3',
      question: 'Bao lâu thì tôi nhận được tiền thanh toán của tài xế vào tài khoản ngân hàng?',
      defaultOpen: false,
      answer: (
        <p>
          Thời gian đối soát là <strong>T+1 tự động</strong> (vào 09:00 sáng mỗi ngày làm việc).
          Ngoài ra, chủ bãi có quyền sử dụng tính năng <em>&ldquo;Rút tiền tức thì 24/7&rdquo;</em>{' '}
          trên Merchant Portal để chuyển tiền từ Ví Doanh Thu về tài khoản ngân hàng (Vietcombank,
          ACB, Techcombank, MB,...) chỉ trong 60 giây mà không cần đợi đối soát định kỳ.
        </p>
      ),
    },
    {
      id: 'faq-4',
      question: 'Chi phí đầu tư thiết bị phần cứng Barie và Camera ban đầu như thế nào?',
      defaultOpen: false,
      answer: (
        <div className="space-y-2">
          <p>SmartTruckHub cung cấp 2 hình thức hợp tác linh hoạt:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Hình thức 1 (Tài trợ 100% thiết bị):</strong> Dành cho bãi có quy mô từ 80
              slot container trở lên tại các trục giao thông trọng điểm. SmartTruckHub đầu tư toàn bộ
              cụm Barie, Camera ALPR và máy tính điều khiển.
            </li>
            <li>
              <strong>Hình thức 2 (Chủ bãi sở hữu phần cứng):</strong> Chủ bãi tự trang bị hoặc mua
              trọn gói cụm thiết bị chuẩn công nghiệp với giá ưu đãi đối tác (bảo hành 24 tháng 1 đổi
              1 tận nơi).
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'faq-5',
      question:
        'Bãi đất của tôi chưa trải bê tông, chỉ là đất nện hoặc đá dăm thì có hợp tác được không?',
      defaultOpen: false,
      answer: (
        <p>
          Hoàn toàn được! Điều kiện tối thiểu chỉ cần khu đất có lối ra vào an toàn cho xe tải nặng,
          không vướng tranh chấp quy hoạch và có ranh giới rõ ràng. Kỹ sư thực địa của SmartTruckHub
          sẽ hỗ trợ tư vấn phương án phân luồng tạm bằng cọc tiêu phản quang và lắp trạm barie di
          động mà không cần đầu tư san lấp tốn kém ngay từ đầu.
        </p>
      ),
    },
  ]

  return (
    <section className="w-full bg-white py-24 px-6 text-[#0F172A]" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="mb-14 text-center">
          <span className="font-inter text-xs font-bold tracking-widest text-brand-orange uppercase bg-slate-100 border border-slate-200 px-3 py-1 rounded inline-block mb-3">
            GIẢI ĐÁP THẮC MẮC ĐỐI TÁC
          </span>
          <h2 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A]">
            Câu Hỏi Thường Gặp Của Chủ Mặt Bằng.
          </h2>
          <p className="font-inter text-sm sm:text-base text-slate-600 mt-2">
            Tất cả những gì bạn cần biết về chính sách chiết khấu, thiết bị phần cứng barie và đối
            soát doanh thu.
          </p>
        </div>

        {/* FAQ Accordion Items */}
        <div className="space-y-4 font-inter">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group bg-[#EEF2F7] border border-[#D7DFE9] p-5 rounded-2xl transition-all open:bg-white open:shadow-sm"
              open={faq.defaultOpen || undefined}
            >
              <summary className="font-sora text-base sm:text-lg font-bold text-[#0F172A] cursor-pointer list-none flex justify-between items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded">
                <span>{faq.question}</span>
                <ChevronDown
                  className="h-5 w-5 text-slate-500 group-open:rotate-180 transition-transform shrink-0 ml-4"
                  aria-hidden="true"
                />
              </summary>
              <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-2">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
