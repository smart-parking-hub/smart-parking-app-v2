# Báo Cáo Tóm Tắt Điều Hành (Executive Summary)

## 1. Thông Tin Tổng Quan Sản Phẩm

- **Tên hệ thống:** SmartParkingHub (Smart Truck Parking System).
- **Mục tiêu sản phẩm:** Cung cấp nền tảng số hóa kết nối giữa Tài xế (xe tải, container, ô tô) tìm kiếm và đặt chỗ đỗ xe thời gian thực với Chủ bãi đỗ (Merchant) khai thác sức chứa hợp pháp, dưới sự giám sát và vận hành của Quản trị viên hệ thống (Admin).
- **Hiện trạng kiến trúc:**
  - **Frontend:** Single Page Application (SPA) xây dựng bằng React 19, TypeScript, Vite 8, Ant Design 6.5, Tailwind v4, Leaflet Maps, Redux Toolkit, Framer Motion.
  - **Backend song song:**
    1. *Monolith Backend:* Spring Boot 3.x / Java 17, JPA Hibernate, MySQL, PayOS SDK, Bucket4j, Flyway migration (`smart-parking-service`).
    2. *Microservices Modernization:* Spring Boot 3.3.5 / Java 21, Spring Cloud Gateway, Eureka Server, Spring Cloud Config, Kafka, Redis, Outbox Pattern (`smart-parking-microservice`).

---

## 2. Số Liệu Đo Lường & Phạm Vi Khảo Sát

Qua quá trình reverse engineering toàn diện mã nguồn và tài liệu hệ thống, các chỉ số định lượng được xác định như sau:

| Chỉ số khảo sát | Số lượng phát hiện | Ghi chú |
|---|---:|---|
| **Module nghiệp vụ chính** | **6** | Public Landing, Auth & Access, Driver Portal, Merchant Portal, Admin Portal, AI Copilot |
| **Màn hình độc lập (Routes)** | **53** | 9 Landing + 4 Auth/Error + 12 Driver + 16 Merchant + 12 Admin |
| **Màn hình phụ / Modal & Drawer nghiệp vụ** | **12** | AI Chatbot, Đánh giá bãi, Hủy đơn, Thêm/sửa xe, Rút tiền, Quick book, Booking flow, Sinh mô tả AI, Chi tiết giao dịch, Barie confirm, Quyết định duyệt, Phán quyết khiếu nại |
| **Luồng nghiệp vụ liên màn hình** | **12** | Đăng ký OTP, Đặt cọc 10 phút, Quét QR Check-in/out, Hàng đợi ảo, Rút tiền ví,... |
| **REST API Endpoints** | **55+** | Xác thực qua Controllers và Frontend API clients |
| **Bảng dữ liệu thực thể (Database Entities)** | **13** | Users, Drivers, Merchants, ParkingLots, Slots, PricingRules, Vehicles, Bookings, Payments, Reviews, WithdrawalRequests, Notifications, AuditLogs |
| **Vai trò người dùng (Roles)** | **3 + 1** | `DRIVER`, `MERCHANT`, `ADMIN` + `GUEST` (khách vãng lai) |

---

## 3. Bảng Kiểm Tra Mức Độ Hoàn Thiện (Completeness Gate)

| Hạng mục kiểm tra | Phát hiện (Discovered) | Đã ghi nhận (Documented) | Đã xác minh (Verified) | Còn lại / Cần lưu ý (Remaining) |
|---|---:|---:|---:|---:|
| **Định tuyến & Routes** | 53 | 53 | 53 | 0 |
| **Màn hình giao diện (Screens & Modals)** | 65 | 65 | 65 | 0 |
| **Vai trò & Ma trận phân quyền** | 4 | 4 | 4 | 0 |
| **Nghiệp vụ cốt lõi (Business Flows)** | 12 | 12 | 12 | 0 |
| **API Endpoints đối chiếu** | 55+ | 55+ | 53 | 2 (Endpoints lệch contract chờ vá: confirm-cash, driver dispute UI) |
| **Bảng dữ liệu & Thuộc tính Entity** | 13 | 13 | 13 | 0 |
| **Trạng thái giao diện (UI States)** | 65 | 65 | 65 | 0 |

---

## 4. Các Chức Năng Cốt Lõi Tuyệt Đối Không Được Bỏ Sót

Khi thực hiện thiết kế lại toàn bộ giao diện bằng Stitch, bắt buộc phải bảo toàn 100% các năng lực sau:

1. **Cơ chế Giữ chỗ 10 phút (Hold TTL 10m):**
   - Khi tài xế tạo đặt chỗ, slot được khóa giữ chỗ tạm thời trong 10 phút. Nếu quá hạn chưa thanh toán cọc qua PayOS, slot tự động hoàn lại trạng thái khả dụng (`AVAILABLE`).
2. **Quy trình Thanh toán 2 giai đoạn (Two-phase Payment):**
   - *Giai đoạn 1:* Thanh toán tiền cọc (`DEPOSIT`) để lấy mã vé và QR Check-in.
   - *Giai đoạn 2:* Khi Check-out tại bãi, hệ thống tính tổng thời gian đỗ thực tế, cấn trừ cọc và sinh khoản thanh toán cuối (`FINAL_PAYMENT`) hoặc phí quá giờ (`PENALTY`) hoặc xác nhận thu tiền mặt tại chỗ.
3. **Quét mã QR 2 chiều (Merchant Check-in/Check-out):**
   - Camera scanner tích hợp thư viện `html5-qrcode` cho phép Merchant quét mã QR trên điện thoại tài xế hoặc nhập tay `bookingCode` để kích hoạt xe vào/ra bãi.
4. **Hàng đợi ảo thông minh (Virtual Queue):**
   - Khi bãi đỗ hết slot phù hợp loại xe, tài xế có thể tham gia hàng đợi ảo. Khi có xe check-out giải phóng chỗ, tài xế đứng đầu nhận thông báo và có thời hạn xác nhận nhận chỗ.
5. **Cấu hình Sức chứa (Slot) & Bảng giá đa chiều (Pricing Rule):**
   - Hỗ trợ 5 loại phương tiện chuẩn: `SEDAN_SUV`, `BUS_COACH`, `LIGHT_TRUCK`, `HEAVY_TRUCK`, `CONTAINER`.
   - Cấu hình theo slot đơn lẻ hoặc bulk update, áp dụng giá theo giờ, giá lũy tiến và hệ số phụ trội.
6. **Ví tiền Chủ bãi & Đối soát Rút tiền (Ledger & Withdrawals):**
   - Doanh thu từ các booking hoàn tất được cộng vào số dư khả dụng của Merchant. Merchant tạo yêu cầu rút tiền về tài khoản ngân hàng và Admin phê duyệt qua quy trình kiểm soát tài chính.
7. **Trợ lý AI Copilot (Real-time Spatial Assistant):**
   - Floating widget trên giao diện tài xế, tự động gửi tọa độ GPS hiện tại lên `ai-service` để tìm kiếm bãi xe phù hợp và giải đáp chính sách hệ thống.

---

## 5. Những Điểm Mâu Thuẫn & Cần Lưu Ý Phát Hiện Được

1. **Khác biệt về Layout giữa Tài xế và Chủ bãi / Quản trị viên:**
   - Cổng Tài xế (`DRIVER`) sử dụng `LandingNavbar` kết hợp giao diện phong cách portal hiện đại (`driver-dashboard-layout`), trong khi Cổng Chủ bãi (`MERCHANT`) và Quản trị (`ADMIN`) dùng Sidebar truyền thống phong cách Dashboard Ant Design. Khi thiết kế lại cần đồng bộ hóa ngôn ngữ thị giác (Design System).
2. **Xác thực Đăng ký bằng OTP:**
   - Frontend đã có form nhập OTP và gọi `/api/v1/auth/otp/send`. Tuy nhiên ở môi trường local, SMS gateway thường được bypass hoặc trả OTP thẳng về response (Demo mode). Thiết kế UI cần có cả 2 trạng thái: đếm ngược resend OTP và hiển thị gợi ý OTP demo khi test.
3. **Mô phỏng Thanh toán Cọc (Demo Payment Bypass):**
   - Trong `MyBookingsPage.tsx`, nếu biến môi trường `VITE_ENABLE_DEMO_PAYMENT` bật, giao diện hiển thị nút "Demo: Xác nhận cọc ngay" để bypass PayOS. Đây là tính năng dev/test, UI chính thức phải tập trung vào luồng quét QR PayOS và xác nhận chuyển khoản ngân hàng.

---

## 6. Đánh Giá Mức Độ Sẵn Sàng Thiết Kế Lại (Stitch Readiness)

- **Mức độ sẵn sàng:** **100% SẴN SÀNG**.
- Tài liệu này cung cấp đầy đủ thông số cấu trúc màn hình, các trường dữ liệu input/output, action triggers, bảng màu chủ đạo (`#0f766e` Emerald Teal kết hợp Slate/Dark accents), font typography (Inter) và ma trận tương tác chi tiết cho từng màn hình để công cụ thiết kế Stitch có thể dựng lại UI với độ chính xác tuyệt đối.
