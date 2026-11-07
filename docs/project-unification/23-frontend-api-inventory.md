# 23. Báo Cáo Khảo Sát Hệ Thống API Phía Frontend (Frontend API Inventory)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** API DISCOVERY & CONTRACT AUDIT ONLY (Tuân thủ PROJECT UNIFICATION MASTER RULES — **Không sửa code**)  
> **Thời điểm khảo sát:** 07/11/2026  
> **Phạm vi khảo sát:** Toàn bộ API Client, Axios instance, Interceptors, DTOs, Query Hooks tại `smart-parking-app-v2/src/`  
> **Trạng thái:** VERIFIED 100% (Phân tích AST thực tế trên toàn bộ mã nguồn)

---

## 1. Cấu Trúc Hạ Tầng API Client (Frontend Network Architecture)

### 1.1. Axios Instance & Base Configuration
* **Tệp cấu hình chính:** [`src/shared/api/client.ts`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/api/client.ts).
* **Base URL:**
  ```ts
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
  ```
* **Timeout:** `30000ms` (30 giây).
* **Mặc định Headers:** `'Content-Type': 'application/json'`.

### 1.2. Cơ Chế Can Thiệp Request (Request Interceptor)
* **Xử lý JWT Token:**
  * Lấy `access_token` từ `localStorage.getItem('access_token')`.
  * Tự động gắn header `Authorization: Bearer ${token}` cho mọi request.
* **Chuẩn hóa URL Gateway:**
  * Nếu endpoint bắt đầu bằng `/api/v1/`, tự động loại bỏ tiền tố thừa `/api` hoặc `/api/v1` khỏi `baseURL` để tránh tạo ra URL lặp dạng `/api/api/v1/...`.

### 1.3. Cơ Chế Can Thiệp Response (Response Interceptor)
* **Xử lý lỗi xác thực (401 Unauthorized):**
  * Ghi nhận cảnh báo `console.warn('[API Client] Unauthorized access (401)')`.
  * Chuyển tiếp `Promise.reject(error)` để tầng UI hoặc React Query bắt lỗi.
  * ⚠️ *Hạn chế phát hiện:* Chưa có cơ chế Silent Refresh Token tự động gọi endpoint `/api/v1/auth/refresh` khi access token hết hạn; người dùng buộc phải đăng nhập lại.

### 1.4. Lớp Bao Bọc Tài Nguyên Chung (Generic Resource Layer)
* **Tệp nguồn:** [`src/shared/api/resources.ts`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/api/resources.ts).
* **Hàm truy vấn (`getData<T>`):**
  * Tự động bóc tách cấu trúc bao bọc chuẩn của Backend: `return result.data.data`.
* **Hàm gửi dữ liệu (`sendData<T>`):**
  * Hỗ trợ method `'post' | 'put'`, truyền `body` và trả về `result.data.data`.
* **Cấu trúc phân trang chung (`Page<T>`):**
  ```ts
  export interface Page<T> {
    content: T[]
    totalPages: number
    totalElements: number
    currentPage: number
  }
  ```
* **Bóc tách thông điệp lỗi (`errorMessage`):**
  * Ưu tiên đọc `error.response?.data?.message` từ Backend Spring Boot.
  * Fallback: `error.message` hoặc chuỗi mặc định `'Không kết nối được máy chủ. Vui lòng thử lại.'`.

---

## 2. Bảng Danh Mục Các API Services Đang Hoạt Động Trên Frontend

Dự án ghi nhận **107 lượt gọi API** trên **59 endpoint duy nhất**. Dưới đây là bảng thống kê toàn bộ các dịch vụ frontend kết nối Backend:

| Phân Hệ & Module | Hàm Service / Hook | HTTP Method | Endpoint Gọi Thực Tế | Request Payload / Params | Calling Page & Action | Xử Lý Loading & Error |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **Auth** | `useMutation` (Login) | `POST` | `/api/v1/auth/login` | `{ phone, password }` | SCR-11 (`/auth/login`) — Nút Đăng nhập | `submit.isPending`, `errorMessage(error)` |
| **Auth** | `useMutation` (Register) | `POST` | `/api/v1/auth/register` | `{ phone, password, role, fullName }` | SCR-12 (`/auth/register`) — Nút Đăng ký | `submit.isPending`, Thông báo lỗi đỏ |
| **Auth** | `useMutation` (Send OTP) | `POST` | `/api/v1/auth/otp/send` | `{ phone }` hoặc `{ email }` | SCR-11, SCR-12, SCR-13 — Nút Gửi OTP | `otp.isPending`, Đếm ngược 60s |
| **Auth** | `useMutation` (Reset Password) | `POST` | `/api/v1/auth/forgot-password/reset` | `{ email, otpCode, newPassword }` | SCR-14 (`/auth/reset-password`) — Xác nhận | `submit.isPending`, Chuyển trang Login |
| **User Profile** | `useQuery` (Get Me) | `GET` | `/api/v1/users/me` | None (Bearer Token) | Toàn bộ App (`AuthSession.tsx`, `/profile`) | `QueryState` skeleton, Tự động logout nếu 401 |
| **User Profile** | `useMutation` (Update Me) | `PUT` | `/api/v1/users/me` | `{ fullName, email, avatarUrl }` | SCR-52 (`/profile`) — Nút Lưu thông tin | `save.isPending`, Toast "Đã cập nhật" |
| **User Profile** | `useMutation` (Password) | `PUT` | `/api/v1/users/me/password` | `{ currentPassword, newPassword }` | SCR-53 (`/change-password`) — Đổi mật khẩu | `save.isPending`, Reset form sau khi đổi |
| **Vehicles** | `useQuery` (My Vehicles) | `GET` | `/api/v1/vehicles` | None | SCR-20 (`/driver/vehicles`) — Tải danh sách xe | `isLoading`, render `VehiclesGrid` |
| **Vehicles** | `useMutation` (Create Vehicle)| `POST` | `/api/v1/vehicles` | `{ licensePlate, vehicleType, payloadCapacity }` | SCR-20 — Modal Đăng ký xe | `isPending`, Invalidate `['vehicles']` |
| **Vehicles** | `useMutation` (Delete Vehicle)| `DELETE` | `/api/v1/vehicles/{id}` | Path variable `id` | SCR-20 — Modal Xóa xe | `isPending`, Cập nhật danh sách |
| **Parking Search**| `useQuery` (Search Lots) | `GET` | `/api/v1/parking-lots/search` | `{ latitude, longitude, radius, vehicleType }` | SCR-16 (`/search`) — Tìm bãi xe | Hiển thị loader trên thanh search bar |
| **Parking Detail**| `useQuery` (Get Lot) | `GET` | `/api/v1/parking-lots/{id}` | Path variable `id` | SCR-17 (`/parking/:id`) — Chi tiết bãi | `QueryState` bao bọc toàn trang |
| **Parking Detail**| `useQuery` (Get Slots) | `GET` | `/api/v1/parking-lots/{id}/slots` | Path variable `id` | SCR-17 — Sơ đồ chỗ đỗ | Hiển thị số lượng slot trống thời gian thực |
| **Bookings** | `useQuery` (My Bookings) | `GET` | `/api/v1/bookings` | `{ page, size, status }` | SCR-18 (`/driver/bookings`) — Danh sách vé | `QueryState`, Phân tab trạng thái |
| **Bookings** | `useQuery` (Booking Detail)| `GET` | `/api/v1/bookings/{id}` | Path variable `id` | SCR-19 (`/driver/bookings/:id`) — Chi tiết vé | Render Stepper và QR Barcode |
| **Bookings** | `useMutation` (Create Booking)| `POST` | `/api/v1/bookings` | `{ parkingLotId, vehicleId, startTime, duration }` | SCR-17 — Modal Đặt chỗ | Khóa nút đặt cọc, mở cổng PayOS |
| **Bookings** | `useMutation` (Cancel Booking)| `POST` | `/api/v1/bookings/{id}/cancel` | `{ reason }` | SCR-18, SCR-19 — Modal Hủy vé | Optimistic update danh sách vé |
| **Reviews** | `useMutation` (Add Review) | `POST` | `/api/v1/reviews` | `{ bookingId, parkingLotId, rating, comment }` | SCR-19 — Modal Đánh giá bãi | Đóng modal, toast cảm ơn |
| **Payments** | `useMutation` (Create PayOS) | `POST` | `/api/v1/payments/payos/create-deposit-link` | `{ bookingId, returnUrl, cancelUrl }` | SCR-17, SCR-19 — Nút Thanh toán VietQR | Trả về `checkoutUrl` và mã `orderCode` |
| **Payments** | `useMutation` (Sync PayOS) | `POST` | `/api/v1/payments/sync` | `{ orderCode, paymentLinkId, bookingId }` | SCR-54 (`/payment/return`) — Xác nhận thanh toán | `state: syncing`, Telemetry strip latency |
| **Queues** | `useQuery` (My Queue) | `GET` | `/api/v1/queues/me` | None | SCR-16, SCR-18 — Hàng đợi bãi xe quá tải | Hiển thị số thứ tự hàng đợi ảo |
| **Queues** | `useMutation` (Accept Queue) | `POST` | `/api/v1/queues/{id}/accept` | Path variable `id` | SCR-18 — Modal Nhận slot khi có xe ra | Chuyển hàng đợi thành Booking chính thức |
| **Merchant Lots** | `useQuery` (Merchant Lots) | `GET` | `/api/v1/merchant/parking-lots` | `{ page, size }` | SCR-25 (`/merchant/parking-lots`) — Bãi của tôi | Bảng DataTable bãi xe |
| **Merchant Lots** | `useMutation` (Create Lot) | `POST` | `/api/v1/merchant/parking-lots` | `{ name, address, latitude, longitude, totalSlots }` | SCR-26 (`/merchant/parking-lots/new`) — Wizard | Chuyển bước Wizard |
| **Merchant Lots** | `useMutation` (Upload Images)| `POST` | `/api/v1/merchant/parking-lots/{id}/images` | `FormData` (Multipart) | SCR-26, SCR-28 — Tải ảnh bãi xe | Hiển thị thanh tiến trình upload |
| **Merchant Slots**| `useMutation` (Bulk Slots) | `POST` | `/api/v1/merchant/parking-lots/{id}/slots/bulk` | `{ slots: [{ vehicleType, totalCapacity }] }` | SCR-29 (`/merchant/slots`) — Cấu hình slot | Toast "Đã lưu sơ đồ slot" |
| **Merchant Tariff**| `useMutation` (Bulk Rates) | `POST` | `/api/v1/merchant/parking-lots/{id}/pricing/bulk` | `{ rules: [{ vehicleType, blockPrice, hourlyPrice }] }` | SCR-30 (`/merchant/pricing`) — Bảng giá cước | Toast "Đã lưu bảng cước" |
| **Merchant Gates**| `useMutation` (Check-In) | `POST` | `/api/v1/merchant/check-in` | `{ bookingCode, vehiclePlate, gateId }` | SCR-24, SCR-33 — Camera ALPR check-in | Mở barie, cập nhật xe vào bãi |
| **Merchant Revenue**| `useQuery` (Revenue) | `GET` | `/api/v1/merchant/revenue` | `{ period: 'day' \| 'week' \| 'month' }` | SCR-34 (`/merchant/reports`) — Doanh thu | Vẽ biểu đồ cột doanh thu |
| **Merchant Payout**| `useMutation` (Withdraw) | `POST` | `/api/v1/withdrawals` | `{ amount, bankName, bankAccountNumber, accountHolder }`| SCR-35 (`/merchant/finances`) — Rút tiền ví | Trừ số dư khả dụng, tạo lệnh chờ |
| **Notifications** | `useQuery` (Notifications) | `GET` | `/api/v1/notifications` | `{ page, size }` | SCR-22 (`/driver/notifications`) — Thông báo | Badge số đếm trên chuông Header |
| **AI Copilot** | `useMutation` (Chat) | `POST` | `/api/v1/ai/chat` | `{ message, history }` | Floating AI Copilot Widget | Hiển thị tin nhắn người dùng và câu trả lời AI |
| **Admin Dashboard**| `useQuery` (Admin Stats) | `GET` | `/api/v1/admin/dashboard` | None | SCR-40 (`/admin`) — Chỉ số sàn toàn quốc | Grid 4 Metrics thẻ |
| **Admin Lots** | `useQuery` (Pending Lots) | `GET` | `/api/v1/admin/parking-lots` | `{ status: 'PENDING_APPROVAL' }` | SCR-43 (`/admin/parking-lots`) — Duyệt bãi | Bảng DataTable bãi chờ duyệt |
| **Admin Actions** | `useMutation` (Decision) | `PUT` | `/api/v1/admin/{path}` | `{ reason, action }` | SCR-41 (Khóa user), SCR-43 (Duyệt bãi), SCR-47 (Duyệt rút tiền)| `DecisionDialog` đóng, refresh data |
| **Admin Audit** | `useQuery` (Audit Logs) | `GET` | `/api/v1/admin/audit-logs` | `{ page, size, serviceName }` | SCR-50 (`/admin/audit-logs`) — Nhật ký | Viewer hiển thị log JSON |
