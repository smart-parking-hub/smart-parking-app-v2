# 🛠️ HƯỚNG DẪN XỬ LÝ & SỬA LỖI PULL REQUEST (FE & BE)
> **Dự án**: SmartParkingHub  
> **Quy chuẩn đánh giá**: `ak-review-pr-v3.0.0`  
> **Ngày lập**: 11/11/2026  
> **Mục đích**: Gửi trực tiếp cho từng lập trình viên phụ trách PR để sửa lỗi nhanh chóng, đảm bảo 100% CI Quality Gate trước khi merge vào nhánh `main`.

---

## 📌 BẢNG TỔNG QUAN PHÂN CÔNG (ACTION ASSIGNMENTS)

| PR | Dự án | Thành viên phụ trách | Trạng thái hiện tại | Mức độ ưu tiên | Hành động chính cần thực hiện |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **FE #63** | `smart-parking-app-v2` | `@lochuynh22` | ❌ **REQUEST CHANGES** | **P1 (Cực kỳ khẩn cấp)** | Sửa gãy CI test do đổi `aria-label`; Dọn dẹp tách nhánh Git |
| **BE #37** | `smart-parking-microservice` | `@lochuynh22` | ⚠️ **REQUEST CHANGES** | **P2 (Khẩn cấp)** | Đổi tên PR/nhánh đúng nội dung; Kiểm tra đối soát Partial Refund |
| **BE #36** | `smart-parking-microservice` | `@HoQuocKhai` | ✅ **APPROVED (Lưu ý)** | **P3 (Cần rà soát)** | Rà soát dữ liệu trùng lặp trước khi chạy Flyway V14 |
| **FE #61** | `smart-parking-app-v2` | `@HoQuocKhai` | ✅ **APPROVED** | **P4 (Sẵn sàng)** | Sẵn sàng merge |
| **FE #60** | `smart-parking-app-v2` | `@2imBenne` | ✅ **APPROVED** | **P4 (Sẵn sàng)** | Sẵn sàng merge |
| **FE #62** | `smart-parking-app-v2` | `@2imBenne` | ✅ **APPROVED** | **P4 (Sẵn sàng)** | Sẵn sàng merge |

---

## 🔴 1. DÀNH CHO: @lochuynh22 — FRONTEND PR #63

### 📋 Thông tin PR
- **Tiêu đề**: `feat(payment): complete PayOS QR checkout and merchant settlement flow`
- **Nhánh**: `fix/auth-otp-password` $\rightarrow$ `main`
- **Tình trạng CI**: ❌ **Thất bại** tại `Frontend Quality Gate & Validation` (`Step 3 - Vitest Unit & Integration Test Suite`).

---

### 🚨 Vấn đề 1 (Blocker): Gãy Integration Test do đổi `aria-label`

#### 1. Triệu chứng & Nguyên nhân
- Khi chạy CI, bài test tích hợp `Batch14BDriverCoreIntegration.test.tsx` bị văng lỗi:
  ```text
  FAIL src/features/driver/__tests__/Batch14BDriverCoreIntegration.test.tsx > BATCH-14B: Driver Core — Search, Detail & Bookings Integration > SCR-015: SearchParkingPage renders filters, yard list, map canvas, and opens 10-minute hold drawer
  TestingLibraryElementError: Unable to find an accessible element with the role "dialog" and name /Panel giữ chỗ nhanh 10 phút/i
  ```
- **Nguyên nhân**: Trong file `src/features/parking-search/components/InlineQuickBookPanel.tsx`, thuộc tính `aria-label` của dialog đã bị sửa:
  - ❌ Cũ: `aria-label="Panel giữ chỗ nhanh 10 phút"`
  - ❌ Mới (gây lỗi): `aria-label="Panel giữ chỗ nhanh"` (bỏ mất chuỗi `10 phút`).

#### 2. Cách sửa nhanh (Actionable Code Diff)
Mở file `src/features/parking-search/components/InlineQuickBookPanel.tsx` và khôi phục nhãn trợ năng:

```diff
--- a/src/features/parking-search/components/InlineQuickBookPanel.tsx
+++ b/src/features/parking-search/components/InlineQuickBookPanel.tsx
@@ -103,7 +103,7 @@ export function InlineQuickBookPanel({
       <div
         ref={panelRef}
         role="dialog"
         aria-modal="true"
-        aria-label="Panel giữ chỗ nhanh"
+        aria-label="Panel giữ chỗ nhanh 10 phút"
         aria-describedby="quick-hold-description"
         className="quick-hold"
       >
```

#### 3. Lệnh kiểm thử cục bộ trước khi push:
```bash
cd smart-parking-app-v2
npx vitest run src/features/driver/__tests__/Batch14BDriverCoreIntegration.test.tsx
npm run test
```
> Đảm bảo toàn bộ 74 test files chuyển sang màu xanh (Passed 100%).

---

### ⚠️ Vấn đề 2: Lệch tên nhánh và lẫn lộn phạm vi code (Scope Mismatch)

#### 1. Nguyên nhân
- PR tên là tính năng thanh toán PayOS (`feat(payment)`), nhưng nhánh git lại đặt tên là `fix/auth-otp-password`.
- Trong PR bị lẫn file kiểm thử quên mật khẩu: `e2e/forgot-password.spec.ts`.

#### 2. Hướng dẫn dọn dẹp Git (Khuyến nghị chuẩn hoá):
1. Đảm bảo nhánh local sạch và pull `main` mới nhất:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Tạo nhánh chuẩn cho tính năng PayOS và cherry-pick / chuyển các commit payment sang:
   ```bash
   git checkout -b feat/payment-payos-checkout-settlement
   git cherry-pick <commit-hash-cac-tinh-nang-payment>
   ```
3. Loại bỏ file `e2e/forgot-password.spec.ts` ra khỏi nhánh payment (để đưa sang đúng nhánh sửa lỗi auth).
4. Đẩy nhánh mới lên và cập nhật lại PR hoặc tạo PR mới sạch sẽ:
   ```bash
   git push origin feat/payment-payos-checkout-settlement
   ```

---

## 🟠 2. DÀNH CHO: @lochuynh22 — BACKEND PR #37

### 📋 Thông tin PR
- **Tiêu đề hiện tại**: `Fix/auth otp password`
- **Nhánh**: `fix/auth-otp-password` $\rightarrow$ `main`
- **Tình trạng CI**: ✅ PASS (Build thành công).

---

### ⚠️ Vấn đề 1: Tiêu đề PR và Tên nhánh hoàn toàn không khớp với Code thực tế

#### 1. Nguyên nhân
- Tiêu đề là `Fix/auth otp password`, nhưng các file thay đổi thực tế gồm có:
  - `ai-service`: Xử lý timeout budget và fallback model Gemini (`GeminiApiClient.java`).
  - `payment-service`: Logic hoàn tiền một phần (`RefundServiceImpl.java`), scheduler quét quá hạn đối soát hoàn tiền (`DailySettlementScheduler.java`), API tài chính Admin (`AdminFinanceController.java`).
  - `docker/compose/local/docker-compose.apps.yml`: Bổ sung cấu hình PayOS Client ID & Checksum Key.
- Tuyệt đối **không có file nào** liên quan đến Auth, OTP hay Password.

#### 2. Hành động cần thực hiện:
Vào giao diện GitHub của PR #37 và đổi lại tiêu đề PR:
- ❌ **Tiêu đề cũ**: `Fix/auth otp password`
- ✅ **Tiêu đề mới chuẩn Conventional Commits**:  
  `fix(payment,ai): payos local compose config, gemini timeout budget, and partial refund settlement`

---

### 🔍 Vấn đề 2: Xác thực nghiệp vụ Đối soát (Daily Settlement) khi Hoàn tiền một phần (Partial Refund)

#### 1. Vấn đề tiềm ẩn trong Code
Tại `payment-service/src/main/java/com/smartparking/payment/application/service/impl/RefundServiceImpl.java`:
```java
if (refund.getPaymentId() != null) {
    paymentRepository.findByIdForUpdate(refund.getPaymentId()).ifPresent(payment -> {
        boolean isFullRefund = payment.getAmount() == null
                || refund.getRefundAmount() == null
                || refund.getRefundAmount().compareTo(payment.getAmount()) >= 0;
        if (isFullRefund) {
            payment.setStatus(PaymentStatusEnum.REFUNDED);
        } else {
            // Đối với hoàn tiền 1 phần (ví dụ 50%), giữ trạng thái SUCCESS
            payment.setStatus(PaymentStatusEnum.SUCCESS);
        }
        paymentRepository.save(payment);
    });
}
```

#### 2. Rủi ro nghiệp vụ
- Nếu một Payment trị giá 100.000 VNĐ, tài xế được hoàn tiền một phần 50.000 VNĐ. Trạng thái Payment vẫn giữ là `SUCCESS`.
- Cần xác nhận chắc chắn rằng `DailySettlementService` khi tính doanh thu kết chuyển cho Merchant sẽ tính `payment.getAmount() - refund.getRefundAmount()` (chỉ chuyển 50.000 VNĐ cho chủ bãi), **chứ không chuyển nguyên vẹn 100.000 VNĐ** (sẽ làm sàn bị thất thoát 50.000 VNĐ).

#### 3. Hành động cần thực hiện:
Bổ sung một test case cụ thể trong `payment-service/src/test/java/com/smartparking/payment/application/service/impl/DoubleEntryLedgerAndSettlementTest.java` để chứng minh:
- Khi một Payment có status `SUCCESS` nhưng đã có một bản ghi `RefundRequest` trạng thái `COMPLETED` đi kèm, tổng tiền kết chuyển (settlement amount) phải trừ đi khoản refund tương ứng.
- Chạy kiểm thử:
  ```bash
  ./gradlew :payment-service:test --tests "com.smartparking.payment.application.service.impl.DoubleEntryLedgerAndSettlementTest"
  ```

---

## 🟡 3. DÀNH CHO: @HoQuocKhai — BACKEND PR #36

### 📋 Thông tin PR
- **Tiêu đề**: `feat(payment): implement Driver Dispute API, evidence upload, and audit timeline (SP-S3-GOV-01)`
- **Nhánh**: `feat/payment-sp-s3-gov-01-driver-dispute-api` $\rightarrow$ `main`
- **Tình trạng CI**: ✅ PASS
- **Đánh giá chung**: Code rất chất lượng, bảo mật upload file (UUID, magic bytes, path traversal check) xuất sắc.

---

### ⚠️ Lưu ý duy nhất trước khi Merge (Pre-Merge Data Check)

#### 1. Chi tiết Migration Flyway V14:
Trong file `V14__enforce_unique_dispute_booking.sql`:
```sql
ALTER TABLE disputes
    ADD CONSTRAINT uk_disputes_booking_id UNIQUE (booking_id);
```

#### 2. Khuyến cáo vận hành:
- Lệnh `ADD CONSTRAINT UNIQUE` sẽ bị văng lỗi (Fail Migration) nếu cơ sở dữ liệu trên môi trường Dev / Staging hiện tại đã có hơn 1 dòng khiếu nại cho cùng một `booking_id`.
- **Hành động**: Hãy chạy câu query sau trên DB Staging trước khi deploy để kiểm tra và dọn dẹp (nếu có duplicate):
  ```sql
  SELECT booking_id, COUNT(*) 
  FROM disputes 
  GROUP BY booking_id 
  HAVING COUNT(*) > 1;
  ```
- Nếu không có dòng nào trùng, PR **hoàn toàn an toàn để Merge ngay**.

---

## 🟢 4. CÁC PULL REQUEST ĐÃ ĐẠT CHUẨN — SẴN SÀNG MERGE

Các PR sau đã vượt qua toàn bộ 19 bước kiểm định chất lượng, test pass 100%, không xung đột và tuân thủ tuyệt đối quy tắc kiến trúc. Tech Lead / Admin có thể bấm **Merge**:

1. ✅ **FE #60** (`2imBenne`): Admin Dashboard SCR-042 chuẩn Kiến trúc 4 Lớp.
2. ✅ **FE #61** (`HoQuocKhai`): Notifications Center SCR-025 & Hỗ trợ hiển thị ảnh bằng chứng khiếu nại bảo mật.
3. ✅ **FE #62** (`2imBenne`): Bộ kịch bản kiểm thử E2E tự động hóa Playwright.
4. ✅ **BE #36** (`HoQuocKhai`): Dispute API, Timeline & Lưu trữ chứng từ đa lớp (sau khi rà soát lưu ý V14).

---

> 💡 *Vui lòng gửi tài liệu này cho từng lập trình viên để triển khai sửa đổi nhanh chóng!*
