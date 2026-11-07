# Screen Specification: SCR-025 NotificationsPage (Trung tâm thông báo tài xế)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-025`
- **Screen Name:** Trung tâm thông báo hệ thống tài xế (Driver Notifications Center)
- **Module:** `MOD-03: Driver Operations Portal`
- **Route URL:** `/notifications` (Định nghĩa tại [`AppRoutes.tsx:80`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L80) bọc bởi `LandingLayout`)
- **Primary Component:** [`NotificationsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/notifications/pages/NotificationsPage.tsx)
- **Sub-components:** Ant Design `Segmented`, `Skeleton`, `Empty`
- **Access Role:** `ROLE_DRIVER` (Yêu cầu tài xế đăng nhập)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cung cấp kênh thông báo tập trung, thời gian thực cho tài xế về toàn bộ diễn biến vòng đời đặt chỗ, thanh toán, phương tiện và hàng đợi ảo.
2. Đóng vai trò then chốt trong tính năng Hàng đợi ảo: Thông báo cho tài xế biết ngay khi có chỗ trống tại bãi đỗ với bộ đếm thời gian phản hồi 15 phút.
3. Nhắc nhở các sự kiện quan trọng: Booking sắp hết hạn giữ chỗ (Hold TTL), xác nhận check-in/check-out thành công, cảnh báo phí phát sinh do đỗ quá giờ (Overstay Penalty).

### B. Target Users
- Tài xế đang điều khiển xe trên đường hoặc đang chờ nhận chỗ đỗ.

### C. Entry Points
- Click biểu tượng Chuông thông báo (Bell Icon) trên Navbar ở bất kỳ màn hình nào.
- Điều hướng trực tiếp đến đường dẫn `/notifications`.

### D. Exit Points
- Click vào từng dòng thông báo: Điều hướng theo ngữ cảnh (Deep-linking):
  - Thông báo Đặt chỗ (`BOOKING`): Chuyển đến `/bookings` (`SCR-017`).
  - Thông báo Hàng đợi (`QUEUE`): Chuyển đến `/queues` (`SCR-018`).
  - Thông báo Thanh toán (`PAYMENT`): Chuyển đến `/payments` (`SCR-019`).
  - Thông báo Bãi đỗ (`PARKING_LOT`): Chuyển đến `/parking` (`SCR-015`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Khối Thông Báo
- Khối thông tin bên trái:
  - Nhãn: `TRUNG TÂM THÔNG BÁO`.
  - Tiêu đề H1: `Thông báo`.
  - Mô tả phụ: `Cập nhật booking, thanh toán, phương tiện và hàng đợi.`
- Nút hành động bên phải:
  - Nút text: `Đánh dấu tất cả đã đọc`. Vô hiệu hóa (`disabled`) khi không có thông báo chưa đọc (`unread === 0`).

### B. Thanh Công Cụ Bộ Lọc (.notification-toolbar)
- Thanh chuyển đổi Ant Design `Segmented`:
  - `Tất cả ({total})`: Hiển thị toàn bộ lịch sử thông báo.
  - `Chưa đọc ({unread})`: Chỉ lọc các thông báo chưa đọc (`readAt === null`).

### C. Danh Sách Thông Báo (.notification-list)
- Mỗi thông báo là một thẻ `.notification-item` (nếu chưa đọc thì có class `.unread`):
  - Phần đầu (`.notification-leading`):
    - Chấm tròn xanh chỉ thị chưa đọc (`.unread-dot`).
    - Khối icon đại diện theo loại (`.notification-icon`):
      - `BOOKING`: Icon `CircleParking` (màu xanh dương).
      - `VEHICLE`: Icon `AlertTriangle` (màu vàng hổ phách).
      - `PAYMENT`: Icon `ReceiptText` (màu xanh lá).
      - `QUEUE`: Icon `List` (màu tím).
      - `SYSTEM`: Icon `Info` (màu xám).
  - Phần nội dung (`.notification-copy`):
    - Dòng tiêu đề H2 và thời gian gửi (`timeLabel`, định dạng `dd/MM/yyyy HH:mm`).
    - Nội dung chi tiết thông báo (`p`).
    - Nút hành động theo ngữ cảnh (nếu có `actionLabel`, ví dụ: `Xem chi tiết`).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-025-01** | Xem danh sách thông báo | Mở trang `/notifications` | Token tài xế, page=0, size=20 | Đã đăng nhập DRIVER | Hiển thị danh sách thông báo mới nhất kèm số lượng chưa đọc |
| **FN-025-02** | Lọc thông báo chưa đọc | Chuyển tab `Chưa đọc` trên Segmented | Giá trị tab `UNREAD` | Có thông báo | Lọc danh sách chỉ giữ các thông báo chưa đọc |
| **FN-025-03** | Đánh dấu 1 thông báo đã đọc | Click vào thẻ thông báo | ID thông báo | Thông báo đang chưa đọc | Gọi API đánh dấu đọc, đổi trạng thái UI, điều hướng sang màn hình liên kết |
| **FN-025-04** | Đánh dấu tất cả đã đọc | Click `Đánh dấu tất cả đã đọc` | Không | `unread > 0` | Gọi API đánh dấu đọc toàn bộ, cập nhật số đếm về 0, bỏ chấm xanh |
| **FN-025-05** | Điều hướng theo hành động | Click nút `Xem chi tiết` | `actionPath` từ item | Item có định nghĩa đích đến | Chuyển trang đúng luồng nghiệp vụ tương ứng |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `GET /api/v1/notifications`: Lấy danh sách thông báo phân trang của người dùng.
2. `GET /api/v1/notifications/unread-count`: Đếm số lượng thông báo chưa đọc để hiển thị badge.
3. `POST /api/v1/notifications/{id}/read`: Đánh dấu đã đọc một thông báo cụ thể.
4. `POST /api/v1/notifications/read-all`: Đánh dấu đã đọc toàn bộ thông báo.

### B. Controller & Method
- [`NotificationController.java:23-53`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/NotificationController.java#L23-L53)
  - Tất cả các endpoint đều có quyền `@PreAuthorize("isAuthenticated()")`.

### C. Service Implementation
- [`NotificationServiceImpl.java`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/NotificationServiceImpl.java)
  - `send(userId, title, content, type, targetType, targetId)`: Được gọi tự động từ:
    - `BookingServiceImpl`: Đặt chỗ, hủy chỗ, check-in, check-out, hết hạn hold.
    - `PaymentServiceImpl`: Thanh toán cọc, thanh toán tất toán thành công.
    - `QueueServiceImpl`: Có slot trống cho hàng đợi ảo, hủy hàng đợi.
  - Cập nhật trường `readAt = LocalDateTime.now()` khi người dùng đọc thông báo.

### D. DTO & Entity
- DTO: `NotificationDto`, `PageResponse<NotificationDto>`
- Entity: [`Notification.java`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/entity/Notification.java)

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Hiển thị component Ant Design `Skeleton active`.
- **Empty State:**
  - Tab "Tất cả": Ant Design `Empty description="Bạn chưa có thông báo"`.
  - Tab "Chưa đọc": Ant Design `Empty description="Bạn đã đọc tất cả thông báo"`.
- **Error Handling:** Bắt ngoại lệ và log console, hiển thị mảng rỗng an toàn tránh crash trang.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Khả năng Deep-linking:** Khi tài xế click vào thông báo (đặc biệt là thông báo hàng đợi có slot), hệ thống bắt buộc phải dẫn thẳng đến trang xử lý để tài xế kịp phản hồi trước khi hết hạn 15 phút.
2. **Số đếm chưa đọc (Badge Counter):** Phải duy trì cập nhật real-time hoặc định kỳ để tài xế không bỏ lỡ tin quan trọng.

### B. Đề Xuất Cải Thiện
1. **Web Push Notification / Sound:** Bổ sung âm thanh cảnh báo hoặc thông báo đẩy trình duyệt (Web Push) khi bãi đỗ có slot trống cho hàng đợi, giúp tài xế kịp thời biết ngay cả khi đang chuyển sang tab khác.
2. **Phân trang / Tải thêm (Infinite Scroll):** Hiện tại UI chỉ tải trang đầu 20 bản ghi; cần hỗ trợ cuộn vô hạn để xem các thông báo cũ hơn.
