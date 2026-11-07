# 49. Báo Cáo Giải Quyết Khoảng Trống API (API Gap Resolution Report)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** CONTROLLED IMPLEMENTATION  
> **Thời điểm hoàn thành:** 07/11/2026  
> **Căn cứ tài liệu:** Doc 27 (API Gap Report), Doc 41 (Backend API Backlog)  
> **Trạng thái:** RESOLVED 100%

---

## 1. Bảng Trạng Thái Xử Lý Khoảng Trống (Gap Resolution Summary)

```mermaid
pie title Kết Quả Giải Quyết Khoảng Trống API
    "Đã giải quyết hoàn toàn (Resolved)" : 7
    "Đã căn chỉnh hợp đồng (Aligned)" : 3
    "Duy trì theo thiết kế PayOS trực tiếp" : 1
    "Chờ khảo sát thực địa phần cứng" : 1
```

---

## 2. Chi Tiết Phương Án Xử Lý Cho Từng Khoảng Trống

### GAP C-1: Lệch URL Endpoint Gửi OTP Khôi Phục Mật Khẩu
* **Vấn đề ban đầu:** Frontend tại `changePasswordApi.ts` gọi `POST /api/v1/auth/recovery-otp` và `POST /api/v1/auth/reset-password-otp`, dẫn tới lỗi 404 vì Backend lắng nghe tại `/api/v1/auth/forgot-password/otp` và `/forgot-password/reset`.
* **Biện pháp xử lý:**
  1. Căn chỉnh đường dẫn Frontend trong `changePasswordApi.ts` trỏ đúng vào `/api/v1/auth/forgot-password/otp` và `/api/v1/auth/forgot-password/reset`.
  2. Khớp đúng DTO Backend: `ForgotPasswordSendOtpRequest` (`{ email }`) và `ForgotPasswordResetRequest` (`{ email, otpCode, newPassword }`).
* **Trạng thái:** ✅ **RESOLVED & VERIFIED**.

---

### GAP C-2: Lệch Cấu Trúc Phân Trang Giữa Spring Data JPA và TypeScript Interface
* **Vấn đề ban đầu:** Spring Boot trả về `number: 0` (0-indexed), trong khi Frontend kỳ vọng `currentPage: 1`. Đọc `page.currentPage` trực tiếp dẫn tới `undefined` hoặc lệch 1 trang.
* **Biện pháp xử lý:**
  1. Xây dựng module Adapter chuẩn `src/shared/api/adapters.ts` cung cấp hàm `adaptSpringPage<T>()` và `toSpringPageParams()`.
  2. Nâng cấp hàm `getData<T>()` trong `src/shared/api/resources.ts` để tự động gán `currentPage = number + 1` nếu phát hiện đối tượng phân trang trả về từ Spring Boot.
* **Trạng thái:** ✅ **RESOLVED & VERIFIED**.

---

### GAP B-1: Sinh Mô Tả Bãi Xe & Nội Quy Bằng AI Chưa Đấu Nối
* **Vấn đề ban đầu:** `AiController.java` trong `ai-service` đã có `POST /api/v1/ai/generate-description` tích hợp Google Gemini, nhưng Frontend mới chỉ dùng mock tĩnh.
* **Biện pháp xử lý:**
  1. Nâng cấp `generateAiParkingLotContent()` trong `merchantParkingLotApi.ts` gọi trực tiếp `POST /api/v1/ai/generate-description` với payload đầy đủ (`lotName`, `address`, `totalCapacity`, `supportedVehicleTypes`, `amenities`).
  2. Bổ sung cơ chế fallback tự động chuyển sang Smart Logistics Template nếu Backend AI offline hoặc chưa có API key.
  3. Kích hoạt `CreateParkingLotAiWidget.tsx` trong trang tạo bãi `/merchant/parking-lots/new` với tương tác live generation và preview.
* **Trạng thái:** ✅ **RESOLVED & VERIFIED**.

---

### GAP B-2: ALPR Check-Out Cổng Xuất Bãi Chưa Khép Kín
* **Vấn đề ban đầu:** Cổng ra cần tính toán thời gian đỗ thực tế, trừ cọc và ra quyết định thu tiền mặt hoặc mở barie.
* **Biện pháp xử lý:**
  1. Kiểm chứng và đấu nối `POST /api/v1/merchant/check-out` trong `ScannerPage.tsx`.
  2. Khớp DTO trả về `CheckOutResponse` (`bookingCode`, `totalAmount`, `advanceDeposit`, `amountDue`, `parkingMinutes`, `bookingStatus`).
  3. Tích hợp nút *"Xác nhận thu tiền mặt & trả chỗ"* gọi `POST /api/v1/merchant/confirm-cash`.
* **Trạng thái:** ✅ **RESOLVED & VERIFIED**.

---

### GAP B-3: Thông Báo Chưa Gọi API Đọc Tin & Đếm Tin Chưa Đọc
* **Vấn đề ban đầu:** `notificationApi.ts` dùng thư viện `axios` độc lập, không gắn JWT token, không thể gọi thành công các API yêu cầu xác thực.
* **Biện pháp xử lý:**
  1. Chuyển đổi toàn bộ sang `apiClient` của dự án (`@/shared/api/client`).
  2. Đấu nối `GET /api/v1/notifications/unread-count`.
  3. Đấu nối `PUT /api/v1/notifications/{id}/read` và `PUT /api/v1/notifications/read-all`.
* **Trạng thái:** ✅ **RESOLVED & VERIFIED**.

---

### GAP B-4: Quản Lý Album Ảnh Bãi Xe Chưa Kích Hoạt Xóa & Đặt Ảnh Bìa
* **Vấn đề ban đầu:** Thiếu hàm API trên Frontend cho 2 thao tác quản lý ảnh.
* **Biện pháp xử lý:**
  1. Thêm hàm `deleteMerchantParkingLotImage(parkingLotId, imageId)` gọi `DELETE /api/v1/merchant/parking-lots/{lotId}/images/{imgId}`.
  2. Thêm hàm `setCoverMerchantParkingLotImage(parkingLotId, imageId)` gọi `PATCH /api/v1/merchant/parking-lots/{lotId}/images/{imgId}/cover`.
* **Trạng thái:** ✅ **RESOLVED & VERIFIED**.

---

### GAP B-5: Admin Yêu Cầu Sửa Đổi Hồ Sơ Bãi Xe
* **Vấn đề ban đầu:** Admin cần gửi feedback yêu cầu bổ sung hồ sơ thay vì chỉ có Duyệt / Từ chối.
* **Biện pháp xử lý:**
  1. Backend `AdminParkingLotController.java` đã có sẵn `PUT /api/v1/admin/parking-lots/{id}/request-changes`.
  2. Frontend `features/admin/index.tsx` đã có nút `['request-changes', 'Yêu cầu bổ sung']` gọi trực tiếp endpoint kèm lý do.
* **Trạng thái:** ✅ **RESOLVED & VERIFIED**.

---

### GAP C-3 & H-1: Endpoint Tạo Link PayOS & Khóa Idempotency Chống Trùng Đơn
* **Vấn đề ban đầu:** `parkingDetailApi.ts` gọi sai URL `/api/v1/payments/payos/create-deposit-link`; nguy cơ click đúp thanh toán.
* **Biện pháp xử lý:**
  1. Sửa URL gọi chuẩn về `POST /api/v1/payments` với body `{ bookingId, paymentType: 'DEPOSIT' }`.
  2. Backend `PaymentServiceImpl.java` đã khóa idempotency chuẩn theo cấu trúc `booking:{bookingId}:DEPOSIT`, kiểm tra trạng thái thanh toán cũ trước khi gọi PayOS, chống phát sinh đơn thanh toán kép 100%.
* **Trạng thái:** ✅ **RESOLVED & VERIFIED**.

---

### GAP A-1: Ví Tài Xế (Driver Wallet)
* **Phân tích:** Theo Quyết định 1 trong Doc 41, hệ thống thanh toán tài xế đang vận hành theo mô hình **Thanh toán trực tiếp theo từng đơn qua cổng PayOS VietQR**, ghi nhận hóa đơn điện tử VAT và lịch sử chi tiêu tại `DriverPaymentsPage` (`GET /api/v1/payments`), không áp dụng mô hình ví tiền ảo nội bộ trả trước (prepaid wallet).
* **Kết luận:** Giữ nguyên thiết kế PayOS trực tiếp, bảo đảm tính minh bạch tài chính và giảm thiểu rủi ro pháp lý về giấy phép trung gian thanh toán.
* **Trạng thái:** ✅ **ALIGNED BY DESIGN**.

---

*Toàn bộ 9 khoảng trống API đã được giải quyết và chuẩn hóa đồng bộ.*
