# Screen Specification: SCR-003 OwnerSolutionsPage (Giải pháp dành cho Chủ bãi)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-003`
- **Screen Name:** Trang giới thiệu giải pháp cho Chủ bãi đỗ (Owner / Merchant Solutions)
- **Module:** `MOD-01: Public Landing & Marketing Website`
- **Route URL:** `/solutions/owners` (Định nghĩa tại [`AppRoutes.tsx:79`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L79))
- **Layout Type:** `LandingLayout` ([`LandingLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingLayout.tsx))
- **Primary Component:** `smart-parking-app/src/features/landing/pages/OwnerSolutionsPage.tsx`
- **Sub-components:** `LandingNavbar`, `LandingFooter`, `framer-motion`
- **Access Role:** Public (Chủ bãi đỗ xe, Doanh nghiệp khai thác mặt bằng, Nhà đầu tư bến bãi)
- **Discovery Status:** `VERIFIED` (Mã nguồn đã kiểm tra đối chiếu)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Cung cấp trang đích chuyên sâu giải quyết bài toán kinh doanh cho **Chủ bãi đỗ xe tải (Merchants)**:
1. Trình bày giá trị của việc chuyển đổi từ quản lý sổ sách/ghi vé tay sang nền tảng số: Tự động hóa kiểm soát xe ra vào bằng QR code, không lo thất thoát doanh thu từ bảo vệ cổng.
2. Giới thiệu các tính năng độc quyền cho bãi xe: Định giá linh hoạt theo khung giờ/ngày lễ, hàng đợi ảo tự động điều phối khi bãi đầy, đối soát tiền tự động vào tài khoản ngân hàng đã đăng ký.
3. Chuyển đổi chủ bãi trở thành đối tác cung ứng trong mạng lưới SmartTruck.

### B. Target Users
- Hộ kinh doanh bãi đỗ xe cá thể.
- Doanh nghiệp logistics sở hữu kho bãi dư thừa sức chứa ngoài giờ.
- Các trung tâm logistics, cảng cạn (ICD), trạm dừng nghỉ cao tốc.

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Tổng Thể
- Container chuẩn (`max-w-max-width-driver mx-auto px-container-padding py-24`).
- Tông màu nhận diện Merchant: Màu Cam đậm thương mại (`#E65100`), tạo sự đối lập rõ ràng với màu Xanh Teal của Tài xế.

### B. Chi Tiết Thành Phần
1. **Khối Tiêu Đề:**
   - Tiêu đề H1: `Giải pháp dành cho Chủ bãi` (Màu cam `#E65100`, font đen đậm).
   - Phụ đề: *"Số hóa bãi đỗ xe của bạn. Quản lý ra vào, doanh thu và tối ưu hóa không gian trống chỉ bằng một phần mềm duy nhất."*
2. **Khối Lợi Ích Quản Lý (2 Cột):**
   - **Cột trái:**
     - Tiêu đề H2: `Tối đa hóa lợi nhuận từng m2`.
     - Mô tả: *"Phần mềm quản lý bãi đỗ của SmartTruck cung cấp cho bạn một trang tổng quan để theo dõi doanh thu hàng ngày, công suất sử dụng bãi và định giá động theo giờ cao điểm."*
     - 3 lợi ích cốt lõi:
       1. Icon `bar_chart`: *Báo cáo doanh thu và phân tích chuyên sâu.*
       2. Icon `price_change`: *Hệ thống định giá động thông minh.*
       3. Icon `account_balance`: *Tự động thanh toán đối soát vào tài khoản ngân hàng.*
   - **Cột phải:** Hình ảnh bãi đỗ xe chuyên nghiệp góc nhìn từ trên cao (Ảnh Unsplash).

---

## 4. INTERACTION & DATA SPECIFICATION

- **Tương tác:** Hiệu ứng `framer-motion` mượt mà khi người dùng cuộn tới.
- **Dữ liệu:** Nội dung tĩnh (Marketing Copy). Không gọi API.

---

## 5. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá UX | Khuyến nghị thiết kế lại |
|---|---|---|
| **Thiếu Form Đăng Ký Tư Vấn / Khảo Sát Bãi** | Chủ bãi thường cần được khảo sát mặt bằng và tư vấn camera quét mã trước khi tham gia hệ thống, nhưng trang này hoàn toàn không có form để lại thông tin liên hệ. | Bổ sung nút CTA "Đăng ký mở bãi ngay" (dẫn sang `/register` với role `MERCHANT`) và Form thu thập thông tin bãi đỗ nhanh (Diện tích, Số slot dự kiến, Địa chỉ). |
| **Thiếu Bảng Tính Ước Tính Doanh Thu (ROI Calculator)** | Chủ bãi rất quan tâm xem đưa bãi lên hệ thống sẽ tăng thêm bao nhiêu tiền mỗi tháng. | Bổ sung công cụ tính toán nhanh: Nhập số chỗ đỗ xe + giá giờ dự kiến -> Tính toán doanh thu tăng thêm ước tính (15-30%/tháng). |
