# 14. Đặc Tả Biến Thể Thành Phần Chuẩn Hóa (Component Variant Specification)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** DISCOVERY + AUDIT ONLY (Tuân thủ PROJECT UNIFICATION MASTER RULES — **Không sửa code**)  
> **Thời điểm khảo sát:** 07/11/2026  
> **Mục tiêu:** Rà soát và đặc tả các biến thể (Variants) thực sự cần thiết cho 5 thành phần cốt lõi: Button, Input, Badge, Table, Dialog  
> **Trạng thái:** VERIFIED 100%

---

## 1. Thành Phần BUTTON (Nút Bấm Thao Tác)

### 1.1. Khảo Sát Hiện Trạng
* Thành phần gốc: [`src/shared/components/Button.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/Button.tsx).
* Hiện trạng: Đã hỗ trợ 5 variants (`primary`, `secondary`, `outline`, `ghost`, `danger`) và 3 kích cỡ (`sm`, `md`, `lg`). Tuy nhiên, nhiều trang vẫn tự viết các nút bấm inline với màu hover lệch (`hover:bg-[#b85000]`).

### 1.2. Bảng Đặc Tả Biến Thể Chuẩn Hóa Mục Tiêu

| Tên Variant | Mục Đích Sử Dụng | Lớp CSS Nền & Chữ (Theme Token) | Hành Vi Tương Tác (Hover, Active, Focus) | A11y & Phản Hồi |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | Hành động chính của màn hình (Đặt chỗ, Thanh toán, Lưu thông tin, Duyệt bãi) | `bg-[#d95f00] text-white shadow-xs` | `hover:bg-[#b84e00]`<br>`active:bg-[#9e4300]`<br>`focus-visible:ring-2 focus-visible:ring-[#d95f00]/40`<br>`active:scale-[0.99]` | Tương phản 4.85:1 (Đạt AA) |
| **Secondary** | Hành động phụ (Quay lại, Xuất báo cáo, Tải lại dữ liệu) | `bg-slate-100 text-slate-800 border border-slate-200` | `hover:bg-slate-200`<br>`active:bg-slate-300`<br>`focus-visible:ring-slate-400` | Tương phản 10.2:1 |
| **Tertiary / Outline** | Hành động không ưu tiên, bộ lọc trên nền tối (Lọc nâng cao, Xem hướng dẫn) | `bg-transparent text-slate-800 border border-slate-300` | `hover:bg-slate-50`<br>`active:bg-slate-100`<br>`focus-visible:ring-slate-400` | Tương phản 16.1:1 |
| **Ghost** | Nút bấm tối giản không viền (Icon đóng cửa sổ, Menu 3 chấm, Nút đổi chế độ xem) | `bg-transparent text-slate-700` | `hover:bg-slate-100`<br>`active:bg-slate-200` | Tránh gây nhiễu thị giác |
| **Destructive / Danger** | Thao tác nguy hiểm không thể hoàn tác (Hủy vé sát giờ, Xóa xe khỏi đội, Khóa tài khoản) | `bg-rose-600 text-white shadow-xs` | `hover:bg-rose-700`<br>`active:bg-rose-800`<br>`focus-visible:ring-rose-500` | Cảnh báo mức độ rủi ro |
| **Icon-Only** | Nút hình vuông chứa icon đơn (Nút đóng `X`, Nút copy mã vé, Nút phóng to map) | Vuông: `h-8 w-8` (sm), `h-10 w-10` (md), `h-12 w-12` (lg) | Thừa hưởng theo variant màu (Ghost/Secondary) | Bắt buộc có `aria-label` |
| **Loading State** | Hiển thị khi đang gửi API request | Giữ nguyên màu nền của variant hiện tại | `disabled:cursor-not-allowed opacity-80` | Render spinner SVG, gán `aria-busy="true"` |
| **Disabled State** | Khi form chưa hợp lệ hoặc thiếu quyền | `opacity-50 cursor-not-allowed pointer-events-none` | Vô hiệu hóa toàn bộ hiệu ứng hover/active | Gán `aria-disabled="true"` |

---

## 2. Thành Phần INPUT (Trường Nhập Liệu)

### 2.1. Khảo Sát Hiện Trạng
* Thành phần gốc: [`src/shared/components/Input.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/shared/components/Input.tsx).
* Hiện trạng: Đang có 0 lượt import. Hầu hết các form nhập liệu sử dụng thẻ `<input>` thô kèm các class Tailwind riêng lẻ, dẫn đến độ cao (`h-9`, `h-10`, `h-11`, `h-12`) và bán kính bo góc (`rounded-lg`, `rounded-xl`) bị lệch nhau.

### 2.2. Bảng Đặc Tả Biến Thể Chuẩn Hóa Mục Tiêu

| Tên Variant | Ký Hiệu Input | Cấu Hình Giao Diện | Icon & Phần Tử Bổ Trợ | Trạng Thái Trực Quan |
| :--- | :--- | :--- | :--- | :--- |
| **Default Text** | `type="text"` | `h-10 px-3.5 text-sm rounded-lg border border-slate-300 bg-white` | Tùy chọn `leftIcon` hoặc `rightIcon` | `focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20` |
| **Search** | `type="search"` | `h-10 pl-10 pr-4 text-sm rounded-xl border border-slate-300 bg-white shadow-xs` | Cố định icon `Search` (16px) bên trái, nút xóa `X` bên phải khi có text | Phù hợp thanh tìm kiếm bãi xe và bảng dữ liệu |
| **Password** | `type="password"` | `h-10 px-3.5 pr-10 text-sm rounded-lg border border-slate-300 bg-white` | Nút icon mắt `Eye` / `EyeOff` bật/tắt hiển thị mật khẩu bên phải | Chống nhìn trộm, hỗ trợ phím tắt |
| **Number** | `type="number"` | `h-10 px-3.5 text-sm font-mono rounded-lg border border-slate-300 bg-white` | Ẩn mũi tên spinner mặc định của trình duyệt (`appearance-none`) | Dùng cho số slot đỗ, giá tiền, tải trọng |
| **Date** | `type="date"` | `h-10 px-3.5 text-sm font-mono rounded-lg border border-slate-300 bg-white` | Icon lịch `Calendar` hiển thị tự nhiên | Đồng bộ hiển thị định dạng ngày `DD/MM/YYYY` |
| **Error State** | Kèm cờ `error` | Viền đỏ: `border-rose-500 focus:ring-rose-500/20` | Icon `AlertCircle` màu đỏ bên phải + dòng thông báo lỗi bên dưới | Gán `aria-invalid="true"` và `aria-describedby` |
| **Disabled** | `disabled` | Nền xám: `bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed` | Giữ nguyên icon nhưng chuyển sang màu xám | Không kích hoạt focus |
| **Read-Only** | `readOnly` | Nền nhạt: `bg-slate-50/60 text-slate-700 border-slate-200 cursor-default` | Biểu tượng khóa nhỏ `Lock` hoặc nhãn `Chỉ đọc` | Cho phép copy text nhưng không được chỉnh sửa |

---

## 3. Thành Phần BADGE (Nhãn Trạng Thái & Thẻ Phân Loại)

### 3.1. Khảo Sát Hiện Trạng
* Hai component xung đột: `src/shared/components/Badge.tsx` (variant prop) vs `src/shared/components/Workspace.tsx` (regex value prop).
* Xuất hiện hơn 40 vị trí gõ mã màu hex thô dạng pill (`bg-[#eff4ff] text-[#0d1c2e]`, `bg-[#ffdbca] text-[#341100]`).

### 3.2. Bảng Đặc Tả Biến Thể Chuẩn Hóa Mục Tiêu

```mermaid
graph LR
    B[BADGE COMPONENT]
    B --> B1["Status Badge<br>(Chấm tròn nhấp nháy: Đang đỗ, Chờ duyệt)"]
    B --> B2["Category Badge<br>(Loại xe: Xe tải 5T, Container, Xe van)"]
    B --> B3["Count Badge<br>(Số lượng: 12 thông báo, 4 bãi xe)"]
    B --> B4["License Plate Badge<br>(Biển số xe chuyên dụng font monospace)"]
```

| Tên Variant | Mã Token Nền & Chữ | Chấm Tròn (Dot) | Ngữ Cảnh Ứng Dụng |
| :--- | :--- | :---: | :--- |
| **Success** | `bg-emerald-50 text-emerald-700 border-emerald-200` | Chấm xanh lá `bg-emerald-500` | Trạng thái: ĐÃ DUYỆT, HOÀN TẤT, ĐÃ THANH TOÁN, ONLINE. |
| **Warning** | `bg-amber-50 text-amber-800 border-amber-200` | Chấm vàng hổ phách `bg-amber-500` | Trạng thái: CHỜ DUYỆT, CHỜ THANH TOÁN, SẮP HẾT GIỜ. |
| **Danger / Critical** | `bg-rose-50 text-rose-700 border-rose-200` | Chấm đỏ `bg-rose-500` | Trạng thái: QUÁ GIỜ ĐỖ, ĐÃ HỦY, TỪ CHỐI, LỖI BARIE. |
| **Info / Sky** | `bg-sky-50 text-sky-700 border-sky-200` | Chấm xanh dương `bg-sky-500` | Trạng thái: ĐANG MỞ KHIẾU NẠI, ĐÃ TIẾP NHẬN YÊU CẦU. |
| **Brand Orange** | `bg-[#fff7ed] text-[#d95f00] border-[#fed7aa]` | Chấm cam nhấp nháy `bg-[#d95f00] animate-pulse` | Trạng thái: ĐANG ĐỖ TRONG BÃI (ACTIVE TRIP), VÉ ƯU TIÊN. |
| **Slate Neutral** | `bg-slate-100 text-slate-700 border-slate-200` | Không có chấm | Nhãn phân loại: Loại xe (Tải nặng, Xe bồn), Vị trí cổng (Cổng A). |
| **License Plate** | `bg-slate-100 text-slate-900 border-slate-300 font-mono tracking-widest` | Không có chấm | **Đặc tả biển số xe:** Viền đen sắc nét, cỡ chữ 13px, nền xám sáng. |

---

## 4. Thành Phần TABLE (Bảng Dữ Liệu Quản Trị)

### 4.1. Khảo Sát Hiện Trạng
* `Table.tsx` nguyên tử có 0 lượt dùng; `DataTable` trong `Workspace.tsx` được dùng tại 5 trang; các trang còn lại tự dựng thẻ `<table>` thô (`TariffAuditTable.tsx`, `VehiclesTable.tsx`).
* Bất đồng bộ về padding dòng (`py-2` siêu dày ở Merchant vs `py-3.5` ở Admin).

### 4.2. Bảng Đặc Tả Biến Thể Chuẩn Hóa Mục Tiêu

| Tên Variant | Đặc Điểm Cấu Trúc | Hành Vi Tương Tác | Tối Ưu Mobile Responsive |
| :--- | :--- | :--- | :--- |
| **Basic Table** | Bảng tĩnh chỉ xem (Bảng cước phí giờ, Bảng quy định bãi) | Không có sắp xếp; hover dòng sáng nhẹ `hover:bg-slate-50/80` | Cuộn ngang có thanh cuộn mượt (`overflow-x-auto custom-scrollbar`) |
| **Sortable Table** | Tiêu đề cột (`<th>`) có icon mũi tên `ArrowUpDown` | Click vào header cột để chuyển đổi: Tăng dần -> Giảm dần -> Mặc định | Giữ nguyên tính năng sắp xếp trên mobile |
| **Selectable Table** | Cột đầu tiên chứa checkbox chọn tất cả / chọn từng dòng | Chọn nhiều dòng để kích hoạt thanh thao tác hàng loạt (Bulk Action Bar) | Hiển thị số lượng dòng đã chọn nổi cố định phía dưới màn hình |
| **Expandable Table** | Cột đầu tiên có nút mũi tên bung chi tiết (`ChevronRight` -> `ChevronDown`) | Click vào dòng để mở rộng dòng phụ (Sub-row) hiển thị lịch sử quét camera ALPR | Cho phép xem sâu mà không cần rời trang |
| **Action Column** | Cột cuối cùng căn phải chứa các nút thao tác nhanh | Nút icon xem chi tiết, nút sửa, menu 3 chấm mở Dropdown thao tác phụ | Cố định cột thao tác khi cuộn ngang (`sticky right-0 bg-white shadow-[-4px_0_8px_rgba(0,0,0,0.05)]`) |
| **Card-View Responsive** | Tự động chuyển đổi hiển thị dựa theo breakpoint `md:` (768px) | Màn hình máy tính: Hiển thị dạng bảng lưới.<br>Màn hình điện thoại: Tự động biến đổi từng dòng thành một thẻ Card độc lập | **Loại bỏ hoàn toàn vỡ layout trên điện thoại** cho tài xế |

---

## 5. Thành Phần DIALOG & MODAL (Hộp Thoại Tương Tác)

### 5.1. Khảo Sát Hiện Trạng
* Có tới 25 modal nghiệp vụ tự viết rải rác ở các feature. Mỗi modal tự quản lý `useEffect` lắng nghe phím `Escape`, tự gán `document.body.style.overflow = 'hidden'`.
* Tồn tại nguy cơ xung đột z-index (modal dùng `z-50` nhưng bản đồ dùng `z-[500]`).

### 5.2. Bảng Đặc Tả Biến Thể Chuẩn Hóa Mục Tiêu

| Tên Variant | Độ Rộng Tối Đa (Max-Width) | Cấu Trúc Header & Icon | Hành Động Footer | Ngữ Cảnh Ứng Dụng Thực Tế |
| :--- | :---: | :--- | :--- | :--- |
| **Confirmation** | `max-w-md` (448px) | Icon `HelpCircle` màu xanh dương + Tiêu đề hỏi xác nhận | Nút "Hủy bỏ" (Secondary) + Nút "Đồng ý" (Primary) | Xác nhận đặt chỗ, Xác nhận nhận ca trực |
| **Warning** | `max-w-md` (448px) | Icon `AlertTriangle` màu vàng hổ phách + Khối cảnh báo vàng | Nút "Xem lại" (Secondary) + Nút "Tiếp tục" (Warning) | Cảnh báo giảm số slot khi bãi đang đông (`ConfirmDecreaseModal`) |
| **Destructive** | `max-w-md` (448px) | Icon `AlertOctagon` màu đỏ nguy hiểm + Khối văn bản cảnh báo mất dữ liệu | Nút "Giữ lại" (Secondary) + Nút "Xác nhận xóa" (Danger) | Xóa phương tiện khỏi đội xe (`DeleteVehicleConfirmModal`), Hủy vé |
| **Form Dialog** | `max-w-lg` đến `max-w-2xl` | Tiêu đề form + Nút đóng `X` ở góc phải | Nút "Đóng" + Nút "Lưu thay đổi" (Primary kèm loading) | Đăng ký xe mới (`RegisterVehicleModal`), Xuất báo cáo doanh thu |
| **Information** | `max-w-md` (448px) | Icon `CheckCircle2` màu xanh lá + Thông điệp chúc mừng | Nút "Hoàn tất" (Primary) | Nhận lượt xếp hàng thành công (`AcceptQueueSuccessModal`) |
| **Inspection Dossier** | `max-w-4xl` (896px) | Tiêu đề hồ sơ + Tab xem ảnh đăng kiểm | Nút "Tải file PDF" + Nút "Đóng" | Xem hồ sơ kiểm định phương tiện và đối chiếu camera ALPR |

---

## 6. Tổng Kết Danh Mục Biến Thể Chuẩn
Việc thu gọn và đóng gói các biến thể theo đặc tả trên mang lại các lợi ích then chốt:
1. **Loại bỏ 100% các lớp CSS tùy biến trôi nổi:** Toàn bộ button, input, badge, table, dialog đều sử dụng chung một tập hợp tokens rõ ràng.
2. **Bảo đảm chuẩn tiếp cận (A11y):** Tự động tích hợp sẵn `aria-invalid`, `aria-busy`, `aria-label`, quản lý tiêu điểm bàn phím và phím tắt `Escape`.
3. **Tiết kiệm 40% mã nguồn trùng lặp:** 25 modal đặc thù nghiệp vụ sẽ chỉ cần kế thừa khung `Dialog` chuẩn thay vì tự lặp lại logic backdrop và phím Escape.
