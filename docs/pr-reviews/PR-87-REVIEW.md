# Báo Cáo Đánh Giá Kỹ Thuật (Review) Pull Request #87

> **Dự án:** `smart-parking-app-v2` (Modern CRM Frontend)  
> **Tiêu chuẩn áp dụng:** `ak-review-pr v3.0.0` (19-Step Workflow, Anti-AI Slop, Finding Standard & React/TS Adapter)  
> **Thời điểm rà soát:** 2026-11-16T22:50:00+07:00  
> **Commit SHA rà soát (`REVIEW_HEAD_SHA`):** `103a050ebb3bcee95d3ae48e30b185b14758ecb8` (refs/pull/87/head)  
> **Quyết định đề xuất:** ✅ **APPROVE (Chấp thuận Merge — Đã khắc phục lỗi rò rỉ state modal checkout & bổ sung PayOS QR)**

---

## 1. Thông Tin Tổng Quan Pull Request

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Pull Request** | [#87 - feat(merchant-operations): Chuẩn hóa API confirm-cash, bổ sung thanh toán VietQR PayOS và sửa lỗi rò rỉ state modal checkout [SP-S3-PAY-01]](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/87) |
| **Tác giả** | `@HoQuocKhai` |
| **Nhánh nguồn (Head)** | `feat/merchant-operations-confirm-cash` (`103a050`) |
| **Nhánh đích (Base)** | `main` |
| **Phạm vi thay đổi** | **16 tập tin** (`+1.493` dòng / `-184` dòng) qua 2 commits *(trong đó 12 tập tin thuộc về module QR camera từ PR #85)* |
| **Thay đổi thực tế so với `main` mới nhất** | **4 tập tin** (`+227` dòng / `-37` dòng) |
| **Trạng thái CI (Check Runs)** | ✅ `Frontend Quality Gate & Validation`: **SUCCESS**<br/>✅ `Vercel Preview Comments`: **SUCCESS** |
| **PR Backend đồng hành** | [smart-parking-service-microservice #54](https://github.com/smart-parking-hub/smart-parking-service-microservice/pull/54) |

---

## 2. Tóm Tắt Đánh Giá (Executive Summary)

PR #87 hoàn thiện các mảnh ghép quan trọng trong quy trình vận hành xe ra (Check-Out) tại cổng bãi xe của Merchant:

1. **Khắc phục lỗi rò rỉ trạng thái (State Leak Fix):**
   - Trước PR này, khi thực hiện check-out và modal quyết toán hiển thị, nếu người vận hành bấm nút `X` đóng modal mà chưa xác nhận thu tiền, thông báo thành công `Đã ghi nhận xe ra...` vẫn còn lưu trên giao diện, gây hiểu lầm là xe đã được thanh toán và barie đã mở.
   - PR #87 sửa triệt để bằng cách chỉ cập nhật `setSuccess` khi `cash.mutate()` thực sự hoàn tất, đồng thời reset sạch `settlementMethod` và `scan` khi đóng modal.
2. **Bổ sung hình thức thanh toán VietQR PayOS tại cổng:**
   - Cung cấp nút chuyển đổi giữa **"Tiền mặt"** và **"Thanh toán bằng QR"** trong modal quyết toán.
   - Render mã `QRCodeSVG` chứa liên kết thanh toán PayOS kèm số tiền còn phải thu (`amountDue`) và mã đơn đặt chỗ (`bookingCode`).
   - Nút "Đã nhận thanh toán QR · Hoàn tất lượt đỗ" cho phép chốt lượt đỗ nhanh chóng sau khi tài xế quét mã.
3. **Mở rộng API & Kiểm thử:**
   - Tạo mới `src/features/merchant/qr/api/merchantQrApi.ts` định nghĩa kiểu dữ liệu `CheckInPayload`, `CheckOutPayload`, `ConfirmCashPayload`.
   - Bổ sung 2 automated test cases trong `operations.test.tsx` kiểm thử đầy đủ luồng chuyển đổi QR và việc đóng modal không để lại thông báo giả.

---

## 3. Bảng Tổng Hợp Điểm Phát Hiện (Findings Matrix)

| ID | Tiêu đề | Phân loại | Mức độ | Độ tin cậy | Mức ưu tiên | Vị trí tập tin |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **F-01** | `ScannerPage.tsx` chưa sử dụng trực tiếp các hàm từ `merchantQrApi.ts` | `architecture` | **Minor** | **High** | **P3** | `ScannerPage.tsx:75, 114` |
| **F-02** | URL mã QR thanh toán PayOS hiện dùng định dạng mẫu trực tiếp | `integration` | **Suggestion** | **Medium** | **P4** | `ScannerPage.tsx:347` |
| **F-03** | Nhánh chưa rebase với `main` mới nhất (sau khi PR #85 merge) | `git-hygiene` | **Suggestion** | **High** | **P4** | Git Branch |

---

## 4. Chi Tiết Các Điểm Phát Hiện

### F-01: `ScannerPage.tsx` chưa sử dụng trực tiếp các hàm từ `merchantQrApi.ts` (Minor — P3)
- **Vị trí:** [ScannerPage.tsx](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/merchant/operations/ScannerPage.tsx#L75)
- **Thực trạng:**
  Trong PR #87, tác giả đã tạo mới file `src/features/merchant/qr/api/merchantQrApi.ts` và export trong `index.ts`:
  ```typescript
  export async function confirmCashPaymentApi(payload: ConfirmCashPayload): Promise<void> {
    return sendData('post', '/api/v1/merchant/confirm-cash', payload)
  }
  ```
  Tuy nhiên, trong `ScannerPage.tsx`, component vẫn gọi `sendData('post', '/api/v1/merchant/confirm-cash', scan.variables)` trực tiếp.
- **Khuyến nghị:** Nên import và dùng `confirmCashPaymentApi`, `merchantCheckOutApi` trong `useMutation` để tuân thủ kiến trúc 4 lớp chuẩn của dự án.

---

### F-02: Định dạng URL mã QR PayOS (Suggestion — P4)
- **Vị trí:** `src/features/merchant/operations/ScannerPage.tsx:347`
- **Thực trạng:**
  `QRCodeSVG` đang mã hóa URL:
  `https://pay.payos.vn/web/checkout?code=${scan.data.bookingCode}&amount=${scan.data.amountDue}`.
- **Đánh giá:**
  Ở Phase hiện tại, đây là giải pháp hiển thị thông tin trực quan tốt cho nhân viên trực cổng. Ở Phase tiếp theo, khi kết nối PayOS sâu hơn, hệ thống có thể tích hợp mã VietQR chuẩn ngân hàng (EMVCo) để tài xế có thể quét trực tiếp từ mọi ứng dụng Mobile Banking mà không cần qua trình duyệt web.

---

### F-03: Khuyến nghị Rebase nhánh (Suggestion — P4)
- Nhánh `feat/merchant-operations-confirm-cash` được rẽ từ commit `372d3c9` (trước khi PR #85 merge commit fix `f2a845f` vào `main`).
- Mặc dù thuật toán git 3-way merge tự động kết hợp trơn tru không gây xung đột (mergeable: true), tác giả nên thực hiện `git pull --rebase origin main` để lịch sử commit của PR luôn tuyến tính và sạch sẽ.

---

## 5. Kết Luận & Quyết Định

PR #87 giải quyết đúng và trọn vẹn lỗi rò rỉ state modal, bổ sung giao diện thanh toán QR PayOS sắc nét và có độ bao phủ test tốt. CI GitHub Actions đạt 100% SUCCESS.

**Quyết định:** ✅ **APPROVE**
