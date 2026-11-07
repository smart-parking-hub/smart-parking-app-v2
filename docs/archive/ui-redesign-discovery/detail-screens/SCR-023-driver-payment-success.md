# Screen Specification: SCR-023 PaymentReturnPage (Kết quả thanh toán thành công)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-023`
- **Screen Name:** Xác nhận & Đồng bộ kết quả thanh toán PayOS thành công (Payment Success Callback)
- **Module:** `MOD-03: Driver Operations Portal`
- **Route URL:** `/payment/success` (Định nghĩa tại [`AppRoutes.tsx:78`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L78) render `<PaymentReturnPage mode="success" />`)
- **Primary Component:** [`PaymentReturnPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/payments/pages/PaymentReturnPage.tsx)
- **Sub-components:** Ant Design `Result`, `Spin`, `Button`, `Alert`
- **Access Role:** `ROLE_DRIVER` (Kiểm tra session; nếu chưa đăng nhập hoặc role không phải DRIVER, tự động chuyển hướng sang `/login` kèm redirect state)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Tiếp nhận chuyển hướng (redirect return URL) của tài xế sau khi hoàn tất thanh toán tiền cọc hoặc tiền bãi trên cổng thanh toán trực tuyến PayOS.
2. Xử lý bài toán bất đồng bộ Webhook: Trong môi trường nội bộ hoặc local dev không có IP tĩnh / public domain, Webhook PayOS không thể bắn trực tiếp vào Backend. Màn hình này đóng vai trò kích hoạt chủ động cơ chế **Đồng bộ trạng thái thanh toán (Active Polling / Sync)** để lập tức cập nhật trạng thái booking sang `PENDING_CHECKIN` (Sẵn sàng check-in) và cấp mã QR.
3. Cung cấp cơ chế dự phòng (Fallback Bypass): Cho phép xác nhận cọc demo (`confirmDemoDeposit`) nếu cổng PayOS gặp sự cố hoặc trong kịch bản kiểm thử không kết nối ngân hàng.

### B. Target Users
- Tài xế vừa quét mã QR ngân hàng hoặc hoàn thành giao dịch trên PayOS và được trình duyệt tự động chuyển về hệ thống SmartParkingHub.

### C. Entry Points
- PayOS tự động chuyển hướng (Redirect) về URL: `/payment/success?code=00&id=...&cancel=false&status=PAID&orderCode=...`.
- Chuyển hướng từ giao dịch demo nội bộ: `/payment/success?simulated=true&bookingId=...`.

### D. Exit Points
- Nút "Về đặt chỗ của tôi": Điều hướng về danh sách booking tại `/bookings` (`SCR-017`) để xem mã QR check-in và chi tiết chỗ đỗ.

---

## 3. UI STRUCTURE & LAYOUT

Màn hình được thiết kế tập trung, không thanh bên, độ rộng tối đa 640px căn giữa màn hình (`margin: 48px auto`). Bố cục thay đổi linh hoạt theo 3 trạng thái đồng bộ:

### A. Trạng Thái Đang Đồng Bộ (Syncing State)
- Biểu tượng xoay lớn `Spin size="large"`.
- Dòng chữ thông báo: `Đang đồng bộ thanh toán PayOS với hệ thống…`.

### B. Trạng Thái Thành Công (Success State)
- Component Ant Design `Result status="success"`:
  - Tiêu đề: `Thanh toán thành công`.
  - Phụ đề: `Đã ghi nhận thanh toán thành công. Booking đã sẵn sàng check-in.`
  - Nút bấm chính: `Về đặt chỗ của tôi` (Primary Button, điều hướng về `/bookings`).

### C. Trạng Thái Chờ / Lỗi / Cần Xác Nhận Demo (Pending / Error State)
- Component Ant Design `Result status="warning"` hoặc `Result status="error"`:
  - Tiêu đề: `Chưa ghi nhận xong` hoặc `Không đồng bộ được`.
  - Phụ đề: Thông báo chi tiết lỗi từ API.
  - Nhóm nút bấm:
    - Nút Primary `Xác nhận thanh toán demo (Kích hoạt QR ngay)`: Kêu gọi API `confirmDemoDeposit` để giải phóng booking ngay lập tức.
    - Nút `Thử đồng bộ lại`: Gọi lại hàm `runSync()`.
    - Nút `Về đặt chỗ`: Điều hướng về `/bookings`.
- Khối `Alert type="info"`:
  - Tiêu đề: `Mẹo môi trường dev / local`.
  - Nội dung: `Nếu bạn đang chạy local hoặc kênh PayOS đang tạm dừng, hãy bấm Xác nhận thanh toán demo để kích hoạt trạng thái cọc và mã QR check-in ngay mà không cần qua cổng ngân hàng.`

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-023-01** | Kiểm tra phân quyền truy cập | Tự động khi tải trang | `getAuthSession()` | Phải đăng nhập vai trò DRIVER | Nếu không phải DRIVER, chuyển hướng sang `/login` kèm `from` state |
| **FN-023-02** | Tự động đồng bộ PayOS | Tự động khi có URL params | `orderCode`, `paymentLinkId`, `bookingId` | Có thông tin giao dịch PayOS | Gọi API sync PayOS, nếu thành công chuyển UI sang màu xanh và xóa session |
| **FN-023-03** | Xác nhận cọc demo khẩn cấp | Click `Xác nhận thanh toán demo` | `bookingId` từ param hoặc sessionStorage | Giao dịch đang chờ hoặc cổng PayOS lỗi | Chuyển booking sang `PENDING_CHECKIN`, thông báo thành công |
| **FN-023-04** | Thử lại đồng bộ | Click `Thử đồng bộ lại` | Thông tin params hiện tại | Chưa sync thành công | Kích hoạt lại luồng gọi `syncPayOSPayment` |
| **FN-023-05** | Về trang đặt chỗ | Click `Về đặt chỗ của tôi` | Không | Không | Điều hướng về `/bookings` (`SCR-017`) |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `POST /api/v1/bookings/{id}/sync-payos`: Gọi PayOS SDK phía backend để lấy trạng thái thanh toán mới nhất của payment link và cập nhật vào entity `Booking`.
2. `POST /api/v1/bookings/{id}/demo-deposit`: Chuyển trạng thái booking sang `PENDING_CHECKIN` trực tiếp (chế độ demo).

### B. Controller & Method
- [`BookingController.java:82-95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/BookingController.java#L82-L95)
  - `syncPayos(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long id)`: `@PreAuthorize("hasRole('DRIVER')")`
  - `demoDeposit(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long id)`: `@PreAuthorize("hasRole('DRIVER')")`

### C. Service Implementation
- [`BookingServiceImpl.java`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/BookingServiceImpl.java)
  - Đối soát mã `orderCode` với PayOS API.
  - Nếu PayOS xác nhận đã thanh toán: Cập nhật `BookingStatusEnum.PENDING_CHECKIN`, sinh mã QR check-in duy nhất, tạo bản ghi `Payment` với `status = SUCCESS`, tạo thông báo `Notification` cho tài xế.

---

## 6. UI STATES & ERROR HANDLING

- **Idle/Syncing:** Hiển thị `Spin` loading.
- **Cancelled từ PayOS:** Nếu URL có tham số `cancel=true` hoặc `status=CANCELLED`, hiển thị giao diện đã hủy thanh toán.
- **Pending:** Giao dịch ngân hàng đang treo hoặc chưa trừ tiền, hiển thị nút thử lại và nút demo bypass.
- **Error:** Không tìm thấy mã booking hoặc lỗi mạng, hiển thị chi tiết lỗi kèm hướng dẫn mở `/bookings` để sync.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Fallback Sync:** Bắt buộc phải duy trì cơ chế gọi API sync chủ động khi redirect về, vì mạng di động của tài xế xe tải thường xuyên chập chờn hoặc webhook PayOS bị trễ.
2. **Xóa `sessionStorage`:** Phải dọn sạch `payos.pendingBookingId` sau khi thanh toán thành công để tránh lỗi ghi đè dữ liệu ở các lần booking kế tiếp.

### B. Đề Xuất Cải Thiện
1. **Tự động chuyển hướng (Auto-redirect Countdown):** Sau khi hiển thị thanh toán thành công 3 giây, nên có bộ đếm ngược tự động chuyển về `/bookings` để tài xế không phải bấm thêm nút.
2. **Hiển thị trực tiếp mã QR:** Tải luôn mã QR check-in ngay trên màn hình thành công này để tài xế đưa cho bảo vệ quét ngay tại cổng bãi.
