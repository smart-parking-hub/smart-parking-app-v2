# Screen Specification: SCR-028 MerchantParkingLotsPage (Danh sách bãi đỗ)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-028`
- **Screen Name:** Danh mục bãi đỗ xe sở hữu (Merchant Parking Lots Directory)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/parking-lots` (Định nghĩa tại [`AppRoutes.tsx:121`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L121) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantParkingLotsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/parking-lots/pages/MerchantParkingLotsPage.tsx)
- **Sub-components:** Ant Design `Table`, `Input`, `Select`, `Button`, `Tag`, `Alert`, `Empty`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cung cấp danh mục số hóa toàn diện về tất cả các bãi đỗ xe thuộc quyền quản lý của Merchant.
2. Theo dõi trạng thái thẩm định hồ sơ của từng bãi xe theo vòng đời xét duyệt của Admin (`PENDING_APPROVAL`, `CHANGES_REQUESTED`, `APPROVED`, `REJECTED`, `SUSPENDED`).
3. Cung cấp công cụ tìm kiếm theo tên/địa chỉ và bộ lọc trạng thái để chủ chuỗi bãi xe dễ dàng quản lý hàng chục địa điểm đỗ xe.
4. Đóng vai trò là cổng điều hướng trung tâm dẫn tới các tác vụ quản trị: Xem chi tiết bãi (`SCR-030`), Chỉnh sửa (`SCR-031`), Cấu hình Slot (`SCR-032`) và Cấu hình Bảng giá (`SCR-033`).

### B. Target Users
- Chủ bãi đỗ hoặc nhân viên quản lý cơ sở của doanh nghiệp bến bãi.

### C. Entry Points
- Click mục "Bãi đỗ" trên Sidebar menu của `MerchantLayout`.
- Điều hướng từ nút "Về danh sách bãi" tại các trang chi tiết.

### D. Exit Points
- Click nút `Tạo bãi mới`: Chuyển sang `/merchant/parking-lots/new` (`SCR-029`).
- Click nút `Chi tiết` trên một hàng bãi xe: Chuyển sang `/merchant/parking-lots/:id` (`SCR-030`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang
- Tiêu đề H1: `Bãi đỗ của tôi`.
- Mô tả phụ: `Quản lý hồ sơ, sức chứa và bảng giá của các bãi thuộc quyền sở hữu.`
- Nút hành động: `Tạo bãi mới` (Primary Button, icon `PlusOutlined`).

### B. Thanh Công Cụ Bộ Lọc (.merchant-filter-bar)
1. **Ô tìm kiếm từ khóa:** `Input` prefix icon `SearchOutlined`, placeholder `Tìm theo tên hoặc địa chỉ`, nút addon `Tìm`, hỗ trợ bấm phím Enter.
2. **Bộ lọc trạng thái duyệt:** Dropdown `Select allowClear`, placeholder `Tất cả trạng thái`:
   - `PENDING_APPROVAL`: Chờ phê duyệt (Tag màu vàng `gold`).
   - `CHANGES_REQUESTED`: Cần bổ sung (Tag màu tím `purple`).
   - `APPROVED`: Đã phê duyệt (Tag màu xanh lá `green`).
   - `REJECTED`: Bị từ chối (Tag màu đỏ `red`).
   - `SUSPENDED`: Tạm ngưng (Tag màu xám `default`).
3. **Bộ chọn sắp xếp:** Dropdown `Select` gồm 4 tùy chọn:
   - `createdAt,desc`: Mới tạo gần đây.
   - `createdAt,asc`: Cũ nhất trước.
   - `name,asc`: Tên A–Z.
   - `name,desc`: Tên Z–A.

### C. Bảng Dữ Liệu Bãi Đỗ (Data Table)
Bảng Ant Design `Table` cuộn ngang (`scroll={{ x: 760 }}`):
- Cột 1: **Tên bãi** (`name`) - Chữ in đậm.
- Cột 2: **Địa chỉ** (`address`) - Ẩn trên mobile, hiển thị từ breakpoint `md`.
- Cột 3: **Trạng thái** (`status`, width: 155px) - Tag màu sắc ngữ cảnh theo trạng thái.
- Cột 4: **Đánh giá** (`ratingAverage`, width: 100px) - Hiển thị điểm số dạng `4.5/5` hoặc `Chưa có`.
- Cột 5: **Ngày tạo** (`createdAt`, width: 155px) - Định dạng `dd/MM/yyyy HH:mm`.
- Cột 6: **Thao tác** (width: 110px) - Nút Link `Chi tiết` (icon `EyeOutlined`).
- Phân trang: Số lượng 10, 20, 50 bãi/trang, hiển thị tổng số bãi.

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-028-01** | Xem danh sách bãi đỗ | Mở trang `/merchant/parking-lots` | Token Merchant, page, size | Đã đăng nhập vai trò MERCHANT | Hiển thị bảng danh sách bãi đỗ phân trang |
| **FN-028-02** | Tìm kiếm bãi đỗ theo từ khóa | Nhập text & Click `Tìm` | Từ khóa tên bãi hoặc địa chỉ | Không | Lọc danh sách bãi đỗ khớp từ khóa, reset về trang 1 |
| **FN-028-03** | Lọc theo trạng thái duyệt | Chọn tùy chọn trong dropdown | Giá trị trạng thái (`status`) | Không | Bảng chỉ hiển thị bãi có trạng thái tương ứng |
| **FN-028-04** | Thay đổi tiêu chí sắp xếp | Chọn dropdown sắp xếp | Chuỗi sort (ví dụ `name,asc`) | Không | Tải lại danh sách theo thứ tự đã chọn |
| **FN-028-05** | Mở trang tạo bãi mới | Click `Tạo bãi mới` | Không | Không | Điều hướng sang `/merchant/parking-lots/new` (`SCR-029`) |
| **FN-028-06** | Mở trang chi tiết bãi | Click `Chi tiết` | ID bãi đỗ | Hàng dữ liệu tồn tại | Điều hướng sang `/merchant/parking-lots/:id` (`SCR-030`) |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
- `GET /api/v1/merchant/parking-lots`: Lấy danh sách bãi đỗ của Merchant đang đăng nhập.
  - Query params: `page`, `size`, `status`, `keyword`, `sort`.

### B. Controller & Method
- [`ParkingLotController.java:45-56`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/ParkingLotController.java#L45-L56):
  - `getMerchantParkingLots(@AuthenticationPrincipal CustomUserDetails u, @RequestParam int page, @RequestParam int size, @RequestParam(required = false) ParkingLotStatusEnum status, @RequestParam(required = false) String keyword, @RequestParam String sort)`
  - Quyền hạn: `@PreAuthorize("hasRole('MERCHANT')")`

### C. Service Implementation
- [`ParkingLotServiceImpl.getMerchantParkingLots()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/ParkingLotServiceImpl.java): Truy vấn phân trang qua repository theo `merchantId`, lọc động theo `status` và `keyword` (tìm kiếm không phân biệt chữ hoa thường trong tên bãi hoặc địa chỉ).

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Hiển thị component Ant Design `Table loading={true}`.
- **Empty State:**
  - Nếu có áp dụng bộ lọc: Ant Design `Empty description="Không có bãi đỗ phù hợp bộ lọc"`.
  - Nếu tài khoản chưa tạo bãi nào: Ant Design `Empty description="Bạn chưa tạo bãi đỗ nào"`.
- **Error State:** Hiển thị `Alert type="error"` kèm nút `Thử lại`.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **5 trạng thái phê duyệt cốt lõi:** Bắt buộc thể hiện rõ ràng trạng thái duyệt vì Merchant chỉ được nhận khách khi bãi đạt trạng thái `APPROVED`.
2. **Khả năng tìm kiếm & phân trang server-side:** Bảo đảm hiệu năng khi Merchant có chuỗi hàng chục bãi xe khắp các tỉnh thành.

### B. Đề Xuất Cải Thiện
1. **Chế độ xem Thẻ (Card View / Grid View):** Cho phép người dùng chuyển đổi giữa chế độ xem Bảng dữ liệu và Thẻ ảnh trực quan (kèm ảnh bìa của bãi) để tăng tính thẩm mỹ.
2. **Hiển thị nhanh số slot trống:** Bổ sung chỉ số tóm tắt sức chứa (ví dụ: `45/50 slot đang trống`) ngay trên từng dòng của bảng danh sách.
