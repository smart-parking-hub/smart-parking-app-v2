# Screen Specification: SCR-018 DriverQueuesPage (Hàng đợi ảo)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-018`
- **Screen Name:** Danh sách hàng đợi ảo thông minh (Driver Virtual Queues)
- **Module:** `MOD-03: Driver Operations Portal`
- **Route URL:** `/queues` (Định nghĩa tại [`AppRoutes.tsx:73`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L73) bọc bởi `LandingLayout`)
- **Primary Component:** `smart-parking-app/src/features/queues/pages/DriverQueuesPage.tsx`
- **Sub-components:** Ant Design `Segmented`, `Popconfirm`, `Skeleton`, `Empty`
- **Access Role:** `ROLE_DRIVER` (Yêu cầu tài xế đăng nhập)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Cung cấp giải pháp xếp hàng số thông minh (Virtual Queue System) khi bãi đỗ xe đã hết chỗ trống vật lý:
1. Giải phóng tài xế khỏi việc phải đỗ xe chờ đợi tràn lan ngoài lề đường gây cản trở giao thông và bị phạt tiền.
2. Cho phép tài xế đăng ký xếp hàng từ xa khi bãi xe đầy slot cho loại phương tiện của mình.
3. Theo dõi số thứ tự xếp hàng thời gian thực (`position`) và số lượng tài xế đang chờ phía trước (`peopleAhead`).
4. Khi có xe khác check-out giải phóng slot, hệ thống tự động thông báo đến tài xế đứng đầu (`NOTIFIED`) kèm thời hạn phản hồi xác nhận (15 phút).
5. Cho phép tài xế bấm "Nhận slot" để tự động chuyển thành Booking chính thức, hoặc bấm "Từ chối" / "Rời hàng đợi" để nhường chỗ cho người tiếp theo.

### B. Target Users
- Tài xế chuẩn bị đến bãi nhưng thấy bãi hết chỗ và muốn đăng ký suất ưu tiên tiếp theo.

### C. Entry Points
- Click "Hàng đợi" trên `LandingNavbar` hoặc menu cá nhân.
- Tự động chuyển hướng sang sau khi bấm "Tham gia hàng đợi ảo" tại `ParkingDetailPage` (`SCR-016`).

### D. Exit Points
- Nút "Tìm bãi khác": Điều hướng sang `/parking` (`SCR-015`).
- Nút "Nhận slot": Tạo booking thành công, chuyển hướng sang `/bookings` (`SCR-017`) để trả tiền cọc.
- Nút "Rời hàng đợi": Hủy lượt xếp hàng và ở lại trang.

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Tổng Thể
- Header phân hệ: Tiêu đề H1 `Hàng đợi của tôi`, nhãn phụ `HÀNG ĐỢI THÔNG MINH`, mô tả, và nút liên kết màu nổi `Tìm bãi khác` (dẫn tới `/parking`).
- Thanh công cụ (`.queue-toolbar`):
  - Bộ chuyển tab Ant Design `Segmented`: 2 tab `Đang hoạt động` (`ACTIVE`) và `Lịch sử` (`HISTORY`).
  - Ghi chú: *"Dữ liệu vị trí sẽ tự cập nhật khi BE hỗ trợ realtime."*
- Lưới các thẻ hàng đợi (`section.queue-grid`).

### B. Chi Tiết Thẻ Hàng Đợi (`.queue-card`)

#### 1. Thẻ Trạng Thái Đang Chờ (`status === 'WAITING'`)
- Tag trạng thái màu xanh dương: `Đang chờ slot`.
- Nút biểu tượng thùng rác `<Trash2 />` kèm Ant Design `Popconfirm`: Tiêu đề *"Rời hàng đợi?"*, nút *"Rời hàng đợi"* và *"Ở lại"*.
- Tên bãi đỗ xe: H2 `item.parkingLotName`.
- Địa chỉ bãi xe: Icon `<MapPin />` *"Đang chờ slot phù hợp được giải phóng"*.
- **Hộp thông tin vị trí (`.queue-position`):**
  - Icon `<ListOrdered />`.
  - Nhãn: `Vị trí hiện tại`.
  - Số thứ tự in đậm lớn: `#{item.position}` (ví dụ: `#1`, `#2`).
  - Phụ đề: `{item.peopleAhead} tài xế phía trước`.

#### 2. Thẻ Trạng Thái Đã Được Cấp Chỗ (`status === 'NOTIFIED'`)
- Thẻ phát sáng viền xanh lá nổi bật (`.slot-ready`).
- Tag trạng thái màu xanh lá: `Đã có chỗ`.
- Tên bãi đỗ xe: H2 `item.parkingLotName`.
- Địa chỉ: Icon `<MapPin />` *"Bãi vừa dành một slot phù hợp cho bạn"*.
- **Hộp cảnh báo nhận slot (`.queue-ready`):**
  - Icon chuông rung `<BellRing />`.
  - Tiêu đề: `Đã đến lượt bạn!`.
  - Thời hạn phản hồi: `Xác nhận trước {formatDateTime(item.responseDeadline)}`.
- **Cụm 2 nút hành động:**
  - Nút chính: **"Nhận slot"** (Icon `<CheckCircle2 />`, nền xanh lá nổi bật).
  - Nút phụ: **"Từ chối"** (Icon `<XCircle />`, nền xám nhạt).

---

## 4. INTERACTION SPECIFICATION

| Phần Tử Giao Diện | Loại UI | Hành Động | Xử Lý Frontend | API Được Gọi | Kết Quả / UI State |
|---|---|---|---|---|---|
| **Tab Segmented** | Tab Switch | Chọn tab | Đổi state `filter` (`ACTIVE` / `HISTORY`) | Không gọi API | Lọc hiển thị thẻ theo trạng thái |
| **Nút "Rời hàng đợi"** | Popconfirm | Xác nhận rời | Bật `workingId`, gọi API rời hàng đợi | `POST /api/v1/queues/{id}/leave` | Thông báo "Đã rời hàng đợi", tải lại danh sách |
| **Nút "Nhận slot"** | Button | Click | Bật `workingId`, gọi API chấp nhận slot | `POST /api/v1/queues/{id}/accept` | Backend sinh Booking mới, thông báo thành công, điều hướng sang `/bookings` |
| **Nút "Từ chối"** | Button | Click | Bật `workingId`, gọi API từ chối slot | `POST /api/v1/queues/{id}/decline` | Slot được chuyển cho người kế tiếp, thẻ chuyển sang lịch sử |

---

## 5. BACKEND MAPPING & EVIDENCE

### A. Controller Endpoints
- **Lấy danh sách hàng đợi cá nhân:** `GET /api/v1/queues/my` -> [`QueueController.java:34`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/QueueController.java#L34)
- **Nhận slot từ hàng đợi:** `POST /api/v1/queues/{id}/accept` -> [`QueueController.java:41`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/QueueController.java#L41)
- **Từ chối slot:** `POST /api/v1/queues/{id}/decline` -> [`QueueController.java:48`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/QueueController.java#L48)
- **Rời hàng đợi:** `POST /api/v1/queues/{id}/leave` -> [`QueueController.java:55`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/QueueController.java#L55)

### B. Business Logic & Cơ Chế Điều Phối
- Khi một lượt đỗ xe tại bãi thực hiện Check-out giải phóng slot, `BookingServiceImpl.checkout` kích hoạt tìm kiếm tài xế đang ở trạng thái `WAITING` có `position` nhỏ nhất phù hợp loại xe.
- Backend cập nhật bản ghi queue entry sang `NOTIFIED`, thiết lập thời hạn phản hồi `responseDeadline = now + 15 minutes`, và gửi thông báo Notification tới tài xế.
- Nếu tài xế không phản hồi trong 15 phút, hệ thống tự động hết hạn (`EXPIRED`) và chuyển suất cho tài xế tiếp theo.

---

## 6. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá Kỹ thuật / UX | Khuyến nghị thiết kế lại |
|---|---|---|
| **Chưa có cơ chế cập nhật vị trí thời gian thực (Real-time Push)** | Ghi chú trên giao diện nêu rõ: *"Dữ liệu vị trí sẽ tự cập nhật khi BE hỗ trợ realtime."* Tài xế hiện phải tự tải lại trang để biết mình đã lên vị trí số mấy. | Tích hợp WebSocket (STOMP) hoặc SSE để vị trí hàng đợi `#1`, `#2` tự động nhảy số theo thời gian thực khi có người rời hàng hoặc nhận slot. |
| **Thiếu Countdown Timer hiển thị 15 phút phản hồi** | Khi ở trạng thái `NOTIFIED`, thẻ chỉ ghi giờ kết thúc dạng chuỗi, không có đồng hồ đếm lùi trực quan số phút số giây còn lại. | Thêm đồng hồ đếm ngược 15 phút trực quan (ví dụ: `14:20` giảm dần) kèm thanh cảnh báo nhấp nháy đỏ khi còn dưới 3 phút. |
