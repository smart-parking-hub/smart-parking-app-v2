# 36. Phân Rã Thành Phần Từng Màn Hình Nghiệp Vụ (Page Component Breakdown)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** ARCHITECTURE PLANNING ONLY (Tuân thủ PROJECT UNIFICATION MASTER RULES — **Không sửa code**)  
> **Thời điểm xác lập:** 07/11/2026  
> **Phạm vi phân rã:** Toàn bộ 56 màn hình canonical (SCR-01 đến SCR-56) thuộc 5 phân hệ  
> **Mục tiêu:** Bóc tách chi tiết từng thành phần từ Layout đến State của từng trang để xác định chính xác năng lực tái sử dụng  
> **Trạng thái:** DRAFT FOR ARCHITECTURAL APPROVAL

---

## 1. PHÂN HỆ TIẾP THỊ & CÔNG CỘNG (MARKETING MODULE: SCR-01 ĐẾN SCR-08)

### SCR-01: Trang Chủ Tiếp Thị (Home Landing Page — `/`)
* **Layout:** `PublicLayout` (Header trong suốt kính mờ + Footer Navy tối `#060d1a`).
* **Header / Navigation:** `LandingNavbar` (Logo SmartParkingHub, Menu liên kết, Nút Đăng nhập/Đăng ký).
* **Page Header:** `HomeHero` (Tiêu đề lớn `text-5xl font-heading`, mô tả giải pháp logistics).
* **Breadcrumb:** Không sử dụng (Trang chủ cấp 1).
* **Main Content Sections:**
  1. `HomeHeroSection`: Headline + Thanh tìm kiếm nhanh bãi đỗ xe theo tỉnh thành.
  2. `HomeFeatureGrid`: Lưới 3 cột tính năng (Đặt chỗ trước, Cổng ALPR tự động, Thanh toán PayOS).
  3. `HomeTestimonials`: Khối đánh giá của các hãng xe tải logistics (Cần sửa nút carousel theo Doc 18).
  4. `HomeCtaBanner`: Khung kêu gọi chủ bãi tham gia hợp tác mạng lưới.
* **Tables / Forms / Cards:** `ParkingLotPreviewCard`, `FeatureCard`.
* **Action Bar:** Nút "Tìm bãi đỗ ngay" (Primary Button) và "Trở thành đối tác bãi xe" (Secondary Button).
* **Modal / Drawer:** `QuickSearchModal` (khi click ô tìm kiếm trên Mobile).
* **States:** `LoadingSkeleton` khi tải danh sách bãi xe nổi bật; `ErrorAlert` nếu mất kết nối API.
* **Thành phần tái sử dụng được:** `Button`, `SearchField`, `Card`, `Badge`, `Skeleton`.

---

### SCR-03: Bảng Giá & So Sánh Dịch Vụ (Pricing Page — `/pricing`)
* **Layout:** `PublicLayout`.
* **Page Header:** Tiêu đề "Bảng Giá Dịch Vụ Thông Minh" + Nút gạt chuyển đổi chu kỳ (Tháng / Năm).
* **Breadcrumb:** `Trang chủ > Bảng giá`.
* **Main Content Sections:**
  1. `PricingCardsSection`: 3 thẻ gói dịch vụ (Tài xế cá nhân, Doanh nghiệp vận tải Fleet, Chủ bãi đỗ xe đối tác).
  2. `PricingFeatureMatrixTable`: Bảng so sánh chi tiết tính năng theo từng gói.
  3. `PricingFaqAccordion`: Danh sách câu hỏi thường gặp về thanh toán và hóa đơn VAT.
* **Tables / Forms / Cards:** `PricingCard` (thẻ nổi bật có viền cam), `FeatureComparisonTable`.
* **Action Bar:** Nút "Đăng ký gói này" (Primary/Outline Button) trên từng card.
* **States:** `Static Content`.
* **Thành phần tái sử dụng được:** `Button`, `Switch` (chọn tháng/năm), `Badge` ("Khuyên dùng"), `Card`.

---

## 2. PHÂN HỆ XÁC THỰC (AUTHENTICATION MODULE: SCR-09 ĐẾN SCR-16)

### SCR-09: Đăng Nhập Hệ Thống (Login Page — `/auth/login`)
* **Layout:** `AuthLayout` (Nền Navy `#060d1a` với hiệu ứng ánh sáng gradient nhẹ).
* **Header / Navigation:** Logo thương hiệu SmartParkingHub liên kết về `/`.
* **Page Header:** Tiêu đề "Đăng nhập tài khoản" + Phụ đề "Chọn vai trò: Tài xế hoặc Chủ bãi".
* **Breadcrumb:** Không sử dụng.
* **Main Content Box:** Hộp `max-w-md` căn giữa màn hình (`bg-white rounded-xl shadow-2xl p-8`).
* **Tables / Forms / Cards:**
  * Form đăng nhập: Ô nhập Email / Số điện thoại (`Input`), Ô nhập mật khẩu có nút hiện ẩn (`Input`).
  * Checkbox "Ghi nhớ đăng nhập" (`Checkbox`).
  * Liên kết "Quên mật khẩu?" (`Link text-brand-primary`).
* **Action Bar:** Nút "Đăng nhập ngay" (Primary Button `isFullWidth={true} isLoading={isSubmitting}`).
* **States:**
  * `ErrorState`: Alert đỏ thông báo "Sai tài khoản hoặc mật khẩu" gán `aria-live="polite"`.
  * `LoadingState`: Nút đăng nhập hiện Spinner xoay tròn và khóa thao tác click.
* **Thành phần tái sử dụng được:** `Input`, `Button`, `Checkbox`, `AlertBanner`.

---

## 3. PHÂN HỆ TÀI XẾ (DRIVER PORTAL: SCR-17 ĐẾN SCR-24)

### SCR-17: Bảng Điều Khiển Tài Xế (Driver Dashboard — `/driver/dashboard`)
* **Layout:** `DriverLayout` (Header trên cùng kèm chuông thông báo, menu tài xế + Canvas xám `#f8f9ff`).
* **Header / Navigation:** `DriverHeader` (Avatar, Tên tài xế, Biển số xe mặc định, Số dư ví nhanh).
* **Page Header:** Lời chào "Xin chào, Bác tài Nguyễn Văn A" + Nút "Tìm bãi đỗ mới" (Primary CTA).
* **Breadcrumb:** Không sử dụng (Trang chủ Driver cấp 1).
* **Main Content Sections (Bento Grid 3 Cột):**
  1. `ActiveBookingCard`: Thẻ xe đang đỗ trong bãi (hiển thị đồng hồ đếm giờ theo giây, biển số xe, mã QR ra cổng).
  2. `MetricBentoGroup`: 3 thẻ chỉ số (Số lượt đỗ tháng này, Tổng chi phí, Điểm thưởng tài xế).
  3. `RecentBookingsTable`: Danh sách 5 lượt đỗ xe gần nhất kèm trạng thái.
* **Tables / Forms / Cards:** `ActiveTripCard`, `MetricCard`, `DataTable` thu nhỏ.
* **Action Bar:** Nút "Mở Barie / Quét QR" (khi đang ở cổng bãi) và "Nạp tiền ví".
* **Modal / Drawer:** `QrCheckoutModal` (hiển thị mã QR để camera ALPR quét xác thực ra bãi).
* **States:**
  * `LoadingSkeleton`: `DashboardSkeleton` (đã chuẩn hóa, xóa bản sao thừa).
  * `EmptyState`: Khi chưa có cuốc xe nào ("Bạn chưa có chuyến đỗ nào hôm nay. Tìm bãi đỗ quanh đây").
* **Thành phần tái sử dụng được:** `Button`, `Badge`, `DataTable`, `BentoMetricCard`, `DialogBase`.

---

### SCR-20: Tìm Kiếm & Đặt Chỗ Bãi Xe (Parking Search — `/driver/parking-lots`)
* **Layout:** `DriverLayout`.
* **Page Header:** Tiêu đề "Tìm Bãi Đỗ Xe Tải & Container" + Bộ lọc số chỗ trống.
* **Breadcrumb:** `Trang chủ > Tìm bãi đỗ xe`.
* **Main Content Structure (Split View: Bản đồ + Danh sách):**
  * Nửa trái (45%): Danh sách thẻ bãi xe kết quả có phân trang.
  * Nửa phải (55%): Bản đồ tương tác định vị các bãi xe kèm chân giá tiền.
* **Filter Toolbar:** Ô tìm kiếm địa chỉ (`SearchField`) + Dropdown chọn loại xe tải (`Select`) + Tiện ích bãi xe (`Checkbox`).
* **Cards:** `ParkingLotCardItem` (ảnh bãi xe, tên bãi, khoảng cách km, số chỗ trống, đơn giá/giờ, badge tiện ích).
* **Action Bar:** Nút "Đặt chỗ ngay" trên từng thẻ bãi xe.
* **States:** `SearchSkeleton` khi gõ tìm kiếm; `EmptyState` khi không tìm thấy bãi xe nào trong bán kính 10km.
* **Thành phần tái sử dụng được:** `SearchField`, `Select`, `Card`, `Badge`, `Button`, `Pagination`.

---

### SCR-22: Quy Trình Đặt Chỗ 3 Bước (Booking Wizard — `/booking/:lotId`)
* **Layout:** `DriverLayout` (rút gọn không có sidebar).
* **Page Header:** Tiêu đề bãi xe + Đồng hồ cảnh báo giữ chỗ 10 phút (`font-mono text-amber-700`).
* **Breadcrumb:** `Trang chủ > Tìm bãi xe > Chi tiết bãi > Đặt chỗ`.
* **Main Content (Stepper Progress):**
  * `Bước 1: Chọn vị trí slot xe` (Lưới slot xe: Slot màu xám = đã có xe, Slot xanh lá = còn trống).
  * `Bước 2: Chọn xe tải trong đội xe` (Radio Group danh sách biển số xe kèm tải trọng).
  * `Bước 3: Tóm tắt chi phí & Thanh toán tiền cọc` (PayOS QR hoặc Trừ ví SmartTruck).
* **Tables / Forms / Cards:** `SlotGridPicker`, `VehicleSelectRadioCard`, `CostSummaryCard`.
* **Action Bar:** Footer cố định dưới đáy màn hình gồm nút "Quay lại bước trước" và "Xác nhận đặt chỗ".
* **Modal:** `CancelBookingConfirmModal` (cảnh báo hoàn cọc theo chính sách bãi).
* **States:** `TimerExpiredModal` khi hết 10 phút giữ chỗ.
* **Thành phần tái sử dụng được:** `RadioGroup`, `Badge`, `Button`, `DialogBase`, `Breadcrumb`.

---

## 4. PHÂN HỆ CHỦ BÃI XE (MERCHANT PORTAL: SCR-25 ĐẾN SCR-44)

### SCR-25: Trung Tâm Điều Hành Bãi Xe (Merchant Dashboard — `/merchant/dashboard`)
* **Layout:** `MerchantLayout` (Sidebar xanh đen Stitch `#0d1c2e` + Header thông báo + Canvas).
* **Header / Navigation:** `MerchantSidebar` (Menu đa cấp: Bãi xe, Giám sát, Doanh thu, Cài đặt).
* **Page Header:** Tiêu đề "Trung Tâm Điều Hành Bãi Đỗ" + Dropdown chọn bãi xe đang xem (`Select`).
* **Breadcrumb:** Không sử dụng.
* **Main Content (Bento Grid Vận Hành):**
  1. `LiveCapacityCard`: Vòng tròn tỷ lệ lấp đầy (ví dụ: `86/120 xe - 71.6%`).
  2. `AlprGateFeedCard`: Khung hình trực tiếp từ Camera nhận diện biển số cổng Vào và cổng Ra.
  3. `TodayRevenueCard`: Doanh thu thu hộ PayOS và tiền mặt trong ngày.
  4. `LiveActivityStream`: Dòng nhật ký xe ra vào theo thời gian thực (real-time stream).
* **Tables / Forms / Cards:** `AlprGateCard` (nền tối `#131b2e`), `MetricCard`, `ActivityRow`.
* **Action Bar:** Nút "Nâng barie thủ công" (Emergency Button) và "Xem tất cả camera".
* **Modal / Drawer:** `ManualGateTriggerModal` (xác nhận mở cổng khẩn cấp có ghi nhận lý do).
* **States:** `DashboardSkeleton` khi nạp; `AlertNotice` khi mất kết nối camera ALPR.
* **Thành phần tái sử dụng được:** `Badge`, `Button`, `Select`, `DialogBase`, `BentoMetricCard`.

---

### SCR-26: Quản Lý Danh Sách Bãi Xe (Merchant Lots — `/merchant/parking-lots`)
* **Layout:** `MerchantLayout`.
* **Page Header:** Tiêu đề "Danh Sách Bãi Đỗ Xe Đối Tác" + Nút "Thêm Bãi Xe Mới" (Primary Button).
* **Breadcrumb:** `Trang chủ > Quản lý bãi xe`.
* **Main Content Structure:**
  * Thanh công cụ lọc: Tìm kiếm theo tên bãi xe, Lọc theo trạng thái (Đang hoạt động, Chờ duyệt, Tạm đóng).
  * Lưới thẻ bãi xe (Grid View) hoặc Bảng danh mục (Table View).
* **Tables / Forms / Cards:** `OwnerLotCardItem` (ảnh bìa bãi, địa chỉ, tổng slot, doanh thu tháng, nút cấu hình).
* **Action Bar:** Menu tác vụ 3 chấm trên từng thẻ: "Chỉnh sửa", "Cấu hình biểu phí", "Bản đồ vị trí", "Tạm dừng đón khách".
* **Modal:** `ConfirmDeactivateModal` (xác nhận tạm đóng bãi xe).
* **States:** `EmptyState` khi chưa có bãi xe nào ("Bạn chưa đăng ký bãi xe nào. Tạo bãi xe đầu tiên ngay").
* **Thành phần tái sử dụng được:** `Button`, `SearchField`, `Select`, `Card`, `Badge`, `EmptyState`, `Breadcrumb`.

---

### SCR-27: Wizard Đăng Ký Bãi Xe Mới (Create Lot Wizard — `/merchant/parking-lots/new`)
* **Layout:** `MerchantLayout`.
* **Page Header:** Tiêu đề "Đăng Ký Bãi Đỗ Xe Mới" + Nút "Lưu bản nháp".
* **Breadcrumb:** `Trang chủ > Quản lý bãi xe > Tạo bãi xe mới`.
* **Main Content (Form Container `max-w-3xl`):**
  * `Bước 1: Thông tin cơ bản & Mô tả AI`: Nhập tên bãi xe, địa chỉ, số điện thoại hotline, tích hợp nút *"Sinh mô tả bằng AI ✨"* (gọi `POST /api/v1/ai/generate-description`).
  * `Bước 2: Sức chứa & Loại xe hỗ trợ`: Khai báo số chỗ xe tải nặng, container 40ft, xe van (`Input number`).
  * `Bước 3: Tải ảnh bãi & Giấy phép PCCC`: Tải lên ảnh thực tế cổng vào và sơ đồ phân luồng.
* **Tables / Forms / Cards:** Form Sections, `ImageUploaderBox`.
* **Action Bar:** Nút "Quay lại" và "Tiếp tục / Gửi duyệt".
* **States:** `SavingState` hiển thị thanh tiến trình khi upload ảnh độ phân giải cao.
* **Thành phần tái sử dụng được:** `Input`, `Button`, `Checkbox`, `Breadcrumb`, `Toast`.

---

## 5. PHÂN HỆ QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN MODULE: SCR-45 ĐẾN SCR-52)

### SCR-46: Hàng Đợi Duyệt Bãi Đỗ Xe (Lot Approval Queue — `/admin/parking-lots/approvals`)
* **Layout:** `AdminLayout` (Sidebar quản trị chuyên sâu + Header đối soát).
* **Page Header:** Tiêu đề "Hàng Đợi Phê Duyệt Bãi Xe Đối Tác" + Badge số lượng chờ duyệt ("14 bãi xe mới").
* **Breadcrumb:** `Bảng điều khiển > Phê duyệt bãi xe`.
* **Main Content (Quản trị dữ liệu lớn):**
  * Thanh tìm kiếm và bộ lọc tỉnh thành.
  * Bảng dữ liệu `DataTable`: Tên bãi xe, Chủ sở hữu, Địa chỉ, Số slot, Ngày nộp hồ sơ, Trạng thái hồ sơ.
* **Tables / Forms / Cards:** `DataTable` hỗ trợ sắp xếp cột ngày nộp và lọc nhanh.
* **Action Bar:** Nút "Xem hồ sơ chi tiết", "Phê duyệt" (Success Button), "Yêu cầu bổ sung thông tin" (kích hoạt `PUT /api/v1/admin/parking-lots/{id}/request-changes`).
* **Modal / Drawer:** `RequestChangesModal` (nhập nội dung yêu cầu chủ bãi bổ sung giấy tờ).
* **States:** `DataTableLoadingSkeleton`, `EmptyState` ("Không có bãi xe nào đang chờ duyệt").
* **Thành phần tái sử dụng được:** `DataTable`, `Button`, `Badge`, `Pagination`, `DialogBase`, `Breadcrumb`.

---

## 6. BẢNG TỔNG HỢP NĂNG LỰC TÁI SỬ DỤNG THEO PHÂN HỆ

| Phân Hệ Nghiệp Vụ | Số Màn Hình | Tỷ Lệ Tái Sử Dụng UI Primitives (L2) | Tỷ Lệ Tái Sử Dụng UI Patterns (L4) | Thành Phần Riêng Biệt (Domain L6) |
| :--- | :---: | :---: | :---: | :--- |
| **Marketing (SCR-01 - 08)** | 8 | 90% (`Button`, `Card`, `Badge`) | 60% (`Accordion`, `GridSection`) | `HomeHeroSection`, `PricingMatrixTable` |
| **Authentication (SCR-09 - 16)**| 8 | 95% (`Input`, `Button`, `Checkbox`) | 80% (`AlertBanner`, `CenterCard`) | Form xác thực OTP 6 số |
| **Driver Portal (SCR-17 - 24)** | 8 | 95% (`Button`, `Badge`, `Input`) | 85% (`DataTable`, `BentoGrid`, `Drawer`) | `SlotPickerGrid`, `ActiveTripCard`, `QrCode` |
| **Merchant Portal (SCR-25 - 44)**| 20 | 90% (`Button`, `Input`, `Select`) | 90% (`DataTable`, `DialogBase`, `Filter`) | `AlprGateFeedCard`, `TariffMatrixEditor` |
| **Admin System (SCR-45 - 52)** | 8 | 95% (`Button`, `Badge`, `Select`) | 95% (`DataTable`, `Pagination`, `Dialog`) | `SystemHealthGaugeCard`, `AuditLogViewer` |
| **Checkout/Error (SCR-53 - 56)** | 4 | 85% (`Button`, `Card`, `Timer`) | 70% (`DialogBase`, `Alert`) | `PayOsQrCodeEmbed`, `CountDownTimer` |

---
*Tài liệu đã được xác lập và sẵn sàng đệ trình kiểm duyệt kiến trúc.*
