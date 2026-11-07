# Đặc Tả Màn Hình SCR-053: AdminProfilePage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-053`
- **Tên màn hình:** Hồ sơ quản trị viên & Phiên bảo mật (Admin Profile & Security Session)
- **URL Route / Path:** `/admin/profile` (được cấu hình tại [`AppRoutes.tsx:108`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L108))
- **Quyền truy cập (RBAC):** Bắt buộc Role `ADMIN` ([`AppRoutes.tsx:95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L95))
- **Mục tiêu nghiệp vụ:** Hiển thị thông tin định danh phiên đăng nhập hiện tại của Quản trị viên, phạm vi quyền hạn và trạng thái xác thực bảo mật RBAC.
- **Actor chính:** System Administrator (Quản trị viên đang đăng nhập).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

Bố cục dạng 2 cột chia tỉ lệ (`.admin-detail-grid`):
1. **Header trang (`AdminPageHeader`):**
   - Eyebrow: `TÀI KHOẢN QUẢN TRỊ`
   - Tiêu đề: `Hồ sơ Admin`
   - Mô tả: `Thông tin phiên đăng nhập và quyền truy cập hiện tại.`
2. **Cột thông tin tài khoản bên trái (`.admin-panel.admin-detail-card`):**
   - Tiêu đề H2: `Thông tin tài khoản`
   - Bảng thuộc tính 1 cột (`Descriptions column={1}`):
     - Tài khoản: Avatar người dùng kèm nhãn định danh *"Quản trị viên Demo"*
     - Số điện thoại: Lấy từ phiên xác thực `session?.phone`
     - Vai trò: Ghi rõ `ADMIN`
     - Phạm vi: `Quản trị toàn hệ thống`
3. **Cột bảo mật bên phải (`aside.admin-page`):**
   - **Hộp thông báo 1 (Xanh lá - Thành công):**
     - Icon: `<SafetyCertificateOutlined />`
     - Tiêu đề: `Phiên được bảo vệ bằng RBAC`
     - Nội dung: `Các route Admin chỉ cho phép role ADMIN truy cập.`
   - **Hộp thông báo 2 (Xanh dương - Thông tin):**
     - Icon: `<KeyOutlined />`
     - Tiêu đề: `Tài khoản demo`
     - Nội dung: `Phiên demo dùng dữ liệu cục bộ. Khi nối BE, lịch sử và quyền hạn phải được xác minh lại từ server.`

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tải trang ban đầu | Lifecycle Hook | Truy cập trang | Role `ADMIN` | Đọc thông tin phiên từ Local Storage / Memory Session | `getAuthSession()` | Hiển thị hồ sơ quản trị viên | [`AdminProfilePage.tsx:7`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/profile/AdminProfilePage.tsx#L7) |
| Menu Avatar góc phải | Header Dropdown | Click Avatar quản trị | Bất kỳ lúc nào | Mở menu tài khoản: Hồ sơ / Đăng xuất | Không gọi API | Dropdown mở | [`AdminLayout.tsx:35, 44`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/layout/AdminLayout.tsx#L35) |
| Đăng xuất | Menu Item Action | Click nút "Đăng xuất" | Bất kỳ lúc nào | Xóa sạch token & session, chuyển hướng về Login | `clearAuthSession()` | Chuyển URL về `/login` | [`AdminLayout.tsx:34-35`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/layout/AdminLayout.tsx#L34-L35) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Hiển Thị | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Validation | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|---|---|---|---|
| `phone` | Số điện thoại | `string` | Có | Định dạng số điện thoại đăng nhập | `AuthSession.phone` | Định danh phiên |
| `role` | Vai trò | `string` | Có | Bắt buộc giá trị `ADMIN` | `AuthSession.role` | Phân quyền RBAC |
| `scope` | Phạm vi | `string` | Có | Chuỗi cố định: `Quản trị toàn hệ thống` | Cục bộ FE | Quyền hạn tối cao |

---

## E. TRẠNG THÁI UI (UI States)

1. **Active Session State:** Hiển thị số điện thoại của quản trị viên và 2 thẻ thông báo an ninh phiên làm việc.
2. **Fallback State:** Nếu `session?.phone` rỗng, hiển thị ký tự gạch ngang `—`.

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 768\text{px}$):** Thẻ hồ sơ bên trái và 2 thẻ cảnh báo an ninh bên phải chia theo tỉ lệ 6:4.
- **Mobile ($< 768\text{px}$):** Chuyển sang bố cục xếp chồng 1 cột.
