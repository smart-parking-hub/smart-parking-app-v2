# Driver UI — bố cục thoáng và OpenStreetMap

Ngày: 2026-11-04. Yêu cầu: sửa ba ảnh người dùng gửi (xác nhận đăng ký, header Driver, trang tìm bãi), áp dụng skill `frontend-design`. Người dùng xác nhận dịch vụ bản đồ là **OpenStreetMap**. Không tìm thấy nguồn FE cũ ở các vị trí khảo sát; không suy đoán khóa Mapbox hoặc cấu hình riêng. Nguồn đối chiếu bản đồ cũ: tài liệu project architecture ghi Leaflet/OSM và OSRM.

## Thiết kế và phạm vi

- Hướng industrial/utilitarian: điểm đỗ, điều phối và trạng thái rõ ràng; navy/cam giữ nhận diện. DFII 14 = tác động 4 + phù hợp 5 + khả thi 5 + hiệu năng 4 − rủi ro nhất quán 4.
- Be Vietnam Pro cho tiêu đề, Source Sans 3 cho nội dung. Giữ tên token `font-sora`/`font-inter` để tương thích code cũ nhưng đổi họ font và Google Fonts stylesheet ở gốc; vì vậy font mới cũng áp dụng các màn hình khác đang dùng hai token này.
- Header và trang tìm bãi rộng tối đa 1800px; padding linh hoạt 20–56px. Header 92px trên màn hình lớn, 140px với menu hai hàng ở laptop, 80px ở mobile. Tên có vùng rộng riêng, số điện thoại không xuống dòng; menu tài khoản và menu mobile vẫn hoạt động.
- Xác nhận thành công: icon, tiêu đề, nội dung và hành động xếp thành các khối riêng. Nội dung không còn dính liền nút.
- Thẻ bãi tăng cỡ chữ, khoảng cách và vùng nhấn; bản đồ chiếm vùng lớn hơn. Giữ luồng mở QuickBookingDrawer có sẵn.
- Khung bãi tối màu và trạng thái bãi đang chọn là điểm nhận diện xuyên suốt, phối với các vùng đọc sáng. Chuyển động chỉ dùng cho chuyển tâm bản đồ và phản hồi thao tác.

## Bản đồ thật

- Leaflet 1.9.4 + types, không cài thêm React wrapper: cần để kéo/phóng to bản đồ, hiển thị ghim từ tọa độ thật và vẽ polyline. Không trùng thư viện UI; cleanup map/layer/observer khi unmount.
- Nền OSM: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, có attribution. Có thể cấu hình `VITE_OSM_TILE_URL` cho máy chủ XYZ OSM của tổ chức.
- Nominatim: chỉ gọi tìm địa điểm khi người dùng chủ động gửi biểu mẫu, không autocomplete mỗi phím; giới hạn VN, cache query 5 phút. Người dùng chọn kết quả để đặt điểm tìm kiếm.
- Geolocation: chỉ yêu cầu khi bấm “Vị trí của tôi”; thông báo lỗi khi bị từ chối hoặc hết thời gian. Tọa độ thật được đưa vào API tìm bãi, không thay bằng chuỗi placeholder.
- OSRM: tuyến tham khảo ô tô, GeoJSON trả về được chuyển từ lon/lat sang lat/lon trước khi vẽ. Hiển thị khoảng cách/ETA từ response; không tự tuyên bố tuyến an toàn cho xe tải.
- Bỏ hình đường và nhãn cấm tải/tĩnh không/giao thông gán cứng, marker tọa độ pixel và giá/chỗ không theo dữ liệu.
- Lỗi ảnh nền: thông báo + tải lại. Không bulk download/prefetch bản đồ.

API tìm bãi được sửa từ `/v1/parking-lots/search` sang `/api/v1/parking-lots/search`; gửi `includeFull`, `latitude`, `longitude` đúng controller. Dùng `availableCapacity`, `basePricePerHour`, `averageRating` theo DTO. Không đổi 0 chỗ thành 10 chỗ hoặc 0đ thành 40.000đ; không trả danh sách mẫu khi API lỗi/rỗng. Dữ liệu mẫu chỉ dùng trong trang xem thiết kế. Thay enum không tồn tại `MEDIUM_TRUCK` bằng `BUS_COACH` để đủ 5 loại backend hỗ trợ. Backend chưa trả ETA/tiền cọc trong response tìm kiếm, nên thẻ không tự bịa ETA và hiện ghi chú xác nhận cọc khi đặt chỗ.

## Xem trước

- `/design-preview/auth/success`: khối xác nhận mới.
- `/design-preview/driver/search`: header, bộ lọc, thẻ và bản đồ mới; dữ liệu bãi minh họa, khu vực nghiệp vụ chỉ đọc.
- Route thật `/parking`: tìm bãi qua backend, map tương tác, địa điểm và định vị hoạt động theo thao tác người dùng.

## Xác minh

- Build TypeScript/Vite và lint đã chạy thành công, không có cảnh báo build/lint. Kiểm thử cuối: **20 files, 160/160 tests pass**; typecheck pass.
- Các kiểm thử search/map provider kiểm tra: GeoJSON đúng thứ tự tọa độ, tuyến không có kết quả báo lỗi, geocoding, gửi tọa độ/enum đúng và bảo toàn giá trị 0.
- Đã xem trực quan trên Edge desktop, laptop 1366px và mobile 390px: xác nhận thành công, header và trang tìm bãi.
- **Giới hạn mạng đã quan sát:** máy kiểm tra không phân giải được hostname `tile.openstreetmap.org`; HEAD kiểm tra nhận “No such host is known”. Marker Leaflet khởi tạo được nhưng ảnh nền không tải được. Không ghi nhận tiles/geocoding/OSRM end-to-end đã chạy thành công trong mạng này; các API ngoài được kiểm thử qua mock. Không thay đổi DNS hoặc cài khóa dịch vụ khác.

Tài liệu API: [Leaflet](https://leafletjs.com/reference-2.0.0.html), [OSRM](https://project-osrm.org/docs/v5.5.1/api/), [OSM tile usage](https://operations.osmfoundation.org/policies/tiles/).
