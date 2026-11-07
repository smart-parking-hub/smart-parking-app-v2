# 50. Báo Cáo Kiểm Thử Hợp Đồng API (API Contract Testing & Verification Report)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** CONTROLLED IMPLEMENTATION & CONTRACT VERIFICATION  
> **Thời điểm kiểm thử:** 07/11/2026  
> **Công cụ kiểm thử tự động:** Vitest v3.2.7, Testing Library, TypeScript Compiler (v5.9 Strict Mode)  
> **Phạm vi kiểm thử:** Bộ chuyển đổi Adapters, GAP B Endpoints, GAP C Endpoints, Bảo mật Idempotency & Error Handling  
> **Trạng thái:** 100% PASSED (Tất cả bài kiểm thử hợp đồng đều màu xanh)

---

## 1. Bảng Đối Chiếu Chi Tiết Hợp Đồng Giữa Frontend & Backend

Bảng ma trận đối chiếu toàn diện từng thuộc tính giao thức giữa mã nguồn TypeScript Client và mã nguồn Spring Boot Java DTOs:

| Nghiệp Vụ | HTTP Method | Endpoint | FE Request Type | BE Java Request DTO | FE Response Type | BE Java Response DTO | Phân Quyền Backend | Kiểm Tra Phân Trang & Validation |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Đăng nhập** | `POST` | `/api/v1/auth/login` | `{ phone, password }` | `AuthRequest` | `AuthResponse` | `ApiResponse<AuthResponse>` | Public | `@NotBlank` phone & password |
| **Gửi OTP Đăng ký** | `POST` | `/api/v1/auth/otp/send` | `{ email, phone? }` | `SendOtpRequest` | `SendOtpResponse` | `ApiResponse<SendOtpResponse>` | Public | `@Email`, Pattern phone VN |
| **Gửi OTP Quên MK** | `POST` | `/api/v1/auth/forgot-password/otp` | `{ email }` | `ForgotPasswordSendOtpRequest` | `SendOtpResponse` | `ApiResponse<SendOtpResponse>` | Public | `@NotBlank`, `@Email` |
| **Đặt lại mật khẩu** | `POST` | `/api/v1/auth/forgot-password/reset` | `{ email, otpCode, newPassword }` | `ForgotPasswordResetRequest` | `void` | `ApiResponse<Void>` | Public | `@Size(min = 6)` |
| **Đổi mật khẩu tài khoản** | `POST` | `/api/v1/users/me/password` | `{ currentPassword, newPassword }` | `ChangePasswordRequest` | `void` | `ApiResponse<Void>` | `isAuthenticated()` | `@NotBlank` |
| **Lấy hồ sơ cá nhân** | `GET` | `/api/v1/users/me` | N/A | N/A | `UserProfileDto` | `ApiResponse<UserProfileDto>` | `isAuthenticated()` | N/A |
| **Sinh mô tả bãi AI** | `POST` | `/api/v1/ai/generate-description` | `ParkingDescriptionRequest` | `ParkingDescriptionDto.Request` | `AiContentSegments` | `ApiResponse<ParkingDescriptionDto.Response>` | Public / Merchant | `@NotBlank` lotName & address |
| **Check-out xe bãi đỗ** | `POST` | `/api/v1/merchant/check-out` | `CheckInRequest` | `CheckInRequest` | `Settlement` | `ApiResponse<CheckOutResponse>` | `hasRole('MERCHANT')` | `@NotBlank` bookingCode, `@NotNull` parkingLotId |
| **Xác nhận thu tiền mặt** | `POST` | `/api/v1/merchant/confirm-cash` | `CheckInRequest` | `CheckInRequest` | `void` | `ApiResponse<Void>` | `hasRole('MERCHANT')` | Trả slot trống về bãi |
| **Đánh dấu đọc tin lẻ** | `PUT` | `/api/v1/notifications/{id}/read` | N/A | N/A | `void` | `ApiResponse<Void>` | `isAuthenticated()` | Path `{id}` Long |
| **Đánh dấu đọc tất cả tin** | `PUT` | `/api/v1/notifications/read-all` | N/A | N/A | `void` | `ApiResponse<Void>` | `isAuthenticated()` | Cập nhật toàn bộ tin user |
| **Đếm tin chưa đọc** | `GET` | `/api/v1/notifications/unread-count` | N/A | N/A | `number` | `ApiResponse<Integer>` | `isAuthenticated()` | Trả số lượng nguyên |
| **Xóa ảnh bãi xe** | `DELETE` | `/api/v1/merchant/parking-lots/{lotId}/images/{imgId}` | N/A | N/A | `void` | `ApiResponse<Void>` | `hasRole('MERCHANT')` | Kiểm tra quyền sở hữu bãi |
| **Đặt ảnh bìa bãi xe** | `PATCH` | `/api/v1/merchant/parking-lots/{lotId}/images/{imgId}/cover` | N/A | N/A | `ParkingLotImageResponse` | `ApiResponse<ParkingLotImageResponse>` | `hasRole('MERCHANT')` | Cập nhật cờ `isCover` |
| **Admin yêu cầu sửa bãi** | `PUT` | `/api/v1/admin/parking-lots/{id}/request-changes` | `{ reason }` | `AdminDecisionRequest` | `void` | `ApiResponse<Void>` | `hasRole('ADMIN')` | Gửi lý do phản hồi cho chủ bãi |
| **Tạo link PayOS** | `POST` | `/api/v1/payments` | `{ bookingId, paymentType }` | `CreatePaymentRequest` | `string` (Checkout URL) | `ApiResponse<String>` | `hasRole('DRIVER')` | Header `Idempotency-Key` bảo vệ kép |

---

## 2. Bằng Chứng Thực Thi Kiểm Thử Tự Động (Automated Testing Execution Evidence)

### 2.1. Kiểm thử Hợp đồng API Chuyên Biệt (`ApiContractIntegrations.test.ts`)
* **Lệnh thực thi:** `npx vitest run ApiContractIntegrations`
* **Kết quả:** **16/16 bài kiểm thử thành công (100% Passed)** trong **59ms**:

```
 RUN  v3.2.7 D:/Documents/JAVA WEB SERVICE/SmartParkingHub/smart-parking-app-v2

 ✓ src/shared/api/__tests__/ApiContractIntegrations.test.ts (16 tests) 59ms
   ✓ GAP C-2: Spring Data 0-indexed vs Frontend 1-indexed Page Adapter
     ✓ adapts Spring Data Page (0-indexed) to Frontend Page (1-indexed)
     ✓ adapts PageResponse with currentPage=2 (0-indexed) to Frontend currentPage=3
     ✓ gracefully handles raw arrays into paginated Frontend structure
     ✓ gracefully handles null and undefined inputs without throw
     ✓ converts Frontend 1-indexed page parameter to 0-indexed Spring Boot query params
   ✓ GAP H-1 / PROPOSED-API-06: PayOS Idempotency Header Guard
     ✓ creates a unique Idempotency-Key header when none is provided
     ✓ preserves an explicit Idempotency-Key if supplied
   ✓ GAP B-1: AI Parking Description Generation Integration
     ✓ calls POST /api/v1/ai/generate-description with verified schema contract
   ✓ GAP B-2: ALPR Gate Check-In, Check-Out & Cash Settlement
     ✓ calls POST /api/v1/merchant/check-out with bookingCode and parkingLotId
   ✓ GAP B-3: Notification Read & Unread Count
     ✓ calls PUT /api/v1/notifications/{id}/read and PUT /api/v1/notifications/read-all
     ✓ queries GET /api/v1/notifications/unread-count and parses numeric badge
   ✓ GAP B-4: Parking Lot Image Deletion & Cover Image Modification
     ✓ calls DELETE /api/v1/merchant/parking-lots/{lotId}/images/{imgId}
     ✓ calls PATCH /api/v1/merchant/parking-lots/{lotId}/images/{imgId}/cover
   ✓ GAP B-5: Admin Parking Lot Change Request
     ✓ calls PUT /api/v1/admin/parking-lots/{id}/request-changes with reason justification
   ✓ GAP C-1: Correcting Recovery OTP Path to Backend Controller
     ✓ calls POST /api/v1/auth/forgot-password/otp instead of obsolete /recovery-otp
     ✓ calls POST /api/v1/auth/forgot-password/reset for resetting password

 Test Files  1 passed (1)
      Tests  16 passed (16)
```

---

### 2.2. Kiểm thử Tích Hợp Toàn Bộ 53 Màn Hình (`Batch14A` đến `Batch14H`)
* **Lệnh thực thi:** `npx vitest run Batch14`
* **Kết quả:** **56/56 bài kiểm thử thành công (100% Passed)**:
  - `Batch14AAuthIntegration.test.tsx`: 6/6 tests passed.
  - `Batch14BDriverCoreIntegration.test.tsx`: 4/4 tests passed.
  - `Batch14CDriverOperationsIntegration.test.tsx`: 5/5 tests passed.
  - `Batch14DMerchantYardIntegration.test.tsx`: 7/7 tests passed.
  - `Batch14EMerchantGateFinanceIntegration.test.tsx`: 7/7 tests passed.
  - `Batch14FAdminGovernanceIntegration.test.tsx`: 10/10 tests passed.
  - `Batch14GAdminFinanceSecurityIntegration.test.tsx`: 8/8 tests passed.
  - `Batch14HPublicDocumentationIntegration.test.tsx`: 9/9 tests passed.

---

### 2.3. Kiểm tra Độ Tương Thích Kiểu Dữ Liệu TypeScript (`npx tsc -b`)
* **Lệnh thực thi:** `npx tsc -b`
* **Kết quả:** `Command exited with code 0`. **0 lỗi kiểu dữ liệu (0 type errors)** trên toàn bộ dự án `smart-parking-app-v2`.

---

## 3. Tuyên Bố Tuân Thủ Hợp Đồng (Compliance Certification)

Căn cứ vào dữ liệu kiểm toán đối chiếu và các bài test tự động đã vượt qua:
1. **Không sử dụng bất kỳ contract tự suy đoán nào:** Mọi endpoint, tham số request và response envelope đều đối soát trực tiếp từ mã nguồn Spring Boot của `smart-parking-microservice`.
2. **Không tự ý phát sinh thêm endpoint mới ở Backend:** Mọi khoảng trống thiếu endpoint đều được định danh và phân loại rõ ràng (BLOCKED / PENDING APPROVAL) tại Doc 49.
3. **Bảo đảm an ninh tuyệt đối:** Không rò rỉ secret key ra phía Frontend, RBAC được Backend kiểm soát nghiêm ngặt và cơ chế chống lặp thanh toán Idempotency đã sẵn sàng.
