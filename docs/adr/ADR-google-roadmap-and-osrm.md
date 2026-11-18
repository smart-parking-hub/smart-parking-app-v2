# ADR: Nền bản đồ Google Maps Đường phố & Định tuyến OSRM trên MapLibre GL JS

- **Ngày:** 18/11/2026
- **Trạng thái:** Đã phê duyệt & Triển khai trên nhánh `feat/map-google-tiles-osrm` (mở rộng từ `ADR-maplibre-openfreemap.md`)
- **Phạm vi:** `smart-parking-app-v2` (Dự án bảo vệ cuối môn — phi thương mại)

## Bối cảnh

Frontend v2 sử dụng MapLibre GL JS (không cần API key hay thẻ Billing). Đối với bối cảnh đồ án bảo vệ cuối môn tại Việt Nam, nhóm cần:
1. Nền bản đồ đường phố tiếng Việt quen thuộc, chi tiết tên đường/hẻm (**Google Maps Đường phố**) trên toàn bộ màn hình bản đồ v2.
2. Vẽ tuyến đường di chuyển trực tiếp ngay trên bản đồ kèm khoảng cách (km) và thời gian ước tính (phút) khi tài xế đã có vị trí hiện tại hoặc địa điểm xuất phát và bấm chọn một bãi đỗ, không cần trả phí Routes API.
3. Bảo toàn toàn bộ tính năng đã nghiệm thu (hiển thị các bãi hoạt động, lọc, đặt chỗ nhanh, GPS, kéo ghim tọa độ, Google Share embed, nút mở Google Maps Directions ngoài).

## Quyết định kiến trúc

1. **Nền bản đồ mặc định (`src/shared/maps/basemaps.ts`):**
   - Dùng MapLibre `StyleSpecification` nguồn `raster` với Google Maps street tiles tiếng Việt (`https://mt{0..3}.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}`, `attribution: '© Google Maps'`) làm mặc định (`defaultBasemap: 'google-roadmap'`) trên toàn bộ bản đồ v2:
     - Tìm bãi (`/parking` — `InteractiveMapCanvas`)
     - Tạo/Sửa bãi Merchant (`CreateParkingLotMapPicker`)
     - Xem chi tiết bãi Merchant & Admin (`MapLibreMapView`)
   - Giữ **OpenFreeMap Vector** (`styleUrl`) làm fallback 1 chạm khi lỗi tải tile hoặc chuyển đổi cấu hình qua `VITE_MAP_DEFAULT_BASEMAP=openfreemap` / `/map-config.json`.
   - Cấu hình rõ Web Worker cho `maplibre-gl@6.19.0` qua `src/shared/maps/maplibreWorker.ts` (`?url`) và `optimizeDeps.exclude: ['maplibre-gl']` trong `vite.config.ts`.

2. **Định tuyến nội bộ OSRM (`src/shared/maps/osrmRouting.ts`):**
   - Gọi `${osrmUrl}/route/v1/driving/{originLng},{originLat};{destLng},{destLat}?overview=full&geometries=geojson&steps=false` (mặc định `https://router.project-osrm.org`, có thể đổi sang OSRM self-hosted qua `VITE_MAP_OSRM_URL` hoặc `/map-config.json`).
   - Hỗ trợ `AbortController`, timeout 8s, cache bộ nhớ ngắn (5 phút, tối đa 50 tuyến) và degradation nhẹ khi lỗi — không cản trở đặt chỗ hoặc nút **Chỉ đường bằng Google Maps**.
   - Vẽ tuyến GeoJSON 2 lớp (`osrm-driving-route-casing` viền trắng + `osrm-driving-route-line` màu cam) và tự động `fitBounds` bao trọn lộ trình.

## Lưu ý vận hành

- Endpoint raster `mt*.google.com` chỉ dùng cho mục đích học thuật / bảo vệ đồ án phi thương mại. Nếu chuyển sang vận hành thương mại, chỉ cần đặt `"defaultBasemap": "openfreemap"` trong `/map-config.json` (không cần build lại) hoặc tích hợp Google Maps Platform API chính thức.
