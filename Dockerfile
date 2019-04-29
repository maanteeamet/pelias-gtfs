FROM       node:10-alpine

RUN apk add --update --no-cache \
  curl

RUN apk add --update --no-cache --virtual build-dependencies \
  build-base \
  git \
  python

WORKDIR /app

COPY ./ ./

RUN npm install

RUN apk del build-dependencies

CMD "./import.sh"
