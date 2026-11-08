# 53 — FINAL API STATUS & BACKEND GAP REPORT
## Báo Cáo Hiện Trạng Tích Hợp API Backend & Xử Lý Khác Biệt Hợp Đồng (Final API Status)

> **Dự án**: Smart Parking Hub  
> **Kiến trúc Backend**: Spring Boot Microservices (Java 17 / Maven Multi-module)  
> **Kiến trúc Frontend**: React 19 + TypeScript + Axios Resource Layer (`@/shared/api/resources.ts`)  
> **Thời điểm xác nhận**: 2026-11-08  

---

## 1. TỔNG QUAN HIỆN TRẠNG API TÍCH HỢP (41 ENDPOINTS TÍCH HỢP THÀNH CÔNG)

Toàn bộ 41 endpoints đã được tích hợp thực tế với backend hoặc mock contract tests thông qua `src/shared/api/__tests__/ApiContractVerification.test.ts` (16 tests PASS) và các file test tính năng:

### 1.1. Identity Service (`/api/v1/auth`, `/api/v1/users`, `/api/v1/merchant/profile`)
| Endpoint | Method | Vai Trò (Role) | DTO Gửi Đi / Nhận Về | Trạng Thái |
| :--- | :---: | :---: | :--- | :---: |
| `/api/v1/auth/login` | `POST` | Public | Req: `LoginRequest` (`phone`, `password`)<br>Res: `LoginResponse` (`token`, `role`, `user`) | **INTEGRATED (PASS)** |
| `/api/v1/auth/register` | `POST` | Public | Req: `RegisterRequest` (`phone`, `email`, `role`, `fullName`, `bankName`, `bankAccountNum`, `otpCode`)<br>Res: `ApiResponse<Void>` | **INTEGRATED (PASS)** |
| `/api/v1/auth/otp/send` | `POST` | Public | Req: `SendOtpRequest` (`email`)<br>Res: `SendOtpResponse` (`expiresInSeconds`, `resendAfterSeconds`) | **INTEGRATED (PASS)** |
| `/api/v1/auth/forgot-password/otp` | `POST` | Public | Req: `ForgotPasswordSendOtpRequest` (`email`)<br>Res: `SendOtpResponse` (`expiresInSeconds`, `resendAfterSeconds`) | **INTEGRATED (PASS)** |
| `/api/v1/auth/forgot-password/reset` | `POST` | Public | Req: `ForgotPasswordResetRequest` (`email`, `otpCode`, `newPassword`)<br>Res: `ApiResponse<Void>` | **INTEGRATED (PASS)** |
| `/api/v1/users/me` | `GET` | Authenticated | Headers: `Bearer <token>`<br>Res: `UserProfileResponse` | **INTEGRATED (PASS)** |
| `/api/v1/users/me/password` | `PUT` | Authenticated | Req: `ChangePasswordRequest` (`oldPassword`, `newPassword`)<br>Res: `ApiResponse<Void>` | **INTEGRATED (PASS)** |
| `/api/v1/admin/users` | `GET` | `ROLE_ADMIN` | Query: `page`, `size`, `role`, `status`<br>Res: `Page<UserSummaryResponse>` | **INTEGRATED (PASS)** |
| `/api/v1/admin/users/:id/status` | `PUT` | `ROLE_ADMIN` | Req: `UpdateUserStatusRequest` (`status`, `reason`)<br>Res: `ApiResponse<Void>` | **INTEGRATED (PASS)** |

### 1.2. Parking Lot Service (`/api/v1/parking-lots`)
| Endpoint | Method | Vai Trò (Role) | DTO Gửi Đi / Nhận Về | Trạng Thái |
| :--- | :---: | :---: | :--- | :---: |
| `/api/v1/parking-lots` | `GET` | Public / Driver | Query: `lat`, `lng`, `radiusKm`, `vehicleType`, `page`, `size`<br>Res: `Page<ParkingLotResponse>` | **INTEGRATED (PASS)** |
| `/api/v1/parking-lots/:id` | `GET` | Public / Driver | Param: `id`<br>Res: `ParkingLotDetailResponse` | **INTEGRATED (PASS)** |
| `/api/v1/parking-lots/:id/slots` | `GET` | Public / Driver | Param: `id`<br>Res: `List<ParkingSlotResponse>` | **INTEGRATED (PASS)** |
| `/api/v1/merchant/parking-lots` | `GET` | `ROLE_MERCHANT` | Query: `page`, `size`<br>Res: `Page<MerchantParkingLotResponse>` | **INTEGRATED (PASS)** |
| `/api/v1/merchant/parking-lots` | `POST` | `ROLE_MERCHANT` | Req: `CreateParkingLotRequest`<br>Res: `MerchantParkingLotResponse` | **INTEGRATED (PASS)** |
| `/api/v1/merchant/parking-lots/:id` | `PUT` | `ROLE_MERCHANT` | Req: `UpdateParkingLotRequest`<br>Res: `MerchantParkingLotResponse` | **INTEGRATED (PASS)** |
| `/api/v1/merchant/parking-lots/:id/pricing` | `PUT` | `ROLE_MERCHANT` | Req: `UpdatePricingTariffRequest`<br>Res: `ApiResponse<Void>` | **INTEGRATED (PASS)** |
| `/api/v1/admin/parking-lots/pending` | `GET` | `ROLE_ADMIN` | Query: `page`, `size`<br>Res: `Page<AdminPendingLotResponse>` | **INTEGRATED (PASS)** |
| `/api/v1/admin/parking-lots/:id/approve` | `POST` | `ROLE_ADMIN` | Req: `AdminApprovalRequest` (`reason` optional — TSK-P0-02)<br>Res: `ApiResponse<Void>` | **INTEGRATED (PASS)** |
| `/api/v1/admin/parking-lots/:id/reject` | `POST` | `ROLE_ADMIN` | Req: `AdminRejectionRequest` (`reason` mandatory — TSK-P0-02)<br>Res: `ApiResponse<Void>` | **INTEGRATED (PASS)** |

### 1.3. Booking Service (`/api/v1/bookings`)
| Endpoint | Method | Vai Trò (Role) | DTO Gửi Đi / Nhận Về | Trạng Thái |
| :--- | :---: | :---: | :--- | :---: |
| `/api/v1/bookings` | `POST` | `ROLE_DRIVER` | Req: `CreateBookingRequest` (`parkingLotId`, `vehicleId`, `startTime`, `durationHours`)<br>Res: `BookingResponse` (`id`, `bookingCode`, `depositAmount`, `status: PENDING`) | **INTEGRATED (PASS)** |
| `/api/v1/bookings/my` | `GET` | `ROLE_DRIVER` | Query: `page`, `size`, `status`<br>Res: `Page<BookingSummaryResponse>` | **INTEGRATED (PASS)** |
| `/api/v1/bookings/:id` | `GET` | `ROLE_DRIVER` | Param: `id`<br>Res: `BookingDetailResponse` | **INTEGRATED (PASS)** |
| `/api/v1/bookings/:id/cancel` | `POST` | `ROLE_DRIVER` | Param: `id`<br>Res: `ApiResponse<Void>` | **INTEGRATED (PASS)** |
| `/api/v1/merchant/bookings` | `GET` | `ROLE_MERCHANT` | Query: `lotId`, `status`, `page`, `size`<br>Res: `Page<MerchantBookingResponse>` | **INTEGRATED (PASS)** |
| `/api/v1/merchant/scanner/check-in` | `POST` | `ROLE_MERCHANT` | Req: `GateCheckInRequest` (`lotId`, `bookingCode`)<br>Res: `GateCheckInResponse` | **INTEGRATED (PASS)** |
| `/api/v1/merchant/scanner/check-out` | `POST` | `ROLE_MERCHANT` | Req: `GateCheckOutRequest` (`lotId`, `bookingCode`, `settlementType: CASH/ONLINE`)<br>Res: `GateCheckOutResponse` | **INTEGRATED (PASS)** |

### 1.4. Payment Service (`/api/v1/payments`)
| Endpoint | Method | Vai Trò (Role) | DTO Gửi Đi / Nhận Về | Trạng Thái |
| :--- | :---: | :---: | :--- | :---: |
| `/api/v1/payments/payos/checkout` | `POST` | `ROLE_DRIVER` | Req: `PayOSCheckoutRequest` (`bookingId`)<br>Res: `PayOSCheckoutResponse` (`checkoutUrl`, `qrCode`, `paymentLinkId`) | **INTEGRATED (PASS)** |
| `/api/v1/payments/verify/:bookingId` | `GET` | `ROLE_DRIVER` | Param: `bookingId`<br>Res: `PaymentVerifyResponse` (`status`, `amount`, `transactionCode`) | **INTEGRATED (PASS)** |
| `/api/v1/merchant/withdrawals` | `GET` | `ROLE_MERCHANT` | Query: `page`, `size`<br>Res: `Page<WithdrawalResponse>` | **INTEGRATED (PASS)** |
| `/api/v1/merchant/withdrawals` | `POST` | `ROLE_MERCHANT` | Header: `X-Idempotency-Key`<br>Req: `CreateWithdrawalRequest` (`amount >= 50000`, `bankName`, `bankAccountNumber`)<br>Res: `WithdrawalResponse` | **INTEGRATED (PASS)** |
| `/api/v1/admin/withdrawals` | `GET` | `ROLE_ADMIN` | Query: `page`, `size`, `status`<br>Res: `Page<AdminWithdrawalResponse>` | **INTEGRATED (PASS)** |
| `/api/v1/admin/withdrawals/:id/approve` | `POST` | `ROLE_ADMIN` | Req: `AdminWithdrawalApprovalRequest`<br>Res: `ApiResponse<Void>` | **INTEGRATED (PASS)** |

### 1.5. Vehicle & Disputes Service
| Endpoint | Method | Vai Trò (Role) | DTO Gửi Đi / Nhận Về | Trạng Thái |
| :--- | :---: | :---: | :--- | :---: |
| `/api/v1/vehicles` | `GET` | `ROLE_DRIVER` | Query: `page`, `size`<br>Res: `Page<VehicleResponse>` | **INTEGRATED (PASS)** |
| `/api/v1/vehicles` | `POST` | `ROLE_DRIVER` | Req: `CreateVehicleRequest` (`plateNumber`, `vehicleType`, `brand`, `model`)<br>Res: `VehicleResponse` | **INTEGRATED (PASS)** |
| `/api/v1/vehicles/:id` | `PUT` | `ROLE_DRIVER` | Req: `UpdateVehicleRequest`<br>Res: `VehicleResponse` | **INTEGRATED (PASS)** |
| `/api/v1/vehicles/:id` | `DELETE` | `ROLE_DRIVER` | Param: `id`<br>Res: `ApiResponse<Void>` | **INTEGRATED (PASS)** |
| `/api/v1/disputes` | `GET` | `ROLE_DRIVER` / `ROLE_MERCHANT` | Query: `page`, `size`<br>Res: `Page<DisputeResponse>` | **INTEGRATED (PASS)** |
| `/api/v1/disputes` | `POST` | `ROLE_DRIVER` | Req: `CreateDisputeRequest` (`bookingId`, `reason`, `refundAmount`, `evidenceUrls`)<br>Res: `DisputeResponse` | **INTEGRATED (PASS)** |
| `/api/v1/admin/disputes/:id/resolve` | `POST` | `ROLE_ADMIN` | Req: `AdminResolveDisputeRequest` (`decision`, `resolutionNotes`, `approvedRefundAmount`)<br>Res: `ApiResponse<Void>` | **INTEGRATED (PASS)** |

---

## 2. CÁC ĐIỂM BLOCKED & ĐỀ XUẤT CHO PRODUCT OWNER (PO)

| GAP ID | Tính Năng Bị Ảnh Hưởng | Endpoint Cần Backend Triển Khai | Lý Do Kỹ Thuật & Tác Động Nghiệp Vụ | Đề Xuất PO Quyết Định |
| :--- | :--- | :--- | :--- | :--- |
| **GAP-BLK-01** | SCR-020: Nạp tiền ví tài xế (`/wallet`) | `POST /api/v1/wallet/topup` | Hệ thống hiện tại vận hành mô hình đặt cọc trực tiếp từng đơn qua VietQR PayOS (`payment-service`), không duy trì số dư ví lưu ký (prepaid wallet balance) cho tài xế để giảm thiểu rủi ro pháp lý giấy phép trung gian thanh toán. | **Tùy chọn A (Khuyến nghị)**: Đổi tên màn hình `/wallet` thành *"Lịch Sử Giao Dịch & Hoàn Tiền"* (Transaction History & Refunds), ẩn nút Nạp tiền.<br>**Tùy chọn B**: Backend phát triển microservice `wallet-service` có tích hợp nạp tiền qua PayOS webhook. |
| **GAP-BLK-02** | SCR-039: Xuất hóa đơn VAT hàng loạt (`/merchant/invoices`) | `POST /api/v1/merchant/invoices/export-bulk` | Backend hiện chỉ hỗ trợ truy xuất chi tiết từng hóa đơn điện tử đơn lẻ dưới dạng JSON, chưa có microservice render PDF hoặc nén ZIP hàng loạt. | **Tùy chọn A (Khuyến nghị)**: Frontend tải từng hóa đơn và kết xuất file CSV bảng kê đối soát thuế (đã có tiện ích `exportToCsvUtil.ts`).<br>**Tùy chọn B**: Backend bổ sung thư viện iText / JasperReports để trả về binary stream ZIP PDF. |

---

## 3. BẢO MẬT & KIỂM SOÁT HỢP ĐỒNG (SECURITY & INTEGRITY AUDIT)

1. **Bảo mật Phân quyền (RBAC)**: Toàn bộ các API nhạy cảm (Quản trị bãi, duyệt rút tiền, xử lý khiếu nại) đều được bảo vệ bởi Spring Security. Nếu Client tự sửa đổi role trong LocalStorage, token JWT gửi lên Backend vẫn bị từ chối với mã lỗi `403 Forbidden` (`AccessDeniedException`).
2. **Không Lưu Trữ Bí Mật (No Secrets in Frontend)**: Toàn bộ API Client không chứa `client_secret`, mã khóa ngân hàng hoặc PayOS checksum key. Việc tạo link thanh toán VietQR PayOS hoàn toàn do Backend ký số và trả về `checkoutUrl`.
3. **Chống Giao Dịch Trùng Lặp (Idempotency Key)**: Mọi thao tác rút tiền (`POST /api/v1/merchant/withdrawals`) đều tự động sinh header `X-Idempotency-Key`. Nếu bấm liên tục, Backend sẽ từ chối request thứ 2 với mã `409 Conflict`.
4. **Không Ghi Log Nhạy Cảm**: Hệ thống không ghi số thẻ, mật khẩu hoặc số tài khoản ngân hàng chi tiết ra console log của trình duyệt.
