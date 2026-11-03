# Design Issue Classification Matrix (Type A / B / C / D)

Mọi hiện tượng bất thường khi quan sát Stitch HTML/CSS hoặc UI triển khai phải được phân loại chính xác theo 4 nhóm sau:

| Nhãn | Tên nhóm | Định nghĩa bản chất | Ví dụ thực tế | Hành động của Agent |
| :--- | :--- | :--- | :--- | :--- |
| **TYPE A** | **Implementation Artifact** *(Lỗi triển khai kỹ thuật)* | Ý đồ thiết kế hoàn toàn đúng đắn, nhưng người tạo mẫu (hoặc công cụ AI Stitch) sử dụng CSS chưa chuẩn, thiếu thuộc tính, flexbox sai, hoặc width cứng gây vỡ layout. | • Header bị rớt dòng tại 1366px do `gap` quá rộng.<br/>• Dùng `w-[100px]` thay vì `w-full`.<br/>• Thiếu `overflow-x-auto` trong bảng dữ liệu.<br/>• Dùng cú pháp Tailwind non-canonical (`max-w-[1240px]` thay vì `max-w-310`). | **Tự động sửa (Level 1 Autonomous)**. Tinh chỉnh CSS/Tailwind để giao diện hiển thị đúng ý đồ thiết kế ban đầu. |
| **TYPE B** | **Intentional Design Choice** *(Chủ ý thiết kế)* | Một lựa chọn trực quan thoạt nhìn có vẻ lạ hoặc bất đối xứng, nhưng là chủ ý có chủ đích của Product Designer nhằm tạo điểm nhấn thị giác hoặc phân cấp trải nghiệm. | • Thẻ hero stat có kích thước gấp đôi các thẻ khác trong Bento grid.<br/>• Một nút "Khẩn cấp" có màu cam nổi bật trong khi các nút khác màu xám.<br/>• Menu phụ được chủ đích gom vào hàng thứ hai. | **Bảo toàn thiết kế (Preserve Intent)**. Giữ nguyên cấu trúc, không tự ý "chuẩn hóa" làm mất đi tính độc đáo của thiết kế. |
| **TYPE C** | **Design Defect** *(Lỗi thiết kế thực sự)* | Thiết kế mắc sai lầm thực sự về mặt Usability, Accessibility, Thứ bậc thông tin hoặc Khả năng hiển thị dữ liệu thực tế. | • Nút CTA quan trọng bị che khuất hoặc quá mờ nhạt.<br/>• Form có 30 trường nhưng nhồi nhét trên một trang không phân nhóm.<br/>• Tương phản chữ xám trên nền xám gây khó đọc (vi phạm WCAG).<br/>• Modal dài vượt màn hình không thể bấm nút Lưu. | **Đánh giá mức độ:**<br/>• *Lỗi nhỏ (Minor):* Tự sửa an toàn (Level 1).<br/>• *Lỗi lớn (Major):* Đề xuất phương án, áp dụng quy tắc **Continue Safe** (cô lập phần cần duyệt, làm tiếp phần an toàn) và báo cáo xin duyệt (Level 2). |
| **TYPE D** | **Unknown / Ambiguous** *(Thông tin chưa rõ)* | Không đủ bằng chứng để xác định đây là chủ ý thiết kế, lỗi triển khai, hay do thiếu dữ liệu từ phía Stitch. | • Một trường "Mã số thuế" xuất hiện trong database nhưng không thấy trên mockup Stitch.<br/>• Không rõ một bảng dữ liệu có cần thanh tìm kiếm và lọc trạng thái hay không. | **Không tự suy diễn**. Gắn nhãn `[TYPE_D_UNKNOWN]`, giữ an toàn logic nghiệp vụ hiện có và đưa vào bảng câu hỏi cần làm rõ. |

---

## Nguyên tắc phân loại nghiêm ngặt:
1. **Lỗi hiển thị $\neq$ Lỗi thiết kế:** Một thẻ div bị tràn không có nghĩa là Designer thiết kế sai. Đó thường là **Type A (Lỗi triển khai)**. Hãy sửa CSS trước khi kết luận thiết kế có vấn đề.
2. **Không biến Type B thành Type C:** Không được vì sở thích cá nhân ("tôi thích mọi thẻ phải bằng nhau chằn chặn") mà phá vỡ bố cục Bento grid phá cách có chủ ý của Designer.
3. **Tuyệt đối thận trọng với Type D:** Không được tự ý xóa bỏ các trường nghiệp vụ chỉ vì trên Stitch không vẽ ra.
