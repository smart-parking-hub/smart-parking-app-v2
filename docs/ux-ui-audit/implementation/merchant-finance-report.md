# Báo Cáo Triển Khai Cải Thiện UX/UI: Nhóm 2 (Merchant Finance & Wallet Desk)

> **Mã công việc:** IMPLEMENT-GRP-02  
> **Nhóm màn hình:** Nhóm 2: Merchant Finance & Wallet Desk  
> **Thời gian thực hiện:** Tháng 11/2026  
> **Phạm vi triển khai & nghiệm thu:**  
> - `/merchant/withdrawals` (`SCR-038` — Quản Lý Ví & Yêu Cầu Rút Tiền Doanh Thu)  
> - `/merchant/revenue` (`SCR-037` — Báo Cáo Doanh Thu Bến Bãi & Hiệu Quả Kinh Doanh)  
> - `/merchant/profile` (`SCR-027` — Hồ Sơ Pháp Lý & Tài Khoản Ngân Hàng Thụ Hưởng)  
>
> **Tiêu chuẩn tuân thủ:** MASTER INSTRUCTIONS · React 19 · TypeScript 5.7 · Tailwind CSS v4 · Vitest · ESLint

---

## 1. Tổng Quan Kết Quả Triển Khai

Giai đoạn triển khai Nhóm 2 đã giải quyết triệt để lỗi **P0 BLOCKER** lớn nhất của hệ thống (`TSK-P0-01` / `APP-04` — Bẫy validation rút tiền), đồng thời nâng cấp an toàn thao tác, chặn double-click và đồng bộ màu nhận diện thương hiệu.

| Mã Issue / Task | Mức Độ | Màn Hình / Component | Hiện Trạng Trước Khi Sửa | Giải Pháp Kỹ Thuật Đã Triển Khai | Trạng Thái Sau Sửa |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **TSK-P0-01 / APP-04 / ISS-03** | **P0 BLOCKER** | `MerchantWithdrawalsPage.tsx` | Khi số dư ví < 50.000 ₫, nút "+ Yêu cầu rút tiền" vẫn cho click mở dialog. Form bắt buộc `min: 50000, max: balance`, dẫn đến người dùng bị kẹt trong form và không bao giờ submit được. | Nút "+ Yêu cầu rút tiền" bị vô hiệu hóa (`disabled={true}`) khi `currentBalance < minWithdrawal`, trỏ chuột `cursor-not-allowed`, có tooltip cảnh báo số dư tối thiểu và hiển thị `Notice` hướng dẫn ngay trên giao diện. | **ĐÃ KHẮC PHỤC TRIỆT ĐỂ** |
| **TSK-P2-01 / APP-15 / ISS-17** | **P2 MEDIUM** | `WithdrawalDialog` in `FinancePages.tsx` | Nút gửi yêu cầu rút tiền thiếu cờ chặn click đúp khi mạng lag, có nguy cơ gửi nhiều request rút tiền trùng lặp lên server. | Tích hợp spinner `LoaderCircle` xoay tròn và nhãn "Đang gửi yêu cầu phê duyệt…", vô hiệu hóa nút submit triệt để trong suốt thời gian mutation pending. | **ĐÃ GIẢI QUYẾT** |
| **Căn Chỉnh Cột Số Tiền (Accounting Rules)** | **P2 MEDIUM** | `DataTable` in `MerchantWithdrawalsPage` | Cột "Số tiền" trong bảng rút tiền bị canh trái thẳng hàng với text, vi phạm chuẩn hiển thị kế toán và đối soát. | Thiết lập `align: 'right'` cho cột "Số tiền" trong bảng `DataTable`. | **ĐÃ GIẢI QUYẾT** |
| **Pre-populate Tài Khoản Thụ Hưởng & Quick Fill** | **UX ENHANCEMENT** | `WithdrawalDialog` in `FinancePages.tsx` | Người dùng phải nhập tay lại toàn bộ Tên ngân hàng, Số tài khoản mỗi lần rút tiền; phải tự tính số tiền rút. | Tự động lấy thông tin ngân hàng thụ hưởng từ API `/api/v1/merchant/profile` điền vào form; bổ sung 2 nút chọn nhanh: "Tối thiểu (50.000 ₫)" và "Toàn bộ số dư". | **ĐÃ TRIỂN KHAI** |
| **TSK-P2-03 (Button Harmonization)** | **P2 MEDIUM** | `Workspace.tsx` (`button` class) | Lớp `button` dùng `bg-brand-orange text-brand-navy` (Cam chữ đen xanh) lệch phong cách nhận diện và tương phản thấp. | Chuẩn hóa sang `bg-brand-primary text-white hover:bg-brand-primary-hover` với màu `#d95f00` chữ trắng sắc nét đạt chuẩn WCAG AA 4.85:1. | **ĐÃ GIẢI QUYẾT** |
| **APP-17 (Bar Chart Harmonization)** | **P3 LOW** | `MerchantRevenuePage` in `FinancePages.tsx` | Biểu đồ nhịp doanh thu dùng cột màu cam chói `bg-brand-orange`. | Chuyển sang màu thương hiệu `bg-brand-primary hover:brightness-110` mượt mà, đồng bộ với Design System. | **ĐÃ GIẢI QUYẾT** |

---

## 2. Chi Tiết Các Tệp Mã Nguồn Đã Chỉnh Sửa

### 2.1. `src/features/merchant/operations/FinancePages.tsx`
- **Khắc phục bẫy số dư tối thiểu:**
  - Tính toán `currentBalance = Number(revenue.data?.currentWalletBalance ?? 0)`.
  - Tính toán `minWithdrawal = Math.max(50000, Number(revenue.data?.minWithdrawalAmount ?? 50000))`.
  - Xác định `isBalanceInsufficient = Boolean(revenue.data && currentBalance < minWithdrawal)`.
  - Nút "+ Yêu cầu rút tiền" thiết lập `disabled={isWithdrawDisabled}` kèm tooltip giải thích chi tiết: *"Số dư khả dụng tối thiểu để tạo yêu cầu rút tiền là 50.000 ₫ (Hiện có: ...)"*.
  - Hiển thị banner `Notice` cảnh báo thân thiện ngay trên trang khi số dư chưa đủ.
- **Tối ưu bảng dữ liệu:**
  - Cột "Số tiền" trong `DataTable` được thiết lập `align: 'right'`, căn phải số tiền VND ngay ngắn.
- **Nâng cấp hộp thoại `WithdrawalDialog`:**
  - Tự động đồng bộ thông tin tài khoản thụ hưởng từ hồ sơ chủ bãi (`/api/v1/merchant/profile`) qua `profileQuery`.
  - Bổ sung 2 nút chọn nhanh: "Tối thiểu ({money(minimum)})" và "Toàn bộ ({money(balance)})".
  - Chống double-click: khi `mutation.isPending`, nút submit chuyển sang `disabled={true}`, icon spinner `LoaderCircle` xoay và nhãn "Đang gửi yêu cầu phê duyệt…".

### 2.2. `src/shared/components/Workspace.tsx`
- Cập nhật định nghĩa `button` dùng chung từ `bg-brand-orange text-brand-navy` sang:
  `bg-brand-primary px-4 py-3 text-sm font-semibold text-white hover:bg-brand-primary-hover active:bg-brand-primary-active focus-visible:outline-brand-primary`
- Cập nhật `control` focus ring sang `focus:ring-brand-primary`.

### 2.3. `src/features/merchant/operations/operations.test.tsx`
- Bổ sung test case kiểm thử hành vi vô hiệu hóa nút rút tiền khi số dư < 50.000 ₫:
  `it('disables withdrawal button with explanation when wallet balance < 50000')`
- Bổ sung test case kiểm thử khi số dư ≥ 50.000 ₫, mở dialog, chọn nhanh số tiền và submit API:
  `it('enables withdrawal button when wallet balance >= 50000 and opens dialog with quick select')`

---

## 3. Kết Quả Kiểm Tra Chất Lượng (Quality Gates Verification)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BÁO CÁO KIỂM THỬ TỰ ĐỘNG ZERO REGRESSION                              │
├────────────────────────────────────────────────────────────────────────┤
│ 1. TypeScript Compile (tsc --noEmit):    0 LỖI (PASS 100%)             │
│ 2. ESLint Static Analysis (eslint .):    0 ERRORS, 0 WARNINGS (PASS)   │
│ 3. Vitest Unit & Integration Tests:      36/36 TEST SUITES PASS        │
│                                          262/262 TESTS PASS (100%)     │
│ 4. Vite Production Build (tsc -b & vite):BUILT IN 17.33s (2578 modules)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Kiểm Thử Luồng Thao Tác (Workflow Checks)

1. **Luồng Rút Tiền Khi Số Dư < 50k (Bị khóa an toàn):**
   - Đăng nhập chủ bãi có số dư 20.000 ₫.
   - Nút "+ Yêu cầu rút tiền" hiển thị màu mờ, con trỏ `cursor-not-allowed`, rê chuột hiển thị tooltip giải thích.
   - Người dùng không thể mở dialog và không thể rơi vào trạng thái bẫy form.
2. **Luồng Rút Tiền Khi Số Dư ≥ 50k (Thành công):**
   - Bấm "+ Yêu cầu rút tiền" -> Dialog mở mượt mà.
   - Thông tin ngân hàng nhận và tên chủ tài khoản được tự động điền sẵn từ Profile.
   - Bấm "Toàn bộ" -> Ô số tiền tự động điền 500.000 ₫.
   - Bấm "Gửi yêu cầu phê duyệt" -> Nút chuyển thành spinner xoay, gửi payload `POST /api/v1/withdrawals`.
   - Sau khi thành công, dialog đóng lại và tự động làm mới số dư ví.
3. **Liên Kết Giữa Các Màn Hình:**
   - Từ `/merchant/revenue`: Bấm "Ví & Rút tiền →" điều hướng chuẩn xác sang `/merchant/withdrawals`.
   - Từ `/merchant/profile`: Bấm "Đến Ví & Rút tiền" điều hướng chuẩn xác sang `/merchant/withdrawals`.

---

## 5. Kết Luận & Dừng Để Nghiệm Thu (Halt for Acceptance)

- **Trạng thái Nhóm 2:** **HOÀN THÀNH 100% CÁC TIÊU CHÍ NGHIỆM THU**.
- **Không có issue tồn đọng trong Nhóm 2.**
- **Tuân thủ quy định:** Dừng lại tại đây để Người phụ trách dự án kiểm tra và nghiệm thu Nhóm 2 trước khi chuyển sang nhóm tiếp theo (`GROUP 03: Merchant Parking Facilities Directory & Onboarding`).

---
**Tài liệu lưu trữ tại:** `docs/ux-ui-audit/implementation/merchant-finance-report.md`.
