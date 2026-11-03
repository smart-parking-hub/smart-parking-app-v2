# Component Pattern: Filters, Search & Facets

## 1. Bản chất & Vai trò thiết kế
Bộ lọc và thanh tìm kiếm là công cụ tìm kiếm mục tiêu chính của nhân viên điều vận trong kho dữ liệu khổng lồ của bãi xe (Tìm kiếm theo biển số, Lọc theo loại xe container, Lọc theo khoảng ngày đối soát).

---

## 2. Vấn đề thường gặp từ Stitch & Cách giải quyết

### Sự cố 1: Thanh lọc quá nhiều trường gây tràn hoặc rớt dòng lộn xộn
- **Giải pháp:**
  1. *Thanh lọc cơ bản (Quick Filter Bar):*
     - Ô tìm kiếm từ khóa chính (Biển số xe, Tên tài xế): Chiếm vị trí đầu tiên, có icon `Search` ở đầu input.
     - 2-3 dropdown trạng thái phổ biến nhất (Trạng thái đặt chỗ, Loại xe).
     - Nút "Bộ lọc nâng cao ▾" để mở rộng các trường ít dùng hơn.
  2. *Filter Chips (Thẻ bộ lọc đang chọn):*
     - Hiển thị các tiêu chí đã chọn bên dưới thanh lọc kèm nút `x` để xóa nhanh từng tiêu chí (ví dụ: `Xe: Container 40ft [x]`, `Khu vực: Cát Lái [x]`).
     - Có nút "Xóa tất cả bộ lọc" (`text-xs text-slate-500 hover:text-brand-orange`).

### Sự cố 2: Tìm kiếm gửi request liên tục (Search Input Thrashing)
- **Giải pháp:**
  - Bắt buộc áp dụng kỹ thuật Debounce (300ms - 500ms) trên ô nhập liệu tìm kiếm để không spam API Backend sau mỗi ký tự gõ.

---

## 3. Checklist nghiệm thu Filters
- [ ] Ô tìm kiếm có nút xóa nhanh văn bản (Clear input `x` button).
- [ ] Các trường lọc có trạng thái disabled khi bảng đang trong quá trình tải dữ liệu.
- [ ] Phản hồi số lượng kết quả tìm kiếm (ví dụ: `Tìm thấy 24 kết quả phù hợp`).
