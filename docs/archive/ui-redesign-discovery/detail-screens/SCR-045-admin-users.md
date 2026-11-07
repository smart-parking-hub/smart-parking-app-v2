# Đặc Tả Màn Hình SCR-045: AdminUsersPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-045`
- **Tên màn hình:** Quản lý người dùng (User Management Directory)
- **URL Route / Path:** `/admin/users` (được cấu hình tại [`AppRoutes.tsx:100`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L100))
- **Quyền truy cập (RBAC):** Bắt buộc Role `ADMIN` ([`AppRoutes.tsx:95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L95))
- **Mục tiêu nghiệp vụ:** Cung cấp danh bạ toàn bộ tài khoản trong hệ sinh thái SmartParkingHub, cho phép lọc theo vai trò (Tài xế, Chủ bãi, Quản trị viên) và trạng thái (Hoạt động, Đã khóa, Tạm khóa) để giám sát và xử lý vi phạm.
- **Actor chính:** System Administrator (Quản trị viên người dùng).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

1. **Header trang (`AdminPageHeader`):**
   - Eyebrow: `TÀI KHOẢN & PHÂN QUYỀN`
   - Tiêu đề: `Quản lý người dùng`
   - Mô tả: `Kiểm soát trạng thái tài khoản và truy vết các hành vi cần chú ý.`
2. **Thanh công cụ lọc (`.admin-toolbar`):**
   - Ô tìm kiếm text (`Input prefix={<SearchOutlined />} allowClear`): Tìm kiếm theo tên hiển thị (`fullName`) hoặc số điện thoại (`phone`).
   - Hộp chọn vai trò (`Select`):
     - `ALL`: Tất cả vai trò
     - `DRIVER`: Tài xế
     - `MERCHANT`: Chủ bãi
     - `ADMIN`: Quản trị viên
   - Hộp chọn trạng thái (`Select`):
     - `ALL`: Tất cả trạng thái
     - `ACTIVE`: Hoạt động
     - `BANNED`: Đã khóa
     - `LOCKED`: Tạm khóa
   - Badge đếm số lượng tài khoản phù hợp (`visible.length tài khoản`).
3. **Bảng danh sách người dùng (`Table`):**
   - 6 cột dữ liệu chuẩn hóa:
     1. Người dùng: Họ tên in đậm + Số điện thoại in nhỏ
     2. Vai trò: Render qua `AdminStatusTag` (màu xanh dương cho Driver, màu tím cho Merchant, màu đỏ cho Admin)
     3. Trạng thái: Render qua `AdminStatusTag` (Xanh lá: Active, Đỏ: Banned, Xám: Locked)
     4. Hoạt động: Số lượt hoạt động (`activityCount`) hoặc gạch ngang `—`
     5. Đăng nhập gần nhất: Format ngày giờ hoặc gạch ngang `—`
     6. Thao tác: Nút bấm `Chi tiết` (`Button icon={<EyeOutlined />}`)
   - Phân trang nội bộ tại Client: `pageSize: 10`, `showSizeChanger: false`.

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tải trang ban đầu | Lifecycle Hook | Truy cập trang | Role `ADMIN` | Gọi API tải 200 tài khoản | `GET /api/v1/admin/users?page=0&size=200` | Hiển thị bảng danh bạ tài khoản | [`AdminUsersPage.tsx:19`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUsersPage.tsx#L19), [`adminRepository.ts:231-234`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/api/adminRepository.ts#L231-L234) |
| Ô tìm kiếm | Text Input | Nhập từ khóa tên/SĐT | Bất kỳ lúc nào | Lọc danh sách tức thời tại Client | Không gọi API | Bảng hiển thị các tài khoản thỏa mãn | [`AdminUsersPage.tsx:20`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUsersPage.tsx#L20) |
| Bộ lọc Vai trò | Select Dropdown | Chọn vai trò | Bất kỳ lúc nào | Lọc danh sách theo trường `role` tại Client | Không gọi API | Bảng hiển thị tài khoản thuộc role đã chọn | [`AdminUsersPage.tsx:20`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUsersPage.tsx#L20) |
| Bộ lọc Trạng thái | Select Dropdown | Chọn trạng thái | Bất kỳ lúc nào | Lọc danh sách theo trường `status` tại Client | Không gọi API | Bảng hiển thị tài khoản thuộc status đã chọn | [`AdminUsersPage.tsx:20`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUsersPage.tsx#L20) |
| Nút "Chi tiết" | Action Button | Click nút trên dòng | Dòng có dữ liệu | Chuyển hướng sang trang hồ sơ chi tiết người dùng | Không gọi API | Chuyển URL sang `/admin/users/:userId` | [`AdminUsersPage.tsx:27`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUsersPage.tsx#L27) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Cột | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Validation | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|---|---|---|---|
| `fullName` + `phone` | Người dùng | `string` | Có | Tên hiển thị (nếu null thì dùng email/SĐT) + Số điện thoại | `User.fullName`, `phone`, `email` | Nhận diện tài khoản |
| `role` | Vai trò | `enum` | Có | `DRIVER`, `MERCHANT`, `ADMIN` | `User.role` | Phân quyền hệ thống |
| `status` | Trạng thái | `enum` | Có | `ACTIVE`, `BANNED`, `LOCKED`, `INACTIVE` | `User.status` | Tình trạng kỷ luật |
| `activityCount` | Hoạt động | `number` | Không | Số nguyên $\ge 0$ | Cục bộ FE / Backend (nếu có) | Số lượt booking/đặt chỗ |
| `lastLoginAt` | Đăng nhập gần nhất | `string (ISO)` | Không | Format ngày giờ Việt Nam | Chưa lưu trữ ở Backend | Hiện trả về null / `—` |

---

## E. TRẠNG THÁI UI (UI States)

1. **Loading State:** Khi `loading === true`, hiển thị `<Skeleton active />` ([`AdminUsersPage.tsx:29`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUsersPage.tsx#L29)).
2. **Success State:** Hiển thị danh sách người dùng phân trang 10 dòng/trang.
3. **Empty State:** Khi bộ lọc không có tài khoản phù hợp (`visible.length === 0`), hiển thị `<Empty description="Không tìm thấy tài khoản phù hợp" />` ([`AdminUsersPage.tsx:29`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUsersPage.tsx#L29)).

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 992\text{px}$):** Bảng hiển thị 6 cột chuẩn mực, toolbar dàn hàng ngang.
- **Mobile / Tablet nhỏ ($< 768\text{px}$):** Toolbar tự động xếp chồng (input tìm kiếm lên trên, 2 dropdown select xuống dòng). Bảng kích hoạt cuộn ngang tránh vỡ chữ số điện thoại và nút thao tác.
