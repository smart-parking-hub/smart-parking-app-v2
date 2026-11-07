# Screen Specification: SCR-038 MerchantWithdrawalsPage (Quản lý ví & Rút tiền)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-038`
- **Screen Name:** Quản lý số dư ví & Yêu cầu giải ngân rút tiền (Merchant Wallet & Withdrawals)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/withdrawals` (Định nghĩa tại [`AppRoutes.tsx:131`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L131) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantWithdrawalsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/withdrawals/pages/MerchantWithdrawalsPage.tsx)
- **Sub-components:**
  - `SCR-MOD-05`: Hộp thoại xác nhận gửi yêu cầu rút tiền (`Modal.confirm`)
  - Ant Design: `Statistic`, `Form`, `Input`, `InputNumber`, `Table`, `Tag`, `Alert`, `Button`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cho phép Merchant theo dõi số dư ví tiền mặt khả dụng thực tế (`walletBalance`) sau khi hệ thống đã trừ phí dịch vụ nền tảng (Platform fee 5%).
2. Cung cấp giao diện tạo lệnh yêu cầu rút tiền (Withdrawal Request) về tài khoản ngân hàng đã đăng ký trong hồ sơ pháp lý.
3. Thiết lập chốt an toàn nghiệp vụ: Kiểm tra số tiền rút tối thiểu (`minWithdrawalAmount` = 100.000 ₫) và không vượt quá số dư khả dụng hiện có trong ví.
4. Theo dõi minh bạch lịch sử và tiến độ giải ngân của từng yêu cầu qua các trạng thái: Chờ duyệt (`PENDING`), Đã duyệt (`APPROVED`), Từ chối (`REJECTED`), hoặc Đã chi tiền (`PAID`).

### B. Target Users
- Chủ bãi đỗ xe thực hiện thanh toán rút tiền định kỳ vào cuối tuần hoặc cuối tháng.

### C. Entry Points
- Click mục "Rút tiền" trên Sidebar menu của `MerchantLayout`.
- Click nút "Yêu cầu rút tiền" từ Báo cáo doanh thu (`SCR-037`).

### D. Exit Points
- Chuyển sang mục "Hồ sơ" (`SCR-027`) nếu cần cập nhật lại số tài khoản ngân hàng thụ hưởng.

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang
- Tiêu đề H1: `Ví và rút tiền`.
- Mô tả phụ: `Tạo yêu cầu rút doanh thu về tài khoản ngân hàng đã đăng ký.`
- Nút hành động: `Tải lại` (icon `ReloadOutlined`).

### B. Lưới Thông Tin Ví & Form Tạo Yêu Cầu (.merchant-withdrawal-grid)
Bố cục 2 khối song song:
1. **Khối Thông Tin Số Dư Ví (.merchant-detail-card):**
   - Chỉ số `Statistic`: Tiêu đề `Số dư khả dụng`, icon `WalletOutlined`, hiển thị giá trị tiền tệ VND lớn (ví dụ: `12.500.000 ₫`).
   - Đoạn văn bản chính sách: `Số dư là tiền net sau phí hệ thống {platformFeePercent}%. Rút tối thiểu {formatMoney(minWithdrawalAmount)}. Admin duyệt rồi chuyển khoản thủ công.`
2. **Khối Form Tạo Yêu Cầu Rút Tiền (SCR-MOD-05):**
   - **Số tiền rút (`amount`):** `InputNumber`, min 100.000 ₫, max bằng số dư ví, tự động định dạng dấu chấm hàng nghìn (ví dụ: `5.000.000 VND`), icon `DollarOutlined`.
   - **Ngân hàng thụ hưởng (`bankName`):** Input text, bắt buộc.
   - **Số tài khoản (`bankAccountNum`):** Input text, bắt buộc.
   - **Tên chủ tài khoản (`accountHolderName`):** Input text, bắt buộc.
   - **Ghi chú (`note`):** TextArea không bắt buộc.
   - **Nút gửi:** Nút Primary to bản `Tạo yêu cầu rút tiền` (icon `SendOutlined`, loading `{submitting}`).

### C. Bảng Lịch Sử Yêu Cầu Rút Tiền (Withdrawal History Table)
Bảng Ant Design `Table`:
- Cột 1: **Mã yêu cầu** - Hiển thị `#id`.
- Cột 2: **Số tiền** - Định dạng tiền tệ VND in đậm.
- Cột 3: **Trạng thái:**
  - `PENDING`: Tag màu vàng `Chờ duyệt`.
  - `APPROVED`: Tag màu xanh lá `Đã duyệt`.
  - `REJECTED`: Tag màu đỏ `Từ chối`.
  - `PAID`: Tag màu xanh dương `Đã chi`.
- Cột 4: **Tài khoản nhận** - Hiển thị `Ngân hàng - Số tài khoản đã che`.
- Cột 5: **Thời gian gửi** - Ngày giờ gửi yêu cầu (`dd/MM/yyyy HH:mm`).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-038-01** | Xem số dư ví và lịch sử | Mở trang `/merchant/withdrawals` | Token Merchant | Đã đăng nhập vai trò MERCHANT | Tải số dư ví khả dụng và bảng 20 giao dịch rút tiền gần nhất |
| **FN-038-02** | Nhập số tiền rút | Nhập vào ô `Số tiền` | Số tiền (VND) | Số tiền >= 100.000 ₫ và <= số dư ví | Hiển thị định dạng dấu chấm phân cách hàng nghìn |
| **FN-038-03** | Xác nhận gửi yêu cầu | Bấm `Tạo yêu cầu rút tiền` | Amount, ngân hàng, STK, chủ TK, ghi chú | Dữ liệu hợp lệ | Bật Modal SCR-MOD-05 xác nhận; gửi API tạo yêu cầu, trừ số dư ví nháp, reload bảng |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `GET /api/v1/merchant/revenue`: Lấy `walletBalance`, `minWithdrawalAmount`, `platformFeePercent`.
2. `GET /api/v1/withdrawals`: Lấy danh sách yêu cầu rút tiền của Merchant.
3. `POST /api/v1/withdrawals`: Tạo yêu cầu rút tiền mới.

### B. Controller & Method
- [`WithdrawalController.java:20-33`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/WithdrawalController.java#L20-L33):
  - `requestWithdrawal(@AuthenticationPrincipal CustomUserDetails u, @Valid @RequestBody CreateWithdrawalRequestDto req)` -> `@PreAuthorize("hasRole('MERCHANT')")`
  - `getMyWithdrawals(@AuthenticationPrincipal CustomUserDetails u, Pageable pageable)` -> `@PreAuthorize("hasRole('MERCHANT')")`

### C. Service Implementation
- [`WithdrawalServiceImpl.requestWithdrawal()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/WithdrawalServiceImpl.java):
  - Kiểm tra số dư ví: `wallet.getBalance().compareTo(request.getAmount()) >= 0`. Nếu không đủ, ném `BadRequestException("Số dư ví không đủ để thực hiện yêu cầu!")`.
  - Khóa tạm số dư khả dụng (trừ balance hoặc chuyển sang holdBalance).
  - Tạo bản ghi `Withdrawal` ở trạng thái `WithdrawalStatusEnum.PENDING`.
  - Gửi thông báo đến Quản trị viên hệ thống để thực hiện giải ngân thủ công.

---

## 6. UI STATES & ERROR HANDLING

- **Validation Errors:**
  - Nhập số tiền nhỏ hơn `minWithdrawalAmount`: Báo lỗi *"Số tiền rút tối thiểu là 100.000 ₫"*.
  - Nhập số tiền lớn hơn số dư ví: Báo lỗi *"Số tiền vượt quá số dư ví hiện có"*.
- **Confirmation Modal:** Chặn việc vô tình bấm nhầm bằng hộp thoại xác nhận số tiền và cảnh báo kiểm tra kỹ số tài khoản ngân hàng.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Ràng buộc số dư ví không âm:** Bắt buộc phải khóa số dư hoặc kiểm tra bi quan dưới cơ sở dữ liệu để ngăn chặn tình trạng tạo 2 yêu cầu rút tiền cùng lúc vượt quá số dư thực tế.
2. **Quy trình duyệt thủ công an toàn:** Lệnh rút tiền ở trạng thái `PENDING` bắt buộc phải qua bước Admin thẩm định đối soát trước khi chuyển khoản.

### B. Đề Xuất Cải Thiện
1. **Tự động điền tài khoản từ Hồ sơ:** Tự động lấy `bankName`, `bankAccountNum`, `accountHolderName` đã lưu tại `SCR-027` để Merchant không phải gõ lại số tài khoản mỗi lần rút tiền.
2. **Rút tiền tự động qua API VietQR / PayOS Payout:** Tích hợp cổng chi hộ tự động để giải ngân ngay lập tức cho các khoản tiền nhỏ dưới 2.000.000 ₫.
