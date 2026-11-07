# Đặc Tả Màn Hình SCR-052: AdminNotificationsPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-052`
- **Tên màn hình:** Trung tâm thông báo quản trị (Admin System Notifications Feed)
- **URL Route / Path:** `/admin/notifications` (được cấu hình tại [`AppRoutes.tsx:107`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L107))
- **Quyền truy cập (RBAC):** Bắt buộc Role `ADMIN` ([`AppRoutes.tsx:95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L95))
- **Mục tiêu nghiệp vụ:** Cung cấp luồng sự kiện thời gian thực và các thông báo khẩn cấp từ hệ thống: hồ sơ bãi đỗ mới nộp cần duyệt, lệnh rút tiền mới cần giải ngân, vụ tranh chấp mới cần thụ lý.
- **Actor chính:** System Administrator (Quản trị viên trực vận hành).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

1. **Header trang (`AdminPageHeader`):**
   - Eyebrow: `FR-28 · SỰ KIỆN HỆ THỐNG`
   - Tiêu đề: `Thông báo quản trị`
   - Mô tả: `Các hồ sơ, giao dịch và tranh chấp cần Admin chú ý.`
   - Nút hành động: **"Đánh dấu tất cả đã đọc"** (`Button disabled={!unread}`).
2. **Danh sách thông báo (`.admin-notification-list`):**
   - Danh sách các hàng thông báo có thể tương tác (`button`):
     - Trạng thái chưa đọc: Gắn class `.unread`, hiển thị chấm tròn màu đỏ `i`.
     - Trạng thái đã đọc: Hiển thị icon chuông `<BellRing size={18} />`.
     - Tiêu đề thông báo (`<strong>{item.title}</strong>`).
     - Nội dung chi tiết thông báo (`<span>{item.content}</span>`).
     - Thời gian nhận thông báo (`<small>{formatAdminDate(item.createdAt)}</small>`).

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tải trang ban đầu | Lifecycle Hook | Truy cập trang | Role `ADMIN` | Gọi API tải 100 thông báo gần nhất | `GET /api/v1/notifications?page=0&size=100` | Hiển thị danh sách thông báo và đếm số chưa đọc | [`AdminNotificationsPage.tsx:15`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/notifications/AdminNotificationsPage.tsx#L15), [`adminRepository.ts:294-304`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/api/adminRepository.ts#L294-L304) |
| Click vào 1 thông báo | Feed Item Button | Click vào dòng thông báo | Bất kỳ lúc nào | Đánh dấu thông báo đó đã đọc, tải lại danh sách | `POST /api/v1/notifications/{id}/read` | Dòng thông báo mất dấu đỏ chưa đọc, chuyển sang icon chuông | [`AdminNotificationsPage.tsx:16`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/notifications/AdminNotificationsPage.tsx#L16), [`adminRepository.ts:306-308`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/api/adminRepository.ts#L306-L308) |
| Nút "Đánh dấu tất cả đã đọc" | Action Button | Click nút trên Header | Có ít nhất 1 thông báo chưa đọc (`unread > 0`) | Gửi lệnh đánh dấu đọc toàn bộ, làm mới giao diện | `POST /api/v1/notifications/read-all` | Toàn bộ danh sách chuyển sang đã đọc, nút bị vô hiệu hóa | [`AdminNotificationsPage.tsx:18`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/notifications/AdminNotificationsPage.tsx#L18) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Hiển Thị | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Validation | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|---|---|---|---|
| `title` | Tiêu đề | `string` | Có | Chuỗi tiêu đề ngắn gọn | `Notification.title` | Tóm tắt sự kiện |
| `content` | Nội dung | `string` | Có | Nội dung chi tiết sự kiện | `Notification.content` | Diễn giải sự kiện |
| `read` | Trạng thái đọc | `boolean` | Có | `true` nếu `readAt !== null` | `Notification.readAt` | Phân biệt chưa đọc |
| `createdAt` | Thời gian | `string (ISO)` | Có | Format ngày giờ Việt Nam | `Notification.createdAt` | Thời điểm phát sinh |

---

## E. TRẠNG THÁI UI (UI States)

1. **Loading State:** Khi `loading === true`, hiển thị `<Skeleton active />` ([`AdminNotificationsPage.tsx:18`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/notifications/AdminNotificationsPage.tsx#L18)).
2. **Success State:** Hiển thị danh sách thông báo dạng feed dọc.
3. **Empty State:** Khi không có thông báo nào, hiển thị `<Empty description="Bạn chưa có thông báo" />` ([`AdminNotificationsPage.tsx:18`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/notifications/AdminNotificationsPage.tsx#L18)).
4. **Button Disabled State:** Khi toàn bộ thông báo đã đọc (`unread === 0`), nút "Đánh dấu tất cả đã đọc" tự động bị vô hiệu hóa (`disabled={true}`).

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 768\text{px}$):** Feed thông báo hiển thị tối đa chiều rộng của khung chính, khoảng cách thẻ thoáng đãng.
- **Mobile ($< 768\text{px}$):** Nút hành động trên Header tự động co ngắn hoặc rớt dòng. Các hàng thông báo tối ưu khoảng chạm (touch target $\ge 48\text{px}$).
