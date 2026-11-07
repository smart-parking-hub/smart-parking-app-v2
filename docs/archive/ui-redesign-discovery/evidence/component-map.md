# Sơ Đồ Cấu Trúc Component (Component Map Evidence)

Dữ liệu cây thành phần giao diện (Component Hierarchy) được phân tích từ toàn bộ thư mục `src/` của ứng dụng Frontend `smart-parking-app`.

---

## 1. Cấu Trúc Khung Bố Cục & Layouts

```
[ App.tsx ] 
   │
   ├── ConfigProvider (Ant Design Theme: #0f766e, borderRadius: 8)
   └── BrowserRouter
        │
        ├── LandingLayout
        │    ├── LandingNavbar (Logo, Links, Bell, Account Dropdown, Mobile Drawer)
        │    ├── <Outlet /> (Landing Pages & Driver Pages)
        │    └── LandingFooter (Multi-column corporate footer)
        │
        ├── AuthLayout
        │    ├── aside.auth-hero (Logo, Brand copy, smart-logistics-truck.png visual)
        │    └── section.auth-panel (<Outlet />: Login / Register / Forgot Password)
        │
        ├── DashboardLayout
        │    ├── (If DRIVER)
        │    │    ├── LandingNavbar
        │    │    ├── main.driver-dashboard-content (<Outlet />)
        │    │    └── AiChatWidget (Floating Assistant)
        │    └── (If MERCHANT / ADMIN)
        │         ├── Sider (Collapsible 260px/72px, Menu items)
        │         ├── Header (Toggle button, Phone, Role Tag, Avatar, Logout)
        │         ├── Content (<Outlet />)
        │         └── AiChatWidget
        │
        ├── MerchantLayout
        │    ├── Sider.merchant-sider (Brand logo, Menu items with Live Unread Badges)
        │    ├── Header.merchant-header (Breadcrumb, Unread Notification Bell, User Dropdown)
        │    └── Content.merchant-content (<Outlet />)
        │
        └── AdminLayout
             ├── Sider.admin-sider (Admin BankOutlined brand, Navigation menu)
             ├── Header.admin-header (Toggle button, Breadcrumbs, Admin User Dropdown)
             ├── Content.admin-content (<Outlet />)
             └── Footer.admin-footer (ShieldCheck icon, Audit log notice)
```

---

## 2. Bảng Danh Mục Các Component Chia Sẻ & Phức Tạp (Shared & Complex Components)

| Tên Component | Vị Trí File Mã Nguồn | Màn Hình / Nơi Nhúng | Chức Năng Nghiệp Vụ & Kỹ Thuật | Thư Viện Sử Dụng |
|---|---|---|---|---|
| **`AiChatWidget`** | `features/ai-copilot/components/AiChatWidget.tsx` | Nhúng toàn cục trong `DashboardLayout` | Trợ lý ảo tìm bãi qua GPS, trả lời quy tắc giữ chỗ 10p, đỗ quá giờ | `lucide-react`, `antd`, Geolocation API |
| **`ReviewModal`** | `features/reviews/components/ReviewModal.tsx` | Nhúng trong `SCR-017: MyBookingsPage` | Đánh giá sao (1-5) và bình luận sau khi hoàn tất lượt đỗ | `antd` (Modal, Rate, Input) |
| **`CancelBookingModal`** | `features/bookings/components/CancelBookingModal.tsx` | Nhúng trong `SCR-017: MyBookingsPage` | Hủy đặt chỗ, giải thích chính sách hoàn tiền cọc, chọn lý do | `antd` (Modal, Radio, Alert) |
| **`DriverParkingMap`** | `features/parking-search/components/DriverParkingMap.tsx` | Nhúng trong `SCR-015: SearchParkingPage` | Bản đồ tương tác, render marker bãi, marker GPS, vẽ tuyến đường polyline | `leaflet`, `@types/leaflet` |
| **`InlineQuickBookPanel`** | `features/parking-search/components/InlineQuickBookPanel.tsx` | Nhúng trong `SCR-015: SearchParkingPage` | Drawer đặt giữ chỗ nhanh ngay trên bản đồ mà không cần chuyển trang | `antd` (Drawer, Form, Select, Button) |
| **`QrCameraScanner`** | `features/merchant/qr-scanner/components/QrCameraScanner.tsx` | Nhúng trong `SCR-036: MerchantQrScannerPage` | Khung ngắm camera quét mã QR trên điện thoại tài xế | `html5-qrcode` |
| **`AdminParkingLotMap`** | `features/admin/parking-approvals/AdminParkingLotMap.tsx` | Nhúng trong `SCR-044: AdminParkingLotDetailPage` | Bản đồ mini xác thực tọa độ GPS của bãi đỗ xe khi Admin duyệt | `leaflet` |
| **`ProfileSidebar`** | `features/profile/components/ProfileSidebar.tsx` | Nhúng trong `SCR-020` và `SCR-021` | Thanh điều hướng tab cá nhân của tài xế (Hồ sơ, Xe, Đổi mật khẩu) | `lucide-react`, `react-router-dom` |
| **`LandingNavbar`** | `features/landing/components/LandingNavbar.tsx` | Nhúng trong `LandingLayout` và `DashboardLayout` | Thanh menu điều hướng chính của tài xế và khách, chuông thông báo | `antd` (Dropdown), `lucide-react` |
| **`LandingFooter`** | `features/landing/components/LandingFooter.tsx` | Nhúng trong `LandingLayout` | Footer đa cột chứa liên kết dịch vụ, pháp lý và thương hiệu | HTML semantic |
