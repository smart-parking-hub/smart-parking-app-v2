# Đặc Tả Màn Hình SCR-048: AdminWithdrawalsPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-048`
- **Tên màn hình:** Quản lý duyệt chi rút tiền (Merchant Withdrawal Approvals Desk)
- **URL Route / Path:** `/admin/withdrawals` (được cấu hình tại [`AppRoutes.tsx:103`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L103))
- **Quyền truy cập (RBAC):** Bắt buộc Role `ADMIN` ([`AppRoutes.tsx:95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L95))
- **Mục tiêu nghiệp vụ:** Trạm kiểm soát tài chính cấp cao: Kiểm tra tính hợp lệ của tài khoản ngân hàng thụ hưởng, số dư khả dụng thực tế của Merchant trước khi thực hiện ủy nhiệm chi hoặc từ chối hoàn trả tiền về ví cho Merchant.
- **Actor chính:** System Administrator (Quản trị viên tài chính / Duyệt chi).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

1. **Header trang (`AdminPageHeader`):**
   - Eyebrow: `QUẢN LÝ RÚT TIỀN`
   - Tiêu đề: `Yêu cầu rút tiền`
   - Mô tả: `Kiểm tra số dư, tài khoản nhận và lịch sử giao dịch trước khi duyệt chi.`
2. **Thanh công cụ lọc & tìm kiếm (`.admin-toolbar`):**
   - Ô tìm kiếm text (`Input prefix={<SearchOutlined />} allowClear`): Tìm theo mã yêu cầu rút (`WD-XXX`), tên Merchant hoặc số điện thoại.
   - Hộp chọn trạng thái (`Select`):
     - `ALL`: Tất cả trạng thái
     - `PENDING`: Chờ xử lý
     - `APPROVED`: Đã duyệt
     - `REJECTED`: Đã từ chối
   - Nhãn đếm tổng số yêu cầu (`visible.length yêu cầu`).
3. **Bảng danh sách yêu cầu rút tiền (`Table`):**
   - Cột 1: Yêu cầu (Mã `WD-XXX` in đậm + Ngày giờ yêu cầu in nhỏ)
   - Cột 2: Merchant (Tên chủ bãi in đậm + Số điện thoại liên hệ)
   - Cột 3: Số tiền yêu cầu rút (VND, căn lề phải)
   - Cột 4: Số dư khả dụng hiện tại (VND, căn lề phải để đối chiếu an toàn)
   - Cột 5: Ngân hàng thụ hưởng (Tên ngân hàng + Số tài khoản đã che mặt nạ)
   - Cột 6: Trạng thái (Render qua `AdminStatusTag`: Vàng cho PENDING, Xanh cho APPROVED, Đỏ cho REJECTED)
   - Cột 7: Thao tác (Cụm 2 nút nếu là `PENDING`, hiển thị lý do nếu đã xử lý)
4. **Modal xác nhận duyệt chi / từ chối (`Modal`):**
   - Tiêu đề: "Duyệt yêu cầu rút tiền" hoặc "Từ chối yêu cầu rút tiền".
   - Tóm tắt đối chiếu: `[Tên Merchant] yêu cầu rút [Số tiền VND]`.
   - Ô nhập văn bản ghi chú đối soát: `Input.TextArea autoFocus maxLength={500} showCount rows={4} placeholder="Nhập kết quả đối soát hoặc lý do từ chối"`.

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tải trang ban đầu | Lifecycle Hook | Truy cập trang | Role `ADMIN` | Gọi API lấy 200 lệnh rút tiền | `GET /api/v1/admin/withdrawals?page=0&size=200` | Hiển thị bảng duyệt chi | [`AdminWithdrawalsPage.tsx:19`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/withdrawals/AdminWithdrawalsPage.tsx#L19), [`adminRepository.ts:252-255`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/api/adminRepository.ts#L252-L255) |
| Ô tìm kiếm | Text Input | Nhập mã/tên/SĐT | Bất kỳ lúc nào | Lọc danh sách tức thời tại Client | Không gọi API | Bảng hiển thị lệnh rút phù hợp | [`AdminWithdrawalsPage.tsx:20`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/withdrawals/AdminWithdrawalsPage.tsx#L20) |
| Bộ lọc trạng thái | Select Dropdown | Chọn trạng thái | Bất kỳ lúc nào | Lọc danh sách theo trường `status` tại Client | Không gọi API | Bảng hiển thị lệnh rút thuộc status đó | [`AdminWithdrawalsPage.tsx:20`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/withdrawals/AdminWithdrawalsPage.tsx#L20) |
| Nút "Duyệt" | Primary Button | Click nút Duyệt trên hàng | `item.status === 'PENDING'` | Mở Modal duyệt chi | Không gọi API | `decision = 'APPROVED'`, Modal mở | [`AdminWithdrawalsPage.tsx:30`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/withdrawals/AdminWithdrawalsPage.tsx#L30) |
| Nút "Từ chối" | Danger Button | Click nút Từ chối trên hàng | `item.status === 'PENDING'` | Mở Modal từ chối chi | Không gọi API | `decision = 'REJECTED'`, Modal mở | [`AdminWithdrawalsPage.tsx:30`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/withdrawals/AdminWithdrawalsPage.tsx#L30) |
| Nút "Xác nhận" Modal | Modal Confirm | Click Xác nhận | `note.trim().length > 0` | Gọi API duyệt chi hoặc từ chối hoàn ví | `PUT /api/v1/admin/withdrawals/{id}/approve`<br>hoặc `/reject`<br>Body: `{ reason: note }` | Cập nhật UI, hiển thị Toast, tự động hoàn tiền nếu từ chối | [`AdminWithdrawalsPage.tsx:22`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/withdrawals/AdminWithdrawalsPage.tsx#L22), [`WithdrawalServiceImpl.java:55-110`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/WithdrawalServiceImpl.java#L55-L110) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Hiển Thị | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Validation | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|---|---|---|---|
| `code` | Yêu cầu | `string` | Có | Định dạng `WD-{id}` | Tự động sinh từ ID | Mã định danh lệnh rút |
| `merchantName` + `merchantPhone` | Merchant | `string` | Có | Tên chủ bãi và số điện thoại | `Merchant.user.fullName`, `phone` | Chủ thể rút tiền |
| `amount` | Số tiền | `BigDecimal` | Có | Số tiền $\ge 10.000$ VNĐ | `WithdrawalRequest.amount` | Tiền yêu cầu chi |
| `availableBalance` | Số dư | `BigDecimal` | Có | Số dư khả dụng của ví Merchant | `Merchant.walletBalance` | Đối soát chống rút lố |
| `bankName` + `maskedBankAccount` | Ngân hàng | `string` | Có | Tên ngân hàng và STK che 4 số cuối | `Merchant.bankName`, `bankAccountNum` | Điểm đến dòng tiền |
| `status` | Trạng thái | `enum` | Có | `PENDING`, `APPROVED`, `REJECTED`, `PAID` | `WithdrawalRequest.status` | Trạng thái duyệt chi |
| `decisionReason` | Ghi chú / Lý do | `string` | Có (khi duyệt) | Tối đa 500 ký tự (FE) / 1000 ký tự (BE) | `AdminDecisionRequest.reason` | Ghi vào `AuditLog` |

---

## E. TRẠNG THÁI UI (UI States)

1. **Loading State:** Khi `loading === true`, hiển thị `<Skeleton active />` ([`AdminWithdrawalsPage.tsx:32`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/withdrawals/AdminWithdrawalsPage.tsx#L32)).
2. **Success State:** Hiển thị danh sách các lệnh rút tiền kèm nút thao tác trực quan.
3. **Empty State:** Khi không có yêu cầu nào phù hợp bộ lọc, hiển thị `<Empty description="Không có yêu cầu phù hợp" />` ([`AdminWithdrawalsPage.tsx:32`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/withdrawals/AdminWithdrawalsPage.tsx#L32)).
4. **Already Processed Row State:** Nếu dòng đã được duyệt hoặc từ chối (`status !== 'PENDING'`), cột thao tác không hiển thị 2 nút bấm mà hiển thị trực tiếp nội dung ghi chú đối soát (`item.reviewNote ?? 'Đã xử lý'`).

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 1024\text{px}$):** Bảng hiển thị 7 cột đầy đủ, lề phải căn chuẩn tiền tệ.
- **Mobile / Tablet ($< 768\text{px}$):** Thanh toolbar dàn dọc. Bảng kích hoạt cuộn ngang đảm bảo không làm gãy cột số tài khoản ngân hàng và cụm nút bấm thao tác.
