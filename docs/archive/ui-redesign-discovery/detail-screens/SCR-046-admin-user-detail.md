# Đặc Tả Màn Hình SCR-046: AdminUserDetailPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-046`
- **Tên màn hình:** Hồ sơ chi tiết người dùng & Chế tài (User Detail & Sanctions Desk)
- **URL Route / Path:** `/admin/users/:userId` (được cấu hình tại [`AppRoutes.tsx:101`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L101))
- **Quyền truy cập (RBAC):** Bắt buộc Role `ADMIN` ([`AppRoutes.tsx:95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L95))
- **Mục tiêu nghiệp vụ:** Xem xét lịch sử vi phạm, mức độ hoạt động và số lượng tranh chấp liên quan của một tài khoản; thực hiện chế tài kỷ luật: Khóa tài khoản (`Ban`) hoặc Mở khóa tài khoản (`Unban`) kèm biên bản lý do bắt buộc.
- **Actor chính:** System Administrator (Quản trị viên xử lý kỷ luật).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

Bố cục dạng 2 cột chia tỉ lệ (`.admin-detail-grid`):
1. **Header trang (`AdminPageHeader`):**
   - Eyebrow: `THÔNG TIN NGƯỜI DÙNG`
   - Tiêu đề H1: Họ tên người dùng (`item.fullName`)
   - Mô tả: Số điện thoại kèm ngày tham gia hệ thống.
   - Nút hành động: Quay lại danh bạ (`Button icon={<ArrowLeftOutlined />} Danh sách`).
2. **Cột thông tin tài khoản bên trái (`.admin-panel.admin-detail-card`):**
   - Tiêu đề H2: `Thông tin tài khoản`
   - Danh sách thuộc tính 1 cột (`Descriptions column={1}`):
     - Số điện thoại
     - Vai trò (Tag màu sắc)
     - Trạng thái hiện tại (Tag màu sắc)
     - Ngày tạo tài khoản
     - Đăng nhập gần nhất (nếu có, hoặc hiển thị nhãn *"Backend chưa cung cấp"*)
     - Số hoạt động / đặt chỗ (`bookingCount`)
     - Số tranh chấp liên quan (`disputeCount`)
3. **Cột kiểm soát tài khoản bên phải (`aside.admin-decision-box`):**
   - Tiêu đề H2: `Kiểm soát tài khoản`
   - Hộp cảnh báo lý do xử lý gần nhất (`item.statusReason` nếu có).
   - Nút chế tài kỷ luật động theo trạng thái:
     - Nếu `status === 'ACTIVE'`: Nút màu đỏ nguy hiểm **"Khóa tài khoản"** (`Button danger icon={<LockOutlined />}`). Nếu tài khoản mục tiêu cũng có role `ADMIN`, nút này bị vô hiệu hóa (`disabled={item.role === 'ADMIN'}`).
     - Nếu `status !== 'ACTIVE'` (BANNED/LOCKED): Nút màu xanh dương **"Mở khóa tài khoản"** (`Button type="primary" icon={<UnlockOutlined />}`).
4. **Modal nhập lý do xử lý (`Modal`):**
   - Tiêu đề: "Xác nhận khóa tài khoản" / "Xác nhận mở khóa tài khoản".
   - Hướng dẫn: *"Nhập lý do để lưu vết kiểm toán và hỗ trợ đối soát."*
   - Ô nhập văn bản bắt buộc: `Input.TextArea autoFocus showCount maxLength={500} rows={4}`.

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tải trang chi tiết | Lifecycle Hook | Truy cập trang theo ID | Role `ADMIN` | Gọi API lấy chi tiết tài khoản | `GET /api/v1/admin/users/{id}` | Hiển thị thông số, booking count, dispute count | [`AdminUserDetailPage.tsx:19-26`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUserDetailPage.tsx#L19-L26), [`AdminController.java:124-127`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/AdminController.java#L124-L127) |
| Nút "Khóa tài khoản" | Danger Button | Click nút Khóa | `status === 'ACTIVE'` và `role !== 'ADMIN'` | Mở Modal xác nhận khóa tài khoản | Không gọi API | `action = 'BAN'`, Modal mở | [`AdminUserDetailPage.tsx:63`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUserDetailPage.tsx#L63) |
| Nút "Mở khóa tài khoản" | Primary Button | Click nút Mở khóa | `status !== 'ACTIVE'` | Mở Modal xác nhận mở khóa tài khoản | Không gọi API | `action = 'UNBAN'`, Modal mở | [`AdminUserDetailPage.tsx:64`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUserDetailPage.tsx#L64) |
| Nút "Xác nhận" Modal | Modal Confirm | Click Xác nhận | `reason.trim().length > 0` | Gọi API cập nhật trạng thái người dùng | `PUT /api/v1/admin/users/{id}/ban`<br>hoặc `/unban`<br>Body: `{ reason }` | Cập nhật UI, hiển thị Toast thành công, đóng Modal | [`AdminUserDetailPage.tsx:28-40`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUserDetailPage.tsx#L28-L40), [`AdminServiceImpl.java:173-203`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/AdminServiceImpl.java#L173-L203) |
| Chức năng Cảnh báo | Backend Feature | Không khả dụng ở FE | Có API Backend | Endpoint sẵn sàng nhưng FE chưa xây dựng nút | `POST /api/v1/admin/users/{id}/warnings` | Gửi thông báo hệ thống + ghi log kiểm toán | [`AdminController.java:149-155`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/AdminController.java#L149-L155) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Hiển Thị | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Validation | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|---|---|---|---|
| `phone` | Số điện thoại | `string` | Có | Định dạng chuẩn số điện thoại VN (10 chữ số) | `User.phone` | Định danh tài khoản |
| `fullName` | Họ và tên | `string` | Có | Chuỗi text hiển thị người dùng | `User.fullName` | Tên cá nhân / doanh nghiệp |
| `role` | Vai trò | `RoleEnum` | Có | `DRIVER`, `MERCHANT`, `ADMIN` | `User.role` | Quyền hạn tài khoản |
| `status` | Trạng thái | `UserStatusEnum` | Có | `ACTIVE`, `BANNED`, `LOCKED` | `User.status` | Trạng thái hiện thời |
| `statusReason` | Lý do xử lý gần nhất | `string` | Không | Tối đa 500 ký tự | `User.statusReason` | Căn cứ kỷ luật |
| `bookingCount` | Số hoạt động | `long` | Có | Số nguyên $\ge 0$ | `BookingRepository.countByDriverUserId(id)` | Lượt đặt xe của tài xế |
| `disputeCount` | Số tranh chấp | `long` | Có | Số nguyên $\ge 0$ | `DisputeRepository.countByBookingDriverUserId(id)` | Vụ khiếu nại liên quan |
| `reason` (Request Body) | Lý do xử lý | `string` | Có | `@NotBlank`, tối đa 1000 ký tự | `AdminDecisionRequest.reason` | Ghi vào `AuditLog` |

---

## E. TRẠNG THÁI UI (UI States)

1. **Loading State:** Khi `loading === true`, hiển thị `<Skeleton active paragraph={{ rows: 10 }} />` ([`AdminUserDetailPage.tsx:42`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUserDetailPage.tsx#L42)).
2. **Error / Not Found State:** Khi `!item`, hiển thị `<Alert type="error" showIcon message="Không tìm thấy người dùng" />` ([`AdminUserDetailPage.tsx:43`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUserDetailPage.tsx#L43)).
3. **Admin Self/Peer Protection State:** Nếu `item.role === 'ADMIN'`, nút "Khóa tài khoản" bị vô hiệu hóa (`disabled={true}`) để tuân thủ quy tắc bảo vệ: Quản trị viên không thể tự khóa mình hoặc khóa các Admin khác ([`AdminServiceImpl.java:174-177`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/AdminServiceImpl.java#L174-L177)).
4. **Validation Warning State:** Nếu bấm Xác nhận trong modal khi `reason` rỗng, hiển thị cảnh báo `message.warning('Vui lòng nhập lý do xử lý tài khoản.')`.

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 992\text{px}$):** Cột thông tin tài khoản chiếm 65% độ rộng, cột kiểm soát chiếm 35% độ rộng.
- **Tablet / Mobile ($< 768\text{px}$):** Chuyển sang bố cục 1 cột xếp chồng. Modal hiển thị chiếm toàn màn hình hoặc 90vw trên thiết bị di động nhỏ.
