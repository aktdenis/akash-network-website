# Builds the Astro site from a PR checkout and serves the static output via nginx.
# Build stage uses Debian-based node (not alpine) so native deps like sharp work.
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Ensure all files are world-readable regardless of build-stage umask.
RUN find /usr/share/nginx/html -type d -exec chmod 755 {} \; && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \;
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
