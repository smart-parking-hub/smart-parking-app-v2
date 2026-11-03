# Evaluation Dimension 1 & 2: Visual Quality & Spacing

## 1. Tiêu chí 1: Visual Hierarchy (Phân cấp thị giác) - Thang điểm 0..4
- **Điểm 4:** Thứ bậc phân cấp hoàn hảo. Người dùng nhìn vào màn hình biết ngay đâu là tiêu đề trang, đâu là vùng nội dung chính, đâu là Primary CTA và đâu là trạng thái dữ liệu.
- **Điểm 3:** Phân cấp rõ ràng, có phân biệt độ đậm font (`font-sora`, `font-bold`), kích thước và màu sắc.
- **Điểm 2:** Có phân cấp nhưng độ tương phản chưa tối ưu, CTA chính chưa thực sự nổi bật so với các nút phụ.
- **Điểm 1:** Các thành phần tranh chấp thị giác với nhau (quá nhiều màu rực rỡ, badge dày đặc).
- **Điểm 0:** Không có thứ bậc thị giác; toàn bộ trang là một khối văn bản hoặc thành phần đồng nhất.

---

## 2. Tiêu chí 2: Spacing & Alignment Consistency (Đồng nhất khoảng cách và gióng hàng) - Thang điểm 0..4
- **Điểm 4:** Tuân thủ 100% hệ thống thang đo 4px/8px của Tailwind CSS v4. Các thẻ card cùng hàng có padding bằng nhau (`p-6` hoặc `p-8`). Trục gióng ngang và dọc thẳng hàng tuyệt đối.
- **Điểm 3:** Khoảng cách đồng đều, gióng hàng chuẩn, chỉ có 1-2 vị trí sai lệch nhỏ không ảnh hưởng bố cục.
- **Điểm 2:** Khoảng cách giữa các phần tử chưa theo chuẩn (chỗ dùng `p-3`, chỗ dùng `p-5`, chỗ dùng `p-7` tùy hứng).
- **Điểm 1:** Các nút hoặc icon bị lệch tâm (misaligned), text nhảy dòng không đều.
- **Điểm 0:** Bố cục lộn xộn, các thành phần đè lấn hoặc dính sát vào nhau.

---

## 3. Tiêu chí 3: Color & Token Consistency (Đồng nhất màu sắc & Token) - Thang điểm 0..4
- **Điểm 4:** Sử dụng 100% tokens từ `globals.css` (`brand-navy`, `brand-orange`, `brand-surface`, `slate-*`). Không có mã màu hex tùy tiện xuất hiện trong code JSX.
- **Điểm 3:** Tuân thủ token hệ thống, mã màu hợp lý.
- **Điểm 2:** Còn xuất hiện một số mã màu hex arbitrary (ví dụ: `bg-[#060D1A]`).
- **Điểm 1:** Sử dụng màu sai nhận diện thương hiệu hoặc lệch tone.
- **Điểm 0:** Màu sắc hỗn loạn, phá vỡ hoàn toàn nhận diện thương hiệu của SmartTruckHub.
