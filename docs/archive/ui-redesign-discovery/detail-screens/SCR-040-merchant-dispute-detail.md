# Screen Specification: SCR-040 MerchantDisputeDetailPage (Chi tiết khiếu nại)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-040`
- **Screen Name:** Chi tiết hồ sơ khiếu nại & Phán quyết trọng tài Admin (Merchant Dispute Detail)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/disputes/:ticketId` (Định nghĩa tại [`AppRoutes.tsx:133`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L133) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantDisputeDetailPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/disputes/pages/MerchantDisputeDetailPage.tsx)
- **Sub-components:** Ant Design `Descriptions`, `Tag`, `Alert`, `Button`, `Skeleton`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cung cấp nội dung chi tiết của một vụ khiếu nại cụ thể: Lời khai của tài xế, lý do phản ánh, thời điểm xảy ra sự việc và mã vé đỗ xe liên quan.
2. Cho phép Merchant theo dõi kết luận xử lý và phán quyết trọng tài chính thức từ Quản trị viên sàn (Admin Resolution).
3. Đóng vai trò là bằng chứng pháp lý rõ ràng giữa tài xế, chủ bãi và ban quản lý sàn SmartParkingHub trong trường hợp có phát sinh hoàn tiền hoặc bồi thường thiệt hại.

### B. Target Users
- Chủ bãi đỗ xe kiểm tra kết quả giải quyết khiếu nại của Admin để thực hiện nghĩa vụ hoặc rút kinh nghiệm ca trực.

### C. Entry Points
- Click nút `Chi tiết` trên bảng danh sách khiếu nại (`SCR-039`).
- Click từ thông báo kết quả giải quyết khiếu nại trên Trung tâm thông báo (`SCR-041`).

### D. Exit Points
- Nút `Danh sách`: Quay lại danh mục khiếu nại `/merchant/disputes` (`SCR-039`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang
- Thẻ Tag trạng thái: `PENDING` (Chờ xử lý), `REVIEWING` (Đang xem xét), `RESOLVED` (Đã giải quyết), `REJECTED` (Đã từ chối).
- Tiêu đề H1: Mã khiếu nại `DSP-{id}` (ví dụ: `DSP-12`).
- Mô tả phụ: Tiêu đề lý do khiếu nại (`item.reason`).
- Nút điều hướng: `Danh sách` (icon `ArrowLeftOutlined`).

### B. Thẻ Thông Tin Chi Tiết Hồ Sơ (.merchant-list-card)
Bảng Ant Design `Descriptions bordered column={1}`:
1. **Booking:** Mã booking vé xe (`bookingCode` hoặc `#bookingId`).
2. **Bãi đỗ:** Tên cơ sở bãi đỗ xảy ra vụ việc.
3. **Tài xế:** Số điện thoại liên hệ của tài xế khiếu nại.
4. **Lý do:** Nội dung tóm tắt nguyên nhân khiếu nại.
5. **Mô tả:** Diễn giải chi tiết sự việc do tài xế cung cấp.
6. **Ngày tạo:** Thời điểm gửi khiếu nại lên hệ thống.
7. **Cập nhật:** Thời điểm Admin cập nhật trạng thái gần nhất.
8. **Kết quả xử lý:** Nội dung phán quyết giải quyết (Resolution) từ Admin (hoặc hiển thị `Chưa có` nếu đang xử lý).

### C. Khối Thông Báo Phán Quyết (.merchant-inline-alert)
- Nếu đã có phán quyết (`item.resolution`): Hiển thị `Alert type="success" showIcon`:
  - Tiêu đề: `Đã có kết quả xử lý`.
  - Mô tả: Toàn văn kết luận và phương án giải quyết của Admin (ví dụ: *"Admin đã đối soát camera: Chủ bãi thu tiền mặt đúng quy định, bác bỏ khiếu nại của tài xế."* hoặc *"Hoàn trả 50.000đ tiền cọc cho tài xế do lỗi cổng barie không mở."*).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-040-01** | Xem chi tiết vụ khiếu nại | Mở URL `/merchant/disputes/:ticketId` | ID ticket từ URL | Khiếu nại thuộc bãi của Merchant | Tải thông tin hồ sơ và phán quyết của Admin |
| **FN-040-02** | Xem kết quả giải quyết | Tự động khi tải trang | `item.resolution` | Admin đã ra phán quyết | Hiển thị Banner kết luận màu xanh lá cây |
| **FN-040-03** | Quay lại danh sách | Click nút `Danh sách` | Không | Không | Điều hướng về `/merchant/disputes` (`SCR-039`) |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
- `GET /api/v1/disputes/{id}`: Truy xuất thông tin chi tiết của một vụ tranh chấp.

### B. Controller & Method
- [`DisputeController.java:53-59`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/DisputeController.java#L53-L59):
  - `getDisputeDetail(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long id)`
  - Quyền hạn: `@PreAuthorize("hasAnyRole('DRIVER','MERCHANT')")`

### C. Service Implementation
- [`DisputeServiceImpl.getDisputeDetail()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/DisputeServiceImpl.java): Kiểm tra quyền bảo mật: Người dùng yêu cầu phải là tài xế đã tạo đơn hoặc là chủ bãi sở hữu lượt đỗ đó. Nếu không khớp, ném `UnauthorizedException("Bạn không có quyền xem tranh chấp này!")`.

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Component Ant Design `Skeleton active paragraph={{ rows: 8 }}`.
- **Not Found State:** Nếu ticket ID không tồn tại hoặc không thuộc quyền quản lý, hiển thị `Alert type="error"`: *"Không tìm thấy ticket hoặc bạn không có quyền xem"*.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Tính khách quan của phán quyết (Read-only Resolution):** Phán quyết chỉ được cập nhật bởi Ban quản trị sàn (`ROLE_ADMIN`); Merchant và Driver chỉ có quyền đọc để đảm bảo tính công bằng và vô tư của sàn thương mại điện tử.
2. **Kiểm tra quyền sở hữu chặt chẽ:** Đảm bảo không bị rò rỉ lời khai hay bằng chứng của các bãi đỗ khác.

### B. Đề Xuất Cải Thiện
1. **Kênh trao đổi nội bộ 3 bên (3-Party Chat / Timeline):** Thay vì chỉ có 1 ô văn bản kết luận, thiết kế mới nên có dòng thời gian (Timeline) thể hiện các mốc trao đổi giữa Tài xế, Chủ bãi và Trọng tài viên Admin.
