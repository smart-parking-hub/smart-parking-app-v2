# Screen Specification: SCR-021 ProfilePage (Thông tin cá nhân tài xế)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-021`
- **Screen Name:** Hồ sơ & Thông tin tài xế (Driver Profile Management)
- **Module:** `MOD-03: Driver Operations Portal`
- **Route URL:** 
  - `/profile` (Định nghĩa tại [`AppRoutes.tsx:76`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L76) bọc bởi `LandingLayout`)
  - `/dashboard/profile` (Định nghĩa tại [`AppRoutes.tsx:89`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L89) bọc bởi `DashboardLayout`)
- **Primary Component:** [`ProfilePage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/profile/pages/ProfilePage.tsx)
- **Sub-components:**
  - [`ProfileSidebar.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/profile/components/ProfileSidebar.tsx) (Thanh sidebar tài khoản)
  - `Skeleton`, `Form`, `Input`, `Button`, `message`
- **Access Role:** `ROLE_DRIVER` (Yêu cầu tài xế đăng nhập)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cho phép tài xế xem và cập nhật thông tin định danh cá nhân và thông tin liên hệ.
2. Cung cấp số điện thoại liên lạc và số điện thoại khẩn cấp phục vụ trường hợp xe gặp sự cố, điều phối bãi khẩn cấp, cứu hộ hoặc giải tỏa bãi đỗ.
3. Đảm bảo dữ liệu họ tên và email luôn chính xác để gửi hóa đơn điện tử và biên lai thanh toán tự động.

### B. Target Users
- Tài xế cần cập nhật số điện thoại mới, đổi địa chỉ liên hệ hoặc bổ sung số điện thoại khẩn cấp.

### C. Entry Points
- Click Avatar hoặc tên tài xế trên Header / User Menu -> Chọn "Hồ sơ cá nhân".
- Click mục "Thông tin cá nhân" trên `ProfileSidebar`.
- Điều hướng trực tiếp đến URL `/profile`.

### D. Exit Points
- Chuyển sang mục "Phương tiện của tôi" (`SCR-020`), "Thanh toán & hóa đơn" (`SCR-019`), hoặc "Đổi mật khẩu" (`SCR-022`) qua Sidebar.

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Trang
- Bố cục 2 cột tiêu chuẩn của trang cài đặt tài khoản:
  - Cột trái: [`ProfileSidebar.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/profile/components/ProfileSidebar.tsx).
  - Cột phải: Vùng nội dung quản lý hồ sơ `.profile-content`.

### B. Header Khối Hồ Sơ
- Tag phân hệ: `HỒ SƠ DRIVER`.
- Tiêu đề H1: `Thông tin cá nhân`.
- Mô tả phụ: `Thông tin liên hệ dùng cho booking và hỗ trợ khẩn cấp.`

### C. Khối Tóm Tắt Định Danh (.profile-summary)
- Khối avatar: Vòng tròn icon `UserRound`.
- Thông tin văn bản:
  - Họ tên: In đậm từ trường dữ liệu `{form.getFieldValue('fullName')}`.
  - Phân loại tài khoản: Text xám `Tài xế SmartTruck Parking`.
- Huy hiệu xác minh: Thẻ em với icon `ShieldCheck` và nhãn `Đã xác thực`.

### D. Form Nhập Liệu Thông Tin (.driver-profile-form)
- Bố cục lưới trường thông tin (`.profile-fields`):
  1. **Họ và tên (`fullName`):** Text input, bắt buộc nhập, độ dài tối thiểu 2 ký tự.
  2. **Số điện thoại (`phone`):** Text input, bắt buộc nhập, kiểm tra định dạng regex `/^0\d{9}$/` (10 chữ số).
  3. **Email (`email`):** Text input, bắt buộc nhập, kiểm tra định dạng email hợp lệ.
  4. **Liên hệ khẩn cấp (`emergencyContact`):** Text input, không bắt buộc nhưng nếu nhập phải chuẩn regex 10 chữ số `/^0\d{9}$/`.
  5. **Địa chỉ liên hệ (`address`):** `Input.TextArea` 3 dòng, không bắt buộc.
- Nút bấm hành động:
  - Nút Primary `Lưu thay đổi`: Kèm icon `Save`, kích hoạt trạng thái loading spinner khi đang gửi API.

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-021-01** | Tải thông tin hồ sơ | Tải trang `/profile` | Token xác thực | Đã đăng nhập hệ thống | Điền dữ liệu họ tên, SĐT, email, địa chỉ vào Form |
| **FN-021-02** | Cập nhật hồ sơ cá nhân | Click nút `Lưu thay đổi` | Form values: `fullName`, `phone`, `email`, `emergencyContact`, `address` | Dữ liệu đúng định dạng validation | Gửi API cập nhật, hiển thị thông báo `Đã lưu hồ sơ`, cập nhật tên hiển thị |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `GET /api/v1/users/me`: Truy xuất thông tin hồ sơ người dùng hiện tại.
2. `PUT /api/v1/users/me`: Cập nhật thông tin hồ sơ người dùng.

### B. Controller & Method
- [`UserController.java:22-35`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/UserController.java#L22-L35)
  - `getProfile(@AuthenticationPrincipal CustomUserDetails userDetails)`: Yêu cầu `@PreAuthorize("isAuthenticated()")`, gọi `userService.getProfile(userDetails.getId())`.
  - `updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody UserProfileDto request)`: Yêu cầu `@PreAuthorize("isAuthenticated()")`, gọi `userService.updateProfile(userDetails.getId(), request)`.

### C. Service Implementation
- [`UserServiceImpl.java`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/UserServiceImpl.java)
  - Cập nhật các trường thông tin trong entity `User` liên kết với tài khoản đang đăng nhập.

### D. DTO & Validation
- DTO: `UserProfileDto` gồm các trường `fullName`, `phone`, `email`, `emergencyContact`, `address`.

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Hiển thị `Skeleton active` trong khi chờ phản hồi từ `GET /api/v1/users/me`.
- **Saving State:** Nút `Lưu thay đổi` hiển thị icon loading, vô hiệu hóa form trong quá trình gửi `PUT /api/v1/users/me`.
- **Success State:** Hiển thị toast thông báo thành công `Đã lưu hồ sơ` qua `message.success`.
- **Error Handling:** 
  - Lỗi validate số điện thoại không đủ 10 chữ số hoặc email sai định dạng: Hiển thị tooltip/message đỏ ngay dưới trường nhập liệu.
  - Lỗi backend (ví dụ email đã bị trùng lặp): Bắt ngoại lệ và hiển thị qua thông báo lỗi Ant Design.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Số điện thoại và Liên hệ khẩn cấp:** Cực kỳ quan trọng đối với tài xế xe tải đường dài để điều phối bãi xe có thể liên lạc khẩn cấp khi cần di dời xe.
2. **Khả năng đồng bộ với dữ liệu xuất hóa đơn:** Email phải được xác thực để nhận hóa đơn VAT điện tử.

### B. Đề Xuất Nâng Cấp
1. **Upload Ảnh đại diện (Avatar):** Thiết kế hiện tại chỉ dùng icon tĩnh `UserRound`, cần bổ sung tính năng tải lên ảnh đại diện thực tế.
2. **Quản lý Bằng lái xe (GPLX):** Bổ sung trường thông tin Hạng bằng lái (Hạng C, FC,...) để kiểm tra thẩm quyền điều khiển các dòng xe đầu kéo/container.
