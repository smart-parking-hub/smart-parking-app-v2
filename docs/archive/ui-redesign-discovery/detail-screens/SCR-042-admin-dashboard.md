# Đặc Tả Màn Hình SCR-042: AdminDashboardPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-042`
- **Tên màn hình:** Tổng quan hệ thống (Admin Dashboard)
- **URL Route / Path:** `/admin/dashboard` (được cấu hình tại [`smart-parking-app/src/app/routes/AppRoutes.tsx:97`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L97))
- **Quyền truy cập (RBAC):** Bắt buộc Role `ADMIN` thông qua `<ProtectedRoute allowedRoles={['ADMIN']}>` ([`AppRoutes.tsx:95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L95))
- **Mục tiêu nghiệp vụ:** Cung cấp cho Ban Điều Hành bức tranh thời gian thực về quy mô mạng lưới, khối lượng giao dịch, sức khỏe vận hành và các hạng mục chờ xử lý cấp bách trên toàn sàn.
- **Actor chính:** System Administrator (Quản trị viên hệ thống).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

Giao diện kế thừa khung chuẩn `AdminLayout` ([`AdminLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/layout/AdminLayout.tsx)) với cấu trúc phân khu:
1. **Header trang (`AdminPageHeader`):**
   - Eyebrow: `TRUNG TÂM ĐIỀU HÀNH`
   - Tiêu đề H1: `Tổng quan hệ thống`
   - Mô tả: `Số liệu trực tiếp từ Backend SmartTruck.`
2. **Khung chỉ số trọng yếu (`.admin-metrics` - 6 Thẻ KPI):**
   - Người dùng: Thống kê tổng số tài khoản toàn hệ thống.
   - Tài xế: Số tài khoản có Role `DRIVER`.
   - Chủ bãi: Số tài khoản có Role `MERCHANT`.
   - Tổng bãi đỗ: Tổng số bãi đỗ xe đã đăng ký.
   - Bãi chờ duyệt: Số bãi đỗ đang ở trạng thái `PENDING_APPROVAL`.
   - Doanh thu nền tảng: Tổng phí dịch vụ sàn thu được (VNĐ).
3. **Bố cục lưới nghiệp vụ (`.admin-dashboard-grid` - 2 Panel):**
   - **Panel 1: Nghiệp vụ hệ thống (`.admin-task-list`):** Danh sách liên kết điều hướng nhanh kèm số lượng backlog thực tế:
     - Bãi đỗ chờ duyệt → `/admin/parking-lots`
     - Tổng tài khoản → `/admin/users`
     - Tổng lượt đặt chỗ → `/admin/transactions`
     - Kiểm tra audit log → `/admin/audit-logs`
   - **Panel 2: Trạng thái vận hành (`.admin-chart`):** Giám sát trạng thái 3 module lõi:
     - Tỷ lệ vận hành & đặt chỗ: `Hoạt động bình thường` (Badge xanh dương `#0284c7`).
     - Cổng thanh toán & đối soát ví: `Sẵn sàng (PayOS / Demo)` (Badge xanh lá `#16a34a`).
     - Hàng đợi ảo & điều phối slot: `Kích hoạt tự động` (Badge xanh lá `#16a34a`).

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tải trang ban đầu | Lifecycle Hook | Truy cập màn hình | Đã đăng nhập Role `ADMIN` | Hiển thị Skeleton, gọi API lấy dữ liệu | `GET /api/v1/admin/dashboard` | Hiển thị 6 thẻ metrics & panel tác vụ | [`AdminDashboardPage.tsx:14-24`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/dashboard/AdminDashboardPage.tsx#L14-L24) |
| Link Bãi đỗ chờ duyệt | Nav Link | Click thẻ link | Có dữ liệu backlog | Điều hướng sang trang kiểm duyệt bãi | Không gọi thêm API | Chuyển URL sang `/admin/parking-lots` | [`AdminDashboardPage.tsx:44`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/dashboard/AdminDashboardPage.tsx#L44) |
| Link Tổng tài khoản | Nav Link | Click thẻ link | Luôn kích hoạt | Điều hướng sang danh mục người dùng | Không gọi thêm API | Chuyển URL sang `/admin/users` | [`AdminDashboardPage.tsx:45`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/dashboard/AdminDashboardPage.tsx#L45) |
| Link Tổng lượt đặt chỗ | Nav Link | Click thẻ link | Luôn kích hoạt | Điều hướng sang trang đối soát dòng tiền | Không gọi thêm API | Chuyển URL sang `/admin/transactions` | [`AdminDashboardPage.tsx:46`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/dashboard/AdminDashboardPage.tsx#L46) |
| Link Kiểm tra audit log | Nav Link | Click thẻ link | Luôn kích hoạt | Điều hướng sang nhật ký kiểm toán | Không gọi thêm API | Chuyển URL sang `/admin/audit-logs` | [`AdminDashboardPage.tsx:47`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/dashboard/AdminDashboardPage.tsx#L47) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Hiển Thị | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Validation | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|---|---|---|---|
| `totalUsers` | Người dùng | `long` | Có | Số nguyên $\ge 0$ | `UserRepository.count()` | Tổng user tất cả role |
| `totalDrivers` | Tài xế | `long` | Có | Số nguyên $\ge 0$ | `UserRepository.countByRole(DRIVER)` | Tài xế đã đăng ký |
| `totalMerchants` | Chủ bãi | `long` | Có | Số nguyên $\ge 0$ | `UserRepository.countByRole(MERCHANT)` | Chủ bãi đã đăng ký |
| `totalParkingLots` | Tổng bãi đỗ | `long` | Có | Số nguyên $\ge 0$ | `ParkingLotRepository.count()` | Tất cả bãi mọi trạng thái |
| `pendingParkingLots` | Bãi chờ duyệt | `long` | Có | Số nguyên $\ge 0$ | `ParkingLotRepository.countByStatus(PENDING_APPROVAL)` | Chỉ số cần xử lý khẩn cấp |
| `totalBookings` | Tổng lượt đặt chỗ | `long` | Có | Số nguyên $\ge 0$ | `BookingRepository.count()` | Lượt đặt chỗ toàn sàn |
| `pendingWithdrawals` | *(Chưa hiển thị ở FE)* | `long` | Có | Số nguyên $\ge 0$ | `WithdrawalRequestRepository.countByStatus(PENDING)` | **Backend có trả nhưng FE bỏ sót** |
| `openDisputes` | *(Chưa hiển thị ở FE)* | `long` | Có | Số nguyên $\ge 0$ | `DisputeRepository.countByStatus(PENDING + REVIEWING)` | **Backend có trả nhưng FE bỏ sót** |
| `platformRevenue` | Doanh thu nền tảng | `double` | Có | Số thực $\ge 0$, format Currency | `MerchantWalletService.sumPlatformFeeRevenue()` | FE map thành `successfulRevenue` |

---

## E. TRẠNG THÁI UI (UI States)

1. **Loading State:** Khi `summary === null && !failed`, hiển thị `Skeleton active paragraph={{ rows: 10 }}` ([`AdminDashboardPage.tsx:27`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/dashboard/AdminDashboardPage.tsx#L27)).
2. **Error State:** Khi API bị lỗi hoặc mất mạng, `failed === true`, hiển thị `Alert type="error" showIcon message="Không thể tải dữ liệu tổng quan từ Backend"` ([`AdminDashboardPage.tsx:26`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/dashboard/AdminDashboardPage.tsx#L26)).
3. **Success State:** Hiển thị 6 thẻ chỉ số và 2 thẻ bảng tác vụ.
4. **Empty State:** Không xảy ra đối với dashboard vì Backend luôn trả về DTO với các số đếm (mặc định bằng 0).

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 1200\text{px}$):** Lưới 6 metrics hiển thị dạng grid 6 cột (`grid-template-columns: repeat(6, 1fr)`). Khung tác vụ và trạng thái hiển thị 2 cột song song tỷ lệ 5:7.
- **Tablet ($768\text{px} - 1199\text{px}$):** Metrics co giãn thành grid 3 cột x 2 hàng. Khung nghiệp vụ xếp dọc 1 cột.
- **Mobile ($< 768\text{px}$):** Metrics xếp 2 cột hoặc 1 cột cuộn dọc, font chữ rút gọn, padding giảm từ 24px xuống 16px.
