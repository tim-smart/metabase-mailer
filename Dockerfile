FROM node:alpine AS build

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN npm i -g pnpm && pnpm i

COPY . ./

RUN pnpm build

# Runtime image
FROM node:alpine
WORKDIR /app
ENV NODE_ENV production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Add chromium
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm i -g pnpm && pnpm i -P

COPY --from=build /app/dist ./dist

CMD [ "node", "--enable-source-maps", "dist/main.js" ]
