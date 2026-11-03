# Component Pattern: Analytical Dashboards & Bento Grids

## 1. Bản chất & Vai trò thiết kế
Dashboard cung cấp "cái nhìn từ trên cao" (Birds-eye view) cho Ban lãnh đạo và Quản lý vận hành. Nó tổng hợp các chỉ số sống (Live Telemetry), lưu lượng xe, tỷ lệ lấp đầy bãi và doanh thu theo thời gian thực.

---

## 2. Vấn đề thường gặp từ Stitch & Cách giải quyết

### Sự cố 1: Dashboard có quá nhiều thẻ thống kê ngang hàng, không rõ trọng tâm
- **Quan sát:** Có 8 thẻ KPI hiển thị giống hệt nhau, người dùng không biết đâu là chỉ số sống còn của ngày hôm nay.
- **Giải pháp thiết kế:**
  1. *Phân cấp thẻ KPI (Primary vs Secondary Metrics):*
     - Chỉ số cốt lõi (Doanh thu hôm nay, Lượt xe đang lưu bãi) hiển thị kích thước lớn, font chữ to `text-3xl sm:text-4xl`, nền có điểm nhấn hoặc icon nổi bật.
     - Chỉ số phụ (Tỷ lệ đánh giá, Vé hoàn cọc) hiển thị kích thước nhỏ hơn.
  2. *Bố cục Bento Grid:*
     - Tận dụng bố cục Bento 12-cột (`grid grid-cols-1 lg:grid-cols-12 gap-6`).
     - Thẻ biểu đồ chính chiếm 7-8 cột, thẻ danh sách thông báo hoặc live camera chiếm 4-5 cột.

### Sự cố 2: Quá nhiều màu sắc rực rỡ cạnh tranh thị giác
- **Giải pháp:**
  - Hạn chế dùng màu neon hoặc màu sắc tùy hứng.
  - Sử dụng màu có ý nghĩa ngữ nghĩa (Semantic Colors):
    - Xanh lá (`emerald`): Tăng trưởng dương, Hệ thống bình thường.
    - Đỏ/Hồng (`rose`): Cảnh báo bãi đầy, Thiết bị barie mất kết nối.
    - Cam (`brand-orange`): Trọng tâm thương hiệu, Số liệu cốt lõi.
    - Xám (`slate`): Dữ liệu trung tính, nhãn phụ.

---

## 3. Checklist nghiệm thu Dashboard
- [ ] Số liệu có đơn vị rõ ràng (ví dụ: `20K+ Lượt/ngày`, `99.4%`, `0 đ`).
- [ ] Thẻ số liệu có Skeleton loading khi đang fetch dữ liệu từ TanStack Query.
- [ ] Trên mobile, các lưới 4 cột tự động chuyển thành 2 cột hoặc 1 cột cuộn dọc mượt mà.
