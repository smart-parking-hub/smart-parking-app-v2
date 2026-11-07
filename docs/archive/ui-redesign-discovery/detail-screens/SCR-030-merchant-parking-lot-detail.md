# Screen Specification: SCR-030 MerchantParkingLotDetailPage (Chi tiết bãi đỗ)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-030`
- **Screen Name:** Chi tiết hồ sơ kỹ thuật bãi đỗ xe (Merchant Parking Lot Technical & Operational View)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/parking-lots/:parkingLotId` (Định nghĩa tại [`AppRoutes.tsx:123`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L123) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantParkingLotDetailPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/parking-lots/pages/MerchantParkingLotDetailPage.tsx)
- **Sub-components:** Ant Design `Descriptions`, `Table`, `Image`, `Progress`, `Tag`, `Alert`, `Button`, `Upload`, `Skeleton`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cung cấp hồ sơ vận hành tập trung (360-degree view) cho từng bãi đỗ xe cụ thể: Thông số địa lý, thư viện hình ảnh, năng lực sức chứa theo từng loại xe, và biểu giá niêm yết.
2. Theo dõi kết quả doanh thu riêng lẻ của bãi đỗ để Merchant đánh giá hiệu quả sinh lời của từng cơ sở mặt bằng.
3. Giám sát trực tiếp các phương tiện đang đỗ thực tế (`PARKING`), đang chờ vào (`PENDING_CHECKIN`) hoặc đỗ quá giờ (`OVERTIME`) tại bãi.
4. Đóng vai trò là trung tâm kiểm soát cấu hình: Cho phép truy cập tính năng Chỉnh sửa thông tin (`SCR-031`), Cấu hình Slot (`SCR-032`), Cấu hình Bảng giá (`SCR-033`).

### B. Target Users
- Chủ bãi đỗ xe hoặc quản lý bãi xe kiểm tra tình trạng lấp đầy và quản lý hồ sơ bãi.

### C. Entry Points
- Click nút `Chi tiết` trên bảng danh mục bãi đỗ (`SCR-028`).
- Tự động chuyển hướng đến sau khi tạo bãi mới thành công (`SCR-029`) hoặc sau khi gửi sửa hồ sơ (`SCR-031`).
- Click từ nút "Chi tiết bãi" trên các trang cấu hình Slot (`SCR-032`) hoặc Bảng giá (`SCR-033`).

### D. Exit Points
- Click nút `Chỉnh sửa`: Điều hướng sang `/merchant/parking-lots/:id/edit` (`SCR-031`).
- Click nút `Slot`: Điều hướng sang `/merchant/parking-lots/:id/slots` (`SCR-032`).
- Click nút `Bảng giá`: Điều hướng sang `/merchant/parking-lots/:id/pricing` (`SCR-033`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang (.merchant-page-header)
- Thẻ Tag trạng thái bãi xe:
  - `PENDING_APPROVAL`: Đang chờ duyệt (màu vàng).
  - `CHANGES_REQUESTED`: Cần bổ sung (màu tím).
  - `APPROVED`: Đã duyệt (màu xanh lá).
  - `REJECTED`: Bị từ chối (màu đỏ).
  - `SUSPENDED`: Tạm ngưng (màu xám).
- Tiêu đề H1: Tên bãi đỗ xe (`lot.name`).
- Địa chỉ: Dòng văn bản địa chỉ (`lot.address`).
- Nhóm nút thao tác:
  - Nút `Chỉnh sửa` (icon `EditOutlined`, bị vô hiệu hóa nếu không phải chủ bãi).
  - Nút `Slot` (icon `SettingOutlined`, bị vô hiệu hóa nếu bãi chưa `APPROVED`).
  - Nút `Bảng giá` (icon `DollarOutlined`, bị vô hiệu hóa nếu bãi chưa `APPROVED`).

### B. Khối Cảnh Báo Trạng Thái (Status Banners)
- Nếu bãi ở trạng thái `PENDING_APPROVAL`: Hiển thị `Alert type="info"` thông báo: *"Đang chờ Admin duyệt bãi đỗ. Sau khi Admin phê duyệt, bạn mới được cấu hình Slot và Bảng giá để mở nhận đặt chỗ."*
- Nếu bãi ở trạng thái `REJECTED`: Hiển thị `Alert type="error"` thông báo lý do từ chối kèm khuyến nghị bấm "Chỉnh sửa" để gửi lại.

### C. Khối Thông Tin Chung & Doanh Thu Bãi
- Bảng `Descriptions`:
  - Tọa độ GPS: `Latitude, Longitude` (hiển thị 7 chữ số thập phân).
  - Đánh giá trung bình: Điểm số `/5` sao.
  - Ngày khởi tạo: Thời gian tạo bãi trên hệ thống.
  - Doanh thu tích lũy riêng của bãi: Số tiền VND từ API `getMerchantParkingLotRevenue(id)`.

### D. Khối Thư Viện Ảnh Bãi Đỗ (Photo Gallery)
- Khối hiển thị lưới ảnh `Image.PreviewGroup` cho phép bấm vào phóng to xem ảnh kích thước gốc.
- Nút tải thêm ảnh: Ant Design `Upload` (icon `UploadOutlined`), cho phép upload bổ sung ảnh thực tế vào bãi.

### E. Khối Cấu Hình Sức Chứa Slot (Slot Capacity Table)
Bảng dữ liệu tóm tắt theo từng loại phương tiện:
- Loại xe: Tên tiếng Việt từ `VEHICLE_TYPE_LABELS`.
- Tổng số chỗ (`totalCapacity`).
- Số chỗ trống khả dụng (`availableCapacity`).
- Tỷ lệ lấp đầy: Thanh `Progress` phần trăm trực quan.

### F. Khối Biểu Phí Niêm Yết (Pricing Rules Table)
Bảng danh mục giá cước:
- Đơn giá giờ cơ bản (VND/giờ).
- Hệ số giá cao điểm (`surgeMultiplier`) và khung giờ áp dụng.
- Hệ số phạt đỗ quá giờ (`overtimePenaltyMultiplier`).

### G. Khối Phương Tiện Đang Hoạt Động Tại Bãi (Active Vehicles)
- Lọc danh sách booking có trạng thái `PENDING_CHECKIN`, `PARKING`, `OVERTIME` tại bãi này.
- Hiển thị: Biển số xe, tên tài xế, loại xe, giờ dự kiến vào/ra, trạng thái vận hành.

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-030-01** | Tải toàn bộ hồ sơ bãi | Mở URL `/merchant/parking-lots/:id` | ID bãi đỗ từ URL | Bãi thuộc quyền sở hữu của Merchant | Tải đồng thời chi tiết bãi, slot, giá, doanh thu, danh sách xe |
| **FN-030-02** | Xem ảnh bãi phóng to | Click vào thumbnail ảnh | Ảnh được chọn | Thư viện có ảnh | Bật lightbox xem ảnh kích thước đầy đủ |
| **FN-030-03** | Tải thêm ảnh bãi | Click `Chọn ảnh` trong thư viện | File ảnh mới | File ảnh hợp lệ | Upload ảnh lên server, reload lại thư viện ảnh |
| **FN-030-04** | Chuyển sang chỉnh sửa | Click nút `Chỉnh sửa` | ID bãi đỗ | Là chủ bãi | Điều hướng sang `SCR-031` |
| **FN-030-05** | Chuyển sang cấu hình Slot | Click nút `Slot` | ID bãi đỗ | Bãi đã ở trạng thái `APPROVED` | Điều hướng sang `SCR-032` |
| **FN-030-06** | Chuyển sang cấu hình Giá | Click nút `Bảng giá` | ID bãi đỗ | Bãi đã ở trạng thái `APPROVED` | Điều hướng sang `SCR-033` |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `GET /api/v1/merchant/parking-lots/{id}`: Lấy thông tin chi tiết bãi đỗ thuộc Merchant.
2. `GET /api/v1/parking-lots/{id}/slots`: Lấy danh sách cấu hình slot.
3. `GET /api/v1/parking-lots/{id}/pricing`: Lấy danh sách biểu giá niêm yết.
4. `GET /api/v1/merchant/parking-lots/{id}/revenue`: Lấy doanh thu riêng của bãi.
5. `GET /api/v1/merchant/bookings?page=0&size=100&parkingLotId={id}`: Lấy danh sách xe đang đỗ và đặt chỗ.
6. `POST /api/v1/merchant/parking-lots/{id}/images`: Upload thêm ảnh bãi đỗ.

### B. Controller & Method
- [`ParkingLotController.java:78-82`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/ParkingLotController.java#L78-L82):
  - `merchantDetail(@AuthenticationPrincipal CustomUserDetails u, @PathVariable Long id)` -> `@PreAuthorize("hasRole('MERCHANT')")`
- [`ParkingLotController.java:117-125`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/ParkingLotController.java#L117-L125):
  - `getRevenue(@AuthenticationPrincipal CustomUserDetails u, @PathVariable Long id, ...)` -> `@PreAuthorize("hasRole('MERCHANT')")`

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Hiển thị component Ant Design `Skeleton active paragraph={{ rows: 12 }}`.
- **Ownership Verification Error:** Nếu Merchant cố tình mở URL bãi của chủ khác, Backend trả lỗi 403/404, Frontend hiển thị `Alert type="warning"`: *"Chưa xác minh được quyền sở hữu. Action quản trị bị khóa."*
- **Approval Gatekeeper:** Nút `Slot` và `Bảng giá` bị vô hiệu hóa (`disabled={!canConfigure}`) kèm tooltip nhắc nhở nếu bãi chưa được Admin duyệt (`status !== 'APPROVED'`).

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Quy tắc Gatekeeper duyệt bãi:** Bắt buộc không cho phép cấu hình Slot và mở nhận khách khi bãi chưa được duyệt nhằm đảm bảo tuân thủ tiêu chuẩn an toàn PCCC của hệ thống.
2. **Đối soát sở hữu nghiêm ngặt:** Chỉ chủ bãi sở hữu mới có quyền truy cập dữ liệu doanh thu và danh sách booking của bãi.

### B. Đề Xuất Cải Thiện
1. **Sơ đồ mặt bằng bãi đỗ (Interactive 2D Lot Map):** Thay vì bảng danh sách slot dạng text, thiết kế mới nên hiển thị sơ đồ 2D trực quan thể hiện từng vị trí đỗ màu xanh (trống) và màu đỏ (đang đỗ xe biển số nào).
