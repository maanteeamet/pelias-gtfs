FROM       node:10-alpine

RUN apk add --update --no-cache \
  curl

RUN apk add --update --no-cache --virtual build-dependencies \
  build-base \
  git \
  python

WORKDIR /app

COPY ./package.json ./package.json

RUN npm install

COPY ./ ./

RUN mkdir ./gtfs

RUN chown 1000:1000 -R ./

RUN apk del build-dependencies

CMD "./import.sh"
