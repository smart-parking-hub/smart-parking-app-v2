# Screen Specification: SCR-019 DriverPaymentsPage (Lịch sử thanh toán)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-019`
- **Screen Name:** Lịch sử giao dịch thanh toán & Hóa đơn điện tử (Driver Payment History)
- **Module:** `MOD-03: Driver Operations Portal`
- **Route URL:** `/payments` (Định nghĩa tại [`AppRoutes.tsx:74`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L74) bọc bởi `LandingLayout`)
- **Primary Component:** `smart-parking-app/src/features/payments/pages/DriverPaymentsPage.tsx`
- **Sub-components:** Ant Design `Table`, `Tag`, `Skeleton`
- **Access Role:** `ROLE_DRIVER` (Yêu cầu tài xế đăng nhập)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Cung cấp sổ cái tài chính minh bạch cho tài xế và doanh nghiệp vận tải:
1. Tổng hợp mọi giao dịch tiền tệ phát sinh trong quá trình đỗ xe: Tiền cọc giữ chỗ (`DEPOSIT`), Khoản thanh toán cuối cùng (`FINAL_PAYMENT`), Phí phạt quá giờ (`PENALTY`), và Tiền hoàn trả khi hủy booking (`REFUND`).
2. Thống kê tổng số tiền tài xế đã chi trả qua hệ thống để phục vụ đối soát chi phí công tác và xuất hóa đơn công ty.
3. Cung cấp mã giao dịch PayOS và mã đặt chỗ liên kết để làm bằng chứng xác thực khi có tranh chấp hoặc khiếu nại với chủ bãi.

### B. Target Users
- Tài xế cần kiểm tra lại biên lai thanh toán, đối soát chi phí nhiên liệu/bến bãi với kế toán đội xe.

### C. Entry Points
- Click "Thanh toán" trên `LandingNavbar`.
- Click từ liên kết lịch sử thanh toán trên `DashboardHomePage` (`SCR-014`).

### D. Exit Points
- Click mã booking: Điều hướng sang chi tiết vé tại `/bookings` (`SCR-017`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Tổng Thể
- Header phân hệ: Tiêu đề H1 `Thanh toán & hóa đơn`, mô tả chi tiết, và Thẻ tóm tắt tổng chi tiêu (`.payment-total`):
  - Nhãn: `Tổng đã thanh toán`.
  - Con số lớn: `{formatMoney(total)}` (ví dụ: `1.450.000 ₫`).
- Thanh lọc tìm kiếm (`.payment-filters`):
  - Ô tìm kiếm: Nhập mã giao dịch PayOS hoặc mã booking (`bookingCode`).
  - Dropdown lọc trạng thái: `Tất cả trạng thái`, `Thành công` (`SUCCESS`), `Đang xử lý` (`PENDING`), `Thất bại` (`FAILED`).
  - Đếm số lượng: `{visible.length} giao dịch`.
- Bảng dữ liệu giao dịch Ant Design `Table`.

### B. Cấu Trúc Các Cột Dữ Liệu Bảng (Table Columns)
1. **Mã GD:** Hiển thị mã `transactionCode` hoặc `id` giao dịch.
2. **Booking liên kết:** Mã booking dạng link hoặc text `#BK-...`.
3. **Loại giao dịch:** Nhãn tiếng Việt tương ứng: `Tiền cọc`, `Thanh toán cuối`, `Phí quá giờ`, `Hoàn tiền`.
4. **Số tiền:** Định dạng tiền tệ VND in đậm (ví dụ: `50.000 ₫`).
5. **Phương thức:** Tag phương thức thanh toán (`Cổng PayOS` / `Tiền mặt tại cổng`).
6. **Trạng thái:**
   - `SUCCESS`: Tag xanh lá `Thành công`.
   - `PENDING`: Tag màu cam `Đang xử lý`.
   - `FAILED`: Tag màu đỏ `Thất bại`.
7. **Thời gian:** Ngày giờ tạo giao dịch (`dd/MM/yyyy HH:mm`).

---

## 4. INTERACTION & BACKEND MAPPING

### A. Tương Tác
- Tìm kiếm tức thì khi gõ ký tự vào ô tìm kiếm.
- Lọc tức thì theo trạng thái.
- Click hàng giao dịch để xem chi tiết đối soát.

### B. Backend API Mapping
- **Endpoint:** `GET /api/v1/payments/my`
- **Controller:** [`PaymentController.java:36`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/PaymentController.java#L36) (`getMyPayments`)
- **Quyền hạn:** `@PreAuthorize("hasRole('DRIVER')")`
- **Entity nguồn:** Bảng `payments` liên kết với `bookings` và `users`.

---

## 5. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá Kỹ thuật / UX | Khuyến nghị thiết kế lại |
|---|---|---|
| **Chưa hỗ trợ xuất file hóa đơn (Export Excel / PDF)** | Tài xế doanh nghiệp bắt buộc phải nộp hóa đơn/biên lai điện tử về cho kế toán để thanh toán công tác phí. | Bổ sung nút "Xuất báo cáo Excel / PDF" và nút "Tải biên lai thanh toán PDF" cho từng giao dịch thành công. |
| **Bảng chưa có phân trang Server-side** | Code hiện tại tải danh sách một lần và lọc client-side. Nếu tài xế có hàng trăm giao dịch sẽ làm chậm ứng dụng. | Cấu hình phân trang Server-side (`page`, `size`) kết hợp sắp xếp theo thời gian mới nhất. |
