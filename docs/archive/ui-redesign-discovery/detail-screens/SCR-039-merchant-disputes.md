# Screen Specification: SCR-039 MerchantDisputesPage (Danh sách khiếu nại)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-039`
- **Screen Name:** Danh mục khiếu nại & Tranh chấp bãi đỗ xe (Merchant Disputes & Complaints Directory)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/disputes` (Định nghĩa tại [`AppRoutes.tsx:132`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L132) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantDisputesPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/disputes/pages/MerchantDisputesPage.tsx)
- **Sub-components:** Ant Design `Table`, `Select`, `Tag`, `Button`, `Alert`, `Empty`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cho phép Merchant theo dõi toàn bộ các khiếu nại, phản ánh hoặc tranh chấp do Tài xế (Driver) gửi lên hệ thống liên quan đến các lượt đỗ xe tại bãi của mình.
2. Giám sát các lý do tranh chấp thường gặp: Sai lệch cước phí quá giờ, sự cố va quẹt trong bãi, lỗi quét mã QR tại cổng, hoặc thái độ phục vụ của nhân viên bến bãi.
3. Theo dõi tiến trình hòa giải và phán quyết trọng tài từ Ban quản trị sàn (Admin) qua 4 trạng thái: Chờ xử lý (`PENDING`), Đang xem xét (`REVIEWING`), Đã giải quyết (`RESOLVED`), hoặc Đã từ chối (`REJECTED`).

### B. Target Users
- Chủ bãi đỗ xe, phụ trách chăm sóc khách hàng của bến bãi.

### C. Entry Points
- Click mục "Tranh chấp" trên Sidebar menu của `MerchantLayout`.
- Click từ thông báo tranh chấp mới trên Trung tâm thông báo (`SCR-041`).

### D. Exit Points
- Click nút `Chi tiết`: Điều hướng sang Chi tiết khiếu nại `/merchant/disputes/:ticketId` (`SCR-040`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang
- Tiêu đề H1: `Tranh chấp`.
- Mô tả phụ: `Theo dõi các khiếu nại liên quan đến booking tại bãi đỗ của bạn.`

### B. Thanh Công Cụ Bộ Lọc (.merchant-filter-card)
- Dropdown chọn trạng thái:
  - `ALL`: Tất cả trạng thái.
  - `PENDING`: Chờ xử lý (Tag màu vàng `gold`).
  - `REVIEWING`: Đang xem xét (Tag màu xanh dương `blue`).
  - `RESOLVED`: Đã giải quyết (Tag màu xanh lá `green`).
  - `REJECTED`: Đã từ chối (Tag màu đỏ `red`).
- Bộ đếm số lượng: `{visible.length} / {totalElements} tranh chấp`.

### C. Bảng Danh Sách Tranh Chấp (Data Table)
Bảng Ant Design `Table` cuộn ngang (`scroll={{ x: 1080 }}`):
- Cột 1: **Mã tranh chấp** - Định dạng `DSP-{id}` in đậm (ví dụ: `DSP-12`).
- Cột 2: **Booking liên kết** - Mã vé `bookingCode` hoặc `Booking #{bookingId}`.
- Cột 3: **Người tạo** - Số điện thoại tài xế khiếu nại.
- Cột 4: **Lý do khiếu nại** - Tiêu đề ngắn gọn, rê chuột hiển thị mô tả chi tiết.
- Cột 5: **Trạng thái** - Tag màu ngữ cảnh.
- Cột 6: **Ngày tạo** - Thời gian gửi (`dd/MM/yyyy HH:mm`).
- Cột 7: **Cập nhật** - Thời gian xử lý gần nhất.
- Cột 8: **Bãi đỗ** - Tên cơ sở bãi xe xảy ra sự việc.
- Cột 9: **Thao tác** - Nút Link `Chi tiết` (icon `EyeOutlined`).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-039-01** | Xem danh sách khiếu nại | Mở trang `/merchant/disputes` | Token Merchant, page, size | Đã đăng nhập vai trò MERCHANT | Hiển thị bảng các vụ tranh chấp liên quan đến bãi của mình |
| **FN-039-02** | Lọc theo trạng thái xử lý | Chọn dropdown trạng thái | Enum `MerchantDisputeStatus` | Không | Lọc danh sách tranh chấp theo trạng thái tương ứng |
| **FN-039-03** | Mở chi tiết vụ tranh chấp | Click nút `Chi tiết` | Ticket ID | Hàng dữ liệu tồn tại | Điều hướng sang `/merchant/disputes/:ticketId` (`SCR-040`) |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
- `GET /api/v1/disputes/merchant`: Lấy danh sách tranh chấp của các bãi thuộc Merchant đang đăng nhập (có phân trang).

### B. Controller & Method
- [`DisputeController.java:46-51`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/DisputeController.java#L46-L51):
  - `getMerchantDisputes(@AuthenticationPrincipal CustomUserDetails userDetails, Pageable pageable)`
  - Quyền hạn: `@PreAuthorize("hasRole('MERCHANT')")`

### C. Service Implementation
- [`DisputeServiceImpl.getMerchantDisputes()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/DisputeServiceImpl.java): Tìm tất cả các bản ghi `Dispute` có `booking.parkingLot.merchant.user.id = merchantUserId`.

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Component Ant Design `Table loading={true}`.
- **Empty State:** Hiển thị `Empty description="Chưa có tranh chấp nào"` (hoặc thông báo không khớp bộ lọc).
- **Error State:** Hiển thị `Alert type="error"` khi API trả về mã lỗi.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Phân quyền truy cập chính xác:** Merchant chỉ được nhìn thấy các vụ việc khiếu nại xảy ra tại bãi đỗ của chính mình; tuyệt đối không để lộ thông tin của bãi đối thủ.
2. **Liên kết với Booking gốc:** Luôn hiển thị mã booking liên kết để phục vụ đối soát camera an ninh và thời gian ra vào cổng.

### B. Đề Xuất Cải Thiện
1. **Khung gửi phản hồi giải trình (Merchant Explanation):** Cho phép Merchant gửi văn bản giải trình hoặc đính kèm ảnh bằng chứng camera trước khi Admin ban hành phán quyết cuối cùng.
