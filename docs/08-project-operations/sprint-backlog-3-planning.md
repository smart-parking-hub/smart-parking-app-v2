# Báo Cáo Kế Hoạch Sprint 3 (Smart Parking Hub - Delivery)
> Bảng Trello chính thức: [Smart Parking Hub - Delivery](https://trello.com/b/QrKLrlz1/smart-parking-hub-delivery)  
> Cột theo dõi: **`05. Sprint Backlog 03`**  
> Tổng số Task: **44 Tasks + 1 Sprint Goal** | Tổng Story Points: **154 STP**  
> Quy chuẩn mã Task: `SP-S3-<DOMAIN_CODE>-<INDEX>`  
> Quy chuẩn tiêu đề màn hình: `[SP-S3-<DOMAIN>-<XX>] [FE] <Tên nghiệp vụ> (<ComponentPage>) (SCR-xxx) (<X> STP)`  

---

## 🎯 1. Sprint Goal 03
> **🎯 Sprint Goal 03:** Hoàn thiện Quản lý Sàn (Admin/Merchant), Tích hợp Thanh toán & Đối soát, Tối ưu Hàng đợi ảo và Kiểm thử toàn diện E2E (154 STP).

---

## 📊 2. Bảng Phân Bổ Story Points Theo Thành Viên (154 STP)

| Thành viên | Trách nhiệm chính | Cấp độ | Số lượng Task | Story Points | Tỷ lệ |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Hoàng Đình Tùng** | Bảo Mật Gateway, CI/CD, Spatial DB & Real-time Status | **Khó** | 7 Tasks | **19 STP** | 12.3% |
| **Huy (Huyy Gia)** | E2E Playwright, Dynamic Pricing, Quản Trị Sàn & Contract DTO | **Khó** | 8 Tasks | **34 STP** | 22.1% |
| **Huỳnh La Tiến Lộc** | Đối Soát Tài Chính Kép, Doanh Thu, Rút Tiền & Bồi Thường | **Khó** | 7 Tasks | **32 STP** | 20.8% |
| **Hồ Quốc Khải** | Hàng Đợi Ảo, Trọng Tài Khiếu Nại, Kỷ Luật Tài Khoản & SCR-046 | **Trung bình** | 9 Tasks | **32 STP** | 20.8% |
| **Võ Thành Khang** | UI Cơ Bản, Component Stitch, Thông Báo, Tiện Ích Bãi & Mock Config | **Dễ / An toàn** | 13 Tasks | **37 STP** | 24.0% |
| **TỔNG CỘNG** | **Toàn đội ngũ SmartParkingHub** | — | **44 Tasks** | **154 STP** | **100%** |

---

## 🏷️ 3. Danh Mục 44 Tasks Chi Tiết Theo Format Chuẩn Hóa

### NHÓM HOÀNG ĐÌNH TÙNG (7 Tasks - 19 STP - KHÓ)
1. `[SP-S3-SEC-01] [SECURITY] Tái cấu trúc cơ chế OTP: Chuyển sang SMTP Server Backend & Hủy bỏ trường otpCode trong DTO (GAP-09) (3 STP)`
2. `[SP-S3-SEC-02] [Security] Rà soát và loại bỏ việc gửi mã OTP trong response demo (GAP-09) (2 STP)`
3. `[SP-S3-OPS-01] [CI/CD] Thiết lập pipeline GitHub Actions tự động kiểm tra chất lượng Frontend v2 (3 STP)`
4. `[SP-S3-DAT-01] [DATABASE] Thiết lập Spatial Index (ST_Distance_Sphere) và bộ đệm Redis Cache-Aside cho API tìm bãi (3 STP)`
5. `[SP-S3-RT-01] [BE] Triển khai API Bật/Tắt Trạng thái Mở/Tạm dừng Bãi Đỗ Xe Thời Gian Thực (GAP-16) (3 STP)`
6. `[SP-S3-SEC-03] [FE] Nhật ký Kiểm toán An ninh & Vết Quản trị (AdminAuditLogsPage) (SCR-051) (3 STP)`
7. `[SP-S3-SEC-04] [FE] Thay thế axios trần bằng apiClient để gắn Authorization Token cho Notification API (GAP-19) (2 STP)`

### NHÓM HUY (HUYY GIA) (8 Tasks - 34 STP - KHÓ)
1. `[SP-S3-INT-01] [QA] Xây dựng bộ kịch bản kiểm thử E2E tự động (Playwright) cho luồng Giữ chỗ 10 phút & Barie QR (5 STP)`
2. `[SP-S3-INT-02] [FE+BE] Sửa lỗi lệch Contract DTO và cơ chế Fallback Mock khi Đặt cọc giữ chỗ (GAP-17) (5 STP)`
3. `[SP-S3-PAY-01] [BE] Đồng bộ hóa hợp đồng API thu tiền mặt Barie confirm-cash (GAP-02) (3 STP)`
4. `[SP-S3-BKG-01] [BE] Bổ sung API truy vấn chi tiết đơn đặt chỗ cho chủ bãi theo ID (GAP-06) (3 STP)`
5. `[SP-S3-UI-01] [FE] Bảng Điều khiển Tổng quan Vận hành Chủ bãi (MerchantDashboardPage) (SCR-026) (5 STP)`
6. `[SP-S3-UI-02] [FE] Trung tâm Điều hành Toàn sàn Super Admin (AdminDashboardPage) (SCR-042) (5 STP)`
7. `[SP-S3-PRC-01] [FE] Thiết lập Biểu phí Ma trận 4 Thông số (MerchantPricingPage) (SCR-033) (5 STP)`
8. `[SP-S3-INT-03] [FE] Loại bỏ Mock Data biểu đồ và tích hợp API chuỗi doanh thu ngày cho Merchant Dashboard (GAP-22) (3 STP)`

### NHÓM HUỲNH LA TIẾN LỘC (7 Tasks - 32 STP - KHÓ)
1. `[SP-S3-PAY-02] [QA] Kiểm thử toàn diện quy trình đối soát tài chính kép và duyệt rút tiền (5 STP)`
2. `[SP-S3-PAY-03] [FE] Phân tích Biểu đồ Doanh thu & Sổ cái Ví (MerchantRevenuePage) (SCR-037) (5 STP)`
3. `[SP-S3-PAY-04] [FE] Tạo Yêu cầu Rút tiền & Quản lý Giải ngân (MerchantWithdrawalsPage) (SCR-038) (5 STP)`
4. `[SP-S3-PAY-05] [FE] Sổ cái Giám sát Giao dịch Dòng tiền Toàn hệ thống (AdminTransactionsPage) (SCR-047) (5 STP)`
5. `[SP-S3-PAY-06] [FE] Phê duyệt & Quyết toán Lệnh Rút tiền Ví Chủ bãi (AdminWithdrawalsPage) (SCR-048) (5 STP)`
6. `[SP-S3-PAY-07] [FE] Phán quyết Trọng tài & Phân bổ Tiền bồi thường (AdminDisputeDetailPage) (SCR-050) (5 STP)`
7. `[SP-S3-PAY-08] [FE] Hồ sơ Chủ bãi & Thông tin Ngân hàng Rút tiền (MerchantProfilePage) (SCR-027) (2 STP)`

### NHÓM HỒ QUỐC KHẢI (9 Tasks - 32 STP - TRUNG BÌNH)
1. `[SP-S3-BKG-02] [BE+FE] Khắc phục đứt gãy luồng Hàng đợi ảo: Bổ sung trạng thái NOTIFIED và API Accept Slot (GAP-20) (5 STP)`
2. `[SP-S3-GOV-01] [BE] Triển khai bộ API và Luồng Quản lý Khiếu nại cho Tài xế (Driver Dispute API - GAP-01) (5 STP)`
3. `[SP-S3-GOV-02] [BE] Hoàn thiện API Cảnh báo Người dùng & Lịch sử Kỷ luật Tài khoản Admin (GAP-11) (3 STP)`
4. `[SP-S3-GOV-03] [FE] Hồ sơ Người dùng, Lịch sử Đỗ & Khóa tài khoản (AdminUserDetailPage) (SCR-046) (3 STP)`
5. `[SP-S3-GOV-04] [FE] Danh bạ Quản lý Tài khoản & Phân quyền Toàn sàn (AdminUsersPage) (SCR-045) (3 STP)`
6. `[SP-S3-GOV-05] [FE] Bàn Trọng tài & Danh sách Tranh chấp Mở (AdminDisputesPage) (SCR-049) (3 STP)`
7. `[SP-S3-UI-03] [FE] Giao diện khởi tạo và theo dõi khiếu nại cho Tài xế (SCR-DRV-01) (5 STP)`
8. `[SP-S3-GOV-06] [FE] Danh sách Khiếu nại từ Tài xế (MerchantDisputesPage) (SCR-039) (2 STP)`
9. `[SP-S3-GOV-07] [FE] Chi tiết Khiếu nại, Lời khai & Bằng chứng (MerchantDisputeDetailPage) (SCR-040) (3 STP)`

### NHÓM VÕ THÀNH KHANG (13 Tasks - 37 STP - DỄ / AN TOÀN)
1. `[SP-S3-UI-04] [FE] Trang chủ Marketing & Live Hero Map (LandingPage) (SCR-001) (3 STP)`
2. `[SP-S3-UI-05] [FE] Xây dựng bộ UI Component dùng chung (Skeleton, Toast, EmptyState, Modal) theo chuẩn Stitch Design System (5 STP)`
3. `[SP-S3-UI-06] [FE] Trung tâm Thông báo Vận hành Tài xế (DriverNotificationsPage) (SCR-025) (2 STP)`
4. `[SP-S3-UI-07] [FE] Trung tâm Thông báo Vận hành Bãi xe (MerchantNotificationsPage) (SCR-041) (2 STP)`
5. `[SP-S3-UI-08] [FE] Thông báo Thanh toán Bị hủy & Hướng dẫn Thử lại (PaymentCancelPage) (SCR-024) (2 STP)`
6. `[SP-S3-UI-09] [FE] Sửa lỗi parse Response API danh sách đặt chỗ cá nhân MyBookings (GAP-18) (2 STP)`
7. `[SP-S3-UI-10] [FE] Danh sách & Lưới Trạng thái Bãi đỗ xe (MerchantParkingLotsPage) (SCR-028) (3 STP)`
8. `[SP-S3-UI-11] [FE] Chi tiết Vận hành & Doanh thu Bãi đỗ (MerchantParkingLotDetailPage) (SCR-030) (3 STP)`
9. `[SP-S3-UI-12] [FE] Chỉnh sửa Thông tin & Tiện ích Bãi đỗ (EditMerchantParkingLotPage) (SCR-031) (3 STP)`
10. `[SP-S3-UI-13] [FE] Quản lý Lịch sử & Đơn Đặt chỗ Khách hàng (MerchantBookingsPage) (SCR-034) (3 STP)`
11. `[SP-S3-UI-14] [FE] Chi tiết Đơn Đặt chỗ & Nhật ký Barie (MerchantBookingDetailPage) (SCR-035) (3 STP)`
12. `[SP-S3-DAT-02] [BE+FE] Đồng bộ hóa danh mục loại phương tiện TRAILER giữa FE và Backend (GAP-21) (3 STP)`
13. `[SP-S3-UI-15] [FE] Chuẩn hóa cơ chế xử lý lỗi API và cờ cấu hình Mock Data môi trường (3 STP)`

---

## 🔄 4. Tổng Kết Đồng Bộ Toàn Bộ Các Cột Trên Bảng Trello Delivery

Toàn bộ **146 thẻ trên 19 cột** của bảng [Smart Parking Hub - Delivery](https://trello.com/b/QrKLrlz1/smart-parking-hub-delivery) đã được rà soát và chuẩn hóa 100% theo các quy chuẩn nghiêm ngặt:
- Mã Task chuẩn: `[SP-S<N>-<DOMAIN>-<INDEX>]`
- Các mã miền chuẩn: `OPS`, `SEC`, `ANPR`, `PRC`, `RT`, `INT`, `PAY`, `AI`, `SAGA`, `BKG`, `GOV`, `QA`, `UI`, `DAT`, `DOC`.
- Mã màn hình `(SCR-xxx)` luôn đặt ở cuối tiêu đề, loại bỏ tiền tố module thừa.
- Không di chuyển thẻ giữa các cột và không xóa bất kỳ thẻ nào.

### Danh mục các cột đã đồng bộ:
1. **`05. Sprint Backlog 03`**: 32 thẻ (1 Goal + 31 Tasks, 112 STP), các thẻ đã được bổ sung mô tả kỹ thuật chuyên sâu, checklist DoD và 100% gắn nhãn `Sprint 03`.
2. **`06. To Do`**: 23 thẻ (68 STP) — gồm 14 tasks từ kế hoạch Sprint 3 và 9 tasks vận hành/màn hình phụ trợ, 100% gắn nhãn `Sprint 03`.
3. **`07. In Progress`**: 2 thẻ (8 STP) — `SP-S3-BKG-01` (3 STP) và `SP-S3-UI-23` (5 STP), nhãn `Sprint 03`.
4. **`09. QA Testing`**: 2 thẻ (6 STP) — `SP-S3-OPS-03` (3 STP) và `SP-S3-OPS-04` (3 STP), nhãn `Sprint 03`.
5. **`11. Blocked`**: 1 thẻ (3 STP) — `SP-S3-INT-04` (3 STP), nhãn `Sprint 03`.
6. **`Future Enhancements`**: 2 thẻ (`SP-S3-PAY-11`, `SP-S3-PAY-12`), nhãn `Sprint 03`.
7. **`04. Ready for Sprint`**: 3 thẻ (`SP-S3-PRC-02`, `SP-S3-UI-22`, `SP-S3-OPS-05`), nhãn `Sprint 03`.
8. **`02. Product Backlog`**: 4 thẻ (`SP-PB-OPS-01`, `SP-PB-ANPR-01`, `SP-PB-SEC-01`, `SP-PB-UI-01`), gắn nhãn nghiệp vụ tương ứng.
9. **`10. Sprint 02 Done`**: 39 thẻ hoàn chỉnh (`SP-S2-UI-xxx`, `SP-S2-AI-xxx`, `SP-S2-OPS-xxx`, `SP-S2-QA-xxx`, `SP-S2-ANPR-xxx`), 100% gắn nhãn `Sprint 02` và nhãn phân hệ.
10. **`10. Sprint 01 Done`**: 27 thẻ hoàn chỉnh (`SP-S1-UI-xxx`, `SP-S1-OPS-xxx`, `SP-S1-SEC-xxx`, `SP-S1-BKG-xxx`, `SP-S1-PAY-xxx`, `SP-S1-DAT-xxx`, `SP-S1-SAGA-xxx`), 100% gắn nhãn `Sprint 01`.
11. **`03 - Project Risks` & `04 - Project Improvements`**: Toàn bộ 12 thẻ rủi ro và cải tiến đã được gắn nhãn mức độ ưu tiên (`P0`, `P1`, `P2`) và miền kỹ thuật (`Security`, `Payment`, `CI/CD`, `Improvement`).

