# Bảng Tham Chiếu Mã Nguồn Gốc (Source Reference Evidence)

Tài liệu này cung cấp danh mục đường dẫn tuyệt đối và định vị file mã nguồn làm bằng chứng kỹ thuật không thể chối cãi cho mọi thông số trong bộ tài liệu Discovery.

---

## 1. Frontend Core & Architecture (`smart-parking-app/src`)

| Thành Phần Nghiệp Vụ | Đường Dẫn File Mã Nguồn | Kích Thước | Vai Trò & Điểm Trọng Yếu |
|---|---|---:|---|
| **Entry Point** | `src/main.tsx` | 370 B | Khởi tạo React 19 root, Provider Redux Store |
| **Theme & Root Router** | `src/app/App.tsx` | 570 B | Cấu hình ConfigProvider AntD (`#0f766e`, radius 8, font Inter) |
| **Định tuyến toàn sàn** | `src/app/routes/AppRoutes.tsx` | 10.8 KB | Chứa toàn bộ 53 routes, phân nhánh Layout và Role Guard |
| **Bảo vệ quyền (Guard)**| `src/app/routes/ProtectedRoute.tsx`| 749 B | Kiểm tra `session.token` và `allowedRoles`, điều hướng 403/Login |
| **Quản lý Session** | `src/shared/auth/session.ts` | 1.1 KB | Quản lý key `smart-truck-parking.auth` trong localStorage |
| **Axios Interceptor** | `src/shared/api/apiClient.ts` | 797 B | Tự động chèn Bearer token, tự động bắt lỗi 401 redirect Login |
| **Xử lý mã lỗi API** | `src/shared/api/errors.ts` | 499 B | Trích xuất thông báo lỗi từ backend Response Envelope |
| **Định nghĩa kiểu Auth** | `src/features/auth/types/authTypes.ts`| 583 B | Định nghĩa UserRole (`DRIVER`, `MERCHANT`, `ADMIN`) |

---

## 2. Frontend Modules & Feature Pages

### 2.1. Phân hệ Tài xế (`DRIVER`)
- **Bản đồ & Tìm kiếm:** [`src/features/parking-search/pages/SearchParkingPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/parking-search/pages/SearchParkingPage.tsx) (18.1 KB), [`hooks/useSearchParking.ts`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/parking-search/hooks/useSearchParking.ts), [`components/DriverParkingMap.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/parking-search/components/DriverParkingMap.tsx).
- **Chi tiết bãi & Giữ chỗ 10p:** [`src/features/parking-search/pages/ParkingDetailPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/parking-search/pages/ParkingDetailPage.tsx) (15.2 KB).
- **Quản lý Đặt chỗ & QR:** [`src/features/bookings/pages/MyBookingsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/bookings/pages/MyBookingsPage.tsx) (18.7 KB), [`CancelBookingModal.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/bookings/components/CancelBookingModal.tsx).
- **Hàng đợi ảo:** [`src/features/queues/pages/DriverQueuesPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/queues/pages/DriverQueuesPage.tsx) (6.2 KB).
- **Lịch sử thanh toán:** [`src/features/payments/pages/DriverPaymentsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/payments/pages/DriverPaymentsPage.tsx) (7.4 KB), [`PaymentReturnPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/payments/pages/PaymentReturnPage.tsx).
- **Quản lý phương tiện:** [`src/features/vehicles/pages/VehiclesPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/vehicles/pages/VehiclesPage.tsx) (7.9 KB), [`types/vehicleTypes.ts`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/vehicles/types/vehicleTypes.ts).
- **Trợ lý AI Copilot:** [`src/features/ai-copilot/components/AiChatWidget.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/ai-copilot/components/AiChatWidget.tsx) (11.4 KB).

### 2.2. Phân hệ Chủ bãi (`MERCHANT`)
- **Khung giao diện:** [`src/features/merchant/layout/MerchantLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/layout/MerchantLayout.tsx) (6.2 KB), [`navigation/merchantNavigation.ts`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/navigation/merchantNavigation.ts).
- **Bãi đỗ xe:** [`pages/MerchantParkingLotsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/parking-lots/pages/MerchantParkingLotsPage.tsx), [`pages/CreateMerchantParkingLotPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/parking-lots/pages/CreateMerchantParkingLotPage.tsx) (12.6 KB), [`pages/MerchantParkingLotDetailPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/parking-lots/pages/MerchantParkingLotDetailPage.tsx) (16.3 KB).
- **Sức chứa & Giá:** [`slots/pages/MerchantSlotsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/slots/pages/MerchantSlotsPage.tsx) (8.7 KB), [`pricing/pages/MerchantPricingPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/pricing/pages/MerchantPricingPage.tsx) (12.7 KB).
- **Camera Quét QR:** [`qr-scanner/pages/MerchantQrScannerPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/qr-scanner/pages/MerchantQrScannerPage.tsx) (10.1 KB), [`components/QrCameraScanner.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/qr-scanner/components/QrCameraScanner.tsx).
- **Doanh thu & Rút tiền:** [`revenue/pages/MerchantRevenuePage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/revenue/pages/MerchantRevenuePage.tsx) (11.1 KB), [`withdrawals/pages/MerchantWithdrawalsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/withdrawals/pages/MerchantWithdrawalsPage.tsx) (8.4 KB).

### 2.3. Phân hệ Quản trị viên (`ADMIN`)
- **Khung giao diện:** [`src/features/admin/layout/AdminLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/layout/AdminLayout.tsx) (4.0 KB), [`navigation/adminNavigation.ts`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/navigation/adminNavigation.ts).
- **Repository tập trung:** [`src/features/admin/api/adminRepository.ts`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/api/adminRepository.ts) (11.8 KB - Chứa toàn bộ API calls quản trị).
- **Thẩm định bãi đỗ:** [`parking-approvals/AdminParkingLotsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotsPage.tsx), [`AdminParkingLotDetailPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/parking-approvals/AdminParkingLotDetailPage.tsx).
- **Quản lý tài khoản:** [`users/AdminUsersPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUsersPage.tsx), [`AdminUserDetailPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/users/AdminUserDetailPage.tsx).
- **Giám sát giao dịch & Rút tiền:** [`transactions/AdminTransactionsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/transactions/AdminTransactionsPage.tsx), [`withdrawals/AdminWithdrawalsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/withdrawals/AdminWithdrawalsPage.tsx).
- **Xử lý khiếu nại & Audit:** [`disputes/AdminDisputesPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputesPage.tsx), [`audit-logs/AdminAuditLogsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/audit-logs/AdminAuditLogsPage.tsx).

---

## 3. Backend Controllers, Entities & Database Migration (`smart-parking-service`)

| Thành Phần Backend | Đường Dẫn File | Trách Nhiệm Nghiệp Vụ |
|---|---|---|
| **Database Migration V1** | `src/main/resources/db/migration/V1__init_schema.sql` | Schema 13 bảng dữ liệu, ràng buộc khóa ngoại, enums và 8 indexes |
| **Báo cáo kiểm toán BE** | `smart-parking-service/reportBE.md` (36.4 KB) | Báo cáo chi tiết về 9 controllers, fix C1 schema, fix H3 approval check |
| **Quy chuẩn mã nguồn BE** | `smart-parking-service/ruleBE.md` (12.7 KB) | Quy tắc kiến trúc N-Tier, DTO validation, Custom exception handling |
| **Tài liệu SRS chuẩn** | `smart-parking-service/SRS_Smart_Truck_Parking.txt` (41.5 KB) | Đặc tả 17 Use Cases, luồng chính, luồng phụ và ràng buộc nghiệp vụ |
