# Chỉ Mục & Tổng Hợp Nhóm Màn Hình Xác Thực & Phân Quyền (SCR-010 đến SCR-013)

---

## 1. TỔNG QUAN NHÓM MÀN HÌNH

Nhóm màn hình Xác thực & Phân quyền (Authentication & Authorization) thuộc **Module 02: Authentication & Access Management**, chịu trách nhiệm toàn bộ chu trình truy cập của người dùng trên nền tảng SmartTruck Parking: từ tạo tài khoản, đăng nhập, bảo vệ phiên làm việc qua JWT token, khôi phục mật khẩu qua OTP, đến định tuyến không gian làm việc và kiểm soát quyền hạn (RBAC).

Tất cả 4 màn hình trong nhóm đã được khảo sát chuyên sâu (Deep Discovery) với bằng chứng mã nguồn 100% đối chiếu từ Frontend (`smart-parking-app`) đến Backend (`smart-parking-service`).

---

## 2. DANH SÁCH ĐẶC TẢ CHI TIẾT TỪNG MÀN HÌNH

| Screen ID | Tên Màn Hình | Route URL | File Component Frontend | Vai Trò Tiếp Cận | Trạng Thái Discovery | Tài Liệu Đặc Tả Chi Tiết |
|---|---|---|---|---|:---:|---|
| **SCR-010** | Đăng Nhập Tài Khoản (Login) | `/login` | `features/auth/pages/LoginPage.tsx` | Khách vãng lai / Mọi vai trò | `VERIFIED` | [SCR-010-login.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-010-login.md) |
| **SCR-011** | Đăng Ký Tài Khoản (Register) | `/register` | `features/auth/pages/RegisterPage.tsx` | Khách vãng lai mới | `VERIFIED` | [SCR-011-register.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-011-register.md) |
| **SCR-012** | Khôi Phục Mật Khẩu (Forgot Password) | `/forgot-password` | `features/auth/pages/ForgotPasswordPage.tsx` | Khách vãng lai / Quên mật khẩu | `VERIFIED` | [SCR-012-forgot-password.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-012-forgot-password.md) |
| **SCR-013** | Trang Từ Chối Truy Cập (Forbidden 403) | `/403` | `features/errors/pages/ForbiddenPage.tsx` | Mọi vai trò bị chặn phân quyền | `VERIFIED` | [SCR-013-forbidden.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/screens/SCR-013-forbidden.md) |

---

## 3. MA TRẬN ĐỐI CHIẾU FLOW NGHIỆP VỤ & API LIÊN QUAN

```mermaid
graph TD
    A[Khách vãng lai] -->|Vào /login| SCR010[SCR-010: LoginPage]
    SCR010 -->|Chưa có tài khoản| SCR011[SCR-011: RegisterPage]
    SCR010 -->|Quên mật khẩu| SCR012[SCR-012: ForgotPasswordPage]
    
    SCR011 -->|1. POST /api/v1/auth/otp/send| OTP1[Gửi OTP 6 số]
    OTP1 -->|2. POST /api/v1/auth/register| RegSuccess[Tạo User + Merchant Profile]
    RegSuccess -->|Điều hướng| SCR010

    SCR012 -->|1. POST /api/v1/auth/forgot-password/otp| OTP2[Gửi OTP 300s]
    OTP2 -->|2. POST /api/v1/auth/forgot-password/reset| ResetSuccess[Cập nhật Password Hash]
    ResetSuccess -->|Điều hướng| SCR010

    SCR010 -->|POST /api/v1/auth/login| LoginSuccess[Cấp JWT Bearer Token]
    LoginSuccess -->|Lưu session localStorage| Guard[ProtectedRoute Gatekeeper]
    
    Guard -->|Role == DRIVER| DriverHome[/dashboard]
    Guard -->|Role == MERCHANT| MerchantHome[/merchant/dashboard]
    Guard -->|Role == ADMIN| AdminHome[/admin/dashboard]
    
    Guard -->|Role không khớp allowedRoles| SCR013[SCR-013: ForbiddenPage]
    SCR013 -->|Bấm 'Về trang phù hợp'| Guard
```

---

## 4. BẢNG TỔNG HỢP API BACKEND LIÊN KẾT

| STT | Endpoint | Method | DTO Đầu Vào | DTO Đầu Ra | Controller & Method | Trạng Thái Bảo Vệ |
|:---:|---|:---:|---|---|---|:---:|
| 1 | `/api/v1/auth/login` | `POST` | `AuthRequest` | `ApiResponse<AuthResponse>` | `AuthController.login` | `permitAll()` |
| 2 | `/api/v1/auth/register` | `POST` | `RegisterRequest` | `ApiResponse<UserResponse>` | `AuthController.register` | `permitAll()` |
| 3 | `/api/v1/auth/otp/send` | `POST` | `SendOtpRequest` | `ApiResponse<SendOtpResponse>` | `AuthController.sendOtp` | `permitAll()` |
| 4 | `/api/v1/auth/forgot-password/otp` | `POST` | `ForgotPasswordSendOtpRequest` | `ApiResponse<SendOtpResponse>` | `AuthController.sendForgotPasswordOtp` | `permitAll()` |
| 5 | `/api/v1/auth/forgot-password/reset` | `POST` | `ForgotPasswordResetRequest` | `ApiResponse<Void>` | `AuthController.resetPassword` | `permitAll()` |
| 6 | `/api/v1/auth/logout` | `N/A` | *Không có API backend* | *Xóa token client-side* | *Stateless JWT Logout* | Client Purge |

---

*Ghi chú: Xem chi tiết cấu trúc trường, quy tắc kiểm tra dữ liệu và khuyến nghị thiết kế tại từng tài liệu màn hình độc lập.*
