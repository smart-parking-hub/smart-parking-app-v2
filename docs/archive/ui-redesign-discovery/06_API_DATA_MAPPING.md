# Đối Chiếu API & Bản Đồ Dữ Liệu (API and Data Mapping)

Tài liệu này xác lập mối liên kết toàn diện từ **Màn hình giao diện (Screen)** → **Thành phần (Component)** → **Thao tác người dùng (User Action)** → **Giao thức REST API** → **Dữ liệu đầu vào (Request)** → **Dữ liệu phản hồi (Response)** → **Thực thể cơ sở dữ liệu (Database Entity)**.

---

## 1. Bảng Tổng Hợp Ánh Xạ Màn Hình ↔ API ↔ Mã Nguồn Backend

| Màn Hình UI | Thao Tác (Action) | HTTP Method & Endpoint | Request Body / Params | Response Data | Vị Trí Frontend Gọi | Vị Trí Backend Xử Lý | Quyền Hạn (Auth & Role) |
|---|---|---|---|---|---|---|:---:|
| `SCR-010: LoginPage` | Bấm "Đăng nhập" | `POST /api/v1/auth/login` | `{ phone, password }` | `{ token, role }` | `features/auth/api/authApi.ts` | `AuthController.java` → `AuthServiceImpl.java` | Public (`PermitAll`) |
| `SCR-011: RegisterPage` | Bấm "Gửi OTP" | `POST /api/v1/auth/otp/send` | `{ phone }` | `{ expiresInSeconds, otpCode? }` | `features/auth/api/authApi.ts` | `AuthController.java` | Public (`PermitAll`) |
| `SCR-011: RegisterPage` | Bấm "Đăng ký" | `POST /api/v1/auth/register` | `{ phone, email, password, otpCode, role, fullName, ... }` | `ApiResponse<null>` | `features/auth/api/authApi.ts` | `AuthController.java` → `AuthServiceImpl.java` | Public (`PermitAll`) |
| `SCR-012: ForgotPassword` | Bấm "Đặt lại mật khẩu" | `POST /api/v1/auth/forgot-password/reset` | `{ email, otpCode, newPassword }` | `ApiResponse<null>` | `features/auth/api/authApi.ts` | `AuthController.java` | Public (`PermitAll`) |
| `SCR-014: DashboardHomePage` | Tải dữ liệu trang chủ | `GET /api/v1/bookings` | `Pageable { page: 0, size: 5 }` | `PageResponse<BookingDto>` | `features/bookings/api/bookingApi.ts` | `BookingController.java` | `hasRole('DRIVER')` |
| `SCR-015: SearchParkingPage` | Tìm kiếm bản đồ | `GET /api/v1/parking-lots/search` | `params: { vehicleType, latitude, longitude, radiusKm, sort }` | `ApiResponse<ParkingLotDto[]>` | `features/parking-search/api/parkingApi.ts` | `ParkingLotController.java` → `ParkingLotServiceImpl.java` | `hasRole('DRIVER')` |
| `SCR-016: ParkingDetailPage` | Xem chi tiết bãi | `GET /api/v1/parking-lots/{id}` | Path variable `id` | `ApiResponse<ParkingLotDto>` | `features/parking-search/api/parkingApi.ts` | `ParkingLotController.java` | Authenticated |
| `SCR-016: ParkingDetailPage` | Bấm "Đặt giữ chỗ" | `POST /api/v1/bookings` | `{ parkingLotId, vehicleId, startTime, endTime }` | `ApiResponse<BookingDto>` | `features/bookings/api/bookingApi.ts` | `BookingController.java` → `BookingServiceImpl.java` | `hasRole('DRIVER')` |
| `SCR-016: ParkingDetailPage` | Tham gia hàng đợi | `POST /api/v1/queues` | `{ parkingLotId, vehicleType }` | `ApiResponse<QueueDto>` | `features/queues/api/queueApi.ts` | `QueueController.java` | `hasRole('DRIVER')` |
| `SCR-017: MyBookingsPage` | Tải danh sách đơn | `GET /api/v1/bookings` | `Pageable { page, size, sort }` | `PageResponse<BookingDto>` | `features/bookings/api/bookingApi.ts` | `BookingController.java` | `hasRole('DRIVER')` |
| `SCR-017: MyBookingsPage` | Bấm "Hủy đặt chỗ" | `POST /api/v1/bookings/{id}/cancel` | `{ reason }` | `ApiResponse<Void>` | `features/bookings/api/bookingApi.ts` | `BookingController.java` → `BookingServiceImpl.java` | `hasRole('DRIVER')` (Own) |
| `SCR-017: MyBookingsPage` | Bấm "Thanh toán cọc" | `POST /api/v1/payments` | `{ bookingId }` | `ApiResponse<String>` (PayOS URL) | `features/bookings/api/bookingApi.ts` | `PaymentController.java` → `PaymentServiceImpl.java` | `hasRole('DRIVER')` (Own) |
| `SCR-017: MyBookingsPage` | Gửi đánh giá sao | `POST /api/v1/reviews` | `{ bookingId, rating, comment }` | `ApiResponse<ReviewDto>` | `features/reviews/api/reviewApi.ts` | `ReviewController.java` → `ReviewServiceImpl.java` | `hasRole('DRIVER')` (Own) |
| `SCR-018: DriverQueuesPage` | Xem hàng đợi của tôi | `GET /api/v1/queues/my` | Không có | `QueueDto[]` | `features/queues/api/queueApi.ts` | `QueueController.java` | `hasRole('DRIVER')` |
| `SCR-018: DriverQueuesPage` | Nhận slot được cấp | `POST /api/v1/queues/{id}/accept` | Path variable `id` | `ApiResponse<BookingDto>` | `features/queues/api/queueApi.ts` | `QueueController.java` | `hasRole('DRIVER')` |
| `SCR-018: DriverQueuesPage` | Rời hàng đợi | `POST /api/v1/queues/{id}/leave` | Path variable `id` | `ApiResponse<Void>` | `features/queues/api/queueApi.ts` | `QueueController.java` | `hasRole('DRIVER')` |
| `SCR-019: DriverPaymentsPage`| Xem lịch sử nộp tiền | `GET /api/v1/payments/my` | `Pageable` | `PageResponse<PaymentDto>` | `features/payments/api/paymentApi.ts` | `PaymentController.java` | `hasRole('DRIVER')` |
| `SCR-020: VehiclesPage` | Tải danh sách xe | `GET /api/v1/vehicles` | `Pageable` | `PageResponse<VehicleDto>` | `features/vehicles/api/vehicleApi.ts` | `VehicleController.java` → `VehicleServiceImpl.java` | `hasRole('DRIVER')` |
| `SCR-020: VehiclesPage` | Thêm xe mới | `POST /api/v1/vehicles` | `{ licensePlate, vehicleType, weightTon, brandModel }` | `ApiResponse<VehicleDto>` | `features/vehicles/api/vehicleApi.ts` | `VehicleController.java` | `hasRole('DRIVER')` |
| `SCR-020: VehiclesPage` | Sửa thông tin xe | `PUT /api/v1/vehicles/{id}` | `{ licensePlate, vehicleType, weightTon, brandModel }` | `ApiResponse<VehicleDto>` | `features/vehicles/api/vehicleApi.ts` | `VehicleController.java` | `hasRole('DRIVER')` (Own) |
| `SCR-020: VehiclesPage` | Xóa phương tiện | `DELETE /api/v1/vehicles/{id}`| Path variable `id` | `ApiResponse<Void>` | `features/vehicles/api/vehicleApi.ts` | `VehicleController.java` | `hasRole('DRIVER')` (Own) |
| `SCR-026: MerchantDashboard` | Lấy doanh thu bãi | `GET /api/v1/merchant/revenue` | `params: { startDate, endDate, granularity }` | `ApiResponse<MerchantRevenue>` | `features/dashboard/api/merchantDashboardApi.ts` | `MerchantController.java` / `ParkingLotController.java` | `hasRole('MERCHANT')` |
| `SCR-028: MerchantParkingLots`| Lấy danh sách bãi của mình| `GET /api/v1/merchant/parking-lots` | `Pageable` | `PageResponse<MerchantParkingLot>` | `features/merchant/parking-lots/api/merchantParkingLotApi.ts` | `ParkingLotController.java` | `hasRole('MERCHANT')` |
| `SCR-029: CreateParkingLot` | Đăng ký bãi đỗ mới | `POST /api/v1/merchant/parking-lots` | `{ name, address, latitude, longitude, contactPhone, description }` | `ApiResponse<MerchantParkingLot>` | `features/merchant/parking-lots/api/merchantParkingLotApi.ts` | `ParkingLotController.java` | `hasRole('MERCHANT')` |
| `SCR-029: CreateParkingLot` | Tải lên bộ ảnh bãi | `POST /api/v1/merchant/parking-lots/{id}/images` | `multipart/form-data: files[]` | `ApiResponse<ParkingLotImage[]>` | `features/merchant/parking-lots/api/merchantParkingLotApi.ts` | `ParkingLotController.java` | `hasRole('MERCHANT')` (Own) |
| `SCR-031: EditParkingLot` | Cập nhật bãi đỗ | `PUT /api/v1/merchant/parking-lots/{id}` | `{ name, address, latitude, longitude, contactPhone, description }` | `ApiResponse<MerchantParkingLot>` | `features/merchant/parking-lots/api/merchantParkingLotApi.ts` | `ParkingLotController.java` | `hasRole('MERCHANT')` (Own) |
| `SCR-032: MerchantSlotsPage` | Xem slot hiện tại | `GET /api/v1/parking-lots/{id}/slots` | Path variable `id` | `ApiResponse<MerchantSlot[]>` | `features/merchant/parking-lots/api/merchantParkingLotApi.ts` | `ParkingLotController.java` | Public / Merchant |
| `SCR-032: MerchantSlotsPage` | Cấu hình slot đơn lẻ | `PUT /api/v1/merchant/parking-lots/{id}/slots` | `{ vehicleType, totalCapacity }` | `ApiResponse<MerchantSlot>` | `features/merchant/parking-lots/api/merchantParkingLotApi.ts` | `ParkingLotController.java` | `hasRole('MERCHANT')` (Own) |
| `SCR-032: MerchantSlotsPage` | Cấu hình slot hàng loạt | `PUT /api/v1/merchant/parking-lots/{id}/slots/bulk` | `{ slots: [{ vehicleType, totalCapacity }] }` | `ApiResponse<MerchantSlot[]>` | `features/merchant/parking-lots/api/merchantParkingLotApi.ts` | `ParkingLotController.java` | `hasRole('MERCHANT')` (Own) |
| `SCR-033: MerchantPricingPage`| Xem bảng giá | `GET /api/v1/parking-lots/{id}/pricing` | Path variable `id` | `ApiResponse<MerchantPricingRule[]>` | `features/merchant/parking-lots/api/merchantParkingLotApi.ts` | `ParkingLotController.java` | Public / Merchant |
| `SCR-033: MerchantPricingPage`| Cấu hình giá đơn lẻ | `PUT /api/v1/merchant/parking-lots/{id}/pricing` | `{ vehicleType, hourlyRate, overnightRate, overtimeHourlyRate, depositAmount }` | `ApiResponse<MerchantPricingRule>` | `features/merchant/parking-lots/api/merchantParkingLotApi.ts` | `ParkingLotController.java` | `hasRole('MERCHANT')` (Own) |
| `SCR-033: MerchantPricingPage`| Cấu hình giá hàng loạt | `PUT /api/v1/merchant/parking-lots/{id}/pricing/bulk` | `{ pricingRules: [...] }` | `ApiResponse<MerchantPricingRule[]>` | `features/merchant/parking-lots/api/merchantParkingLotApi.ts` | `ParkingLotController.java` | `hasRole('MERCHANT')` (Own) |
| `SCR-034: MerchantBookings` | Danh sách đặt chỗ tại bãi | `GET /api/v1/merchant/bookings` | `params: { page, size, parkingLotId }` | `PageResponse<BookingDto>` | `features/merchant/bookings/api/merchantBookingApi.ts` | `BookingController.java` / `MerchantController.java` | `hasRole('MERCHANT')` (Own) |
| `SCR-036: MerchantQrScanner`| Quét QR xe vào bãi | `POST /api/v1/merchant/check-in` | `{ bookingCode, parkingLotId }` | `ApiResponse<String>` | `features/merchant/qr-scanner/api/merchantQrApi.ts` | `MerchantController.java` → `CheckInOutServiceImpl.java` | `hasRole('MERCHANT')` |
| `SCR-036: MerchantQrScanner`| Quét QR xe ra bãi | `POST /api/v1/merchant/check-out` | `{ bookingCode, parkingLotId }` | `ApiResponse<CheckOutResponse>` | `features/merchant/qr-scanner/api/merchantQrApi.ts` | `MerchantController.java` → `CheckInOutServiceImpl.java` | `hasRole('MERCHANT')` |
| `SCR-036: MerchantQrScanner`| Xác nhận thu tiền mặt | `POST /api/v1/merchant/confirm-cash` | `{ bookingCode, parkingLotId }` | `ApiResponse<CheckOutResponse>` | `features/merchant/qr-scanner/api/merchantQrApi.ts` | `MerchantController.java` | `hasRole('MERCHANT')` |
| `SCR-038: MerchantWithdrawals`| Tạo yêu cầu rút tiền | `POST /api/v1/withdrawals` | `{ amount, bankName, bankAccount }` | `ApiResponse<WithdrawalResponse>` | `features/merchant/withdrawals/api/merchantWithdrawalApi.ts` | `WithdrawalController.java` → `WithdrawalServiceImpl.java` | `hasRole('MERCHANT')` |
| `SCR-038: MerchantWithdrawals`| Xem lịch sử rút tiền | `GET /api/v1/withdrawals` | `Pageable` | `PageResponse<WithdrawalResponse>` | `features/merchant/withdrawals/api/merchantWithdrawalApi.ts` | `WithdrawalController.java` | `hasRole('MERCHANT')` (Own) |
| `SCR-042: AdminDashboard` | Lấy dữ liệu vĩ mô | `GET /api/v1/admin/dashboard` | Không có | `ApiResponse<AdminDashboardSummary>` | `features/admin/api/adminRepository.ts` | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-043: AdminParkingLots` | Danh sách bãi chờ duyệt | `GET /api/v1/admin/parking-lots` | `params: { page, size, sort }` | `PageResponse<AdminParkingLot>` | `features/admin/api/adminRepository.ts` | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-044: AdminLotDetail` | Phê duyệt bãi đỗ | `PUT /api/v1/admin/parking-lots/{id}/approve` | `{ reason }` | `ApiResponse<Void>` | `features/admin/api/adminRepository.ts` | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-044: AdminLotDetail` | Từ chối bãi đỗ | `PUT /api/v1/admin/parking-lots/{id}/reject` | `{ reason }` | `ApiResponse<Void>` | `features/admin/api/adminRepository.ts` | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-045: AdminUsersPage` | Danh sách người dùng | `GET /api/v1/admin/users` | `params: { page, size }` | `PageResponse<AdminUser>` | `features/admin/api/adminRepository.ts` | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-045: AdminUsersPage` | Khóa tài khoản người dùng | `PUT /api/v1/admin/users/{id}/ban` | `{ reason }` | `ApiResponse<Void>` | `features/admin/api/adminRepository.ts` | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-045: AdminUsersPage` | Mở khóa tài khoản | `PUT /api/v1/admin/users/{id}/unban` | `{ reason }` | `ApiResponse<Void>` | `features/admin/api/adminRepository.ts` | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-047: AdminTransactions` | Nhật ký giao dịch | `GET /api/v1/admin/transactions` | `Pageable` | `PageResponse<AdminTransaction>` | `features/admin/api/adminRepository.ts` | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-048: AdminWithdrawals` | Danh sách rút tiền | `GET /api/v1/admin/withdrawals` | `Pageable` | `PageResponse<AdminWithdrawal>` | `features/admin/api/adminRepository.ts` | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-048: AdminWithdrawals` | Duyệt lệnh chi tiền | `PUT /api/v1/admin/withdrawals/{id}/approve` | `{ reason }` | `ApiResponse<Void>` | `features/admin/api/adminRepository.ts` | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-048: AdminWithdrawals` | Từ chối lệnh chi tiền | `PUT /api/v1/admin/withdrawals/{id}/reject` | `{ reason }` | `ApiResponse<Void>` | `features/admin/api/adminRepository.ts` | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-049: AdminDisputes` | Danh sách khiếu nại | `GET /api/v1/disputes/admin` | `Pageable` | `PageResponse<AdminDispute>` | `features/admin/api/adminRepository.ts` | `AdminController.java` / `DisputeController.java` | `hasRole('ADMIN')` |
| `SCR-050: AdminDisputeDetail` | Phán quyết khiếu nại | `PUT /api/v1/disputes/{id}/resolve` | `{ resolution }` | `ApiResponse<AdminDispute>` | `features/admin/api/adminRepository.ts` | `DisputeController.java` | `hasRole('ADMIN')` |
| `SCR-051: AdminAuditLogs` | Tra cứu Audit Logs | `GET /api/v1/admin/audit-logs` | `Pageable` | `PageResponse<AdminAuditLog>` | `features/admin/api/adminRepository.ts` | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-025`, `041`, `052` | Đọc thông báo cá nhân | `GET /api/v1/notifications` | `Pageable` | `PageResponse<NotificationDto>` | `features/notifications/api/notificationApi.ts` | `NotificationController.java` | Authenticated |
| `SCR-025`, `041`, `052` | Đánh dấu 1 thông báo đã đọc | `PUT /api/v1/notifications/{id}/read` | Path variable `id` | `ApiResponse<Void>` | `features/notifications/api/notificationApi.ts` | `NotificationController.java` | Authenticated |
| `SCR-025`, `041`, `052` | Đánh dấu đọc tất cả thông báo | `PUT /api/v1/notifications/read-all` | Không có | `ApiResponse<Void>` | `features/notifications/api/notificationApi.ts` | `NotificationController.java` | Authenticated |
| `SCR-041`, `MerchantLayout` | Đếm số thông báo chưa đọc (Poll 20s) | `GET /api/v1/notifications/unread-count` | Không có | `ApiResponse<Integer>` | `features/merchant/notifications/api/merchantNotificationApi.ts` | `NotificationController.java` | Authenticated |
| `SCR-021: ProfilePage` | Lấy hồ sơ tài xế | `GET /api/v1/users/me` | Không có | `ApiResponse<UserProfileDto>` | `features/profile/api/userApi.ts` | `UserController.java` | `hasRole('DRIVER')` |
| `SCR-021: ProfilePage` | Sửa hồ sơ tài xế | `PUT /api/v1/users/me` | `{ fullName, phone, email, emergencyContact, address }` | `ApiResponse<UserProfileDto>` | `features/profile/api/userApi.ts` | `UserController.java` | `hasRole('DRIVER')` |
| `SCR-022: ChangePasswordPage` | Đổi mật khẩu đăng nhập | `PUT /api/v1/users/change-password` | `{ oldPassword, newPassword }` | `ApiResponse<Void>` | `features/profile/api/userApi.ts` | `UserController.java` | Authenticated |
| `SCR-027: MerchantProfilePage` | Lấy hồ sơ chủ bãi & ngân hàng | `GET /api/v1/merchant/profile` | Không có | `ApiResponse<MerchantProfileDto>` | `features/merchant/profile/api/merchantProfileApi.ts` | `MerchantProfileController.java` | `hasRole('MERCHANT')` |
| `SCR-027: MerchantProfilePage` | Cập nhật hồ sơ & ngân hàng | `PUT /api/v1/merchant/profile` | `{ businessName, taxCode, bankName, bankAccount, bankAccountHolder }` | `ApiResponse<MerchantProfileDto>` | `features/merchant/profile/api/merchantProfileApi.ts` | `MerchantProfileController.java` | `hasRole('MERCHANT')` |
| `SCR-039: MerchantDisputesPage` | Lấy danh sách khiếu nại của bãi | `GET /api/v1/disputes/merchant` | `params: { page, size }` | `PageResponse<MerchantDispute>` | `features/merchant/disputes/api/merchantDisputeApi.ts` | `DisputeController.java` | `hasRole('MERCHANT')` |
| `SCR-040: MerchantDisputeDetail` | Lấy chi tiết khiếu nại | `GET /api/v1/disputes/{id}` | Path variable `id` | `ApiResponse<MerchantDispute>` | `features/merchant/disputes/api/merchantDisputeApi.ts` | `DisputeController.java` | `hasAnyRole('DRIVER','MERCHANT')` |
| `SCR-DRV-01: DriverDisputes` (Đề xuất) | Tài xế xem lịch sử khiếu nại | `GET /api/v1/disputes/me` | `Pageable` | `PageResponse<DisputeDto>` | Đề xuất UI (`SCR-DRV-01`) | `DisputeController.java` | `hasRole('DRIVER')` |
| `SCR-DRV-01: DriverDisputes` (Đề xuất) | Tài xế gửi khiếu nại bãi xe | `POST /api/v1/disputes` | `{ bookingId, parkingLotId, title, description, evidenceUrls }` | `ApiResponse<DisputeDto>` | Đề xuất UI (`SCR-DRV-01`) | `DisputeController.java` | `hasRole('DRIVER')` |
| `SCR-017: MyBookingsPage` | Đồng bộ thủ công PayOS | `POST /api/v1/payments/sync` | `{ bookingId }` | `ApiResponse<SyncPaymentResponse>` | `features/bookings/api/bookingApi.ts` | `PaymentController.java` | `hasRole('DRIVER')` |
| `SCR-017: MyBookingsPage` | Xác nhận thanh toán cọc demo | `POST /api/v1/payments/demo-confirm` | `{ bookingId }` | `ApiResponse<BookingDto>` | `features/bookings/api/bookingApi.ts` | `PaymentController.java` | `hasRole('DRIVER')` |
| `SCR-MOD-01: AiChatWidget` | Hỏi đáp trợ lý AI | `POST /api/v1/ai/chat` | `{ message, userLat, userLon }` | `{ reply, source, suggestedLots }` | `features/ai-copilot/api/aiApi.ts` | `AiController.java` (`ai-service`) | Authenticated |
| `SCR-MOD-08: GenerateDescription` | AI sinh mô tả bãi xe & nội quy | `POST /api/v1/ai/generate-description` | `{ parkingLotName, address, amenities }` | `ApiResponse<ParkingDescriptionDto>` | `features/ai-copilot/api/aiApi.ts` | `AiController.java` (`ai-service`) | `hasRole('MERCHANT')` |
| `SCR-046: AdminUserDetailPage` | Gửi cảnh báo người dùng | `POST /api/v1/admin/users/{id}/warnings` | `{ reason }` | `ApiResponse<Void>` | Backend có, FE chưa có UI | `AdminController.java` | `hasRole('ADMIN')` |
| `SCR-047: AdminTransactionsPage`| Tra cứu chi tiết giao dịch sâu | `GET /api/v1/admin/transactions/{id}` | Path variable `id` | `ApiResponse<AdminTransactionDetail>` | Backend có, FE dùng cache dòng | `AdminController.java` | `hasRole('ADMIN')` |

---

## 2. Ánh Xạ Kiểu Dữ Liệu Thực Thể DB ↔ Trường Hiển Thị Giao Diện (Field Mapping)

### 2.1. Thực thể `Booking` (Bảng `bookings`)
| Cột Cơ Sở Dữ Liệu | Kiểu Dữ Liệu DB | Thuộc Tính Frontend | Nhãn Hiển Thị UI | Định Dạng Hiển Thị (Display Format) |
|---|---|---|---|---|
| `id` | `BIGINT` | `id` | Mã hệ thống | `#1024` |
| `booking_code` | `VARCHAR(50)` | `bookingCode` | Mã đặt chỗ | `BK-2026-8941` (In hoa, đậm) |
| `driver_id` | `BIGINT` | `driverId` | Tài xế | Họ tên / SĐT tài xế |
| `vehicle_id` | `BIGINT` | `vehicleId` | Phương tiện | Biển số xe (`29C-888.88`) |
| `vehicle_type` | `VARCHAR(30)` | `vehicleType` | Loại xe | Badge nhãn tiếng Việt (`Xe đầu kéo & Container`) |
| `parking_lot_id` | `BIGINT` | `parkingLotId` | Bãi đỗ | Tên bãi đỗ xe |
| `status` | `VARCHAR(30)` | `status` | Trạng thái | Tag màu sắc tương ứng (`Chờ thanh toán`, `Đang đỗ`,...) |
| `start_time` | `DATETIME` | `startTime` | Giờ bắt đầu dự kiến | `DD/MM/YYYY HH:mm` |
| `end_time` | `DATETIME` | `endTime` | Giờ kết thúc dự kiến | `DD/MM/YYYY HH:mm` |
| `actual_check_in_time` | `DATETIME` | `actualCheckInTime` | Giờ vào bãi thực tế | `DD/MM/YYYY HH:mm` (hoặc `—` nếu chưa vào) |
| `actual_check_out_time` | `DATETIME` | `actualCheckOutTime` | Giờ ra bãi thực tế | `DD/MM/YYYY HH:mm` (hoặc `—` nếu chưa ra) |
| `deposit_amount` | `DECIMAL(12,2)` | `depositAmount` | Tiền cọc | Định dạng tiền tệ VND (`100.000 ₫`) |
| `total_amount` | `DECIMAL(12,2)` | `totalAmount` | Tổng tiền đỗ | Định dạng tiền tệ VND (`350.000 ₫`) |
| `cancel_deadline_at` | `DATETIME` | `cancelDeadlineAt` | Hạn hủy có hoàn cọc | `DD/MM/YYYY HH:mm` |

### 2.2. Thực thể `ParkingLot` (Bảng `parking_lots`)
| Cột Cơ Sở Dữ Liệu | Kiểu Dữ Liệu DB | Thuộc Tính Frontend | Nhãn Hiển Thị UI | Định Dạng Hiển Thị |
|---|---|---|---|---|
| `id` | `BIGINT` | `id` | Mã bãi đỗ | `#52` |
| `merchant_id` | `BIGINT` | `merchantId` | Chủ bãi | Tên doanh nghiệp / Họ tên Merchant |
| `name` | `VARCHAR(255)` | `name` | Tên bãi đỗ xe | Chuỗi văn bản tiêu đề lớn |
| `address` | `VARCHAR(500)` | `address` | Địa chỉ bãi đỗ | Kèm icon định vị `MapPin` |
| `latitude` | `DECIMAL(10,7)` | `latitude` | Vĩ độ GPS | Điểm ghim Marker trên Leaflet Map |
| `longitude` | `DECIMAL(10,7)` | `longitude` | Kinh độ GPS | Điểm ghim Marker trên Leaflet Map |
| `contact_phone` | `VARCHAR(20)` | `contactPhone` | Hotline hỗ trợ | `0988 123 456` |
| `status` | `VARCHAR(30)` | `status` | Tình trạng duyệt | `APPROVED` (Xanh), `PENDING_APPROVAL` (Vàng), `REJECTED` (Đỏ) |
| `rating_average` | `DECIMAL(3,2)` | `ratingAverage` | Điểm đánh giá | Hiển thị ngôi sao + điểm số (ví dụ: `★ 4.8`) |
