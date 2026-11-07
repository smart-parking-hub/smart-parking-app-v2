# Screen Specification: SCR-005 ApiIntegrationPage (Tài liệu Tích hợp API)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-005`
- **Screen Name:** Tài liệu & Cổng tích hợp API / Webhook (Developer & 3PL Integration)
- **Module:** `MOD-01: Public Landing & Marketing Website`
- **Route URL:** `/solutions/api` (Định nghĩa tại [`AppRoutes.tsx:81`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L81))
- **Layout Type:** `LandingLayout` ([`LandingLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingLayout.tsx))
- **Primary Component:** `smart-parking-app/src/features/landing/pages/ApiIntegrationPage.tsx`
- **Sub-components:** `LandingNavbar`, `LandingFooter`, Dark Code Terminal Mockup
- **Access Role:** Public (Lập trình viên, Kiến trúc sư hệ thống, Doanh nghiệp 3PL / Vận tải)
- **Discovery Status:** `VERIFIED` (Mã nguồn đã kiểm tra đối chiếu)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Cung cấp cổng thông tin kỹ thuật dành cho các đối tác công nghệ và doanh nghiệp logistics lớn (Enterprise 3PL):
1. Giới thiệu năng lực tích hợp mở của SmartTruck thông qua hệ thống **RESTful API** và **Webhook thông báo thời gian thực**.
2. Hướng dẫn các doanh nghiệp kết nối phần mềm quản lý vận tải nội bộ (TMS - Transportation Management System) hoặc phần mềm hoạch định doanh nghiệp (ERP - Enterprise Resource Planning) trực tiếp với mạng lưới bãi đỗ SmartTruck để tự động điều xe và giữ chỗ không qua thao tác thủ công.
3. Cung cấp ví dụ minh họa endpoint truy vấn danh sách bãi xe xung quanh tọa độ GPS.

### B. Target Users
- Kỹ sư phần mềm, Trưởng phòng CNTT của các công ty vận tải và bến bãi logistics.
- Các công ty phát triển giải pháp thiết bị giám sát hành trình (hộp đen ô tô).

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Tổng Thể
- Container căn giữa (`max-w-max-width-driver mx-auto px-container-padding py-24`).
- Tiêu đề trung tâm và Khung cửa sổ dòng lệnh Terminal màu tối (`bg-[#051821]`).

### B. Chi Tiết Khung Lập Trình Viên (Developer Terminal Block)
1. **Tiêu đề phân đoạn:** `Tài liệu API dành cho Nhà phát triển`.
2. **Mô tả kỹ thuật:** *"API của chúng tôi được thiết kế theo chuẩn RESTful, sử dụng JSON và hỗ trợ xác thực qua Bearer Token (JWT). Khởi tạo ứng dụng trong vài phút."*
3. **Mẫu Code Trực Quan (Code Syntax Snippet):**
   - Khung màu đen trong suốt (`bg-black/50 p-4 rounded-xl font-mono text-sm text-[#4ade80]`).
   - Yêu cầu mẫu:
     ```http
     GET /api/v1/parks/search?lat=10.762&lng=106.660&radius=5km
     ```
   - Phản hồi JSON mẫu:
     ```json
     // Response
     {
       "status": "success",
       "data": [
         { "id": "p_123", "name": "Bãi đỗ xe tải Q9", "available_spots": 15 }
       ]
     }
     ```
4. **Nút Hành Động:** `Xem Tài Liệu API` (`button.bg-primary.text-white`).

---

## 4. INTERACTION SPECIFICATION

| Tên Phần Tử | Loại UI | Hành Động | Trạng Thái Hiện Tại | Đánh Giá Kỹ Thuật |
|---|---|---|---|---|
| **Nút "Xem Tài Liệu API"** | Button | Click | **Chưa gắn Handler** (Không có `onClick`, không có liên kết) | `PARTIALLY_IMPLEMENTED` / `UI_DEAD_END` |

---

## 5. BACKEND MAPPING & EVIDENCE

- **Đối chiếu Endpoint mẫu trên UI với Backend thực tế:**
  - Trên giao diện hiển thị mẫu: `GET /api/v1/parks/search?lat=...`
  - Trong Backend thực tế ([`ParkingLotController.java:57`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/ParkingLotController.java#L57)):
    - Endpoint thực tế là: `GET /api/v1/parking-lots/search` (không phải `/api/v1/parks/search`).
    - Endpoint thực tế yêu cầu quyền `hasRole('DRIVER')` và yêu cầu tham số bắt buộc `vehicleType` (không chấp nhận gọi ẩn danh).
  - Backend có hỗ trợ tài liệu OpenAPI Swagger tại `/swagger-ui/index.html` hoặc `/api/public/openapi` ([`MayhemOpenApiSecurityConfig.java:19`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/security/MayhemOpenApiSecurityConfig.java#L19)), nhưng nút bấm ở Frontend chưa gắn link dẫn tới Swagger UI.

---

## 6. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá Kỹ thuật | Khuyến nghị thiết kế lại |
|---|---|---|
| **Nút "Xem Tài Liệu API" là nút chết (Dead Click)** | Người dùng click vào nút không có phản hồi nào xảy ra. | Gắn liên kết trực tiếp mở trang Swagger / OpenAPI UI của backend (hoặc dẫn sang cổng tài liệu Redoc/Postman Collection). |
| **Endpoint minh họa bị sai lệch so với Backend API thực tế** | Mẫu ghi `/api/v1/parks/search` trong khi backend là `/api/v1/parking-lots/search`, cấu trúc JSON phản hồi cũng khác so với `ApiResponse<PageResponse<ParkingLotSearchResponse>>`. | Cập nhật đoạn code mẫu đúng 100% với định dạng thực tế của Spring Boot Backend. |
| **Thiếu form yêu cầu cấp API Key / Sandbox** | Doanh nghiệp muốn tích hợp không có nơi đăng ký xin cấp `Client ID` & `Client Secret`. | Thêm form đăng ký Sandbox API Key tự phục vụ cho doanh nghiệp. |
