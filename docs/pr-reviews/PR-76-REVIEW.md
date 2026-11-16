# Báo Cáo Đánh Giá Kỹ Thuật Pull Request #76

> **Dự án:** `smart-parking-app-v2` (Modern CRM Frontend)  
> **Tiêu chuẩn áp dụng:** `ak-review-pr v3.0.0` (Anti-AI Slop, Finding Standard & Safety Engine)  
> **Thời điểm đánh giá:** 2026-11-14T18:26:00+07:00  
> **Commit SHA rà soát:** `bf1e4e26a5665d83bd19db90a26f57c1f9f38ecd` (`refs/pull/76/head`)  
> **Quyết định đề xuất:** ⚠️ **REQUEST CHANGES (Yêu cầu chỉnh sửa trước khi Merge)**

---

## 1. Thông Tin Tổng Quan Pull Request

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Pull Request** | [#76 - fix(auth): add missing api exports, update login layout and password rule spacing](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/76) |
| **Tác giả** | `@khaiho6040` (Hồ Quốc Khải) |
| **Nhánh nguồn (Head)** | `feat/auth-register-update` (`bf1e4e2`) |
| **Nhánh đích (Base)** | `main` (`18ff765`) |
| **Phạm vi thay đổi** | 7 files (`+389` dòng / `-128` dòng) |
| **Tương thích Merge** | `Clean` (Không xung đột với nhánh `main` mới nhất — xác thực qua `git merge-tree`) |
| **TypeScript Typecheck** | 100% PASS (`tsc --noEmit` 0 lỗi) |
| **ESLint Check** | 100% PASS (0 cảnh báo linter) |
| **Vitest Auth Suite** | 100% PASS (68/68 test PASS trên 7 test files) |

---

## 2. Tóm Tắt Đánh Giá (Executive Summary)

PR #76 mang lại nhiều cải tiến giao diện người dùng rất tích cực cho phân hệ Authentication (SCR-010, SCR-011):

1. **Thu gọn & tối ưu không gian hiển thị (Layout Compacting):**  
   - Điều chỉnh padding, icon size, typography trong `LoginForm.tsx`, `LoginPage.tsx` và `AuthLayout.tsx`, giúp form đăng nhập nằm gọn trong viewport của màn hình máy tính và thiết bị di động, hạn chế tối đa việc phải cuộn trang.
2. **Nâng cấp màn hình thành công (`AuthSuccess`):**  
   - Hiển thị thẻ tóm tắt thông tin đã đăng ký: Vai trò tài khoản (Chủ bãi / Tài xế), Số điện thoại, Email xác thực.
   - Bổ sung cơ chế tự động chuyển hướng về trang đăng nhập sau 5 giây (`countdown = 5`) kèm vòng xoay loading trực quan.
3. **Thắt chặt kiểm tra dữ liệu ở Bước 1 đăng ký (In-Step Validation):**  
   - Kiểm tra `fullName` tối thiểu 2 ký tự.
   - Bắt buộc `citizenId` với vai trò Chủ bãi xe (`MERCHANT`), kiểm tra định dạng regex 9 hoặc 12 số trước khi chuyển bước.
   - Thêm xử lý `onError` điều hướng người dùng quay lại đúng Bước 1 nếu Backend trả về lỗi trùng số điện thoại hoặc CCCD.

Tuy nhiên, PR xuất hiện **02 điểm phát hiện nghiêm trọng (01 Critical và 01 Major)** liên quan đến mã bí mật bị lộ (Hardcoded Credential) và gọi API ma (Ghost API) cần phải khắc phục trước khi hòa vào nhánh `main`.

---

## 3. Bảng Tổng Hợp Điểm Phát Hiện (Findings Summary)

| ID | Tiêu đề | Phân loại | Mức độ | Mức tin cậy | Độ ưu tiên | File ảnh hưởng |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **F-01** | Lộ khóa bí mật dự phòng hardcoded `'SP_APP_KEY_2026_xM99qP2!'` trên mã nguồn Frontend | `security` | **Critical** | High | **P1** | `src/features/auth/api/emailOtp.ts#L22,L40` |
| **F-02** | Gọi endpoint ảo không tồn tại trên Backend (`/api/v1/auth/check-phone`, `/check-citizen-id`) | `api-contract` / `ai-slop` | **Major** | High | **P2** | `src/features/auth/api/emailOtp.ts#L16-L50` |
| **F-03** | Sử dụng `fetch` nguyên bản thay vì `sendData` / Axios client của hệ thống | `architecture` | **Minor** | High | **P3** | `src/features/auth/api/emailOtp.ts#L20,L38` |

---

## 4. Chi Tiết Các Điểm Phát Hiện & Hướng Dẫn Kỹ Thuật

### 🔴 F-01: Lộ khóa bí mật dự phòng hardcoded trên Frontend
* **Vị trí:** `src/features/auth/api/emailOtp.ts` (Dòng 22 và Dòng 40)
* **Đoạn code vi phạm:**
  ```typescript
  // Dòng 21-23:
  const res = await fetch(url, {
    headers: { 'X-App-Key': import.meta.env.VITE_APP_KEY || 'SP_APP_KEY_2026_xM99qP2!' },
  })
  ```
* **Phân tích nguy cơ:**  
  Mã nguồn ứng dụng Frontend (React Single Page Application) được đóng gói và tải trực tiếp về trình duyệt người dùng. Việc khai báo giá trị fallback là chuỗi secret thật `'SP_APP_KEY_2026_xM99qP2!'` sẽ bị lộ hoàn toàn khi người dùng inspect file bundle JS. Điều này vi phạm nghiêm trọng quy chuẩn an toàn [Safety Engine §3](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/.agents/skills/ak-review-pr/references/safety-engine.md#L52-L65).

---

### 🟠 F-02: Endpoint ảo không tồn tại trên Backend Identity Service
* **Vị trí:** `src/features/auth/api/emailOtp.ts` (Dòng 16–50) và `src/features/auth/pages/RegisterPage.tsx` (Dòng 212, 224)
* **Hiện tượng thực tế:**
  Hai hàm `checkPhoneAvailability` và `checkCitizenIdAvailability` gọi tới:
  - `GET /api/v1/auth/check-phone?phone=...`
  - `GET /api/v1/auth/check-citizen-id?citizenId=...`
  Tuy nhiên, rà soát mã nguồn Backend `smart-parking-microservice` tại `AuthController.java`, **hoàn toàn không có 2 endpoint này**.
* **Hậu quả:**
  1. Trên môi trường thực tế, mỗi khi người dùng bấm *"Tiếp tục"*, trình duyệt sẽ bắn 2 request trả về lỗi `404 Not Found`.
  2. Do đoạn code có `if (!res.ok) return true;` và `catch { return true; }`, lỗi 404 bị nuốt chửng và luôn trả về `true` (coi như số điện thoại chưa tồn tại). Nghĩa là logic kiểm tra trước này **thực chất không có tác dụng**.
  3. Trong môi trường test, đoạn code `if (import.meta.env.TEST) return true` làm ẩn đi lỗi này khiến test vẫn xanh giả tạo.
* **Thực tế nghiệp vụ:**  
  Backend đã có sẵn cơ chế bắt trùng số điện thoại/CCCD ở 2 chốt chặn:
  - Khi gửi OTP: `POST /api/v1/auth/otp/send` trả về `409 Conflict` nếu phone/email đã tồn tại.
  - Khi đăng ký: `POST /api/v1/auth/register` trả về `409 Conflict`.
  Đặc biệt, tại `RegisterPage.tsx` (Dòng 155–168), bạn đã viết rất chuẩn khối `onError` tự động bắt lỗi và nhảy về Bước 1 để hiển thị thông báo lỗi lên ô input. Do đó, 2 endpoint ảo này là hoàn toàn thừa thãi và gây rác network log.

---

### 🟡 F-03: Sử dụng `fetch` nguyên sinh thay vì HTTP Client dùng chung
* **Vị trí:** `src/features/auth/api/emailOtp.ts` (Dòng 20, 38)
* **Khuyến nghị:**  
  Dự án đã chuẩn hóa việc gọi API qua `sendData` từ `@/shared/api/resources` để tự động đính kèm baseURL, timeout và xử lý mã lỗi thống nhất. Không nên tự ý gọi raw `fetch`.

---

## 5. Hướng Dẫn Khắc Phục Cụ Thể (Actionable Guidance)

Để khắc phục triệt để F-01, F-02, F-03:

1. **Tại `src/features/auth/api/emailOtp.ts`:**
   - Xóa bỏ 2 hàm `checkPhoneAvailability` và `checkCitizenIdAvailability` (hoặc không xuất ra nữa).
2. **Tại `src/features/auth/pages/RegisterPage.tsx`:**
   - Bỏ import và bỏ đoạn gọi `checkPhoneAvailability` / `checkCitizenIdAvailability` trong hàm `advanceRegisterStep`.
   - Vẫn giữ nguyên logic kiểm tra format: `fullName.length >= 2` và định dạng `citizenId` cho Merchant.
   - Giữ nguyên khối `onError` thông minh ở dòng 155–168 để bắt lỗi 409 từ Backend và focus về đúng ô input.

---

## 6. Kết Luận

👉 **QUYẾT ĐỊNH: REQUEST CHANGES.**  
Sau khi loại bỏ 2 hàm check ảo và hardcoded secret trong `emailOtp.ts`, PR #76 sẽ đạt chất lượng hoàn hảo và sẵn sàng để Approve & Merge vào `main`.
