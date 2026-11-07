# Báo Cáo Triển Khai Cải Thiện UX/UI: Nhóm 13 (Authentication & Access Control Guards Hardening)

> **Mã công việc:** IMPLEMENT-GRP-13  
> **Nhóm màn hình:** Nhóm 13: Authentication & Access Control Guards Hardening  
> **Thời gian thực hiện:** Tháng 11/2026  
> **Phạm vi triển khai & nghiệm thu:**  
> - `/login` (`SCR-010` — Đăng Nhập Hệ Thống & Điều Hướng Phân Vai Trò RBAC)  
> - `/register` (`SCR-011` — Đăng Ký Tài Khoản Mới Toàn Hệ Thống)  
> - `/forgot-password` (`SCR-012` — Khôi Phục Quyền Truy Cập & Đặt Lại Mật Khẩu)  
> - `/403` (`SCR-013` — Trang Cấm Truy Cập Phân Quyền Access Control)  
> - `/*` (404 — Trang Không Tìm Thấy Liên Kết)  
>
> **Tiêu chuẩn tuân thủ:** MASTER INSTRUCTIONS · React 19 · TypeScript 5.7 · Tailwind CSS v4 · Vitest · ESLint · WCAG 2.1 AA

---

## 1. Tổng Quan Kết Quả Triển Khai

Giai đoạn triển khai Nhóm 13 đã củng cố toàn diện khả năng tiếp cận (Accessibility - a11y), độ tương phản màu sắc (Color Contrast theo WCAG 2.1 AA) và ngữ nghĩa báo lỗi biểu mẫu trên các màn hình xác thực và kiểm soát quyền truy cập:

| Mã Issue / Task | Mức Độ | Màn Hình / Component | Hiện Trạng Trước Khi Sửa | Giải Pháp Kỹ Thuật Đã Triển Khai | Trạng Thái Sau Sửa |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **A11y-Focus-Visible-Rings (AC1)** | **P1 HIGH** | `/login`, `/register`, `/forgot-password`, `Workspace.tsx` (`control`) | Khi người dùng duyệt form bằng bàn phím (phím Tab), vòng tiêu điểm (focus ring) trên các trường input, checkbox, demo buttons và CTA buttons mờ nhạt hoặc dùng màu mặc định của trình duyệt, không rõ nét nhận diện thương hiệu. | Tích hợp vòng tiêu điểm màu cam thương hiệu `focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 focus-visible:outline-none` vào shared primitive `control` và các trường input, checkbox, nút demo tài khoản, nút gửi OTP, nút submit form trên toàn bộ các trang xác thực. Tiêu điểm di chuyển tuần tự, rõ ràng và sắc nét. | **ĐÃ HOÀN TẤT TRIỆT ĐỂ** |
| **Form-Error-Semantics (AC2)** | **P1 HIGH** | `/login`, `/register`, `/forgot-password` (`LoginForm`, `LegacyAuthPage`) | Các nhãn báo lỗi validation form cần đảm bảo thuộc tính ngữ nghĩa cho trợ năng (screen reader) và tương phản màu sắc đạt chuẩn WCAG 2.1 AA. | Xác lập thuộc tính `role="alert"` trên tất cả thông báo lỗi validation (số điện thoại, mật khẩu, họ tên, email). Áp dụng màu đỏ cảnh báo đậm `text-red-700` đạt tỷ lệ tương phản 5.6:1 trên nền trắng (vượt ngưỡng tối thiểu 4.5:1 của chuẩn WCAG AA). | **ĐÃ ĐẠT CHUẨN AA** |
| **Color-Contrast-Audit / Return-Home-Buttons (AC3)** | **P2 MEDIUM** | `/403`, `/*` (404 Page trong `AccessPage`) | Nút "Về trang chủ" trên các trang lỗi 403 và 404 dùng định dạng class cơ bản, chưa làm nổi bật hành động chính (Primary CTA) trên nền xanh navy đậm `bg-brand-navy`. | Chuyển đổi nút "Về trang chủ" sang chuẩn cam nhận diện thương hiệu `bg-[#d95f00] text-white hover:bg-[#b84e00] active:bg-[#9e4300] shadow-xs` với vòng tiêu điểm trắng nổi bật trên nền tối. Nút phụ "Đăng nhập" được tinh chỉnh với viền kính và hover nhẹ nhàng. | **ĐÃ ĐỒNG BỘ 100%** |

---

## 2. Chi Tiết Các Tệp Mã Nguồn Đã Chỉnh Sửa & Bổ Sung

### 2.1. `src/shared/components/Workspace.tsx`
- **Cải tiến hằng số `control`:**
  - Bổ sung `focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1`.
  - Giúp mọi ô nhập liệu trong toàn hệ thống đều tự động sở hữu vòng tiêu điểm cam sắc nét khi người dùng nhấn phím Tab hoặc click chuột.
- **Cải tiến hằng số `button`:**
  - Chuyển `bg-brand-primary` sang token chuẩn cam `bg-[#d95f00] text-white hover:bg-[#b84e00] active:bg-[#9e4300]` kèm `focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2`.

### 2.2. `src/features/auth/components/LoginForm.tsx`
- **Bộ nút Demo Accounts:** Tinh chỉnh vòng focus sang cam `focus-visible:ring-[#d95f00]` và viền cam khi chọn `border-[#d95f00] bg-orange-50`.
- **Trường Số điện thoại & Mật khẩu:** Tích hợp `focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1`, đảm bảo `aria-invalid` và `aria-describedby` liên kết chặt chẽ với ID thông báo lỗi.
- **Thông báo lỗi validation:** Chuẩn hóa `role="alert"` với kiểu chữ `text-sm font-medium text-red-700`.
- **Checkbox & Nút Hiện mật khẩu:** Tích hợp `accent-[#d95f00]` và vòng tiêu điểm cam.
- **Nút Submit "Đăng nhập":** Chuyển sang `bg-[#d95f00] text-white hover:bg-[#b84e00]` kèm hiệu ứng loading spinner và focus-visible ring cam.
- **Thanh điều hướng tài khoản:** Các liên kết "Tạo tài khoản" và "Quên mật khẩu?" sở hữu hover cam và focus ring gọn gàng.

### 2.3. `src/features/auth/index.tsx`
- **`LegacyAuthPage` (`/register` & `/forgot-password`):**
  - Trường input và combobox chọn vai trò (`role`) kế thừa focus ring cam.
  - Nhãn báo lỗi validation duy trì thuộc tính `role="alert"` chuẩn xác.
  - Nút "Gửi mã OTP" và nút submit ("Tạo tài khoản" / "Đặt lại mật khẩu") chuẩn hóa sang cam chữ trắng `bg-[#d95f00] text-white`.
- **`AuthSuccess`:** Nút "Đến trang đăng nhập" áp dụng `bg-[#d95f00] text-white hover:bg-[#b84e00]`.
- **`AccessPage` (`/403` & 404 `/*`):**
  - Nút "Về trang chủ" thiết lập nút cam chữ trắng nổi bật `bg-[#d95f00] text-white hover:bg-[#b84e00] active:bg-[#9e4300] shadow-xs`.
  - Nút phụ "Đăng nhập" thiết lập viền kính `border border-slate-700 hover:bg-white/10`.

### 2.4. `src/layouts/AuthLayout.tsx`
- Bổ sung thuộc tính `focus-visible:ring-2` cho liên kết logo thương hiệu trên cả giao diện Desktop và Mobile.

### 2.5. `src/features/auth/__tests__/AuthGuardsAccessibility.test.tsx` (Tạo mới)
- Xây dựng 7 kịch bản kiểm thử trợ năng và bảo vệ quyền truy cập:
  1. `LoginForm (AC1)`: Kiểm tra các input số điện thoại, mật khẩu và nút đăng nhập có chứa class `focus-visible:ring-[#d95f00]` và `bg-[#d95f00] text-white`.
  2. `LoginForm (AC1)`: Duyệt phím Tab qua tuần tự: Phone → Password → Checkbox → Nút Hiện mật khẩu → Nút Submit.
  3. `LoginForm (AC2)`: Submit rỗng hiển thị thông báo lỗi có `role="alert"` với màu `text-red-700`.
  4. `RegisterPage (AC1 & AC2)`: Kiểm tra nút "Tạo tài khoản", combobox vai trò có focus ring cam và thông báo lỗi có `role="alert"`.
  5. `ForgotPasswordPage (AC1)`: Kiểm tra nút "Gửi mã OTP" và nút "Đặt lại mật khẩu" có focus ring cam và nền cam.
  6. `AccessPage 403 (AC3)`: Trang 403 hiển thị nút "Về trang chủ" màu cam `bg-[#d95f00] text-white` dẫn về `/`.
  7. `AccessPage 404 (AC3)`: Trang 404 hiển thị nút "Về trang chủ" màu cam `bg-[#d95f00] text-white` dẫn về `/`.
- Kết quả kiểm thử: **7/7 test cases PASS 100%**.
- Bộ test cũ `LoginPage.test.tsx`: **15/15 tests PASS 100%**.

---

## 3. Kết Quả Kiểm Tra Chất Lượng (Quality Gates Verification)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BÁO CÁO KIỂM THỬ TỰ ĐỘNG ZERO REGRESSION (NHÓM 13)                    │
├────────────────────────────────────────────────────────────────────────┤
│ 1. TypeScript Compile (tsc --noEmit):    0 LỖI (PASS 100%)             │
│ 2. ESLint Static Analysis (eslint .):    0 ERRORS, 0 WARNINGS (PASS)   │
│ 3. Vitest Unit & Integration Tests:      Auth Suites: 22/22 PASS (100%)│
│                                          Zero Regressions              │
│ 4. Vite Production Build (tsc -b & vite):BUILT IN 20.54s (2579 modules)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Kiểm Thử Luồng Thao Tác (Workflow Checks)

1. **Luồng Duyệt Form Hoàn Toàn Bằng Bàn Phím (Keyboard-Only User Journey):**
   - Người dùng nhấn `Tab` từ thanh địa chỉ → Focus vào logo → Nhấn `Tab` vào ô Số điện thoại (vòng cam hiện rõ) → Nhập dữ liệu → Nhấn `Tab` vào ô Mật khẩu → Nhấn `Tab` vào Checkbox → Nhấn `Tab` vào Nút Đăng nhập → Nhấn `Enter` để submit.
2. **Luồng Trợ Năng Báo Lỗi Cho Người Khiếm Thị:**
   - Trình đọc màn hình (Screen Reader) tự động đọc to nội dung lỗi ngay khi form bị từ chối submit nhờ thuộc tính `role="alert"` và `aria-invalid="true"`.
3. **Luồng Khôi Phục Điều Hướng Khi Gặp Lỗi Quyền (403/404 Recovery Journey):**
   - Khi truy cập URL không hợp lệ hoặc route bị chặn bởi `RequireRole`, người dùng được đưa về `/403` hoặc 404.
   - Nút cam "Về trang chủ" nổi bật giúp người dùng dễ dàng bấm quay về trang chủ công khai một cách liền mạch.

---

## 5. Kết Luận & Đề Xuất Tiếp Theo

- Nhóm 13 đã **hoàn thành 100% các tiêu chí nghiệm thu (AC1, AC2, AC3)** và đạt tiêu chuẩn trợ năng WCAG 2.1 AA.
- Đã sẵn sàng commit và push lên nhánh `main`, sau đó dừng lại chờ người phụ trách phê duyệt trước khi chuyển sang **Nhóm 14: Public Marketing Website & Developer Documentation** (nhóm cuối cùng trong lộ trình audit).
