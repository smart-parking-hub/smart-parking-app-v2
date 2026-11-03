# Component Pattern: Enterprise Data Tables

## 1. Bản chất & Vai trò thiết kế
Bảng dữ liệu là "trái tim" của phần mềm CRM/Logistics. Nó là nơi nhân viên điều vận giám sát hàng nghìn lượt xe vào/ra bãi, đối soát hàng tỷ đồng doanh thu mỗi ngày. Bảng đòi hỏi tính chính xác, khả năng quét nhanh và thao tác hàng loạt.

---

## 2. Vấn đề thường gặp từ Stitch & Cách giải quyết

### Sự cố 1: Bảng có quá nhiều cột (10-15 cột) bị tràn ngang hoặc co rúm chữ
- **Giải pháp:**
  1. *Thanh cuộn ngang nội bộ (Internal Horizontal Scroll):*
     - Bọc bảng trong container `overflow-x-auto`.
     - Tuyệt đối không để bảng tràn gây vỡ layout toàn màn hình (`body overflow-x`).
  2. *Cột cố định (Sticky Columns):*
     - Cố định cột định danh đầu tiên (ví dụ: `Biển số xe` hoặc `Mã đặt chỗ`) ở vị trí `sticky left-0 bg-white shadow-sm`.
     - Cố định cột Thao tác cuối cùng (Nút Chi tiết, Hủy, Sửa) ở vị trí `sticky right-0 bg-white shadow-sm`.
  3. *Quy tắc gióng hàng dữ liệu (Data Alignment Rules):*
     - **Văn bản & Tên:** Gióng trái (`text-left`).
     - **Số tiền, Số lượng, Điểm số:** Bắt buộc gióng phải (`text-right`) để các chữ số hàng đơn vị thẳng hàng nhau.
     - **Trạng thái, Badge, Ngày tháng, Thao tác:** Gióng tâm (`text-center`).

### Sự cố 2: Hiển thị bảng trên Mobile (< 640px)
- **Giải pháp (Level 2 Propose & Adaptive):**
  - Khi màn hình nhỏ hơn 640px, chuyển đổi cách hiển thị từ table dạng lưới sang **danh sách thẻ (Stacked Card List)**.
  - Mỗi thẻ thể hiện: Biển số xe (to nổi bật), trạng thái (badge góc phải), số tiền và nút bấm chi tiết.

### Sự cố 3: Mất phân trang (Pagination)
- **Quy tắc Level 3 Restricted:** Nếu API trả về phân trang, tuyệt đối không được xóa phân trang để load hết dữ liệu (gây treo trình duyệt). Bắt buộc phải có thanh điều hướng phân trang (Trang trước, Trang sau, Số dòng/trang).

---

## 3. Checklist nghiệm thu Data Table
- [ ] Header dùng `<th>` có `scope="col"`, text font `font-sora text-xs uppercase text-slate-600`.
- [ ] Dòng dữ liệu có hiệu ứng hover mượt mà (`hover:bg-slate-50/80 transition-colors`).
- [ ] Số tiền định dạng chuẩn tiếng Việt (ví dụ: `80.000 đ`).
- [ ] Có đầy đủ 3 trạng thái đặc biệt: Loading Skeleton, Empty Data ("Chưa có dữ liệu bãi xe"), Error State kèm nút Thử lại.
