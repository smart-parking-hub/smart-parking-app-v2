# Screen Specification: SCR-017 MyBookingsPage (Quản lý đặt chỗ & Vé QR)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-017`
- **Screen Name:** Quản lý danh sách đặt chỗ & Vé đỗ xe điện tử QR (Driver Bookings & QR Ticket)
- **Module:** `MOD-03: Driver Operations Portal`
- **Route URL:** `/bookings` (Định nghĩa tại [`AppRoutes.tsx:72`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L72) bọc bởi `LandingLayout`)
- **Primary Component:** `smart-parking-app/src/features/bookings/pages/MyBookingsPage.tsx`
- **Sub-components:**
  - `CancelBookingModal`: `smart-parking-app/src/features/bookings/components/CancelBookingModal.tsx` (`SCR-MOD-03`)
  - `ReviewModal`: `smart-parking-app/src/features/reviews/components/ReviewModal.tsx` (`SCR-MOD-02`)
  - `QRCodeSVG`: Thư viện `qrcode.react` tạo mã QR vector chuẩn
  - Ant Design `Select`, `Skeleton`, `Empty`
- **Access Role:** `ROLE_DRIVER` (Yêu cầu tài xế đăng nhập)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Là trung tâm quản lý giao dịch và sử dụng vé của tài xế:
1. Quản lý toàn bộ vòng đời của một lượt đỗ xe (Booking Lifecycle) qua 9 trạng thái: `PENDING_PAYMENT`, `PENDING_CHECKIN`, `PARKING`, `OVERTIME`, `AWAITING_FINAL_PAYMENT`, `COMPLETED`, `CANCELLED`, `EXPIRED`, `REVIEWED`.
2. Hiển thị Vé QR Check-in/Check-out sắc nét, cho phép xuất ảnh PNG chất lượng cao để tài xế lưu offline trên điện thoại xuất trình khi vào bãi không có sóng 4G.
3. Thanh toán tiền cọc giữ chỗ 10 phút và quyết toán khoản tiền cuối qua cổng thanh toán PayOS.
4. Tự động đồng bộ hóa trạng thái giao dịch với PayOS (`syncPayOSPayment`), xử lý triệt để trường hợp Webhook bị chậm hoặc rớt gói tin.
5. Cho phép hủy đặt chỗ và nhận hoàn tiền cọc tự động nếu hủy trước thời hạn quy định (Cancellation Window).
6. Đánh giá chất lượng bãi xe (1-5 sao và nhận xét) sau khi hoàn tất chuyến đi.

### B. Target Users
- Tài xế đã đặt chỗ, đang trên đường đến bãi, đang đỗ xe trong bãi hoặc cần xem lại lịch sử vé.

### C. Entry Points
- Click "Đặt chỗ của tôi" trên `LandingNavbar` hoặc menu `DashboardLayout`.
- Click thẻ "Tổng lượt đặt chỗ" hoặc "Chuyến đang hoạt động" trên `DashboardHomePage` (`SCR-014`).
- Tự động chuyển tới sau khi hoàn tất đặt giữ chỗ từ `SCR-015` hoặc `SCR-016`.
- Tự động chuyển tới sau khi thanh toán PayOS thành công từ `SCR-023`.

### D. Exit Points
- Nút "Chỉ đường": Mở Google Maps dẫn đường tới cổng bãi.
- Nút "Thanh toán cọc / Thanh toán cuối": Chuyển hướng tới Cổng thanh toán PayOS.
- Nút "Đánh giá bãi đỗ": Mở modal `SCR-MOD-02: ReviewModal`.
- Nút "Hủy đặt chỗ": Mở modal `SCR-MOD-03: CancelBookingModal`.

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Master-Detail Hai Cột
- **Thanh công cụ lọc trên cùng:**
  - Ô input tìm kiếm: Hỗ trợ tìm kiếm thời gian thực theo mã booking (`bookingCode`), tên bãi xe (`parkingLotName`), hoặc biển số xe (`vehicleLicensePlate`).
  - Dropdown lọc trạng thái (`Select`): `Tất cả`, `Chờ thanh toán`, `Chờ check-in`, `Đang đỗ`, `Quá giờ`, `Chờ thanh toán cuối`, `Hoàn tất`, `Đã hủy`, `Hết hạn`.
- **Cột Trái (Danh Sách Đặt Chỗ - 35% width):**
  - Danh sách thẻ booking cuộn dọc. Mỗi thẻ gồm: Mã booking in đậm (`#BK-...`), Tag trạng thái màu, Tên bãi đỗ, Biển số xe, Ngày giờ dự kiến. Thẻ đang chọn có viền nổi bật.
- **Cột Phải (Chi Tiết Vé Điện Tử - 65% width):**
  - **Khối Mã QR Check-in/Check-out:** Mã QR SVG kích thước lớn (200x200px) tạo từ chuỗi `bookingCode`. Bên dưới là nút **"Tải ảnh QR (PNG)"** kèm icon `<Download />`.
  - **Thanh Tiến Trình (4-Step Progress Bar):**
    `Giữ chỗ 10p ──► Đã cọc & Có vé QR ──► Đang đỗ tại bãi ──► Hoàn tất & Quyết toán`.
  - **Thông tin chi tiết hành trình:** Tên bãi đỗ, Địa chỉ bãi xe, Biển số phương tiện, Loại xe, Giờ bắt đầu, Giờ kết thúc dự kiến, Giờ check-in thực tế, Giờ check-out thực tế.
  - **Bảng Kê Tài Chính Chi Tiết:**
    - Tiền cọc đã thanh toán: `depositAmount` (VND).
    - Tổng chi phí thực tế: `totalAmount` (VND).
    - Phí phạt quá giờ (nếu có): `penaltyAmount` (VND).
    - Số tiền còn phải trả: `remainingAmount` (VND).
  - **Cụm Nút Hành Động Động (Dynamic Action Buttons):**
    - Nếu `PENDING_PAYMENT`: Nút màu cam **"Thanh toán cọc qua PayOS (Giữ trong 10 phút)"** (hoặc nút "Xác nhận cọc demo" trong môi trường test).
    - If `AWAITING_FINAL_PAYMENT`: Nút màu xanh **"Thanh toán khoản cuối qua PayOS"**.
    - If `PENDING_CHECKIN`: Nút màu đỏ viền mỏng **"Hủy đặt chỗ"** (mở `SCR-MOD-03`) và Nút **"Chỉ đường Google Maps"**.
    - If `COMPLETED`: Nút màu vàng **"Đánh giá bãi đỗ"** (mở `SCR-MOD-02`).

---

## 4. INTERACTION SPECIFICATION

| Phần Tử Giao Diện | Loại UI | Hành Động | Xử Lý Frontend | API Được Gọi | Kết Quả / UI State |
|---|---|---|---|---|---|
| **Chọn Booking Trong List** | Card | Click | Set `selected` booking tương ứng | Không gọi API | Cột phải render lại chi tiết vé và mã QR của booking đó |
| **Nút "Tải ảnh QR (PNG)"** | Button | Click | Render SVG sang Canvas, tạo blob PNG và kích hoạt tải về máy | Không gọi API | Tệp `ve-xe-[bookingCode].png` được tải về máy tài xế |
| **Nút "Thanh toán cọc"** | Button | Click | Bật `paying=true`, gọi API lấy link checkout PayOS | `POST /api/v1/bookings/{id}/pay-deposit` | Nhận `checkoutUrl`, mở cổng thanh toán PayOS |
| **Nút "Thanh toán khoản cuối"**| Button | Click | Bật `paying=true`, gọi API lấy link thanh toán cuối | `POST /api/v1/bookings/{id}/pay-final` | Nhận `checkoutUrl`, mở cổng thanh toán PayOS |
| **Nút "Hủy đặt chỗ"** | Button | Click | Mở modal hủy `CancelBookingModal` | Không gọi API | Mở modal `SCR-MOD-03` |
| **Xác nhận hủy trong Modal** | Modal Form| Submit lý do | Bật `cancelling=true`, gọi API hủy booking | `POST /api/v1/bookings/{id}/cancel`<br>`Body: { reason, bankAccount... }` | Booking chuyển `CANCELLED`, hoàn cọc (nếu đủ điều kiện), tải lại danh sách |
| **Nút "Đánh giá bãi đỗ"** | Button | Click | Mở modal `ReviewModal` | Không gọi API | Mở modal `SCR-MOD-02` |
| **Tự động đồng bộ PayOS** | Background| Khi tải trang | Kiểm tra các booking `PENDING_PAYMENT` / `AWAITING_FINAL_PAYMENT` | `POST /api/v1/bookings/{id}/sync-payos` | Cập nhật tự động nếu tiền đã vào PayOS |

---

## 5. BACKEND MAPPING & EVIDENCE

### A. Controller Endpoints
- **Lấy danh sách booking:** `GET /api/v1/bookings` -> [`BookingController.java:37`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/BookingController.java#L37)
- **Thanh toán cọc PayOS:** `POST /api/v1/bookings/{id}/pay-deposit` -> [`BookingController.java:55`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/BookingController.java#L55)
- **Thanh toán cuối PayOS:** `POST /api/v1/bookings/{id}/pay-final` -> [`BookingController.java:62`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/BookingController.java#L62)
- **Hủy đặt chỗ:** `POST /api/v1/bookings/{id}/cancel` -> [`BookingController.java:69`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/BookingController.java#L69)
- **Đồng bộ thanh toán PayOS:** `POST /api/v1/bookings/{id}/sync-payos` -> [`BookingController.java:83`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/BookingController.java#L83)

### B. Business Logic & Validation
- **Thời hạn giữ chỗ 10 phút (Hold TTL 10m):** `Booking.java` có trường `holdExpiresAt`. Nếu tài xế không thanh toán cọc trong 10 phút, hệ thống tự động hủy booking (`status = EXPIRED`) và giải phóng slot về trạng thái khả dụng.
- **Chính sách hủy cọc:** Hủy trước giờ check-in tối thiểu 1 tiếng (`cancelDeadlineAt`), tài xế được hoàn 100% tiền cọc. Nếu hủy sát giờ (< 1 tiếng), tiền cọc bị giữ lại làm phí bồi thường cho chủ bãi.

---

## 6. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá Kỹ thuật / UX | Khuyến nghị thiết kế lại |
|---|---|---|
| **Chưa có đồng hồ đếm ngược trực quan cho hạn giữ chỗ 10 phút** | Booking ở trạng thái `PENDING_PAYMENT` chỉ ghi thời hạn dạng text, tài xế không biết mình còn bao nhiêu phút bao nhiêu giây trước khi bị hủy booking. | Bổ sung thanh đếm ngược thời gian thực (Countdown Timer: ví dụ `08:45`) nhấp nháy màu đỏ khi còn dưới 2 phút trên thẻ vé. |
| **Tự động gọi API `sync-payos` lặp lại trên danh sách** | Hàm `loadBookings` lọc các booking bị treo rồi gọi `syncPayOSPayment` song song qua `Promise.allSettled`, có thể làm tăng tải backend nếu mạng chậm. | Tích hợp Server-Sent Events (SSE) hoặc WebSocket để backend đẩy trực tiếp sự kiện thanh toán thành công về client ngay khi PayOS gửi Webhook. |
