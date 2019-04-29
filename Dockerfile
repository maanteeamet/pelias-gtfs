FROM       node:10-alpine

RUN apk add --update --no-cache \
  curl

WORKDIR /app

COPY ./ ./

RUN npm install

CMD "sh ./import.sh"