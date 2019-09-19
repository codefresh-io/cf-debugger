FROM node:10-alpine

COPY package.json ./

COPY yarn.lock ./

# install cf-runtime required binaries
RUN apk update && apk upgrade && apk add --no-cache --virtual deps git python make g++ bash

RUN yarn install --frozen-lockfile --production && yarn cache clean

RUN rm -rf /tmp/*

RUN ln -s /codefresh/volume/cf_export /bin/cf_export

# copy app files
COPY . ./

EXPOSE 80

# run application
CMD ["node", "src/app.js"]
