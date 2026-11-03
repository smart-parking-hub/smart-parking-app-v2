# Evaluation Dimension 5 & 6: Usability & Accessibility (A11y)

## 1. Tiêu chí 6: Interaction Clarity & Usability (Tính rõ ràng tương tác) - Thang điểm 0..4
- **Điểm 4:** Tương tác trực quan tuyệt đối. Người dùng nhận biết ngay đâu là nút bấm, link điều hướng, trường nhập liệu. Có đầy đủ trạng thái hover, active, focus, disabled rõ ràng.
- **Điểm 3:** Tương tác tốt, các nút có phản hồi khi click hoặc hover.
- **Điểm 2:** Thiếu trạng thái hover hoặc active; con trỏ chuột không đổi thành `pointer` trên các thành phần bấm được.
- **Điểm 1:** Nút bấm gây hiểu nhầm (ví dụ: nhìn giống text thường hoặc nhìn giống nhãn tĩnh).
- **Điểm 0:** Không thể thao tác hoặc thao tác gây nhầm lẫn nghiêm trọng dẫn đến mất dữ liệu.

---

## 2. Tiêu chí 7: Accessibility (Khả năng tiếp cận theo WCAG AA) - Thang điểm 0..4
- **Điểm 4:** Tuân thủ chuẩn mực tiếp cận:
  - Tất cả các icon trang trí đều có `aria-hidden="true"`.
  - Nút bấm chỉ có icon (icon-only button) đều có `aria-label` rõ nghĩa bằng tiếng Việt.
  - Các bảng dữ liệu đều có `scope="col"` cho thẻ `<th>` và `scope="row"` cho định danh hàng.
  - Hỗ trợ đầy đủ điều hướng bằng phím `Tab` với đường viền chỉ báo `focus-visible:ring-2`.
  - Độ tương phản chữ (contrast ratio) đạt chuẩn tối thiểu 4.5:1.
- **Điểm 3:** A11y tốt, đáp ứng phần lớn các tiêu chí quan trọng.
- **Điểm 2:** Thiếu một số thuộc tính ARIA cho icon hoặc bảng.
- **Điểm 1:** Độ tương phản chữ quá thấp (ví dụ: chữ xám nhạt `text-slate-300` trên nền trắng), không có focus state.
- **Điểm 0:** Hoàn toàn không thể điều hướng bằng bàn phím hoặc đọc bằng Screen Reader.

> 🛑 **Hard Blocker (Chặn nghiệm thu):** Thiếu `aria-label` trên các nút điều hướng quan trọng hoặc độ tương phản chữ không đọc được.
