# Core Principles: Design Intelligence & Adaptive UI Engineering

## 1. Triết lý: Preserve Intent, Improve Execution
Khi một bản thiết kế hoặc mã HTML/CSS mẫu từ Stitch được cung cấp, nó đại diện cho **ý đồ truyền đạt (Design Intent)** của Product Designer / UI Architect. Tuy nhiên, mã nguyên mẫu từ công cụ AI/Stitch thường chứa các khiếm khuyết kỹ thuật (lỗi flex-wrap, width cứng, tràn màn hình, không chuẩn hóa token).

Agent phải tuân thủ nguyên tắc:
- **Preserve Intent (Bảo toàn ý đồ):** Giữ đúng cá tính thương hiệu, bảng màu, phong cách typography, thứ bậc thị giác, cấu trúc phân cấp và 100% chức năng nghiệp vụ.
- **Improve Execution (Cải thiện thực thi):** Sửa lỗi layout, thích nghi đa kích thước màn hình (responsive), cải thiện khả năng tiếp cận (a11y), nâng cao tính sử dụng (usability), và chuyển đổi thành code React + Tailwind CSS v4 sạch sẽ, đạt chuẩn công nghiệp.

---

## 2. Bốn tầng trách nhiệm (The 4 Layers of Evaluation)

Agent không chỉ nhìn lướt qua màu sắc mà phải đánh giá sản phẩm qua 4 tầng cấu trúc:

```
┌──────────────────────────────────────────────────────────┐
│ 1. Business & RBAC Integrity Layer (Tầng Nghiệp vụ/Bảo mật) │
├──────────────────────────────────────────────────────────┤
│ 2. Usability & Accessibility Layer (Tầng Trải nghiệm)    │
├──────────────────────────────────────────────────────────┤
│ 3. Layout & Responsive Adaptability Layer (Tầng Bố cục)   │
├──────────────────────────────────────────────────────────┤
│ 4. Visual Fidelity & Styling Layer (Tầng Thị giác/Mã)    │
└──────────────────────────────────────────────────────────┘
```

### Tầng 1: Business & RBAC Integrity Layer (Bảo toàn nghiệp vụ và phân quyền)
- Không bao giờ được phép xóa, ẩn hoặc thay đổi hành vi của một nút, form, trường dữ liệu chỉ vì "để giao diện trông gọn hơn".
- Phải đối chiếu với mã nguồn Backend và Legacy screens: Ai có quyền xem? Ai có quyền bấm? Điều kiện validation là gì?
- Nếu thiết kế Stitch thiếu nút thao tác bắt buộc trong nghiệp vụ, Agent phải đối chiếu và bổ sung hoặc báo cáo.

### Tầng 2: Usability & Accessibility Layer (Khả năng sử dụng và tiếp cận)
- Đảm bảo tương tác bàn phím (Tab navigation, Focus rings, Escape key to close dialogs).
- Đảm bảo độ tương phản màu (WCAG AA: tối thiểu 4.5:1 cho body text, 3:1 cho UI components/large text).
- Đảm bảo kích thước vùng bấm (Tap target $\ge$ 44x44px trên mobile/tablet).
- Nhãn ngữ nghĩa và trạng thái: `aria-label`, `aria-expanded`, `aria-hidden="true"` cho icon trang trí.

### Tầng 3: Layout & Responsive Adaptability Layer (Bố cục và thích nghi đa màn hình)
- Giao diện phải vận hành hoàn hảo trên các dải màn hình:
  - Mobile (< 640px)
  - Tablet (640px - 1024px)
  - Desktop tiêu chuẩn (1024px - 1440px)
  - Large display (> 1440px)
- Tránh mọi hiện tượng vỡ layout (layout breaks), tràn ngang (horizontal scroll ngoài ý muốn), kẹt chữ (text truncation sai vị trí).

### Tầng 4: Visual Fidelity & Styling Layer (Độ trung thực thị giác & Cú pháp Tailwind v4)
- Áp dụng chuẩn xác hệ thống Design Tokens của dự án (màu `brand-navy`, `brand-orange`, font `Sora`, `Inter`).
- Áp dụng nghiêm ngặt chuẩn cú pháp **Tailwind CSS v4 Canonical Utilities**:
  - Tuyệt đối không dùng arbitrary `[...]` cho các giá trị nằm trên scale chuẩn 4px (dùng `max-w-310` thay vì `max-w-[1240px]`, `w-145` thay vì `w-[580px]`).
  - Dùng đúng cú pháp v4 cho gradients (`bg-linear-to-*`, `bg-radial-*`).
  - Loại bỏ hoàn toàn các warning của `suggestCanonicalClasses`.
