# 19. Bản Đồ Mạng Lưới Điều Hướng Tuyến Đường (Route Navigation Graph)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** WORKFLOW AUDIT ONLY (Tuân thủ nghiêm ngặt PROJECT UNIFICATION MASTER RULES — **Không sửa code**)  
> **Thời điểm khảo sát:** 07/11/2026  
> **Phạm vi khảo sát:** Toàn bộ 73 route patterns, 56 màn hình nghiệp vụ, 5 layouts và 46 điểm gọi `navigate()`  
> **Trạng thái:** VERIFIED 100% (Phân tích tĩnh AST kết hợp đối chiếu Router Graph)

---

## 1. Sơ Đồ Cấu Trúc Điều Hướng Toàn Hệ Thống (Master Navigation Graph)

```mermaid
flowchart TD
    %% Public Marketing Cluster
    subgraph PUBLIC["Phân Hệ Tiếp Thị & Công Cộng (Public Marketing)"]
        P_HOME["Trang Chủ (/)"]
        P_ABOUT["Giới Thiệu (/about)"]
        P_PRICING["Bảng Giá (/pricing)"]
        P_SOLUTIONS["Giải Pháp (/solutions)"]
        P_CAREERS["Tuyển Dụng (/careers)"]
        P_CONTACT["Liên Hệ (/contact)"]
        P_API["Tài Liệu API (/api-docs)"]
    end

    %% Auth Cluster
    subgraph AUTH["Phân Hệ Xác Thực (Authentication)"]
        A_LOGIN["Đăng Nhập (/auth/login)"]
        A_REGISTER["Đăng Ký (/auth/register)"]
        A_FORGOT["Quên Mật Khẩu (/auth/forgot-password)"]
        A_RESET["Đặt Lại MK (/auth/reset-password)"]
    end

    %% Driver Portal Cluster
    subgraph DRIVER["Cổng Tài Xế (Driver Portal - DriverLayout)"]
        D_DASH["Bảng Điều Khiển (/driver/dashboard)"]
        D_SEARCH["Tìm Kiếm Bãi Xe (/search)"]
        D_DETAIL["Chi Tiết Bãi Xe (/parking/:id)"]
        D_BOOKINGS["Vé Của Tôi (/driver/bookings)"]
        D_BK_DETAIL["Chi Tiết Lượt Đỗ (/driver/bookings/:id)"]
        D_VEHICLES["Quản Lý Xe (/driver/vehicles)"]
        D_WALLET["Ví Điện Tử (/driver/wallet)"]
        D_NOTIF["Thông Báo (/driver/notifications)"]
    end

    %% Merchant Portal Cluster
    subgraph MERCHANT["Cổng Chủ Bãi Xe (Merchant Portal - MerchantLayout)"]
        M_OVERVIEW["Tổng Quan (/merchant/overview)"]
        M_DASH["Điều Hành Live (/merchant/dashboard)"]
        M_LOTS["Danh Sách Bãi (/merchant/parking-lots)"]
        M_LOT_NEW["Tạo Bãi Mới (/merchant/parking-lots/new)"]
        M_LOT_DETAIL["Chi Tiết Bãi (/merchant/parking-lots/:id)"]
        M_LOT_EDIT["Sửa Bãi (/merchant/parking-lots/:id/edit)"]
        M_SLOTS["Quản Lý Slot (/merchant/slots)"]
        M_GATES["Giám Sát Barie (/merchant/gates)"]
        M_ALPR["Camera ALPR (/merchant/camera-alpr)"]
        M_INVOICES["Hóa Đơn VAT (/merchant/invoices)"]
        M_FINANCES["Tài Chính & Rút Tiền (/merchant/finances)"]
    end

    %% Admin Portal Cluster
    subgraph ADMIN["Cổng Điều Hành Hệ Thống (Admin Portal - AdminLayout)"]
        ADM_DASH["Dashboard Toàn Sàn (/admin)"]
        ADM_USERS["Quản Lý Users (/admin/users)"]
        ADM_USER_DT["Chi Tiết User (/admin/users/:id)"]
        ADM_LOTS["Kiểm Duyệt Bãi (/admin/parking-lots)"]
        ADM_LOT_DT["Thẩm Định Bãi (/admin/parking-lots/:id)"]
        ADM_TX["Tra Soát Giao Dịch (/admin/transactions)"]
        ADM_WITHDRAW["Phê Duyệt Rút Tiền (/admin/withdrawals)"]
        ADM_DISPUTES["Trọng Tài Khiếu Nại (/admin/disputes)"]
        ADM_AUDIT["Nhật Ký An Ninh (/admin/audit-logs)"]
    end

    %% Payment Flow
    subgraph PAYMENT["Cổng Thanh Toán & Đồng Bộ"]
        PAY_GATE["PayOS VietQR Gateway"]
        PAY_RET["Thành Công (/payment/return)"]
        PAY_CANCEL["Thất Bại / Hủy (/payment/cancel)"]
    end

    %% Public Nav Connections
    P_HOME -->|Click Đăng Nhập| A_LOGIN
    P_HOME -->|Click Tìm Bãi| D_SEARCH
    P_HOME -->|Click Bảng Giá| P_PRICING
    P_PRICING -->|Đăng ký Fleet| P_CONTACT
    P_CAREERS -->|Nộp CV| P_CONTACT

    %% Auth Transitions
    A_LOGIN -->|Đăng nhập thành công DRIVER| D_DASH
    A_LOGIN -->|Đăng nhập thành công MERCHANT| M_DASH
    A_LOGIN -->|Đăng nhập thành công ADMIN| ADM_DASH
    A_LOGIN -->|Quên mật khẩu| A_FORGOT
    A_FORGOT -->|Nhập OTP hợp lệ| A_RESET
    A_RESET -->|Đổi MK thành công| A_LOGIN

    %% Driver Workflows
    D_DASH -->|Tìm bãi gần nhất| D_SEARCH
    D_SEARCH -->|Chọn bãi đỗ| D_DETAIL
    D_DETAIL -->|Đặt chỗ & Giữ chỗ| PAY_GATE
    PAY_GATE -->|Thanh toán thành công| PAY_RET
    PAY_GATE -->|Hủy thanh toán| PAY_CANCEL
    PAY_RET -->|Xem vé đã đặt| D_BK_DETAIL
    PAY_CANCEL -->|Thử lại| D_SEARCH
    D_DASH -->|Bấm xem Active Trip| D_BK_DETAIL
    D_DASH -->|Shortcut Quản lý xe| D_VEHICLES
    D_DASH -->|Shortcut Nạp ví| D_WALLET
    D_BK_DETAIL -->|Danh sách vé| D_BOOKINGS

    %% Merchant Workflows
    M_OVERVIEW -->|Theo dõi thời gian thực| M_DASH
    M_DASH -->|Xem sơ đồ bãi| M_SLOTS
    M_LOTS -->|Thêm bãi mới (Wizard)| M_LOT_NEW
    M_LOT_NEW -->|Hoàn tất 4 bước| M_LOT_DETAIL
    M_LOT_DETAIL -->|Chỉnh sửa thông số| M_LOT_EDIT
    M_DASH -->|Giám sát cổng vào/ra| M_ALPR
    M_DASH -->|Xuất hóa đơn| M_INVOICES
    M_FINANCES -->|Tạo lệnh rút tiền| M_OVERVIEW

    %% Admin Workflows
    ADM_DASH -->|Xem danh sách bãi chờ duyệt| ADM_LOTS
    ADM_LOTS -->|Chi tiết thẩm định hồ sơ| ADM_LOT_DT
    ADM_DASH -->|Duyệt lệnh rút tiền| ADM_WITHDRAW
    ADM_DASH -->|Xử lý khiếu nại cước| ADM_DISPUTES
    ADM_DASH -->|Tra soát dòng tiền sàn| ADM_TX
    ADM_DASH -->|Tra cứu tài khoản| ADM_USERS
    ADM_USERS -->|Hồ sơ cá nhân| ADM_USER_DT
```

---

## 2. Bảng Phân Tích Cơ Chế Điều Hướng (Navigation Channels)

### 2.1. Thanh Điều Hướng Cấp Cao (Header Navigation)
* **Public Header (`LandingNavbar.tsx`):**
  * Quản lý liên kết: Trang chủ, Giải pháp Tài xế, Giải pháp Chủ bãi, Bảng giá, API, Tuyển dụng, Đăng nhập.
  * Hiện trạng: Đang tồn tại 3 liên kết lỗi dẫn vào route không tồn tại (`/company/about`, `/company/contact`, `/company/blog`) và neo hashtag `#lien-he` không hoạt động trên trang con.
* **Driver Header (`layouts/driver/DriverHeader.tsx`):**
  * Quản lý điều hướng tài xế: Logo -> `/driver/dashboard`, Menu ngang (Dashboard, Tìm bãi xe `/search`, Vé của tôi `/driver/bookings`, Quản lý xe `/driver/vehicles`, Ví tiền `/driver/wallet`, Thông báo `/driver/notifications`).
  * Dropdown tài khoản: Hồ sơ cá nhân (`/profile`), Đổi mật khẩu (`/change-password`), Đăng xuất (`clearSession()`).
* **Merchant Header (`layouts/merchant/MerchantHeader.tsx`):**
  * Cố định chiều cao 64px, chứa thanh tìm kiếm nhanh, nút quét camera ALPR, chuông thông báo, avatar tài khoản chủ bãi.
* **Admin Header (`layouts/admin/AdminHeader.tsx`):**
  * Quản lý trạng thái vận hành toàn sàn, switcher chuyển môi trường, avatar Quản trị viên tối cao.

---

### 2.2. Thanh Điều Hướng Bên Cố Định (Sidebar Navigation)
* **Merchant Sidebar (`layouts/merchant/MerchantSidebar.tsx`):**
  * Chiều rộng cố định 260px (`--size-sidebar-width`).
  * Danh mục 11 nhóm thao tác: Tổng quan (`/merchant/overview`), Dashboard Live (`/merchant/dashboard`), Danh sách bãi (`/merchant/parking-lots`), Quản lý slot (`/merchant/slots`), Cấu hình giá (`/merchant/pricing`), Nhân viên trực (`/merchant/staff`), Cổng & Barie (`/merchant/gates`), Giám sát Camera ALPR (`/merchant/camera-alpr`), Báo cáo (`/merchant/reports`), Tài chính (`/merchant/finances`), Hóa đơn VAT (`/merchant/invoices`), Khiếu nại (`/merchant/disputes`).
  * Đánh giá: Cấu trúc Sidebar của Merchant rất mạch lạc, có trạng thái `NavLink.isActive` đổi màu cam `#d95f00` chuẩn mực.
* **Admin Sidebar (`layouts/AdminLayout.tsx`):**
  * Tông nền tối công nghiệp `#060d1a`, icon sắc nét từ `lucide-react`.
  * Danh mục điều hướng: Tổng quan sàn, Quản lý Người dùng, Quản lý Bãi xe, Giao dịch sàn, Phê duyệt rút tiền, Giải quyết khiếu nại, Nhật ký an ninh Audit Logs.

---

### 2.3. Điều Hướng Hành Động & Liên Kết Chi Tiết (Action & Detail Links)
Dự án ghi nhận **46 điểm gọi lệnh chuyển trang chủ động (`navigate()`)**:
* **Từ Danh sách sang Chi tiết (Master-Detail):**
  * Click thẻ bãi xe trên bản đồ -> `navigate('/parking/${yard.id}')`.
  * Click dòng bảng lượt xe -> `navigate('/merchant/bookings/${item.id}')`.
  * Click thẻ bãi xe trong Merchant -> `navigate('/merchant/parking-lots/${lot.id}')`.
  * Click người dùng trong Admin -> `navigate('/admin/users/${user.id}')`.
* **Từ Chi tiết sang Thao tác con (Sub-actions):**
  * Tại chi tiết bãi xe: Nút "Chỉnh sửa" -> `navigate('/merchant/parking-lots/${lot.id}/edit')`.
  * Tại chi tiết bãi xe: Nút "Cấu hình Slot" -> `navigate('/merchant/parking-lots/${lot.id}/slots')`.
  * Tại chi tiết bãi xe: Nút "Bảng giá cước" -> `navigate('/merchant/parking-lots/${lot.id}/pricing')`.

---

### 2.4. Khảo Sát Nút Quay Lại & Breadcrumbs (Back Navigation & Breadcrumbs)
* **Tỷ lệ có nút Quay lại (Back Button):** **Cực kỳ thấp (Chỉ có 4 / 56 màn hình)**.
  - Các trang có nút quay lại: `ParkingDetailPage.tsx` (có nút `ArrowLeft` về `/search`), `MerchantParkingLotDetailPage.tsx` (có link về danh sách bãi), `ChangePasswordForm.tsx` (có nút hủy về Profile), `SmsRecoveryModal.tsx` (có nút quay lại Login).
  - 52 màn hình còn lại hoàn toàn thiếu nút quay lại ngữ cảnh trước đó!
* **Tỷ lệ có Breadcrumb / Eyebrow:** **14 / 56 màn hình**.
  - Toàn bộ 12 trang Admin có Eyebrow chuẩn: `SMARTTRUCK / OPERATIONS`, `SMARTTRUCK / AUDIT`.
  - Các trang Driver và Merchant hầu như không có Breadcrumb định vị phân cấp (ví dụ: `Bãi xe > Bãi Sóng Thần 2 > Cấu hình slot đỗ`).

---

### 2.5. Xung Đột Định Danh Đường Dẫn (Route Aliasing Fragmentation)
Khảo sát phát hiện nhiều trang nghiệp vụ đang được đăng ký trùng lặp tại 2 hoặc 3 đường dẫn khác nhau trong `src/app/router/index.tsx`:

| Màn Hình Nghiệp Vụ | Đường Dẫn 1 | Đường Dẫn 2 | Đường Dẫn 3 | Hậu Quả Kỹ Thuật |
| :--- | :--- | :--- | :--- | :--- |
| **Tìm kiếm bãi xe** | `/search` | `/dashboard/search` | `/dashboard/parking` | Gây phân mảnh bookmark và mất cache React Query giữa các link |
| **Vé đỗ của tôi** | `/bookings` | `/driver/bookings` | `/dashboard/bookings` | Nút quay lại tại Payment Return trỏ về `/bookings`, trong khi Header trỏ `/driver/bookings` |
| **Quản lý phương tiện**| `/vehicles` | `/driver/vehicles` | `/dashboard/vehicles` | Form đặt chỗ trỏ sang `/dashboard/vehicles`, trong khi menu trỏ `/driver/vehicles` |
| **Hàng đợi ảo** | `/queues` | `/driver/queues` | `/dashboard/queues` | Phân tán URL định danh của cùng 1 module |

*Đề xuất chuẩn hóa:* Quy chuẩn duy nhất một tiền tố chính thức cho tài xế là `/driver/*` (ví dụ: `/driver/search`, `/driver/bookings`, `/driver/vehicles`). Các đường dẫn cũ đặt mã chuyển hướng `Navigate replace`.
