# Screen Specification: SCR-022 ChangePasswordPage (Đổi mật khẩu tài xế)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-022`
- **Screen Name:** Đổi mật khẩu bảo mật tài khoản (Driver Change Password)
- **Module:** `MOD-03: Driver Operations Portal`
- **Route URL:** 
  - `/change-password` (Định nghĩa tại [`AppRoutes.tsx:77`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L77) bọc bởi `LandingLayout`)
  - `/dashboard/change-password` (Định nghĩa tại [`AppRoutes.tsx:90`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L90) bọc bởi `DashboardLayout`)
- **Primary Component:** [`ChangePasswordPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/profile/pages/ChangePasswordPage.tsx)
- **Sub-components:**
  - [`ProfileSidebar.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/profile/components/ProfileSidebar.tsx) (Thanh sidebar tài khoản)
  - `Form`, `Input.Password`, `Alert`, `Button`, `message`
- **Access Role:** `ROLE_DRIVER` (Yêu cầu tài xế đăng nhập)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cho phép tài xế chủ động đổi mật khẩu đăng nhập định kỳ hoặc khi nghi ngờ mật khẩu cũ bị lộ.
2. Ngăn ngừa việc tài khoản tài xế bị chiếm đoạt quyền điều khiển (gây rủi ro đặt bãi giả mạo hoặc hủy đặt cọc trái phép).
3. Đảm bảo tuân thủ tiêu chuẩn an toàn mật khẩu (độ dài, chữ hoa, chữ số).

### B. Target Users
- Tài xế đang sử dụng tài khoản đăng nhập trên ứng dụng web hoặc ứng dụng di động.

### C. Entry Points
- Click mục "Đổi mật khẩu" trên `ProfileSidebar`.
- Click từ liên kết bảo mật tài khoản.
- Điều hướng trực tiếp đến URL `/change-password`.

### D. Exit Points
- Chuyển sang các mục khác trên `ProfileSidebar` (`/profile`, `/vehicles`, `/payments`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Trang
- Bố cục 2 cột tiêu chuẩn:
  - Cột trái: [`ProfileSidebar.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/profile/components/ProfileSidebar.tsx).
  - Cột phải: Khối đổi mật khẩu `.profile-content.password-content`.

### B. Header Khối Đổi Mật Khẩu
- Nhãn phân hệ: `BẢO MẬT TÀI KHOẢN`.
- Tiêu đề H1: `Đổi mật khẩu`.
- Mô tả hướng dẫn: `Mật khẩu demo hiện tại: Driver@123`.

### C. Khối Cảnh Báo Demo (.ant-alert)
- Hiển thị Alert Ant Design kiểu `info`, `showIcon`:
  - Tiêu đề: `Chế độ dữ liệu mẫu`.
  - Nội dung: `Form mô phỏng đầy đủ validation; không thay đổi tài khoản backend.`
  *(Lưu ý: Mặc dù UI hiển thị nhãn cảnh báo demo, mã nguồn thực tế tại [`userApi.ts:22-24`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/profile/api/userApi.ts#L22-L24) vẫn gửi request thật tới Backend endpoint `POST /api/v1/users/me/password`)*.

### D. Form Nhập Liệu Đổi Mật Khẩu (.password-form)
1. **Mật khẩu hiện tại (`currentPassword`):**
   - Loại: `Input.Password` ẩn ký tự.
   - Prefix icon: `KeyRound`.
   - Bắt buộc nhập.
2. **Mật khẩu mới (`newPassword`):**
   - Loại: `Input.Password`.
   - Prefix icon: `LockKeyhole`.
   - Tiêu chí validation:
     - Bắt buộc nhập.
     - Tối thiểu 8 ký tự (`min: 8`).
     - Regex kiểm tra độ phức tạp: `/^(?=.*[A-Z])(?=.*\d).+$/` (bắt buộc có ít nhất một chữ in hoa và một chữ số).
3. **Xác nhận mật khẩu mới (`confirmPassword`):**
   - Loại: `Input.Password`.
   - Prefix icon: `ShieldCheck`.
   - Dependencies: Phụ thuộc vào `newPassword`.
   - Custom validator: Đối chiếu giá trị `value === getFieldValue('newPassword')`. Nếu không khớp, trả về lỗi `Mật khẩu xác nhận không khớp`.
4. **Nút bấm gửi:**
   - Nút Primary `Cập nhật mật khẩu`.

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-022-01** | Kiểm tra mật khẩu | Người dùng nhập các trường mật khẩu | `currentPassword`, `newPassword`, `confirmPassword` | Đang ở trang đổi mật khẩu | Kiểm tra độ dài, chữ hoa, chữ số và khớp mật khẩu theo thời gian thực |
| **FN-022-02** | Xác nhận đổi mật khẩu | Click nút `Cập nhật mật khẩu` | `currentPassword`, `newPassword` | Mật khẩu hiện tại đúng, mật khẩu mới hợp lệ | Gửi request `POST /api/v1/users/me/password`, thông báo thành công `Đổi mật khẩu thành công`, reset sạch các ô input |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
- `POST /api/v1/users/me/password`: Đổi mật khẩu người dùng hiện tại.

### B. Controller & Method
- [`UserController.java:37-45`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/UserController.java#L37-L45)
  - `changePassword(@AuthenticationPrincipal CustomUserDetails userDetails, @Valid @RequestBody ChangePasswordRequest request)`
  - Quyền hạn: `@PreAuthorize("isAuthenticated()")`

### C. Service Implementation
- [`UserServiceImpl.java`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/UserServiceImpl.java)
  - Lấy `User` theo `userId`.
  - So khớp mật khẩu cũ: `passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())`. Nếu sai, ném `BadRequestException("Mật khẩu hiện tại không chính xác!")`.
  - Mã hóa mật khẩu mới: `user.setPassword(passwordEncoder.encode(request.getNewPassword()))`.
  - Lưu vào cơ sở dữ liệu.

### D. DTO & Validation
- DTO: `ChangePasswordRequest` gồm `currentPassword`, `newPassword`.

---

## 6. UI STATES & ERROR HANDLING

- **Validation Error States:**
  - Mật khẩu dưới 8 ký tự hoặc thiếu chữ hoa/chữ số: Hiển thị thông báo đỏ dưới ô nhập liệu.
  - Mật khẩu xác nhận không trùng khớp: Hiển thị lỗi `Mật khẩu xác nhận không khớp`.
- **Backend Error States:**
  - Nhập sai mật khẩu hiện tại: Backend trả về lỗi 400, Frontend bắt lỗi qua khối `catch (error)` và hiển thị `message.error(error.message)`.
- **Success State:**
  - Hiển thị toast thông báo `Đổi mật khẩu thành công`, tự động xóa sạch form (`form.resetFields()`).

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Ràng buộc độ mạnh mật khẩu:** Bắt buộc duy trì tối thiểu 8 ký tự, chứa cả chữ hoa và chữ số để tránh brute-force.
2. **Xác nhận mật khẩu hiện tại:** Tuyệt đối không được bỏ qua bước nhập mật khẩu hiện tại để tránh việc người khác sử dụng máy tính/thiết bị chưa đăng xuất tự ý đổi pass.

### B. Điểm Cần Chỉnh Sửa Trong Thiết Kế Mới
1. **Loại bỏ Alert Mock / Demo:** Alert thông báo *"Chế độ dữ liệu mẫu... không thay đổi tài khoản backend"* là văn bản sót lại từ giai đoạn prototype, cần xóa bỏ hoàn toàn vì hệ thống đã kết nối Backend thật.
2. **Hiển thị thước đo độ mạnh mật khẩu (Password Strength Meter):** Thêm thanh chỉ báo trực quan mức độ an toàn (Yếu / Trung bình / Mạnh) để tăng trải nghiệm người dùng.
