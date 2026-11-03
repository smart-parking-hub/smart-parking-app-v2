# DDR-001: Icon System Migration & Tailwind v4 Canonical Scale Enforcement

- **Trạng thái:** Approved
- **Màn hình liên quan:** Landing Page (SmartTruckHub)
- **Thành phần:** Toàn bộ 8 component giao diện công khai
- **Phân loại vấn đề:** Type A (Lỗi kỹ thuật triển khai & Cảnh báo linter)
- **Mức tự chủ áp dụng:** Level 1 Autonomous
- **Ngày ghi nhận:** 2026-11-03

---

## 1. Bối cảnh & Quan sát thực tế
1. **Vấn đề Icon:** Mockup Stitch ban đầu tải icon qua Google Material Symbols web font CDN. Nếu người dùng mạng chậm hoặc offline, icon sẽ bị lỗi FOUT (hiện chữ text thay vì hình).
2. **Vấn đề Cảnh báo vàng Tailwind:** VS Code Tailwind CSS IntelliSense báo hàng loạt cảnh báo `suggestCanonicalClasses` do dùng arbitrary brackets `[...]` cho các kích thước đã có utility scale trong Tailwind v4 (ví dụ: `max-w-[1240px]`, `w-[580px]`, `bg-gradient-to-t`, `bg-[radial-gradient(...)]`).

---

## 2. Các phương án cân nhắc
- **Phương án 1:** Giữ nguyên web font CDN và arbitrary classes.  
  *Trade-off:* Để lại 16 cảnh báo vàng trong editor, tăng rủi ro FOUT và chậm tốc độ tải trang.
- **Phương án 2 (Được chọn):** 
  - Chuyển 100% sang thư viện `lucide-react` inline SVG có `aria-hidden="true"`.
  - Gỡ bỏ link Google Font trong `index.html`.
  - Chuẩn hóa toàn bộ arbitrary classes sang utility scale v4: `max-w-310`, `w-145`, `h-145`, `w-105`, `h-105`, `h-95`, `sm:h-110`, `bg-linear-to-t`, `bg-radial-[at_top]`.

---

## 3. Quyết định & Lý do
- Áp dụng triệt để Phương án 2 theo nguyên tắc *Preserve Intent, Improve Execution*.
- Vừa giữ 100% hình ảnh trực quan của thiết kế ban đầu, vừa đạt tiêu chuẩn **0 Errors, 0 Warnings** tuyệt đối.

---

## 4. Kết quả kiểm chứng
- Chạy engine `designSystem.canonicalizeCandidates` kiểm tra toàn bộ project: **Found 0 canonical candidate differences**.
- 4 cổng kỹ thuật đều đạt 100%: `typecheck` (0 lỗi), `lint` (0 lỗi, 0 cảnh báo), `test` (1/1 passed), `build` (thành công trong 7.65s).
