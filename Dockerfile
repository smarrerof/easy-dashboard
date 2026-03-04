# Stage 1 — Clone and build
FROM node:alpine3.21 AS builder

ARG VERSION=main

RUN apk add --no-cache git
RUN git clone --branch $VERSION --depth 1 https://github.com/smarrerof/easy-dashboard /app

WORKDIR /app

RUN npm ci
RUN npm run build

# Stage 2 — Runtime
FROM nginx:alpine

COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/easy-dashboard/browser /usr/share/nginx/html
COPY --from=builder /app/docker/40-generate-config.sh /docker-entrypoint.d/40-generate-config.sh
RUN chmod +x /docker-entrypoint.d/40-generate-config.sh

EXPOSE 80
