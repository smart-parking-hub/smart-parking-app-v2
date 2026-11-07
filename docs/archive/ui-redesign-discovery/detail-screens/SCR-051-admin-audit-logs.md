# Đặc Tả Màn Hình SCR-051: AdminAuditLogsPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-051`
- **Tên màn hình:** Nhật ký kiểm toán hệ thống (System Audit Trail Ledger)
- **URL Route / Path:** `/admin/audit-logs` (được cấu hình tại [`AppRoutes.tsx:106`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L106))
- **Quyền truy cập (RBAC):** Bắt buộc Role `ADMIN` ([`AppRoutes.tsx:95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L95))
- **Mục tiêu nghiệp vụ:** Cung cấp sổ cái ghi vết bất biến (immutable, read-only) về mọi thao tác nhạy cảm do các tài khoản Quản trị viên thực hiện (duyệt/từ chối bãi xe, khóa/mở khóa người dùng, duyệt/từ chối rút tiền, phân xử tranh chấp) nhằm phục vụ thanh tra an ninh và kiểm toán tuân thủ.
- **Actor chính:** System Administrator (Kiểm toán viên an ninh / Thanh tra nội bộ).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

1. **Header trang (`AdminPageHeader`):**
   - Eyebrow: `FR-29 · TRUY VẾT`
   - Tiêu đề: `Audit log`
   - Mô tả: `Lịch sử bất biến của các thao tác kiểm duyệt, tài khoản và tài chính.`
2. **Thanh công cụ tra cứu (`.admin-toolbar`):**
   - Ô tìm kiếm text (`Input prefix={<SearchOutlined />} allowClear`): Tìm theo người thực hiện (`actor`), hành động (`action`) hoặc nội dung chi tiết/lý do (`detail`).
   - Hộp chọn loại đối tượng tác động (`Select`):
     - `ALL`: Tất cả đối tượng
     - `PARKING_LOT`: Bãi đỗ xe
     - `USER`: Tài khoản người dùng
     - `WITHDRAWAL`: Yêu cầu rút tiền
     - `DISPUTE`: Vụ tranh chấp khiếu nại
   - Badge tổng số bản ghi: `visible.length bản ghi`.
3. **Bảng nhật ký kiểm toán (`Table`):**
   - Bảng Ant Design 6 cột hiển thị:
     1. Thời gian: Ngày giờ thực hiện chính xác đến từng phút (`dd/MM/yyyy HH:mm`)
     2. Actor: Định danh tài khoản thực hiện (`User #{actorUserId}`)
     3. Hành động: Mã hành động hệ thống (`APPROVE_PARKING_LOT`, `BAN_USER`, `REJECT_WITHDRAWAL`,...)
     4. Đối tượng: Loại thực thể kèm ID tác động (`TargetType #{targetId}`)
     5. Kết quả: Tag trạng thái `SUCCESS` (Xanh lá) hoặc `FAILED` (Đỏ)
     6. Chi tiết: Ghi chú, căn cứ hoặc lý do giải trình do Admin nhập
   - Phân trang nội bộ tại Client: `pageSize: 12`, `showSizeChanger: false`.

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tải trang ban đầu | Lifecycle Hook | Truy cập trang | Role `ADMIN` | Gọi API lấy 200 bản ghi audit log | `GET /api/v1/admin/audit-logs?page=0&size=200` | Hiển thị bảng nhật ký kiểm toán | [`AdminAuditLogsPage.tsx:16`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/audit-logs/AdminAuditLogsPage.tsx#L16), [`adminRepository.ts:280-292`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/api/adminRepository.ts#L280-L292) |
| Ô tìm kiếm | Text Input | Nhập từ khóa actor/action | Bất kỳ lúc nào | Lọc danh sách audit log tức thời tại Client | Không gọi API | Bảng hiển thị các log thỏa mãn chuỗi tìm | [`AdminAuditLogsPage.tsx:17`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/audit-logs/AdminAuditLogsPage.tsx#L17) |
| Bộ lọc Loại đối tượng | Select Dropdown | Chọn loại đối tượng | Bất kỳ lúc nào | Lọc danh sách theo trường `entityType` tại Client | Không gọi API | Bảng chỉ hiển thị log thuộc đối tượng được chọn | [`AdminAuditLogsPage.tsx:17`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/audit-logs/AdminAuditLogsPage.tsx#L17) |
| Chuyển trang | Pagination | Click trang kế tiếp | Khi có $> 12$ bản ghi | Đổi trang hiển thị | Không gọi API | Hiển thị 12 log tiếp theo | [`AdminAuditLogsPage.tsx:26`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/audit-logs/AdminAuditLogsPage.tsx#L26) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Cột | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Validation | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|---|---|---|---|
| `createdAt` | Thời gian | `string (ISO)` | Có | Format ngày giờ Việt Nam | `AuditLog.createdAt` | Thời điểm ghi log |
| `actor` | Actor | `string` | Có | Định dạng `User #{actorUserId}` | `AuditLog.actorUser.id` | Quản trị viên thao tác |
| `action` | Hành động | `string` | Có | Chuỗi mã định danh hành động | `AuditLog.action` | Thao tác can thiệp |
| `entityType` + `entityId` | Đối tượng | `string` | Có | Định dạng `{targetType} #{targetId}` | `AuditLog.targetType`, `targetId` | Bản ghi bị tác động |
| `result` | Kết quả | `string` | Có | `SUCCESS`, `FAILED` | `AuditLog.result` | Kết quả xử lý |
| `detail` | Chi tiết | `string` | Không | Văn bản giải trình lý do của Admin | `AuditLog.detail` | Biên bản giải trình |

---

## E. TRẠNG THÁI UI (UI States)

1. **Loading State:** Khi `loading === true`, hiển thị `<Skeleton active />` ([`AdminAuditLogsPage.tsx:26`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/audit-logs/AdminAuditLogsPage.tsx#L26)).
2. **Success State:** Hiển thị bảng nhật ký kiểm toán dạng Read-Only (không có nút Sửa hay Xóa).
3. **Empty State:** Khi bộ lọc không có dữ liệu phù hợp, hiển thị `<Empty description="Không có audit log phù hợp" />` ([`AdminAuditLogsPage.tsx:26`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/audit-logs/AdminAuditLogsPage.tsx#L26)).

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 1024\text{px}$):** Hiển thị bảng 6 cột thoáng đãng, lề cột chi tiết mở rộng để đọc nội dung giải trình.
- **Mobile / Tablet ($< 768\text{px}$):** Toolbar dàn thành 2 dòng. Bảng kích hoạt cuộn ngang đảm bảo không làm cắt ngắn chuỗi hành động và thời gian.
