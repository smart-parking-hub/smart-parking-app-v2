# Đặc Tả Màn Hình SCR-044: AdminParkingLotDetailPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-044`
- **Tên màn hình:** Bàn thẩm định chi tiết bãi đỗ xe (Parking Lot Inspection Desk)
- **URL Route / Path:** `/admin/parking-lots/:parkingLotId` (được cấu hình tại [`AppRoutes.tsx:99`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L99))
- **Quyền truy cập (RBAC):** Bắt buộc Role `ADMIN` ([`AppRoutes.tsx:95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L95))
- **Mục tiêu nghiệp vụ:** Môi trường làm việc tập trung để Quản trị viên đối chiếu toàn bộ hồ sơ đăng ký bãi đỗ xe: vị trí GPS thực địa, thư viện hình ảnh thực tế, thông tin liên hệ của Merchant, sức chứa từng loại xe và ban hành phán quyết cấp phép hoặc từ chối.
- **Actor chính:** System Administrator (Thẩm định viên hồ sơ bãi).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

Bố cục dạng 2 cột chia đôi không gian thẩm định (`.admin-detail-grid`):
1. **Header trang (`AdminPageHeader`):**
   - Eyebrow: `CHI TIẾT BÃI ĐỖ`
   - Tiêu đề H1: Tên bãi đỗ (`item.name`)
   - Mô tả: Ngày giờ nộp hồ sơ và tên chủ bãi (`item.merchantName`).
   - Nút hành động: Nút quay lại danh sách (`Button icon={<ArrowLeftOutlined />}`).
2. **Cột chính bên trái (`.admin-detail-main`):**
   - **Card 1: Thông tin vận hành:** Bảng mô tả 2 cột (`Descriptions bordered column={{ xs: 1, md: 2 }}`):
     - Trạng thái hiện tại
     - Merchant đại diện (Tên + Số điện thoại)
     - Địa chỉ kinh doanh
     - Tổng sức chứa (chỗ đỗ)
     - Danh sách loại xe hỗ trợ
     - Số lượng ảnh đính kèm
     - Tình trạng hồ sơ pháp lý
     - Mô tả bãi đỗ
   - **Card 2: Thư viện hình ảnh (`.admin-parking-gallery`):**
     - Grid lưới hiển thị toàn bộ ảnh thực tế do Merchant tải lên.
     - Tích hợp `Image.PreviewGroup` cho phép phóng to toàn màn hình (lightbox), xoay ảnh, lật ảnh và duyệt slide.
     - Nhãn `Ảnh đại diện` (Tag xanh lá) gắn trên ảnh cover.
   - **Card 3: Bản đồ vị trí đăng ký (`AdminParkingLotMap`):**
     - Nhúng bản đồ OpenStreetMap qua Leaflet.js với tọa độ GPS chính xác.
     - Custom marker định vị kèm Popup hiển thị tên bãi và địa chỉ.
     - Tọa độ số thực (`latitude.toFixed(6), longitude.toFixed(6)`).
     - Nút liên kết ngoài mở trực tiếp trên Google Maps (`ExternalLink`).
3. **Cột bên phải (`aside.admin-decision-box` - Khung phán quyết):**
   - Lịch sử ghi chú thẩm định gần nhất (`item.reviewNote` nếu có).
   - Khung cảnh báo quy trình kiểm soát pháp lý.
   - Bộ 3 nút quyết định (chỉ hiển thị khi `item.status === 'PENDING_APPROVAL'`):
     - **Duyệt bãi** (Nút Primary màu xanh dương, icon `CheckOutlined`)
     - **Yêu cầu bổ sung** (Nút Default, icon `EditOutlined`)
     - **Từ chối hồ sơ** (Nút Danger màu đỏ, icon `StopOutlined`)
   - Nếu bãi đã xử lý (`status !== 'PENDING_APPROVAL'`), hiển thị Alert khóa thao tác: *"Hồ sơ đã được xử lý"*.
4. **Modal nhập lý do quyết định (`Modal`):**
   - Tiêu đề động tùy theo quyết định: "Xác nhận duyệt bãi" / "Từ chối hồ sơ" / "Yêu cầu bổ sung hồ sơ".
   - Ô nhập văn bản nhiều dòng: `Input.TextArea maxLength={500} showCount rows={4}`.

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tải trang chi tiết | Lifecycle Hook | Truy cập trang theo ID | Role `ADMIN` | Gọi API lấy chi tiết bãi + danh sách bãi | `GET /api/v1/admin/parking-lots/{id}`<br>+ `GET /api/v1/admin/parking-lots` | Hiển thị đầy đủ thông tin, ảnh và bản đồ | [`AdminParkingLotDetailPage.tsx:23-30`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotDetailPage.tsx#L23-L30), [`adminRepository.ts:212-221`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/api/adminRepository.ts#L212-L221) |
| Click ảnh thumbnail | Image Thumbnail | Click vào bất kỳ ảnh | Có danh sách ảnh | Mở Modal Lightbox Preview Group | Không gọi API | Phóng to ảnh, duyệt slide ảnh | [`AdminParkingLotDetailPage.tsx:70-86`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotDetailPage.tsx#L70-L86) |
| Link Mở Google Maps | External Link | Click liên kết | Có tọa độ GPS | Mở tab trình duyệt mới tới Google Maps | Không gọi API | Điều hướng sang Google Maps | [`AdminParkingLotMap.tsx:60`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotMap.tsx#L60) |
| Nút "Duyệt bãi" | Primary Button | Click nút | `status === 'PENDING_APPROVAL'` | Mở Modal xác nhận duyệt bãi | Không gọi API | `decision = 'APPROVED'`, Modal mở | [`AdminParkingLotDetailPage.tsx:97`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotDetailPage.tsx#L97) |
| Nút "Yêu cầu bổ sung" | Default Button | Click nút | `status === 'PENDING_APPROVAL'` | Mở Modal yêu cầu bổ sung | Không gọi API | `decision = 'CHANGES_REQUESTED'`, Modal mở | [`AdminParkingLotDetailPage.tsx:98`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotDetailPage.tsx#L98) |
| Nút "Từ chối hồ sơ" | Danger Button | Click nút | `status === 'PENDING_APPROVAL'` | Mở Modal từ chối hồ sơ | Không gọi API | `decision = 'REJECTED'`, Modal mở | [`AdminParkingLotDetailPage.tsx:99`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotDetailPage.tsx#L99) |
| Nút "Xác nhận" trên Modal | Modal Confirm | Click Xác nhận | `note.trim().length > 0` | Hiển thị nút quay loading, gửi API thẩm định | `PUT /api/v1/admin/parking-lots/{id}/approve`<br>hoặc `/reject`<br>hoặc `/request-changes` | Đóng modal, hiển thị Toast thành công, cập nhật trạng thái mới | [`AdminParkingLotDetailPage.tsx:32-43`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotDetailPage.tsx#L32-L43), [`AdminController.java:74-96`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/AdminController.java#L74-L96) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Hiển Thị | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Validation | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|---|---|---|---|
| `name` | Tên bãi | `string` | Có | Tối đa 255 ký tự | `ParkingLot.name` | Tên định danh bãi |
| `merchantName` + `merchantPhone` | Merchant | `string` | Có | Họ tên kèm số điện thoại chủ bãi | `User.fullName`, `phone` | Người chịu trách nhiệm |
| `businessLicense` | Giấy phép KD | `string` | Không | Mã số GPKD của Merchant | `Merchant.businessLicense` | **Backend có trả nhưng FE chưa hiển thị** |
| `address` | Địa chỉ | `string` | Có | Địa chỉ chi tiết mặt bằng bãi | `ParkingLot.address` | Vị trí kinh doanh |
| `latitude`, `longitude` | Tọa độ GPS | `BigDecimal` | Có | Vĩ độ [-90, 90], Kinh độ [-180, 180] | `ParkingLot.latitude`, `longitude` | Render Leaflet map |
| `totalCapacity` | Sức chứa | `number` | Có | Tổng slot đỗ xe | $\sum$ `Slot.totalCapacity` | Khả năng tiếp nhận xe |
| `vehicleTypes` | Loại xe | `string[]` | Có | Danh sách enum loại xe | Gom từ slots / pricing rules | `TRUCK_STANDARD`, `TRUCK_HEAVY`,... |
| `images` | Hình ảnh bãi | `Array` | Không | Danh sách URL ảnh thực tế | `ParkingLotImage` table | Lightbox preview |
| `reviewReason` | Ghi chú kiểm duyệt | `string` | Có (khi duyệt) | Tối đa 500 ký tự (FE) / 1000 ký tự (BE) | `AdminDecisionRequest.reason` | Lưu vết kiểm toán và gửi notify |

---

## E. TRẠNG THÁI UI (UI States)

1. **Loading State:** Khi `loading === true`, hiển thị `<Skeleton active paragraph={{ rows: 12 }} />` ([`AdminParkingLotDetailPage.tsx:45`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotDetailPage.tsx#L45)).
2. **Not Found / Error State:** Khi `!item`, hiển thị `<Alert type="error" showIcon message="Không tìm thấy hồ sơ bãi đỗ" action={<Button>Quay lại</Button>} />` ([`AdminParkingLotDetailPage.tsx:46`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotDetailPage.tsx#L46)).
3. **Submitting State:** Khi đang gửi lệnh thẩm định, Modal khóa tương tác `maskClosable={false}`, nút Xác nhận hiển thị spinner quay (`confirmLoading={submitting}`).
4. **Empty Images State:** Nếu Merchant chưa đăng tải hình ảnh nào, khung Gallery hiển thị `<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Merchant chưa gửi hình ảnh bãi đỗ" />` ([`AdminParkingLotDetailPage.tsx:87`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotDetailPage.tsx#L87)).
5. **Processed Locked State:** Khi bãi có trạng thái khác `PENDING_APPROVAL`, khung thao tác bên phải ẩn cả 3 nút bấm và hiển thị Alert thông báo: *"Hồ sơ đã được xử lý. Quyết định đã được lưu và không thể xử lý lại trên hồ sơ này."* ([`AdminParkingLotDetailPage.tsx:102`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotDetailPage.tsx#L102)).

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 1024\text{px}$):** Hiển thị dạng 2 cột chia tỷ lệ 7:3 (Cột hồ sơ & bản đồ chiếm 7 phần, Cột quyết định chiếm 3 phần dính cố định khi cuộn).
- **Tablet / Mobile ($< 1024\text{px}$):** Lưới chi tiết chuyển thành dạng 1 cột cuộn dọc. Khung phán quyết đẩy xuống cuối cùng. Thư viện ảnh chuyển thành lưới 2 cột.
