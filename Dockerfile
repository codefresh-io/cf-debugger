FROM node:12-alpine

#WORKDIR /root/cf-runtime

#RUN apk add --no-cache bash git openssh-client

COPY package.json ./

COPY yarn.lock ./

# install cf-runtime required binaries
RUN apk update && apk upgrade && apk add --no-cache --virtual deps git python make g++ bash && \
    yarn install --frozen-lockfile --production && \
    yarn cache clean && \
    apk del deps && \
    rm -rf /tmp/*

# copy app files
COPY . ./

EXPOSE 80

# run application
CMD ["node", "src/app.js"]
