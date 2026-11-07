# Screen Specification: SCR-002 DriverSolutionsPage (Giải pháp dành cho Tài xế)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-002`
- **Screen Name:** Trang giới thiệu giải pháp cho Tài xế xe tải (Driver Solutions)
- **Module:** `MOD-01: Public Landing & Marketing Website`
- **Route URL:** `/solutions/drivers` (Định nghĩa tại [`AppRoutes.tsx:78`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L78))
- **Layout Type:** `LandingLayout` ([`LandingLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingLayout.tsx))
- **Primary Component:** `smart-parking-app/src/features/landing/pages/DriverSolutionsPage.tsx`
- **Sub-components:**
  - `LandingNavbar` & `LandingFooter`
  - `framer-motion`: `motion.div` tạo hiệu ứng trượt xuất hiện
- **Access Role:** Public (Khách vãng lai, Tài xế xe tải, Chủ xe)
- **Discovery Status:** `VERIFIED` (Mã nguồn đã kiểm tra đối chiếu)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Cung cấp trang đích giới thiệu chuyên biệt (Dedicated Landing Page) nhắm trực tiếp vào đối tượng **Tài xế xe tải đường dài, tài xế xe đầu kéo container và các hợp tác xã vận tải**:
1. Giải thích chi tiết các bài toán nhức nhối mà tài xế gặp phải: Không tìm được chỗ đỗ hợp pháp, bị phạt dừng đỗ sai quy định, nguy cơ mất cắp nhiên liệu và hàng hóa khi đỗ ven quốc lộ.
2. Trình bày các lợi ích vượt trội của nền tảng SmartTruck: Đặt chỗ trước đảm bảo 100% có slot, thanh toán số không cần tiền mặt, tra cứu tiện ích hỗ trợ tài xế (nhà tắm, trạm cân, quán ăn, an ninh 24/7).
3. Thúc đẩy tài xế đăng ký tài khoản hoặc tải ứng dụng.

### B. Target Users
- Tài xế xe tải hạng nặng, xe container chạy các tuyến liên tỉnh.
- Chủ xe cá nhân hoặc đội ngũ tài xế của các doanh nghiệp 3PL.

### C. Entry Points
- Liên kết "Hướng dẫn tài xế" từ `LandingFooter` (`<Link to="/solutions/drivers">Hướng dẫn tài xế</Link>`).
- Đường dẫn từ các bài viết Blog hoặc chiến dịch quảng cáo mạng xã hội.

### D. Exit Points
- Thanh điều hướng `LandingNavbar`: Điều hướng sang `/parking`, `/register`, hoặc `/login`.
- Chân trang `LandingFooter`.

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Tổng Thể
- Container căn giữa với giới hạn chiều rộng chuẩn tài xế (`max-w-max-width-driver mx-auto px-container-padding py-24`).
- Tông màu chủ đạo: Xanh Teal kết hợp các thẻ bề mặt màu trung tính.

### B. Chi Tiết Thành Phần Giao Diện
1. **Khối Tiêu Đề (Hero Banner Header):**
   - Tiêu đề H1: `Giải pháp dành cho Tài xế` (Typography lớn, font đen đậm, màu `text-primary`).
   - Phụ đề: *"Lái xe an toàn hơn, nghỉ ngơi thoải mái hơn. SmartTruck giúp bạn tìm và đặt chỗ đỗ xe tải an ninh trên mọi tuyến đường."*
2. **Khối Nội Dung Giải Pháp (2 Cột):**
   - **Cột trái:** Hình ảnh xe tải di chuyển trên cao tốc (Tỉ lệ 4:3, góc bo lớn `rounded-3xl`, ảnh từ Unsplash).
   - **Cột phải:**
     - Tiêu đề H2: `Không còn chạy lòng vòng tìm chỗ đỗ`.
     - Đoạn văn mô tả: *"Hệ thống bản đồ thời gian thực của chúng tôi cho bạn biết chính xác bãi đỗ nào còn chỗ, bãi nào đã đầy trước khi bạn kịp đến nơi."*
     - Danh sách 3 lợi ích cốt lõi kèm icon `check_circle`:
       1. *Đặt trước vị trí, đảm bảo có chỗ 100%.*
       2. *Thanh toán tự động qua thẻ của công ty.*
       3. *Tra cứu tiện ích như phòng tắm, quán ăn, trạm cân.*

---

## 4. INTERACTION SPECIFICATION

| Phần Tử Giao Diện | Loại UI | Hành Động | Kết Quả Xử Lý | Bằng Chứng Mã Nguồn |
|---|---|---|---|---|
| Toàn trang | Animation | Mở trang / Render | `framer-motion` kích hoạt hiệu ứng fade-in và dịch chuyển `y: [20, 0]` | [DriverSolutionsPage.tsx:7](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/DriverSolutionsPage.tsx#L7) |
| Menu & Footer Links | Navigation | Click | Điều hướng theo route React Router | `LandingNavbar`, `LandingFooter` |

---

## 5. DATA SPECIFICATION

- Toàn bộ nội dung là văn bản tĩnh (Static Marketing Copy), không có trường nhập liệu hoặc form.

---

## 6. BACKEND MAPPING & EVIDENCE

- **Backend API:** `NONE`.
- Màn hình thuần túy là nội dung quảng bá tĩnh ở Frontend.

---

## 7. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá UX | Khuyến nghị thiết kế lại |
|---|---|---|
| **Thiếu Call To Action (CTA) Button Rõ Ràng** | Cuối trang giải pháp không có nút hành động cụ thể nào (ví dụ: "Đăng ký làm tài xế ngay" hoặc "Mở bản đồ tìm bãi"), người dùng đọc xong không có bước tiếp theo. | Bổ sung nút CTA lớn cuối trang: "Bắt đầu tìm bãi đỗ ngay" (link tới `/parking`) và "Tạo tài khoản tài xế" (link tới `/register`). |
| **Nội dung còn ngắn gọn, thiếu lời chứng thực (Testimonials)** | Chỉ có 1 khối ảnh và 3 gạch đầu dòng, chưa đủ độ thuyết phục đối với tài xế mới. | Thêm khối Đánh giá của các tài xế thực tế, bảng so sánh giữa đỗ xe truyền thống vs sử dụng SmartTruck, và danh mục các tiện ích tiêu chuẩn tại bãi. |
