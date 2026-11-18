# ADR: Kiến trúc bản đồ kết hợp không phụ thuộc Google Billing

- **Ngày:** 17/11/2026
- **Trạng thái:** Đã phê duyệt & Đang triển khai (Thay thế `ADR-google-maps-migration.md`)
- **Phạm vi:** `smart-parking-app-v2` (Frontend v2). Frontend legacy (`smart-parking-app`) được giữ làm tham chiếu.

## Bối cảnh

Phương án dùng Google Maps JavaScript API, Places API (New) và Routes API yêu cầu kích hoạt Google Cloud Billing và quản lý API key/quota cho mọi môi trường. Dự án cần ứng dụng tìm bãi, hiển thị nhiều ghim, chọn tọa độ và đặt chỗ hoạt động đầy đủ **mà không cần cấu hình `VITE_GOOGLE_MAPS_API_KEY` hay `VITE_GOOGLE_MAPS_MAP_ID`**, đồng thời vẫn cho phép tài xế chỉ đường thuận tiện bằng Google Maps.

## Quyết định kiến trúc

1. **Bản đồ tương tác (Tìm bãi, Picker tạo/sửa, Viewer chi tiết):**
   - Dùng **Leaflet + OpenStreetMap tiles** qua cấu hình tập trung tại `src/shared/maps/runtimeConfig.ts`.
   - Hỗ trợ giá trị mặc định từ biến môi trường Vite khi build và ghi đè ở runtime qua file cấu hình cùng origin (`/map-config.json`, không chứa secret) để đổi tile server hoặc tắt geocoder mà không phải build lại.
   - Giữ toàn bộ cải tiến UX đã có: marker DOM an toàn (`textContent`), kéo ghim + click + vòng sai số GPS trong picker tạo/sửa bãi, phân loại lỗi API rõ ràng ở `SearchParkingPage`, không có `ERR_GEO_DISPATCH_TIMEOUT` cứng.

2. **Tìm địa điểm ngoài hệ thống (Geocoder):**
   - Dùng **Photon** (`https://photon.komoot.io/api/`, cấu hình tập trung) cho gợi ý địa điểm ngoài hệ thống: chỉ gọi khi ô đang mở, từ **3 ký tự**, debounce **500 ms**, tối đa **5 kết quả**, lọc kết quả Việt Nam, chuyển đúng `[lng, lat]` → `{ latitude, longitude }`, hủy request cũ (`AbortController`), cache ngắn trong bộ nhớ và **không retry vòng lặp khi HTTP 429**.
   - **Không khôi phục fallback public Nominatim** do chính sách OSM Foundation cấm client-side autocomplete trên public Nominatim.
   - Tìm bãi nội bộ (tiếng Việt không dấu) và GPS trình duyệt hoạt động độc lập khi Photon lỗi hoặc bị giới hạn.

3. **Chỉ đường & ETA:**
   - Dùng **Google Maps URLs (`api=1`)** tại `src/shared/maps/urls.ts` (không cần API key hay Billing).
   - Bỏ tính tuyến đường / polyline / ETA của Google Routes trong ứng dụng; thay bằng nút CTA **"Chỉ đường bằng Google Maps"** luôn khả dụng khi chọn bãi (truyền thêm `origin` khi người dùng chọn vị trí xuất phát hoặc GPS).
   - Khoảng cách backend trả về là khoảng cách Haversine theo tọa độ, không gắn nhãn là quãng đường lái xe hay định tuyến xe tải.

4. **Google Share Embed (Tùy chọn cho viewer 1 vị trí):**
   - Hỗ trợ validator tại `src/shared/maps/shareEmbed.ts` chỉ chấp nhận URL nhúng hợp lệ từ chức năng **Chia sẻ → Nhúng bản đồ** của Google Maps consumer (`/maps/embed?pb=...` trên `https://www.google.com` hoặc `https://maps.google.com`).
   - Từ chối **Maps Embed API v1** (`/maps/embed/v1/`), link rút gọn, `/maps?q=...&output=embed`, scheme không phải HTTPS và host không nằm trong allowlist.
   - Luôn cho phép người dùng chuyển sang bản đồ tương tác Leaflet và mở trực tiếp trên Google Maps.

5. **Gỡ bỏ phụ thuộc Google SDK:**
   - Gỡ `@googlemaps/js-api-loader`, `@types/google.maps`, `loader.ts`, `GoogleMapView.tsx` và bỏ hai biến `VITE_GOOGLE_MAPS_API_KEY`, `VITE_GOOGLE_MAPS_MAP_ID` khỏi môi trường build/deploy.
