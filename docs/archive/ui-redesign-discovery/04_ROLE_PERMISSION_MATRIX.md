# Ma Trận Phân Quyền Vai Trò (Role & Permission Matrix)

Hệ thống **SmartParkingHub** áp dụng mô hình phân quyền dựa trên vai trò (Role-Based Access Control - RBAC) nghiêm ngặt gồm 3 vai trò chính thức trong cơ sở dữ liệu (`DRIVER`, `MERCHANT`, `ADMIN`) cùng 1 trạng thái khách vãng lai chưa đăng nhập (`GUEST`).

---

## 1. Cơ Chế Bảo Vệ 2 Tầng (Two-Tier Security Architecture)

Hệ thống phân định rõ ranh giới kiểm soát quyền giữa Frontend và Backend:

```
[ Người Dùng ] ──► [ Frontend Route Guard (ProtectedRoute) ] ──► [ Render UI Components ]
                                                                       │ (HTTP Request)
                                                                       ▼
[ Database ] ◄── [ Backend Ownership Check (Service Layer) ] ◄── [ Backend Security (@PreAuthorize) ]
```

1. **Tầng 1 — Frontend Route Guards & UI State:**
   - Sử dụng component `ProtectedRoute.tsx` bọc các route trong `AppRoutes.tsx`.
   - Nếu chưa có session trong `localStorage`: chuyển hướng về `/login` kèm `state.from`.
   - Nếu có session nhưng `session.role` không nằm trong danh sách `allowedRoles`: chuyển hướng về `/403 Forbidden`.
   - Ẩn/hiện các nút thao tác (Action buttons) theo vai trò hoặc trạng thái đối tượng.
2. **Tầng 2 — Backend API Protection & Domain Invariants:**
   - Chặn tại Controller bằng annotation `@PreAuthorize("hasRole('ROLE_NAME')")`.
   - Kiểm tra quyền sở hữu dữ liệu (Ownership Check) tại tầng Service Implementation:
     - Ví dụ: Tài xế A không thể hủy booking của tài xế B dù biết ID (kiểm tra `booking.getDriver().getUser().getId().equals(currentUserId)`).
     - Chủ bãi X không thể sửa slot hoặc biểu giá của bãi đỗ thuộc Chủ bãi Y.

> [!WARNING]
> **Nguyên tắc kiểm toán:** Việc ẩn nút bấm trên giao diện chỉ là tối ưu trải nghiệm người dùng (UX), **không được coi là bằng chứng** Backend đã an toàn. Mọi action nhạy cảm bắt buộc phải được bảo vệ kép ở tầng Backend.

---

## 2. Ma Trận Quyền Truy Cập Màn Hình & Tính Năng

### Ký hiệu quy ước:
- **`ALLOW`**: Được phép truy cập và thực hiện thao tác.
- **`OWN_ONLY`**: Chỉ được thao tác trên tài nguyên do chính người dùng sở hữu.
- **`DENY`**: Bị cấm hoàn toàn (chặn route hoặc trả lỗi HTTP 403 Forbidden).
- **`N/A`**: Không áp dụng cho vai trò này.

| Module | Phân Hệ / Màn Hình | GUEST (Khách) | DRIVER (Tài Xế) | MERCHANT (Chủ Bãi) | ADMIN (Quản Trị) | Cơ Chế Bảo Vệ Backend |
|---|---|:---:|:---:|:---:|:---:|---|
| **MOD-01** | Landing & Marketing Pages (`SCR-001` - `009`) | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` | Public Endpoints (PermitAll) |
| **MOD-02** | Đăng ký & Đăng nhập (`SCR-010` - `012`) | `ALLOW` | Redirect Dashboard | Redirect Dashboard | Redirect Dashboard | Public Endpoints (PermitAll) |
| **MOD-02** | Trang lỗi 403 (`SCR-013`) | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` | Frontend view |
| **MOD-03** | Tìm kiếm bản đồ & Lọc bãi (`SCR-015`) | `DENY` (Require Login) | `ALLOW` | `DENY` (Chuyển 403) | `DENY` (Chuyển 403) | `hasRole('DRIVER')` |
| **MOD-03** | Chi tiết bãi & Giữ chỗ 10p (`SCR-016`) | `DENY` | `ALLOW` | `DENY` | `DENY` | `hasRole('DRIVER')` |
| **MOD-03** | Quản lý Đặt chỗ của tôi (`SCR-017`) | `DENY` | `OWN_ONLY` | `DENY` | `DENY` | `hasRole('DRIVER')` + `driverId` |
| **MOD-03** | Hủy đặt chỗ & Hoàn cọc | `DENY` | `OWN_ONLY` (Trước 1h) | `DENY` | `DENY` | Ownership check + Deadline check |
| **MOD-03** | Tham gia / Nhận slot Hàng đợi (`SCR-018`) | `DENY` | `ALLOW` | `DENY` | `DENY` | `hasRole('DRIVER')` |
| **MOD-03** | Quản lý Phương tiện (`SCR-020`) | `DENY` | `OWN_ONLY` | `DENY` | `DENY` | `hasRole('DRIVER')` + `driverId` |
| **MOD-03** | Thanh toán cọc & hóa đơn (`SCR-019`) | `DENY` | `OWN_ONLY` | `DENY` | `DENY` | PayOS Webhook signature |
| **MOD-03** | Đánh giá bãi xe (`ReviewModal`) | `DENY` | `OWN_ONLY` (Xe đã đỗ) | `DENY` | `DENY` | Đã có booking `COMPLETED` |
| **MOD-04** | Dashboard Chủ bãi (`SCR-026`) | `DENY` | `DENY` | `ALLOW` | `DENY` | `hasRole('MERCHANT')` |
| **MOD-04** | Đăng ký tạo bãi đỗ mới (`SCR-029`) | `DENY` | `DENY` | `ALLOW` | `DENY` | `hasRole('MERCHANT')` |
| **MOD-04** | Sửa thông tin bãi đỗ (`SCR-031`) | `DENY` | `DENY` | `OWN_ONLY` | `DENY` | Ownership check (`merchantId`) |
| **MOD-04** | Cấu hình Slot & Bảng giá (`SCR-032`, `033`) | `DENY` | `DENY` | `OWN_ONLY` | `DENY` | Ownership check (`merchantId`) |
| **MOD-04** | Quét QR Check-in / Check-out (`SCR-036`) | `DENY` | `DENY` | `OWN_ONLY` (Bãi của mình) | `DENY` | Ownership check bãi của booking |
| **MOD-04** | Xác nhận thu tiền mặt tại cổng | `DENY` | `DENY` | `OWN_ONLY` | `DENY` | Cập nhật booking sang `COMPLETED` |
| **MOD-04** | Báo cáo Doanh thu & Ví (`SCR-037`) | `DENY` | `DENY` | `OWN_ONLY` | `DENY` | Query theo `merchantUserId` token |
| **MOD-04** | Yêu cầu Rút tiền từ ví (`SCR-038`) | `DENY` | `DENY` | `OWN_ONLY` | `DENY` | Kiểm tra `walletBalance >= amount` |
| **MOD-05** | Admin Dashboard toàn sàn (`SCR-042`) | `DENY` | `DENY` | `DENY` | `ALLOW` | `hasRole('ADMIN')` |
| **MOD-05** | Duyệt / Từ chối bãi xe (`SCR-043`, `044`) | `DENY` | `DENY` | `DENY` | `ALLOW` | `hasRole('ADMIN')` |
| **MOD-05** | Khóa / Mở khóa tài khoản (`SCR-045`, `046`) | `DENY` | `DENY` | `DENY` | `ALLOW` | `hasRole('ADMIN')` |
| **MOD-05** | Giám sát giao dịch toàn sàn (`SCR-047`) | `DENY` | `DENY` | `DENY` | `ALLOW` | `hasRole('ADMIN')` |
| **MOD-05** | Phê duyệt rút tiền Merchant (`SCR-048`) | `DENY` | `DENY` | `DENY` | `ALLOW` | `hasRole('ADMIN')` |
| **MOD-05** | Giải quyết khiếu nại (`SCR-049`, `050`) | `DENY` | `DENY` | `DENY` | `ALLOW` | `hasRole('ADMIN')` |
| **MOD-05** | Xem Nhật ký Audit Logs (`SCR-051`) | `DENY` | `DENY` | `DENY` | `ALLOW` | `hasRole('ADMIN')` |
| **MOD-06** | Trợ lý AI Copilot (`SCR-MOD-01`) | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` | JWT Token Authenticated |

---

## 3. Bảng Phân Tích Chi Tiết Quyền Theo Thực Thể Dữ Liệu (CRUD Operations)

| Thực Thể Dữ Liệu | Vai Trò (Role) | Tạo Mới (Create) | Xem Dữ Liệu (Read/View) | Chỉnh Sửa (Update) | Xóa (Delete) |
|---|---|:---:|:---:|:---:|:---:|
| **Phương tiện (`Vehicle`)** | `DRIVER` | Có (Xe của mình) | Có (Xe của mình) | Có (Xe của mình) | Có (Xóa mềm xe của mình) |
| | `MERCHANT` | Không | Không | Không | Không |
| | `ADMIN` | Không | Có (Tất cả xe) | Không | Không |
| **Bãi đỗ xe (`ParkingLot`)** | `DRIVER` | Không | Chỉ xem bãi `APPROVED` | Không | Không |
| | `MERCHANT` | Có (Chờ duyệt) | Xem bãi của mình | Có (Bãi của mình) | Không cho xóa nếu đang có xe đỗ |
| | `ADMIN` | Không | Xem tất cả trạng thái | Duyệt / Từ chối / Đình chỉ | Không |
| **Sức chứa (`Slot`)** | `DRIVER` | Không | Xem số lượng trống | Không | Không |
| | `MERCHANT` | Có (Khởi tạo slot) | Xem slot bãi của mình | Có (Cấu hình tổng slot) | Không |
| | `ADMIN` | Không | Xem tất cả | Không | Không |
| **Biểu phí (`PricingRule`)** | `DRIVER` | Không | Xem biểu giá niêm yết | Không | Không |
| | `MERCHANT` | Có (Thiết lập giá) | Xem giá bãi của mình | Có (Cập nhật đơn giá) | Không |
| | `ADMIN` | Không | Xem tất cả | Không | Không |
| **Đặt chỗ (`Booking`)** | `DRIVER` | Có (Tạo booking giữ chỗ) | Xem booking của mình | Hủy booking hợp lệ | Không (Chỉ đổi status `CANCELLED`) |
| | `MERCHANT` | Không | Xem booking tại bãi mình | Cập nhật `PARKING`, `COMPLETED` qua QR | Không |
| | `ADMIN` | Không | Xem toàn sàn | Can thiệp giải quyết khiếu nại | Không |
| **Yêu cầu rút tiền (`Withdrawal`)** | `DRIVER` | Không | Không | Không | Không |
| | `MERCHANT` | Có (Tạo lệnh rút) | Xem lệnh rút của mình | Không (Trừ ví trước) | Không |
| | `ADMIN` | Không | Xem toàn bộ lệnh rút | Phê duyệt (`APPROVED`) / Từ chối (`REJECTED`) | Không |
