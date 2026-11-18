/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_APP_ENV?: string
  readonly VITE_MAP_STYLE_URL?: string
  readonly VITE_MAP_PHOTON_URL?: string
  readonly VITE_MAP_GEOCODER_ENABLED?: string
  readonly VITE_APP_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
