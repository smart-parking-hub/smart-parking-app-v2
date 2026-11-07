# BÁO CÁO TRIỂN KHAI ĐỒNG BỘ: BATCH-14F — ADMIN GOVERNANCE, LOT MODERATION & USER ENFORCEMENT (QUẢN TRỊ NỀN TẢNG, THẨM ĐỊNH BÃI ĐỖ, KỶ LUẬT TÀI KHOẢN & KHIẾU NẠI ĐỐI TÁC)

> **Dự án:** SmartParkingHub Workspace Master Unification  
> **Phân hệ:** [`smart-parking-app-v2`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2) (React 19 + TypeScript Strict + Tailwind CSS v4 + Vite)  
> **Batch ID:** `BATCH-14F`  
> **Nhóm phân hệ:** `GROUP 06: ADMIN GOVERNANCE, LOT MODERATION & USER ENFORCEMENT (TRUNG TÂM QUẢN TRỊ ADMIN, THẨM ĐỊNH BÃI ĐỖ, ĐIỀU HÀNH KỶ LUẬT & KHIẾU NẠI VẬN HÀNH)`  
> **Trạng thái:** HOÀN TẤT & ĐÃ XÁC THỰC 100% (Build 0 Errors, TypeScript 0 Errors, 4 Test Suites Green, 31/31 Tests Passed)  
> **Ngày hoàn thành:** 07/11/2026  

---

## 1. THÔNG TIN BATCH & PHẠM VI TRIỂN KHAI

* **GROUP:** `GROUP 06: ADMIN GOVERNANCE, LOT MODERATION & USER ENFORCEMENT`
* **BATCH ID:** `BATCH-14F`
* **PAGES TRIỂN KHAI:**
  - `SCR-039`: [`DisputesPage (role="merchant")`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/disputes/index.tsx) — Danh Sách Khiếu Nại Dành Cho Chủ Bãi, Theo Dõi Yêu Cầu Bồi Thường, Phản Ánh Lấn Làn & Trạng Thái Xử Lý
  - `SCR-040`: [`DisputesPage (role="merchant" detail)`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/disputes/index.tsx) — Hồ Sơ Chi Tiết Khiếu Nại Của Chủ Bãi, Liên Kết Booking/Tài Xế, Kết Quả Xử Lý & Điều Hướng Danh Sách
  - `SCR-041`: [`PortalNotificationsPage`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/portal/AccountPages.tsx) — Trung Tâm Thông Báo Vận Hành Chung (Admin & Merchant), Đánh Dấu Từng Mục Hoặc Toàn Bộ Đã Đọc
  - `SCR-042`: [`AdminDashboardPage`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/admin/index.tsx) — Bảng Điều Khiển Toàn Cảnh Vận Hành (Command Center), Chỉ Số Doanh Thu Nền Tảng, Lưu Lượng & Khối Tác Vụ Cần Xử Lý Nóng
  - `SCR-043`: [`AdminParkingLotsPage`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/admin/index.tsx) — Bàn Kiểm Duyệt Danh Sách Bãi Đỗ, Lọc Hồ Sơ Chờ Phê Duyệt & Điều Hướng Thẩm Định Hồ Sơ
  - `SCR-044`: [`AdminLotDetailPage`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/admin/index.tsx) — Hồ Sơ Thẩm Định Chi Tiết Bãi Đỗ, Bản Đồ Tọa Độ Thực Địa & Hộp Thoại Quyết Quyền `TSK-P0-02` (Duyệt/Bổ Sung/Từ Chối)
  - `SCR-045`: [`AdminUsersPage`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/admin/index.tsx) — Danh Mục Quản Trị Người Dùng Toàn Hệ Thống, Phân Loại Vai Trò (Driver/Merchant/Admin) & Trạng Thái Tài Khoản
  - `SCR-046`: [`AdminUserDetailPage`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/admin/index.tsx) — Hồ Sơ Người Dùng & Chế Tài Kỷ Luật, Tác Vụ Khóa Tài Khoản (Banning) Bắt Buộc Ghi Chú Kiểm Toán & Mở Khóa An Toàn
* **ROUTES CHÍNH:**
  - `/merchant/disputes`
  - `/merchant/disputes/:id`
  - `/merchant/notifications`
  - `/admin/notifications`
  - `/admin` & `/admin/dashboard`
  - `/admin/parking-lots`
  - `/admin/parking-lots/:id`
  - `/admin/users`
  - `/admin/users/:id`
* **ISSUE IDS & BUSINESS COMPLIANCE ĐÃ GIẢI QUYẾT:**
  - `TSK-P0-02`: Chuẩn hóa quy chuẩn phê duyệt bãi đỗ bến bãi:
    - Khi Admin thực hiện hành động **"Duyệt & công bố"** (`/approve`): Lý do giải trình là **Tùy chọn** (`isOptionalReason=true`), cho phép gửi quyết định phê duyệt ngay lập tức mà không ép buộc nhập ghi chú.
    - Khi Admin thực hiện hành động **"Từ chối hồ sơ"** (`/reject`) hoặc **"Yêu cầu bổ sung"** (`/request-changes`): Lý do giải trình là **Bắt buộc**, chặn gửi biểu mẫu kèm cảnh báo lỗi trực quan nếu ô lý do bị bỏ trống hoặc chỉ chứa khoảng trắng.
  - `TSK-P2-01 / APP-08`: Chống trùng lặp gửi yêu cầu máy chủ (Double-Submit Prevention):
    - Toàn bộ các hộp thoại `DecisionDialog` và `PortalNotificationsPage` vô hiệu hóa nút bấm xác nhận (`disabled={isPending}`), gắn thuộc tính `aria-busy="true"` và hiển thị loading indicator xoay khi đang kết nối API.
  - `SEC-BAN-01`: Quy chế kỷ luật tài khoản an toàn (`SCR-046`):
    - Khóa tài khoản (`/ban`) bắt buộc nhập lý do kỷ luật lưu vào nhật ký kiểm toán hệ thống. Nút bấm khóa được gắn cảnh báo màu đỏ (`text-red-700 bg-red-50`).
    - Mở khóa tài khoản (`/unban`) sử dụng nút nhấn thương hiệu chuẩn cam `#d95f00` (`bg-[#d95f00] text-white`).
  - `DISPUTE-01`: Chuẩn hóa phân quyền tranh chấp đối tác (`SCR-039` & `SCR-040`):
    - Chủ bãi (Merchant) chỉ có quyền xem danh sách và chi tiết khiếu nại liên quan tới cơ sở của mình, không có nút tạo khiếu nại mới (chỉ dành cho Driver) và không có nút ra phán quyết (chỉ dành cho Admin).
* **SHARED PRIMITIVES & DESIGN SYSTEM REUSED:**
  - [`Workspace`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/Workspace.tsx) (Tiêu đề, Eyebrow, Mô tả phân hệ, Nút hành động)
  - [`DataTable`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/Workspace.tsx) (Phân trang 20 records, render ô dữ liệu, Responsive Mobile Cards)
  - [`Metrics`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/Workspace.tsx) (Khối KPI số liệu nền tảng và người dùng)
  - [`Panel`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/Workspace.tsx) (Khối thông tin thẻ bo tròn viền xám)
  - [`Dialog`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/Workspace.tsx) (Modal WAI-ARIA, phím Escape, đóng backdrop)
  - [`Notice`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/Workspace.tsx) (Thẻ thông báo trạng thái, chỉ dẫn và báo lỗi nghiệp vụ)
  - [`Badge`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/Workspace.tsx) (Huy hiệu trạng thái trực quan phân màu)

---

## 2. KẾT QUẢ TRIỂN KHAI CHI TIẾT THEO CÁC PHASE

### PHASE 1 — PRECHECK & CONTRACT VALIDATION
- Đã kiểm tra và đối chiếu toàn bộ hợp đồng API của các endpoint:
  - `GET /api/v1/disputes/merchant`: Lấy danh sách tranh chấp/khiếu nại gửi tới bãi xe đối tác.
  - `GET /api/v1/disputes/:id`: Lấy chi tiết hồ sơ khiếu nại.
  - `GET /api/v1/notifications`: Lấy danh sách thông báo hoạt động hệ thống.
  - `PUT /api/v1/notifications/:id/read`: Đánh dấu đọc một thông báo.
  - `PUT /api/v1/notifications/read-all`: Đánh dấu tất cả thông báo là đã đọc.
  - `GET /api/v1/admin/dashboard`: Dữ liệu tổng hợp KPI, doanh thu và cảnh báo cần xử lý.
  - `GET /api/v1/admin/parking-lots`: Danh sách hồ sơ bãi đỗ chờ kiểm duyệt.
  - `GET /api/v1/admin/parking-lots/:id`: Chi tiết hồ sơ bãi đỗ kèm tọa độ và chủ bãi.
  - `PUT /api/v1/admin/parking-lots/:id/approve`: Phê duyệt bãi đỗ (lý do tùy chọn).
  - `PUT /api/v1/admin/parking-lots/:id/reject`: Từ chối bãi đỗ (bắt buộc lý do).
  - `PUT /api/v1/admin/parking-lots/:id/request-changes`: Yêu cầu bổ sung hồ sơ (bắt buộc lý do).
  - `GET /api/v1/admin/users`: Danh bạ quản trị tài khoản toàn hệ thống.
  - `GET /api/v1/admin/users/:id`: Hồ sơ chi tiết người dùng, thống kê đặt chỗ & khiếu nại.
  - `PUT /api/v1/admin/users/:id/ban`: Khóa tài khoản có lý do kiểm toán.
  - `PUT /api/v1/admin/users/:id/unban`: Mở khóa tài khoản đã bị khóa.
  - `POST /api/v1/admin/users/:id/warnings`: Gửi thông báo cảnh cáo tới người dùng.

### PHASE 2 — SCREEN AUDIT & CAPABILITY MATRIX

| Mã màn hình | Tên màn hình | Role | Đường dẫn Route | Shared Component | Trạng thái Parity & API |
|:---|:---|:---|:---|:---|:---:|
| `SCR-039` | Merchant Disputes List | MERCHANT | `/merchant/disputes` | `Workspace`, `DataTable`, `Badge` | 100% Đạt |
| `SCR-040` | Merchant Dispute Detail | MERCHANT | `/merchant/disputes/:id` | `Workspace`, `Panel`, `Badge` | 100% Đạt |
| `SCR-041` | Portal Notifications Center | ADMIN / MERCHANT | `/admin/notifications`, `/merchant/notifications` | `Workspace`, `DataTable`, `Notice`, `Badge` | 100% Đạt |
| `SCR-042` | Admin Command Center | ADMIN | `/admin`, `/admin/dashboard` | `Workspace`, `Metrics`, `Panel` | 100% Đạt |
| `SCR-043` | Admin Parking Lots Moderation | ADMIN | `/admin/parking-lots` | `Workspace`, `DataTable`, `Badge` | 100% Đạt |
| `SCR-044` | Admin Lot Appraisal Dossier | ADMIN | `/admin/parking-lots/:id` | `Workspace`, `Panel`, `Dialog`, `Notice`, `LotOverview` | 100% Đạt (`TSK-P0-02`) |
| `SCR-045` | Admin Users Directory | ADMIN | `/admin/users` | `Workspace`, `DataTable`, `Badge` | 100% Đạt |
| `SCR-046` | Admin User Enforcement Dossier | ADMIN | `/admin/users/:id` | `Workspace`, `Metrics`, `Panel`, `Dialog`, `Notice` | 100% Đạt (`SEC-BAN-01`) |

### PHASE 3 — CODE STANDARDIZATION & REFACTORING
- Chuẩn hóa toàn bộ màu sắc CTA đồng nhất với token `#d95f00` (`bg-[#d95f00] text-white hover:bg-[#b84e00]`).
- Tách biệt rõ ràng luồng quyền: Driver (khiếu nại), Merchant (theo dõi phản ánh bãi), Admin (phán quyết & hòa giải).
- Khối cảnh báo triage card trên Admin Dashboard tự động phát hiện số lượng tồn đọng (`count > 0`) để đính kèm huy hiệu "Cần xử lý" và định dạng con số nổi bật màu cam `#d95f00`.

### PHASE 4 — TEST SUITE VERIFICATION

Đã thiết lập bộ kiểm thử tích hợp chuyên sâu [`Batch14FAdminGovernanceIntegration.test.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/admin/__tests__/Batch14FAdminGovernanceIntegration.test.tsx) bao phủ toàn diện 10 test cases:
1. `SCR-039`: Merchant Disputes list truy vấn đúng `/api/v1/disputes/merchant`, hiển thị số tiền bồi thường canh phải, huy hiệu trạng thái, và ẩn nút tạo khiếu nại của tài xế.
2. `SCR-040`: Merchant Dispute detail hiển thị chi tiết hồ sơ, ẩn nút ghi nhận phán quyết của Admin, và liên kết quay lại danh sách `/merchant/disputes`.
3. `SCR-041`: Portal Notifications Center hiển thị danh sách thông báo, hỗ trợ đánh dấu đọc từng thông báo (`PUT /api/v1/notifications/:id/read`) và đánh dấu tất cả (`PUT /api/v1/notifications/read-all`).
4. `SCR-042`: Admin Dashboard hiển thị KPIs tài chính định dạng VND, lưu lượng và các thẻ bàn xử lý kèm link điều hướng.
5. `SCR-043`: Admin Lots Moderation Queue hiển thị bảng danh sách hồ sơ bãi đỗ với nút CTA "Thẩm định" cam `#d95f00`.
6. `SCR-044 (TSK-P0-02 Approve)`: Xác nhận duyệt bãi đỗ cho phép để trống ghi chú và gửi payload `{ reason: '' }` tới `/approve`.
7. `SCR-044 (TSK-P0-02 Reject)`: Xác nhận từ chối bãi đỗ bắt buộc nhập lý do, chặn submit nếu ô trống và gửi payload hợp lệ tới `/reject`.
8. `SCR-045`: Admin Users Directory hiển thị danh sách người dùng, vai trò, trạng thái và liên kết tới trang quản trị người dùng.
9. `SCR-046 (SEC-BAN-01 Ban)`: Khóa tài khoản đang hoạt động bắt buộc nhập lý do giải trình kiểm toán và gửi yêu cầu tới `/ban`.
10. `SCR-046 (SEC-BAN-01 Unban)`: Mở khóa tài khoản bị khóa bằng nút cam `#d95f00` và gửi yêu cầu tới `/unban`.

Kết quả chạy kiểm thử toàn bộ phân hệ Admin:
```
 ✓ src/features/admin/__tests__/AdminDisputesAuditProfile.test.tsx (8 tests)
 ✓ src/features/admin/__tests__/AdminParkingLotsModeration.test.tsx (7 tests)
 ✓ src/features/admin/__tests__/AdminUserGovernanceAndSettlement.test.tsx (6 tests)
 ✓ src/features/admin/__tests__/Batch14FAdminGovernanceIntegration.test.tsx (10 tests)

 Test Files  4 passed (4)
      Tests  31 passed (31)
```

---

## 3. BẢO ĐẢM CHẤT LƯỢNG (QUALITY GATES)

1. **TypeScript Typecheck:**
   - Lệnh: `cd smart-parking-app-v2; npx tsc -b`
   - Kết quả: **0 lỗi (Exit Code 0)**.
2. **Production Bundle Build:**
   - Lệnh: `cd smart-parking-app-v2; npm run build`
   - Kết quả: **Thành công trong 12.84s (0 lỗi)**.
3. **Vitest Test Suite:**
   - Lệnh: `cd smart-parking-app-v2; npx vitest run src/features/admin/__tests__/`
   - Kết quả: **31/31 passed (100% Green)**.

---

## 4. KẾ HOẠCH BƯỚC TIẾP THEO

- **BATCH TIẾP THEO:** `BATCH-14G: Admin Finance, Arbitration Tribunal & Security Audit (SCR-047 to SCR-053)`
  - `SCR-047`: Admin Financial Transactions & Reconciliation Ledger (`/admin/transactions`)
  - `SCR-048`: Admin Merchant Payout Authorization Desk (`/admin/withdrawals`)
  - `SCR-049`: Admin Disputes Arbitration Docket (`/admin/disputes`)
  - `SCR-050`: Admin Dispute Judicial Dossier (`/admin/disputes/:id`)
  - `SCR-051`: Platform System Audit Logs Trail (`/admin/audit-logs`)
  - `SCR-052`: Admin Operations Notifications Center (`/admin/notifications`)
  - `SCR-053`: Admin Security Credentials & Profile (`/admin/profile`)
