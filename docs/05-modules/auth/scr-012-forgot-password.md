# SCR-012: Khôi Phục Mật Khẩu Qua OTP (`ForgotPasswordPage`)

- **Screen ID:** `SCR-012`
- **Route:** `/forgot-password` (Public, liên kết từ `SCR-010` `/login`)
- **Nguồn thiết kế:** Stitch Variant 1 (`scr_012_kh_i_ph_c_m_t_kh_u_forgot_password_1/code.html`)
- **Trạng thái:** `UI_IMPLEMENTED` / `API_WIRED` / `MOCKED_E2E_VERIFIED` (chưa nghiệm thu SMTP live trên production)

## 1. Kiến trúc & Phân bổ Component (Component Placement)

| Thành phần | Đường dẫn | Phân tầng & Lý do |
|---|---|---|
| `AuthLayout` (`variant="recovery"`) | `src/layouts/AuthLayout.tsx` | Layout shell: giữ nguyên `default` cho Login/Register; bổ sung `recovery` centered shell theo Stitch bản 1. |
| `ForgotPasswordPage` | `src/features/auth/pages/ForgotPasswordPage.tsx` | Feature page: quản lý state 2 bước (`email` → `reset` → `success`), 2 deadline độc lập (`expiresInSeconds`, `resendAfterSeconds`), chống stale async response. |
| `ForgotPasswordEmailForm` | `src/features/auth/components/ForgotPasswordEmailForm.tsx` | Feature component (Bước 1): React Hook Form + Zod cho email. |
| `ForgotPasswordResetForm` | `src/features/auth/components/ForgotPasswordResetForm.tsx` | Feature component (Bước 2): React Hook Form + Zod cho OTP 6 chữ số, mật khẩu mới và xác nhận mật khẩu. |
| `forgotPasswordSchema` | `src/features/auth/model/forgotPasswordSchema.ts` | Feature model: chuẩn hóa email (`trim().toLowerCase()`, max 100), giữ số `0` đầu của OTP 6 chữ số, mật khẩu 6–50 ký tự không blank và không tự trim. |
| `forgotPassword` API | `src/features/auth/api/forgotPassword.ts` | Feature API: gọi `POST /api/v1/auth/forgot-password/otp` và `POST /api/v1/auth/forgot-password/reset`, không đọc `otpCode` từ response. |

## 2. Điều chỉnh Copy so với Stitch Prototype

- Loại bỏ thanh giả lập `TRÌNH GIẢ LẬP TRẠNG THÁI (TEST SCENARIOS)`, email mẫu (`dispatch.ops@vietlogistics.fretrix.vn`) và OTP mẫu (`984120`).
- Thay thế các nhãn giới hạn đối tượng (`Tài Khoản Quản Trị`, `Fretrix SSO`) và các tuyên bố kỹ thuật/chứng chỉ chưa xác minh (`ISO/IEC 27001:2022`, `AES-256-GCM`, `GATEWAY V4 / ZERO-GREEN CERTIFIED`, tổng đài `1900 6886`) bằng nội dung trung tính, đúng chức năng khôi phục mật khẩu cho mọi người dùng đã đăng ký email.
- Thay thế quy tắc mật khẩu prototype (8 ký tự, chữ HOA, chữ số) bằng quy tắc thực tế của backend: từ 6 đến 50 ký tự, không chỉ gồm khoảng trắng, xác nhận mật khẩu trùng khớp.
- Giữ thông báo gửi OTP ở dạng có điều kiện (`"Nếu email đã đăng ký..."`) ở cả Bước 2 để tuân thủ chống dò tìm tài khoản (Anti-User Enumeration).

