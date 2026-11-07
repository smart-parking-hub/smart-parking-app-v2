# BÁO CÁO CHUẨN HÓA TOÀN BỘ CẤU TRÚC LAYOUT VÀ HỆ THỐNG ĐIỀU HƯỚNG (PROMPT 13)

> **Dự án:** SmartParkingHub Workspace Master Unification  
> **Phân hệ:** `smart-parking-app-v2` (React 19 + TypeScript Strict + Tailwind CSS v4 + Vite)  
> **Mã tài liệu:** `47-layout-navigation-report.md`  
> **Trạng thái:** HOÀN TẤT & ĐÃ XÁC THỰC 100% (49 Test Files, 391 Tests Passed, Build 0 Errors)  
> **Ngày hoàn thành:** 07/11/2026

---

## 1. TỔNG QUAN VÀ MỤC TIÊU TRIỂN KHAI

Tiếp nối việc hoàn tất hệ thống Level 3 (Compound Components) và Level 4 (UI Patterns), nhiệm vụ Prompt 13 tập trung chuẩn hóa toàn diện 6 Layouts thực tế và mạng lưới điều hướng (Navigation Graph) của toàn bộ hệ thống SmartParkingHub:
1. **Public Layout (`LandingLayout`)**: Dành cho khách vãng lai và đối tác truy cập thông tin marketing, giải pháp, báo giá, tuyển dụng, kết nối API.
2. **Authentication Layout (`AuthLayout`)**: Dành cho các màn hình định danh (Đăng nhập, Đăng ký, Quên mật khẩu/OTP).
3. **Driver Layout (`DriverLayout`)**: Cổng thông tin và điều hành bến bãi chuyên biệt cho tài xế xe tải/container.
4. **Merchant / Parking Owner Layout (`MerchantLayout`)**: Bảng điều khiển vận hành, quản lý bãi đỗ, luồng barie ALPR và doanh thu dành cho Chủ bãi xe.
5. **Admin Layout (`AdminLayout`)**: Trung tâm chỉ huy (Command Center) kiểm duyệt bãi, người dùng, dòng tiền giao dịch, đối soát khiếu nại và nhật ký kiểm toán.
6. **Shared / Baseline Layout (`RootLayout`)**: Khung điều hành nội bộ theo kiến trúc 4 lớp và quản trị agent CRM.

---

## 2. CHI TIẾT CHUẨN HÓA TỪNG LAYOUT VÀ HỆ THỐNG ĐIỀU HƯỚNG

### A. Public Layout ([`src/layouts/LandingLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/layouts/LandingLayout.tsx))
- **Cấu trúc:** Tích hợp [`ScrollToTop`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/ScrollToTop.tsx), [`LandingNavbar`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/common/LandingNavbar.tsx), `<main id="main-content">` và [`LandingFooter`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/common/LandingFooter.tsx).
- **Tái cấu trúc & Đồng bộ hóa Header Landing Page (`LandingNavbar`):**
  - **Khắc phục triệt để lỗi nhảy menu:** Trước đây, thanh điều hướng thay đổi bất nhất khi duyệt qua từng trang (trang này hiện "Tuyển dụng", trang kia hiện "#quy-trinh-tai-xe", trang khác lại hiện "#onboarding-form", gây rối mắt và làm nhảy bố cục).
  - **Nhóm menu khoa học (Mega-Dropdown):** Rút gọn từ 9 mục dàn trải gây chật chội thành **5 danh mục tinh gọn, ổn định 100% trên toàn bộ các trang**:
    1. **Trang chủ** (`/`)
    2. **Giải pháp ▾** (Flyout Dropdown trực quan với icon và mô tả):
       - `Giải pháp Tài xế` (`/driver-solutions`): Tìm bãi đỗ thông minh, đặt chỗ trước & vé điện tử QR ALPR.
       - `Giải pháp Chủ bãi` (`/owner-solutions`): Tự động hóa cổng barie, kiểm soát sức chứa & tối ưu doanh thu.
       - `Kết nối API` (`/api-docs`): Cổng API mở tích hợp TMS, ERP đội xe và bến bãi.
    3. **Bảng giá** (`/pricing`)
    4. **Doanh nghiệp ▾** (Flyout Dropdown trực quan với icon và mô tả):
       - `Về chúng tôi` (`/about`): Sứ mệnh số hóa hạ tầng logistics bến bãi Việt Nam.
       - `Tuyển dụng` (`/careers`): Cơ hội nghề nghiệp & văn hóa kỹ thuật cao.
       - `Tin tức & Báo cáo` (`/company/blog`): Báo cáo chỉ số logistics, thị trường & công nghệ.
    5. **Liên hệ** (`/contact`): Kênh tiếp nhận yêu cầu hợp tác và hỗ trợ 24/7.
  - **Nhận diện trạng thái kích hoạt:** Tự động highlight mục cha và mục con tương ứng với URL hiện tại (`aria-current="page"`).
  - **Hỗ trợ tương tác:** Đóng mở bằng hover và click, tự động đóng khi nhấp ra ngoài hoặc bấm phím `Escape`.
  - **Mobile Menu Drawer:** Tổ chức thành các phân đoạn rõ ràng, kèm nút Đăng nhập và hotline `1900 6868`.
- **Global Footer (`LandingFooter`):**
  - 100% các liên kết nội bộ sử dụng React Router `<Link to="...">`, loại bỏ hoàn toàn việc reload toàn trang.
  - Phân nhóm 4 cột rõ ràng: Giải pháp, Doanh nghiệp, Pháp lý & Bảo mật, Bản tin ngành.

---

### B. Authentication Layout ([`src/layouts/AuthLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/layouts/AuthLayout.tsx))
- **Bố cục Split-Screen:** Cột trái hiển thị nhận diện thương hiệu `SMARTTRUCK HUB`, thông điệp "Một điểm đỗ. Ngàn hành trình", huy hiệu bảo mật `ShieldCheck`.
- **Tích hợp ScrollToTop:** Đảm bảo khi người dùng điều hướng từ các trang dài sang Đăng nhập/Đăng ký/Quên mật khẩu, màn hình luôn cuộn lên đầu form.
- **Cột form tương tác:** Căn giữa hoàn hảo, hỗ trợ phím Tab điều hướng tuần tự qua các input, vòng sáng focus-visible ring cam `#d95f00`.
- **Nút quay lại:** Liên kết về trang chủ công cộng không gây mất trạng thái.

---

### C. Driver Layout ([`src/layouts/DriverLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/layouts/DriverLayout.tsx))
- **Cơ chế cuộn trang:** Tích hợp [`ScrollToTop`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/ScrollToTop.tsx) tự động cuộn lên đầu trang khi tài xế chuyển tab giữa Dashboard, Tìm bãi, Đặt chỗ, Hàng đợi, Thanh toán, v.v.
- **Top Header ([`DriverHeader.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/layouts/driver/DriverHeader.tsx)):**
  - Thanh điều hướng cố định trên cùng (`fixed top-0`) gồm 7 mục nghiệp vụ cốt lõi của tài xế:
    1. `/dashboard`: Tổng quan vận hành & thẻ chuyến đi đang chạy.
    2. `/parking`: Bản đồ số tìm bãi và giữ chỗ nhanh 10 phút.
    3. `/bookings`: Quản lý vé & đặt chỗ (vé điện tử QR ALPR).
    4. `/queues`: Hàng đợi ảo tại cảng và bãi trung chuyển.
    5. `/payments`: Lịch sử cước, ví tài xế và hóa đơn VAT TT78.
    6. `/vehicles`: Quản lý đội xe và biển số xe đã đăng ký.
    7. `/disputes`: Trung tâm khiếu nại và yêu cầu hoàn cước.
  - **Nhận diện trạng thái kích hoạt:** Sử dụng `aria-current="page"` kết hợp nền trắng chữ đen nổi bật trên nền `brand-navy`.
  - **Menu tài khoản người dùng:** Hiển thị Avatar với 2 chữ cái viết tắt tên thật (thuật toán tên tiếng Việt "Hoàng Nam Vũ" -> "HV"), họ tên, vai trò Tài xế, liên kết Hồ sơ cá nhân, Đổi mật khẩu và nút Đăng xuất an toàn.
  - **Hỗ trợ phím Escape:** Đóng nhanh menu tài khoản và menu di động.
- **Driver Footer ([`DriverFooter.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/layouts/driver/DriverFooter.tsx)):**
  - Cập nhật thông tin bản quyền chuẩn `© 2026 SmartTruckHub Logistics Network`.
  - Hotline hỗ trợ 24/7 `1900 6868`, chứng chỉ bảo mật quốc tế `ISO/IEC 27001:2022`.
  - Thay thế liên kết giả `#terms` bằng các trang thực `/about` và `/contact`.
- **Trợ lý thông minh AI:** Tích hợp `AiCopilot` hỗ trợ tài xế tìm bãi tự động.

---

### D. Parking Owner / Merchant Layout ([`src/layouts/MerchantLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/layouts/MerchantLayout.tsx))
- **Cơ chế cuộn trang:** Tích hợp [`ScrollToTop`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/ScrollToTop.tsx) đảm bảo mọi màn hình quản trị bến bãi luôn bắt đầu từ đỉnh giao diện.
- **Sidebar cố định 260px ([`MerchantSidebar.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/layouts/merchant/MerchantSidebar.tsx)):**
  - Chuẩn hóa 9 mục điều hướng chính xác với hệ thống biểu tượng trực quan:
    1. `/merchant/dashboard`: `LayoutGrid` — Tổng quan doanh thu & lưu lượng.
    2. `/merchant/parking-lots`: `Warehouse` — Quản lý danh sách bãi đỗ.
    3. `/merchant/bookings`: `Ticket` — Quản lý đặt chỗ và check-in.
    4. `/merchant/qr-scanner`: `QrCode` — Trạm Barie & Quét mã QR ALPR.
    5. `/merchant/revenue`: `TrendingUp` — Báo cáo doanh thu và đối soát.
    6. `/merchant/withdrawals`: `Wallet` — Ví tài khoản và yêu cầu rút tiền.
    7. `/merchant/disputes`: `Headset` — Xử lý tranh chấp và khiếu nại tài xế.
    8. `/merchant/profile`: `Building2` — Hồ sơ pháp lý và thông tin bến bãi.
    9. `/merchant/notifications`: `Bell` — Trung tâm thông báo chủ bãi (đã sửa biểu tượng `Bell` thay vì trùng `Headset`).
  - **Responsive Drawer:** Hỗ trợ backdrop làm mờ nền trên thiết bị di động, tự động đóng khi chọn menu hoặc bấm phím Escape.
  - **Footer kỹ thuật:** Hotline 1900 6868 (Nhánh 2), phiên bản V2.8.4-OPS, chứng chỉ ISO 27001.
- **Operational Top Header ([`MerchantHeader.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/layouts/merchant/MerchantHeader.tsx)):**
  - Bộ lọc chọn nhanh bãi đỗ (`Select`) hỗ trợ xem từng bãi hoặc toàn bộ mạng lưới.
  - Dải trạng thái thời gian thực `ALPR GATE 24/7 TRỰC TUYẾN`.
  - Nút hành động nhanh `Đăng Ký Bãi Mới` (`#d95f00`).
  - Chuông thông báo hiển thị badge đếm chưa đọc.
  - Thẻ định danh chủ bãi (`#MCH-88219`) và nút Đăng xuất an toàn.

---

### E. Admin Layout ([`src/layouts/AdminLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/layouts/AdminLayout.tsx))
- **Cơ chế cuộn trang:** Tích hợp [`ScrollToTop`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/ScrollToTop.tsx) để duyệt qua các danh sách dữ liệu kiểm toán, giao dịch không bị giữ vị trí cuộn cũ.
- **Sidebar cố định 64 (16rem):** Bổ sung đầy đủ 9 biểu tượng phân hệ quản trị cấp cao:
  - `Tổng quan` (`LayoutDashboard`), `Kiểm duyệt bãi` (`Warehouse`), `Người dùng` (`Users`), `Giao dịch` (`CreditCard`), `Duyệt rút tiền` (`ArrowDownToLine`), `Tranh chấp` (`Scale`), `Nhật ký kiểm toán` (`ScrollText`), `Thông báo` (`Bell`), `Hồ sơ quản trị` (`UserCheck`).
- **Căn lề Header đồng bộ:** Đã khắc phục lệch lề bằng việc áp dụng `lg:pl-64` khớp hoàn hảo với chiều rộng `w-64` của sidebar.
- **Breadcrumb động:** Hiển thị vị trí phân hệ hiện tại `ADMIN / {Phân hệ}`.
- **Đăng xuất an toàn:** Gọi `clearSession()` và chuyển hướng về `/login`.

---

### F. Shared / Baseline Layout ([`src/layouts/RootLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/layouts/RootLayout.tsx))
- **Cơ chế cuộn trang:** Tích hợp [`ScrollToTop`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/ScrollToTop.tsx).
- **Đồng bộ màu sắc nhận diện:** Thay toàn bộ màu xanh ngoại lai sang màu cam chuẩn `#d95f00`.
- **Điều hướng:** Thêm liên kết quay về trang chủ khách (`/`) và huy hiệu thông tin Kiến trúc 4 lớp.

---

### G. Cơ Chế Tự Động Cuộn Lên Đầu Trang Khi Chuyển Trang (Automatic Scroll-To-Top)
- **Vấn đề đã xử lý triệt để:** Trong các ứng dụng React Router (SPA), khi người dùng lướt xuống cuối trang A rồi bấm chuyển sang trang B, trình duyệt giữ nguyên vị trí cuộn `window.scrollY` ở đáy trang khiến người dùng phải tự lướt ngược lên đầu.
- **Giải pháp 2 tầng kiên cố (Double-Layer Scroll Restoration):**
  1. **Tầng Router Engine ([`src/app/router/index.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/app/router/index.tsx)):** Lắng nghe trực tiếp các sự kiện điều hướng `PUSH` / `REPLACE` từ `createBrowserRouter` qua `router.subscribe` và lập tức thiết lập `window.scrollTo(0, 0)` cùng `document.documentElement.scrollTop = 0`.
  2. **Tầng Component Lifecycle & Hook ([`ScrollToTop.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/ScrollToTop.tsx)):**
     - Đặt component `<ScrollToTop />` trong toàn bộ 6 layouts (`LandingLayout`, `DriverLayout`, `MerchantLayout`, `AdminLayout`, `AuthLayout`, `RootLayout`) và gọi hook `useScrollToTop()` trong `LandingNavbar` (hiện diện trên 100% trang công cộng).
     - Reset đa tầng: Reset đồng thời `window`, `document.documentElement`, `document.body` và vùng cuộn `<main id="main-content">`.
     - Hỗ trợ thông minh liên kết neo (Anchor Hash): Nếu URL có chứa `#hash` (ví dụ `/#faq`, `/#section`), tự động cuộn mượt mà `scrollIntoView({ behavior: 'smooth' })` đến phần tử đó; nếu không có neo hoặc neo không tồn tại, tự động nhảy về đầu trang `(0, 0)`.
- **Bộ kiểm thử tự động:** Tạo mới [`ScrollToTop.test.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/__tests__/ScrollToTop.test.tsx) với 6 kịch bản kiểm tra toàn diện, đạt 6/6 tests passed.

---

## 3. PHÂN QUYỀN VÀ BẢO VỆ ROUTE (ROLE-BASED GUARDS)

1. **Kiểm soát truy cập tập trung ([`RequireRole.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/auth/components/RequireRole.tsx)):**
   - **Chưa đăng nhập:** Tự động điều hướng đến `/login?next={current_url}`, bảo toàn nguyên vẹn tham số tìm kiếm và đường dẫn sâu (Deep Linking).
   - **Đăng nhập sai vai trò:** Điều hướng về trang lỗi phân quyền `/403` ([`AccessPage`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/auth/index.tsx#L284)).
   - **Đúng vai trò:** Render nội dung trang an toàn.
2. **Xử lý Route không tồn tại (Wildcard 404):**
   - Mọi đường dẫn lạ (`path: '*'`) được bắt và hiển thị giao diện 404 thân thiện, cung cấp nút "Về trang chủ" và "Đăng nhập".

---

## 4. KẾT QUẢ KIỂM THỬ VÀ ĐÓNG GÓI (VERIFICATION GATE)

Đã tạo mới bộ test suite kiểm tra toàn diện Layouts, Navigation và Scroll Restoration:
- [`src/layouts/__tests__/LayoutsAndNavigation.test.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/layouts/__tests__/LayoutsAndNavigation.test.tsx) (13 test cases)
- [`src/shared/components/__tests__/ScrollToTop.test.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/__tests__/ScrollToTop.test.tsx) (6 test cases)

### Kết quả chạy toàn bộ hệ thống:
- **Test files passed:** **49 / 49 (100% GREEN)**
- **Unit tests passed:** **391 / 391 (100% GREEN)**
- **TypeScript Typecheck (`tsc -b`):** **0 Errors**
- **Production Build (`npm run build`):** Biên dịch thành công trong **15.44s** (2.585 modules transformed, 0 errors).

---

## 5. TỔNG KẾT VÀ BƯỚC TIẾP THEO

Toàn bộ hệ thống Layouts, Navigation và Trải nghiệm cuộn trang hiện đã đạt chuẩn 100% về:
- Tự động lướt lên đầu trang (Scroll to Top) ngay tức thì trên mọi thao tác chuyển trang.
- Tính nhất quán hình ảnh và màu sắc thương hiệu (`#d95f00`, Sora & Inter).
- Khả năng tương thích trên thiết bị di động (Mobile Drawers, Backdrop, Escape key).
- Phân định ranh giới vai trò chặt chẽ (Role-Based Isolation).
- Trải nghiệm Header Landing Page tinh gọn, không còn hiện tượng menu nhảy hoặc quá tải thị giác.
