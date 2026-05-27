# Builds the Astro site from a PR checkout and serves the static output via nginx.
# Build stage uses Debian-based node (not alpine) so native deps like sharp work.
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
