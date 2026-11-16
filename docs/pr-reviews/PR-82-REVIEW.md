# Báo Cáo Đánh Giá Kỹ Thuật (Review) Pull Request #82

> **Dự án:** `smart-parking-app-v2` (Modern CRM Frontend)  
> **Tiêu chuẩn áp dụng:** `ak-review-pr v3.0.0` (19-Step Workflow, Anti-AI Slop, Finding Standard & React/TS Adapter)  
> **Thời điểm rà soát:** 2026-11-15T14:15:00+07:00  
> **Commit SHA rà soát:** `c28c6a62c877ecd809fbe707f2246e2e04ac717e` (refs/pull/82/head)  
> **Quyết định đề xuất:** ✅ **APPROVE (Phê duyệt để Merge vào nhánh `main`)**

---

## 1. Thông Tin Tổng Quan Pull Request

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Pull Request** | [#82 - fix(admin): show full payout account and bank logo](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/82) |
| **Tác giả** | `@lochuynh22` |
| **Nhánh nguồn (Head)** | `fix/admin-withdrawal-summary` (`c28c6a6`) |
| **Nhánh đích (Base)** | `main` |
| **Phạm vi thay đổi** | 29 files (`+957` dòng / `-259` dòng) |
| **Tương thích Merge** | `Clean` (Không xung đột với nhánh `main` mới nhất) |
| **Trạng thái CI (Check Runs)** | ✅ `Vercel Preview Comments`: SUCCESS<br/>✅ `Frontend Quality Gate & Validation`: SUCCESS |
| **Số lượng commits** | 3 commits: `d4e77ed` (Admin), `38e5499` (Merchant Finance), `c28c6a6` (Merchant Dashboard) |

---

## 2. Tóm Tắt Đánh Giá (Executive Summary)

PR #82 mang lại sự nâng cấp đáng kể cho hệ thống quản lý tài chính và bảng điều khiển chủ bãi xe:

1. **Chuẩn hóa thông tin phê duyệt rút tiền Quản trị viên (`WithdrawalSummary.tsx`):**
   - Trước đây, hộp thoại duyệt chi (`DecisionDialog`) chỉ hiển thị số tài khoản đã che (`maskedBankAccount`) dưới dạng lưới chật hẹp, khiến Admin không thể đối soát số tài khoản thật khi thực hiện ủy nhiệm chi / chuyển khoản ngân hàng.
   - PR bổ sung component `WithdrawalSummary`: Hiển thị số tài khoản đầy đủ (`bankAccountNumber`), giữ nguyên các chữ số 0 ở đầu (leading zeroes), hiển thị số tiền rút lớn nổi bật, tên chủ tài khoản viết hoa và tên chủ bãi.
   - Nhận diện mã ngân hàng và render logo chính thức từ danh mục VietQR; tự động chuyển sang icon dự phòng `<Building2 />` nếu logo lỗi hoặc ngân hàng chưa có trong danh mục.
   - Cảnh báo rõ ràng `"Chưa có số tài khoản đầy đủ."` nếu backend trả về dữ liệu thiếu, tuyệt đối không bịa số tài khoản giả.

2. **Tái cấu trúc Entity dùng chung (`src/entities/bank/`):**
   - Trích xuất API danh mục ngân hàng (`fetchBanks`), `BankLogo`, `BankField` từ `features/auth/` sang tầng `entities/bank` theo đúng kiến trúc 4 lớp (`app` $\rightarrow$ `features` $\rightarrow$ `entities` $\rightarrow$ `shared`).
   - `features/auth` và `features/merchant` cùng tái sử dụng `entities/bank`, loại bỏ hoàn toàn sự trùng lặp mã nguồn.

3. **Cải tiến Form tạo yêu cầu rút tiền của Chủ bãi (`FinancePages.tsx`):**
   - Hỗ trợ 2 phương thức nhận tiền: Sử dụng **"Tài khoản mặc định"** đã lưu trong hồ sơ hoặc **"Nhập tài khoản khác"** (tích hợp `BankField` tự động tìm kiếm ngân hàng).
   - Ô nhập số tiền tự động định dạng phân tách hàng nghìn (`50.000` / `1.000.000`), giữ vị trí con trỏ khi đang gõ và hỗ trợ nút chọn nhanh "Tối thiểu" / "Toàn bộ".
   - Kiểm soát chặt chẽ validation bằng Zod: Chỉ yêu cầu nhập thông tin ngân hàng khi chọn "Tài khoản khác".

4. **Tối ưu hiển thị Danh sách đặt chỗ gần nhất trên Dashboard Chủ bãi (`RecentMerchantBookings.tsx`):**
   - Áp dụng Container Queries (`@container`) linh hoạt: Hiển thị dạng bảng (table) đầy đủ trên màn hình rộng và tự động chuyển sang danh sách thẻ xếp gọn gàng trên màn hình di động (<640px).
   - Mã đặt chỗ dài được rút gọn thông minh (`slice(0, 8)…slice(-6)`), có đầy đủ nhãn xe, tên bãi và badge trạng thái.

---

## 3. Bảng Tổng Hợp Điểm Phát Hiện (Findings Matrix)

| ID | Tiêu đề | Phân loại | Mức độ (Severity) | Độ tin cậy (Confidence) | Mức ưu tiên (Priority) |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **F-01** | Tiêu đề và mô tả PR chưa phản ánh 2 commit Merchant bổ sung sau đó | `process` / `anti-ai-slop` | **Minor** | **High** | **P3** |
| **F-02** | Khuyến nghị danh sách fallback offline cho danh mục ngân hàng VietQR | `dx` / `resilience` | **Suggestion** | **Medium** | **P4** |

---

## 4. Chi Tiết Các Điểm Phát Hiện

### F-01: Tiêu đề và nội dung mô tả PR chưa bao hàm 2 commit Merchant mới (Minor — P3)

- **Vị trí:** GitHub PR Title & Body ([PR #82](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/82))
- **Thực trạng:**
  - Tiêu đề hiện tại: `fix(admin): show full payout account and bank logo`.
  - Nội dung mô tả ban đầu có câu: *"This branch starts from main and excludes the booking changes in PR #81 and the unfinished Merchant withdrawal form."*
  - Tuy nhiên, sau đó tác giả đã bổ sung thêm 2 commits:
    1. `38e5499`: *fix(merchant): format withdrawals and reuse bank picker*
    2. `c28c6a6`: *fix(merchant): Improve recent dashboard bookings layout*
- **Tác động:** Khiến các thành viên trong team và release notes hiểu lầm phạm vi PR chỉ liên quan đến Admin mà không biết có thay đổi lớn ở luồng rút tiền và dashboard của Merchant.
- **Đề xuất khắc phục:**
  - Cập nhật tiêu đề PR thành: `feat(finance): admin payout summary, merchant withdrawals form & dashboard bookings layout`.
  - Cập nhật nội dung PR body trên GitHub để phản ánh đầy đủ cả 3 tính năng đã hoàn thiện.

---

### F-02: Khuyến nghị bổ sung danh mục ngân hàng dự phòng offline (Suggestion — P4)

- **Vị trí:** `src/entities/bank/api/banks.ts#L16`
- **Thực trạng:**
  - `fetchBanks` phụ thuộc hoàn toàn vào API công khai bên thứ ba `https://api.vietqr.io/v2/banks`.
  - Mặc dù mã đã có cơ chế xử lý lỗi mạng (`TypeError`, `AbortController` timeout 10s) và fallback icon `<Building2 />`, nhưng nếu môi trường test/demo nội bộ không có kết nối internet ra ngoài, danh sách chọn ngân hàng sẽ trống.
- **Đề xuất khắc phục (Polish):**
  - Trong tương lai, có thể nhúng danh sách cứng tĩnh (static fallback list) gồm top 10-15 ngân hàng phổ biến (Vietcombank, Techcombank, BIDV, VietinBank, MB, ACB, Agribank...) để dự phòng khi API VietQR gặp sự cố tạm thời.

---

## 5. Kết Quả Xác Minh Cục Bộ (Local Verification)

Đã checkout trực tiếp commit `c28c6a62c877ecd809fbe707f2246e2e04ac717e` và thực thi kiểm thử:

1. **Kiểm tra kiểu dữ liệu TypeScript:**
   ```powershell
   npm run typecheck
   ```
   👉 **KẾT QUẢ:** `tsc --noEmit` hoàn thành với **0 lỗi**.

2. **Kiểm tra linter ESLint:**
   ```powershell
   npm run lint
   ```
   👉 **KẾT QUẢ:** **0 lỗi** (1 warning tiền khả thi ở `RegisterPage.tsx`).

3. **Kiểm tra đơn vị & tích hợp Vitest:**
   ```powershell
   npx vitest run src/entities/bank/ src/features/admin/ src/features/merchant/
   ```
   👉 **KẾT QUẢ:** **27/27 test files passed (228/228 tests passed 100%)**.

4. **Kiểm tra E2E Playwright:**
   - Cả 2 file test mới `e2e/admin-withdrawal-summary.spec.ts` và `e2e/merchant-withdrawals.spec.ts` đều mô phỏng chân thực hành vi người dùng, kiểm soát đầy đủ phím Escape/ArrowDown, độ phân giải 390px/1440px và xác nhận chính xác payload PUT/POST.

---

## 6. Kết Luận & Quyết Định Đề Xuất

Pull Request **#82** có chất lượng code xuất sắc, giải quyết thấu đáo vấn đề đối soát tài chính của Admin và cải thiện mạnh mẽ UX rút tiền cũng như dashboard của Merchant.

👉 **QUYẾT ĐỊNH: ✅ APPROVE (Sẵn sàng để Merge vào `main`).**
