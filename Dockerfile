FROM node:10.6.0-alpine

RUN mkdir -p /debugger

WORKDIR /debugger

COPY package.json ./

COPY yarn.lock ./

# install cf-runtime required binaries
RUN apk update && apk upgrade && apk add --no-cache --virtual deps git python make g++ bash mc

RUN yarn install --frozen-lockfile --production && yarn cache clean

RUN rm -rf /tmp/*

RUN ln -s /codefresh/volume/cf_export /bin/cf_export

# copy app files
COPY . ./

EXPOSE 80

ENTRYPOINT []

# run application
CMD ["node", "/debugger/src/app.js"]
