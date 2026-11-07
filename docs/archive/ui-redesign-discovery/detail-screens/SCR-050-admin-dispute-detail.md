# Đặc Tả Màn Hình SCR-050: AdminDisputeDetailPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-050`
- **Tên màn hình:** Bàn thụ lý & giải quyết tranh chấp (Dispute Investigation Desk)
- **URL Route / Path:** `/admin/disputes/:disputeId` (được cấu hình tại [`AppRoutes.tsx:105`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L105))
- **Quyền truy cập (RBAC):** Bắt buộc Role `ADMIN` ([`AppRoutes.tsx:95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L95))
- **Mục tiêu nghiệp vụ:** Xem xét toàn diện hồ sơ khiếu nại giữa Tài xế và Chủ bãi (lời khai, mã booking, bãi đỗ liên quan, lịch sử thanh toán); đưa ra phán quyết giải quyết tranh chấp (`resolution`) có tính ràng buộc pháp lý và lưu vết kiểm toán.
- **Actor chính:** System Administrator (Trọng tài viên phân xử).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

Bố cục dạng 2 cột chia tỉ lệ (`.admin-detail-grid`):
1. **Header trang (`AdminPageHeader`):**
   - Eyebrow: `CHI TIẾT KHIẾU NẠI`
   - Tiêu đề H1: Mã ticket (`item.code` - ví dụ `DSP-12`)
   - Mô tả: Tiêu đề lý do khiếu nại kèm thời điểm tạo.
   - Nút hành động: Quay lại danh sách (`Button icon={<ArrowLeftOutlined />} Danh sách`).
2. **Cột hồ sơ tranh chấp bên trái (`.admin-panel.admin-detail-card`):**
   - Tiêu đề H2: `Nội dung khiếu nại`
   - Bảng thuộc tính 1 cột có viền (`Descriptions column={1} bordered`):
     - Trạng thái vụ việc
     - Mức độ ưu tiên
     - Người gửi (Số điện thoại tài xế · Vai trò `DRIVER`)
     - Mã Booking liên quan
     - Bãi đỗ xe bị khiếu nại
     - Giá trị tài chính liên quan (Tổng tiền các đợt thanh toán)
     - Mô tả chi tiết mâu thuẫn của người khiếu nại
     - Số lượng tệp bằng chứng đính kèm
   - Khung kết quả xử lý (`Alert type="success" showIcon message="Kết quả xử lý" description={item.resolution}` nếu đã có phán quyết).
3. **Cột thao tác phân xử bên phải (`aside.admin-decision-box`):**
   - Tiêu đề H2: `Thao tác xử lý`
   - Hộp hướng dẫn nghiệp vụ: *"Kiểm tra đủ dữ liệu: Đối chiếu booking, payment, thời gian check-in/out và bằng chứng của hai bên."*
   - Nút mở bàn phán quyết: **"Cập nhật kết quả"** (`Button type="primary" icon={<CheckCircleOutlined />}`).
4. **Modal phán quyết tranh chấp (`Modal`):**
   - Tiêu đề: "Cập nhật kết quả tranh chấp".
   - Dropdown chọn trạng thái vụ việc (`Select`): `IN_REVIEW`, `WAITING_EVIDENCE`, `RESOLVED`, `CLOSED` *(Lưu ý: Backend hiện tại luôn ép về `RESOLVED`)*.
   - Ô nhập văn bản phán quyết: `Input.TextArea autoFocus maxLength={1000} rows={5} showCount placeholder="Ghi rõ căn cứ, quyết định hoàn tiền/phạt/cảnh báo và kết quả cuối cùng"`.

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tải trang chi tiết | Lifecycle Hook | Truy cập trang theo ID | Role `ADMIN` | Gọi API tải hồ sơ vụ tranh chấp kèm các payments | `GET /api/v1/disputes/admin/{id}`<br>hoặc `/api/v1/admin/disputes/{id}` | Hiển thị hồ sơ chi tiết và phán quyết cũ (nếu có) | [`AdminDisputeDetailPage.tsx:19`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputeDetailPage.tsx#L19), [`DisputeController.java:76-80`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/DisputeController.java#L76-L80) |
| Nút "Cập nhật kết quả" | Primary Button | Click nút trên khung phải | Bất kỳ lúc nào | Mở Modal nhập phán quyết giải quyết | Không gọi API | Modal phán quyết hiển thị | [`AdminDisputeDetailPage.tsx:23`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputeDetailPage.tsx#L23) |
| Dropdown chọn trạng thái | Select | Chọn trạng thái | Trong Modal | Cập nhật state nội bộ FE | Không gửi lên BE | **Bị FE bỏ qua khi gọi API** | [`adminRepository.ts:275-278`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/api/adminRepository.ts#L275-L278) |
| Nút "Lưu kết quả" | Modal Confirm | Click Lưu kết quả | `resolution.trim().length > 0` | Gửi phán quyết lên Backend, bắn notify cho Driver & Merchant | `PUT /api/v1/disputes/{id}/resolve`<br>hoặc `/api/v1/admin/disputes/{id}/resolve`<br>Body: `{ resolution }` | Lưu DB, ghi AuditLog, đóng Modal, hiển thị Alert thành công | [`AdminDisputeDetailPage.tsx:20`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputeDetailPage.tsx#L20), [`DisputeServiceImpl.java:95-121`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/DisputeServiceImpl.java#L95-L121) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Hiển Thị | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Validation | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|---|---|---|---|
| `code` | Mã khiếu nại | `string` | Có | Định dạng `DSP-{id}` | Tự động sinh từ ID | Nhận diện vụ việc |
| `status` | Trạng thái | `DisputeStatusEnum` | Có | `PENDING`, `REVIEWING`, `RESOLVED`, `REJECTED` | `Dispute.status` | Trạng thái thụ lý |
| `reporterName` | Người gửi | `string` | Có | Số điện thoại tài xế | `Booking.driver.user.phone` | Bên khiếu nại |
| `bookingCode` | Booking | `string` | Có | Mã booking tranh chấp | `Booking.bookingCode` | Khớp nối đơn hàng |
| `parkingLotName` | Bãi đỗ | `string` | Có | Tên bãi đỗ xe liên quan | `ParkingLot.name` | Cơ sở bị khiếu nại |
| `amount` | Giá trị liên quan | `number` | Có | Tổng tiền các payment trong booking | $\sum$ `Payment.amount` | Giá trị tài chính |
| `description` | Mô tả | `string` | Có | Lời giải trình của người nộp | `Dispute.description` | Nội dung mâu thuẫn |
| `resolution` | Kết quả xử lý | `string` | Có (khi giải quyết) | `@NotBlank`, tối đa 3000 ký tự (BE) / 1000 ký tự (FE) | `ResolveDisputeRequest.resolution` | Phán quyết của Admin |

---

## E. TRẠNG THÁI UI (UI States)

1. **Loading State:** Khi `loading === true`, hiển thị `<Skeleton active paragraph={{ rows: 10 }} />` ([`AdminDisputeDetailPage.tsx:21`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputeDetailPage.tsx#L21)).
2. **Not Found State:** Khi `!item`, hiển thị `<Alert type="error" showIcon message="Không tìm thấy khiếu nại" />` ([`AdminDisputeDetailPage.tsx:22`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputeDetailPage.tsx#L22)).
3. **Resolved Alert State:** Nếu `item.resolution` đã có giá trị, phía dưới bảng mô tả hiển thị Alert màu xanh lá: `Alert type="success" showIcon message="Kết quả xử lý" description={item.resolution}`.
4. **Backend Constraint Warning:** Nếu tranh chấp đã ở trạng thái `RESOLVED` hoặc `REJECTED`, Backend sẽ chặn không cho sửa tiếp (`throw new BadRequestException("Tranh chấp đã được xử lý")` tại [`DisputeServiceImpl.java:98`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/DisputeServiceImpl.java#L98)).

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 992\text{px}$):** Hồ sơ tranh chấp chiếm 65% bên trái, khung tác vụ chiếm 35% bên phải.
- **Mobile / Tablet ($< 768\text{px}$):** Toàn bộ giao diện xếp chồng 1 cột. Khung phán quyết đẩy xuống dưới. Modal phán quyết chiếm 95% độ rộng màn hình.
