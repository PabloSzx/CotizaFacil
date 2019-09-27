FROM node:12-alpine

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . ./

RUN yarn build

ENV NODE_ENV=production

CMD ["yarn", "start"]