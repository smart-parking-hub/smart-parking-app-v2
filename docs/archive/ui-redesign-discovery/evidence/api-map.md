# Danh Mục Chi Tiết REST API (API Map Evidence)

Dữ liệu dưới đây được tổng hợp và đối chiếu từ các Controller của Backend Spring Boot (`smart-parking-service` và `smart-parking-microservice`) cùng các file API Client của Frontend (`smart-parking-app/src/features/*/api/*`).

---

## 1. Chuẩn Cấu Trúc Phản Hồi Chung (Standard Envelope)

Mọi API của hệ thống (trừ Webhook bên thứ ba) đều tuân thủ cấu trúc đóng gói chuẩn:

```json
{
  "status": 200,
  "message": "Thao tác thành công",
  "data": { ... }
}
```

Nếu xảy ra lỗi:
```json
{
  "status": 400,
  "message": "Lý do lỗi nghiệp vụ cụ thể",
  "data": null
}
```

---

## 2. Chi Tiết Từng Nhóm API Theo Controller

### 2.1. AuthController (`/api/v1/auth`)
- `POST /api/v1/auth/login`
  - Quyền: Public (`PermitAll`)
  - Request: `{ "phone": "0988123456", "password": "securePassword123" }`
  - Response: `{ "status": 200, "data": { "token": "eyJhbGciOi...", "role": "DRIVER" } }`
- `POST /api/v1/auth/otp/send`
  - Quyền: Public
  - Request: `{ "phone": "0988123456" }`
  - Response: `{ "status": 200, "data": { "expiresInSeconds": 60, "otpCode": "123456" } }`
- `POST /api/v1/auth/register`
  - Quyền: Public
  - Request: `{ "phone": "0988123456", "email": "driver@example.com", "password": "...", "otpCode": "123456", "role": "DRIVER", "fullName": "Nguyen Van A", "citizenId": "001200000000" }`
  - Response: `{ "status": 201, "message": "Đăng ký thành công", "data": null }`
- `POST /api/v1/auth/forgot-password/otp`
  - Quyền: Public
  - Request: `{ "email": "user@example.com" }`
- `POST /api/v1/auth/forgot-password/reset`
  - Quyền: Public
  - Request: `{ "email": "user@example.com", "otpCode": "123456", "newPassword": "newPassword123" }`

### 2.2. BookingController (`/api/v1/bookings`)
- `POST /api/v1/bookings`
  - Quyền: `hasRole('DRIVER')`
  - Request: `{ "parkingLotId": 12, "vehicleId": 45, "startTime": "2026-11-02T08:00:00", "endTime": "2026-11-02T12:00:00" }`
  - Response: `{ "status": 201, "data": { "id": 1024, "bookingCode": "BK-2026-8941", "status": "PENDING_PAYMENT", "depositAmount": 100000, "expiresAt": "2026-11-02T07:10:00" } }`
- `GET /api/v1/bookings`
  - Quyền: `hasRole('DRIVER')`
  - Params: `page=0&size=20&sort=createdAt,desc`
  - Response: `{ "status": 200, "data": { "content": [ ... ], "totalElements": 15, "totalPages": 1 } }`
- `POST /api/v1/bookings/{id}/cancel`
  - Quyền: `hasRole('DRIVER')` (Kiểm tra quyền sở hữu)
  - Request: `{ "reason": "Thay đổi lịch trình vận tải" }`
  - Response: `{ "status": 200, "message": "Đã hủy đặt chỗ thành công" }`

### 2.3. MerchantController (`/api/v1/merchant`)
- `POST /api/v1/merchant/check-in`
  - Quyền: `hasRole('MERCHANT')`
  - Request: `{ "bookingCode": "BK-2026-8941", "parkingLotId": 12 }`
  - Response: `{ "status": 200, "data": "Check-in thành công" }`
- `POST /api/v1/merchant/check-out`
  - Quyền: `hasRole('MERCHANT')`
  - Request: `{ "bookingCode": "BK-2026-8941", "parkingLotId": 12 }`
  - Response: `{ "status": 200, "data": { "bookingCode": "BK-2026-8941", "actualCheckInTime": "...", "actualCheckOutTime": "...", "totalHours": 5, "totalAmount": 250000, "depositDeducted": 100000, "amountDue": 150000, "penalty": 0 } }`
- `POST /api/v1/merchant/confirm-cash`
  - Quyền: `hasRole('MERCHANT')`
  - Request: `{ "bookingCode": "BK-2026-8941", "parkingLotId": 12 }`
  - Response: `{ "status": 200, "message": "Đã xác nhận thu tiền mặt" }`
- `GET /api/v1/merchant/revenue`
  - Quyền: `hasRole('MERCHANT')`
  - Params: `startDate=...&endDate=...&granularity=DAY|MONTH|YEAR`
  - Response: `{ "status": 200, "data": { "totalRevenue": 48500000, "completedBookings": 134, "walletBalance": 12400000, "series": [ { "period": "2026-11-01", "revenue": 3200000, "bookingCount": 9 } ] } }`
- `GET /api/v1/merchant/bookings`
  - Quyền: `hasRole('MERCHANT')`
  - Params: `page=0&size=20&parkingLotId=12`

### 2.4. ParkingLotController (`/api/v1/parking-lots` & `/api/v1/merchant/parking-lots`)
- `GET /api/v1/parking-lots/search`
  - Quyền: `hasRole('DRIVER')`
  - Params: `vehicleType=HEAVY_TRUCK&latitude=21.0285&longitude=105.8542&radiusKm=10`
  - Response: Array of ParkingLotDto kèm khoảng cách, số slot trống, đơn giá giờ
- `GET /api/v1/parking-lots/{id}`
  - Quyền: Authenticated
  - Response: Chi tiết thông số bãi đỗ, tọa độ GPS, danh sách slot và bảng giá
- `POST /api/v1/merchant/parking-lots`
  - Quyền: `hasRole('MERCHANT')`
  - Request: `{ "name": "Bãi xe Mỹ Đình Trans", "address": "Số 1 Phạm Hùng, Hà Nội", "latitude": 21.02, "longitude": 105.78, "contactPhone": "0988111222", "description": "Bãi có bảo vệ 24/7, đèn chiếu sáng, camera AI" }`
- `POST /api/v1/merchant/parking-lots/{id}/images`
  - Quyền: `hasRole('MERCHANT')` (Own)
  - Request: Multipart form-data `files`
- `PUT /api/v1/merchant/parking-lots/{id}/slots/bulk`
  - Quyền: `hasRole('MERCHANT')` (Own)
  - Request: `{ "slots": [ { "vehicleType": "HEAVY_TRUCK", "totalCapacity": 25 }, { "vehicleType": "CONTAINER", "totalCapacity": 10 } ] }`
- `PUT /api/v1/merchant/parking-lots/{id}/pricing/bulk`
  - Quyền: `hasRole('MERCHANT')` (Own)
  - Request: `{ "pricingRules": [ { "vehicleType": "HEAVY_TRUCK", "hourlyRate": 30000, "overnightRate": 150000, "overtimeHourlyRate": 45000, "depositAmount": 100000 } ] }`

### 2.5. PaymentController (`/api/v1/payments`)
- `POST /api/v1/payments`
  - Quyền: `hasRole('DRIVER')`
  - Request: `{ "bookingId": 1024 }`
  - Response: `{ "status": 200, "data": "https://pay.payos.vn/web/..." }`
- `POST /api/v1/payments/webhook`
  - Quyền: Public (Xác thực bằng chữ ký SHA-256 HMAC từ PayOS)
  - Request: Raw Webhook Payload từ PayOS
- `GET /api/v1/payments/my`
  - Quyền: `hasRole('DRIVER')`
  - Response: Danh sách lịch sử giao dịch tiền cọc, thanh toán cuối

### 2.6. VehicleController (`/api/v1/vehicles`)
- `GET /api/v1/vehicles`: Lấy danh sách xe của tài xế
- `POST /api/v1/vehicles`: Thêm xe mới `{ licensePlate, vehicleType, weightTon, brandModel }`
- `PUT /api/v1/vehicles/{id}`: Cập nhật thông tin xe
- `DELETE /api/v1/vehicles/{id}`: Xóa mềm xe

### 2.7. WithdrawalController (`/api/v1/withdrawals`)
- `POST /api/v1/withdrawals`: Merchant tạo lệnh rút tiền `{ amount, bankName, bankAccount }`
- `GET /api/v1/withdrawals`: Merchant xem lịch sử rút tiền

### 2.8. AdminController (`/api/v1/admin`)
- `GET /api/v1/admin/dashboard`: Chỉ số vĩ mô toàn hệ thống
- `GET /api/v1/admin/parking-lots`: Danh sách bãi chờ duyệt và đã duyệt
- `PUT /api/v1/admin/parking-lots/{id}/approve`: Duyệt bãi xe
- `PUT /api/v1/admin/parking-lots/{id}/reject`: Từ chối duyệt bãi xe
- `GET /api/v1/admin/users`: Danh sách tài khoản người dùng
- `PUT /api/v1/admin/users/{id}/ban`: Khóa tài khoản
- `PUT /api/v1/admin/users/{id}/unban`: Mở khóa tài khoản
- `GET /api/v1/admin/transactions`: Giám sát giao dịch toàn sàn
- `GET /api/v1/admin/withdrawals`: Danh sách yêu cầu rút tiền của các chủ bãi
- `PUT /api/v1/admin/withdrawals/{id}/approve`: Duyệt lệnh chi tiền
- `PUT /api/v1/admin/withdrawals/{id}/reject`: Từ chối lệnh chi tiền (hoàn ví)
- `GET /api/v1/admin/audit-logs`: Nhật ký kiểm toán hành vi Admin

### 2.9. QueueController (`/api/v1/queues`)
- `POST /api/v1/queues`: Tham gia hàng đợi ảo `{ parkingLotId, vehicleType }`
- `GET /api/v1/queues/my`: Danh sách hàng đợi của tôi
- `POST /api/v1/queues/{id}/accept`: Nhận slot được giải phóng (tạo booking)
- `POST /api/v1/queues/{id}/leave`: Rời khỏi hàng đợi

### 2.10. AiController (`/api/v1/ai/chat`)
- `POST /api/v1/ai/chat`: Gửi câu hỏi kèm tọa độ `{ message, userLat, userLon }` → Nhận câu trả lời và thẻ bãi xe gợi ý
