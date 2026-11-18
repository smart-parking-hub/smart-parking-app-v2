# ADR: Bản đồ Vector MapLibre GL JS + OpenFreeMap (0đ, Không cần Thẻ/API Key)

- **Ngày:** 18/11/2026
- **Trạng thái:** Đã phê duyệt & Đang triển khai trên nhánh `feat/maplibre-openfreemap`
- **Phạm vi:** `smart-parking-app-v2` (Frontend v2)

## Bối cảnh

Google Cloud Billing tại Việt Nam yêu cầu nạp cọc kích hoạt 800.000đ cho thẻ Debit, còn Apple MapKit JS yêu cầu Apple Developer Program 99 USD/năm. Trong khi đó dự án cần trải nghiệm bản đồ Vector WebGL 60fps hiện đại, mượt, sắc nét (tương đương Google/Apple Maps) nhưng **hoàn toàn miễn phí, không cần thẻ ngân hàng, không cần API key và không bị giới hạn quota**.

## Quyết định kiến trúc

1. **Renderer & Vector Tiles:**
   - Dùng **MapLibre GL JS** (`maplibre-gl`) kết hợp **OpenFreeMap** (`https://tiles.openfreemap.org/styles/liberty`) làm style vector mặc định.
   - Không cần API key, không cần đăng ký, không có giới hạn lượt tải bản đồ.
   - Tập trung cấu hình tại `src/shared/maps/runtimeConfig.ts` (`VITE_MAP_STYLE_URL` hoặc ghi đè runtime qua `/map-config.json`).
   - Toàn bộ chuyển đổi tọa độ sang thứ tự `[longitude, latitude]` của MapLibre/GeoJSON đi qua helper `toLngLatTuple` tại `src/shared/maps/coordinates.ts` để tránh nhầm đảo chiều lat/lng.

2. **Tìm địa điểm & Chỉ đường:**
   - Gợi ý địa điểm ngoài hệ thống dùng **Photon** (≥ 3 ký tự, debounce 500 ms, tối đa 5 kết quả VN, cache ngắn, không fallback Nominatim) kết hợp tìm bãi nội bộ và GPS trình duyệt.
   - Chỉ đường & thời gian di chuyển mở trực tiếp **Google Maps URLs (`api=1`)** miễn phí không cần key.

3. **Tất cả màn hình nghiệp vụ v2:**
   - Tìm bãi (`/parking`): `InteractiveMapCanvas` dùng MapLibre GL JS + custom DOM markers (giá/chỗ trống/hết chỗ), DOM `Popup` an toàn (`setDOMContent`), `fitBounds`, `flyTo`, và nút “Chỉ đường bằng Google Maps”.
   - Tạo/Sửa bãi Merchant (`/merchant/parking-lots/new`, `edit`): `CreateParkingLotMapPicker` dùng MapLibre GL JS hỗ trợ click đặt ghim, kéo ghim (`draggable: true`), vòng sai số GPS dạng GeoJSON Polygon và làm tròn 7 chữ số.
   - Chi tiết bãi Merchant & Admin thẩm định: dùng chung `MapLibreMapView` (kèm hỗ trợ tùy chọn Google Share embed đã validate).
