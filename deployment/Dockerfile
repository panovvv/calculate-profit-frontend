# syntax=docker/dockerfile:1
# Container image for the Calculate Profit frontend. Build from the repo root:
#   docker build -f deployment/Dockerfile -t calculate-profit-frontend:local .

# ---- Build stage: produce the static Angular bundle ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime stage: serve the bundle with nginx (SPA fallback + /api proxy) ----
FROM nginx:1.27-alpine AS runtime
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/calculate-profit-frontend/browser /usr/share/nginx/html
EXPOSE 80
