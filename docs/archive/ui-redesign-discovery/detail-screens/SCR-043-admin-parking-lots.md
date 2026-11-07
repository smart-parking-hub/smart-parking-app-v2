# Đặc Tả Màn Hình SCR-043: AdminParkingLotsPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-043`
- **Tên màn hình:** Kiểm duyệt bãi đỗ (Parking Lot Moderation List)
- **URL Route / Path:** `/admin/parking-lots` (được cấu hình tại [`AppRoutes.tsx:98`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L98))
- **Quyền truy cập (RBAC):** Bắt buộc Role `ADMIN` ([`AppRoutes.tsx:95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L95))
- **Mục tiêu nghiệp vụ:** Cung cấp giao diện lọc, tra cứu và tiếp nhận hồ sơ đăng ký bãi đỗ xe của Merchant để tiến hành quy trình thẩm định trước khi công khai trên bản đồ tài xế.
- **Actor chính:** System Administrator (Quản trị viên kiểm duyệt).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

Giao diện gồm các phân vùng chính:
1. **Header trang (`AdminPageHeader`):**
   - Eyebrow: `VẬN HÀNH HỆ THỐNG`
   - Tiêu đề: `Kiểm duyệt bãi đỗ`
   - Mô tả: `Kiểm tra hồ sơ, vị trí và năng lực vận hành trước khi công khai bãi.`
2. **Thanh công cụ lọc & tìm kiếm (`.admin-toolbar`):**
   - Ô nhập tìm kiếm text (`Input prefix={<SearchOutlined />} allowClear`): Tìm kiếm thời gian thực theo tên bãi, tên Merchant hoặc địa chỉ bãi.
   - Hộp chọn trạng thái (`Select`): Lọc theo các trạng thái:
     - `ALL`: Tất cả trạng thái
     - `PENDING_APPROVAL`: Chờ duyệt
     - `CHANGES_REQUESTED`: Yêu cầu bổ sung
     - `APPROVED`: Đã duyệt
     - `REJECTED`: Đã từ chối
   - Badge đếm số lượng: Hiển thị tổng số hồ sơ phù hợp bộ lọc (`visible.length`).
3. **Bảng danh sách hồ sơ (`Table`):**
   - Bảng Ant Design 6 cột hiển thị danh sách hồ sơ bãi đỗ.
   - Phân trang nội bộ tại Client: `pageSize: 8`, `showSizeChanger: false`.

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tải trang ban đầu | Lifecycle Hook | Truy cập trang | Role `ADMIN` | Gọi API tải danh sách và gọi N+1 detail để lấy sức chứa | `GET /api/v1/admin/parking-lots?page=0&size=100&sort=id,desc`<br>+ Loop `GET /api/v1/admin/parking-lots/{id}` | Hiển thị bảng danh sách bãi | [`AdminParkingLotsPage.tsx:18`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotsPage.tsx#L18), [`adminRepository.ts:198-209`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/api/adminRepository.ts#L198-L209) |
| Ô tìm kiếm | Text Input | Nhập từ khóa tìm kiếm | Bất kỳ lúc nào | Lọc danh sách hiển thị phía Client (không reload API) | Không gọi API | Bảng chỉ hiển thị các bãi khớp tên/chủ/địa chỉ | [`AdminParkingLotsPage.tsx:19`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotsPage.tsx#L19) |
| Bộ lọc trạng thái | Select Dropdown | Chọn giá trị trạng thái | Bất kỳ lúc nào | Lọc danh sách theo trường `status` tại Client | Không gọi API | Bảng chỉ hiển thị bãi có status tương ứng | [`AdminParkingLotsPage.tsx:19`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotsPage.tsx#L19) |
| Nút "Kiểm tra" | Action Button | Click nút trên hàng | Hàng có dữ liệu bãi | Điều hướng sang bàn thẩm định chi tiết bãi đỗ | Không gọi API ngay | Chuyển URL sang `/admin/parking-lots/:parkingLotId` | [`AdminParkingLotsPage.tsx:26`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotsPage.tsx#L26) |
| Phân trang Table | Pagination | Chuyển trang (1, 2,...) | Có trên 8 bản ghi | Hiển thị 8 bản ghi tiếp theo | Không gọi API (Client pagination) | Cập nhật số trang hiển thị | [`AdminParkingLotsPage.tsx:28`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotsPage.tsx#L28) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Cột | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Validation | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|---|---|---|---|
| `name` + `address` | Bãi đỗ | `string` | Có | Hiển thị 2 dòng: Tên bãi in đậm, Địa chỉ in nhỏ | `ParkingLot.name`, `address` | Nhận diện cơ sở |
| `merchantName` | Merchant | `string` | Có | Tên chủ bãi hoặc `Merchant #{id}` | `User.fullName` hoặc fallback | Người đại diện pháp lý |
| `totalCapacity` | Sức chứa | `number` | Có | Số nguyên $\ge 0$, căn lề phải | Tổng cộng `Slot.totalCapacity` | Lấy từ detail API N+1 |
| `submittedAt` | Ngày gửi | `string (ISO)` | Có | Format ngày giờ Việt Nam (`dd/MM/yyyy HH:mm`) | `ParkingLot.createdAt` | Thời điểm nộp hồ sơ |
| `status` | Trạng thái | `AdminParkingStatus` | Có | Render qua `AdminStatusTag` (màu sắc phân loại) | `ParkingLot.status` | Trạng thái kiểm duyệt |
| Action column | Thao tác | UI Component | Có | Nút icon con mắt kèm nhãn `Kiểm tra` | Cục bộ FE | Kích hoạt chuyển trang |

---

## E. TRẠNG THÁI UI (UI States)

1. **Loading State:** Khi `loading === true`, hiển thị `<div className="admin-empty"><Skeleton active /></div>` ([`AdminParkingLotsPage.tsx:28`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotsPage.tsx#L28)).
2. **Success State:** Khi có dữ liệu, hiển thị `Table` Ant Design với các cột chuẩn hóa.
3. **Empty State:** Khi không có dữ liệu ban đầu hoặc bộ lọc/tìm kiếm không ra kết quả (`visible.length === 0`), hiển thị `<Empty description="Không có hồ sơ phù hợp" />` ([`AdminParkingLotsPage.tsx:28`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotsPage.tsx#L28)).
4. **Partial Data / Fallback:** Nếu N+1 detail request của một bãi bị lỗi mạng, `adminRepository.ts:206-208` tự động chuyển sang `parkingFromList(item)` với `totalCapacity: 0` và `imageCount: 0` mà không làm crash cả bảng.

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 992\text{px}$):** Hiển thị bảng đầy đủ 6 cột, thanh toolbar dàn ngang gồm ô tìm kiếm rộng, ô chọn status và nhãn đếm hồ sơ.
- **Mobile / Tablet nhỏ ($< 768\text{px}$):** Toolbar chuyển sang xếp chồng dọc. Bảng kích hoạt thanh cuộn ngang `overflow-x: auto` để tránh vỡ layout cột địa chỉ và thao tác.
