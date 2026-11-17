# ADR: Chuyển đổi bản đồ Frontend v2 sang Google Maps Platform

- **Ngày:** 17/11/2026
- **Trạng thái:** Đã phê duyệt & Đang triển khai
- **Phạm vi:** `smart-parking-app-v2` (Frontend v2). Frontend legacy (`smart-parking-app`) được giữ làm tham chiếu.

## Bối cảnh

Frontend v2 trước đây dùng kết hợp Leaflet + OpenStreetMap tiles, Photon + Nominatim (autocomplete/geocoding), OSRM (routing) và một màn hình admin dùng Google Maps iframe. Việc dùng public Nominatim trong luồng autocomplete vi phạm chính sách sử dụng của OSM Foundation và gây phân mảnh trải nghiệm bản đồ.

## Quyết định kiến trúc

1. **SDK & Loader:**
   - Sử dụng `@googlemaps/js-api-loader` (v2+ functional API: `setOptions()` và `importLibrary()`) kết hợp `@types/google.maps`.
   - Singleton loader đặt tại `src/shared/maps/loader.ts`, lazy-load từng thư viện (`maps`, `marker`, `places`, `routes`) chỉ khi màn hình cần.
   - Không cài thêm wrapper React bên thứ ba để tránh xung đột lifecycle với React 19 / StrictMode và giữ bundle gọn nhẹ.

2. **Bản đồ tương tác & Viewer chỉ xem:**
   - Toàn bộ bản đồ (Tìm bãi `V2-01`, Tạo/Sửa bãi `V2-02`/`V2-03`, Chi tiết bãi Merchant `V2-04`, Admin thẩm định `V2-05`) dùng chung **Maps JavaScript API + `AdvancedMarkerElement`**.
   - DOM marker bãi đỗ được tách tại `src/entities/parking-lot/parkingGoogleMarker.ts` dùng `textContent` thuần để chống XSS.
   - Các instance SDK (`Map`, `AdvancedMarkerElement`, `Polyline`, `InfoWindow`) chỉ nằm trong `useRef` / lifecycle effect, không đưa vào Redux hay external store.

3. **Autocomplete địa điểm & Tuyến đường:**
   - Autocomplete dùng **Places API (New)** (`AutocompleteSuggestion.fetchAutocompleteSuggestions`) với `includedRegionCodes: ['vn']`, `language: 'vi'`, quản lý `AutocompleteSessionToken` theo từng phiên gõ và gọi `toPlace().fetchFields({ fields: ['location', 'formattedAddress', 'displayName'] })` sau khi người dùng chọn.
   - Tính tuyến đường dùng **Maps JavaScript Routes library** (`Route.computeRoutes`) với `travelMode: 'DRIVING'` và field mask tối thiểu `['durationMillis', 'distanceMeters', 'path']`, chỉ tính cho bãi đang được chọn.
   - Không có fallback ngầm sang OSM/Nominatim/OSRM; mọi lỗi SDK/Places/Routes đều hiển thị rõ ràng và không làm hỏng danh sách bãi đã tải từ backend.
   - Lưu ý vận hành: Google Large Vehicle Routing hiện chưa hỗ trợ Việt Nam, nên thời gian/quãng đường `DRIVING` chỉ hiển thị ở mức tham khảo.

4. **Google Maps URLs:**
   - Mọi link mở ứng dụng Google Maps bên ngoài dùng chung helper tại `src/shared/maps/urls.ts` theo chuẩn `api=1` (`search` cho xem vị trí, `dir` + `travelmode=driving` cho chỉ đường).

5. **Cấu hình môi trường & Build:**
   - Biến môi trường: `VITE_GOOGLE_MAPS_API_KEY` (browser key giới hạn HTTP referrer và API) và `VITE_GOOGLE_MAPS_MAP_ID` (fallback `DEMO_MAP_ID` ở dev nếu chưa cấu hình).
   - `Dockerfile` và `docker-compose.staging.yml` nhận build-arg `VITE_GOOGLE_MAPS_*` vì Vite nhúng `import.meta.env` ở build time.
