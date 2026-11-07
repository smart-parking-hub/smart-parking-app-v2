# 13. Dữ Liệu Đầu Vào Cho Prompt 07 (Prompt 07 Execution Inputs)

> **Dự án**: Smart Parking Hub — Frontend App (`smart-parking-app-v2`)  
> **Giai đoạn**: PROMPT 07 EXECUTION TEMPLATES & REUSABLE INPUT BLOCKS (PLANNING ONLY)  
> **Ngày lập**: 06/11/2026 · **Trạng thái**: SẴN SÀNG COPY TRỰC TIẾP VÀO PROMPT 07  
> **Mục tiêu**: Cung cấp cấu trúc dữ liệu đầu vào chuẩn xác 100% cho từng nhóm màn hình để người vận hành hoặc Agent chỉ cần copy-paste trực tiếp mà không phải tra cứu lại route hay Issue ID.

---

## MỤC LỤC
1. [Hướng Dẫn Sử Dụng Với Prompt 07](#1-hướng-dẫn-sử-dụng-với-prompt-07)
2. [Khối Dữ Liệu Prompt 07 Cho 15 Nhóm Triển Khai](#2-khối-dữ-liệu-prompt-07-cho-15-nhóm-triển-khai)
   - [GROUP 00: Shared Design System & Core Primitives (ĐÃ HOÀN THÀNH)](#group-00-shared-design-system--core-primitives)
   - [GROUP 01: Driver Booking Core & Operations Desk (ĐÃ HOÀN THÀNH)](#group-01-driver-booking-core--operations-desk)
   - [GROUP 02: Merchant Finance & Wallet Desk (NHÓM ĐẦU TIÊN CẦN THỰC HIỆN)](#group-02-merchant-finance--wallet-desk)
   - [GROUP 03: Merchant Parking Facilities Directory & Onboarding](#group-03-merchant-parking-facilities-directory--onboarding)
   - [GROUP 04: Merchant Slots Capacity & Pricing Matrix Workbench](#group-04-merchant-slots-capacity--pricing-matrix-workbench)
   - [GROUP 05: Merchant Barie Gate Terminal & Booking Dispatch](#group-05-merchant-barie-gate-terminal--booking-dispatch)
   - [GROUP 06: Driver Fleet Management & ALPR Synchronization](#group-06-driver-fleet-management--alpr-synchronization)
   - [GROUP 07: Driver Payments, VAT Invoicing & Callback Hubs](#group-07-driver-payments-vat-invoicing--callback-hubs)
   - [GROUP 08: Driver Virtual Queues & Driver Disputes](#group-08-driver-virtual-queues--driver-disputes)
   - [GROUP 09: Driver Profile, Security & Notifications](#group-09-driver-profile-security--notifications)
   - [GROUP 10: Admin Parking Lots Moderation Queue & Dashboard](#group-10-admin-parking-lots-moderation-queue--dashboard)
   - [GROUP 11: Admin User Governance & Financial Settlement Ledger](#group-11-admin-user-governance--financial-settlement-ledger)
   - [GROUP 12: Admin Disputes Docket, Audit Trail & Security Profile](#group-12-admin-disputes-docket-audit-trail--security-profile)
   - [GROUP 13: Authentication & Access Control Guards Hardening](#group-13-authentication--access-control-guards-hardening)
   - [GROUP 14: Public Marketing Website & Developer Documentation](#group-14-public-marketing-website--developer-documentation)

---

## 1. Hướng Dẫn Sử Dụng Với Prompt 07

Khi bước vào giai đoạn thực thi một nhóm màn hình (ví dụ: Group 02), người dùng chỉ cần:
1. Mở Prompt 07 Template.
2. Sao chép trọn vẹn khối dữ liệu nằm giữa hai thẻ `--- BEGIN GROUP INPUT ---` và `--- END GROUP INPUT ---` tương ứng.
3. Dán vào phần khai báo của Prompt 07 để Agent triển khai đúng phạm vi, không bị lệch route hoặc sót issue.

---

## 2. Khối Dữ Liệu Prompt 07 Cho 15 Nhóm Triển Khai

---

### GROUP 00: Shared Design System & Core Primitives

> **Trạng thái:** ĐÃ HOÀN THÀNH 100% Ở BATCH 00 (Lưu trữ tham khảo)

--- BEGIN GROUP INPUT ---

GROUP:
Shared Design System & Core Primitives

ROUTES:
N/A (Hạ tầng Shared UI toàn hệ thống)

ISSUE IDS:
ISS-12, APP-12, WCAG-2.1-AA-CONTRAST

PAGE IDS:
Toàn bộ 56 màn hình (`SCR-001` -> `SCR-053`, `DRV-DISP-01`, `DRV-DISP-02`, `404`)

SHARED COMPONENTS:
src/styles/globals.css
src/shared/components/Button.tsx
src/shared/components/Badge.tsx
src/shared/components/Modal.tsx
src/shared/components/Card.tsx
src/shared/components/Table.tsx
src/shared/components/Input.tsx
src/shared/components/EmptyState.tsx
src/shared/components/Tabs.tsx
src/shared/components/Pagination.tsx

DEPENDENCIES:
None (Gốc của cây phụ thuộc)

IMPLEMENTATION OBJECTIVE:
Thiết lập biến màu nhận diện `--color-brand-primary: #d95f00` đạt độ tương phản 4.85:1 trên nền tối; đồng bộ các token trạng thái `brand-status-*`; nâng cấp component `Modal.tsx` chuẩn A11y (phím Escape, khóa cuộn `overflow: hidden`, bẫy focus); chuẩn hóa Button, Input, Table, Card, EmptyState theo Tailwind CSS v4.

ACCEPTANCE CRITERIA:
1. Biến CSS `--color-brand-primary` có mặt trong `@theme` tại `globals.css`.
2. Component `Modal.tsx` lắng nghe sự kiện phím `Escape` và tự động trả lại `overflow: unset` khi unmount.
3. Toàn bộ 15 test suites trong `SharedComponents.test.tsx` pass 100%.

REGRESSION SCOPE:
Toàn bộ các component trong `src/shared/components/`.

--- END GROUP INPUT ---

---

### GROUP 01: Driver Booking Core & Operations Desk

> **Trạng thái:** ĐÃ HOÀN THÀNH 100% Ở BATCH 01 (Báo cáo: `driver-booking-report.md`)

--- BEGIN GROUP INPUT ---

GROUP:
Driver Booking Core & Operations Desk

ROUTES:
/dashboard
/parking
/parking/:id
/bookings

ISSUE IDS:
APP-01, APP-02, APP-05, APP-09, APP-10, APP-13, ISS-01, ISS-05, ISS-06, ISS-07, ISS-08, ISS-14

PAGE IDS:
SCR-014, SCR-015, SCR-016, SCR-017

SHARED COMPONENTS:
src/features/parking-detail/components/BookingPaymentModal.tsx
src/features/parking-detail/pages/ParkingDetailPage.tsx
src/features/parking-search/components/InlineQuickBookPanel.tsx
src/features/driver/pages/DriverDashboardPage.tsx
src/features/driver/components/ActiveTripCard.tsx
src/features/bookings/pages/MyBookingsPage.tsx

DEPENDENCIES:
GROUP-00 (Shared Design System & Core Primitives)

IMPLEMENTATION OBJECTIVE:
Xóa bỏ hoàn toàn lỗi nuốt lỗi mạng tự sinh đơn giả `BK-2025-CLG2-014` trong catch block của `BookingPaymentModal`; nối dữ liệu số slot động từ API thật vào trang chi tiết bãi đỗ; lưu mã giữ chỗ 10 phút vào localStorage; tạo link Google Maps động theo địa chỉ thực tế của bãi; nối form tra cứu nhanh với bảng chuyến đỗ; chuẩn hóa chiều cao container linh hoạt.

ACCEPTANCE CRITERIA:
1. Giả lập lỗi mạng khi thanh toán: Modal giữ nguyên ở Bước 2, báo lỗi đỏ rõ ràng, không tự ý chuyển sang Bước thành công với đơn giả.
2. Trang `/parking/:id` hiển thị đúng sức chứa và tỷ lệ slot từ API trả về.
3. Link chỉ đường trên ActiveTripCard mở đúng tọa độ và tên bãi đỗ thực tế.
4. Toàn bộ 36 test suite pass 100%.

REGRESSION SCOPE:
src/features/driver/*
src/features/parking-search/*
src/features/parking-detail/*
src/features/bookings/*

--- END GROUP INPUT ---

---

### GROUP 02: Merchant Finance & Wallet Desk

> **Trạng thái:** SẴN SÀNG TRIỂN KHAI (ĐÂY LÀ NHÓM ĐẦU TIÊN CẦN ĐƯA VÀO PROMPT 07)

--- BEGIN GROUP INPUT ---

GROUP:
Merchant Finance & Wallet Desk

ROUTES:
/merchant/withdrawals
/merchant/revenue
/merchant/profile

ISSUE IDS:
TSK-P0-01, APP-04, ISS-03, TSK-P2-01, APP-15, APP-17

PAGE IDS:
SCR-038, SCR-037, SCR-027

SHARED COMPONENTS:
src/shared/components/Button.tsx
src/shared/components/Card.tsx
src/shared/components/Input.tsx
src/shared/components/Workspace.tsx
src/shared/components/Modal.tsx

DEPENDENCIES:
GROUP-00 (Shared Design System & Core Primitives)

IMPLEMENTATION OBJECTIVE:
Khắc phục triệt để bẫy validation P0 trên form rút tiền Merchant; vô hiệu hóa nút "+ Yêu cầu rút tiền" khi số dư ví < 50.000 ₫ kèm tooltip giải thích số dư tối thiểu; hiển thị số dư khả dụng ngay trong form; vô hiệu hóa nút submit và hiển thị spinner chống double-click khi gửi lệnh rút tiền; bảo vệ an toàn hồ sơ STK ngân hàng thụ hưởng tại `/merchant/profile`; làm phẳng Bento KPI cards trên màn hình doanh thu.

ACCEPTANCE CRITERIA:
1. Khi `walletBalance < 50000`: Nút "+ Yêu cầu rút tiền" bị vô hiệu hóa (`disabled={true}`), con trỏ dạng `cursor-not-allowed`, rê chuột hiển thị tooltip rõ ràng: "Số dư khả dụng tối thiểu để rút tiền là 50.000 ₫".
2. Khi `walletBalance >= 50000`: Nút bấm mở Dialog bình thường; ô nhập liệu có `min={50000}` và `max={walletBalance}`; khi submit lập tức kích hoạt `disabled` và spinner xoay.
3. Form tại `/merchant/profile` hiển thị chuẩn xác thông tin tài khoản ngân hàng thụ hưởng, không bị ghi đè dữ liệu rỗng.
4. Chạy `npm run test` phân hệ merchant operations pass 100%.

REGRESSION SCOPE:
/merchant/withdrawals
/merchant/revenue
/merchant/profile
src/features/merchant/operations/FinancePages.tsx
src/features/merchant/profile/pages/MerchantProfilePage.tsx

--- END GROUP INPUT ---

---

### GROUP 03: Merchant Parking Facilities Directory & Onboarding

--- BEGIN GROUP INPUT ---

GROUP:
Merchant Parking Facilities Directory & Onboarding

ROUTES:
/merchant/parking-lots
/merchant/parking-lots/new
/merchant/parking-lots/:parkingLotId
/merchant/parking-lots/:parkingLotId/edit

ISSUE IDS:
TSK-P1-01, APP-07, ISS-10, TSK-P2-01, APP-15, ISS-17, TSK-P2-02, APP-12, ISS-12

PAGE IDS:
SCR-028, SCR-029, SCR-030, SCR-031

SHARED COMPONENTS:
src/shared/components/Button.tsx
src/shared/components/Card.tsx
src/shared/components/Modal.tsx
src/shared/components/Table.tsx
src/shared/components/Input.tsx
src/shared/utils/exportToCsvUtil.ts

DEPENDENCIES:
GROUP-00 (Shared UI Primitives), GROUP-02 (Merchant Finance)

IMPLEMENTATION OBJECTIVE:
Xây dựng tiện ích xuất CSV UTF-8 BOM `exportToCsvUtil.ts` và kích hoạt tải về tệp danh sách cơ sở bãi thực tế thay cho timer giả lập `setTimeout`; bổ sung cơ chế chống double-click khi bấm submit tạo bãi mới (`/new`) và sửa bãi (`/:id/edit`); kế thừa component `Modal.tsx` chuẩn A11y có phím Escape và khóa cuộn nền cho modal xuất báo cáo và xác nhận; kiểm tra cơ chế Lockout mode khi bãi đã được duyệt (`APPROVED`).

ACCEPTANCE CRITERIA:
1. Bấm nút "Tải Báo Cáo" tại `/merchant/parking-lots`: Trình duyệt tải về tệp `DanhSach_BaiDo_SmartParking_YYYYMMDD.csv` chuẩn UTF-8 BOM, mở bằng Excel không lỗi font tiếng Việt.
2. Tại form đăng ký bãi mới (`/new`): Bấm nút hoàn tất đăng ký ngay lập tức khóa nút (`disabled={true}`) kèm spinner xoay, không thể gửi 2 request trùng lặp.
3. Mọi modal đóng được bằng phím `Escape` và khóa cuộn trang nền.
4. Bãi đỗ có trạng thái `APPROVED` hiển thị cảnh báo Lockout rõ ràng khi vào trang chỉnh sửa.

REGRESSION SCOPE:
/merchant/parking-lots
/merchant/parking-lots/new
/merchant/parking-lots/:parkingLotId
/merchant/parking-lots/:parkingLotId/edit
src/features/merchant/parking-lots/pages/*
src/features/merchant/parking-lots/components/ExportReportModal.tsx

--- END GROUP INPUT ---

---

### GROUP 04: Merchant Slots Capacity & Pricing Matrix Workbench

--- BEGIN GROUP INPUT ---

GROUP:
Merchant Slots Capacity & Pricing Matrix Workbench

ROUTES:
/merchant/parking-lots/:parkingLotId/slots
/merchant/parking-lots/:id/pricing

ISSUE IDS:
Occupied-Invariant-Verification, Column-Right-Alignment, Tablet-Responsive-Polish

PAGE IDS:
SCR-032, SCR-033

SHARED COMPONENTS:
src/shared/components/Workspace.tsx
src/shared/components/Button.tsx
src/shared/components/Input.tsx
src/shared/components/Card.tsx

DEPENDENCIES:
GROUP-00, GROUP-03 (Merchant Facilities Directory)

IMPLEMENTATION OBJECTIVE:
Hoàn thiện giao diện điều chỉnh sức chứa 5 nhóm phương tiện (Xe con, Tải nhẹ, Tải trung, Tải nặng, Container) đảm bảo bất biến Occupied Invariant; căn phải các cột số lượng và tiền tệ trong ma trận biểu phí giờ cao điểm; tối ưu trải nghiệm co giãn trên màn hình tablet (768px - 1024px).

ACCEPTANCE CRITERIA:
1. Trang cấu hình slot: Không thể giảm sức chứa của bất kỳ phân loại xe nào xuống thấp hơn số lượng xe đang đỗ thực tế trong bãi.
2. Ma trận cước phí: Cột giá cơ bản và hệ số phụ thu cao điểm được căn phải thẳng hàng theo chuẩn kế toán.
3. Không bị vỡ bố cục trên tablet.

REGRESSION SCOPE:
/merchant/parking-lots/:parkingLotId/slots
/merchant/parking-lots/:id/pricing
src/features/merchant/slots/pages/MerchantSlotsPage.tsx
src/features/merchant/operations/MerchantLotPage.tsx

--- END GROUP INPUT ---

---

### GROUP 05: Merchant Barie Gate Terminal & Booking Dispatch

--- BEGIN GROUP INPUT ---

GROUP:
Merchant Barie Gate Terminal & Booking Dispatch

ROUTES:
/merchant
/merchant/bookings
/merchant/bookings/:id
/merchant/qr-scanner
/merchant/notifications

ISSUE IDS:
APP-17, Dark-Theme-Barie-Contrast, Responsive-Table-Polish

PAGE IDS:
SCR-026, SCR-034, SCR-035, SCR-036, SCR-041

SHARED COMPONENTS:
src/shared/components/Button.tsx
src/shared/components/Card.tsx
src/shared/components/Badge.tsx
src/shared/components/Table.tsx
src/shared/components/Modal.tsx

DEPENDENCIES:
GROUP-00, GROUP-02 (Merchant Finance)

IMPLEMENTATION OBJECTIVE:
Làm phẳng các thẻ Bento KPI trên Merchant Dashboard (`/merchant`) loại bỏ các khối màu neon chói mắt; kiểm tra và bảo đảm độ tương phản tối ưu cho trạm điều hành cổng Barie QR Scanner (`/merchant/qr-scanner`); xác nhận hoạt động của modal thu tiền mặt; tối ưu hiển thị danh sách điều phối đặt chỗ và trung tâm thông báo.

ACCEPTANCE CRITERIA:
1. Dashboard Merchant: Bento cards sử dụng phong cách nền kính mờ nhã nhặn (`bg-white/5 border border-white/10`), số liệu nổi bật.
2. Trạm Barie: Camera viewfinder quét QR hoạt động nhạy bén, phím tắt Enter/Space xử lý check-in/out nhanh, nút xác nhận thu tiền mặt nổi bật an toàn.
3. Danh sách đặt chỗ và thông báo phân trang mượt mà 20 bản ghi/trang.

REGRESSION SCOPE:
/merchant
/merchant/bookings
/merchant/bookings/:id
/merchant/qr-scanner
/merchant/notifications
src/features/merchant/dashboard/pages/MerchantDashboardPage.tsx
src/features/merchant/operations/MerchantScannerPage.tsx
src/features/merchant/operations/MerchantBookingsPage.tsx

--- END GROUP INPUT ---

---

### GROUP 06: Driver Fleet Management & ALPR Synchronization

--- BEGIN GROUP INPUT ---

GROUP:
Driver Fleet Management & ALPR Synchronization

ROUTES:
/vehicles
/dashboard/vehicles
/driver/vehicles

ISSUE IDS:
TSK-P1-01, APP-03, ISS-02, TSK-P1-03, APP-16, TSK-P2-01, APP-15, ISS-17, TSK-P2-02, APP-12, ISS-12

PAGE IDS:
SCR-020

SHARED COMPONENTS:
src/shared/components/Button.tsx
src/shared/components/Card.tsx
src/shared/components/Modal.tsx
src/shared/components/Table.tsx
src/shared/components/Input.tsx
src/shared/components/Badge.tsx
src/shared/utils/exportToCsvUtil.ts

DEPENDENCIES:
GROUP-00 (Shared UI), exportToCsvUtil.ts (từ GROUP-03)

IMPLEMENTATION OBJECTIVE:
Sửa lỗi xuất tệp tải về JSON đổi đuôi `.xlsx` / `.pdf` làm hỏng file, thay bằng tệp CSV chuẩn UTF-8 BOM hiển thị đúng tiếng Việt; chuyển đổi bảng đội xe 8 cột sang danh sách Thẻ xếp chồng (Stacked Card View) trên màn hình di động (< 640px); bổ sung cờ `isSubmitting` chặn double-click khi thêm/sửa xe; kế thừa modal xác nhận xóa xe chuẩn A11y.

ACCEPTANCE CRITERIA:
1. Bấm "Xuất danh sách đội xe": Tải về tệp CSV UTF-8 BOM `SmartTruck_DoiXe_YYYYMMDD.csv` mở trên Excel tiếng Việt không lỗi font.
2. Trên màn hình 375px (iPhone SE): Bảng ẩn đi, hiển thị danh sách Card với Biển số xe to rõ, trạng thái kiểm định và nút thao tác ≥ 44×44px, không tràn viền ngang.
3. Thêm xe mới: Nút Lưu vô hiệu hóa lập tức kèm spinner, không tạo 2 xe trùng biển số khi mạng chậm.
4. Modal xóa xe đóng mượt bằng phím `Escape`.

REGRESSION SCOPE:
/vehicles
src/features/vehicles/*
src/features/vehicles/components/ExportFleetModal.tsx
src/features/vehicles/components/VehicleMasterTable.tsx

--- END GROUP INPUT ---

---

### GROUP 07: Driver Payments, VAT Invoicing & Callback Hubs

--- BEGIN GROUP INPUT ---

GROUP:
Driver Payments, VAT Invoicing & Callback Hubs

ROUTES:
/payments
/payment/success
/payment/cancel
/payment/return

ISSUE IDS:
TSK-P1-01, APP-06, ISS-09, TSK-P1-02, APP-14, ISS-11, TSK-P1-03, APP-16, TSK-P3-01, APP-18

PAGE IDS:
SCR-019, SCR-023, SCR-024

SHARED COMPONENTS:
src/shared/components/Button.tsx
src/shared/components/Card.tsx
src/shared/components/Modal.tsx
src/shared/components/Table.tsx
src/shared/components/EmptyState.tsx
src/shared/components/Badge.tsx
src/shared/utils/exportToCsvUtil.ts
src/features/profile/api/profileApi.ts

DEPENDENCIES:
GROUP-00 (Shared UI), GROUP-06 (Export Utility)

IMPLEMENTATION OBJECTIVE:
Thay thế nút xuất báo cáo cước chỉ chạy hẹn giờ giả lập sang tải file CSV thật; chuyển đổi lưu trữ hóa đơn VAT công ty từ `localStorage` sang gọi API `PUT /api/v1/users/me`; áp dụng Card View mobile cho bảng giao dịch; bổ sung Empty State có nút CTA dẫn hướng ("Tìm bãi đỗ ngay") khi chưa có giao dịch.

ACCEPTANCE CRITERIA:
1. Bấm "Tải Báo Cáo" tại `/payments`: Tải về tệp `SaoKe_CuocPhi_YYYYMMDD.csv` chứa đúng danh sách giao dịch thực tế.
2. Lưu thông tin hóa đơn VAT công ty: Gửi payload lên API User Profile; đăng nhập trên thiết bị khác thông tin MST vẫn tự động tải về.
3. Bảng sao kê trên màn hình di động (< 640px) chuyển thành Card View không bị tràn mép cuộn ngang.
4. Khi bảng rỗng: Hiển thị component `EmptyState` chuẩn kèm nút CTA "Tìm bãi đỗ ngay".

REGRESSION SCOPE:
/payments
/payment/success
/payment/cancel
src/features/payments/*
src/features/payments/components/CompanyInvoiceModal.tsx
src/features/payments/components/ExportReportModal.tsx
src/features/payment-return/pages/PaymentReturnPage.tsx
src/features/payment-cancel/pages/PaymentCancelPage.tsx

--- END GROUP INPUT ---

---

### GROUP 08: Driver Virtual Queues & Driver Disputes

--- BEGIN GROUP INPUT ---

GROUP:
Driver Virtual Queues & Driver Disputes

ROUTES:
/queues
/disputes
/disputes/:id

ISSUE IDS:
TSK-P3-01, APP-18, TSK-P3-02, APP-11, ISS-13, Column-Numeric-Right-Alignment

PAGE IDS:
SCR-018, DRV-DISP-01, DRV-DISP-02

SHARED COMPONENTS:
src/shared/components/Button.tsx
src/shared/components/Modal.tsx
src/shared/components/EmptyState.tsx
src/shared/components/Workspace.tsx
src/shared/components/Badge.tsx

DEPENDENCIES:
GROUP-00 (Shared UI Primitives)

IMPLEMENTATION OBJECTIVE:
Bổ sung nút đóng [X] góc phải trên và cho phép click backdrop đóng modal cho `AcceptQueueSuccessModal`; thay thế dòng text xám "Không tìm thấy dữ liệu" bằng EmptyState có hình minh họa và nút CTA điều hướng; căn phải các cột số tiền và ID vụ việc trong bảng khiếu nại tài xế.

ACCEPTANCE CRITERIA:
1. `AcceptQueueSuccessModal`: Có nút đóng [X] góc trên bên phải; click vào backdrop tối hoặc nhấn phím `Escape` modal đóng lập tức.
2. Khi hàng đợi rỗng: Hiển thị EmptyState thân thiện kèm nút CTA "Tìm bãi xe khác".
3. Bảng `/disputes`: Cột số tiền bồi thường và mã vụ việc được căn phải thẳng hàng.

REGRESSION SCOPE:
/queues
/disputes
/disputes/:id
src/features/queues/components/AcceptQueueSuccessModal.tsx
src/features/queues/components/QueueHistoryTable.tsx
src/features/disputes/*

--- END GROUP INPUT ---

---

### GROUP 09: Driver Profile, Security & Notifications

--- BEGIN GROUP INPUT ---

GROUP:
Driver Profile, Security & Notifications

ROUTES:
/profile
/change-password
/notifications

ISSUE IDS:
Password-Strength-Criteria-Polish, Web-Push-Activation-Polish, Mobile-Spacing-Optimization

PAGE IDS:
SCR-021, SCR-022, SCR-025

SHARED COMPONENTS:
src/shared/components/Button.tsx
src/shared/components/Input.tsx
src/shared/components/Card.tsx
src/shared/components/Badge.tsx
src/shared/components/Tabs.tsx

DEPENDENCIES:
GROUP-00 (Shared UI Primitives)

IMPLEMENTATION OBJECTIVE:
Rà soát và tối ưu giao diện hồ sơ cá nhân tài xế; kiểm tra độ nhạy và chính xác của thanh đo độ mạnh mật khẩu Fretrix 4 tiêu chí; hoàn thiện giao diện trung tâm thông báo và nút kích hoạt Web Push 24/7; tối ưu khoảng cách đệm trên màn hình di động.

ACCEPTANCE CRITERIA:
1. Trang đổi mật khẩu: Phản hồi realtime 4 tiêu chí an ninh (độ dài, chữ hoa, số, ký tự đặc biệt) khi người dùng gõ phím.
2. Trang thông báo: Nút "Bật thông báo đẩy 24/7" gọi Notification API trình duyệt và lưu trạng thái bật/tắt chính xác.
3. Layout không bị xô lệch trên các breakpoint di động.

REGRESSION SCOPE:
/profile
/change-password
/notifications
src/features/profile/pages/ProfilePage.tsx
src/features/change-password/pages/ChangePasswordPage.tsx
src/features/notifications/pages/NotificationsPage.tsx

--- END GROUP INPUT ---

---

### GROUP 10: Admin Parking Lots Moderation Queue & Dashboard

--- BEGIN GROUP INPUT ---

GROUP:
Admin Parking Lots Moderation Queue & Dashboard

ROUTES:
/admin
/admin/dashboard
/admin/parking-lots
/admin/parking-lots/:id

ISSUE IDS:
TSK-P0-02, APP-08, ISS-04, TSK-P2-03, Admin-Button-Harmonization

PAGE IDS:
SCR-042, SCR-043, SCR-044

SHARED COMPONENTS:
src/shared/components/Workspace.tsx
src/shared/components/Dialog.tsx
src/shared/components/Button.tsx
src/shared/components/Badge.tsx
src/shared/components/Input.tsx

DEPENDENCIES:
GROUP-00 (Shared UI Primitives)

IMPLEMENTATION OBJECTIVE:
Khắc phục lỗi P0 bắt buộc nhập lý do khi Admin duyệt hồ sơ bãi hợp lệ (`/admin/parking-lots/:id`); chuyển đổi toàn bộ nút bấm Admin dùng màu đảo ngược (`bg-brand-orange text-brand-navy`) sang màu cam thương hiệu chữ trắng đồng nhất (`bg-[#d95f00] text-white`); hoàn thiện hiển thị Metrics cảnh báo trên Admin Dashboard.

ACCEPTANCE CRITERIA:
1. Tại `/admin/parking-lots/:id`: Khi chọn hành động "Phê duyệt" (`APPROVED`), ô lý do giải trình chuyển sang trạng thái "(Tùy chọn)" và nút Submit bấm được ngay mà không cần nhập text.
2. Khi chọn hành động "Từ chối" (`REJECTED`): Ô lý do bắt buộc nhập kèm thông báo cảnh báo đỏ nếu để trống.
3. Nút Đăng xuất tại Header Admin và toàn bộ nút CTA trong bảng duyệt bãi hiển thị đồng nhất màu cam chữ trắng sắc nét.

REGRESSION SCOPE:
/admin
/admin/parking-lots
/admin/parking-lots/:id
src/features/admin/* (DecisionDialog)
src/layouts/AdminLayout.tsx

--- END GROUP INPUT ---

---

### GROUP 11: Admin User Governance & Financial Settlement Ledger

--- BEGIN GROUP INPUT ---

GROUP:
Admin User Governance & Financial Settlement Ledger

ROUTES:
/admin/users
/admin/users/:id
/admin/transactions
/admin/withdrawals

ISSUE IDS:
TSK-P1-03, TSK-P2-03, Table-Numeric-Alignment, Payout-Confirmation-Dialog-Polish

PAGE IDS:
SCR-045, SCR-046, SCR-047, SCR-048

SHARED COMPONENTS:
src/shared/components/Workspace.tsx
src/shared/components/DataTable.tsx
src/shared/components/Dialog.tsx
src/shared/components/Button.tsx
src/shared/components/Badge.tsx

DEPENDENCIES:
GROUP-00, GROUP-10 (Admin Moderation)

IMPLEMENTATION OBJECTIVE:
Chuẩn hóa sổ cái giao dịch tài chính toàn hệ thống và bàn phê duyệt lệnh rút tiền của chủ bãi; áp dụng Card View responsive cho bảng giao dịch; căn phải số tiền giao dịch và STK ngân hàng; đồng bộ phong cách nút bấm sang cam chữ trắng.

ACCEPTANCE CRITERIA:
1. Bàn duyệt rút tiền (`/admin/withdrawals`): Hộp thoại xác nhận chuyển khoản ngân hàng hiển thị đầy đủ tên ngân hàng, STK và số tiền trước khi Admin bấm xác nhận `PAID`.
2. Bảng giao dịch (`/admin/transactions`): Số tiền VND được căn phải thẳng hàng; không tràn mép trên thiết bị nhỏ.
3. Nút bấm trong các bảng quản trị tuân thủ token `--color-brand-primary`.

REGRESSION SCOPE:
/admin/users
/admin/users/:id
/admin/transactions
/admin/withdrawals
src/features/admin/pages/AdminUsersPage.tsx
src/features/admin/pages/AdminTransactionsPage.tsx
src/features/admin/pages/AdminWithdrawalsPage.tsx

--- END GROUP INPUT ---

---

### GROUP 12: Admin Disputes Docket, Audit Trail & Security Profile

--- BEGIN GROUP INPUT ---

GROUP:
Admin Disputes Docket, Audit Trail & Security Profile

ROUTES:
/admin/disputes
/admin/disputes/:id
/admin/audit-logs
/admin/notifications
/admin/profile
/merchant/disputes
/merchant/disputes/:id

ISSUE IDS:
TSK-P1-03, TSK-P2-03, Arbitration-Verdict-Workflow-Polish, Immutable-Log-Card-View

PAGE IDS:
SCR-049, SCR-050, SCR-051, SCR-052, SCR-053, SCR-039, SCR-040

SHARED COMPONENTS:
src/shared/components/Workspace.tsx
src/shared/components/DataTable.tsx
src/shared/components/Panel.tsx
src/shared/components/Button.tsx
src/shared/components/Badge.tsx

DEPENDENCIES:
GROUP-00, GROUP-10 (Admin Core)

IMPLEMENTATION OBJECTIVE:
Hoàn thiện phòng phân xử trọng tài tranh chấp (Arbitration Tribunal) của Admin và bảng khiếu nại Merchant; tối ưu hóa bảng nhật ký kiểm toán an ninh bất biến trên thiết bị di động; quản lý hồ sơ bảo mật Admin; đồng bộ nút bấm cam chữ trắng.

ACCEPTANCE CRITERIA:
1. Phòng phân xử (`/admin/disputes/:id`): Admin nhập phán quyết giải quyết (`resolution`) và ban hành đóng hồ sơ mượt mà, cập nhật trạng thái `RESOLVED`.
2. Bảng Audit Logs: Căn chỉnh thẻ Card View trên màn hình nhỏ, hiển thị rõ Actor ID, thời gian và kết quả hành động.
3. Toàn bộ các nút bấm chuyển sang chuẩn cam chữ trắng.

REGRESSION SCOPE:
/admin/disputes
/admin/disputes/:id
/admin/audit-logs
/merchant/disputes
/merchant/disputes/:id
src/features/disputes/*
src/features/admin/pages/AdminAuditLogsPage.tsx
src/features/portal/AccountPages.tsx

--- END GROUP INPUT ---

---

### GROUP 13: Authentication & Access Control Guards Hardening

--- BEGIN GROUP INPUT ---

GROUP:
Authentication & Access Control Guards Hardening

ROUTES:
/login
/register
/forgot-password
/403
/*

ISSUE IDS:
A11y-Focus-Visible-Rings, Color-Contrast-Audit, Form-Error-Semantics

PAGE IDS:
SCR-010, SCR-011, SCR-012, SCR-013, 404

SHARED COMPONENTS:
src/features/auth/layouts/AuthLayout.tsx
src/shared/components/Button.tsx
src/shared/components/Input.tsx
src/shared/components/Card.tsx

DEPENDENCIES:
GROUP-00 (Shared UI Primitives)

IMPLEMENTATION OBJECTIVE:
Rà soát và củng cố toàn bộ các màn hình xác thực và kiểm soát quyền truy cập; bảo đảm tiêu điểm bàn phím (focus-visible rings) sắc nét khi duyệt bằng phím Tab; kiểm tra độ tương phản màu chữ và nhãn lỗi form theo WCAG 2.1 AA.

ACCEPTANCE CRITERIA:
1. Bấm phím Tab trên form đăng nhập và đăng ký: Vòng tiêu điểm màu cam rõ nét, di chuyển tuần tự qua các input và nút bấm.
2. Các nhãn báo lỗi validation có `role="alert"` hỗ trợ trình đọc màn hình.
3. Nút quay về trang chủ ở trang 403 và 404 hiển thị màu cam chuẩn nhận diện.

REGRESSION SCOPE:
/login
/register
/forgot-password
/403
/*
src/features/auth/*

--- END GROUP INPUT ---

---

### GROUP 14: Public Marketing Website & Developer Documentation

--- BEGIN GROUP INPUT ---

GROUP:
Public Marketing Website & Developer Documentation

ROUTES:
/
/solutions/drivers
/solutions/owners
/pricing
/api-docs
/about
/careers
/insights
/contact

ISSUE IDS:
ISS-15, Hardcoded-Hex-Color-Replacement, Pricing-Matrix-Mobile-Responsive

PAGE IDS:
SCR-001, SCR-002, SCR-003, SCR-004, SCR-005, SCR-006, SCR-007, SCR-008, SCR-009

SHARED COMPONENTS:
src/features/landing/layouts/LandingNavbar.tsx
src/features/landing/layouts/LandingFooter.tsx
src/shared/components/Button.tsx
src/shared/components/Card.tsx
src/shared/components/Badge.tsx

DEPENDENCIES:
GROUP-00 (Shared UI Primitives)

IMPLEMENTATION OBJECTIVE:
Thay thế toàn bộ các mã màu cam hardcode `#F97316` còn sót trên 9 trang Landing sang biến `--color-brand-primary` (#d95f00) để đảm bảo độ tương phản WCAG AA; tối ưu bảng so sánh gói giá tại `/pricing` chống tràn mép trên màn hình di động 375px; bổ sung phương án gửi CV qua `mailto:` an toàn cho form tuyển dụng (`/careers`) thay vì chạy timer ảo.

ACCEPTANCE CRITERIA:
1. Bảng giá `/pricing`: Co giãn mượt mà trên iPhone SE (375px), không xuất hiện thanh cuộn ngang toàn trang.
2. Form tuyển dụng `/careers`: Hướng dẫn ứng viên gửi CV trực tiếp qua email tuyển dụng kèm nút kích hoạt `mailto:` tự điền tiêu đề.
3. Mọi nút bấm trên cả 9 trang hiển thị màu cam thương hiệu đồng nhất.

REGRESSION SCOPE:
/
/solutions/drivers
/solutions/owners
/pricing
/api-docs
/about
/careers
/insights
/contact
src/features/landing/*

--- END GROUP INPUT ---

---
**Tài liệu được hoàn thành và lưu trữ tại:** `docs/ux-ui-audit/13-prompt-07-execution-inputs.md`.
