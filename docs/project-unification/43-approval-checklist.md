# 43. Danh Sách Phê Duyệt Kiến Trúc & Nghiệp Vụ (Architectural & Business Approval Checklist)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** PLANNING ONLY (Tuân thủ nghiêm ngặt PROJECT UNIFICATION MASTER RULES — **Không sửa code**)  
> **Thời điểm xác lập:** 07/11/2026  
> **Mục tiêu:** Cung cấp cổng kiểm soát (Decision Gates) và danh mục kiểm tra chính thức để Chủ dự án (Product Owner) và Trưởng nhóm Kỹ thuật (Technical Lead) ký duyệt trước khi bước vào giai đoạn triển khai code thực tế  
> **Nguyên tắc cốt lõi:** **DỪNG LẠI. KHÔNG TRIỂN KHAI CODE KHI CHƯA ĐƯỢC PHÊ DUYỆT BẰNG VĂN BẢN.**

---

## 1. Tổng Quan Trạng Thái Hệ Thống Kiểm Toán & Kế Hoạch (Audit & Plan Summary)

Trải qua 9 Prompt khảo sát và kiểm toán chuyên sâu, hệ thống đã hoàn thành **43 tài liệu chuẩn hóa toàn diện**:
* **Giai đoạn 1 (Discovery & Khảo sát hệ thống):** Docs 01 – 05 (56 màn hình, 73 routes, 5 layouts, 7 microservices, 91 API endpoints).
* **Giai đoạn 2 (Kiểm toán Hệ thống Thiết kế):** Docs 06 – 10 (75 mã HEX, 2.842 lượt cỡ chữ, 1.851 bo góc, 548 shadow, phân tích drift).
* **Giai đoạn 3 (Phân rã Component & Trùng lặp):** Docs 11 – 15 (351 components, phát hiện mồ côi, trùng lặp và xung đột tên).
* **Giai đoạn 4 (Phần tử Tương tác & Sự kiện):** Docs 16 – 18 (557 interactive elements, phát hiện carousel liệt, link 404, reload thẻ `<a>`).
* **Giai đoạn 5 (Luồng Nghiệp vụ & Vòng đời State):** Docs 19 – 22 (Bản đồ route graph, hành trình 4 roles, 20 mutations thiếu invalidate, 52 màn hình thiếu nút quay lại).
* **Giai đoạn 6 (Khám phá API & Kiểm toán Hợp đồng):** Docs 23 – 28 (Tỷ lệ khớp 85.4%, 33 endpoints GAP B sẵn sàng, đề xuất 6 hợp đồng API).
* **Giai đoạn 7 (Đặc tả Hệ thống Thiết kế Thống nhất):** Docs 29 – 34 (10 nguyên tắc, semantic colors, typography, spacing, 21 hợp đồng UI, 8 page rules).
* **Giai đoạn 8 (Kiến trúc Component & Ánh xạ Màn hình):** Docs 35 – 38 (Cây 6 tầng, ma trận tái sử dụng, phân rã 56 trang, cấu trúc Re-export Facade).
* **Giai đoạn 9 (Kế hoạch Triển khai & Batch Inputs):** Docs 39 – 43 (Gom nhóm vấn đề, 8 implementation batches, API backlog, ready-to-copy inputs).

---

## 2. Các Cổng Quyết Định Cần Phê Duyệt (Decision Gates Checklist)

---

### CỔNG 1: PHÊ DUYỆT HỆ THỐNG THIẾT KẾ & TOKENS (DESIGN SYSTEM SIGN-OFF)
*Căn cứ tài liệu: Doc 06 – 10, Doc 29 – 32.*

- [ ] **1.1. Bảng màu thương hiệu & Merchant Palette:**
  - Đồng ý giữ nguyên mã cam `#d95f00` làm Primary Brand Color cho toàn hệ thống.
  - Đồng ý triệt tiêu mã lệch `#b85000` quy nhất về `#b84e00` (Hover) và `#9e4300` (Active).
  - Phê duyệt bộ màu đặc thù của Merchant Stitch (`#0d1c2e`, `#455f87`, `#eff4ff`, `#131b2e`) vào `@theme`.
- [ ] **1.2. Hệ thống kiểu chữ (Typography Triad):**
  - Đồng ý sử dụng `Be Vietnam Pro` cho tiêu đề, `Source Sans 3` cho nội dung/form/bảng, và `System Monospace` cho dữ liệu kỹ thuật (biển số xe, số tiền VNĐ, mốc thời gian).
  - Đồng ý chuẩn hóa cỡ chữ vi mô `--text-2xs: 11px` và `--text-3xs: 10px` để bảo toàn thiết kế bảng bãi xe.
- [ ] **1.3. Khung bố cục & Khoảng cách (Spacing & Layout):**
  - Đồng ý quy định 2 container chuẩn: `1240px` (Marketing) và `1280px` (CRM Workspace).
  - Phê duyệt nguyên tắc bo góc lồng nhau (16px Panel -> 12px Card/Modal -> 8px Input -> 4px Tag).

---

### CỔNG 2: PHÊ DUYỆT KIẾN TRÚC COMPONENT & TÁI CẤU TRÚC (ARCHITECTURE SIGN-OFF)
*Căn cứ tài liệu: Doc 11 – 15, Doc 33, Doc 35 – 38.*

- [ ] **2.1. Chiến lược Facade cho `Workspace.tsx`:**
  - Phê duyệt giải pháp biến `Workspace.tsx` thành Re-export Facade để không gây gãy import cho hơn 15 files hiện có.
  - Đồng ý trích xuất `DataTable.tsx`, `Select.tsx`, `Dropdown.tsx` thành các component độc lập.
- [ ] **2.2. Hợp nhất `Badge` & Dọn dẹp bản sao:**
  - Đồng ý hợp nhất `Badge.tsx` hỗ trợ cả 2 cách gọi (`variant` và `value`).
  - Phê duyệt xóa bản sao `features/dashboard/components/DashboardSkeleton.tsx`, trỏ về nguồn duy nhất tại `features/driver/`.
- [ ] **2.3. Kích hoạt Shared Primitives mồ côi:**
  - Đồng ý đưa `Input.tsx` làm chuẩn chung cho 32 màn hình form, thay thế các thẻ `<input>` thô.
  - Phê duyệt tạo mới `Breadcrumb.tsx` để khắc phục thiếu sót trên 38 màn hình con.

---

### CỔNG 3: PHÊ DUYỆT SỬA LỖI TƯƠNG TÁC & ĐIỀU HƯỚNG (NAVIGATION FIXES SIGN-OFF)
*Căn cứ tài liệu: Doc 16 – 22, Doc 39, Batch 02.*

- [ ] **3.1. Sửa lỗi liệt nút Carousel:** Phê duyệt bổ sung logic `onClick` chuyển slide trong `HomeTestimonials.tsx`.
- [ ] **3.2. Sửa liên kết Navbar 404:** Phê duyệt sửa các link `/company/*` trỏ về đúng route thực tế `/about`, `/contact`, `/careers`.
- [ ] **3.3. Chuyển đổi Footer sang SPA Router:** Phê duyệt thay toàn bộ thẻ `<a>` thành `<Link>` trong `LandingFooter.tsx` để chấm dứt reload toàn trang.
- [ ] **3.4. Bổ sung nút Back Navigation & Thoát ngõ cụt:** Phê duyệt thêm nút quay lại cho 52 màn hình con và trang `/payment/cancel`.

---

### CỔNG 4: PHÊ DUYỆT ĐỒNG BỘ CACHE & STATE (STATE & CACHE SIGN-OFF)
*Căn cứ tài liệu: Doc 21, Doc 39, Batch 05.*

- [ ] **4.1. Tự động xóa stale cache:** Phê duyệt bổ sung `queryClient.invalidateQueries()` cho toàn bộ 20 mutations React Query.
- [ ] **4.2. Khóa Idempotency thanh toán:** Phê duyệt cơ sở tạo UUID `Idempotency-Key` và khóa `disabled` nút thanh toán PayOS chống trừ tiền 2 lần.

---

### CỔNG 5: PHÊ DUYỆT CÁC QUYẾT ĐỊNH NGHIỆP VỤ & HỢP ĐỒNG API (BUSINESS DECISIONS SIGN-OFF)
*Căn cứ tài liệu: Doc 23 – 28, Doc 41, Batch 06.*

- [ ] **5.1. Quyết định về Ví Tài Xế (Driver Wallet):**
  - [ ] **Lựa chọn A (Khuyên dùng):** Duy trì ví SmartTruck trả trước song song cổng PayOS từng lần -> Yêu cầu Backend triển khai `GET /api/v1/wallets/me`.
  - [ ] **Lựa chọn B:** Bỏ hẳn ví nội bộ, chuyển 100% sang thanh toán trực tiếp qua PayOS -> Xóa bỏ màn hình `/driver/wallet`.
  - *Ý kiến chỉ đạo của Product Owner:* `[ ............................................................ ]`
- [ ] **5.2. Quyết định về Chính sách Phạt Hủy Vé Sát Giờ:**
  - [ ] Hủy trước giờ hẹn > 2 tiếng: Hoàn cọc 100%.
  - [ ] Hủy trước giờ hẹn 30 phút - 2 tiếng: Hoàn cọc 70% (phạt 30%).
  - [ ] Hủy sát giờ < 30 phút hoặc không đến: Phạt 100% tiền cọc giữ chỗ.
  - *Ý kiến chỉ đạo của Product Owner:* `[ ............................................................ ]`
- [ ] **5.3. Quyết định về Tích hợp Endpoints GAP B Sẵn Có:**
  - Đồng ý cho Frontend đấu nối Trợ lý AI mô tả bãi xe (`POST /api/v1/ai/generate-description`).
  - Đồng ý cho Frontend đấu nối Barie ALPR Check-out (`POST /api/v1/merchant/check-out`).
  - Đồng ý cho Frontend sửa URL OTP quên mật khẩu thành `/api/v1/auth/forgot-password/otp`.

---

### CỔNG 6: PHÊ DUYỆT LỘ TRÌNH 8 BATCH & CHO PHÉP MỞ KHÓA CODE (EXECUTION SIGN-OFF)
*Căn cứ tài liệu: Doc 40, Doc 42.*

- [ ] Phê duyệt kế hoạch phân bổ 8 Batch độc lập:
  - `BATCH-01`: Zero-Risk Design Tokens & Global Styles.
  - `BATCH-02`: Critical Navigation & Interactive Link Fixes.
  - `BATCH-03`: Core UI Primitives & Orphan Clean-up.
  - `BATCH-04`: Shared Compound Components & Workspace Decoupling.
  - `BATCH-05`: State Desync & React Query Cache Invalidation.
  - `BATCH-06`: High-Value Backend API Integrations.
  - `BATCH-07`: Page-by-Page Polish & Form Standardization.
  - `BATCH-08`: Full Workflow Verification & Regression Suite.
- [ ] **LỆNH CHO PHÉP TRIỂN KHAI:** Cho phép chuyển từ chế độ `PLANNING ONLY` sang chế độ `IMPLEMENTATION` bắt đầu từ **BATCH-01**.

---

### KÝ TÊN XÁC NHẬN PHÊ DUYỆT

| Đại Diện Ban Quản Trị | Họ Tên | Chữ Ký / Xác Nhận | Ngày Phê Duyệt |
| :--- | :--- | :--- | :---: |
| **Product Owner (Chủ dự án)** | ............................................................ | ............................................................ | ..... / ..... / 2026 |
| **Technical Lead / Architect** | ............................................................ | ............................................................ | ..... / ..... / 2026 |

---
> **LỆNH BẢO TOÀN HỆ THỐNG:** Hệ thống **DỪNG LẠI TẠI ĐÂY**. Không thực hiện bất kỳ sửa đổi mã nguồn nào cho đến khi nhận được chỉ đạo và phê duyệt chính thức từ Chủ dự án!
