FROM node:alpine AS build

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN yarn install --production=false

COPY . ./

RUN yarn build

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


COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

CMD [ "yarn", "start" ]
