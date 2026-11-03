# Evaluation Dimension 3 & 4: Layout Integrity & Responsive Adaptability

## 1. Tiêu chí 4: Layout Integrity (Tính toàn vẹn bố cục) - Thang điểm 0..4
- **Điểm 4:** Bố cục vững chắc (Solid Structure). Sử dụng container chuẩn `max-w-310` (1240px), flex/grid phân bổ khoa học, tỷ lệ chia cột cân đối (7-5 hoặc 8-4 hoặc 3-cột đều), không bao giờ bị overflow ngoài ý muốn.
- **Điểm 3:** Bố cục tốt, cân xứng, đáp ứng đầy đủ nội dung.
- **Điểm 2:** Có hiện tượng co cụm nội dung ở các kích thước màn hình trung gian (ví dụ 1200px - 1366px).
- **Điểm 1:** Bố cục bị mất cân đối nặng, khoảng trống thừa quá lớn hoặc nội dung bị chèn ép.
- **Điểm 0:** Bố cục vỡ, các thẻ tràn ra ngoài màn hình hoặc đè chồng lên nhau.

---

## 2. Tiêu chí 5: Responsive Adaptability (Khả năng thích ứng đa màn hình) - Thang điểm 0..4
- **Điểm 4:** Thích nghi mượt mà trên toàn bộ các dải màn hình:
  - **Desktop 1920px & 1440px:** Tận dụng không gian cân đối, nội dung tập trung trong `max-w-310 mx-auto`.
  - **Laptop 1280px & 1366px:** Header, grid không bị rớt dòng ngoài ý muốn.
  - **Tablet 768px - 1024px:** Tự động co cột từ 4 cột sang 2 cột, bảng có thanh cuộn ngang mượt mà.
  - **Mobile 375px - 640px:** Các cột chuyển thành 1 cột dọc, nút bấm full-width dễ chạm, không có horizontal scrollbar ở cấp trang (`body`).
- **Điểm 3:** Responsive tốt, hiển thị rõ ràng trên mobile và desktop.
- **Điểm 2:** Một số bảng hoặc thẻ bị cắt chữ hoặc tràn nhẹ trên màn hình nhỏ.
- **Điểm 1:** Xuất hiện thanh cuộn ngang toàn trang (page-level horizontal scroll) trên mobile.
- **Điểm 0:** Hoàn toàn không hỗ trợ responsive, chỉ hiển thị đúng trên một kích thước cố định.

> 🛑 **Hard Blocker (Chặn nghiệm thu):** Bất kỳ màn hình nào làm xuất hiện thanh cuộn ngang trên mobile do lỗi CSS layout (`overflow-x` ngoài ý muốn) đều bị đánh giá không đạt, bất kể tổng điểm các phần khác cao đến đâu.
