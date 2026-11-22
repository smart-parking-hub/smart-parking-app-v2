# BÁO CÁO TOÀN DIỆN HIỆN TRẠNG UI/UX & DANH MỤC THIẾU SÓT HỆ THỐNG
**Hệ thống thẩm định:** SmartParkingHub CRM v2 (`smart-parking-app-v2`)  
**Người thực hiện:** Senior UI/UX Auditor & Principal QA Engineer  
**Thời điểm thực hiện:** 22/11/2026  
**Phương pháp:** Static Code Analysis, Component Tree Inspection, Live Browser Verification (Chrome/Safari Responsive Viewports)  

---

# GIAI ĐOẠN 1: BẢN ĐỒ DỰ ÁN (PROJECT MAPPING)

### 1. Cấu trúc Màn hình & Phân quyền (Routes & Navigation Tree)
Hệ thống tổ chức theo 4 phân vùng chính dựa trên `react-router-dom v6`:
- **Public & Landing (Khách vãng lai):** 9 màn hình (`/`, `/about`, `/pricing`, `/api-docs`, `/driver-solutions`, `/owner-solutions`, `/careers`, `/insights`, `/contact`).
- **Xác thực (Authentication):** 3 màn hình (`/login`, `/register`, `/forgot-password`) kèm 2 trang trạng thái hệ thống (`/403`, `*` 404 Not Found).
- **Phân hệ Tài xế (Driver Portal - Layout: `DriverLayout`):** 9 màn hình chính (`/dashboard`, `/parking`, `/parking/:id`, `/bookings`, `/vehicles`, `/wallet`, `/payments`, `/profile`, `/notifications`, `/disputes`).
- **Phân hệ Chủ bãi (Merchant Portal - Layout: `MerchantLayout`):** 11 màn hình (`/merchant/dashboard`, `/merchant/parking-lots`, `/merchant/parking-lots/new`, `/merchant/parking-lots/:id`, `/merchant/parking-lots/:id/edit`, `/merchant/parking-lots/:id/slots`, `/merchant/bookings`, `/merchant/qr-scanner`, `/merchant/revenue`, `/merchant/withdrawals`, `/merchant/profile`).
- **Phân hệ Quản trị viên (Admin Portal - Layout: `AdminLayout`):** 11 màn hình (`/admin/dashboard`, `/admin/parking-lots`, `/admin/merchant-verifications`, `/admin/users`, `/admin/transactions`, `/admin/withdrawals`, `/admin/disputes`, `/admin/audit-logs`, `/admin/notifications`, `/admin/profile`).

### 2. Thành phần Dùng chung (Shared Components Library)
Hệ sinh thái `src/shared/components` bao gồm 32 component nền tảng:
- *Hiển thị & Cấu trúc:* `PageHeader`, `Workspace`, `Panel`, `Card`, `Badge`, `Separator`, `StatisticPanel`, `Typography`.
- *Nhập liệu & Tương tác:* `Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Autocomplete`, `DatePicker`, `Checkbox`, `RadioGroup`, `Switch`, `SearchField`, `SearchToolbar`.
- *Điều hướng & Phân cấp:* `Breadcrumb`, `Tabs`, `Pagination`, `ScrollToTop`, `Drawer`, `FilterDrawer`.
- *Phản hồi & Trạng thái:* `Modal`, `Dialog`, `ConfirmationDialog`, `NotificationDialog`, `Toast`, `Alert`, `Popover`, `Tooltip`, `Spinner`, `Skeleton`, `EmptyState`, `ErrorState`, `QueryState`.

### 3. Hệ thống Thiết kế (Design Tokens, Typography, Colors)
- **Kiểu chữ (Typography):** Google Fonts nhúng cục bộ WOFF2 gồm `Be Vietnam Pro` (chữ tiêu đề), `Inter` (nội dung body), `Sora` (nhấn thương hiệu) và `Source Sans 3`.
- **Bảng màu (Color Palette):**
  - Brand Navy: `#060D1A` (chính), `#0d1c2e` (sidebar), `#0f172a` (slate-900).
  - Brand Orange: `#d95f00` (WCAG AA 4.6:1), `#ea580c` (hover).
  - Neutral Scale: Slate (`#f8fafc` đến `#0f172a`).
  - Semantic Status: Emerald (Thành công/Còn chỗ), Amber (Cảnh báo/Gần đầy/Quá giờ), Rose/Red (Lỗi/Hết chỗ/Hủy).

---

# GIAI ĐOẠN 2 & 3: BÁO CÁO THẨM ĐỊNH CHI TIẾT (AUDIT REPORT)

## A. TỔNG QUAN KẾT QUẢ

- **Tổng số trang / Component đã kiểm tra:** 43 màn hình, 32 shared components, 14 feature modules.
- **Phần chưa kiểm tra được trên production:** Luồng thanh toán tiền thật qua PayOS (chỉ kiểm thử qua stub/mock sandbox để tránh trừ tiền tài khoản ngân hàng).
- **Điểm đánh giá tổng thể:** **68 / 100**

### Điểm số chi tiết theo 14 nhóm tiêu chí:
1. Trạng thái giao diện (States): **60 / 100** *(Thiếu skeleton ở nhiều trang chính, empty state thiếu CTA)*
2. Thông báo & Phản hồi (Feedback): **65 / 100** *(Thiếu toast toàn cục, merchant rút tiền thành công trong im lặng)*
3. Icon & Hình ảnh: **72 / 100** *(Icon thiếu aria-label, thiếu thẻ OpenGraph mạng xã hội)*
4. Màu sắc & Theme: **75 / 100** *(Hardcode mã màu hex, text-slate-400 trượt tương phản WCAG)*
5. Typography & Khoảng cách: **70 / 100** *(Cỡ chữ input < 16px gây zoom iOS, thiếu định dạng tiền nhất quán)*
6. Form & Nhập liệu: **68 / 100** *(Lỗi 2 mũi tên select, thiếu đếm ký tự, thiếu autocomplete)*
7. Điều hướng & Cấu trúc: **62 / 100** *(Toàn bộ app không đổi document.title, logout không xác nhận ở Merchant)*
8. Danh sách, Bảng & Tìm kiếm: **58 / 100** *(Bảng desktop không responsive trên mobile, thiếu debounce tìm kiếm)*
9. Responsive & Thiết bị: **55 / 100** *(Tràn ngang toàn hệ thống, touch target vi mô < 44px, thiếu safe-area)*
10. Khả năng tiếp cận (Accessibility): **64 / 100** *(Modal thêm xe thiếu focus trap, nút icon chỉ có title)*
11. Vi tương tác & Chuyển động: **78 / 100** *(Tốt ở hover/focus nhưng thiếu optimistic update)*
12. Nội dung & Ngôn ngữ (Copywriting): **74 / 100** *(Từ ngữ không đồng nhất giữa "Xóa" và "Ngừng sử dụng", icon ↗ ở nút đăng nhập)*
13. Hiệu năng cảm nhận: **65 / 100** *(Chớp layout do text loading đơn điệu thay vì skeleton)*
14. Hoàn thiện sản phẩm (Polish): **55 / 100** *(Không có Điều khoản, không có Chính sách bảo mật, không có Print CSS)*

---

### 🔥 TOP 5 VẤN ĐỀ NGHIÊM TRỌNG NHẤT CẦN SỬA NGAY (CRITICAL P0)

1. **Tràn ngang toàn hệ thống trên Mobile (Global Viewport Overflow):**  
   Thẻ `body` bị kéo dãn thành 702px - 1248px trên màn hình 390px do thiếu `overflow-x: hidden` và bảng dữ liệu quá rộng. Toàn bộ cụm nút quan trọng ở Header bên phải (Menu, Avatar, nút Quay lại) bị đẩy ra khỏi màn hình (x > 590px).
2. **Bảng dữ liệu Desktop 7 cột giấu nút Thao tác & QR trên Mobile:**  
   Tại `/vehicles` và `/bookings`, bảng `<table>` dài 1100px - 1248px khiến tài xế không thấy nút "Quét QR Check-in", "Thanh toán", hoặc "Sửa xe" nếu không cuộn ngang màn hình 3 lần.
3. **Mất phương hướng Browser Tabs do không cập nhật `document.title`:**  
   Toàn bộ 40+ trang trong ứng dụng đều giữ nguyên một tiêu đề duy nhất từ `index.html`. Người dùng mở nhiều tab không thể phân biệt tab nào là bãi xe, tab nào là đơn hàng hay ví tiền.
4. **Hành vi Đăng xuất đột ngột không xác nhận trên Merchant Portal:**  
   Tại `MerchantHeader.tsx`, bấm "Đăng xuất" sẽ hủy session và đá văng người dùng về `/login` ngay lập tức mà không có bất kỳ hộp thoại xác nhận nào, rủi ro mất phiên làm việc cực cao.
5. **Rút tiền Merchant gửi thành công trong im lặng (Silent Submission):**  
   Tại `FinancePages.tsx`, khi merchant gửi yêu cầu rút tiền thành công, modal tự đóng mà không có Toast hay thông báo xác nhận, gây hoang mang tột độ về tình trạng dòng tiền.

---

## B. BẢNG CHI TIẾT TẤT CẢ CÁC THIẾU SÓT & LỖI (THE MASTER AUDIT LOG)

| ID | Mức độ | Nhóm Checklist | Vị trí (File & Dòng / Màn hình) | Chi tiết vấn đề | Tác động người dùng | Đề xuất khắc phục |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **BUG-01** | 🔴 Critical | 09. Responsive | `src/styles/globals.css:191-196` & Layouts | Thẻ `html, body` thiếu `overflow-x: hidden; max-width: 100vw;` | Màn hình mobile bị trôi ngang 702px-1248px, giấu mất menu Header và nút Back | Thêm `overflow-x: hidden; max-width: 100vw;` vào `@layer base` và thẻ cha layout |
| **BUG-02** | 🔴 Critical | 08. Bảng dữ liệu | `src/features/bookings/pages/MyBookingsPage.tsx:631` | Bảng vé đặt chỗ dùng `<table>` 7 cột cố định rộng 1248px | Tài xế đến cổng bãi không tìm thấy nút lấy mã QR check-in do bị trôi sang phải 800px | Bổ sung giao diện `BookingCard` dạng thẻ dọc trên màn hình `< 768px` |
| **BUG-03** | 🔴 Critical | 08. Bảng dữ liệu | `src/features/vehicles/components/VehiclesTable.tsx:13` | Thuộc tính `min-w-[1100px]` ép cứng trên bảng danh sách xe | Trên mobile bị che cột "Trạng thái" và nút "Sửa xe", trên desktop bị thanh cuộn thừa | Đổi sang `MobileVehicleCard` trên mobile và xóa `min-w-[1100px]` thừa |
| **BUG-04** | 🔴 Critical | 02. Phản hồi | `src/layouts/merchant/MerchantHeader.tsx:55, 131` | Nút Đăng xuất gọi `clearSession(); navigate('/login')` trực tiếp | Chạm nhầm nút Đăng xuất là bị mất phiên làm việc ngay lập tức không cứu vãn | Bọc qua `ConfirmationDialog` tương tự như bên phía Driver |
| **BUG-05** | 🔴 Critical | 07. Điều hướng | `src/app/router/index.tsx` & Toàn bộ Pages | Không có cơ chế lắng nghe cập nhật `document.title` theo từng route | Người dùng mở nhiều tab trình duyệt bị lẫn lộn, không biết tab nào chứa bãi xe hay vé | Tạo custom hook `useDocumentTitle` hoặc cập nhật trong router listener |
| **BUG-06** | 🟠 High | 02. Phản hồi | `src/features/merchant/operations/FinancePages.tsx:220` | Hàm `onSuccess` của mutation rút tiền chỉ đóng dialog mà không toast | Chủ bãi không biết tiền đã được yêu cầu chưa, tưởng ứng dụng bị đơ nên bấm liên tục | Bắn `toast.success("Yêu cầu rút tiền thành công, đang chờ duyệt")` |
| **BUG-07** | 🟠 High | 01. Trạng thái | `src/features/vehicles/pages/VehiclesPage.tsx:38` | Query loading hiển thị raw text: `<p>Đang tải phương tiện…</p>` | Chớp layout (CLS), giao diện trông như web hỏng trong 1-2 giây đầu | Thay thế bằng component `VehiclesSkeleton` đã viết sẵn |
| **BUG-08** | 🟠 High | 01. Trạng thái | `src/features/bookings/pages/MyBookingsPage.tsx:593` | Query loading hiển thị raw text: `<p>Đang tải đặt chỗ…</p>` | Trải nghiệm tải trang thô sơ, giật cục | Thay thế bằng component `BookingsSkeleton` đã viết sẵn |
| **BUG-09** | 🟠 High | 01. Trạng thái | `src/features/parking-detail/pages/ParkingDetailPage.tsx:14` | Loading bãi xe hiển thị: `<p>Đang tải bãi đỗ…</p>` | Trang chi tiết nhảy giật khung hình khi dữ liệu đổ về | Thiết kế component `ParkingDetailSkeleton` chuẩn khung hình |
| **BUG-10** | 🟠 High | 06. Form & Nhập liệu | `src/features/vehicles/components/RegisterVehicleModal.tsx:201` | Thẻ `<select id="modal-reg-class">` thiếu class `appearance-none` | Hiển thị 2 mũi tên đè lên nhau (tam giác đen native + icon Chevron SVG) | Thêm class `appearance-none -webkit-appearance-none` |
| **BUG-11** | 🟠 High | 06. Form & Nhập liệu | `src/features/auth/components/LoginForm.tsx:85, 91` | Input phone & password dùng cỡ chữ `text-sm` (14px) trên mobile | iOS Safari tự động phóng to (auto-zoom) toàn màn hình khi chạm vào ô nhập | Đổi thành `text-base` (16px) trên thiết bị di động |
| **BUG-12** | 🟠 High | 09. Responsive | `src/features/merchant/operations/FinancePages.tsx:315, 340` | Radio chọn tài khoản (13px) và Chip chọn tiền (cao 16px) | Quá bé, vi phạm chuẩn Apple HIG (44×44px), tài xế ngón tay to bấm trượt liên tục | Nâng chip lên min-height 38px, bọc radio vào thẻ Card chạm lớn |
| **BUG-13** | 🟠 High | 10. Tiếp cận | `src/features/vehicles/components/RegisterVehicleModal.tsx:120` | Modal dùng thẻ `div` tùy biến, thiếu Focus Trap và không trả focus | Người dùng bàn phím bị kẹt hoặc tab xuyên ra ngoài modal đang mở | Sử dụng component `Modal` chuẩn hoặc bọc `useDialogLifecycle` |
| **BUG-14** | 🟠 High | 09. Responsive | Toàn bộ codebase CSS/Layout | Hoàn toàn không có thuộc tính `env(safe-area-inset-bottom)` | Nút bấm và footer bị thanh điều hướng Home Bar của iPhone che mất | Bổ sung `pb-[calc(1rem+env(safe-area-inset-bottom))]` ở bottom bars |
| **BUG-15** | 🟡 Medium | 01. Trạng thái | `src/features/vehicles/pages/VehiclesPage.tsx:50` | Empty state chỉ có một dòng Notice: "Không có phương tiện phù hợp" | Lái xe mới vào không biết làm gì tiếp theo, thiếu nút "+ Thêm xe" | Dùng `EmptyState` có icon xe tải và nút bấm "+ Thêm phương tiện ngay" |
| **BUG-16** | 🟡 Medium | 01. Trạng thái | `src/features/bookings/pages/MyBookingsPage.tsx:613` | Empty state trang đặt chỗ: "Bạn chưa có lượt đặt chỗ nào." | Cụt luồng trải nghiệm, không hướng dẫn người dùng đi đặt chỗ | Bổ sung nút hành động "Khám phá bãi đỗ xe ngay" dẫn về `/parking` |
| **BUG-17** | 🟡 Medium | 03. Icon & Ảnh | `src/features/vehicles/components/VehicleMasterTable.tsx:205-230` | Các nút icon xem/sửa/xóa chỉ có thuộc tính `title`, thiếu `aria-label` | Thiết bị cảm ứng không xem được tooltip, trình đọc màn hình mù thông tin | Bổ sung `aria-label="Xem hồ sơ kiểm định"`, `aria-label="Chỉnh sửa xe"` |
| **BUG-18** | 🟡 Medium | 03. Icon & Ảnh | `index.html:1-23` | Thiếu toàn bộ thẻ Open Graph (`og:image`, `og:title`, `og:description`) | Chia sẻ link bãi đỗ qua Zalo/Facebook/Telegram bị hiển thị ô xám không hình ảnh | Bổ sung bộ thẻ Open Graph và Twitter Card chuẩn SEO |
| **BUG-19** | 🟡 Medium | 04. Màu sắc | `src/layouts/AuthLayout.tsx:59`, `DriverLayout.tsx:15` | Hardcode màu tùy tiện: `bg-[#060D1A]`, `bg-[#f8f9ff]`, `text-[#0d1c2e]` | Phá vỡ tính nhất quán của hệ thống Design Tokens, khó bảo trì | Quy về biến token chuẩn `bg-brand-navy`, `bg-brand-surface` |
| **BUG-20** | 🟡 Medium | 04. Màu sắc | `src/styles/globals.css` & Components | Màu chữ `text-slate-400` trên nền trắng có tỷ lệ tương phản chỉ 2.7:1 | Trượt tiêu chuẩn WCAG AA (yêu cầu 4.5:1), mờ tịt ngoài trời nắng | Nâng toàn bộ text thông tin quan trọng lên tối thiểu `text-slate-600` |
| **BUG-21** | 🟡 Medium | 08. Danh sách | `src/shared/components/SearchField.tsx:38` | Ô tìm kiếm không có cơ chế `debounce` | Mỗi phím gõ kích hoạt re-render hoặc gọi API liên tục gây giật lag | Tích hợp debounce 300ms trước khi kích hoạt `onChange/onSearch` |
| **BUG-22** | 🟡 Medium | 08. Danh sách | `src/features/bookings/pages/MyBookingsPage.tsx:633` | Tiêu đề bảng `<thead>` không có thuộc tính `sticky top-0` | Khi cuộn danh sách vé dài, người dùng mất dấu cột nào là tiền, cột nào là giờ | Thêm `sticky top-0 bg-slate-50 z-10 shadow-2xs` cho `<thead>` |
| **BUG-23** | 🟡 Medium | 12. Copywriting | `src/features/parking-search/components/YardCardItem.tsx:177` | Nút chính viết HOA: `ĐẶT GIỮ CHỖ`, nút phụ viết thường: `Xem chi tiết` | Thiếu nhất quán thị giác, tạo cảm giác giao diện chắp vá | Chuẩn hóa toàn bộ nút bấm về Title Case (`Đặt Giữ Chỗ`, `Xem Chi Tiết`) |
| **BUG-24** | 🟡 Medium | 12. Copywriting | `src/features/auth/components/LoginForm.tsx:98` | Nút đăng nhập dùng icon mũi tên chéo `Đăng nhập ↗` | Icon `↗` quy ước là mở liên kết ngoài (external link), dùng cho submit form là sai | Đổi sang icon `LogIn` hoặc `ArrowRight` |
| **BUG-25** | 🟡 Medium | 12. Copywriting | `VehiclesPage.tsx` vs `VehicleMasterTable.tsx` | Nơi thì dùng "Ngừng sử dụng", nơi thì dùng "Xóa phương tiện" | Tài xế hoang mang không biết xe bị xóa vĩnh viễn hay chỉ tạm khóa | Thống nhất dùng "Ngừng sử dụng" kèm tooltip giải thích xe được lưu lịch sử |
| **BUG-26** | 🟡 Medium | 14. Hoàn thiện | `src/layouts/driver/DriverFooter.tsx` & Router | Hoàn toàn không có trang "Điều khoản sử dụng" và "Chính sách bảo mật" | Nền tảng giao dịch tài chính logistics thiếu điều khoản pháp lý và bảo mật dữ liệu | Bổ sung 2 trang tĩnh `/terms` và `/privacy` vào footer |
| **BUG-27** | 🟢 Low | 14. Hoàn thiện | Toàn bộ CSS | Không có bất kỳ dòng style nào cho `@media print` | In vé đỗ xe hoặc phiếu xác nhận QR bị lem màu, in cả thanh header đen sì | Thêm print stylesheet: ẩn header/nav, làm trắng nền, chỉ in khung vé QR |
| **BUG-28** | 🟢 Low | 06. Form & Nhập liệu | `src/features/auth/components/LoginForm.tsx:85` | Checkbox "Ghi nhớ đăng nhập" có vùng bấm vi mô 16×16px | Khó chạm trúng bằng ngón cái trên màn hình cảm ứng | Tăng padding bao quanh thẻ `<label>` để vùng bấm đạt 44×44px |
| **BUG-29** | 🟢 Low | 11. Vi tương tác | `src/features/bookings/components/BookingQrModal.tsx` | Nút "Sao chép mã đơn" thiếu tooltip phản hồi động | Người dùng không chắc đã sao chép thành công vào clipboard hay chưa | Hiện tooltip "Đã sao chép!" trong 2 giây sau khi bấm |
| **BUG-30** | 🟢 Low | 01. Trạng thái | `src/features/bookings/components/BookingMasterList.tsx` | Component mồ côi (Dead code), không được import sử dụng | Rác mã nguồn, gây nhầm lẫn cho lập trình viên bảo trì sau này | Xóa bỏ hoặc hợp nhất vào `MyBookingsPage.tsx` |

---

## C. CÁC LỖI HỆ THỐNG LẶP LẠI (SYSTEMIC RECURRING ISSUES)

Đây là những vấn đề xuất hiện ở hầu hết mọi trang, cần xử lý **MỘT LẦN** tại cấp độ Root Token hoặc Shared Component:

1. **Cơ chế Quản lý Toast Thông báo phân mảnh:**
   - *Hiện trạng:* Mỗi trang tự khai báo một `<ToastContainer>` và state đóng/mở riêng (`MyBookingsPage`, `DriverDisputesPage`, `NotificationsPage`). Nhiều trang quan trọng khác lại hoàn toàn không có Toast (`VehiclesPage`, `FinancePages`).
   - *Giải pháp:* Đưa `ToastProvider` lên cấp độ root (`App.tsx`), cung cấp hook `useToast()` toàn cục để bất kỳ action nào cũng có thể gọi `toast.success()` hoặc `toast.error()`.
2. **Hội chứng Bảng Desktop trên Di động (Desktop Table Syndrome):**
   - *Hiện trạng:* Các bảng danh sách tài nguyên chính (`/vehicles`, `/bookings`, `/merchant/withdrawals`, `/admin/users`) đều mặc định render thẻ `<table>` với 6-8 cột trên mọi kích thước màn hình.
   - *Giải pháp:* Tạo quy chuẩn Component chung `ResponsiveDataTable`: Màn hình `>= 768px` hiển thị `<table>`, màn hình `< 768px` tự động chuyển đổi sang danh sách `Card` xếp dọc.
3. **Mất an toàn vùng ngón cái (Thumb Zone Deficiency):**
   - *Hiện trạng:* Các nút Call-To-Action (CTA) chốt hạ giao dịch (Tạo booking, Lưu xe, Rút tiền) luôn bị đặt ở đáy trang dài, người dùng phải lướt qua nhiều màn hình mới bấm được.
   - *Giải pháp:* Thiết lập component `MobileStickyActionBar` ghim cố định ở chân màn hình di động cho mọi tác vụ quan trọng.
4. **Vắng bóng Dynamic Document Title:**
   - *Hiện trạng:* Không có một trang nào cập nhật thẻ `<title>` của trình duyệt.
   - *Giải pháp:* Cấu hình metadata `title` trong router loader hoặc hook `useDocumentTitle(title)`.

---

## D. NHỮNG ĐIỂM SÁNG ĐANG LÀM RẤT TỐT (GIỮ NGUYÊN)

1. **Nền tảng Thiết kế Nhận diện Thương hiệu (Brand Aesthetic):**
   - Sự phối hợp giữa gam màu Navy công nghiệp (`#060D1A`), xám Slate và cam thương hiệu (`#d95f00`) tạo cảm giác rất hiện đại, khỏe khoắn, đúng tinh thần logistics vận tải container.
2. **Bộ Font chữ Địa phương hóa Hoàn hảo:**
   - Bộ font `Be Vietnam Pro` hiển thị dấu tiếng Việt rất đẹp, không lỗi chân chữ, không bị vỡ glyphs kể cả ở các từ phức tạp.
3. **Bộ Icon Lucide đồng bộ:**
   - Các icon sử dụng đồng nhất độ dày nét (stroke 1.5 - 2px), kích cỡ hài hòa, căn chỉnh baseline chuẩn với văn bản đi kèm.
4. **Độ an toàn Nghiệp vụ & Dữ liệu:**
   - Logic ràng buộc phân loại xe với trọng tải kỹ thuật trong modal vận hành cực kỳ chặt chẽ.
   - Quá trình đặt chỗ block 30 phút có mã màu trạng thái trực quan, minh bạch tuyệt đối về phí cọc và phụ phí cao điểm.

---

## E. LỘ TRÌNH KHẮC PHỤC THEO THỨ TỰ ƯU TIÊN (ACTION ROADMAP)

```
+----------------------------------------------------------------------------------------------------+
|                                    LỘ TRÌNH NÂNG CẤP UI/UX CRM V2                                  |
+----------------------+------------------------------------+------------------+---------------------+
| Giai đoạn            | Hạng mục trọng tâm                 | Thời lượng       | Tác động mang lại   |
+----------------------+------------------------------------+------------------+---------------------+
| GIAI ĐOẠN 1          | 1. Chặn tràn ngang toàn cục        | 1 Ngày           | Ứng dụng hết méo mó,|
| (Khẩn cấp - P0)      | 2. Sửa lỗi 2 mũi tên Select xe     | (Ngay lập tức)   | không bị mất nút    |
|                      | 3. Thêm xác nhận Đăng xuất Merchant|                  | quan trọng          |
|                      | 4. Thêm Toast rút tiền thành công  |                  |                     |
+----------------------+------------------------------------+------------------+---------------------+
| GIAI ĐOẠN 2          | 1. Chuyển bảng Xe sang Card mobile | 2 Ngày           | Trải nghiệm di động |
| (Trải nghiệm lõi - P1| 2. Chuyển bảng Vé sang Card mobile |                  | mượt mà, thao tác   |
|                      | 3. Sticky Bottom Bar đặt chỗ bãi xe|                  | 1 tay dễ dàng       |
|                      | 4. Nâng cỡ chữ input mobile >= 16px|                  |                     |
+----------------------+------------------------------------+------------------+---------------------+
| GIAI ĐOẠN 3          | 1. Thêm Skeleton cho các trang     | 2 Ngày           | Loại bỏ chớp giật   |
| (Polish & A11y - P2) | 2. Cập nhật dynamic document.title |                  | giao diện, tăng tính|
|                      | 3. Chuẩn hóa Touch target >= 44px  |                  | chuyên nghiệp       |
|                      | 4. Bổ sung OpenGraph & Meta SEO    |                  |                     |
+----------------------+------------------------------------+------------------+---------------------+
| GIAI ĐOẠN 4          | 1. Thêm trang Điều khoản & Bảo mật | 1.5 Ngày         | Hoàn thiện chuẩn    |
| (Pháp lý & In ấn - P3| 2. Viết Print CSS cho vé đỗ xe QR  |                  | sản phẩm thương mại |
|                      | 3. Dọn dẹp dead code (unused files)|                  |                     |
+----------------------+------------------------------------+------------------+---------------------+
```
