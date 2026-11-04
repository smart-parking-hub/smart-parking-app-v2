# Đồng bộ main — 2026-11-04

Nhánh làm việc: `updateFE_v2-100page`. Commit ban đầu: `f8dd6a0`. Nguồn cập nhật: `origin/main` tại `fd15eae` (PR #21, cấu hình sức chứa Merchant). Working tree sạch trước khi merge; nhánh remote của feature trùng HEAD.

Merge giữ lịch sử đã push, không rebase hoặc force push. Bốn file conflict được đối chiếu và giải quyết:

- Router: giữ Auth, Admin, Driver/OpenStreetMap và các màn operations đã có; dùng các màn SCR-030/031/032 mới từ main với param `parkingLotId`. Giữ màn pricing dùng `id`. Bỏ route trùng chi tiết/edit/slots và `/contact`; giữ alias liên hệ `/company/contact`, `/lien-he`, `/ho-tro`. Tiếp tục lazy-load màn mới, không làm mất guard vai trò.
- ContactPage: dùng trang liên hệ có đủ các section và kiểm thử mới từ main.
- merchantDashboardApi: giữ kiểu Booking đã có trên feature để bỏ `any`, không thay đổi xử lý nghiệp vụ.
- LegalInfoFormCard: dùng `ProfileFormData` được main xuất từ types thay cho khai báo cục bộ cùng cấu trúc; giữ props React Hook Form có kiểu.

Các file DriverHeader, parking-search và globals.css của feature không bị thay đổi bởi merge. Các file API, component, test và tài liệu bổ sung của main được tiếp nhận. Không xóa các màn preview cũ hoặc tự chuyển các bản nháp preview thành màn production mới.

Thêm 5 kiểm thử route: truyền đúng ID cho chi tiết/edit/slots; giữ ID ở pricing; không có các route cùng hình dạng che khuất nhau. Kết quả cuối: **24 file kiểm thử, 183/183 test pass**; TypeScript/Vite build pass; lint 0 lỗi/0 cảnh báo. Các màn mới được tách chunk, không còn cảnh báo import vừa tĩnh vừa động hoặc chunk vượt ngưỡng. Loại bỏ các dòng trắng thừa cuối ba file tiếp nhận từ main để kiểm tra diff sạch.

Đã fetch kiểm tra lại remote sau thời gian tạm ngắt: `origin/main` vẫn là `fd15eae`, remote feature vẫn khớp commit trước merge. Không thực hiện push trong tác vụ pull/resolve conflict.
