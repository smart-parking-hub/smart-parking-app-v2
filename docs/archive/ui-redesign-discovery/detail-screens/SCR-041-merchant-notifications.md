# Screen Specification: SCR-041 MerchantNotificationsPage (Trung tâm thông báo)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-041`
- **Screen Name:** Trung tâm thông báo vận hành chủ bãi (Merchant Notifications Center)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/notifications` (Định nghĩa tại [`AppRoutes.tsx:134`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L134) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantNotificationsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/notifications/pages/MerchantNotificationsPage.tsx)
- **Sub-components:** Ant Design `List`, `Badge`, `Button`, `Tag`, `Alert`, `Skeleton`, `Empty`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cung cấp trung tâm tiếp nhận thông báo tập trung theo thời gian thực về mọi biến động quan trọng liên quan đến bãi đỗ của Merchant.
2. Thông báo các sự kiện cốt lõi:
   - **Phê duyệt bãi đỗ (`PARKING_LOT`):** Bãi được Admin duyệt (`APPROVED`), bị từ chối (`REJECTED`) hoặc yêu cầu bổ sung thông tin (`CHANGES_REQUESTED`).
   - **Giao dịch rút tiền (`WITHDRAWAL`):** Lệnh rút tiền được Admin duyệt chi tiền (`PAID`) hoặc bị từ chối (`REJECTED`).
   - **Tranh chấp & Khiếu nại (`DISPUTE`):** Có tài xế gửi khiếu nại mới hoặc Admin vừa ban hành phán quyết.
   - **Đặt chỗ mới (`BOOKING`):** Có khách đặt chỗ hoặc hủy vé giữ chỗ.
3. Hỗ trợ điều hướng ngữ cảnh sâu (Deep-linking) giúp Merchant bấm trực tiếp vào thông báo để chuyển ngay đến màn hình hồ sơ liên quan.

### B. Target Users
- Chủ bãi đỗ xe hoặc nhân viên trực ban theo dõi tin tức bến bãi.

### C. Entry Points
- Click biểu tượng Chuông thông báo trên Header của `MerchantLayout` (hiển thị số đếm badge chưa đọc).
- Click mục "Thông báo" trên Sidebar menu của `MerchantLayout`.

### D. Exit Points
- Click nút `Mở liên quan` trên từng thông báo:
  - Về bãi đỗ: Chuyển sang `/merchant/parking-lots/:id` (`SCR-030`).
  - Về tranh chấp: Chuyển sang `/merchant/disputes/:ticketId` (`SCR-040`).
  - Về rút tiền: Chuyển sang `/merchant/withdrawals` (`SCR-038`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang
- Khối thông tin:
  - Tiêu đề H1: `Thông báo`.
  - Mô tả phụ: `Theo dõi cập nhật duyệt bãi, rút tiền, tranh chấp và hệ thống.`
- Nhóm nút thao tác:
  - Huy hiệu số đếm chưa đọc: Ant Design `Badge count={unreadCount}` bọc nút icon `BellOutlined`.
  - Nút Primary `Đánh dấu tất cả đã đọc` (icon `CheckCircleOutlined`, loading `{markingAll}`, disabled nếu `unreadCount === 0`).

### B. Danh Sách Thông Báo (Notification Feed)
Sử dụng Ant Design `List itemLayout="vertical"` có phân trang 10 mục/trang:
- Mỗi dòng thông báo:
  - Chấm trạng thái chưa đọc: `Badge status="processing"` (màu xanh dương nhấp nháy nếu chưa đọc, màu xám nếu đã đọc).
  - Tiêu đề: Tag màu phân loại sự kiện + Tiêu đề ngắn gọn:
    - `BOOKING`: Tag màu xanh dương `blue`.
    - `PAYMENT`: Tag màu xanh lá `green`.
    - `QUEUE`: Tag màu vàng `gold`.
    - `SYSTEM`: Tag màu xám `default`.
  - Dòng mô tả phụ: Ngày giờ gửi (`dd/MM/yyyy HH:mm`) kèm loại đối tượng đích (`targetType` và `#targetId`).
  - Nội dung thông báo: Đoạn văn bản chi tiết.
  - Nhóm nút hành động bên phải:
    - Nút `Đánh dấu đã đọc` (hoặc nhãn `Đã đọc` nếu đã xem).
    - Nút `Mở liên quan`: Kích hoạt deep-link điều hướng thông minh.

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-041-01** | Xem danh sách thông báo | Mở trang `/merchant/notifications` | Token Merchant, page, size | Đã đăng nhập vai trò MERCHANT | Tải danh sách thông báo mới nhất kèm số lượng chưa đọc |
| **FN-041-02** | Tự động cập nhật số đếm chuông | Tự động chạy nền mỗi 20s | Token Merchant | Đang ở cổng Merchant | Polling cập nhật số badge trên chuông thông báo Header |
| **FN-041-03** | Đánh dấu 1 thông báo đã đọc | Click nút `Đánh dấu đã đọc` | Notification ID | Thông báo chưa đọc | Gọi API đánh dấu đọc, đổi trạng thái UI, giảm số đếm badge |
| **FN-041-04** | Đánh dấu tất cả đã đọc | Click `Đánh dấu tất cả đã đọc` | Không | `unreadCount > 0` | Gọi API đánh dấu đọc toàn bộ, cập nhật số đếm về 0 |
| **FN-041-05** | Điều hướng theo ngữ cảnh | Click nút `Mở liên quan` | `targetType`, `targetId` | Thông báo có đích đến | Đánh dấu đã đọc và chuyển hướng đến trang chi tiết tương ứng |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `GET /api/v1/notifications`: Lấy danh sách thông báo phân trang của người dùng hiện tại.
2. `GET /api/v1/notifications/unread-count`: Đếm số lượng thông báo chưa đọc.
3. `POST /api/v1/notifications/{id}/read`: Đánh dấu đã đọc một thông báo.
4. `POST /api/v1/notifications/read-all`: Đánh dấu đã đọc toàn bộ thông báo.

### B. Controller & Method
- [`NotificationController.java:23-53`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/NotificationController.java#L23-L53):
  - Tất cả các endpoint đều có quyền `@PreAuthorize("isAuthenticated()")`.

### C. Service Implementation
- [`NotificationServiceImpl.java`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/NotificationServiceImpl.java):
  - Lấy danh sách thông báo theo `userId`.
  - Cập nhật trường `readAt = LocalDateTime.now()` khi người dùng đọc tin.
  - Các thông báo gửi tới Merchant được sinh tự động từ:
    - `AdminServiceImpl`: Khi duyệt bãi (`PARKING_LOT`), duyệt rút tiền (`WITHDRAWAL`).
    - `DisputeServiceImpl`: Khi có khiếu nại mới từ tài xế (`DISPUTE`).
    - `BookingServiceImpl`: Khi có đơn đặt chỗ hoặc hủy chỗ (`BOOKING`).

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Component Ant Design `Skeleton active paragraph={{ rows: 8 }}`.
- **Empty State:** Hiển thị `Empty description="Bạn chưa có thông báo nào"`.
- **Polling Tolerance:** Cơ chế Polling chuông thông báo 20 giây một lần được bọc trong khối `catch` an toàn; nếu gặp lỗi mạng thì âm thầm giữ số đếm cũ mà không gây crash giao diện.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Khả năng Deep-linking chính xác:** Khi click mở liên quan, bắt buộc phải dẫn đến đúng bãi đỗ hoặc đúng đơn khiếu nại để chủ bãi nắm bắt sự việc ngay lập tức.
2. **Số đếm chưa đọc cập nhật tự động:** Giúp Merchant luôn kịp thời nhận biết các biến động kinh doanh mà không cần phải tải lại trang thủ công.

### B. Đề Xuất Cải Thiện
1. **Bộ lọc theo phân loại thông báo:** Bổ sung thanh tab lọc nhanh: *Tất cả*, *Duyệt bãi*, *Rút tiền*, *Tranh chấp*, *Hệ thống*.
2. **Web Push / Âm thanh cảnh báo:** Phát chuông hoặc thông báo đẩy trình duyệt khi có lượt xe mới đặt chỗ hoặc có yêu cầu khiếu nại khẩn cấp.
