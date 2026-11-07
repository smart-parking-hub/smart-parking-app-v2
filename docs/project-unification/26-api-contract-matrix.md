# 26. Ma Trận Đối Chiếu Hợp Đồng API (API Contract Comparison Matrix)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** API DISCOVERY & CONTRACT AUDIT ONLY (Tuân thủ PROJECT UNIFICATION MASTER RULES — **Không sửa code**)  
> **Thời điểm khảo sát:** 07/11/2026  
> **Phương pháp đối chiếu:** So khớp trực tiếp từng trường dữ liệu giữa TypeScript Interfaces (FE) và Java DTOs/Spring Controllers (BE)  
> **Trạng thái:** VERIFIED 100%

---

## 1. Bảng Ma Trận Đối Chiếu Chi Tiết (Contract Comparison Matrix)

| Nghiệp Vụ (Feature) | FE Service / Hook | FE Endpoint Gọi | BE Endpoint Thực Tế | So Khớp Hợp Đồng (Contract Verification) | Trạng Thái (Status) |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Đăng nhập tài khoản** | `LoginForm.tsx` | `POST /api/v1/auth/login` | `POST /api/v1/auth/login` | **Trùng khớp 100%:** FE gửi `{ phone, password }` khớp `LoginRequest`. BE trả `AuthResponse` bọc trong `ApiResponse`. | ✅ **MATCHED** |
| **Đăng ký tài khoản** | `AuthForm.tsx` | `POST /api/v1/auth/register` | `POST /api/v1/auth/register` | **Trùng khớp 100%:** FE gửi `{ phone, password, role, fullName }` khớp `RegisterRequest`. | ✅ **MATCHED** |
| **Gửi OTP SMS đăng ký** | `AuthSession.tsx` | `POST /api/v1/auth/otp/send` | `POST /api/v1/auth/otp/send` | **Trùng khớp 100%:** FE gửi `{ phone }`, BE phát sinh OTP gửi SMS. | ✅ **MATCHED** |
| **Gửi OTP khôi phục MK** | `SmsRecoveryModal` | `POST /api/v1/auth/recovery-otp` | `POST /api/v1/auth/forgot-password/otp` | ⚠️ **Lệch URL Endpoint:** FE gọi `/recovery-otp`, BE đón nhận tại `/forgot-password/otp`. | ❌ **MISMATCH (GAP C)** |
| **Đặt lại mật khẩu OTP** | `PasswordResetCard` | `POST /api/v1/auth/forgot-password/reset`| `POST /api/v1/auth/forgot-password/reset`| **Trùng khớp:** `{ email, otpCode, newPassword }` khớp `ResetPasswordRequest`. | ✅ **MATCHED** |
| **Lấy hồ sơ cá nhân** | `AuthSession.tsx` | `GET /api/v1/users/me` | `GET /api/v1/users/me` | **Trùng khớp 100%:** Đọc JWT Bearer Header -> Trả `UserProfileResponse`. | ✅ **MATCHED** |
| **Cập nhật hồ sơ** | `DriverContactForm` | `PUT /api/v1/users/me` | `PUT /api/v1/users/me` | **Trùng khớp 100%:** `{ fullName, email, avatarUrl }`. | ✅ **MATCHED** |
| **Đổi mật khẩu** | `DriverPasswordForm`| `PUT /api/v1/users/me/password` | `PUT /api/v1/users/me/password` | **Trùng khớp:** `{ currentPassword, newPassword }`. | ✅ **MATCHED** |
| **Danh sách xe tài xế** | `VehiclesPage.tsx` | `GET /api/v1/vehicles` | `GET /api/v1/vehicles` | **Trùng khớp:** Trả `List<VehicleResponse>` (id, licensePlate, type, payload). | ✅ **MATCHED** |
| **Thêm xe mới** | `RegisterVehicleModal`| `POST /api/v1/vehicles` | `POST /api/v1/vehicles` | **Trùng khớp:** `{ licensePlate, vehicleType, payloadCapacity }`. | ✅ **MATCHED** |
| **Xóa xe** | `VehicleMasterTable`| `DELETE /api/v1/vehicles/{id}` | `DELETE /api/v1/vehicles/{id}` | **Trùng khớp:** Path variable `{id}`. | ✅ **MATCHED** |
| **Tìm kiếm bãi xe GPS**| `SearchParkingPage` | `GET /api/v1/parking-lots/search` | `GET /api/v1/parking-lots/search` | **Trùng khớp:** Query params `{ lat, lng, radius, vehicleType }`. | ✅ **MATCHED** |
| **Chi tiết bãi xe** | `ParkingDetailPage` | `GET /api/v1/parking-lots/{id}` | `GET /api/v1/parking-lots/{id}` | **Trùng khớp:** Trả `ParkingLotDetailResponse` kèm ảnh và tiện ích. | ✅ **MATCHED** |
| **Sơ đồ slot bãi xe** | `ParkingDetailPage` | `GET /api/v1/parking-lots/{id}/slots` | `GET /api/v1/parking-lots/{id}/slots` | **Trùng khớp:** Trả `List<SlotResponse>` (slotNumber, vehicleType, status). | ✅ **MATCHED** |
| **Bảng cước niêm yết** | `ParkingDetailPage` | `GET /api/v1/parking-lots/{id}/pricing` | `GET /api/v1/parking-lots/{id}/pricing` | **Trùng khớp:** Trả `List<PricingRuleResponse>`. | ✅ **MATCHED** |
| **Danh sách vé của tôi** | `MyBookingsPage.tsx` | `GET /api/v1/bookings` | `GET /api/v1/bookings` | ⚠️ **Lệch Phân Trang:** BE trả Spring Page `{ number, size, totalElements }`, FE đợi `{ currentPage }`. | ⚠️ **MISMATCH (GAP C)** |
| **Chi tiết vé đỗ** | `BookingDetailPage` | `GET /api/v1/bookings/{id}` | `GET /api/v1/bookings/{id}` | **Trùng khớp:** Trả `BookingDetailResponse` kèm mã barcode và stepper. | ✅ **MATCHED** |
| **Khởi tạo đặt chỗ** | `BookingPaymentModal`| `POST /api/v1/bookings` | `POST /api/v1/bookings` | **Trùng khớp:** `{ parkingLotId, vehicleId, startTime, durationHours }`. | ✅ **MATCHED** |
| **Hủy vé đặt chỗ** | `CancelBookingModal` | `POST /api/v1/bookings/{id}/cancel` | `POST /api/v1/bookings/{id}/cancel` | **Trùng khớp:** `{ reason }` -> Trả `CancelBookingResponse` kèm refund fee. | ✅ **MATCHED** |
| **Tạo VietQR PayOS** | `PayOsCheckoutModal` | `POST /api/v1/payments/payos/create-deposit-link` | `POST /api/v1/payments/payos/create-deposit-link` | **Trùng khớp:** `{ bookingId, returnUrl, cancelUrl }` -> Trả `{ checkoutUrl, orderCode }`. | ✅ **MATCHED** |
| **Đồng bộ thanh toán** | `PaymentReturnPage` | `POST /api/v1/payments/sync` | `POST /api/v1/payments/sync` | **Trùng khớp:** `{ orderCode, paymentLinkId, bookingId }`. | ✅ **MATCHED** |
| **Hàng đợi ảo bãi xe** | `QueueCommandToolbar`| `GET /api/v1/queues/me` | `GET /api/v1/queues/me` | **Trùng khớp:** Trả `QueuePositionResponse` (position, estimatedWaitMinutes). | ✅ **MATCHED** |
| **Chấp nhận slot trống**| `AcceptQueueSuccess`| `POST /api/v1/queues/{id}/accept` | `POST /api/v1/queues/{id}/accept` | **Trùng khớp:** Chuyển hàng đợi thành Booking chính thức. | ✅ **MATCHED** |
| **Đánh giá chấm sao** | `ReviewBookingModal` | `POST /api/v1/reviews` | `POST /api/v1/reviews` | **Trùng khớp:** `{ bookingId, parkingLotId, rating, comment }`. | ✅ **MATCHED** |
| **Bãi xe của Chủ bãi** | `MerchantParkingLots`| `GET /api/v1/merchant/parking-lots` | `GET /api/v1/merchant/parking-lots` | **Trùng khớp:** Trả `Page<ParkingLotSummaryResponse>`. | ✅ **MATCHED** |
| **Tạo bãi xe mới** | `CreateParkingLot` | `POST /api/v1/merchant/parking-lots` | `POST /api/v1/merchant/parking-lots` | **Trùng khớp:** `{ name, address, latitude, longitude, totalSlots }`. | ✅ **MATCHED** |
| **Upload ảnh bãi xe** | `CreateParkingLot` | `POST /api/v1/merchant/parking-lots/{id}/images` | `POST /api/v1/merchant/parking-lots/{id}/images` | **Trùng khớp:** Multipart file upload. | ✅ **MATCHED** |
| **Xóa ảnh bãi xe** | `EditMerchantPhotos`| `DELETE .../images/{imageId}` | `DELETE .../images/{imageId}` | **Backend có sẵn nhưng FE chưa gọi!** | ⚠️ **UNINTEGRATED (GAP B)** |
| **Cấu hình sơ đồ slot** | `MerchantSlotsPage` | `POST /api/v1/merchant/parking-lots/{id}/slots/bulk` | `POST /api/v1/merchant/parking-lots/{id}/slots/bulk` | **Trùng khớp:** `{ slots: [{ vehicleType, totalCapacity }] }`. | ✅ **MATCHED** |
| **Cấu hình bảng giá** | `MerchantPricing` | `POST /api/v1/merchant/parking-lots/{id}/pricing/bulk` | `POST /api/v1/merchant/parking-lots/{id}/pricing/bulk` | **Trùng khớp:** `{ rules: [{ vehicleType, blockPrice, hourlyPrice }] }`. | ✅ **MATCHED** |
| **ALPR Cổng Check-In** | `AlprGateController` | `POST /api/v1/merchant/check-in` | `POST /api/v1/merchant/check-in` | **Trùng khớp:** `{ bookingCode, vehiclePlate, gateId }`. | ✅ **MATCHED** |
| **ALPR Cổng Check-Out**| N/A | Chưa có trên FE | `POST /api/v1/merchant/check-out` | ⚠️ **Backend có sẵn nhưng FE chưa có giao diện gọi!** | ⚠️ **UNINTEGRATED (GAP B)** |
| **Xác nhận trả tiền mặt**| `RecentCheckinTable`| `POST /api/v1/merchant/confirm-cash`| `POST /api/v1/merchant/confirm-cash`| **Trùng khớp:** `{ bookingId, amountReceived }`. | ✅ **MATCHED** |
| **Doanh thu Chủ bãi** | `RevenueChartPanel` | `GET /api/v1/merchant/revenue` | `GET /api/v1/merchant/revenue` | **Trùng khớp:** `{ period: 'day' \| 'week' \| 'month' }`. | ✅ **MATCHED** |
| **Tạo lệnh rút tiền** | `FinancePages.tsx` | `POST /api/v1/withdrawals` | `POST /api/v1/withdrawals` | **Trùng khớp:** `{ amount, bankName, bankAccountNumber, accountHolder }`. | ✅ **MATCHED** |
| **Danh sách thông báo**| `NotificationsPage` | `GET /api/v1/notifications` | `GET /api/v1/notifications` | **Trùng khớp:** Trả `Page<NotificationResponse>`. | ✅ **MATCHED** |
| **Đánh dấu đã đọc** | N/A | Chưa gọi | `PUT /api/v1/notifications/{id}/read` | **Backend có sẵn nhưng FE chưa gọi!** | ⚠️ **UNINTEGRATED (GAP B)** |
| **Đếm tin chưa đọc** | N/A | Chưa gọi | `GET /api/v1/notifications/unread-count`| **Backend có sẵn nhưng FE chưa gọi!** | ⚠️ **UNINTEGRATED (GAP B)** |
| **Chatbot AI Copilot** | `CopilotWidget` | `POST /api/v1/ai/chat` | `POST /api/v1/ai/chat` | **Trùng khớp:** `{ message }` -> Trả `{ replyText, toolResults }`. | ✅ **MATCHED** |
| **Sinh mô tả bằng AI** | N/A | Chưa có trên FE | `POST /api/v1/ai/generate-description` | ⚠️ **Backend có tính năng AI cực hay nhưng FE chưa gắn nút gọi!** | ⚠️ **UNINTEGRATED (GAP B)** |
| **Dashboard Admin** | `AdminDashboard` | `GET /api/v1/admin/dashboard` | `GET /api/v1/admin/dashboard` | **Trùng khớp:** Trả tổng doanh số, hoa hồng sàn, tổng xe. | ✅ **MATCHED** |
| **Admin Quản lý Users** | `AdminUsersPage` | `GET /api/v1/admin/users` | `GET /api/v1/admin/users` | **Trùng khớp:** Trả danh sách người dùng kèm phân quyền. | ✅ **MATCHED** |
| **Admin Khóa User** | `AdminUsersPage` | `PUT /api/v1/admin/users/{id}/ban` | `PUT /api/v1/admin/users/{id}/ban` | **Trùng khớp:** Khóa tài khoản kèm lý do. | ✅ **MATCHED** |
| **Admin Duyệt Bãi Xe**| `AdminParkingLots` | `PUT /api/v1/admin/parking-lots/{id}/approve` | `PUT /api/v1/admin/parking-lots/{id}/approve` | **Trùng khớp:** Kích hoạt bãi xe `ACTIVE`. | ✅ **MATCHED** |
| **Admin Từ Chối Bãi** | `AdminParkingLots` | `PUT /api/v1/admin/parking-lots/{id}/reject` | `PUT /api/v1/admin/parking-lots/{id}/reject` | **Trùng khớp:** `{ reason }`. | ✅ **MATCHED** |
| **Admin Tra Soát Tiền**| `AdminTransactions` | `GET /api/v1/admin/transactions` | `GET /api/v1/admin/transactions` | **Trùng khớp:** Danh sách giao dịch cổng PayOS. | ✅ **MATCHED** |
| **Admin Duyệt Rút Tiền**| `AdminWithdrawals` | `PUT /api/v1/admin/withdrawals/{id}/approve` | `PUT /api/v1/admin/withdrawals/{id}/approve` | **Trùng khớp:** Kích hoạt chi tiền tự động. | ✅ **MATCHED** |
| **Admin Nhật Ký Log** | `AdminAuditLogs` | `GET /api/v1/admin/audit-logs` | `GET /api/v1/admin/audit-logs` | **Trùng khớp:** Truy vấn log bảo mật JSON. | ✅ **MATCHED** |

---

## 2. Thống Kê Tỷ Lệ Khớp Hợp Đồng
* **Tổng số cặp tương tác đối chiếu:** **48 cặp nghiệp vụ chính**.
* **Khớp hoàn toàn 100% (MATCHED):** **41 / 48 (85.4%)**.
* **Backend có sẵn nhưng Frontend chưa tích hợp (GAP B):** **5 / 48 (10.4%)**.
* **Lệch cấu trúc hợp đồng / URL (GAP C):** **2 / 48 (4.2%)**.
