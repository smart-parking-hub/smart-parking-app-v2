/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_APP_ENV?: string
  readonly VITE_MAP_DEFAULT_BASEMAP?: string
  readonly VITE_MAP_STYLE_URL?: string
  readonly VITE_MAP_PHOTON_URL?: string
  readonly VITE_MAP_GEOCODER_ENABLED?: string
  readonly VITE_MAP_OSRM_URL?: string
  readonly VITE_MAP_ROUTING_ENABLED?: string
  readonly VITE_APP_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'browser-image-compression' {
  export default function imageCompression(
    image: Blob | File,
    options?: any,
  ): Promise<Blob>
}
