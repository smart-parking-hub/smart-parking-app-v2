# Screen Specification: SCR-012 ForgotPasswordPage (Khôi phục mật khẩu)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-012`
- **Screen Name:** Khôi phục mật khẩu (Forgot Password / Password Recovery)
- **Module:** `MOD-02: Authentication & Access Management`
- **Route URL:** `/forgot-password`
- **Layout Type:** `AuthLayout` (Split-screen layout: Hero Banner bên trái + Auth Card bên phải)
- **Primary Component:** `smart-parking-app/src/features/auth/pages/ForgotPasswordPage.tsx`
- **Sub-components:**
  - `AuthFormCard`: `smart-parking-app/src/features/auth/components/AuthFormCard.tsx`
  - Ant Design `Steps` (`size="small"`, 2 bước: Step 0 'Nhập Email', Step 1 'OTP & mật khẩu mới')
  - Ant Design `Alert` (Thông báo kết nối backend & cơ chế OTP)
  - Ant Design `Form`, `Input`, `Input.Password`, `Button`
- **Access Role:** Public (Unauthenticated / Khách vãng lai đã có tài khoản nhưng quên mật khẩu)
- **Discovery Status:** `VERIFIED` (Source code Frontend & Backend đã được đối chiếu toàn diện)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Cung cấp quy trình tự phục vụ 2 bước an toàn (Self-service Password Reset Wizard) để người dùng lấy lại quyền truy cập khi quên mật khẩu:
1. **Bước 1 (Gửi yêu cầu):** Nhập email đã đăng ký. Hệ thống phát hành mã OTP 6 số ngẫu nhiên có hiệu lực trong 300 giây (5 phút), lưu hash BCrypt vào bảng `otp_challenges`.
2. **Bước 2 (Xác minh & Thiết lập lại):** Nhập mã OTP 6 chữ số và mật khẩu mới (kèm xác nhận mật khẩu). Hệ thống kiểm tra hash OTP, giới hạn số lần thử (tối đa 5 lần), cập nhật mật khẩu mới đã hash BCrypt vào bảng `users`, và chuyển hướng người dùng về trang đăng nhập.

### B. Target Users
- Tất cả người dùng hệ thống (`DRIVER`, `MERCHANT`, `ADMIN`) có email liên kết với tài khoản và bị quên mật khẩu đăng nhập.

### C. Entry Points
- Link *"Quên mật khẩu?"* từ `LoginPage` (`SCR-010`) tại `Form.Item` chân form (`smart-parking-app/src/features/auth/pages/LoginPage.tsx:149`).
- Truy cập trực tiếp qua URL: `/forgot-password`.

### D. Exit Points
- **Thành công (Reset Password thành công):** Điều hướng sang `/login` (`navigate('/login')`) kèm thông báo `message.success('Đổi mật khẩu thành công. Hãy đăng nhập bằng mật khẩu mới.')`.
- **Hủy / Nhớ lại mật khẩu:** Click link *"Đăng nhập"* tại card footer (`<Link to="/login">Đăng nhập</Link>`).
- **Gửi lại OTP:** Click button *"Gửi lại OTP"* tại Step 1 (`setCurrentStep(0)`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Layout Structure (`AuthLayout`)
- Bố cục lưới 2 cột toàn màn hình (min-h-screen):
  - **Cột trái (Hero Banner):** Nền Gradient Deep Teal/Emerald (`from-teal-800 to-slate-900`), logo SmartTruck, tagline hệ thống, hình ảnh minh họa xe tải tại bãi đỗ. Ẩn trên màn hình `< lg`.
  - **Cột phải (Auth Container):** Căn giữa `AuthFormCard` với viền mờ, đổ bóng nhẹ.

### B. Nội dung `AuthFormCard`
- **Eyebrow:** `SmartTruck`
- **Title:** `Khôi phục mật khẩu`
- **Description:** `Nhập email đã đăng ký để nhận OTP và đặt mật khẩu mới trên server.`
- **Footer:** `Đã nhớ mật khẩu? Đăng nhập` (Link tới `/login`)
- **System Info Banner (`Alert`):**
  - Type: `info`, showIcon: `true`
  - Title: `Đã kết nối backend`
  - Description: `OTP do server phát hành và mật khẩu mới được ghi vào database sau khi xác thực thành công.`
- **Stepping Wizard (`Steps`):**
  - Step 0: `Nhập Email`
  - Step 1: `OTP & mật khẩu mới`

### C. Giao diện Step 0: Yêu cầu mã OTP
- `Form layout="vertical"`:
  - Input field: `email` (Prefix `<MailOutlined />`, placeholder "Nhập email đã đăng ký", size large).
  - Submit button: `Gửi mã xác nhận` (Primary button, block, size large, loading indicator).

### D. Giao diện Step 1: Nhập OTP & Đặt mật khẩu mới
- Dòng hướng dẫn: `Nhập mã OTP gửi tới <email> (hoặc đọc từ log server khi lab bật expose OTP), rồi đặt mật khẩu mới.`
- `Form layout="vertical"`:
  - Input field: `otp` (Prefix `<SafetyOutlined />`, placeholder "Nhập mã 6 số", size large, maxLength=6).
  - Input password field: `password` (Prefix `<LockOutlined />`, placeholder "Mật khẩu mới", size large).
  - Input password field: `confirmPassword` (Prefix `<LockOutlined />`, placeholder "Xác nhận mật khẩu", size large).
  - Action button: `Đổi mật khẩu` (Primary button, block, size large, loading indicator).
  - Secondary action: `Gửi lại OTP` (Link button, block, quay lại Step 0).

---

## 4. INTERACTION SPECIFICATION

| Action | Trigger | Precondition | UI Processing | API Call | Result / Success | Error Handling |
|---|---|---|---|---|---|---|
| **Yêu cầu gửi OTP** | Click button "Gửi mã xác nhận" hoặc Enter tại Step 0 | Email hợp lệ theo RFC pattern | Bật `loading=true`, gọi API `sendForgotPasswordOtp` | `POST /api/v1/auth/forgot-password/otp`<br>`Body: { email }` | - Lưu email vào local state<br>- Nếu BE trả `otpCode` (lab mode), gọi `sendOtpEmail(username, email, otpCode)` qua EmailJS<br>- Hiển thị toast: *"Nếu email tồn tại trong hệ thống, mã OTP đã được gửi."*<br>- Chuyển sang `Step 1` | Bắt lỗi qua `extractApiError`, hiển thị toast lỗi, giữ nguyên Step 0 |
| **Xác nhận OTP & Đổi mật khẩu** | Click button "Đổi mật khẩu" hoặc Enter tại Step 1 | Đã nhập đủ OTP 6 số, Mật khẩu >= 6 ký tự, Xác nhận mật khẩu khớp | Bật `loading=true`, gọi API `resetPasswordWithOtp` | `POST /api/v1/auth/forgot-password/reset`<br>`Body: { email, otpCode, newPassword }` | - Hiển thị toast: *"Đổi mật khẩu thành công. Hãy đăng nhập bằng mật khẩu mới."*<br>- Điều hướng sang `/login` | Bắt lỗi qua `extractApiError` (ví dụ: OTP sai, OTP hết hạn, vượt quá 5 lần), hiển thị toast đỏ, cho phép nhập lại |
| **Quay lại gửi OTP** | Click button "Gửi lại OTP" | Đang ở Step 1 | Chuyển `currentStep` về 0 | Không gọi API | Mở lại form Step 0 với email đã nhập sẵn | N/A |
| **Hủy bỏ / Về Đăng nhập** | Click link "Đăng nhập" ở card footer | Không có | Điều hướng trình duyệt | Không gọi API | Mở `LoginPage` (`SCR-010`) | N/A |

---

## 5. DATA SPECIFICATION

| Tên Field | Nhãn UI | Kiểu Dữ Liệu | Bắt Buộc | Validation Rule (Frontend) | Validation Rule (Backend) | Nguồn Dữ Liệu |
|---|---|---|:---:|---|---|---|
| `email` | Địa chỉ Email | String | Có | Type email chuẩn, không rỗng (`rules: [{ required: true }, { type: 'email' }]`) | `@NotBlank`, `@Email`, Max 100 ký tự (`ForgotPasswordSendOtpRequest`) | Người dùng nhập |
| `otp` | Mã OTP | String | Có | Chuỗi đúng 6 ký tự (`rules: [{ required: true }, { len: 6 }]`), `maxLength={6}` | `@NotBlank`, `@Pattern(regexp = "^[0-9]{6}$")` (`ForgotPasswordResetRequest.otpCode`) | Người dùng nhận qua email / log |
| `password` | Mật khẩu mới | String | Có | Tối thiểu 6 ký tự (`rules: [{ required: true }, { min: 6 }]`) | `@NotBlank`, `@Size(min = 6)` (`ForgotPasswordResetRequest.newPassword`) | Người dùng nhập |
| `confirmPassword` | Xác nhận mật khẩu | String | Có | Phải trùng khớp tuyệt đối với `password` (`validator(_, value) => password === value`) | Frontend validation (không gửi lên BE DTO) | Người dùng nhập |

---

## 6. UI STATES & EDGE CASES

- **Initial State (Step 0):** Input Email trống, nút "Gửi mã xác nhận" active, Alert thông tin kết nối hiển thị.
- **Submitting Step 0:** Nút "Gửi mã xác nhận" hiển thị icon loading spinner, input Email bị disabled tạm thời.
- **Success Step 0 -> Transition to Step 1:** Thanh tiến trình Steps chuyển tick xanh cho Step 0, active Step 1; Form hiển thị 3 input: OTP, Mật khẩu mới, Xác nhận mật khẩu.
- **Validation Errors:**
  - Email sai định dạng: Hiện chữ đỏ *"Email không hợp lệ!"*.
  - OTP chưa đủ 6 số: Hiện chữ đỏ *"Mã OTP gồm 6 chữ số"*.
  - Mật khẩu mới < 6 ký tự: Hiện chữ đỏ *"Mật khẩu phải có ít nhất 6 ký tự"*.
  - Xác nhận mật khẩu không khớp: Hiện chữ đỏ *"Hai mật khẩu không khớp!"*.
- **API Error - Anti-Enumeration Behavior:**
  - Nếu email không tồn tại trong database, Backend cố tình trả về HTTP 200 `{ status: 200, message: "OK", data: { expiresInSeconds: 300 } }` để ngăn chặn kẻ xấu quét email người dùng (Anti User Enumeration Attack - `AuthServiceImpl.java:182-192`). Frontend vẫn báo thành công và chuyển sang Step 1.
- **API Error - Sai mã OTP / Hết hạn:**
  - Backend trả về HTTP 400 Bad Request kèm message *"Mã OTP không chính xác hoặc đã hết hạn."* hoặc *"Mã OTP đã vượt quá số lần thử tối đa (5 lần)."*.
  - Toast popup màu đỏ hiển thị lỗi chính xác từ backend thông qua `extractApiError`.

---

## 7. BACKEND MAPPING & EVIDENCE

### A. Controller Mapping
- **Controller File:** `smart-parking-service/src/main/java/com/backend/controller/AuthController.java`
- **Method 1:**
  ```java
  @PostMapping("/forgot-password/otp")
  public ResponseEntity<ApiResponse<SendOtpResponse>> sendForgotPasswordOtp(
          @Valid @RequestBody ForgotPasswordSendOtpRequest request) {
      return ResponseEntity.ok(new ApiResponse<>(200, "OK", authService.sendForgotPasswordOtp(request)));
  }
  ```
- **Method 2:**
  ```java
  @PostMapping("/forgot-password/reset")
  public ResponseEntity<ApiResponse<Void>> resetPassword(
          @Valid @RequestBody ForgotPasswordResetRequest request) {
      authService.resetPasswordWithOtp(request);
      return ResponseEntity.ok(new ApiResponse<>(200, "Đổi mật khẩu thành công.", null));
  }
  ```

### B. Service & Business Logic Evidence
- **Service Implementation:** `smart-parking-service/src/main/java/com/backend/service/impl/AuthServiceImpl.java`
  - `sendForgotPasswordOtp`:
    - Tìm kiếm người dùng theo email: `userRepository.findByEmail(email)`.
    - Tạo OTP ngẫu nhiên 6 chữ số: `String.format("%06d", secureRandom.nextInt(1_000_000))`.
    - Băm BCrypt: `passwordEncoder.encode(plainOtp)`.
    - Lưu vào bảng `otp_challenges` với `purpose = OtpPurposeEnum.FORGOT_PASSWORD`, `expiresAt = now + 300s`, `attemptCount = 0`.
    - Log mã OTP ra console nếu chưa cấu hình Mail Service thật: `log.info("FORGOT-PASSWORD OTP for email {} is {}", email, plainOtp)`.
  - `resetPasswordWithOtp`:
    - Tìm challenge OTP hợp lệ nhất: `otpChallengeRepository.findFirstByPhoneAndPurposeAndConsumedAtIsNullOrderByCreatedAtDesc(user.getPhone(), OtpPurposeEnum.FORGOT_PASSWORD)`.
    - Kiểm tra hết hạn: `challenge.getExpiresAt().isBefore(LocalDateTime.now())`.
    - Tăng `attemptCount++`, kiểm tra tối đa 5 lần: `if (challenge.getAttemptCount() > 5)`.
    - So sánh hash: `passwordEncoder.matches(request.getOtpCode(), challenge.getCodeHash())`.
    - Đánh dấu đã dùng: `challenge.setConsumedAt(LocalDateTime.now())`.
    - Cập nhật mật khẩu người dùng: `user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()))`.

### C. DTOs & Validation Evidence
- `ForgotPasswordSendOtpRequest.java`:
  - `email`: `@NotBlank(message = "Email không được để trống")`, `@Email(message = "Email không đúng định dạng")`.
- `ForgotPasswordResetRequest.java`:
  - `email`: `@NotBlank`, `@Email`.
  - `otpCode`: `@NotBlank`, `@Pattern(regexp = "^[0-9]{6}$", message = "Mã OTP phải gồm 6 chữ số")`.
  - `newPassword`: `@NotBlank`, `@Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")`.

### D. Security & Permissions
- `/api/v1/auth/forgot-password/**` được cấu hình `permitAll()` trong `SecurityConfig.java:60`.
- Không yêu cầu Bearer JWT token.

---

## 8. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá UX / Kỹ thuật | Khuyến nghị thiết kế lại |
|---|---|---|
| **Cơ chế gửi OTP qua EmailJS phía Client** | Rủi ro rò rỉ mã OTP nếu BE bật expose OTP trong JSON response (`response.otpCode`). Phụ thuộc cấu hình ServiceID EmailJS ở trình duyệt. | Backend cần tích hợp trực tiếp Spring Mail Starter / Amazon SES / SendGrid để gửi email ngầm từ server. Tuyệt đối không trả `otpCode` về client trong môi trường Production. |
| **Thiếu Countdown Timer hiển thị trực quan** | Khi ở Step 1, người dùng không biết mã OTP còn hiệu lực bao nhiêu giây (backend quy định 300 giây). Nút "Gửi lại OTP" bấm được ngay lập tức dẫn đến nguy cơ spam OTP. | Bổ sung đồng hồ đếm ngược trực quan 300s (hoặc đếm lùi 60s trước khi cho phép bấm gửi lại) giống như màn hình `RegisterPage`. |
| **Không hiển thị thông tin tài khoản gắn với email** | Người dùng có thể quên số điện thoại đăng nhập của mình, sau khi đổi mật khẩu xong lại không nhớ số điện thoại để đăng nhập. | Cân nhắc hiển thị gợi ý số điện thoại bị che (ví dụ: `098***1234`) sau khi xác thực OTP thành công để người dùng biết số điện thoại dùng để đăng nhập. |
