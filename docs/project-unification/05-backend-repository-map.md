# 05. Bản Đồ Nguồn Dữ Liệu & Hệ Thống Backend (Backend Repository Map)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** DISCOVERY ONLY (Tuân thủ PROJECT UNIFICATION MASTER RULES)  
> **Thời điểm kiểm tra:** 07/11/2026  
> **Vị trí Backend thực tế:** `smart-parking-microservice/` (Tồn tại trong cùng workspace)  
> **Trạng thái:** VERIFIED 100% (Khảo sát trực tiếp cấu hình Spring Cloud, 19 Controller Java, SecurityConfig và DTOs)

---

## 1. Tổng Quan Kiến Trúc Microservices Backend

Hệ thống Backend của Smart Parking Hub được xây dựng trên nền tảng **Spring Boot 3.x / Java 17**, kiến trúc hướng dịch vụ (Microservices Architecture), giao tiếp thông qua **API Gateway** và phân tán tải theo từng miền nghiệp vụ:

```
┌────────────────────────────────────────────────────────────────────────┐
│ BẢN ĐỒ KIẾN TRÚC SMART PARKING MICROSERVICES (PORT REGISTRY)           │
├────────────────────────────────────────────────────────────────────────┤
│ 1. API GATEWAY         : Port 8088  ──> Điểm tiếp nhận API duy nhất    │
│ 2. IDENTITY SERVICE    : Port 8081  ──> Auth, Users, Drivers, Vehicles │
│ 3. PARKING LOT SERVICE : Port 8082  ──> Bãi đỗ xe, Sức chứa, Biểu phí  │
│ 4. BOOKING SERVICE     : Port 8083  ──> Đặt chỗ, Hàng đợi ảo, Barie QR │
│ 5. PAYMENT SERVICE     : Port 8084  ──> PayOS VietQR, Ví, Tranh chấp   │
│ 6. NOTIFICATION SERVICE: Port 8085  ──> Web Push 24/7, Thông báo Ops   │
│ 7. AI SERVICE          : Port 8086  ──> Nhận diện biển số xe ALPR      │
│ ────────────────────────────────────────────────────────────────────── │
│ HẠ TẦNG HỖ TRỢ:                                                        │
│ • DISCOVERY SERVER     : Port 8761  ──> Netflix Eureka Service Registry│
│ • CONFIG SERVER        : Port 8888  ──> Spring Cloud Config Server     │
│ • COMMON LIBRARY       : Shared JAR ──> Base DTOs, Exceptions, Enums   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Bản Đồ Định Tuyến API Gateway (`application.yml`)

Nằm tại `smart-parking-microservice/api-gateway/src/main/resources/application.yml`, Gateway là lớp bảo vệ và chuyển tiếp (Reverse Proxy) mọi request từ Frontend tới các dịch vụ chuyên trách:

| Tuyến Đường Gateway (Path Predicates) | Dịch Vụ Đích (Microservice Target) | Cổng Nội Bộ (URI Target) | Vai Trò Nghiệp Vụ Tương Ứng Trên Frontend |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/**`<br>`/api/v1/users/**`<br>`/api/v1/drivers/**`<br>`/api/v1/merchants/**`<br>`/api/v1/merchant/profile/**`<br>`/api/v1/vehicles/**`<br>`/api/v1/admin/users/**`<br>`/api/v1/admin/audit-logs/**` | **identity-service** | `http://localhost:8081` | • Đăng nhập, đăng ký, khôi phục mật khẩu (`auth`).<br>• Hồ sơ cá nhân tài xế (`profile`).<br>• Hồ sơ pháp nhân & ngân hàng chủ bãi (`merchant/profile`).<br>• Danh mục phương tiện đầu kéo (`vehicles`).<br>• Quản trị người dùng & Audit logs Admin (`admin`). |
| `/api/v1/parking-lots/**`<br>`/api/v1/merchant/parking-lots/**`<br>`/api/v1/slots/**`<br>`/api/v1/pricing-rules/**`<br>`/api/v1/admin/parking-lots/**` | **parking-lot-service** | `http://localhost:8082` | • Tìm kiếm bãi đỗ GPS & chi tiết bãi (`parking-search`, `parking-detail`).<br>• Quản lý bãi đỗ xe sở hữu (`merchant/parking-lots`).<br>• Cấu hình sức chứa slots (`merchant/slots`).<br>• Cấu hình bảng giá (`merchant/pricing`).<br>• Hàng đợi kiểm duyệt bãi của Admin (`admin/parking-lots`). |
| `/api/v1/bookings/**`<br>`/api/v1/queues/**`<br>`/api/v1/reviews/**`<br>`/api/v1/merchant/check-in/**`<br>`/api/v1/merchant/check-out/**`<br>`/api/v1/merchant/confirm-cash/**`<br>`/api/v1/merchant/bookings/**` | **booking-service** | `http://localhost:8083` | • Đặt giữ chỗ 10 phút & danh sách vé đỗ (`bookings`).<br>• Hàng đợi ảo thông minh (`queues`).<br>• Đánh giá bãi đỗ xe (`reviews`).<br>• Quét mã QR barie cổng vào/ra (`merchant/qr-scanner`).<br>• Quản lý lượt đỗ xe của chủ bãi (`merchant/bookings`). |
| `/api/v1/payments/**`<br>`/api/v1/withdrawals/**`<br>`/api/v1/disputes/**`<br>`/api/v1/merchant/revenue/**`<br>`/api/v1/admin/withdrawals/**`<br>`/api/v1/admin/transactions/**`<br>`/api/v1/admin/dashboard/**` | **payment-service** | `http://localhost:8084` | • Cổng thanh toán tự động VietQR PayOS (`payments`).<br>• Lệnh rút tiền chủ bãi (`merchant/withdrawals`).<br>• Khiếu nại tài xế, chủ bãi và trọng tài (`disputes`).<br>• Báo cáo doanh thu chủ bãi (`merchant/revenue`).<br>• Sổ cái giao dịch, giải ngân, dashboard Admin (`admin`). |
| `/api/v1/notifications/**` | **notification-service** | `http://localhost:8085` | • Trung tâm thông báo & đăng ký Web Push 24/7 cho cả Driver, Merchant và Admin (`notifications`, `portal`). |
| `/api/v1/ai/**` | **ai-service** | `http://localhost:8086` | • Nhận diện biển số xe ALPR từ camera luồng vào/ra tại cổng barie. |

---

## 3. Danh Mục Chi Tiết 19 Controller Java & Endpoints Nghiệp Vụ

Dự án sở hữu 19 Controller RESTful chính thức, khớp nối 100% với các API Services của Frontend:

```
smart-parking-microservice/
├── ai-service/
│   └── AiController.java
│       • POST /api/v1/ai/license-plate/recognize ──> Nhận diện biển số xe từ hình ảnh/camera
│       • GET  /api/v1/ai/stats                  ──> Thống kê độ chính xác ALPR 0.2s
│
├── booking-service/
│   ├── BookingController.java
│   │   • POST /api/v1/bookings                  ──> Tạo đặt giữ chỗ 10 phút (Create Booking)
│   │   • GET  /api/v1/bookings/my-bookings      ──> Lấy danh sách vé đỗ của tài xế
│   │   • GET  /api/v1/bookings/{id}             ──> Xem chi tiết vé đỗ xe điện tử QR
│   │   • POST /api/v1/bookings/{id}/cancel      ──> Hủy vé và yêu cầu hoàn cọc 100%
│   ├── MerchantCheckInOutController.java
│   │   • POST /api/v1/merchant/check-in         ──> Quét QR xác nhận xe vào bãi, mở barie
│   │   • POST /api/v1/merchant/check-out        ──> Quét QR xác nhận xe ra bãi, tính cước
│   │   • POST /api/v1/merchant/confirm-cash     ──> Xác nhận tài xế thanh toán tiền mặt tại cổng
│   │   • GET  /api/v1/merchant/bookings         ──> Danh sách lượt xe trong ngày của chủ bãi
│   ├── QueueController.java
│   │   • GET  /api/v1/queues/active             ──> Lấy trạng thái hàng đợi ảo của tài xế
│   │   • POST /api/v1/queues/accept             ──> Chấp thuận lấy slot trống trong 5 phút
│   │   • POST /api/v1/queues/leave              ──> Rời khỏi hàng đợi ảo
│   └── ReviewController.java
│       • POST /api/v1/reviews                   ──> Gửi đánh giá sao & nhận xét sau khi đỗ xe
│       • GET  /api/v1/reviews/lot/{lotId}       ──> Lấy danh sách đánh giá của một bãi đỗ
│
├── identity-service/
│   ├── AuthController.java
│   │   • POST /api/v1/auth/login                ──> Xác thực SĐT/mật khẩu, cấp phát JWT Bearer
│   │   • POST /api/v1/auth/register             ──> Đăng ký tài khoản Driver / Merchant
│   │   • POST /api/v1/auth/forgot-password      ──> Gửi mã OTP khôi phục mật khẩu
│   │   • POST /api/v1/auth/reset-password       ──> Đặt lại mật khẩu với mã OTP
│   │   • POST /api/v1/auth/change-password      ──> Đổi mật khẩu tài khoản
│   ├── UserController.java
│   │   • GET  /api/v1/drivers/profile           ──> Lấy hồ sơ tài xế và số liên hệ khẩn cấp
│   │   • PUT  /api/v1/drivers/profile           ──> Cập nhật thông tin cá nhân tài xế
│   ├── MerchantProfileController.java
│   │   • GET  /api/v1/merchant/profile          ──> Lấy thông tin pháp nhân & STK ngân hàng
│   │   • PUT  /api/v1/merchant/profile          ──> Cập nhật STK ngân hàng thụ hưởng giải ngân
│   ├── VehicleController.java
│   │   • GET  /api/v1/vehicles                  ──> Lấy danh sách đầu kéo/rơ-moóc của tài xế
│   │   • POST /api/v1/vehicles                  ──> Thêm phương tiện mới kèm biển số
│   │   • PUT  /api/v1/vehicles/{id}             ──> Sửa thông tin phương tiện
│   │   • DELETE /api/v1/vehicles/{id}           ──> Xóa phương tiện khỏi danh sách
│   └── AdminUserController.java
│       • GET  /api/v1/admin/users               ──> Danh sách người dùng toàn hệ thống (phân trang)
│       • GET  /api/v1/admin/users/{id}          ──> Xem chi tiết hồ sơ người dùng
│       • POST /api/v1/admin/users/{id}/enforce  ──> Khóa tài khoản vi phạm (Ban / Suspend)
│       • GET  /api/v1/admin/audit-logs          ──> Xem nhật ký kiểm toán an ninh
│
├── notification-service/
│   └── NotificationController.java
│       • GET  /api/v1/notifications             ──> Lấy danh sách thông báo của tài xế
│       • GET  /api/v1/notifications/merchant    ──> Lấy danh sách thông báo của chủ bãi
│       • GET  /api/v1/notifications/admin       ──> Lấy danh sách thông báo an ninh của Admin
│       • PUT  /api/v1/notifications/{id}/read   ──> Đánh dấu đã đọc thông báo
│       • POST /api/v1/notifications/web-push-subscribe ──> Đăng ký Web Push subscription
│
├── parking-lot-service/
│   ├── ParkingLotController.java
│   │   • GET  /api/v1/parking-lots              ──> Tìm kiếm bãi đỗ xe theo tọa độ GPS / Bán kính
│   │   • GET  /api/v1/parking-lots/{id}         ──> Chi tiết bãi đỗ xe & tiện ích bến bãi
│   │   • GET  /api/v1/merchant/parking-lots     ──> Danh mục bãi đỗ thuộc sở hữu chủ bãi
│   │   • POST /api/v1/merchant/parking-lots     ──> Khởi tạo hồ sơ bãi đỗ xe mới gửi duyệt
│   │   • PUT  /api/v1/merchant/parking-lots/{id}──> Cập nhật thông tin bãi đỗ xe
│   ├── ParkingLotImageController.java
│   │   • POST /api/v1/parking-lots/{id}/images  ──> Tải lên hình ảnh mặt bằng thực tế
│   │   • DELETE /api/v1/parking-lots/{id}/images/{imgId} ──> Xóa hình ảnh
│   └── AdminParkingLotController.java
│       • GET  /api/v1/admin/parking-lots        ──> Hàng đợi hồ sơ bãi đỗ xe chờ kiểm duyệt
│       • GET  /api/v1/admin/parking-lots/{id}   ──> Hồ sơ thẩm định kỹ thuật chi tiết
│       • POST /api/v1/admin/parking-lots/{id}/decision ──> Quyết định duyệt / từ chối hồ sơ
│
└── payment-service/
    ├── PaymentController.java
    │   • POST /api/v1/payments/create-deposit   ──> Khởi tạo cọc 20% qua PayOS VietQR
    │   • GET  /api/v1/payments/verify-return    ──> Tiếp nhận kết quả thanh toán từ Webhook PayOS
    │   • POST /api/v1/payments/repay            ──> Kích hoạt lại liên kết thanh toán khi bị hủy
    │   • GET  /api/v1/payments/history          ──> Lịch sử giao dịch & xuất hóa đơn VAT tài xế
    ├── WithdrawalController.java
    │   • GET  /api/v1/withdrawals/my-requests   ──> Lịch sử lệnh rút tiền của chủ bãi
    │   • POST /api/v1/withdrawals/create        ──> Tạo lệnh rút tiền mới (ngưỡng tối thiểu 50k)
    │   • GET  /api/v1/admin/withdrawals         ──> Bàn quyết toán giải ngân cho Admin
    │   • POST /api/v1/admin/withdrawals/{id}/approve ──> Admin duyệt chuyển khoản giải ngân
    │   • POST /api/v1/admin/withdrawals/{id}/reject  ──> Admin từ chối lệnh rút kèm lý do
    ├── MerchantRevenueController.java
    │   • GET  /api/v1/merchant/revenue/analytics──> Báo cáo phân tích doanh thu thực nhận
    ├── DisputeController.java
    │   • GET  /api/v1/disputes/my-disputes      ──> Danh sách khiếu nại của tài xế
    │   • GET  /api/v1/disputes/merchant-disputes──> Danh sách khiếu nại liên quan tới chủ bãi
    │   • GET  /api/v1/disputes/admin-docket     ──> Tòa trọng tài giải quyết khiếu nại Admin
    │   • GET  /api/v1/disputes/{id}             ──> Chi tiết hồ sơ và chứng từ vụ việc
    │   • POST /api/v1/disputes/{id}/verdict     ──> Admin ban hành phán quyết phân xử cuối cùng
    └── AdminFinanceController.java
        • GET  /api/v1/admin/dashboard           ──> Chỉ số tài chính & dòng tiền toàn sàn
        • GET  /api/v1/admin/transactions        ──> Sổ cái giao dịch VietQR toàn hệ thống
```

---

## 4. Cấu Hình An Ninh & Phân Quyền (Spring Security & JWT RBAC)

Nằm tại `smart-parking-microservice/identity-service/src/main/java/.../SecurityConfig.java`:
- **Cơ chế:** Stateless Session (`SessionCreationPolicy.STATELESS`), tắt CSRF/CORS nội bộ (CORS được xử lý tập trung tại API Gateway).
- **Phân luồng kiểm soát:**
  ```java
  auth.requestMatchers("/api/v1/auth/**").permitAll()
      .requestMatchers("/actuator/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
      .requestMatchers("/error").permitAll()
      .requestMatchers("/api/v1/merchant/**").hasRole("MERCHANT")
      .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
      .anyRequest().authenticated();
  ```
- **JWT Provider:** Mã hóa HMAC-SHA256 với khóa bí mật `JWT_SECRET`, thời hạn sống mặc định của Access Token là 24 giờ.
- **Mã hóa mật khẩu:** Sử dụng thuật toán `BCryptPasswordEncoder` với độ phức tạp cao, bảo vệ tuyệt đối thông tin người dùng.

---

## 5. Tài Liệu OpenAPI / Swagger & Giao Tiếp Nội Bộ

- **OpenAPI Gateway JSON Endpoint:** `GET http://localhost:8088/v3/api-docs`
- **Swagger UI Interactive Console:** `http://localhost:8088/swagger-ui/index.html`
- **Giao tiếp liên dịch vụ (Inter-Service Communication):**
  - **Đồng bộ sự kiện:** Sử dụng Spring Cloud OpenFeign / RestTemplate gọi trực tiếp qua discovery service hoặc mạng Docker nội bộ.
  - **Tích hợp cổng bên thứ ba:** Tích hợp Webhooks thời gian thực từ PayOS VietQR (`POST /api/v1/payments/webhook`) để tự động cập nhật trạng thái đơn đặt chỗ sang `RESERVED` trong 0.2 giây.
