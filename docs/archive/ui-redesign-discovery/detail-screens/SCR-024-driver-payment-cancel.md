# Screen Specification: SCR-024 PaymentReturnPage Cancel (Hủy thanh toán PayOS)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-024`
- **Screen Name:** Thông báo hủy thanh toán giao dịch PayOS (Payment Cancel Callback)
- **Module:** `MOD-03: Driver Operations Portal`
- **Route URL:** `/payment/cancel` (Định nghĩa tại [`AppRoutes.tsx:79`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L79) render `<PaymentReturnPage mode="cancel" />`)
- **Primary Component:** [`PaymentReturnPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/payments/pages/PaymentReturnPage.tsx)
- **Sub-components:** Ant Design `Result`, `Button`
- **Access Role:** `ROLE_DRIVER` (Nhận chuyển hướng từ PayOS sau khi người dùng bấm Hủy giao dịch)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Tiếp nhận chuyển hướng an toàn khi tài xế chủ động bấm nút "Hủy thanh toán" hoặc "Trở về người bán" trên trang cổng thanh toán PayOS.
2. Thông báo rõ ràng cho tài xế rằng giao dịch thanh toán trực tuyến chưa được thực hiện, tiền trong tài khoản ngân hàng chưa bị trừ.
3. Cho phép tài xế có cơ hội quay lại trang Quản lý đặt chỗ (`/bookings`) để chọn phương thức khác hoặc bấm thử lại thanh toán trước khi thời gian giữ chỗ (Hold TTL 10 phút) kết thúc.

### B. Target Users
- Tài xế đã bấm hủy giao dịch trên giao diện PayOS hoặc đổi ý không muốn thanh toán qua mã QR ngân hàng.

### C. Entry Points
- Cổng PayOS chuyển hướng về khi tài xế bấm hủy thanh toán: `/payment/cancel?code=...&id=...&cancel=true&status=CANCELLED&orderCode=...`.

### D. Exit Points
- Nút "Về đặt chỗ của tôi": Điều hướng về `/bookings` (`SCR-017`).

---

## 3. UI STRUCTURE & LAYOUT

Màn hình được tinh gọn, độ rộng tối đa 640px căn giữa màn hình (`margin: 48px auto`):
- Component Ant Design `Result status="info"`:
  - Biểu tượng: Icon thông tin màu xanh lam (Info Circle).
  - Tiêu đề: `Đã hủy thanh toán`.
  - Phụ đề: `Bạn đã hủy thanh toán trên PayOS.`
  - Nút bấm hành động: Nút Primary `Về đặt chỗ của tôi` (điều hướng sang `/bookings`).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-024-01** | Hiển thị thông báo hủy | Tự động khi truy cập URL | Params từ PayOS (`cancel=true`) | Truy cập URL `/payment/cancel` | Hiển thị trạng thái đã hủy thanh toán |
| **FN-024-02** | Quay lại danh sách đặt chỗ | Click `Về đặt chỗ của tôi` | Không | Không | Điều hướng về `/bookings` (`SCR-017`) để tài xế có thể thanh toán lại |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. Trạng Thái Nghiệp Vụ Tại Backend
- Khi tài xế hủy trên giao diện PayOS, trạng thái booking tại Backend vẫn duy trì `PENDING_PAYMENT` cho đến khi bộ đếm ngược 10 phút (`holdExpiresAt`) kết thúc.
- Nếu tài xế quay lại `/bookings`:
  - Họ có thể bấm lại nút `Thanh toán cọc` để sinh Payment Link PayOS mới nếu còn trong thời gian giữ chỗ.
  - Hoặc bấm `Hủy đặt chỗ` để hủy hoàn toàn và giải phóng slot ngay lập tức.
- Nếu tài xế không làm gì, scheduled task backend `BookingServiceImpl.expirePendingBookings()` sẽ tự động hủy booking sau 10 phút.

---

## 6. UI STATES & ERROR HANDLING

- **Cancelled State:** Trạng thái duy nhất của màn hình này là `state = 'cancelled'`, thông báo thông tin rõ ràng và lịch sự, tránh dùng màu đỏ lỗi gây hoang mang cho người dùng.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Lộ trình quay lại rõ ràng:** Luôn phải có nút đưa tài xế trở về `/bookings` để tiếp tục luồng xử lý hoặc hủy vé.
2. **Không tự ý hủy booking ngay lập tức:** Việc hủy trên PayOS chỉ là hủy phiên giao dịch cổng thanh toán; tài xế vẫn còn quyền thanh toán lại trong thời gian giữ chỗ 10 phút.

### B. Đề Xuất Cải Thiện
1. **Bổ sung nút "Thanh toán lại ngay":** Thay vì chỉ có 1 nút về `/bookings`, có thể cung cấp thêm nút `Thanh toán lại` ngay tại đây để mở lại link thanh toán PayOS mà không cần qua trang trung gian.
2. **Cảnh báo thời gian giữ chỗ còn lại:** Hiển thị bộ đếm ngược thời gian giữ chỗ (ví dụ: *"Bạn còn 06:45 để hoàn tất thanh toán trước khi chỗ đỗ bị hủy"*).
