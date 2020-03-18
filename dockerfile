FROM node:12-alpine

RUN apk add --no-cache  chromium --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main

ENV CHROME_BIN="/usr/bin/chromium-browser"

RUN set -x \
    && apk update \
    && apk upgrade \
    && echo "127.0.0.1 localhost" >> /etc/hosts \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" > /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
    # add the packages
    ## g++: used to install NodeJS related packages
    ## chromium: used to run Puppeteer
    && apk add --no-cache g++ chromium 


COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . ./

RUN yarn build

ENV NODE_ENV=production

CMD ["yarn", "start"]