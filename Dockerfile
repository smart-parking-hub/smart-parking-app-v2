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
