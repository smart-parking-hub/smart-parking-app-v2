# Báo Cáo Đánh Giá Kỹ Thuật Pull Request #78

> **Dự án:** `smart-parking-app-v2` (Modern CRM Frontend)  
> **Tiêu chuẩn áp dụng:** `ak-review-pr v3.0.0` (Anti-AI Slop, Finding Standard & Safety Engine)  
> **Thời điểm đánh giá:** 2026-11-14T18:50:00+07:00  
> **Commit SHA rà soát:** `663f041986c16e6c3684d8244ac43cb6d665b5e8` (`refs/pull/78/head`)  
> **Quyết định đề xuất:** ✅ **APPROVE (Phê duyệt để Merge vào nhánh `main`)**

---

## 1. Thông Tin Tổng Quan Pull Request

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Pull Request** | [#78 - feat(merchant): add revenue grouping and wallet activity](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/78) |
| **Tác giả** | `@lochuynh22` (Huỳnh La Tiến Lộc) |
| **Nhánh nguồn (Head)** | `feat/pay03-merchant-revenue-ledger` (`663f041`) |
| **Nhánh đích (Base)** | `main` (`18ff765`) |
| **Mã công việc (Jira/Trello)** | `SP-S3-PAY-03` (Màn hình SCR-037 - Merchant Revenue Reports & Wallet Ledger) |
| **PR đối ứng Backend** | [PR #46](https://github.com/smart-parking-hub/smart-parking-service-microservice/pull/46) (`payment-service`) |
| **Phạm vi thay đổi** | 13 files (`+510` dòng / `-128` dòng) |
| **Tương thích Merge** | `Clean` (Không xung đột với nhánh `main` mới nhất — xác thực qua `git merge-tree`) |
| **TypeScript Typecheck** | 100% PASS (`tsc --noEmit` 0 lỗi) |
| **ESLint Check** | 100% PASS (0 lỗi, 0 cảnh báo linter) |
| **Vitest Test Suite** | 100% PASS (33/33 test PASS trên các module tài chính liên quan) |
| **Playwright E2E Suite** | 100% PASS (2/2 browser test PASS trên cả 390px Mobile và 1440px Desktop) |

---

## 2. Tóm Tắt Đánh Giá (Executive Summary)

PR #78 là mảnh ghép Frontend đối ứng trực tiếp với Backend PR #46 (`payment-service`), hoàn thiện tính năng Báo cáo doanh thu và Sổ cái biến động ví cho Merchant (**SCR-037 - `SP-S3-PAY-03`**). Mã nguồn đạt chất lượng rất cao, tuân thủ nghiêm ngặt các nguyên tắc chống AI Slop và kiến trúc frontend hiện đại:

1. **Khớp nối hợp đồng API Sổ cái ví 100% (Authoritative API Contract):**
   - Tích hợp chuẩn xác endpoint `GET /api/v1/merchant/revenue/ledger` thông qua hàm `getMerchantLedger(page)` với kích thước trang cố định `size: 20`.
   - Ánh xạ đầy đủ các loại bút toán ví từ backend enum sang tiếng Việt (`SETTLEMENT_CREDIT` -> "Cộng doanh thu", `WITHDRAWAL_HOLD` -> "Giữ tiền rút", `WITHDRAWAL_REFUND` -> "Hoàn tiền rút", `ADJUSTMENT` -> "Điều chỉnh"), đồng thời fallback an toàn về nguyên mẫu `entryType` nếu hệ thống mở rộng enum trong tương lai.
   - Sổ cái hiển thị số tiền có dấu rõ ràng (`+` cho số dương, `-` cho số âm), phân trang độc lập với bộ lọc ngày của biểu đồ doanh thu.

2. **Gom nhóm chuỗi doanh thu phía máy khách chuẩn xác (Client-Side Grouping without Hallucinated APIs):**
   - Nhận diện đúng hạn chế của backend service hiện tại (chỉ trả về điểm dữ liệu `DAY`), frontend chủ động gọi `granularity: 'DAY'` và thực hiện hàm `groupRevenueSeries(points, granularity)` để tổng hợp doanh thu theo tháng (`YYYY-MM`) và năm (`YYYY`) bằng thuật toán `Map` rõ ràng, sắp xếp thời gian tăng dần (`localeCompare`).
   - Không bịa đặt endpoint backend hay tự vẽ thêm dữ liệu giả lập.

3. **Chuẩn hóa ngữ nghĩa KPI tài chính và Tránh hiểu lầm số liệu (Semantic Clarity):**
   - Đổi nhãn KPI từ `Doanh thu thực nhận` thành **`Biến động ví tích lũy`** kèm chú thích giải nghĩa rõ ràng: *"Gồm cộng doanh thu, giữ tiền rút, hoàn và điều chỉnh"*. Điều này phản ánh chính xác bản chất trường `totalNetRevenue` của backend (chịu ảnh hưởng bởi các giao dịch rút tiền/điều chỉnh) chứ không đơn thuần là doanh thu trừ phí.
   - Bổ sung panel "Đối soát" ghi rõ phạm vi: các chỉ số tích lũy không phụ thuộc vào bộ lọc ngày; biểu đồ phản ánh thanh toán thành công sau phí còn sổ cái phản ánh biến động thực tế vào ví.

4. **Trợ năng và Thiết kế ngữ nghĩa cao cấp (Accessibility & Semantic HTML):**
   - Biểu đồ doanh thu được xây dựng bằng thẻ ngữ nghĩa `<figure>`, `<figcaption>` và thanh cuộn ngang có `tabIndex={0}` kèm `aria-label="Cuộn các kỳ doanh thu"`.
   - Cung cấp chế độ xem bảng số liệu chi tiết ẩn sau thẻ `<details>` và `<summary>` chuẩn HTML5, chứa bảng số liệu `tabular-nums` với đầy đủ `<caption className="sr-only">`, `<th scope="col">`, `<th scope="row">` phục vụ tối đa cho người dùng trợ năng và phím Enter/Space.
   - RHF + Zod chặn lỗi ngày kết thúc nhỏ hơn ngày bắt đầu (`endDate < startDate`) từ phía client, hiển thị thông báo lỗi liên kết qua `aria-describedby` và `aria-invalid` mà không gửi request rác lên server.

5. **Phòng ngừa hồi quy PayOS (PayOS 4.000 VND Deposit Regression Defense):**
   - Bổ sung ca kiểm thử hồi quy trong `PayOsPaymentPanel.test.tsx` xác nhận việc khởi tạo thanh toán cọc 4.000 ₫ (20% của 20.000 ₫) từ phía server mà không gửi amount override từ client, đồng thời chặn việc tải SDK PayOS khi server báo link cũ không khớp số tiền.

---

## 3. Bảng Tổng Hợp Điểm Phát Hiện (Findings Summary)

| ID | Tiêu đề | Phân loại | Mức độ | Mức tin cậy | Độ ưu tiên | Trạng thái |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| — | Không phát hiện lỗi logic, bảo mật, sai lệch hợp đồng hay AI slop | — | — | — | — | **CLEAN** |

- **Bảo mật & Ủy quyền:** Toàn bộ dữ liệu sổ cái và doanh thu truy xuất dựa trên danh tính người dùng đăng nhập trong token (`ROLE_MERCHANT`), backend tự động trích xuất `merchantId` từ JWT; client không truyền `merchantId` tùy tiện qua query params.
- **Quản lý Cache TanStack Query:** Tách biệt rõ query key `['merchant-revenue', { startDate, endDate }]` và `['merchant-wallet-ledger', page]`. Cho phép làm mới sổ cái thủ công (`Làm mới sổ cái`) độc lập với doanh thu.
- **Không có Ghost Code / Slop:** Không có console log rác, không dùng `any` bừa bãi, không có thư viện nặng nề bị import thừa.

---

## 4. Kết Quả Xác Minh Thực Tế (Verification Run)

Toàn bộ các bước kiểm tra tự động đã được thực thi và xác nhận trực tiếp:

```powershell
# 1. Kiểm tra TypeScript & ESLint:
npm run typecheck
npx eslint src/features/merchant/operations/ src/features/merchant/components/
# -> 100% PASS (0 lỗi, 0 cảnh báo)

# 2. Kiểm thử Vitest các phân hệ liên quan:
npx vitest run src/features/merchant/operations/merchantFinance.test.tsx \
               src/features/booking-flow/__tests__/PayOsPaymentPanel.test.tsx \
               src/features/merchant/__tests__/Batch14EMerchantGateFinanceIntegration.test.tsx
# -> 100% PASS (33/33 tests PASS)

# 3. Kiểm thử Playwright E2E:
npx playwright test e2e/merchant-revenue.spec.ts
# -> 100% PASS (2/2 kịch bản trình duyệt Chromium tại 390px và 1440px PASS in 16.6s)
```

---

## 5. Kết Luận & Quyết Định Đề Xuất

Pull Request **#78** hoàn thành xuất sắc yêu cầu của bài toán `SP-S3-PAY-03`, khớp nối hoàn hảo với Backend PR #46, giao diện responsive mượt mà từ mobile đến desktop, kiểm thử chặt chẽ và chuẩn mực.

👉 **QUYẾT ĐỊNH: APPROVE (Phê duyệt để Merge vào nhánh `main`).**
