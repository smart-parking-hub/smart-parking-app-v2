# ==============================================================================
# STAGE 1: Build Frontend Production Artifacts
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for optimal Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy entire frontend source code
COPY . .

# Vite injects VITE_* defaults at build time (map endpoints can also be overridden via /map-config.json)
ARG VITE_API_BASE_URL=/api
ARG VITE_APP_ENV=production
ARG VITE_MAP_DEFAULT_BASEMAP=google-roadmap
ARG VITE_MAP_STYLE_URL=https://tiles.openfreemap.org/styles/liberty
ARG VITE_MAP_PHOTON_URL=https://photon.komoot.io/api/
ARG VITE_MAP_GEOCODER_ENABLED=true
ARG VITE_MAP_OSRM_URL=https://router.project-osrm.org
ARG VITE_MAP_ROUTING_ENABLED=true
ARG VITE_APP_KEY=

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_APP_ENV=$VITE_APP_ENV \
    VITE_MAP_DEFAULT_BASEMAP=$VITE_MAP_DEFAULT_BASEMAP \
    VITE_MAP_STYLE_URL=$VITE_MAP_STYLE_URL \
    VITE_MAP_PHOTON_URL=$VITE_MAP_PHOTON_URL \
    VITE_MAP_GEOCODER_ENABLED=$VITE_MAP_GEOCODER_ENABLED \
    VITE_MAP_OSRM_URL=$VITE_MAP_OSRM_URL \
    VITE_MAP_ROUTING_ENABLED=$VITE_MAP_ROUTING_ENABLED \
    VITE_APP_KEY=$VITE_APP_KEY

# Run production build via Vite + TypeScript compiler
RUN npm run build

# ==============================================================================
# STAGE 2: Minimal Production Nginx Image (< 40MB Image Size)
# ==============================================================================
FROM nginx:1.27-alpine-slim

# Remove default nginx boilerplate files
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy optimized SPA & Caching Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Healthcheck to verify Nginx web server is responsive
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
